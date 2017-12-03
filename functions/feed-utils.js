const async = require('asyncawait/async');
const await = require('asyncawait/await');
const pify = require('pify');
const parser = require('rss-parser');
const parseURL = pify(parser.parseURL);
const trim = require('trim');

const getFeeds = async (function (sources) {
	// make calls to feeds
	const sourceProms = sources.map(async (source => await (parseURL(source.url))));
	// complete feed calls
	const sourceData = await (Promise.all(sourceProms));
	// flatten feeds into one array of content objects
	const flattenedContent = [].concat(
		...sourceData.map(source =>
			source.feed.entries.map(item => {
				item.feedsrc = trim(source.feed.title);
				return item;
			})
		)
	);
	return flattenedContent;
})

const cleanObjects = function(objects) {
	const objs = objects.map(item => {
		let cleanObj = {
			title: trim(item.title),
			link: trim(item.link),
			feedsrc: item.feedsrc
		};
		return cleanObj;
	});
	return objs;
};

const processFlow = async (function (sources) {
	const content = await (getFeeds(sources));
	const cleanedContent = cleanObjects(content);
	// console.log(JSON.stringify(content, null, 2));
	// cleanedContent.forEach(newsObj => {
	// 	console.log(newsObj.title);
	// 	console.log(` ${newsObj.link}`);
	// 	console.log(` ${newsObj.feedsrc}`);
  // });
  return cleanedContent
});


module.exports = {
  getFeeds,
  cleanObjects,
  processFlow
};
