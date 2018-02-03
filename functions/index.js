const feedUtils = require('./feed-utils');
const sources = require('./sources');
const { makeArticle } = require('./article');

// The Cloud Functions for Firebase SDK to create Cloud Functions and setup triggers.
const functions = require('firebase-functions');

// The Firebase Admin SDK to access the Firebase Realtime Database.
const admin = require('firebase-admin');

admin.initializeApp(functions.config().firebase);
const db = admin.firestore();

// save a a batch of articles
function saveArticles(articles) {
  const collectionRef = db.collection('publicArticles');
  const batch = db.batch();
  articles.forEach((article) => {
    const ref = collectionRef.doc(article.id);
    console.log('article.id', article.id);
    batch.set(ref, article);
  });
  return batch.commit();
}

// get feeds and add new uniques to firestore
exports.updateFeedContent = functions.https.onRequest((req, res) => {
  // return early so this function doesn't time out before finishing the feed/db work
  console.log('after res');
  console.time('getFeeds');
  feedUtils
    .processFlow(sources)
    .then((content) => {
      console.timeEnd('getFeeds');
      return content.map(item =>
        makeArticle({
          title: item.title,
          link: item.link,
          feedsrc: item.feedsrc,
          labels: item.labels,
        }));
    })
    .then((articles) => {
      // res.status(200).send('Updating Feeds...');
      // speed up db saving. so slow it times out most of the time lately
      console.time('db');
      // console.log('before save articles:', articles);
      return (
        saveArticles(articles)
          // const dbProms = articles.map(article => saveArticle(article));
          // return Promise.all(dbProms)
          //   .then((results) => {
          //     console.timeEnd('db');
          //     return results;
          //   })
          .then(results => res.status(200).send(results))
          .catch(err => res.status(500).send(err))
      );
    });
});

exports.getArticles = functions.https.onRequest((req, res) => {
  db
    .collection('publicArticles')
    .limit(100)
    .get()
    .then((snapshot) => {
      const articles = [];
      snapshot.forEach((doc) => {
        const document = doc.data();
        articles.push(document);
      });
      return res.status(200).send(articles);
    })
    .catch(err => Promise.reject(err));
});
