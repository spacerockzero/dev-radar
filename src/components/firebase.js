const firebase = require('firebase/app');
require('firebase/firestore');

let config = {
	apiKey: 'AIzaSyCDLzg1z67fO1nxguLdSRK3Tf5bDwgPsM4',
	authDomain: 'dev-radar.firebaseapp.com',
	databaseURL: 'https://dev-radar.firebaseio.com',
	projectId: 'dev-radar',
	storageBucket: 'dev-radar.appspot.com',
	messagingSenderId: '549078923980'
};

firebase.initializeApp(config);

export default firebase;
export let firestore = firebase.firestore();
