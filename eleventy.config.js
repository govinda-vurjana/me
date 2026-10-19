import fs from "node:fs";
import { load as loadYaml } from "js-yaml";
import { HtmlBasePlugin } from "@11ty/eleventy";
import { feedPlugin } from "@11ty/eleventy-plugin-rss";
import syntaxHighlight from "@11ty/eleventy-plugin-syntaxhighlight";
import markdownItAnchor from "markdown-it-anchor";
import markdownItContainer from "markdown-it-container";
import markdownItFootnote from "markdown-it-footnote";
import markdownItKatexModule from "@vscode/markdown-it-katex";
import katex from "katex";

const markdownItKatex = markdownItKatexModule.default ?? markdownItKatexModule;
const site = loadYaml(fs.readFileSync("src/_data/site.yaml", "utf8"));
const BUILT_AT = new Date();

// ---------------------------------------------------------------------------
// Dates. Front matter dates arrive as Date objects (UTC midnight); hand-typed
// months like "2026-10" arrive as strings. Everything is formatted in UTC so a
// date never shifts by a day depending on where the site is built.
// ---------------------------------------------------------------------------
function toDate(value) {
  if (!value) return null;
  if (value instanceof Date) return value;
  const s = String(value).trim();
  if (s === "now" || s === "present") return BUILT_AT;
  if (/^\d{4}-\d{2}$/.test(s)) return new Date(`${s}-01T00:00:00Z`);
  if (/^\d{4}$/.test(s)) return new Date(`${s}-01-01T00:00:00Z`);
  return new Date(s);
}

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

// fmt(date, "d m y") -> "17 Oct 2026"; any of d, m, y may be left out.
function fmt(value, pattern) {
  const d = toDate(value);
  if (!d) return "";
  const parts = { d: d.getUTCDate(), m: MONTHS[d.getUTCMonth()], y: d.getUTCFullYear() };
  return pattern.split(" ").map((k) => parts[k]).join(" ");
}

const fmtDay = (d) => fmt(d, "d m y"); // 17 Oct 2026
const fmtMonth = (d) => fmt(d, "m y"); // Oct 2026

function isMonthOnly(value) {
  return typeof value === "string" && /^\d{4}-\d{2}$/.test(value.trim());
}

function duration(start, end) {
  const a = toDate(start);
  const b = toDate(end) ?? BUILT_AT;
  if (!a) return "";
  const days = Math.max(1, Math.round((b - a) / 86400000));
  if (days < 14) return `${days} day${days === 1 ? "" : "s"}`;
  if (days < 42) return `${Math.round(days / 7)} weeks`;
  const months = Math.round(days / 30.44);
  if (months < 12) return `${months} month${months === 1 ? "" : "s"}`;
  const years = Math.floor(months / 12);
  const rest = months % 12;
  return `${years} yr${years === 1 ? "" : "s"}${rest ? ` ${rest} mo` : ""}`;
}

function span(start, end) {
  if (!start) return "Not started";
  const a = fmtMonth(start);
  const b = end ? fmtMonth(end) : "present";
  return a === b ? a : `${a} – ${b}`;
}

const KIND_LABELS = { thought: "Thought", note: "Note", experiment: "Experiment", paper: "Paper" };

// The site's sections. Topics belong to one; entries appear in their topic's
// section, in any they list under `section:`, and experiments in Experiments.
const SECTIONS = {
  experiments: { label: "Experiments", url: "/experiments/" },
  memory: { label: "AI Memory", url: "/memory/" },
  math: { label: "Math", url: "/math/" },
};

function entrySections(entry, topics = []) {
  const topic = topics.find((t) => t.fileSlug === entry.data.topic);
  const own = [].concat(entry.data.section ?? []);
  return [...new Set([...(topic ? [topic.data.section] : []), ...own])];
}
const STATUS_LABELS = { exploring: "Exploring", paused: "Paused", planned: "Planned", concluded: "Concluded" };

// ---------------------------------------------------------------------------
// Research timeline: one horizontal track per topic, positioned by date.
// ---------------------------------------------------------------------------
const MIN_MONTHS = 6;
const startOfMonth = (d) => new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), 1));
const addMonths = (d, n) => new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth() + n, 1));

function timelineChart(topics, entries = []) {
  const dated = topics.filter((t) => t.data.started);
  if (!dated.length) return null;

  const starts = dated.map((t) => toDate(t.data.started));
  const ends = dated.map((t) => toDate(t.data.ended) ?? BUILT_AT);
  const last = new Date(Math.max(BUILT_AT, ...ends));
  const axisEnd = addMonths(startOfMonth(last), 1);
  let axisStart = startOfMonth(new Date(Math.min(...starts)));
  if (addMonths(axisStart, MIN_MONTHS) > axisEnd) axisStart = addMonths(axisEnd, -MIN_MONTHS);

  const total = axisEnd - axisStart;
  const pct = (d) => +(((toDate(d) - axisStart) / total) * 100).toFixed(3);

  const months = [];
  for (let m = axisStart; m < axisEnd; m = addMonths(m, 1)) months.push(m);
  const every = months.length <= 9 ? 1 : months.length <= 24 ? 3 : 12;
  const ticks = months
    .filter((m) => m.getUTCMonth() % every === 0 || every === 1)
    .map((m, i) => ({
      left: pct(m),
      label: i === 0 || m.getUTCMonth() === 0 ? fmt(m, "m y") : fmt(m, "m"),
    }));

  const rows = dated
    .sort((a, b) => toDate(a.data.started) - toDate(b.data.started))
    .map((topic) => {
      const left = pct(topic.data.started);
      const right = pct(topic.data.ended ?? BUILT_AT);
      return {
        topic,
        left,
        width: Math.max(right - left, 0.8),
        ongoing: !topic.data.ended,
        marks: entries
          .filter((e) => e.data.topic === topic.fileSlug)
          .map((e) => ({ left: pct(e.date), entry: e })),
      };
    });

  return { ticks, rows, now: pct(BUILT_AT) };
}

// Everything that happened inside one topic, oldest first.
function topicEvents(topic, entries = []) {
  const d = topic.data;
  const events = [];
  if (d.started) events.push({ date: toDate(d.started), type: "start" });
  for (const item of d.log ?? []) {
    events.push({ date: toDate(item.date), type: "log", text: item.text, monthOnly: isMonthOnly(item.date) });
  }
  for (const entry of entries.filter((e) => e.data.topic === topic.fileSlug)) {
    events.push({ date: entry.date, type: entry.data.kind ?? "note", entry });
  }
  if (d.ended) events.push({ date: toDate(d.ended), type: "end", text: d.conclusion ?? "Topic closed." });
  // Dates are UTC, so a build in the early hours of a local day can come
  // before that day's entries. "Now" still belongs at the end.
  else if (d.started) events.push({ date: new Date(Math.max(BUILT_AT, ...events.map((e) => e.date))), type: "now" });
  events.sort((a, b) => a.date - b.date);

  // Make long silences visible: "3 weeks later", "2 months later".
  for (let i = 1; i < events.length; i++) {
    const days = (events[i].date - events[i - 1].date) / 86400000;
    if (days >= 21) {
      const later = duration(events[i - 1].date, events[i].date);
      events[i].gap = `${later} later`;
    }
  }
  return events;
}

// ---------------------------------------------------------------------------
// Markdown: figures from lone images, ::: callouts, math, footnotes, anchors.
// ---------------------------------------------------------------------------
function escapeHtml(s) {
  return String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]);
}

// A paragraph that holds a single image becomes a <figure>; the image title
// becomes its caption:  ![Loss curve](/assets/img/loss.png "Figure 1. Loss.")
function markdownItFigures(md) {
  md.core.ruler.push("figures", (state) => {
    const t = state.tokens;
    for (let i = 1; i < t.length - 1; i++) {
      const inline = t[i];
      if (inline.type !== "inline" || t[i - 1].type !== "paragraph_open" || t[i + 1].type !== "paragraph_close") continue;
      const kids = (inline.children ?? []).filter((c) => !(c.type === "text" && c.content.trim() === "") && c.type !== "softbreak");
      if (kids.length !== 1 || kids[0].type !== "image") continue;
      t[i - 1].tag = t[i + 1].tag = "figure";
      const title = kids[0].attrGet("title");
      if (title) {
        kids[0].attrs = kids[0].attrs.filter(([name]) => name !== "title");
        const caption = new state.Token("html_inline", "", 0);
        caption.content = `<figcaption>${escapeHtml(title)}</figcaption>`;
        inline.children.push(caption);
      }
    }
  });
}

function callout(md) {
  md.use(markdownItContainer, "callout", {
    validate: () => true,
    render(tokens, idx) {
      const t = tokens[idx];
      if (t.nesting === -1) return "</aside>\n";
      const label = t.info.trim().replace(/^callout\s*/, "") || "Note";
      return `<aside class="callout"><p class="callout-label">${escapeHtml(label)}</p>\n`;
    },
  });
}

export default function (eleventyConfig) {
  eleventyConfig.addDataExtension("yaml,yml", (contents) => loadYaml(contents));

  // Drafts, and topics only planned so far, render in `npm run dev` and are
  // left out of the published site.
  eleventyConfig.addPreprocessor("drafts", "*", (data) => {
    if ((data.draft || data.status === "planned") && process.env.ELEVENTY_RUN_MODE === "build") return false;
  });
  const isDev = () => process.env.ELEVENTY_RUN_MODE !== "build";
  eleventyConfig.addGlobalData("isDev", isDev);
  eleventyConfig.addGlobalData("sections", SECTIONS);
  eleventyConfig.addGlobalData("builtAt", BUILT_AT);

  eleventyConfig.addPlugin(HtmlBasePlugin);
  eleventyConfig.addPlugin(syntaxHighlight);
  eleventyConfig.addPlugin(feedPlugin, {
    type: "atom",
    outputPath: "/feed.xml",
    collection: { name: "entries", limit: 30, sort: "descending" },
    metadata: {
      language: "en",
      title: site.title,
      subtitle: site.description,
      // The plugin adds the path prefix (/me/) itself, so it wants the bare origin.
      base: new URL(site.url).origin + "/",
      author: { name: site.author },
    },
  });

  const slugify = eleventyConfig.getFilter("slugify");
  eleventyConfig.amendLibrary("md", (md) => {
    md.set({ typographer: true, linkify: true });
    md.use(markdownItKatex, { throwOnError: false });
    md.use(markdownItFootnote);
    md.use(markdownItFigures);
    md.use(callout);
    md.use(markdownItAnchor, {
      level: [2, 3],
      slugify: (s) => slugify(s),
      permalink: markdownItAnchor.permalink.headerLink({ class: "heading-link" }),
    });
  });

  // ---- Collections --------------------------------------------------------
  eleventyConfig.addCollection("entries", (api) =>
    api.getFilteredByGlob("src/notebook/**/*.md").sort((a, b) => b.date - a.date)
  );
  const STATUS_ORDER = { exploring: 0, paused: 1, planned: 2, concluded: 3 };
  eleventyConfig.addCollection("topics", (api) =>
    api
      .getFilteredByGlob("src/topics/**/*.md")
      .sort(
        (a, b) =>
          (STATUS_ORDER[a.data.status] ?? 9) - (STATUS_ORDER[b.data.status] ?? 9) ||
          (toDate(b.data.started) ?? 0) - (toDate(a.data.started) ?? 0)
      )
  );

  // ---- Filters ------------------------------------------------------------
  eleventyConfig.addFilter("day", fmtDay);
  eleventyConfig.addFilter("month", fmtMonth);
  eleventyConfig.addFilter("dayOrMonth", (d, monthOnly) => (monthOnly ? fmtMonth(d) : fmtDay(d)));
  eleventyConfig.addFilter("shortDay", (d) => fmt(d, "d m"));
  eleventyConfig.addFilter("year", (d) => toDate(d)?.getUTCFullYear());
  eleventyConfig.addFilter("iso", (d) => toDate(d)?.toISOString().slice(0, 10));
  eleventyConfig.addFilter("duration", duration);
  eleventyConfig.addFilter("span", span);
  eleventyConfig.addFilter("timelineChart", timelineChart);
  eleventyConfig.addFilter("topicEvents", topicEvents);
  eleventyConfig.addFilter("absUrl", (url) => new URL(String(url).replace(/^\//, ""), site.url).href);
  eleventyConfig.addFilter("readingTime", (html) => {
    const words = String(html ?? "").replace(/<[^>]+>/g, " ").split(/\s+/).filter(Boolean).length;
    return `${Math.max(1, Math.round(words / 220))} min read`;
  });
  eleventyConfig.addFilter("limit", (arr, n) => (arr ?? []).slice(0, n));
  eleventyConfig.addFilter("where", (arr, key, value) =>
    (arr ?? []).filter((item) => key.split(".").reduce((o, k) => o?.[k], item) === value)
  );
  eleventyConfig.addFilter("inStatus", (topics, ...statuses) =>
    (topics ?? []).filter((t) => statuses.includes(t.data.status))
  );
  eleventyConfig.addFilter("forTopic", (entries, slug) => (entries ?? []).filter((e) => e.data.topic === slug));
  eleventyConfig.addFilter("findTopic", (topics, slug) => (topics ?? []).find((t) => t.fileSlug === slug));
  eleventyConfig.addFilter("findByUrl", (items, url) => (items ?? []).find((i) => i.url === url));
  eleventyConfig.addFilter("inSection", (entries, section, topics) =>
    (entries ?? []).filter((e) => entrySections(e, topics).includes(section))
  );
  // The section an entry's page belongs under: Experiments for experiments,
  // otherwise its first section. Undefined when it has none.
  eleventyConfig.addFilter("homeSection", (entry, topics) =>
    entry.data.kind === "experiment" ? "experiments" : entrySections(entry, topics)[0]
  );
  eleventyConfig.addFilter("rejectKind", (entries, kind) => (entries ?? []).filter((e) => e.data.kind !== kind));
  // Books: those being read (latest started first), then finished ones by year.
  eleventyConfig.addFilter("readingList", (books) => {
    const byDate = (key) => (a, b) => (toDate(b[key]) ?? 0) - (toDate(a[key]) ?? 0);
    const reading = (books ?? []).filter((b) => b.status !== "read").sort(byDate("started"));
    const read = [];
    for (const b of (books ?? []).filter((b) => b.status === "read").sort(byDate("finished"))) {
      const year = toDate(b.finished)?.getUTCFullYear() ?? "Undated";
      if (read.at(-1)?.year !== year) read.push({ year, items: [] });
      read.at(-1).items.push(b);
    }
    return { reading, read };
  });
  // Hand-written data (books) can mark items `draft: true` as well.
  eleventyConfig.addFilter("published", (items) => (isDev() ? items ?? [] : (items ?? []).filter((i) => !i.draft)));
  eleventyConfig.addFilter("groupByYear", (entries) => {
    const groups = [];
    for (const e of entries ?? []) {
      const y = e.date.getUTCFullYear();
      if (groups.at(-1)?.year !== y) groups.push({ year: y, items: [] });
      groups.at(-1).items.push(e);
    }
    return groups;
  });
  eleventyConfig.addFilter("hasMath", (html) => String(html ?? "").includes('class="katex'));
  // Maths in data files (the cheat sheet): `tex` renders one formula, `mathText`
  // renders plain text with $inline$ maths in it.
  const renderTex = (tex, displayMode) => katex.renderToString(String(tex ?? ""), { displayMode, throwOnError: false });
  eleventyConfig.addFilter("tex", (tex, display = false) => renderTex(tex, display));
  eleventyConfig.addFilter("mathText", (text) =>
    String(text ?? "")
      .split(/(\$[^$]+\$)/)
      .map((part) => (/^\$[^$]+\$$/.test(part) ? renderTex(part.slice(1, -1), false) : escapeHtml(part)))
      .join("")
  );
  // The print edition puts several pages into one document. `scopeIds` keeps
  // their ids (headings, footnotes) unique, and `bookLinks` turns links to pages
  // inside the document into links to their sections.
  eleventyConfig.addFilter("scopeIds", (html, prefix) =>
    String(html ?? "").replace(/\b(id="|href="#)([^"]+)"/g, (_, attr, id) => `${attr}${prefix}-${id}"`)
  );
  // The topic's own page becomes #start; each entry becomes #<its slug>.
  eleventyConfig.addFilter("bookLinks", (html, topic, entries) => {
    const anchors = new Map([[topic.url, "start"], ...entries.map((e) => [e.url, e.fileSlug])]);
    return String(html ?? "").replace(/href="(\/[^"#]*)"/g, (link, url) => (anchors.has(url) ? `href="#${anchors.get(url)}"` : link));
  });
  eleventyConfig.addFilter("kindLabel", (kind) => KIND_LABELS[kind] ?? kind);
  eleventyConfig.addFilter("statusLabel", (status) => STATUS_LABELS[status] ?? status);
  // Entries are newest first, so "older" is the next item and "newer" the previous.
  eleventyConfig.addFilter("neighbours", (entries, url) => {
    const i = (entries ?? []).findIndex((e) => e.url === url);
    return i < 0 ? {} : { older: entries[i + 1], newer: entries[i - 1] };
  });
  eleventyConfig.addFilter("bibtexKey", (title, date, author) => {
    const surname = String(author ?? "").trim().split(/\s+/).at(-1).toLowerCase();
    const word = String(title ?? "").toLowerCase().match(/[a-z]{4,}/)?.[0] ?? "paper";
    return `${surname}${toDate(date).getUTCFullYear()}${word}`;
  });

  // ---- Static files -------------------------------------------------------
  eleventyConfig.addPassthroughCopy("src/assets");
  eleventyConfig.addPassthroughCopy("src/favicon.svg");
  eleventyConfig.addPassthroughCopy({
    "node_modules/katex/dist/katex.min.css": "assets/vendor/katex/katex.min.css",
    "node_modules/katex/dist/fonts": "assets/vendor/katex/fonts",
  });

  eleventyConfig.addWatchTarget("src/assets/");
}

export const config = {
  dir: { input: "src", output: "_site", includes: "_includes", data: "_data" },
  // Markdown is plain Markdown: no template tags, so LaTeX and code are safe.
  markdownTemplateEngine: false,
  htmlTemplateEngine: "njk",
  pathPrefix: new URL(site.url).pathname,
};
