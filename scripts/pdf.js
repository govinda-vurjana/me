#!/usr/bin/env node
// Print the downloadable PDFs from the built site with headless Chrome.
//
//   npm run pdf
//
// That builds the site, then prints each page in PDFS to src/assets/pdf/ (commit
// these, so the published site can offer them) and to _site/assets/pdf/ (for the
// local preview). Run it again after changing the cheat sheet or the series.
// Chrome or Edge must be installed; set CHROME_PATH if it isn't found.

import { spawn } from "node:child_process";
import fs from "node:fs";
import http from "node:http";
import os from "node:os";
import path from "node:path";
import { load as loadYaml } from "js-yaml";

const PDFS = [
  { page: "math/cheat-sheet/", file: "math-for-ai-cheat-sheet.pdf", title: "Math for AI, at a glance" },
  { page: "math/calculus-for-ai/print/", file: "calculus-for-ai.pdf", title: "Calculus for AI, from scratch" },
];

const SITE = "_site";
const OUTPUTS = [path.join("src", "assets", "pdf"), path.join(SITE, "assets", "pdf")];
const site = loadYaml(fs.readFileSync("src/_data/site.yaml", "utf8"));
const live = new URL(site.url); // links in the PDFs point here
const prefix = live.pathname; // "/me/"

const CHROMES = [
  process.env.CHROME_PATH,
  "C:/Program Files/Google/Chrome/Application/chrome.exe",
  "C:/Program Files (x86)/Google/Chrome/Application/chrome.exe",
  "C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe",
  "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
  "/usr/bin/google-chrome",
  "/usr/bin/chromium",
  "/usr/bin/chromium-browser",
].filter(Boolean);

// ---- Serve _site under the site's path prefix ------------------------------
const TYPES = { ".html": "text/html; charset=utf-8", ".css": "text/css", ".js": "text/javascript", ".svg": "image/svg+xml", ".woff2": "font/woff2", ".woff": "font/woff", ".ttf": "font/ttf", ".jpg": "image/jpeg", ".png": "image/png" };

function serve() {
  const server = http.createServer((req, res) => {
    const url = decodeURIComponent(req.url.split("?")[0]);
    let file = path.join(SITE, url.startsWith(prefix) ? url.slice(prefix.length) : url);
    if (fs.existsSync(file) && fs.statSync(file).isDirectory()) file = path.join(file, "index.html");
    if (!fs.existsSync(file)) {
      res.writeHead(404);
      return res.end();
    }
    res.writeHead(200, { "Content-Type": TYPES[path.extname(file)] ?? "application/octet-stream" });
    fs.createReadStream(file).pipe(res);
  });
  return new Promise((resolve) => server.listen(0, "127.0.0.1", () => resolve(server)));
}

// ---- A minimal Chrome DevTools Protocol client ------------------------------
function launchChrome() {
  const exe = CHROMES.find((p) => fs.existsSync(p));
  if (!exe) throw new Error("Chrome not found. Set CHROME_PATH to a Chrome or Edge executable.");
  const profile = fs.mkdtempSync(path.join(os.tmpdir(), "pdf-chrome-"));
  const chrome = spawn(exe, ["--headless=new", "--disable-gpu", "--no-first-run", "--no-default-browser-check", `--user-data-dir=${profile}`, "--remote-debugging-port=0", "about:blank"]);
  const endpoint = new Promise((resolve, reject) => {
    let log = "";
    chrome.stderr.on("data", (chunk) => {
      log += chunk;
      const match = log.match(/DevTools listening on (ws:\/\/\S+)/);
      if (match) resolve(match[1]);
    });
    chrome.on("exit", (code) => reject(new Error(`Chrome exited (${code}) before it was ready:\n${log}`)));
  });
  return { chrome, profile, endpoint };
}

function connect(endpoint) {
  const ws = new WebSocket(endpoint);
  const pending = new Map();
  const listeners = new Set();
  let id = 0;
  ws.onmessage = ({ data }) => {
    const msg = JSON.parse(data);
    if (msg.id && pending.has(msg.id)) {
      const { resolve, reject } = pending.get(msg.id);
      pending.delete(msg.id);
      msg.error ? reject(new Error(msg.error.message)) : resolve(msg.result);
    } else {
      for (const listener of listeners) listener(msg);
    }
  };
  const send = (method, params = {}, sessionId) =>
    new Promise((resolve, reject) => {
      pending.set(++id, { resolve, reject });
      ws.send(JSON.stringify({ id, method, params, sessionId }));
    });
  const once = (method, sessionId) =>
    new Promise((resolve) => {
      const listener = (msg) => {
        if (msg.method === method && msg.sessionId === sessionId) {
          listeners.delete(listener);
          resolve(msg.params);
        }
      };
      listeners.add(listener);
    });
  return new Promise((resolve, reject) => {
    ws.onopen = () => resolve({ send, once, close: () => ws.close() });
    ws.onerror = () => reject(new Error("Could not connect to Chrome."));
  });
}

const footer = (title) => `
  <div style="width: 100%; padding: 0 14mm; display: flex; justify-content: space-between; font: 7.5px 'IBM Plex Mono', Consolas, monospace; color: #6b665c;">
    <span>${title} · ${site.author} · ${live.host}${live.pathname}</span>
    <span><span class="pageNumber"></span> / <span class="totalPages"></span></span>
  </div>`;

async function print(cdp, url, title) {
  const { targetId } = await cdp.send("Target.createTarget", { url: "about:blank" });
  const { sessionId } = await cdp.send("Target.attachToTarget", { targetId, flatten: true });
  await cdp.send("Page.enable", {}, sessionId);
  await cdp.send("Emulation.setEmulatedMedia", { media: "print", features: [{ name: "prefers-color-scheme", value: "light" }] }, sessionId);
  const loaded = cdp.once("Page.loadEventFired", sessionId);
  await cdp.send("Page.navigate", { url }, sessionId);
  await loaded;
  // Wait for web fonts, then point links at the published site instead of this
  // temporary server. In-document links (#...) stay as they are.
  await cdp.send("Runtime.evaluate", {
    awaitPromise: true,
    expression: `document.fonts.ready.then(() => {
      for (const a of document.querySelectorAll("a[href]")) {
        if (a.getAttribute("href").startsWith("#") || a.origin !== location.origin) continue;
        a.href = new URL(a.pathname + a.search + a.hash, ${JSON.stringify(live.origin)}).href;
      }
    })`,
  }, sessionId);
  const { data } = await cdp.send("Page.printToPDF", {
    preferCSSPageSize: true,
    printBackground: true,
    displayHeaderFooter: true,
    headerTemplate: "<span></span>",
    footerTemplate: footer(title),
  }, sessionId);
  await cdp.send("Target.closeTarget", { targetId });
  return Buffer.from(data, "base64");
}

// ---- Main ---------------------------------------------------------------------
if (!fs.existsSync(path.join(SITE, "index.html"))) {
  console.log("No built site in _site. Run `npm run build` first, or use `npm run pdf`.");
  process.exit(1);
}

const server = await serve();
const base = `http://127.0.0.1:${server.address().port}${prefix}`;
const { chrome, profile, endpoint } = launchChrome();
try {
  const cdp = await connect(await endpoint);
  for (const dir of OUTPUTS) fs.mkdirSync(dir, { recursive: true });
  for (const pdf of PDFS) {
    const bytes = await print(cdp, base + pdf.page, pdf.title);
    for (const dir of OUTPUTS) fs.writeFileSync(path.join(dir, pdf.file), bytes);
    console.log(`Wrote ${pdf.file} (${Math.round(bytes.length / 1024)} KB) from /${pdf.page}`);
  }
  cdp.close();
} finally {
  chrome.kill();
  server.close();
  // Chrome can hold its profile for a moment after exiting.
  setTimeout(() => fs.rmSync(profile, { recursive: true, force: true, maxRetries: 5 }), 500);
}
