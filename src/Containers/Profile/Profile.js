import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from 'react-bootstrap';
import './Profile.css';

const Profile = () => {
  return (
    <div className='Profile'>
      <Link to='/profile/password'>
        <Button className='change-pass-btn' size='lg'>
          Change Password
        </Button>
      </Link>
    </div>
  );
};

export default Profile;
