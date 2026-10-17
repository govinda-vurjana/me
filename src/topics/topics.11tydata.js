// Defaults for every topic. Front matter in a topic overrides these.
export default {
  layout: "layouts/topic.njk",
  section: "memory",
  status: "exploring",
  eleventyComputed: {
    permalink: (data) => `/${data.section}/${data.page.fileSlug}/`,
  },
};
