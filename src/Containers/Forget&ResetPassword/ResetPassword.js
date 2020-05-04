import React, { useState } from 'react';
import { Auth } from 'aws-amplify';
import { Link } from 'react-router-dom';
import {
  Button,
  FormText,
  FormGroup,
  FormControl,
  FormLabel
} from 'react-bootstrap';
import Loader from '../../Components/Loader/Loader';
import { useFormFields } from '../../libs/hooksLib';
import { onError } from '../../libs/errorLib';
import './ResetPassword.css';

const ResetPassword = () => {
  const [fields, handleFieldChange] = useFormFields({
    code: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [codeSent, setCodeSent] = useState(false);
  const [confirmed, setConfirmed] = useState(false);
  const [loading, setLoading] = useState(false);

  function validateCodeForm() {
    return fields.email.length > 0;
  }

  function validateResetForm() {
    return (
      fields.code.length > 0 &&
      fields.password.length > 0 &&
      fields.password === fields.confirmPassword
    );
  }

  async function handleSendCodeClick(event) {
    event.preventDefault();
    setLoading(true);

    try {
      await Auth.forgotPassword(fields.email);
      setLoading(false);
      setCodeSent(true);
    } catch (error) {
      onError(error);
      setLoading(false);
    }
  }

  async function handleConfirmClick(event) {
    event.preventDefault();
    setLoading(true);

    try {
      await Auth.forgotPasswordSubmit(
        fields.email,
        fields.code,
        fields.password
      );
      setLoading(false);
      setConfirmed(true);
    } catch (error) {
      onError(error);
      setLoading(false);
    }
  }

  function renderRequestCodeForm() {
    return (
      <form onSubmit={handleSendCodeClick}>
        <FormGroup size='lg' controlId='email'>
          <FormLabel>Email</FormLabel>
          <FormControl
            autoFocus
            type='email'
            value={fields.email}
            onChange={handleFieldChange}
          />
        </FormGroup>
        <Button block type='submit' size='lg' disabled={!validateCodeForm()}>
          Send Confirmation
        </Button>
      </form>
    );
  }

  function renderConfirmationForm() {
    return (
      <form onSubmit={handleConfirmClick}>
        <FormGroup size='lg' controlId='code'>
          <FormLabel>Confirmation Code</FormLabel>
          <FormControl
            autoFocus
            type='tel'
            value={fields.code}
            onChange={handleFieldChange}
          />
          <FormText>
            Please check your email ({fields.email}) for the confirmation code.
          </FormText>
        </FormGroup>
        <hr />
        <FormGroup size='lg' controlId='password'>
          <FormLabel>New Password</FormLabel>
          <FormControl
            type='password'
            value={fields.password}
            onChange={handleFieldChange}
          />
        </FormGroup>
        <FormGroup size='lg' controlId='confirmPassword'>
          <FormLabel>Confirm Password</FormLabel>
          <FormControl
            type='password'
            value={fields.confirmPassword}
            onChange={handleFieldChange}
          />
        </FormGroup>
        <Button block type='submit' size='lg' disabled={!validateResetForm()}>
          Confirm
        </Button>
      </form>
    );
  }

  function renderSuccessMessage() {
    return (
      <div className='success'>
        <p>Your password has been reset.</p>
        <p>
          <Link to='/login'>
            Click here to login with your new credentials.
          </Link>
        </p>
      </div>
    );
  }

  if (loading) {
    return <Loader />;
  } else {
    return (
      <div className='ResetPassword'>
        {!codeSent
          ? renderRequestCodeForm()
          : !confirmed
          ? renderConfirmationForm()
          : renderSuccessMessage()}
      </div>
    );
  }
};

export default ResetPassword;
