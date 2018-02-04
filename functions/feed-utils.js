const jsync = require('asyncawait/async');
const jwait = require('asyncawait/await');
const pify = require('pify');
const parser = require('rss-parser');
const got = require('got');
const extractor = require('unfluff');

const parseURL = pify(parser.parseURL);
const trim = require('trim');

const getFeeds = jsync((sources) => {
  // make calls to feeds
  const sourceProms = sources.map(jsync(source => jwait(parseURL(source.url))));
  // complete feed calls
  const sourceData = jwait(Promise.all(sourceProms));
  // flatten feeds into one array of content objects
  const flattenedContent = [].concat(...sourceData.map(source =>
    source.feed.entries.map((item) => {
      item.feedsrc = trim(source.feed.title);
      return item;
    })));
  return flattenedContent;
});

const cleanObjects = (objects) => {
  const objs = objects.map((item) => {
    const cleanObj = {
      title: trim(item.title),
      link: trim(item.link),
      feedsrc: item.feedsrc,
      // pubDate: item.pubDate,
    };
    return cleanObj;
  });
  return objs;
};

const processFlow = jsync((sources) => {
  const content = jwait(getFeeds(sources));
  const cleanedContent = cleanObjects(content);
  return cleanedContent;
});

const scrapeUrl = jsync((targetUrl) => {
  // scrape link url for meta, ogdata
  const { body: html, url } = jwait(got(targetUrl));
  const metaData = extractor(html);
  return metaData;
});

module.exports = {
  getFeeds,
  cleanObjects,
  processFlow,
  scrapeUrl,
};
