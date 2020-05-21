import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from 'react-bootstrap';
import { Table } from 'react-bootstrap';
import { db } from '../../firebaseConfig';
import { Auth } from 'aws-amplify';
import './Profile.css';

const Profile = () => {
  async function show() {
    let data = {};
    const currentUser = await Auth.currentAuthenticatedUser();
    const userEmail = currentUser.attributes.email;
    const userDocRef = db.collection('users').doc(userEmail);
    // let userDoc = userDocRef
    //   .get()
    //     .then(doc => {
    //       if (doc.exists) {
    //         const data = doc.data();
    //         console.log(data);
    //         data.tests.push(testData);
    //         if (cpm > data.maxCpm) {
    //           data.maxCpm = cpm;
    //         }
    //         // data.addedAt = new Date();
    //         const setDoc = userDocRef.set(data);
    //       } else {
    //         console.log('No such document!');
    //         let testArr = [];
    //         testArr.push(testData);
    //         const data = {
    //           maxCpm: cpm,
    //           tests: testArr
    //           // addedAt: new Date()
    //         };
    //         const setDoc = userDocRef.set(data);
    //       }
    //     });
    //     .catch(err => {
    //       alert(
    //         `Error occured while fetching recent user data. Please refresh page!!`
    //       );
    //     });
    console.log('clicked');
  }

  return (
    <div className='Profile'>
      <Link to='/profile/password'>
        <Button className='change-pass-btn' size='lg'>
          Change Password
        </Button>
      </Link>
      {/* <Button className='change-pass-btn' size='lg' onClick={show}>
        show
      </Button> */}
    </div>
  );
};

export default Profile;
