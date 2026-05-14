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
const bashMissingPathOutput = run('bash', [path.join(scriptDir, 'validate-context.sh'), path.join(fixtureRoot, 'missing')], { withoutRootEnv: true });
const nodeMissingPathOutput = run(process.execPath, [path.join(scriptDir, 'validate-context.mjs'), path.join(fixtureRoot, 'missing')], { withoutRootEnv: true });

checkOutput('bash', bashOutput);
checkOutput('node', nodeOutput);
checkOutput('bash path arg', bashPathOutput);
checkOutput('node path arg', nodePathOutput);
checkMissingPath('bash missing path', bashMissingPathOutput);
checkMissingPath('node missing path', nodeMissingPathOutput);

const bashWarnings = countSummary('bash', bashOutput.stdout, 'Warnings');
const nodeWarnings = countSummary('node', nodeOutput.stdout, 'Warnings');
const bashErrors = countSummary('bash', bashOutput.stdout, 'Errors');
const nodeErrors = countSummary('node', nodeOutput.stdout, 'Errors');

assert(bashWarnings === nodeWarnings, 'warning counts match');
assert(bashErrors === nodeErrors, 'error counts match');
assert(bashWarnings === '0', 'fixture warnings = 0');
assert(bashErrors === '0', 'fixture errors = 0');

process.stdout.write(bashOutput.stdout);
process.stdout.write(nodeOutput.stdout);
console.log(`PASS: validate-context fixture regression (bash + node parity)`);
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
  assert(result.stdout.includes('Context validation PASSED'), `${runtime} passes`);
  assert(result.stdout.includes('Markdown shape checks passed'), `${runtime} runs markdown shape check`);
  assert(result.stdout.includes('No obvious BACKLOG/CHANGELOG drift detected'), `${runtime} runs root drift check`);
}

function checkMissingPath(runtime, result) {
  assert(result.status !== 0, `${runtime} rejects missing path`);
  assert(result.stderr.includes('Project root does not exist'), `${runtime} explains missing path`);
}

function countSummary(name, output, key) {
  const re = new RegExp(`^${key}:\\s*(\\d+)`, 'm');
  const match = output.match(re);
  if (!match) {
    assert(false, `${name} has summary key ${key}`);
    return '';
  }
  assert(true, `${name} has summary key ${key}`);
  return match[1];
}

function assert(ok, label) {
  if (ok) pass++;
  else {
    fail++;
    console.error(`FAIL: ${label}`);
  }
}
