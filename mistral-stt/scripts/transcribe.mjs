#!/usr/bin/env node
import { realpathSync } from "node:fs";
import { readFile, stat } from "node:fs/promises";
import { basename } from "node:path";
import { argv, env, stderr, stdout } from "node:process";
import { fileURLToPath, pathToFileURL } from "node:url";

// --- Constants ---

const API_KEY = env.MISTRAL_API_KEY;
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
  ["--diarize", "diarize"],
  ["-d", "diarize"],
]);

// --- CLI ---

function usage() {
  return [
    "Usage:",
    `  MISTRAL_API_KEY=xxx ${argv[1]} audio.ogg [language] [model] [diarize]`,
    `  MISTRAL_API_KEY=xxx ${argv[1]} --file audio.ogg [--lang ru] [--model ${DEFAULTS.model}] [--diarize true]`,
    "",
    "Outputs only transcription text on stdout.",
  ].join("\n");
}

function parseArgs(args) {
  const options = {
    file: "",
    language: "",
    model: DEFAULTS.model,
    diarize: false,
    help: false,
  };
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
      if (!value || value.startsWith("--"))
        throw new Error(`Missing value for ${arg}`);
      options[key] = value;
      index += 1;
      continue;
    }
    if (arg.startsWith("--")) throw new Error(`Unknown option: ${arg}`);
    positional.push(arg);
  }
  options.file ||= positional[0] ?? "";
  options.language ||= positional[1] ?? "";
  options.model =
    options.model === DEFAULTS.model
      ? (positional[2] ?? options.model)
      : options.model;
  const diarize =
    options.diarize === false ? (positional[3] ?? false) : options.diarize;
  if (![true, false, "true", "false"].includes(diarize))
    throw new Error("diarize must be true or false");
  options.diarize = diarize === true || diarize === "true";
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

function formatTime(seconds) {
  const safeSeconds = Number.isFinite(Number(seconds)) ? Number(seconds) : 0;
  const hours = Math.floor(safeSeconds / 3600)
    .toString()
    .padStart(2, "0");
  const minutes = Math.floor((safeSeconds % 3600) / 60)
    .toString()
    .padStart(2, "0");
  const wholeSeconds = Math.floor(safeSeconds % 60)
    .toString()
    .padStart(2, "0");
  return `${hours}:${minutes}:${wholeSeconds}`;
}

function formatDiarizedSegments(segments) {
  return segments
    .map((segment) => {
      const text = (segment.text ?? "").trim();
      if (!text) return "";
      const speaker = segment.speaker_id ?? "Unknown speaker";
      return `[${formatTime(segment.start)}|${speaker}] ${text}`;
    })
    .filter(Boolean)
    .join("\n");
}

async function transcribe({ file, language, model, diarize }) {
  await assertReadableFile(file);
  if (!API_KEY) throw new Error("MISTRAL_API_KEY is required");
  const audio = await readFile(file);
  const form = new FormData();
  form.append("file", createAudioBlob(audio, file), basename(file));
  form.append("model", model);
  form.append("response_format", "json");
  if (language) form.append("language", language);
  if (diarize) {
    form.append("diarize", "true");
    form.append("timestamp_granularities", "segment");
  }
  const response = await fetch(DEFAULTS.endpoint, {
    method: "POST",
    headers: { Authorization: `Bearer ${API_KEY}` },
    body: form,
  });
  if (!response.ok) {
    const details = await response.text().catch(() => response.statusText);
    throw new Error(`Mistral API error: ${response.status} ${details}`.trim());
  }
  const data = await response.json();
  if (diarize && Array.isArray(data.segments))
    return formatDiarizedSegments(data.segments) || data.text || "";
  return data.text ?? "";
}

function isDirectCliEntrypoint(metaUrl, entryPath) {
  if (!entryPath) return false;
  try {
    return realpathSync(fileURLToPath(metaUrl)) === realpathSync(entryPath);
  } catch {
    return metaUrl === pathToFileURL(entryPath).href;
  }
}

async function main() {
  const options = parseArgs(argv.slice(2));
  if (options.help) {
    stdout.write(`${usage()}\n`);
    return;
  }
  if (!options.file) throw new Error(usage());
  const text = await transcribe(options);
  stdout.write(text.endsWith("\n") ? text : `${text}\n`);
}

if (isDirectCliEntrypoint(import.meta.url, argv[1])) {
  try {
    await main();
  } catch (error) {
    stderr.write(`${error.message}\n`);
    process.exitCode = 2;
  }
}

export { formatDiarizedSegments, parseArgs };
