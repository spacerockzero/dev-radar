// Articles Utilities

// Article:
//   title,
//   link,
//   feedsrc,
//   createdOn,
//   opengraph,
//   labels,
//   sentiment

class Article {
  constructor({
    title, link, feedsrc, labels,
  }) {
    this.title = title;
    this.link = link;
    this.feedsrc = feedsrc;
    this.createdOn = new Date(Date.now());
    this.opengraph = {};
    this.labels = labels || [];
    this.sentiment = {};
  }
}

module.exports = Article;
