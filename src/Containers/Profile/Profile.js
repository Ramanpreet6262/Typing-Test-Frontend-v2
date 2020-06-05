import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from 'react-bootstrap';
import { Table } from 'react-bootstrap';
import Loader from '../../Components/Loader/Loader';
import { db } from '../../firebaseConfig';
import { Auth } from 'aws-amplify';
import './Profile.css';
import '../../../node_modules/react-vis/dist/style.css';
import {
  XYPlot,
  LineSeries,
  HorizontalGridLines,
  VerticalGridLines,
  XAxis,
  YAxis
} from 'react-vis';
import logo from '../../static/man.svg';

const Profile = () => {
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState(null);
  const [testData, setTestData] = useState(null);
  const [recentTestData, setRecentTestData] = useState([]);

  useEffect(() => {
    async function show() {
      setLoading(true);
      const currentUser = await Auth.currentAuthenticatedUser();
      const userEmail = currentUser.attributes.email;
      setUser(userEmail);
      const userDocRef = db.collection('users').doc(userEmail);
      let userDoc = userDocRef
        .get()
        .then(doc => {
          if (doc.exists) {
            const data = doc.data();
            // console.log(data);
            setTestData(data);
            if (data.tests.length < 5) {
              setRecentTestData(data.tests);
            } else {
              let arr = [];
              for (
                let i = data.tests.length - 1;
                i > data.tests.length - 6;
                i--
              ) {
                arr.push(data.tests[i]);
              }
              setRecentTestData(arr);
            }
          } else {
            console.log('No such document!');
          }
        })
        .catch(err => {
          alert(
            `Error occured while fetching recent user data. Please refresh page!!`
          );
        });
      setLoading(false);
    }
    show();
  }, []);

  const graphData = recentTestData.map((item, index) => {
    return {
      x: index,
      y: parseInt(item.cpm)
    };
  });

  if (loading) {
    return <Loader />;
  } else {
    return (
      <div className='Profile'>
        <h1>Profile Page</h1>
        <div className='left-bar'>
          <div className='profile-card'>
            <img src={logo} alt='Profile Pic' className='profile-pic' />
            {/* <h5>User : {user}</h5> */}
            <h5 className='username'>{user}</h5>
            <Link to='/profile/password'>
              <Button className='change-pass-btn' size='lg'>
                Change Password
              </Button>
            </Link>
            <div className='tests-taken'>
              <h5>Total Tests Taken: {testData ? testData.tests.length : 0}</h5>
            </div>
          </div>
        </div>
        <div className='right-bar'>
          <h3 className='recent'>Recent Statistics</h3>
          <div className='statsTable'>
            <Table striped bordered hover variant='dark'>
              <thead>
                <tr>
                  <th>#</th>
                  <th>Accuracy</th>
                  <th>Characters Per Minute</th>
                  <th>Words Per Minute</th>
                </tr>
              </thead>
              <tbody>
                {recentTestData.map((item, index) => {
                  return (
                    <tr key={index}>
                      <td>{index + 1}</td>
                      <td>{item.accuracy}%</td>
                      <td>{item.cpm}</td>
                      <td>{item.wpm}</td>
                    </tr>
                  );
                })}
              </tbody>
            </Table>
          </div>
          <div className='graph'>
            <XYPlot height={480} width={480} stroke='orange'>
              <LineSeries data={graphData} />
              <VerticalGridLines />
              <HorizontalGridLines />
              <XAxis title='Tests' />
              <YAxis title='Characters typed per minute' />
            </XYPlot>
          </div>
        </div>
      </div>
    );
  }
};

export default Profile;
