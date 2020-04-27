import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import {
  Button,
  HelpBlock,
  FormGroup,
  FormControl,
  ControlLabel
} from 'react-bootstrap';
import Loader from '../../Components/Loader/Loader';
import { Auth } from 'aws-amplify';
import { useAppContext } from '../../libs/contextLib';
import { useFormFields } from '../../libs/hooksLib';
import { onError } from '../../libs/errorLib';
import './Signup.css';

const Signup = () => {
  const [fields, handleFieldChange] = useFormFields({
    email: '',
    password: '',
    confirmPassword: '',
    confirmationCode: ''
  });
  const history = useHistory();
  const [newUser, setNewUser] = useState(null);
  const { userHasAuthenticated } = useAppContext();
  const [loading, setLoading] = useState(false);

  const validateForm = () => {
    return (
      fields.email.length > 0 &&
      fields.password.length > 0 &&
      fields.password === fields.confirmPassword
    );
  };

  const validateConfirmationForm = () => {
    return fields.confirmationCode.length > 0;
  };

  async function handleSubmit(event) {
    event.preventDefault();
    setLoading(true);
    try {
      const newUser = await Auth.signUp({
        username: fields.email,
        password: fields.password
      });
      setLoading(false);
      setNewUser(newUser);
    } catch (e) {
      // console.log(e);
      onError(e);
      setLoading(false);
    }
  }

  async function handleConfirmationSubmit(event) {
    event.preventDefault();
    setLoading(true);
    try {
      await Auth.confirmSignUp(fields.email, fields.confirmationCode);
      await Auth.signIn(fields.email, fields.password);
      userHasAuthenticated(true);
      history.push('/');
    } catch (e) {
      onError(e);
      setLoading(false);
    }
  }

  function renderConfirmationForm() {
    return (
      <form onSubmit={handleConfirmationSubmit}>
        <FormGroup controlId='confirmationCode' bsSize='large'>
          <ControlLabel>Confirmation Code</ControlLabel>
          <FormControl
            autoFocus
            type='tel'
            onChange={handleFieldChange}
            value={fields.confirmationCode}
          />
          <HelpBlock>Please check your email for the code.</HelpBlock>
        </FormGroup>
        <Button
          block
          type='submit'
          bsSize='large'
          disabled={!validateConfirmationForm()}
        >
          Verify
        </Button>
      </form>
    );
  }

  function renderForm() {
    return (
      <form onSubmit={handleSubmit}>
        <FormGroup controlId='email' bsSize='large'>
          <ControlLabel>Email</ControlLabel>
          <FormControl
            autoFocus
            type='email'
            value={fields.email}
            onChange={handleFieldChange}
          />
        </FormGroup>
        <FormGroup controlId='password' bsSize='large'>
          <ControlLabel>Password</ControlLabel>
          <FormControl
            type='password'
            value={fields.password}
            onChange={handleFieldChange}
          />
        </FormGroup>
        <FormGroup controlId='confirmPassword' bsSize='large'>
          <ControlLabel>Confirm Password</ControlLabel>
          <FormControl
            type='password'
            onChange={handleFieldChange}
            value={fields.confirmPassword}
          />
        </FormGroup>
        <Button block type='submit' bsSize='large' disabled={!validateForm()}>
          Signup
        </Button>
      </form>
    );
  }

  if (loading) {
    return <Loader />;
  } else {
    return (
      <div className='Signup'>
        {newUser === null ? renderForm() : renderConfirmationForm()}
      </div>
    );
  }
};

export default Signup;
