#!/usr/bin/env node
import { spawn, spawnSync } from "node:child_process";
import { createHash, randomBytes } from "node:crypto";
import { createWriteStream } from "node:fs";
import { mkdtemp, readFile, rm, stat, writeFile } from "node:fs/promises";
import { request as httpsRequest } from "node:https";
import { platform, tmpdir } from "node:os";
import { join } from "node:path";
import { argv, exit, stderr, stdin, stdout } from "node:process";
import { connect as tlsConnect } from "node:tls";
import { pathToFileURL } from "node:url";

// --- Constants ---

const EDGE = {
  host: "speech.platform.bing.com",
  path: "/consumer/speech/synthesize/readaloud",
  token: "6A5AA1D4EAFF4E9FB37E23D68491D6F4",
  chromiumMajor: "143",
  secMsGecVersion: "1-143.0.3650.75",
};
const DEFAULTS = {
  language: "en",
  rate: "+30%",
  volume: "+0%",
  pitch: "+0Hz",
  boundary: "SentenceBoundary",
  connectTimeoutMs: 10_000,
  receiveTimeoutMs: 60_000,
};
const AUDIO = {
  chunkBytes: 4096,
  ticksPerSecond: 10_000_000,
  mp3BitrateBps: 48_000,
};
const WS = {
  guid: "258EAFA5-E914-47DA-95CA-C5AB0DC85B11",
  opcodes: {
    continuation: 0x0,
    text: 0x1,
    binary: 0x2,
    close: 0x8,
    ping: 0x9,
    pong: 0xa,
  },
};
const IS_WINDOWS = platform() === "win32";
const VOICES_BY_LANG = {
  en: "en-US-AriaNeural",
  ru: "ru-RU-SvetlanaNeural",
  de: "de-DE-KatjaNeural",
  fr: "fr-FR-DeniseNeural",
  es: "es-ES-AlvaroNeural",
  it: "it-IT-ElsaNeural",
  zh: "zh-CN-XiaoxiaoNeural",
  ja: "ja-JP-NanamiNeural",
};
const BASE_HEADERS = {
  "User-Agent":
    `Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 ` +
    `(KHTML, like Gecko) Chrome/${EDGE.chromiumMajor}.0.0.0 Safari/537.36 ` +
    `Edg/${EDGE.chromiumMajor}.0.0.0`,
  "Accept-Encoding": "gzip, deflate, br, zstd",
  "Accept-Language": "en-US,en;q=0.9",
};
const WSS_HEADERS = {
  Pragma: "no-cache",
  "Cache-Control": "no-cache",
  Origin: "chrome-extension://jdiccldimpdaibmpdkjnbmckianbfold",
  "Sec-WebSocket-Version": "13",
  ...BASE_HEADERS,
};
const VOICE_HEADERS = {
  "Sec-CH-UA":
    `" Not;A Brand";v="99", "Microsoft Edge";v="${EDGE.chromiumMajor}", ` +
    `"Chromium";v="${EDGE.chromiumMajor}"`,
  "Sec-CH-UA-Mobile": "?0",
  Accept: "*/*",
  "Sec-Fetch-Site": "none",
  "Sec-Fetch-Mode": "cors",
  "Sec-Fetch-Dest": "empty",
  ...BASE_HEADERS,
};
const PLAYBACK_CANDIDATES = [
  {
    command: "ffplay",
    args: (file) => ["-nodisp", "-autoexit", "-v", "quiet", "-i", file],
  },
  { command: "mpv", args: (file) => ["--no-video", "--really-quiet", file] },
  {
    command: "vlc",
    args: (file) => ["--play-and-exit", "--intf", "dummy", file],
  },
  {
    command: "cvlc",
    args: (file) => ["--play-and-exit", "--intf", "dummy", file],
  },
  { command: "mpg123", args: (file) => ["-q", file] },
  { command: "afplay", args: (file) => [file] },
  {
    command: "windows-default",
    label: "Windows default MP3 app",
    available: () => IS_WINDOWS && commandExists("powershell.exe"),
    launch: createWindowsDefaultPlaybackLaunch,
  },
];
const CLI_FLAGS = new Map([
  ["--help", "help"],
  ["-h", "help"],
  ["--list-voices", "listVoices"],
  ["-l", "listVoices"],
]);
const CLI_VALUES = new Map([
  ["--text", "text"],
  ["-t", "text"],
  ["--file", "file"],
  ["-f", "file"],
  ["--voice", "voice"],
  ["-v", "voice"],
  ["--lang", "language"],
  ["--language", "language"],
  ["--rate", "rate"],
  ["--volume", "volume"],
  ["--pitch", "pitch"],
  ["--boundary", "boundary"],
  ["--write-media", "writeMedia"],
  ["--write-subtitles", "writeSubtitles"],
  ["--write-metadata", "writeMetadata"],
]);
let clockSkewSeconds = 0;

// --- Errors ---

class HttpResponseError extends Error {
  constructor(
    message,
    statusCode,
    statusText,
    headers,
    body = Buffer.alloc(0),
  ) {
    super(message);
    this.name = "HttpResponseError";
    this.statusCode = statusCode;
    this.statusText = statusText;
    this.headers = headers;
    this.body = body;
  }
}

class WebSocketHandshakeError extends HttpResponseError {
  constructor(
    message,
    statusCode,
    statusText,
    headers,
    body = Buffer.alloc(0),
  ) {
    super(message, statusCode, statusText, headers, body);
    this.name = "WebSocketHandshakeError";
  }
}

// --- Raw WebSocket ---

class RawWebSocket {
  constructor(socket) {
    this.socket = socket;
    this.buffer = Buffer.alloc(0);
    this.listeners = new Map();
    this.fragmentOpcode = null;
    this.fragmentChunks = [];
    this.closeSent = false;
    this.closeEmitted = false;
    this.socket.on("data", (chunk) => this.handleData(chunk));
    this.socket.on("error", (error) => this.emit("error", error));
    this.socket.on("close", () => this.emitClose(1006, ""));
  }
  on(eventName, listener) {
    const listeners = this.listeners.get(eventName) || [];
    listeners.push(listener);
    this.listeners.set(eventName, listeners);
  }
  emit(eventName, value) {
    for (const listener of this.listeners.get(eventName) || []) listener(value);
  }
  acceptBufferedData(chunk) {
    if (chunk.length > 0) this.handleData(chunk);
  }
  sendText(text) {
    this.sendFrame(Buffer.from(text, "utf-8"), WS.opcodes.text);
  }
  close(code = 1000, reason = "") {
    if (this.closeSent || this.socket.destroyed) return;
    this.closeSent = true;
    this.sendFrame(createClosePayload(code, reason), WS.opcodes.close);
    this.socket.end();
  }
  handleData(chunk) {
    this.buffer = Buffer.concat([this.buffer, chunk]);
    while (this.buffer.length > 0) {
      const frame = parseWebSocketFrame(this.buffer);
      if (!frame) return;
      this.buffer = this.buffer.slice(frame.consumed);
      this.handleFrame(frame);
    }
  }
  handleFrame(frame) {
    if (frame.opcode === WS.opcodes.close)
      return this.handleCloseFrame(frame.payload);
    if (frame.opcode === WS.opcodes.ping)
      return this.sendFrame(frame.payload, WS.opcodes.pong);
    if (frame.opcode === WS.opcodes.pong) return;
    if (frame.opcode === WS.opcodes.continuation)
      return this.handleContinuationFrame(frame);
    if (frame.opcode === WS.opcodes.text || frame.opcode === WS.opcodes.binary)
      return this.handleDataFrame(frame);
    this.emit(
      "error",
      new Error(`Unsupported websocket opcode: ${frame.opcode}`),
    );
    this.close(1002, "Unsupported opcode");
  }
  handleCloseFrame(payload) {
    const code = payload.length >= 2 ? payload.readUInt16BE(0) : 1005;
    const reason = payload.length > 2 ? payload.slice(2).toString("utf-8") : "";
    if (!this.closeSent) this.close(code === 1005 ? 1000 : code, reason);
    this.emitClose(code, reason);
  }
  handleContinuationFrame(frame) {
    if (this.fragmentOpcode === null)
      throw new Error("Unexpected websocket continuation frame");
    this.fragmentChunks.push(frame.payload);
    if (!frame.fin) return;
    this.emitMessage(this.fragmentOpcode, Buffer.concat(this.fragmentChunks));
    this.fragmentOpcode = null;
    this.fragmentChunks = [];
  }
  handleDataFrame(frame) {
    if (!frame.fin) {
      this.fragmentOpcode = frame.opcode;
      this.fragmentChunks = [frame.payload];
      return;
    }
    this.emitMessage(frame.opcode, frame.payload);
  }
  emitMessage(opcode, payload) {
    if (opcode === WS.opcodes.text)
      return this.emit("message", {
        data: payload.toString("utf-8"),
        isBinary: false,
      });
    if (opcode === WS.opcodes.binary)
      this.emit("message", { data: payload, isBinary: true });
  }
  emitClose(code, reason) {
    if (this.closeEmitted) return;
    this.closeEmitted = true;
    this.emit("close", { code, reason });
  }
  sendFrame(payload, opcode) {
    if (!this.socket.destroyed)
      this.socket.write(createWebSocketFrame(payload, opcode));
  }
}

class AsyncQueue {
  constructor() {
    this.items = [];
    this.waiters = [];
    this.closed = false;
    this.error = null;
  }
  push(item) {
    if (this.closed) return;
    this.items.push(item);
    this.wake();
  }
  close(error = null) {
    if (this.closed) return;
    this.closed = true;
    this.error = error;
    this.wake();
  }
  wake() {
    for (const waiter of this.waiters.splice(0)) waiter();
  }
  async next() {
    while (this.items.length === 0) {
      if (!this.closed)
        await new Promise((resolve) => this.waiters.push(resolve));
      else if (this.error) throw this.error;
      else return { done: true, value: undefined };
    }
    return { done: false, value: this.items.shift() };
  }
  [Symbol.asyncIterator]() {
    return this;
  }
}

function createClosePayload(code, reason) {
  const reasonBytes = Buffer.from(reason, "utf-8");
  const payload = Buffer.alloc(2 + reasonBytes.length);
  payload.writeUInt16BE(code, 0);
  reasonBytes.copy(payload, 2);
  return payload;
}

function createWebSocketFrame(payload, opcode) {
  const length = payload.length;
  const header = Buffer.alloc(webSocketHeaderLength(length) + 4);
  header[0] = 0x80 | opcode;
  writeWebSocketLength(header, length);
  const mask = header.slice(header.length - 4);
  const masked = Buffer.alloc(payload.length);
  randomBytes(4).copy(mask);
  for (let index = 0; index < payload.length; index += 1)
    masked[index] = payload[index] ^ mask[index % 4];
  return Buffer.concat([header, masked]);
}

function webSocketHeaderLength(payloadLength) {
  if (payloadLength < 126) return 2;
  if (payloadLength <= 0xffff) return 4;
  return 10;
}

function writeWebSocketLength(header, payloadLength) {
  if (payloadLength < 126) {
    header[1] = 0x80 | payloadLength;
    return;
  }
  if (payloadLength <= 0xffff) {
    header[1] = 0x80 | 126;
    header.writeUInt16BE(payloadLength, 2);
    return;
  }
  header[1] = 0x80 | 127;
  header.writeBigUInt64BE(BigInt(payloadLength), 2);
}

function parseWebSocketFrame(buffer) {
  if (buffer.length < 2) return null;
  const header = readWebSocketFrameHeader(buffer);
  if (!header || buffer.length < header.offset + header.length) return null;
  const payload = Buffer.from(
    buffer.slice(header.offset, header.offset + header.length),
  );
  if (header.mask) unmaskWebSocketPayload(payload, header.mask);
  return {
    fin: header.fin,
    opcode: header.opcode,
    payload,
    consumed: header.offset + header.length,
  };
}

function readWebSocketFrameHeader(buffer) {
  const fin = Boolean(buffer[0] & 0x80);
  const opcode = buffer[0] & 0x0f;
  const masked = Boolean(buffer[1] & 0x80);
  let length = buffer[1] & 0x7f;
  let offset = 2;
  if (length === 126) {
    if (buffer.length < offset + 2) return null;
    length = buffer.readUInt16BE(offset);
    offset += 2;
  } else if (length === 127) {
    if (buffer.length < offset + 8) return null;
    length = readSafeFrameLength(buffer, offset);
    offset += 8;
  }
  const mask = masked ? buffer.slice(offset, offset + 4) : null;
  if (masked && buffer.length < offset + 4) return null;
  return { fin, opcode, length, mask, offset: offset + (masked ? 4 : 0) };
}

function readSafeFrameLength(buffer, offset) {
  const length = buffer.readBigUInt64BE(offset);
  if (length > BigInt(Number.MAX_SAFE_INTEGER))
    throw new Error("WebSocket frame is too large");
  return Number(length);
}

function unmaskWebSocketPayload(payload, mask) {
  for (let index = 0; index < payload.length; index += 1)
    payload[index] ^= mask[index % 4];
}

// --- Configuration ---

function createTtsConfig(options = {}) {
  const language = normalizeLanguage(
    options.language || options.lang || DEFAULTS.language,
  );
  return {
    language,
    voice: normalizeVoice(
      options.voice || VOICES_BY_LANG[language] || VOICES_BY_LANG.en,
    ),
    rate: normalizeRate(options.rate),
    volume: normalizeVolume(options.volume),
    pitch: normalizePitch(options.pitch),
    boundary: normalizeBoundary(options.boundary),
    connectTimeoutMs: options.connectTimeoutMs ?? DEFAULTS.connectTimeoutMs,
    receiveTimeoutMs: options.receiveTimeoutMs ?? DEFAULTS.receiveTimeoutMs,
  };
}

function normalizeLanguage(value) {
  return value
    ? value.split(/[-_]/, 1)[0] || DEFAULTS.language
    : DEFAULTS.language;
}

function normalizeRate(value, defaultValue = DEFAULTS.rate) {
  return normalizeSignedPercent(value, defaultValue, "rate");
}

function normalizeVolume(value, defaultValue = DEFAULTS.volume) {
  return normalizeSignedPercent(value, defaultValue, "volume");
}

function normalizeSignedPercent(value, defaultValue, label) {
  const raw = (value ?? "").trim();
  if (!raw) return defaultValue;
  const match = /^([+-]?)(\d+)%$/.exec(raw);
  if (match) return `${match[1] || "+"}${match[2]}%`;
  const numeric = Number(raw);
  if (Number.isFinite(numeric))
    return formatSignedUnit(Math.round(numeric * 100), "%");
  stderr.write(
    `Invalid ${label} '${value}'. Use +30% or numeric multipliers like 1 = 100 percent.\n`,
  );
  return defaultValue;
}

function normalizePitch(value, defaultValue = DEFAULTS.pitch) {
  const raw = (value ?? "").trim();
  if (!raw) return defaultValue;
  if (/^[+-]\d+Hz$/.test(raw)) return raw;
  const numeric = Number(raw);
  if (Number.isFinite(numeric))
    return formatSignedUnit(Math.round(numeric), "Hz");
  throw new Error(`Invalid pitch '${value}'. Use values like +0Hz or -10Hz.`);
}

function formatSignedUnit(value, unit) {
  return `${value < 0 ? "" : "+"}${value}${unit}`;
}

function normalizeBoundary(value = DEFAULTS.boundary) {
  if (value === "WordBoundary" || value === "SentenceBoundary") return value;
  throw new Error("boundary must be WordBoundary or SentenceBoundary");
}

function normalizeVoice(voice) {
  if (!voice) return normalizeVoice(VOICES_BY_LANG.en);
  const match = /^([a-z]{2,})-([A-Z]{2,})-(.+Neural)$/.exec(voice);
  if (match) return formatServiceVoice(match[1], match[2], match[3]);
  if (/^Microsoft Server Speech Text to Speech Voice \(.+,.+\)$/.test(voice))
    return voice;
  throw new Error(`Invalid voice '${voice}'.`);
}

function formatServiceVoice(language, region, rawName) {
  const dash = rawName.indexOf("-");
  const voiceRegion = dash < 0 ? region : `${region}-${rawName.slice(0, dash)}`;
  const name = dash < 0 ? rawName : rawName.slice(dash + 1);
  return `Microsoft Server Speech Text to Speech Voice (${language}-${voiceRegion}, ${name})`;
}

// --- Edge Protocol ---

function buildSocketUrl(connectionId) {
  return `${edgeWssBaseUrl()}?${new URLSearchParams(edgeAuthParams({ ConnectionId: connectionId })).toString()}`;
}

function buildVoiceListUrl() {
  return `https://${EDGE.host}${EDGE.path}/voices/list?${new URLSearchParams(edgeAuthParams({ trustedclienttoken: EDGE.token })).toString()}`;
}

function edgeWssBaseUrl() {
  return `wss://${EDGE.host}${EDGE.path}/edge/v1`;
}

function edgeAuthParams(extra = {}) {
  return {
    TrustedClientToken: EDGE.token,
    "Sec-MS-GEC": generateSecMsGec(),
    "Sec-MS-GEC-Version": EDGE.secMsGecVersion,
    ...extra,
  };
}

function buildConfigMessage(boundary) {
  const wordBoundary = boundary === "WordBoundary";
  const body = {
    context: {
      synthesis: {
        audio: {
          metadataoptions: {
            sentenceBoundaryEnabled: String(!wordBoundary),
            wordBoundaryEnabled: String(wordBoundary),
          },
          outputFormat: "audio-24khz-48kbitrate-mono-mp3",
        },
      },
    },
  };
  return buildEdgeMessage(
    {
      "X-Timestamp": dateToString(),
      "Content-Type": "application/json; charset=utf-8",
      Path: "speech.config",
    },
    `${JSON.stringify(body)}\r\n`,
  );
}

function buildSsmlMessage(requestId, config, escapedText) {
  return buildEdgeMessage(
    {
      "X-RequestId": requestId,
      "Content-Type": "application/ssml+xml",
      "X-Timestamp": `${dateToString()}Z`,
      Path: "ssml",
    },
    buildSsml(config, escapedText),
  );
}

function buildSsml(config, escapedText) {
  return [
    "<speak version='1.0' xmlns='http://www.w3.org/2001/10/synthesis' xml:lang='en-US'>",
    `<voice name='${config.voice}'>`,
    `<prosody pitch='${config.pitch}' rate='${config.rate}' volume='${config.volume}'>`,
    escapedText,
    "</prosody>",
    "</voice>",
    "</speak>",
  ].join("");
}

function buildEdgeMessage(headers, body) {
  return `${Object.entries(headers)
    .map(([key, value]) => `${key}:${value}`)
    .join("\r\n")}\r\n\r\n${body}`;
}

function dateToString() {
  const now = new Date();
  const weekdays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  const date = [
    weekdays[now.getUTCDay()],
    months[now.getUTCMonth()],
    pad2(now.getUTCDate()),
    now.getUTCFullYear(),
  ].join(" ");
  const time = [now.getUTCHours(), now.getUTCMinutes(), now.getUTCSeconds()]
    .map(pad2)
    .join(":");
  return `${date} ${time} GMT+0000 (Coordinated Universal Time)`;
}

function generateSecMsGec() {
  const windowsEpoch = 11644473600;
  let timestamp = getUnixTimestamp() + windowsEpoch;
  timestamp -= timestamp % 300;
  const ticks = Math.floor(timestamp * 1e7);
  return createHash("sha256")
    .update(`${ticks}${EDGE.token}`)
    .digest("hex")
    .toUpperCase();
}

function getUnixTimestamp() {
  return Date.now() / 1000 + clockSkewSeconds;
}

function adjustClockSkew(headers) {
  const serverMillis = Date.parse(headers.date || "");
  if (!Number.isFinite(serverMillis)) return false;
  clockSkewSeconds += serverMillis / 1000 - getUnixTimestamp();
  return true;
}

function headersWithMuid(headers) {
  return { ...headers, Cookie: `muid=${randomHex(16).toUpperCase()};` };
}

function connectId() {
  return randomHex(16);
}

function randomHex(bytes = 16) {
  return randomBytes(bytes).toString("hex");
}

function pad2(value) {
  return String(value).padStart(2, "0");
}

// --- Text And Payload Parsing ---

function escapeXml(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/\"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

function unescapeXml(value) {
  return String(value)
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&apos;/g, "'")
    .replace(/&amp;/g, "&");
}

function removeIncompatibleCharacters(value) {
  return String(value)
    .split("")
    .map((char) => (isIncompatibleXmlChar(char.codePointAt(0)) ? " " : char))
    .join("");
}

function isIncompatibleXmlChar(code) {
  return (
    (code >= 0 && code <= 8) ||
    (code >= 11 && code <= 12) ||
    (code >= 14 && code <= 31)
  );
}

function splitByByteLength(text, limit = AUDIO.chunkBytes) {
  const chunks = [];
  let bytes = Buffer.from(text, "utf-8");
  while (bytes.length > limit) {
    const splitAt = findSplitPoint(bytes, limit);
    const part = bytes.slice(0, splitAt).toString("utf-8").trim();
    if (part) chunks.push(part);
    bytes = bytes.slice(splitAt > 0 ? splitAt : 1);
  }
  const tail = bytes.toString("utf-8").trim();
  if (tail) chunks.push(tail);
  return chunks;
}

function findSplitPoint(bytes, limit) {
  const natural = Math.max(
    bytes.lastIndexOf(0x0a, limit),
    bytes.lastIndexOf(0x20, limit),
  );
  const splitAt = adjustEntityBoundary(
    bytes,
    natural < 0 ? safeUtf8Split(bytes, limit) : natural,
  );
  if (splitAt <= 0)
    throw new Error(
      "Maximum byte length is too small or invalid text structure near XML entity.",
    );
  return splitAt;
}

function safeUtf8Split(bytes, limit) {
  let cursor = Math.min(limit, bytes.length);
  while (cursor > 0 && isUtf8ContinuationByte(bytes[cursor])) cursor -= 1;
  return cursor;
}

function isUtf8ContinuationByte(byte) {
  return byte !== undefined && (byte & 0xc0) === 0x80;
}

function adjustEntityBoundary(bytes, splitAt) {
  let adjusted = splitAt;
  while (adjusted > 0) {
    const text = bytes.slice(0, adjusted).toString("utf-8");
    const amp = text.lastIndexOf("&");
    if (amp < 0 || text.includes(";", amp)) return adjusted;
    adjusted = Buffer.byteLength(text.slice(0, amp), "utf-8");
  }
  return adjusted;
}

function parseHeadersAndData(bytes, separatorIndex) {
  return {
    headers: parseHeaderBlock(bytes.slice(0, separatorIndex).toString("utf-8")),
    data: bytes.slice(separatorIndex + 4),
  };
}

function parseHeaderBlock(text) {
  const headers = {};
  for (const row of text.split("\r\n")) {
    const divider = row.indexOf(":");
    if (divider >= 0) headers[row.slice(0, divider)] = row.slice(divider + 1);
  }
  return headers;
}

function parseWssTextPayload(data) {
  const bytes = Buffer.from(data, "utf-8");
  const separator = bytes.indexOf(Buffer.from("\r\n\r\n"));
  return separator < 0
    ? { headers: {}, data: Buffer.alloc(0) }
    : parseHeadersAndData(bytes, separator);
}

function parseWssBinaryPayload(payload) {
  if (payload.length < 2)
    throw new Error("Binary frame is too short for websocket edge headers");
  const headerLength = payload.readUInt16BE(0);
  if (headerLength > payload.length - 2)
    throw new Error(
      "Binary frame header length is greater than payload length",
    );
  const headerBytes = payload.slice(2, 2 + headerLength);
  return {
    headers: parseHeaderBlock(headerBytes.toString("utf-8")),
    data: payload.slice(2 + headerLength),
  };
}

function parseMetadata(data, state) {
  for (const meta of JSON.parse(data.toString("utf-8")).Metadata || []) {
    if (meta.Type === "WordBoundary" || meta.Type === "SentenceBoundary")
      return parseBoundaryMetadata(meta, state);
    if (meta.Type !== "SessionEnd")
      throw new Error(`Unknown metadata type: ${meta.Type}`);
  }
  throw new Error("No boundary metadata found");
}

function parseBoundaryMetadata(meta, state) {
  return {
    type: meta.Type,
    offset: meta.Data.Offset + state.offsetCompensation,
    duration: meta.Data.Duration,
    text: unescapeXml(meta.Data.text.Text),
  };
}

function compensateOffset(state) {
  state.cumulativeAudioBytes += state.chunkAudioBytes;
  state.offsetCompensation = Math.floor(
    (state.cumulativeAudioBytes * 8 * AUDIO.ticksPerSecond) /
      AUDIO.mp3BitrateBps,
  );
  state.chunkAudioBytes = 0;
}

// --- HTTP And TLS ---

function httpsGetBuffer(url, headers, timeoutMs = 10_000) {
  return new Promise((resolve, reject) => {
    const request = httpsRequest(url, { method: "GET", headers }, (response) =>
      collectHttpResponse(response, resolve, reject),
    );
    request.setTimeout(timeoutMs, () =>
      request.destroy(new Error("HTTP request timeout")),
    );
    request.on("error", reject);
    request.end();
  });
}

function collectHttpResponse(response, resolve, reject) {
  const chunks = [];
  response.on("data", (chunk) => chunks.push(Buffer.from(chunk)));
  response.on("end", () => {
    const body = Buffer.concat(chunks);
    const headers = normalizeHttpHeaders(response.headers);
    if (
      response.statusCode &&
      response.statusCode >= 200 &&
      response.statusCode < 300
    )
      return resolve(body);
    reject(
      new HttpResponseError(
        `HTTP request failed: ${response.statusCode} ${response.statusMessage}`,
        response.statusCode || 0,
        response.statusMessage || "",
        headers,
        body,
      ),
    );
  });
}

function normalizeHttpHeaders(headers) {
  return Object.fromEntries(
    Object.entries(headers).map(([key, value]) => [
      key.toLowerCase(),
      Array.isArray(value) ? value.join(", ") : value || "",
    ]),
  );
}

function openWebSocket(url, headers, timeoutMs) {
  return new Promise((resolve, reject) => {
    const parsed = new URL(url);
    const key = randomBytes(16).toString("base64");
    const socket = tlsConnect({
      host: parsed.hostname,
      port: Number(parsed.port) || 443,
      servername: parsed.hostname,
    });
    const state = { responseBuffer: Buffer.alloc(0), settled: false };
    const cleanup = createWebSocketHandshakeCleanup(
      socket,
      onData,
      onError,
      onClose,
      setTimeout(() => fail(new Error("WebSocket connect timeout")), timeoutMs),
    );
    const fail = (error) =>
      settleWebSocketHandshake(
        state,
        cleanup,
        () => socket.destroy(),
        () => reject(error),
      );
    const succeed = (websocket) =>
      settleWebSocketHandshake(state, cleanup, null, () => resolve(websocket));
    function onError(error) {
      fail(error);
    }
    function onClose() {
      fail(new Error("WebSocket closed during handshake"));
    }
    function onData(chunk) {
      handleWebSocketHandshakeData({
        chunk,
        state,
        key,
        socket,
        succeed,
        fail,
      });
    }
    socket.on("data", onData);
    socket.on("error", onError);
    socket.on("close", onClose);
    socket.once("secureConnect", () =>
      socket.write(buildUpgradeRequest(parsed, key, headers)),
    );
  });
}

function createWebSocketHandshakeCleanup(
  socket,
  onData,
  onError,
  onClose,
  timeout,
) {
  return () => {
    clearTimeout(timeout);
    socket.off("data", onData);
    socket.off("error", onError);
    socket.off("close", onClose);
  };
}

function settleWebSocketHandshake(state, cleanup, beforeSettle, settle) {
  if (state.settled) return;
  state.settled = true;
  cleanup();
  if (beforeSettle) beforeSettle();
  settle();
}

function handleWebSocketHandshakeData(context) {
  context.state.responseBuffer = Buffer.concat([
    context.state.responseBuffer,
    context.chunk,
  ]);
  const separator = context.state.responseBuffer.indexOf(
    Buffer.from("\r\n\r\n"),
  );
  if (separator < 0) return;
  const response = parseHttpResponse(
    context.state.responseBuffer.slice(0, separator).toString("latin1"),
  );
  const body = context.state.responseBuffer.slice(separator + 4);
  if (response.statusCode !== 101)
    return context.fail(
      new WebSocketHandshakeError(
        `WebSocket upgrade failed: ${response.statusCode} ${response.statusText}`,
        response.statusCode,
        response.statusText,
        response.headers,
        body,
      ),
    );
  if (response.headers["sec-websocket-accept"] !== createAcceptKey(context.key))
    return context.fail(new Error("Invalid Sec-WebSocket-Accept from server"));
  const websocket = new RawWebSocket(context.socket);
  context.succeed(websocket);
  websocket.acceptBufferedData(body);
}

function buildUpgradeRequest(parsed, key, headers) {
  const requestHeaders = {
    Host: parsed.host,
    Upgrade: "websocket",
    Connection: "Upgrade",
    "Sec-WebSocket-Key": key,
    "Sec-WebSocket-Version": "13",
    ...headers,
  };
  return [
    `GET ${parsed.pathname}${parsed.search} HTTP/1.1`,
    ...Object.entries(requestHeaders).map(
      ([name, value]) => `${name}: ${value}`,
    ),
    "",
    "",
  ].join("\r\n");
}

function parseHttpResponse(headerText) {
  const lines = headerText.split("\r\n");
  const status = /^HTTP\/\d(?:\.\d)?\s+(\d{3})\s*(.*)$/.exec(
    lines.shift() || "",
  );
  if (!status) throw new Error("Invalid HTTP response from websocket endpoint");
  return {
    statusCode: Number(status[1]),
    statusText: status[2],
    headers: parseLowercaseHttpHeaders(lines),
  };
}

function parseLowercaseHttpHeaders(lines) {
  const headers = {};
  for (const line of lines) {
    const divider = line.indexOf(":");
    if (divider >= 0)
      headers[line.slice(0, divider).trim().toLowerCase()] = line
        .slice(divider + 1)
        .trim();
  }
  return headers;
}

function createAcceptKey(key) {
  return createHash("sha1").update(`${key}${WS.guid}`).digest("base64");
}

async function openSynthesisSocket(config) {
  for (let attempt = 0; attempt < 2; attempt += 1) {
    try {
      return await openWebSocket(
        buildSocketUrl(connectId()),
        headersWithMuid(WSS_HEADERS),
        config.connectTimeoutMs,
      );
    } catch (error) {
      if (
        attempt === 0 &&
        error instanceof WebSocketHandshakeError &&
        error.statusCode === 403 &&
        adjustClockSkew(error.headers)
      )
        continue;
      throw error;
    }
  }
  throw new Error("Unable to open Edge TTS websocket");
}

// --- Synthesis ---

export async function* streamSynthesis(text, options = {}) {
  const config = createTtsConfig(options);
  const chunks = splitByByteLength(
    escapeXml(removeIncompatibleCharacters(text ?? "")),
  );
  const state = {
    offsetCompensation: 0,
    chunkAudioBytes: 0,
    cumulativeAudioBytes: 0,
  };
  for (const chunk of chunks) {
    state.chunkAudioBytes = 0;
    yield* streamChunk(chunk, config, state);
  }
}

async function* streamChunk(escapedText, config, state) {
  const socket = await openSynthesisSocket(config);
  const queue = new AsyncQueue();
  const context = createSynthesisContext(socket, queue, config, state);
  socket.on("message", (event) => handleSynthesisSocketMessage(event, context));
  socket.on("error", (error) => closeSynthesisContext(context, error));
  socket.on("close", () =>
    closeSynthesisContext(
      context,
      context.audioReceived
        ? null
        : new Error("Connection closed before speech synthesis completed"),
    ),
  );
  socket.sendText(buildConfigMessage(config.boundary));
  socket.sendText(buildSsmlMessage(connectId(), config, escapedText));
  for await (const message of queue) yield message;
  if (!context.audioReceived)
    throw new Error(
      "No audio was received. Please verify that your parameters are correct.",
    );
}

function createSynthesisContext(socket, queue, config, state) {
  const context = {
    socket,
    queue,
    config,
    state,
    audioReceived: false,
    closed: false,
    timeoutId: null,
  };
  resetSynthesisTimeout(context);
  return context;
}

function resetSynthesisTimeout(context) {
  clearTimeout(context.timeoutId);
  context.timeoutId = setTimeout(
    () =>
      closeSynthesisContext(
        context,
        new Error("Edge TTS websocket receive timeout"),
      ),
    context.config.receiveTimeoutMs,
  );
}

function closeSynthesisContext(context, error = null) {
  if (context.closed) return;
  context.closed = true;
  clearTimeout(context.timeoutId);
  context.socket.close();
  context.queue.close(error);
}

function handleSynthesisSocketMessage(event, context) {
  try {
    resetSynthesisTimeout(context);
    const result = parseSynthesisSocketMessage(event, context.state);
    if (result.message) {
      context.audioReceived ||= result.message.type === "audio";
      context.queue.push(result.message);
    }
    if (result.done) closeSynthesisContext(context);
  } catch (error) {
    closeSynthesisContext(context, error);
  }
}

function parseSynthesisSocketMessage(event, state) {
  return event.isBinary
    ? parseSynthesisBinaryMessage(event.data, state)
    : parseSynthesisTextMessage(event.data, state);
}

function parseSynthesisTextMessage(data, state) {
  const { headers, data: body } = parseWssTextPayload(data);
  const path = (headers.Path || "").trim();
  if (path === "audio.metadata")
    return { message: parseMetadata(body, state), done: false };
  if (path === "turn.end") {
    compensateOffset(state);
    return { done: true };
  }
  if (path === "" || path === "response" || path === "turn.start")
    return { done: false };
  throw new Error(`Unknown websocket text path: ${path}`);
}

function parseSynthesisBinaryMessage(payload, state) {
  const { headers, data } = parseWssBinaryPayload(payload);
  const path = (headers.Path || "").trim();
  const contentType = (headers["Content-Type"] || "").trim();
  if (path !== "audio")
    throw new Error("Received binary websocket message without audio path");
  if (!contentType && data.length === 0) return { done: false };
  if (contentType !== "audio/mpeg")
    throw new Error(
      `Unsupported audio content type: ${contentType || "<empty>"}`,
    );
  if (data.length === 0)
    throw new Error("Received audio frame without audio data");
  state.chunkAudioBytes += data.length;
  return { message: { type: "audio", data }, done: false };
}

export async function synthesizeToBuffer(text, options = {}) {
  const chunks = [];
  for await (const message of streamSynthesis(text, options))
    if (message.type === "audio") chunks.push(message.data);
  return Buffer.concat(chunks);
}

export async function synthesizeToFile(text, outputPath, options = {}) {
  await saveToFiles(text, outputPath, null, options);
  return outputPath;
}

export async function saveToFiles(
  text,
  audioPath,
  metadataPath = null,
  options = {},
) {
  await writeSynthesisOutputs(text, { audioPath, metadataPath }, options);
  return audioPath;
}

export async function writeSynthesisOutputs(text, outputs, options = {}) {
  const audioStream = outputs.audioPath
    ? openOutputStream(outputs.audioPath, stdout)
    : null;
  const metadata = [];
  const boundaries = [];
  try {
    for await (const message of streamSynthesis(text, options))
      await collectSynthesisOutput(message, {
        audioStream,
        metadata,
        boundaries,
      });
  } finally {
    if (audioStream && audioStream !== stdout)
      await closeOutputStream(audioStream);
  }
  if (outputs.metadataPath)
    await writeTextOutput(
      outputs.metadataPath,
      formatJsonLines(metadata),
      stderr,
    );
  if (outputs.subtitlePath)
    await writeTextOutput(outputs.subtitlePath, composeSrt(boundaries), stderr);
}

async function collectSynthesisOutput(message, output) {
  if (message.type === "audio") {
    if (output.audioStream) await writeChunk(output.audioStream, message.data);
    return;
  }
  output.boundaries.push(message);
  output.metadata.push(message);
}

// --- Output Writers ---

function openOutputStream(path, stdioStream) {
  return path === "-" ? stdioStream : createWriteStream(path);
}

function writeTextOutput(path, value, stdioStream) {
  if (path === "-") {
    stdioStream.write(value);
    return Promise.resolve();
  }
  return writeFile(path, value);
}

function writeChunk(stream, chunk) {
  return new Promise((resolve, reject) =>
    stream.write(chunk, (error) => (error ? reject(error) : resolve())),
  );
}

function closeOutputStream(stream) {
  return new Promise((resolve, reject) => {
    stream.once("error", reject);
    stream.end(() => {
      stream.off("error", reject);
      resolve();
    });
  });
}

function formatJsonLines(messages) {
  return messages.length === 0
    ? ""
    : `${messages.map((message) => JSON.stringify(message)).join("\n")}\n`;
}

function composeSrt(messages) {
  return messages.filter(isBoundaryMessage).map(formatSrtCue).join("\n");
}

function isBoundaryMessage(message) {
  return message.type === "WordBoundary" || message.type === "SentenceBoundary";
}

function formatSrtCue(message, index) {
  return `${index + 1}\n${ticksToSrtTime(message.offset)} --> ${ticksToSrtTime(message.offset + message.duration)}\n${legalSubtitleContent(message.text)}\n`;
}

function ticksToSrtTime(ticks) {
  const milliseconds = Math.floor(ticks / 10_000);
  const hours = Math.floor(milliseconds / 3_600_000);
  const minutes = Math.floor((milliseconds % 3_600_000) / 60_000);
  const seconds = Math.floor((milliseconds % 60_000) / 1000);
  const ms = milliseconds % 1000;
  return `${pad2(hours)}:${pad2(minutes)}:${pad2(seconds)},${String(ms).padStart(3, "0")}`;
}

function legalSubtitleContent(value) {
  return String(value)
    .replace(/\n\n+/g, "\n")
    .replace(/^\n+|\n+$/g, "");
}

// --- Voices ---

export async function listVoices(options = {}) {
  for (let attempt = 0; attempt < 2; attempt += 1) {
    try {
      return normalizeVoiceList(
        JSON.parse(
          (
            await httpsGetBuffer(
              buildVoiceListUrl(),
              headersWithMuid({
                ...VOICE_HEADERS,
                "Accept-Encoding": "identity",
              }),
              options.timeoutMs ?? 10_000,
            )
          ).toString("utf-8"),
        ),
      );
    } catch (error) {
      if (
        attempt === 0 &&
        error instanceof HttpResponseError &&
        error.statusCode === 403 &&
        adjustClockSkew(error.headers)
      )
        continue;
      throw error;
    }
  }
  throw new Error("Unable to list Edge TTS voices");
}

function normalizeVoiceList(voices) {
  for (const voice of voices) {
    voice.VoiceTag ||= {};
    voice.VoiceTag.ContentCategories ||= [];
    voice.VoiceTag.VoicePersonalities ||= [];
  }
  return voices;
}

// --- Playback ---

async function playFileDetached(outputPath, temporaryBase) {
  const player = selectPlaybackCommand();
  if (!player)
    throw new Error(
      `No MP3 playback command found. Save media with --write-media or install one of: ${PLAYBACK_CANDIDATES.map(playbackCandidateName).join(", ")}.`,
    );
  const launch = player.launch
    ? await player.launch(outputPath, temporaryBase)
    : createBlockingPlaybackLaunch(player, outputPath, temporaryBase);
  const child = spawn(launch.command, launch.args, {
    detached: true,
    stdio: "ignore",
    windowsHide: true,
  });
  child.unref();
}

function selectPlaybackCommand() {
  return PLAYBACK_CANDIDATES.find(isPlaybackCandidateAvailable);
}

function isPlaybackCandidateAvailable(candidate) {
  return candidate.available
    ? candidate.available()
    : commandExists(candidate.command);
}

function playbackCandidateName(candidate) {
  return candidate.label || candidate.command;
}

function commandExists(command) {
  const result = IS_WINDOWS
    ? spawnSync("where", [command], { stdio: "ignore", windowsHide: true })
    : spawnSync(
        "sh",
        ["-c", 'command -v "$1" >/dev/null 2>&1', "check-command", command],
        { stdio: "ignore" },
      );
  return result.status === 0;
}

function createBlockingPlaybackLaunch(player, outputPath, temporaryBase) {
  return IS_WINDOWS
    ? createWindowsBlockingPlaybackLaunch(player, outputPath, temporaryBase)
    : createPosixBlockingPlaybackLaunch(player, outputPath, temporaryBase);
}

function createPosixBlockingPlaybackLaunch(player, outputPath, temporaryBase) {
  return {
    command: "sh",
    args: [
      "-c",
      'file="$1"; dir="$2"; shift 2; "$@"; rm -f "$file"; rmdir "$dir" 2>/dev/null || true',
      "edge-direct-player",
      outputPath,
      temporaryBase,
      player.command,
      ...player.args(outputPath),
    ],
  };
}

function createWindowsBlockingPlaybackLaunch(
  player,
  outputPath,
  temporaryBase,
) {
  return {
    command: "powershell.exe",
    args: [
      "-NoProfile",
      "-ExecutionPolicy",
      "Bypass",
      "-Command",
      "$file=$args[0]; $dir=$args[1]; $cmd=$args[2]; $playerArgs=@(); if ($args.Length -gt 3) { $playerArgs=$args[3..($args.Length-1)] }; & $cmd @playerArgs; Remove-Item -LiteralPath $file -Force -ErrorAction SilentlyContinue; Remove-Item -LiteralPath $dir -Force -ErrorAction SilentlyContinue",
      outputPath,
      temporaryBase,
      player.command,
      ...player.args(outputPath),
    ],
  };
}

async function createWindowsDefaultPlaybackLaunch(outputPath, temporaryBase) {
  const cleanupDelaySeconds = String(
    await estimateCleanupDelaySeconds(outputPath),
  );
  return {
    command: "powershell.exe",
    args: [
      "-NoProfile",
      "-ExecutionPolicy",
      "Bypass",
      "-Command",
      "$file=$args[0]; $dir=$args[1]; $delay=[int]$args[2]; Start-Process -FilePath $file; Start-Sleep -Seconds $delay; Remove-Item -LiteralPath $file -Force -ErrorAction SilentlyContinue; Remove-Item -LiteralPath $dir -Force -ErrorAction SilentlyContinue",
      outputPath,
      temporaryBase,
      cleanupDelaySeconds,
    ],
  };
}

async function estimateCleanupDelaySeconds(outputPath) {
  const info = await stat(outputPath);
  const playbackSeconds = Math.ceil((info.size * 8) / AUDIO.mp3BitrateBps);
  return Math.min(Math.max(playbackSeconds + 30, 120), 3600);
}

async function runPlayback(text, options) {
  const temporaryBase = await mkdtemp(join(tmpdir(), "edge-direct-"));
  const outputPath = join(temporaryBase, `edge-${randomHex(6)}.mp3`);
  try {
    await synthesizeToFile(text, outputPath, options);
    await playFileDetached(outputPath, temporaryBase);
    stdout.write(`${text}\n`);
  } catch (error) {
    await rm(temporaryBase, { recursive: true, force: true }).catch(() => {});
    throw error;
  }
}

// --- CLI ---

function parseCliArgs(args) {
  const parsed = { positionals: [] };
  for (let index = 0; index < args.length; index += 1) {
    const arg = args[index];
    if (CLI_FLAGS.has(arg)) parsed[CLI_FLAGS.get(arg)] = true;
    else if (CLI_VALUES.has(arg))
      parsed[CLI_VALUES.get(arg)] = readOptionValue(args, ++index, arg);
    else if (arg.startsWith("--")) throw new Error(`Unknown option: ${arg}`);
    else parsed.positionals.push(arg);
  }
  return parsed;
}

function readOptionValue(args, index, name) {
  const value = args[index];
  if (value === undefined) throw new Error(`${name} requires a value`);
  return value;
}

function isOptionModeArg(arg) {
  return arg.startsWith("--") || CLI_FLAGS.has(arg) || CLI_VALUES.has(arg);
}

function printHelp() {
  stdout.write(
    `${[
      "Usage:",
      "  say.mjs <text> [lang] [rate] [media.mp3] [metadata.jsonl]",
      "  say.mjs --text <text> [--voice <voice>] [--rate <rate>] [--write-media <path>]",
      "  say.mjs --file <path> --write-media <path> [--write-subtitles <path>]",
      "  say.mjs --list-voices",
      "",
      "Options:",
      "  -t, --text              Text to synthesize",
      "  -f, --file              Read text from file, - means stdin",
      "  -v, --voice             Voice short name or full service voice name",
      "      --lang              Language used for default voice selection",
      "      --rate              Rate: +30% or numeric multiplier, e.g. 1 = +100%",
      "      --volume            Volume: +0% or numeric multiplier",
      "      --pitch             Pitch: +0Hz",
      "      --boundary          SentenceBoundary or WordBoundary",
      "      --write-media       Write MP3 to path, - means stdout",
      "      --write-subtitles   Write SRT subtitles to path, - means stderr",
      "      --write-metadata    Write boundary metadata JSONL to path",
      "",
      "Playback auto-detects: ffplay, mpv, vlc/cvlc, mpg123, afplay, default MP3 app.",
      "If no player exists, use --write-media and play the MP3 externally.",
    ].join("\n")}\n`,
  );
}

async function runOptionCli(options) {
  if (options.help) return printHelp();
  if (options.listVoices)
    return stdout.write(`${JSON.stringify(await listVoices(), null, 2)}\n`);
  const text = await resolveCliText(options);
  if (!text) return;
  const synthesisOptions = createCliSynthesisOptions(options);
  if (!options.writeMedia) return runPlayback(text, synthesisOptions);
  await writeSynthesisOutputs(
    text,
    {
      audioPath: options.writeMedia,
      subtitlePath: options.writeSubtitles,
      metadataPath: options.writeMetadata,
    },
    synthesisOptions,
  );
}

async function resolveCliText(options) {
  if (options.file) return readInputFile(options.file);
  return readText(options.text || "");
}

function createCliSynthesisOptions(options) {
  const language = normalizeLanguage(options.language || DEFAULTS.language);
  return {
    language,
    voice: options.voice || VOICES_BY_LANG[language] || VOICES_BY_LANG.en,
    rate: options.rate,
    volume: options.volume,
    pitch: options.pitch,
    boundary: options.boundary,
  };
}

async function runPositionalCli(args) {
  const text = await readText(args[0] || "");
  if (!text) return;
  const language = normalizeLanguage(args[1]);
  const rate = normalizeRate(args[2]);
  const outputPath = args[3];
  const metadataPath = args[4];
  const voice = VOICES_BY_LANG[language] || VOICES_BY_LANG.en;
  if (!outputPath) return runPlayback(text, { language, rate, voice });
  await saveToFiles(text, outputPath, metadataPath || null, {
    language,
    rate,
    voice,
  });
  if (outputPath !== "-") stdout.write(`${outputPath}\n`);
}

async function readText(value) {
  if (value) return value;
  if (stdin.isTTY) return "";
  let input = "";
  for await (const chunk of stdin) input += chunk;
  return input.replace(/\n/g, "");
}

async function readInputFile(path) {
  if (path === "-" || path === "/dev/stdin") return readText("");
  return readFile(path, "utf-8");
}

async function main() {
  const cliArgs = argv.slice(2);
  if (cliArgs.some(isOptionModeArg)) await runOptionCli(parseCliArgs(cliArgs));
  else await runPositionalCli(cliArgs);
}

function fail(error) {
  stderr.write(`say.mjs failed: ${error?.message || String(error)}\n`);
  exit(1);
}

// --- Entrypoint ---

if (Boolean(argv[1]) && import.meta.url === pathToFileURL(argv[1]).href)
  main().catch(fail);
