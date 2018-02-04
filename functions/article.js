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

// content-based id as doc name to keep articles unique in db
function getHash(articleUniqueFieldsObject) {
  return hash(articleUniqueFieldsObject);
}

function makeArticle({
  title, link, feedsrc, labels,
}) {
  return {
    id: getHash({
      title,
      link,
    }),
    title,
    link,
    feedsrc,
    createdOn: new Date(Date.now()),
    // pubDate,
    opengraph: {},
    labels: labels || [],
    sentiment: {},
  };
}

module.exports = {
  makeArticle,
  getHash,
};
