// Defaults for every inquiry. Front matter in an inquiry overrides these.
export default {
  layout: "layouts/inquiry.njk",
  status: "exploring",
  eleventyComputed: {
    permalink: (data) => `/inquiries/${data.page.fileSlug}/`,
  },
};
