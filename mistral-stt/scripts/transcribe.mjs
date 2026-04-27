#!/usr/bin/env node
import { readFile, stat } from "node:fs/promises";
import { basename } from "node:path";
import { argv, env, exit, stderr, stdout } from "node:process";

// --- Constants ---

const DEFAULTS = {
  model: "voxtral-mini-latest",
  endpoint: "https://api.mistral.ai/v1/audio/transcriptions",
};
const CLI_FLAGS = new Map([
  ["--help", "help"],
  ["-h", "help"],
]);
const CLI_VALUES = new Map([
  ["--file", "file"],
  ["-f", "file"],
  ["--lang", "language"],
  ["--language", "language"],
  ["-l", "language"],
  ["--model", "model"],
  ["-m", "model"],
]);

// --- CLI ---

function usage() {
  return [
    "Usage:",
    `  MISTRAL_API_KEY=xxx ${argv[1]} audio.ogg [language] [model]`,
    `  MISTRAL_API_KEY=xxx ${argv[1]} --file audio.ogg [--lang ru] [--model ${DEFAULTS.model}]`,
    "",
    "Outputs only transcription text on stdout.",
  ].join("\n");
}

function parseArgs(args) {
  const options = { file: "", language: "", model: DEFAULTS.model, help: false };
  const positional = [];
  for (let index = 0; index < args.length; index += 1) {
    const arg = args[index];
    if (CLI_FLAGS.has(arg)) {
      options[CLI_FLAGS.get(arg)] = true;
      continue;
    }
    if (CLI_VALUES.has(arg)) {
      const key = CLI_VALUES.get(arg);
      const value = args[index + 1];
      if (!value || value.startsWith("--")) throw new Error(`Missing value for ${arg}`);
      options[key] = value;
      index += 1;
      continue;
    }
    if (arg.startsWith("--")) throw new Error(`Unknown option: ${arg}`);
    positional.push(arg);
  }
  options.file ||= positional[0] ?? "";
  options.language ||= positional[1] ?? "";
  options.model = options.model === DEFAULTS.model ? positional[2] ?? options.model : options.model;
  return options;
}

async function assertReadableFile(file) {
  try {
    const info = await stat(file);
    if (!info.isFile()) throw new Error("not a file");
  } catch {
    throw new Error(`Audio file not found: ${file}`);
  }
}

function createAudioBlob(buffer, file) {
  return new Blob([buffer], { type: guessMimeType(file) });
}

function guessMimeType(file) {
  const lower = file.toLowerCase();
  if (lower.endsWith(".ogg") || lower.endsWith(".oga")) return "audio/ogg";
  if (lower.endsWith(".mp3")) return "audio/mpeg";
  if (lower.endsWith(".wav")) return "audio/wav";
  if (lower.endsWith(".m4a") || lower.endsWith(".mp4")) return "audio/mp4";
  if (lower.endsWith(".webm")) return "audio/webm";
  if (lower.endsWith(".flac")) return "audio/flac";
  return "application/octet-stream";
}

async function transcribe({ file, language, model }) {
  await assertReadableFile(file);
  if (!env.MISTRAL_API_KEY) throw new Error("MISTRAL_API_KEY is required");
  const audio = await readFile(file);
  const form = new FormData();
  form.append("file", createAudioBlob(audio, file), basename(file));
  form.append("model", model);
  form.append("response_format", "json");
  if (language) form.append("language", language);
  const response = await fetch(DEFAULTS.endpoint, {
    method: "POST",
    headers: { Authorization: `Bearer ${env.MISTRAL_API_KEY}` },
    body: form,
  });
  if (!response.ok) throw new Error(`Mistral API error: ${response.status} ${response.statusText}`);
  const data = await response.json();
  return data.text ?? "";
}

try {
  const options = parseArgs(argv.slice(2));
  if (options.help) {
    stdout.write(`${usage()}\n`);
    exit(0);
  }
  if (!options.file) throw new Error(usage());
  const text = await transcribe(options);
  stdout.write(text.endsWith("\n") ? text : `${text}\n`);
} catch (error) {
  stderr.write(`${error.message}\n`);
  exit(2);
}
