#!/usr/bin/env node

import fs from 'node:fs';
import path from 'node:path';
import process from 'node:process';
import { spawnSync } from 'node:child_process';

const scriptDir = path.dirname(new URL(import.meta.url).pathname);
const skillDir = path.resolve(scriptDir, '..');
const fixtureRoot = path.join(skillDir, 'fixtures/abcd-project');

let pass = 0;
let fail = 0;

const bashOutput = run('bash', [path.join(scriptDir, 'validate-context.sh')]);
const nodeOutput = run(process.execPath, [path.join(scriptDir, 'validate-context.mjs')]);
const bashPathOutput = run('bash', [path.join(scriptDir, 'validate-context.sh'), fixtureRoot], { withoutRootEnv: true });
const nodePathOutput = run(process.execPath, [path.join(scriptDir, 'validate-context.mjs'), fixtureRoot], { withoutRootEnv: true });
const bashSelfOutput = run('bash', [path.join(scriptDir, 'validate-context.sh'), skillDir], { withoutRootEnv: true });
const nodeSelfOutput = run(process.execPath, [path.join(scriptDir, 'validate-context.mjs'), skillDir], { withoutRootEnv: true });
const bashTextOutput = run('bash', [path.join(scriptDir, 'validate-context.sh'), '--text']);
const nodeTextOutput = run(process.execPath, [path.join(scriptDir, 'validate-context.mjs'), '--text']);
const bashMissingPathOutput = run('bash', [path.join(scriptDir, 'validate-context.sh'), path.join(fixtureRoot, 'missing')], { withoutRootEnv: true });
const nodeMissingPathOutput = run(process.execPath, [path.join(scriptDir, 'validate-context.mjs'), path.join(fixtureRoot, 'missing')], { withoutRootEnv: true });

checkOutput('bash fixture', bashOutput);
checkOutput('node fixture', nodeOutput);
checkOutput('bash fixture path arg', bashPathOutput);
checkOutput('node fixture path arg', nodePathOutput);
checkOutput('bash self', bashSelfOutput);
checkOutput('node self', nodeSelfOutput);
checkTextOutput('bash text', bashTextOutput);
checkTextOutput('node text', nodeTextOutput);
checkMissingPath('bash missing path', bashMissingPathOutput);
checkMissingPath('node missing path', nodeMissingPathOutput);

checkParity('fixture', bashOutput, nodeOutput, true);
checkParity('self', bashSelfOutput, nodeSelfOutput, true);

console.log(`PASS: validate-context fixture + self-reference regression (bash + node parity)`);
console.log(`Self-test assertions: ${pass} passed, ${fail} failed`);
process.exit(fail ? 1 : 0);

function run(cmd, argv, options = {}) {
  const env = {
    ...process.env,
    NO_COLOR: '1'
  };
  if (!options.withoutRootEnv) env.VALIDATE_CONTEXT_ROOT = fixtureRoot;
  const result = spawnSync(cmd, argv, {
    encoding: 'utf8',
    env
  });
  if (result.error) {
    return { status: 1, stdout: '', stderr: String(result.error) };
  }
  return result;
}

function checkOutput(runtime, result) {
  assert(result.status === 0, `${runtime} exits 0`);
  const output = parseJson(runtime, result.stdout);
  assert(output?.passed === 1, `${runtime} passes`);
  assert(output?.items.some((item) => item.message === 'Markdown shape checks passed'), `${runtime} runs markdown shape check`);
  assert(output?.items.some((item) => item.message === 'No obvious BACKLOG/CHANGELOG drift detected'), `${runtime} runs root drift check`);
}

function checkTextOutput(runtime, result) {
  assert(result.status === 0, `${runtime} exits 0`);
  assert(result.stdout.includes('Context validation PASSED'), `${runtime} provides human-readable output`);
}

function checkMissingPath(runtime, result) {
  assert(result.status !== 0, `${runtime} rejects missing path`);
  assert(result.stderr.includes('Project root does not exist'), `${runtime} explains missing path`);
}

function checkParity(scope, bashResult, nodeResult, requireClean) {
  const bashOutput = parseJson(`${scope} bash`, bashResult.stdout);
  const nodeOutput = parseJson(`${scope} node`, nodeResult.stdout);
  assert(bashOutput?.warnings === nodeOutput?.warnings, `${scope} warning counts match`);
  assert(bashOutput?.errors === nodeOutput?.errors, `${scope} error counts match`);
  if (requireClean) {
    assert(bashOutput?.warnings === 0, `${scope} warnings = 0`);
    assert(bashOutput?.errors === 0, `${scope} errors = 0`);
  }
}

function parseJson(name, output) {
  try {
    const parsed = JSON.parse(output);
    assert(true, `${name} returns JSON`);
    return parsed;
  } catch {
    assert(false, `${name} returns JSON`);
    return undefined;
  }
}

function assert(ok, label) {
  if (ok) pass++;
  else {
    fail++;
    console.error(`FAIL: ${label}`);
  }
}
