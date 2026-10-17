// Defaults for every notebook entry. Front matter in an entry overrides these.
export default {
  layout: "layouts/entry.njk",
  kind: "note",
  eleventyComputed: {
    permalink: (data) => `/notebook/${data.page.fileSlug}/`,
  },
};
