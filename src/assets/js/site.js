// Small, optional enhancements. Every page works without this file.

// Theme: follows the system until you choose, then remembers your choice.
const root = document.documentElement;
document.querySelector(".theme-toggle")?.addEventListener("click", () => {
  const dark = root.dataset.theme
    ? root.dataset.theme === "dark"
    : matchMedia("(prefers-color-scheme: dark)").matches;
  root.dataset.theme = dark ? "light" : "dark";
  try {
    localStorage.setItem("theme", root.dataset.theme);
  } catch {}
});

// Notebook: filter entries by kind.
const filter = document.querySelector("[data-filter]");
if (filter) {
  filter.hidden = false;
  filter.addEventListener("click", (event) => {
    const button = event.target.closest("button[data-kind]");
    if (!button) return;
    const kind = button.dataset.kind;
    for (const b of filter.querySelectorAll("button")) b.setAttribute("aria-pressed", String(b === button));
    for (const row of document.querySelectorAll(".entry-row")) {
      row.hidden = kind !== "all" && row.dataset.kind !== kind;
    }
    for (const group of document.querySelectorAll(".year-group")) {
      group.hidden = !group.querySelector(".entry-row:not([hidden])");
    }
  });
}

// Papers: copy the BibTeX entry.
for (const button of document.querySelectorAll("[data-copy]")) {
  const source = document.getElementById(button.dataset.copy);
  if (!source || !navigator.clipboard) continue;
  button.hidden = false;
  button.addEventListener("click", async () => {
    try {
      await navigator.clipboard.writeText(source.textContent);
      button.textContent = "Copied";
      setTimeout(() => (button.textContent = "Copy BibTeX"), 1600);
    } catch {}
  });
}
