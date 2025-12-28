const slugify = require('slugify');

const createSlug = (text) => {
  return slugify(text, {
    lower: true,
    strict: true,
    locale: 'tr' // Turkish character support
  });
};

module.exports = createSlug;
