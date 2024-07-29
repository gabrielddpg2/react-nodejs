import React from 'react';
import { Switch, Route } from 'react-router-dom';

import Home from '../pages/Home';
import Register from '../pages/Register';
import Edit from '../pages/Edit';
import Login from '../pages/Login';
import Pontos from '../pages/Pontos';

const Routes: React.FC = () => (
  <Switch>
    <Route path='/' exact component={Home} />
    <Route path='/register' component={Register} />
    <Route path='/edit/:id' component={Edit} />
    <Route path='/login' component={Login} />
    <Route path='/pontos' component={Pontos} />
  </Switch>
);

export default Routes;
