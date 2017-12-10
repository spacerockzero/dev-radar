// Articles Utilities
const hash = require('object-hash');

// Article:
//   title,
//   link,
//   feedsrc,
//   createdOn,
//   opengraph,
//   labels,
//   sentiment

function makeArticle({
  title, link, feedsrc, labels,
}) {
  return {
    title,
    link,
    feedsrc,
    createdOn: new Date(Date.now()),
    opengraph: {},
    labels: labels || [],
    sentiment: {},
  };
}

function getHash(articleInput) {
  return hash(articleInput);
}

module.exports = {
  makeArticle,
  getHash,
};
