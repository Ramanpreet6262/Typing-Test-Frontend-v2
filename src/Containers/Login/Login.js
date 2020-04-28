import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { Button, FormGroup, FormControl, FormLabel } from 'react-bootstrap';
import { Auth } from 'aws-amplify';
import { useAppContext } from '../../libs/contextLib';
import { onError } from '../../libs/errorLib';
import { useFormFields } from '../../libs/hooksLib';
import Loader from '../../Components/Loader/Loader';
import './Login.css';

const Login = () => {
  const history = useHistory();
  const { userHasAuthenticated } = useAppContext();
  const [loading, setLoading] = useState(false);
  const [fields, handleFieldChange] = useFormFields({
    email: '',
    password: ''
  });

  const validateForm = () => {
    return fields.email.length > 0 && fields.password.length > 0;
  };

  async function handleSubmit(event) {
    event.preventDefault();
    setLoading(true);
    try {
      await Auth.signIn(fields.email, fields.password);
      setLoading(false);
      userHasAuthenticated(true);
      history.push('/');
    } catch (e) {
      if (e.code === 'UserNotConfirmedException') {
        let err = e;
        err.message =
          e.message + ' Please check your email for the new confirmation code!';
        onError(err);
        try {
          await Auth.resendSignUp(fields.email);
          const user = {
            email: fields.email
          };
          setLoading(false);
          history.push({
            pathname: '/signup',
            state: { user: user }
          });
        } catch (e) {
          onError(e);
          setLoading(false);
        }
      } else {
        onError(e);
        setLoading(false);
      }
    }
  }

  if (loading) {
    return <Loader />;
  } else {
    return (
      <div className='Login'>
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
              value={fields.password}
              onChange={handleFieldChange}
              type='password'
            />
          </FormGroup>
          <Button block size='lg' disabled={!validateForm()} type='submit'>
            Login
          </Button>
        </form>
      </div>
    );
  }
};

export default Login;
