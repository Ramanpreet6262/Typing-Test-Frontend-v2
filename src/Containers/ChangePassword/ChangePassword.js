import React, { useState } from 'react';
import { Auth } from 'aws-amplify';
import { useHistory } from 'react-router-dom';
import { Button, FormGroup, FormControl, FormLabel } from 'react-bootstrap';
import Loader from '../../Components/Loader/Loader';
import { useFormFields } from '../../libs/hooksLib';
import { onError } from '../../libs/errorLib';
import './ChangePassword.css';

const ChangePassword = () => {
  const history = useHistory();
  const [fields, handleFieldChange] = useFormFields({
    password: '',
    oldPassword: '',
    confirmPassword: ''
  });
  const [loading, setLoading] = useState(false);

  function validateForm() {
    return (
      fields.oldPassword.length > 0 &&
      fields.password.length > 0 &&
      fields.password === fields.confirmPassword
    );
  }

  async function handleChangeClick(event) {
    event.preventDefault();
    setLoading(true);

    try {
      const currentUser = await Auth.currentAuthenticatedUser();
      await Auth.changePassword(
        currentUser,
        fields.oldPassword,
        fields.password
      );
      setLoading(false);
      history.push('/profile');
    } catch (error) {
      onError(error);
      setLoading(false);
    }
  }

  if (loading) {
    return <Loader />;
  } else {
    return (
      <div className='ChangePassword'>
        <form onSubmit={handleChangeClick}>
          <FormGroup size='lg' controlId='oldPassword'>
            <FormLabel>Old Password</FormLabel>
            <FormControl
              type='password'
              onChange={handleFieldChange}
              value={fields.oldPassword}
            />
          </FormGroup>
          <hr />
          <FormGroup size='lg' controlId='password'>
            <FormLabel>New Password</FormLabel>
            <FormControl
              type='password'
              onChange={handleFieldChange}
              value={fields.password}
            />
          </FormGroup>
          <FormGroup size='lg' controlId='confirmPassword'>
            <FormLabel>Confirm Password</FormLabel>
            <FormControl
              type='password'
              onChange={handleFieldChange}
              value={fields.confirmPassword}
            />
          </FormGroup>
          <Button block type='submit' size='lg' disabled={!validateForm()}>
            Change Password
          </Button>
        </form>
      </div>
    );
  }
};

export default ChangePassword;
