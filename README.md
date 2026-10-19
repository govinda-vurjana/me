# Research notebook

Source for <https://govinda-vurjana.github.io/me/>: experiments, AI memory, mathematics, and books, on how machines remember, retrieve, and think.

The site is built with [Eleventy](https://www.11ty.dev/) from Markdown files. Every push to `main` rebuilds and publishes it through GitHub Actions.

## Sections

The site has five sections: **Experiments · AI Memory · Math · About · Books**.

| Section | What appears there | Where it comes from |
|---|---|---|
| Experiments | Every entry with `kind: experiment`, then the GitHub projects | `src/notebook/*.md`, `src/_data/projects.yaml` |
| AI Memory | Intro, timeline of topics, papers, and writing in `memory` | `src/memory.md`, `src/topics/*.md`, `src/notebook/*.md` |
| Math | The same, for `math` | `src/math.md`, `src/topics/*.md`, `src/notebook/*.md` |
| About | About page | `src/about.njk` |
| Books | Books being read and read, by year | `src/_data/books.yaml` |

- **Entries** (`src/notebook/*.md`) are dated writing. Each has a `kind` (`thought`, `note`, `experiment`, or `paper`).
- **Topics** (`src/topics/*.md`) are lines of research inside a section, such as two months on recurrent networks. Each has a `section`, a start date, an optional end date, a status, and a `log` of short dated notes. Its page shows a timeline that merges the log with every entry in the topic, and the section page draws every topic on one chart.
- An entry appears in its topic's section. Add `section: math` (or `memory`) to show it in a section without a topic, or in a second one as well. Experiments always appear under Experiments. `/notebook/` lists everything.

## Everyday use

```sh
npm install                 # once
npm run dev                 # live preview at http://localhost:8080/me/
```

Create things with `npm run new`. The last argument is a section (`memory` or `math`) or a topic (its file name without `.md`):

```sh
npm run new topic      "Recurrent networks"                    memory
npm run new note       "Backpropagation through time"          recurrent-networks
npm run new experiment "Copy task on an LSTM"                  recurrent-networks
npm run new note       "The Hopfield energy never increases"   math
npm run new thought    "Is attention retrieval?"               memory
npm run new paper      "Forgetting as memory"                  memory
```

Publish by committing and pushing to `main`. The site updates about a minute later.

### Books

Add a book to `src/_data/books.yaml`:

```yaml
- title: Thinking, Fast and Slow
  author: Daniel Kahneman
  status: read          # reading | read
  started: 2026-09
  finished: 2026-10
  note: One or two lines on what stayed with me.
  cover: /assets/img/books/thinking-fast-and-slow.jpg   # optional, image in src/assets/img/books/
```

### A quick dated line, without a new file

Add a line to the topic's `log`:

```yaml
log:
  - date: 2026-10-20
    text: Read Hopfield (1982). The energy view is the clearest picture of recall I have seen.
```

### The math cheat sheet and PDFs

`/math/cheat-sheet/` is built from `src/_data/cheatsheet.yaml`: each concept with its formula, the idea in a sentence, and where it shows up in AI. Add a card or a section there as new mathematics is covered.

The downloadable PDFs live in `src/assets/pdf/` and are committed. After changing the cheat sheet or the calculus series, print them again and commit the result:

```sh
npm run pdf      # builds the site, then prints both PDFs with headless Chrome
```

`math-for-ai-cheat-sheet.pdf` is printed from the cheat sheet page. `calculus-for-ai.pdf` is printed from `/math/calculus-for-ai/print/`, an unlinked page that puts the topic and all its parts in one document. Chrome or Edge must be installed; set `CHROME_PATH` if the script can't find it.

### Starting, pausing, and finishing a topic

Set `status` to `exploring`, `paused`, or `concluded`. To finish one, add `ended: YYYY-MM-DD` and a one-line `conclusion:`. The duration (“2 months”) and its bar on the timeline follow automatically. A topic with `status: planned` stays out of the published site until you start it.

## Front matter reference

| Field | Used on | Meaning |
|---|---|---|
| `title` | all | Title |
| `date` | entries | Date of the entry (`YYYY-MM-DD`) |
| `kind` | entries | `thought`, `note`, `experiment`, or `paper` |
| `topic` | entries | Topic this belongs to (its file name) |
| `section` | entries, topics | `memory` or `math`. Topics default to `memory` |
| `summary` | all | One sentence shown in lists and link previews |
| `status` | experiments, topics | Experiments: `running`, `complete`, or `abandoned`. Topics: see above |
| `result` | experiments | The one-line finding, shown at the top and on the timeline |
| `repo`, `notebook`, `dataset`, `demo` | entries | Links shown as buttons |
| `authors`, `venue`, `abstract`, `pdf`, `arxiv` | papers | Paper details; a BibTeX entry is generated |
| `started`, `ended`, `conclusion`, `log` | topics | See above |
| `resources` | topics | Links (`label`, `url`) shown as buttons on the topic page and on every entry in it |
| `draft: true` | anything, books too | Visible in `npm run dev`, never published |

## Writing

Entries are plain Markdown, plus:

- **Math**, rendered at build time with KaTeX: `$x_t$` inline, `$$ ... $$` for display.
- **Figures**: put images in `src/assets/img/` and write `![Alt text](/assets/img/plot.png "Figure 1. Caption.")`. An image on its own line becomes a figure, and its quoted title becomes the caption.
- **Callouts**:
  ```
  ::: callout Finding
  The plain RNN collapses suddenly; the LSTM degrades slowly.
  :::
  ```
- **Footnotes**: `text[^1]` and, at the end, `[^1]: The note.`
- **Code**: fenced blocks with a language (```` ```python ````) are highlighted.
- **Papers**: put the PDF in `src/assets/papers/` and set `pdf: /assets/papers/name.pdf`.

## Examples

`src/topics/examples/`, `src/notebook/examples/`, and the books marked `draft: true` are examples: a finished two-month topic, an overlapping ongoing one, a math topic, notes with math, an experiment with a table and figure, a paper, and two books. They appear only in `npm run dev`. Delete the two folders, `src/assets/img/examples/`, and the example books when you no longer need them.

## Setup and structure

GitHub Pages must publish from Actions: **Settings → Pages → Source: GitHub Actions**. The workflow is `.github/workflows/publish.yml`.

```
src/
  _data/          site.yaml (name, links, URL), projects.yaml, books.yaml
  _includes/      layouts and shared template pieces
  topics/         one Markdown file per topic
  notebook/       one Markdown file per entry
  memory.md       the AI Memory page's intro
  math.md         the Math page's intro
  assets/         css, js, images, papers
eleventy.config.js   Markdown setup, sections, collections, timeline logic
scripts/new.js       the `npm run new` command
scripts/pdf.js       the `npm run pdf` command
```

To publish somewhere else, such as a custom domain, change `url` in `src/_data/site.yaml`; every link follows it.
