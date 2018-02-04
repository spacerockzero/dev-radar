const feedUtils = require('./feed-utils');
const sources = require('./sources');
const { makeArticle } = require('./article');
const cors = require('cors')({ origin: true });

// BOILERPLATE
// The Cloud Functions for Firebase SDK to create Cloud Functions and setup triggers.
const functions = require('firebase-functions');

// The Firebase Admin SDK to access the Firebase Realtime Database.
const admin = require('firebase-admin');

admin.initializeApp(functions.config().firebase);
const db = admin.firestore();

// METHODS
// save a a batch of articles
function saveArticles(articles) {
  console.time('db');
  const collectionRef = db.collection('publicArticles');
  const batch = db.batch();
  articles.forEach((article) => {
    const ref = collectionRef.doc(article.id);
    console.log('article.id', article.id);
    batch.set(ref, article);
  });
  return batch.commit();
}

// MOUNTED FUNCTIONS
// Update feeds and add new uniques to firestore
exports.updateFeedContent = functions.https.onRequest((req, res) => {
  if (req.method === 'PUT') {
    return res.status(403).send('Forbidden!');
  }
  cors(req, res, () => {
    console.time('updateFeedContent');
    return feedUtils
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
        console.log('before save articles:');
        return saveArticles(articles)
          .then((results) => {
            console.time('db');
            return results;
          })
          .then(results => res.status(200).send(results))
          .catch(err => res.status(500).send(err));
      });
  });
});

// Send new articles to UI
exports.getArticles = functions.https.onRequest((req, res) => {
  if (req.method === 'PUT') {
    return res.status(403).send('Forbidden!');
  }
  return cors(req, res, () =>
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
      .catch(err => Promise.reject(err)));
});
