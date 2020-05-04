import React, { useState, useEffect } from 'react';
import { Route, Switch, useHistory } from 'react-router-dom';
import { Auth } from 'aws-amplify';

import AuthenticatedRoute from './Containers/RouteAuth/AuthenticatedRoute';
import UnauthenticatedRoute from './Containers/RouteAuth/UnauthenticatedRoute';

import Navbar from './Components/Navbar/Navbar';
import MainPage from './Containers/MainPageContainer/MainPage';
import NotFound from './Components/404NotFound/NotFound';
import Login from './Containers/Login/Login';
import Loader from './Components/Loader/Loader';
import Signup from './Containers/Signup/Signup';
import ResetPassword from './Containers/Forget&ResetPassword/ResetPassword';
import Profile from './Containers/Profile/Profile';
import ChangePassword from './Containers/ChangePassword/ChangePassword';
import { AppContext } from './libs/contextLib';
import { onError } from './libs/errorLib';

import './App.css';

const App = () => {
  const history = useHistory();

  const [isAuthenticating, setIsAuthenticating] = useState(true);
  const [isAuthenticated, userHasAuthenticated] = useState(false);

  useEffect(() => {
    onLoad();
  }, []);

  async function onLoad() {
    try {
      await Auth.currentSession();
      userHasAuthenticated(true);
    } catch (e) {
      if (e !== 'No current user') {
        onError(e);
      }
    }

    setIsAuthenticating(false);
  }

  async function handleLogout() {
    await Auth.signOut();
    userHasAuthenticated(false);
    history.push('/login');
  }

  if (isAuthenticating) {
    return <Loader />;
  } else {
    return (
      <div className='App-container'>
        <Navbar isAuthenticated={isAuthenticated} handleLogout={handleLogout} />
        <AppContext.Provider value={{ isAuthenticated, userHasAuthenticated }}>
          <Switch>
            <UnauthenticatedRoute path='/login' exact component={Login} />
            <UnauthenticatedRoute
              path='/login/reset'
              exact
              component={ResetPassword}
            />
            <UnauthenticatedRoute path='/signup' exact component={Signup} />
            <AuthenticatedRoute path='/profile' exact component={Profile} />
            <AuthenticatedRoute
              path='/profile/password'
              exact
              component={ChangePassword}
            />
            <Route path='/' exact component={MainPage} />
            <Route component={NotFound} />
          </Switch>
        </AppContext.Provider>
      </div>
    );
  }
};

export default App;
