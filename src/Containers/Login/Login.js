import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { Button, FormGroup, FormControl, ControlLabel } from 'react-bootstrap';
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
      onError(e);
      // console.log(e);
      setLoading(false);
    }
  }

  if (loading) {
    return <Loader />;
  } else {
    return (
      <div className='Login'>
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
              value={fields.password}
              onChange={handleFieldChange}
              type='password'
            />
          </FormGroup>
          <Button block bsSize='large' disabled={!validateForm()} type='submit'>
            Login
          </Button>
        </form>
      </div>
    );
  }
};

export default Login;
