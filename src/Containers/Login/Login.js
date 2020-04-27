import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { Button, FormGroup, FormControl, ControlLabel } from 'react-bootstrap';
import { Auth } from 'aws-amplify';
import { useAppContext } from '../../libs/contextLib';
import { onError } from '../../libs/errorLib';
import Loader from '../../Components/Loader/Loader';
import './Login.css';

const Login = () => {
  const history = useHistory();

  const { userHasAuthenticated } = useAppContext();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const validateForm = () => {
    return email.length > 0 && password.length > 0;
  };

  async function handleSubmit(event) {
    event.preventDefault();
    setLoading(true);
    try {
      await Auth.signIn(email, password);
      setLoading(false);
      userHasAuthenticated(true);
      history.push('/');
    } catch (e) {
      onError(e);
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
              value={email}
              onChange={e => setEmail(e.target.value)}
            />
          </FormGroup>
          <FormGroup controlId='password' bsSize='large'>
            <ControlLabel>Password</ControlLabel>
            <FormControl
              value={password}
              onChange={e => setPassword(e.target.value)}
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
