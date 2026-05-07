#!/usr/bin/env node

import fs from "node:fs";
import process from "node:process";

const args = parseArgs(process.argv.slice(2));
const command = args._[0] || args.command || "status";
const scope = args.scope || "";
const mode = args.mode || "write";
const ttl = Number(args.ttl || 300);
const lockFile = process.env.SWARM_LOCK_FILE || "/tmp/.swarm-locks.json";
const owner = args.owner || `swarm-lock:${process.pid}:${Date.now()}`;

switch (command) {
  case "claim":
    requireScope(scope);
    claim(scope, mode, ttl, owner);
    break;
  case "release":
    requireScope(scope);
    release(scope);
    break;
  case "status":
    status(scope);
    break;
  case "prune":
    pruneAndWrite();
    break;
  default:
    die(`unknown command: ${command}`);
}

function claim(scope, mode, ttl, owner) {
  if (!["read", "write"].includes(mode)) die("--mode must be read or write");
  const reg = readLocks();
  prune(reg);
  const key = `scope://${scope}`;
  const existing = reg[key];
  if (existing) {
    if (mode === "write" || existing.type === "write") {
      die(`LOCK_CONFLICT:${existing.owner}`);
    }
    existing.refs = (existing.refs || 1) + 1;
    existing.expires = Date.now() / 1000 + ttl;
  } else {
    reg[key] = {
      owner,
      type: mode,
      refs: mode === "read" ? 1 : undefined,
      ttl,
      acquired: new Date().toISOString(),
      expires: Date.now() / 1000 + ttl,
    };
    if (mode === "write") delete reg[key].refs;
  }
  writeLocks(reg);
  console.log("ACQUIRED");
}

function release(scope) {
  const reg = readLocks();
  const key = `scope://${scope}`;
  const existing = reg[key];
  if (existing?.type === "read" && existing.refs > 1) existing.refs -= 1;
  else delete reg[key];
  writeLocks(reg);
  console.log("RELEASED");
}

function status(scope) {
  const reg = readLocks();
  prune(reg);
  if (scope) {
    console.log(JSON.stringify(reg[`scope://${scope}`] || null, null, 2));
  } else {
    console.log(JSON.stringify(reg, null, 2));
  }
}

function pruneAndWrite() {
  const reg = readLocks();
  prune(reg);
  writeLocks(reg);
  console.log("PRUNED");
}

function prune(reg) {
  const now = Date.now() / 1000;
  for (const [k, v] of Object.entries(reg)) {
    if ((v.expires || 0) < now) delete reg[k];
  }
}

function readLocks() {
  try {
    return JSON.parse(fs.readFileSync(lockFile, "utf8"));
  } catch {
    return {};
  }
}

function writeLocks(reg) {
  fs.writeFileSync(lockFile, JSON.stringify(reg, null, 2));
}

function parseArgs(argv) {
  const out = { _: [] };
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (!a.startsWith("--")) {
      out._.push(a);
      continue;
    }
    const eq = a.indexOf("=");
    if (eq !== -1) out[a.slice(2)] = a.slice(eq + 1);
    else {
      const key = a.slice(2);
      const next = argv[i + 1];
      if (!next || next.startsWith("--")) out[key] = true;
      else {
        out[key] = next;
        i++;
      }
    }
  }
  return out;
}
function requireScope(value) {
  if (!value) die("--scope is required");
}
function die(msg) {
  console.error(msg);
  process.exit(1);
}
