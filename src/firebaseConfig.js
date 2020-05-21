import * as firebase from 'firebase/app';

import 'firebase/firestore';
import Keys from './SecretKeys/keys';

const firebaseConfig = {
  apiKey: Keys.apiKey,
  authDomain: Keys.authDomain,
  databaseURL: Keys.databaseURL,
  projectId: Keys.projectId,
  storageBucket: Keys.storageBucket,
  messagingSenderId: Keys.messagingSenderId,
  appId: Keys.appId
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

export const db = firebase.firestore();
