const feedUtils = require('./feed-utils');
const sources = require('./sources');

// The Cloud Functions for Firebase SDK to create Cloud Functions and setup triggers.
const functions = require('firebase-functions');

// The Firebase Admin SDK to access the Firebase Realtime Database.
const admin = require('firebase-admin');
admin.initializeApp(functions.config().firebase);
const db = admin.firestore();

// Take the text parameter passed to this HTTP endpoint and insert it into the
// Realtime Database under the path /messages/:pushId/original
exports.addMessage = functions.https.onRequest((req, res) => {
  // Grab the text parameter.
  const original = req.query.text;
  // Push the new message into the Realtime Database using the Firebase Admin SDK.
  const docRef = db.collection('test').doc('articles');

  var setArticle = docRef.set({
    name: original
  });

  setArticle
    .then(snapshot => {
      res.status(200).send('its cool');
    })
    .catch(err => {
      res.status(500).send(err);
    });
  // admin
  //   .database()
  //   .ref('/messages')
  //   .push({original})
  //   .then(snapshot => {
  //     // Redirect with 303 SEE OTHER to the URL of the pushed object in the Firebase console.
  //     res.redirect(303, snapshot.ref);
  //   });
});

// Listens for new messages added to /messages/:pushId/original and creates an
// uppercase version of the message to /messages/:pushId/uppercase
exports.makeUppercase = functions.database.ref('/messages/{pushId}/original').onWrite(event => {
  // Grab the current value of what was written to the Realtime Database.
  const original = event.data.val();
  console.log('Uppercasing', event.params.pushId, original);
  const uppercase = original.toUpperCase();
  // You must return a Promise when performing asynchronous tasks inside a Functions such as
  // writing to the Firebase Realtime Database.
  // Setting an "uppercase" sibling in the Realtime Database returns a Promise.
  return event.data.ref.parent.child('uppercase').set(uppercase);
});

exports.getFeedContent = functions.https.onRequest((req, res) => {
  feedUtils
    .processFlow(sources)
    .then(content => {
      const docRef = db.collection('public').doc('articles');
      const item = content[0];
      let article = new article({
        title: item.title,
        link: item.link,
        feedsrc: item.feedsrc,
        labels: item.labels
      });
      const setArticle = docRef.set(article);

      setArticle
        .then(snapshot => {
          console.log('document write success:', snapshot);
          res.status(200).send('its cool');
        })
        .catch(err => {
          console.error(err);
          res.status(500).send(err);
        });
    })
    .catch(err => {
      res.status(500).send(err);
    });
});
