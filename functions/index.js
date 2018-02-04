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
  return cors(req, res, () => {
    console.time('updateFeedContent');
    return feedUtils
      .processFlow(sources)
      .then((content) => {
        console.timeEnd('updateFeedContent');
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
            console.timeEnd('db');
            return results;
          })
          .then(results => res.status(200).send('OK'))
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
      .orderBy('createdOn', 'asc')
      .limit(50)
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

// When new docs are saved, go get their metadata for thumbnails and whatnot
exports.getMeta = functions.firestore.document('publicArticles/{articleId}').onCreate((event) => {
  // console.log('getMeta', event.data);
  const doc = event.data.data();
  console.log('doc:', doc);
  const linkURL = doc.link;
  console.log('link:', linkURL);
  if (linkURL) {
    feedUtils.scrapeUrl(linkURL).then((metadata) => {
      console.log('metadata:', metadata);
      if (metadata.image) {
        db
          .collection('publicArticles')
          .doc(doc.id)
          .update({ image: metadata.image })
          .then((result) => {
            console.log('db write result:', result);
          })
          .catch((err) => {
            console.error('Err writing img to db:', err);
          });
      }
    });
  }
});
