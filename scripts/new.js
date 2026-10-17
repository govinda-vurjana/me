#!/usr/bin/env node
// Create a new notebook entry or inquiry from a template.
//
//   npm run new thought    "Is memory a place or a process?"   [inquiry-slug]
//   npm run new note       "Backpropagation through time"       [inquiry-slug]
//   npm run new experiment "Copy task on an LSTM"               [inquiry-slug]
//   npm run new paper      "A note on gated memory"             [inquiry-slug]
//   npm run new inquiry    "Associative memory"
//
// The optional last argument links the entry to an inquiry (its file name in
// src/inquiries/, without .md).

import fs from "node:fs";
import path from "node:path";

const [kind, title, inquiry] = process.argv.slice(2);
const KINDS = ["thought", "note", "experiment", "paper", "inquiry"];

if (!KINDS.includes(kind) || !title) {
  console.log(`Usage: npm run new <${KINDS.join("|")}> "Title" [inquiry-slug]`);
  process.exit(1);
}

const today = new Date().toISOString().slice(0, 10);
const slug = title
  .toLowerCase()
  .normalize("NFKD")
  .replace(/[^\w\s-]/g, "")
  .trim()
  .replace(/[\s_-]+/g, "-")
  .slice(0, 60)
  .replace(/-+$/, "");
const q = (s) => JSON.stringify(s);

if (inquiry && !fs.existsSync(path.join("src", "inquiries", `${inquiry}.md`))) {
  const known = fs.readdirSync(path.join("src", "inquiries")).filter((f) => f.endsWith(".md")).map((f) => f.slice(0, -3));
  console.log(`No inquiry called "${inquiry}". Known inquiries: ${known.join(", ") || "(none yet)"}`);
  process.exit(1);
}
const inquiryLine = inquiry ? `inquiry: ${inquiry}\n` : `# inquiry: memory-systems   # link this entry to an inquiry\n`;

const templates = {
  thought: `---
title: ${q(title)}
date: ${today}
kind: thought
${inquiryLine}---

Write the thought as it is. It doesn't need to be finished.
`,

  note: `---
title: ${q(title)}
date: ${today}
kind: note
${inquiryLine}summary: One sentence on what this note explains.
---

## The idea

## Why it matters here

## References
`,

  experiment: `---
title: ${q(title)}
date: ${today}
kind: experiment
${inquiryLine}status: running          # running | complete | abandoned
summary: One sentence on what you are testing.
# result: The one-line finding, once you have it. Shown at the top and on the timeline.
# repo: https://github.com/govinda-vurjana/...
# notebook: https://colab.research.google.com/...
---

## Question

## Setup

## Results

## What I learned

## Next
`,

  paper: `---
title: ${q(title)}
date: ${today}
kind: paper
${inquiryLine}authors: [Govinda Vurjana]
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

  inquiry: `---
title: ${q(title)}
question: The plain question this starts from?
status: exploring        # exploring | paused | planned | concluded
started: ${today}
# ended: YYYY-MM-DD
# conclusion: One or two sentences on where it landed. Shown when it ends.
summary: One sentence for link previews.
log:
  - date: ${today}
    text: Started.
---

Why this question, and what I think going in.
`,
};

const file =
  kind === "inquiry"
    ? path.join("src", "inquiries", `${slug}.md`)
    : path.join("src", "notebook", `${today}-${slug}.md`);

if (fs.existsSync(file)) {
  console.log(`${file} already exists. Pick a different title or edit that file.`);
  process.exit(1);
}

fs.writeFileSync(file, templates[kind]);
console.log(`Created ${file}`);
if (kind === "inquiry") console.log(`Link entries to it with:  inquiry: ${slug}`);
