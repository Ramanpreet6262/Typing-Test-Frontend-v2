import React from 'react';
import { Route, Switch } from 'react-router-dom';

import MainPage from './Containers/MainPageContainer/MainPage';

import './App.css';

const App = () => {
  return (
    <div className='App-container'>
      <Switch>
        <Route path='/' exact component={MainPage} />
      </Switch>
    </div>
  );
};

export default App;
