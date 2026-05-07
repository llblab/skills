#!/usr/bin/env node

import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import process from 'node:process';
import { spawnSync } from 'node:child_process';

const scriptDir = path.dirname(new URL(import.meta.url).pathname);
const lockScript = path.join(scriptDir, 'swarm-lock.mjs');
let pass = 0;
let fail = 0;

const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'swarm-self-test-'));
const lockFile = path.join(tmp, 'locks.json');
try {
  console.log('=== Swarm Self-Test ===');
  testLocks();
  testScriptBoundary();
  console.log(`\n=== Results: ${pass} passed, ${fail} failed ===`);
  if (fail) process.exit(1);
} finally {
  fs.rmSync(tmp, { recursive: true, force: true });
}

function testLocks() {
  console.log('\nLock protocol');
  runLock(['claim', '--scope', 'src/auth', '--mode', 'write', '--ttl', '60'], 'ACQUIRED', 'first write acquire succeeds');
  runLockConflict(['claim', '--scope', 'src/auth', '--mode', 'write', '--ttl', '60'], 'second write conflicts');
  resetLocks();
  runLock(['claim', '--scope', 'src/pallets', '--mode', 'write', '--ttl', '60'], 'ACQUIRED', 'write on first scope succeeds');
  runLock(['claim', '--scope', 'src/runtime', '--mode', 'read', '--ttl', '60'], 'ACQUIRED', 'read on different scope succeeds');
  runLockConflict(['claim', '--scope', 'src/pallets', '--mode', 'read', '--ttl', '60'], 'read conflicts with write');
  resetLocks();
  runLock(['claim', '--scope', 'src/docs', '--mode', 'read', '--ttl', '60'], 'ACQUIRED', 'first read succeeds');
  runLock(['claim', '--scope', 'src/docs', '--mode', 'read', '--ttl', '60'], 'ACQUIRED', 'second read succeeds');
  const status = JSON.parse(runLockRaw(['status', '--scope', 'src/docs']).stdout);
  assert(status.refs === 2, 'read refs = 2');
  runLock(['release', '--scope', 'src/docs'], 'RELEASED', 'release succeeds');
  runLock(['release', '--scope', 'src/docs'], 'RELEASED', 'second release succeeds');
  resetLocks();
  runLock(['claim', '--scope', 'src/expire', '--mode', 'write', '--ttl', '1'], 'ACQUIRED', 'ttl lock acquired');
  const reg = JSON.parse(fs.readFileSync(lockFile, 'utf8'));
  reg['scope://src/expire'].expires = 0;
  fs.writeFileSync(lockFile, JSON.stringify(reg, null, 2));
  runLock(['claim', '--scope', 'src/expire', '--mode', 'write', '--ttl', '60'], 'ACQUIRED', 'expired lock pruned');
}

function testScriptBoundary() {
  console.log('\nScript boundary');
  assert(!fs.existsSync(path.join(scriptDir, 'swarm-coordinator.mjs')), 'generic coordinator script is absent');
}

function runLock(argv, expected, label) {
  const result = runLockRaw(argv);
  assert(result.stdout.trim() === expected, label);
}

function runLockConflict(argv, label) {
  const result = runLockRaw(argv);
  assert(result.status !== 0 && result.stderr.startsWith('LOCK_CONFLICT:'), label);
}

function runLockRaw(argv) {
  return spawnSync(process.execPath, [lockScript, ...argv], {
    encoding: 'utf8',
    env: { ...process.env, SWARM_LOCK_FILE: lockFile }
  });
}

function resetLocks() {
  fs.rmSync(lockFile, { force: true });
}

function assert(ok, label) {
  if (ok) {
    pass++;
    console.log(`  PASS: ${label}`);
  } else {
    fail++;
    console.log(`  FAIL: ${label}`);
  }
}
