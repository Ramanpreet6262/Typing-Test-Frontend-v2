import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import {
  Button,
  FormText,
  FormGroup,
  FormControl,
  FormLabel
} from 'react-bootstrap';
import Loader from '../../Components/Loader/Loader';
import { Auth } from 'aws-amplify';
import { useAppContext } from '../../libs/contextLib';
import { useFormFields } from '../../libs/hooksLib';
import { onError } from '../../libs/errorLib';
import './Signup.css';

const Signup = props => {
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

  useEffect(() => {
    if (props.location.state !== undefined) {
      if (props.location.state.user) {
        setNewUser(props.location.state.user);
      }
    }
  }, [props.location.state]);

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
      if (e.code === 'UsernameExistsException') {
        let err = e;
        err.message = e.message + ' Please Login instead!';
        onError(err);
      } else {
        onError(e);
      }
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
        <FormGroup controlId='confirmationCode' size='lg'>
          <FormLabel>Confirmation Code</FormLabel>
          <FormControl
            autoFocus
            type='tel'
            onChange={handleFieldChange}
            value={fields.confirmationCode}
          />
          <FormText>Please check your email for the code.</FormText>
        </FormGroup>
        <Button
          block
          type='submit'
          size='lg'
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
        <FormGroup controlId='email' size='lg'>
          <FormLabel>Email</FormLabel>
          <FormControl
            autoFocus
            type='email'
            value={fields.email}
            onChange={handleFieldChange}
          />
        </FormGroup>
        <FormGroup controlId='password' size='lg'>
          <FormLabel>Password</FormLabel>
          <FormControl
            type='password'
            value={fields.password}
            onChange={handleFieldChange}
          />
        </FormGroup>
        <FormGroup controlId='confirmPassword' size='lg'>
          <FormLabel>Confirm Password</FormLabel>
          <FormControl
            type='password'
            onChange={handleFieldChange}
            value={fields.confirmPassword}
          />
        </FormGroup>
        <Button block type='submit' size='lg' disabled={!validateForm()}>
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
