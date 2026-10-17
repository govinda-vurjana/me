# Research notebook

Source for <https://govinda-vurjana.github.io/me/>: questions, inquiries, experiments, and papers on how machines remember, retrieve, and think.

The site is built with [Eleventy](https://www.11ty.dev/) from Markdown files. Every push to `main` rebuilds and publishes it through GitHub Actions.

## How the content fits together

```
Question  ──►  Inquiry  ──►  Notebook entries: thought · note · experiment · paper
(one line)     (a dated line of research with its own timeline)
```

- **Questions** (`src/_data/questions.yaml`) are one-line “what if”s, kept in a single list.
- **Inquiries** (`src/inquiries/*.md`) are questions you decide to pursue. Each has a start date, an optional end date, a status, and a `log` of short dated thoughts. Its page shows a timeline that merges the log with every notebook entry linked to it. The Inquiries page charts all of them over time.
- **Notebook entries** (`src/notebook/*.md`) are dated writing. Each has a `kind` (`thought`, `note`, `experiment`, or `paper`) and usually an `inquiry`.
- **Projects** (`src/_data/projects.yaml`) are code on GitHub.

## Everyday use

```sh
npm install                 # once
npm run dev                 # live preview at http://localhost:8080/me/
```

Create things with `npm run new`:

```sh
npm run new thought    "Is memory a place or a process?"   memory-systems
npm run new note       "Backpropagation through time"       memory-systems
npm run new experiment "Copy task on an LSTM"               memory-systems
npm run new paper      "Forgetting as memory"               memory-systems
npm run new inquiry    "Associative memory"
```

The last argument is the inquiry the entry belongs to: the inquiry's file name without `.md`. It can be left out.

Publish by committing and pushing to `main`. The site updates about a minute later.

### A quick dated thought, without a new file

Add a line to the inquiry's `log`:

```yaml
log:
  - date: 2026-10-20
    text: Read Hopfield (1982). The energy view is the clearest picture of recall I have seen.
```

### Starting, pausing, and finishing an inquiry

Set `status` to `exploring`, `paused`, `planned`, or `concluded`. To finish one, add `ended: YYYY-MM-DD` and a one-line `conclusion:`. The duration (“2 months”) and its bar on the timeline follow automatically.

## Front matter reference

| Field | Used on | Meaning |
|---|---|---|
| `title` | all | Title |
| `date` | entries | Date of the entry (`YYYY-MM-DD`) |
| `kind` | entries | `thought`, `note`, `experiment`, or `paper` |
| `inquiry` | entries | Inquiry this belongs to (its file name) |
| `summary` | all | One sentence shown in lists and link previews |
| `status` | experiments, inquiries | Experiments: `running`, `complete`, or `abandoned`. Inquiries: see above |
| `result` | experiments | The one-line finding, shown at the top and on the timeline |
| `repo`, `notebook`, `dataset`, `demo` | entries | Links shown as buttons |
| `authors`, `venue`, `abstract`, `pdf`, `arxiv` | papers | Paper details; a BibTeX entry is generated |
| `question`, `started`, `ended`, `conclusion`, `log` | inquiries | See above |
| `draft: true` | anything | Visible in `npm run dev`, never published |

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

`src/inquiries/examples/` and `src/notebook/examples/` hold example drafts: a finished two-month inquiry, an overlapping ongoing one, a note with math, an experiment with a table and figure, and a paper. They appear only in `npm run dev`. Delete both folders, and `src/assets/img/examples/`, when you no longer need them.

## Setup and structure

GitHub Pages must publish from Actions: **Settings → Pages → Source: GitHub Actions**. The workflow is `.github/workflows/publish.yml`.

```
src/
  _data/          site.yaml (name, links, URL), questions.yaml, projects.yaml
  _includes/      layouts and shared template pieces
  inquiries/      one Markdown file per inquiry
  notebook/       one Markdown file per entry
  assets/         css, js, images, papers
eleventy.config.js   Markdown setup, collections, timeline logic
scripts/new.js       the `npm run new` command
```

To publish somewhere else, such as a custom domain, change `url` in `src/_data/site.yaml`; every link follows it.
