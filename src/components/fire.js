import * as firebase from '@firebase/app';
import '@firebase/firestore';

console.log('firebase:', firebase);
let config = {
	apiKey: 'AIzaSyCDLzg1z67fO1nxguLdSRK3Tf5bDwgPsM4',
	authDomain: 'dev-radar.firebaseapp.com',
	databaseURL: 'https://dev-radar.firebaseio.com',
	projectId: 'dev-radar',
	storageBucket: 'dev-radar.appspot.com',
	messagingSenderId: '549078923980'
};

firebase.default.initializeApp(config);

// export default firebase.default;
export const firestore = firebase.default.firestore();
