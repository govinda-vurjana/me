#!/usr/bin/env node
// Create a new notebook entry or topic from a template.
//
//   npm run new thought    "Is memory a place or a process?"     [where]
//   npm run new note       "Backpropagation through time"         [where]
//   npm run new experiment "Copy task on an LSTM"                 [where]
//   npm run new paper      "A note on gated memory"               [where]
//   npm run new topic      "Associative memory"                   [memory|math]
//
// `where` is a section (memory or math) or a topic (its file name in
// src/topics/, without .md). An entry in a topic appears in that topic's
// section and on its timeline. A new topic goes in AI Memory unless told math.

import fs from "node:fs";
import path from "node:path";

const [kind, title, where] = process.argv.slice(2);
const KINDS = ["thought", "note", "experiment", "paper", "topic"];
const SECTIONS = ["memory", "math"];
const TOPICS_DIR = path.join("src", "topics");

if (!KINDS.includes(kind) || !title) {
  console.log(`Usage: npm run new <${KINDS.join("|")}> "Title" [memory|math|topic-name]`);
  process.exit(1);
}

// Local date, not UTC, so an entry written in the morning gets today's date.
const now = new Date();
const today = [now.getFullYear(), now.getMonth() + 1, now.getDate()].map((n) => String(n).padStart(2, "0")).join("-");
const slug = title
  .toLowerCase()
  .normalize("NFKD")
  .replace(/[^\w\s-]/g, "")
  .trim()
  .replace(/[\s_-]+/g, "-")
  .slice(0, 60)
  .replace(/-+$/, "");
const q = (s) => JSON.stringify(s);

const knownTopics = () =>
  fs.readdirSync(TOPICS_DIR).filter((f) => f.endsWith(".md")).map((f) => f.slice(0, -3));

let placeLine = `# topic: topic-name   # or section: memory | math\n`;
if (kind === "topic") {
  if (where && !SECTIONS.includes(where)) {
    console.log(`A topic goes in a section: ${SECTIONS.join(" or ")}.`);
    process.exit(1);
  }
} else if (SECTIONS.includes(where)) {
  placeLine = `section: ${where}\n`;
} else if (where) {
  if (!fs.existsSync(path.join(TOPICS_DIR, `${where}.md`))) {
    console.log(`"${where}" is neither a section (${SECTIONS.join(", ")}) nor a topic. Topics: ${knownTopics().join(", ") || "(none yet)"}`);
    process.exit(1);
  }
  placeLine = `topic: ${where}\n`;
}
const mathHint = placeLine === "section: math\n" ? "# Math: $x_t$ inline; put $$ on its own line before and after a display equation.\n" : "";

const templates = {
  thought: `---
title: ${q(title)}
date: ${today}
kind: thought
${placeLine}---

Write the thought as it is. It doesn't need to be finished.
`,

  note: `---
title: ${q(title)}
date: ${today}
kind: note
${placeLine}summary: One sentence on what this note explains.
${mathHint}---

## The idea

## Why it matters here

## References
`,

  experiment: `---
title: ${q(title)}
date: ${today}
kind: experiment
${placeLine}status: running          # running | complete | abandoned
summary: One sentence on what you are testing.
# result: The one-line finding, once you have it. Shown at the top and on the timeline.
# repo: https://github.com/govinda-vurjana/...
# notebook: https://colab.research.google.com/...
---

## Aim

## Setup

## Results

## What I learned

## Next
`,

  paper: `---
title: ${q(title)}
date: ${today}
kind: paper
${placeLine}authors: [Govinda Vurjana]
venue: Preprint
summary: One sentence for lists and link previews.
abstract: >
  The abstract, as it appears in the paper.
# pdf: /assets/papers/${slug}.pdf     # put the file in src/assets/papers/
# arxiv: https://arxiv.org/abs/...
# repo: https://github.com/govinda-vurjana/...
---

Notes on the paper: how it came about, what changed between drafts, what is still open.
`,

  topic: `---
title: ${q(title)}
section: ${where ?? "memory"}           # memory | math
status: exploring        # exploring | paused | planned | concluded
started: ${today}
# ended: YYYY-MM-DD
# conclusion: One or two sentences on where it landed. Shown when it ends.
summary: One sentence on what this topic covers.
log:
  - date: ${today}
    text: Started.
---

What this topic is about and why it matters.
`,
};

const file =
  kind === "topic"
    ? path.join(TOPICS_DIR, `${slug}.md`)
    : path.join("src", "notebook", `${today}-${slug}.md`);

if (fs.existsSync(file)) {
  console.log(`${file} already exists. Pick a different title or edit that file.`);
  process.exit(1);
}

fs.writeFileSync(file, templates[kind]);
console.log(`Created ${file}`);
if (kind === "topic") console.log(`Add entries to it with:  npm run new note "Title" ${slug}`);
