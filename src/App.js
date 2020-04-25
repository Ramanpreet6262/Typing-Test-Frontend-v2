import React from 'react';
import { Route, Switch } from 'react-router-dom';

import Navbar from './Components/Navbar/Navbar';
import MainPage from './Containers/MainPageContainer/MainPage';
import NotFound from './Components/404NotFound/NotFound';
import Login from './Containers/Login/Login';

import './App.css';

const App = () => {
  return (
    <div className='App-container'>
      <Navbar />
      <Switch>
        <Route path='/login' exact component={Login} />
        <Route path='/' exact component={MainPage} />
        <Route component={NotFound} />
      </Switch>
    </div>
  );
};

export default App;
