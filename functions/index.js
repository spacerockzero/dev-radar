const feedUtils = require('./feed-utils');
const sources = require('./sources');
const { makeArticle } = require('./article');

// The Cloud Functions for Firebase SDK to create Cloud Functions and setup triggers.
const functions = require('firebase-functions');

// The Firebase Admin SDK to access the Firebase Realtime Database.
const admin = require('firebase-admin');

admin.initializeApp(functions.config().firebase);
const db = admin.firestore();

// save a single article
function saveArticle(article) {
  const docRef = db.collection('publicArticles').doc(article.id);
  return docRef.set(article);
}

exports.getFeedContent = functions.https.onRequest((req, res) => {
  feedUtils
    .processFlow(sources)
    .then(content =>
      content.map(item =>
        makeArticle({
          title: item.title,
          link: item.link,
          feedsrc: item.feedsrc,
          labels: item.labels,
        })))
    .then((articles) => {
      const dbProms = articles.map(article => saveArticle(article));
      return Promise.all(dbProms)
        .then(results => res.status(200).send(results))
        .catch(err => res.status(500).send(err));
    });
});
