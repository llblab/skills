#!/usr/bin/env node
/**
 * Cross-evolution JSON-first observer
 * Domains: gene registry, skill-local state, ecosystem diagnostics
 * Reads deep gene definitions from genes.json and skill-local .cross-evolution.json artifacts
 */

import { existsSync, readdirSync, readFileSync, writeFileSync } from "node:fs";
import { basename, dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const SCRIPT_DIR = dirname(fileURLToPath(import.meta.url));
const SKILL_DIR = dirname(SCRIPT_DIR);
const LOCAL_SKILLS_DIR = dirname(SKILL_DIR);
const REGISTRY_PATH = join(SKILL_DIR, "genes.json");
const STATE_FILE = ".cross-evolution.json";
const DOC_CANDIDATES = [
  "SKILL.md",
  "AGENTS.md",
  "README.md",
  "BACKLOG.md",
  "CHANGELOG.md",
  "docs/README.md",
];

function parseArgs(argv) {
  const args = {
    root: undefined,
    json: false,
    writeState: false,
    skill: undefined,
    gene: undefined,
    help: false,
  };
  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index];
    if (arg === "--json") {
      args.json = true;
      continue;
    }
    if (arg === "--write-state") {
      args.writeState = true;
      continue;
    }
    if (arg === "--root") {
      args.root = argv[++index];
      continue;
    }
    if (arg === "--skill") {
      args.skill = argv[++index];
      continue;
    }
    if (arg === "--gene") {
      args.gene = argv[++index];
      continue;
    }
    if (arg === "--help" || arg === "-h") {
      args.help = true;
      continue;
    }
    if (!arg.startsWith("-") && !args.root) {
      args.root = arg;
      continue;
    }
    throw new Error(`Unknown argument: ${arg}`);
  }
  return args;
}

function printHelp() {
  console.log(
    [
      "Cross-evolution observer",
      "",
      "Usage:",
      "  audit-cross-evolution.sh [--root <skills-dir>] [--skill <id>] [--gene <id>] [--json] [--write-state]",
      "",
      "Reads genes.json plus skill-local .cross-evolution.json artifacts.",
    ].join("\n"),
  );
}

function readJson(path, fallback = undefined) {
  if (!existsSync(path)) return fallback;
  return JSON.parse(readFileSync(path, "utf8"));
}

function hasSkillDefinitions(root) {
  if (!existsSync(root)) return false;
  return readdirSync(root, { withFileTypes: true }).some((entry) => {
    if (!entry.isDirectory()) return false;
    return existsSync(join(root, entry.name, "SKILL.md"));
  });
}

function defaultRoot() {
  const candidates = [
    process.env.SKILLS_HOME,
    join(process.env.HOME ?? "", ".agents/skills"),
    process.cwd(),
    LOCAL_SKILLS_DIR,
  ].filter(Boolean);
  for (const candidate of candidates) {
    const root = resolve(candidate);
    if (hasSkillDefinitions(root)) return root;
  }
  return LOCAL_SKILLS_DIR;
}

function listSkills(root) {
  return readdirSync(root, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((entry) => ({ id: entry.name, path: join(root, entry.name) }))
    .filter((skill) => existsSync(join(skill.path, "SKILL.md")))
    .sort((a, b) => a.id.localeCompare(b.id));
}

function readSkillState(skill) {
  return readJson(join(skill.path, STATE_FILE), {
    version: 1,
    skill: skill.id,
    declaredGenes: [],
    ignoredRecommendations: [],
    observations: [],
  });
}

function readSkillDocs(skill) {
  const parts = [];
  for (const relative of DOC_CANDIDATES) {
    const path = join(skill.path, relative);
    if (existsSync(path)) parts.push(readFileSync(path, "utf8"));
  }
  return parts.join("\n\n");
}

function detectGene(skill, gene, docs, state) {
  if (state.declaredGenes?.includes(gene.id)) return { present: true, source: "declared" };
  for (const rule of gene.detect ?? []) {
    if (rule.type !== "grep_docs") continue;
    const pattern = new RegExp(rule.args, "i");
    if (pattern.test(docs)) return { present: true, source: "detected" };
  }
  return { present: false, source: "missing" };
}

function isIgnored(state, geneId) {
  return (state.ignoredRecommendations ?? []).find((entry) => entry.gene === geneId);
}

function analyze(root, registry) {
  const skills = listSkills(root);
  const activeGenes = (registry.genes ?? []).filter((gene) => gene.lifecycle === "active");
  const profiles = skills.map((skill) => {
    const state = readSkillState(skill);
    const docs = readSkillDocs(skill);
    const geneStates = activeGenes.map((gene) => {
      const detection = detectGene(skill, gene, docs, state);
      const ignored = isIgnored(state, gene.id);
      const applicable = gene.recommend === "all" || detection.present;
      return {
        id: gene.id,
        name: gene.name,
        weight: gene.weight ?? 1,
        present: detection.present,
        source: detection.source,
        applicable,
        ignored: ignored ? ignored.reason ?? "ignored locally" : undefined,
      };
    });
    const earned = geneStates
      .filter((gene) => gene.present && gene.applicable)
      .reduce((sum, gene) => sum + gene.weight, 0);
    const possible = geneStates
      .filter((gene) => gene.applicable && !gene.ignored)
      .reduce((sum, gene) => sum + gene.weight, 0);
    const fitness = possible > 0 ? Math.floor((earned * 100) / possible) : 0;
    return {
      id: skill.id,
      path: skill.path,
      state,
      genes: geneStates,
      fitness,
      earned,
      possible,
      observations: state.observations ?? [],
    };
  });
  const coverage = activeGenes.map((gene) => {
    const carriers = profiles
      .filter((profile) => profile.genes.find((entry) => entry.id === gene.id)?.present)
      .map((profile) => profile.id);
    return {
      id: gene.id,
      name: gene.name,
      carriers,
      total: profiles.length,
      coverage: profiles.length > 0 ? Math.floor((carriers.length * 100) / profiles.length) : 0,
      meaning: gene.meaning,
      failureMode: gene.failureMode,
    };
  });
  return { root, registryVersion: registry.version, coverage, profiles };
}

function writeSkillState(profile) {
  const path = join(profile.path, STATE_FILE);
  const current = readJson(path, undefined);
  const next = {
    version: 1,
    skill: profile.id,
    declaredGenes: current?.declaredGenes ?? [],
    ignoredRecommendations: current?.ignoredRecommendations ?? [],
    observations: current?.observations ?? [],
    lastObserved: new Date().toISOString(),
  };
  writeFileSync(path, `${JSON.stringify(next, null, 2)}\n`);
}

function wrapText(text, width) {
  const words = String(text).split(/\s+/).filter(Boolean);
  const lines = [];
  let current = "";
  for (const word of words) {
    const next = current ? `${current} ${word}` : word;
    if (next.length > width && current) {
      lines.push(current);
      current = word;
    } else {
      current = next;
    }
  }
  if (current) lines.push(current);
  return lines.length > 0 ? lines : [""];
}

function printWrapped(label, text, indent = "    ", width = 68) {
  const lines = wrapText(text, width);
  console.log(`${indent}${label}: ${lines[0]}`);
  for (const line of lines.slice(1)) console.log(`${indent}  ${line}`);
}

function printList(label, items) {
  if (items.length === 0) {
    console.log(`    ${label}: none`);
    return;
  }
  console.log(`    ${label}:`);
  for (const item of items) {
    const lines = wrapText(item, 66);
    console.log(`      - ${lines[0]}`);
    for (const line of lines.slice(1)) console.log(`        ${line}`);
  }
}

function selectGeneStates(profile, filters) {
  if (!filters.gene) return profile.genes;
  return profile.genes.filter((gene) => gene.id === filters.gene);
}

function printGeneCoverage(report, filters) {
  if (filters.skill && !filters.gene) return;
  const coverage = filters.gene
    ? report.coverage.filter((gene) => gene.id === filters.gene)
    : report.coverage;
  console.log("Gene Coverage:");
  console.log("");
  for (const gene of coverage) {
    console.log(`  ${gene.id}  ${gene.carriers.length}/${gene.total}  ${gene.coverage}%`);
    printWrapped("meaning", gene.meaning);
    printWrapped("absent", gene.failureMode);
    printList("carriers", gene.carriers);
  }
  console.log("");
}

function printSkillProfiles(report, filters) {
  const profiles = filters.skill
    ? report.profiles.filter((profile) => profile.id === filters.skill)
    : report.profiles;
  console.log("Skill Profiles:");
  console.log("");
  for (const profile of profiles) {
    const genes = selectGeneStates(profile, filters);
    const present = genes
      .filter((gene) => gene.present)
      .map((gene) => `${gene.id} (${gene.source})`);
    const missing = genes
      .filter((gene) => gene.applicable && !gene.present && !gene.ignored)
      .map((gene) => gene.id);
    const ignored = genes
      .filter((gene) => gene.ignored)
      .map((gene) => `${gene.id}: ${gene.ignored}`);
    console.log(`  ${profile.id}  ${profile.fitness}% (${profile.earned}/${profile.possible})`);
    printList("present", present);
    printList("missing", missing);
    printList("ignored", ignored);
  }
}

function printReviewQueue(report, filters) {
  if (filters.skill || filters.gene) return;
  const items = report.profiles.flatMap((profile) =>
    profile.genes
      .filter((gene) => gene.applicable && !gene.present && !gene.ignored)
      .map((gene) => ({
        skill: profile.id,
        gene: gene.id,
        weight: gene.weight,
        fitness: profile.fitness,
      })),
  );
  items.sort((a, b) => b.weight - a.weight || a.fitness - b.fitness || a.skill.localeCompare(b.skill));
  console.log("");
  console.log("Review Queue:");
  console.log("");
  if (items.length === 0) {
    console.log("  No unignored missing active genes.");
    return;
  }
  for (const item of items) {
    console.log(`  - ${item.skill}: ${item.gene} (weight=${item.weight}, fitness=${item.fitness}%)`);
  }
}

function printReport(report, filters) {
  console.log(">>> CROSS-EVOLUTION OBSERVER <<<");
  console.log(`Skills root: ${report.root}`);
  console.log("");
  printGeneCoverage(report, filters);
  printSkillProfiles(report, filters);
  printReviewQueue(report, filters);
}

function main() {
  const args = parseArgs(process.argv.slice(2));
  if (args.help) {
    printHelp();
    return;
  }
  const registry = readJson(REGISTRY_PATH);
  if (!registry) throw new Error(`Missing registry: ${REGISTRY_PATH}`);
  const root = resolve(args.root ?? defaultRoot());
  const report = analyze(root, registry);
  if (args.writeState) {
    for (const profile of report.profiles) writeSkillState(profile);
  }
  if (args.json) {
    console.log(JSON.stringify(report, null, 2));
    return;
  }
  printReport(report, { skill: args.skill, gene: args.gene });
}

main();
