import React from 'react';
import { Route, Switch, withRouter, Redirect } from 'react-router-dom';

import './App.css';
import Layout from './hoc/Layout/Layout';
import Index from './containers/Index/Index';
import ManageFandoms from './containers/Fandoms/ManageFandoms/ManageFandoms';

function App() {
  return (
    <Layout>
      <Switch>
        <Route path="/manageFandoms" component={ManageFandoms} />
        <Route path="/" exact component={Index} />
        <Redirect to="/" />
      </Switch>
    </Layout>
  );
}


export default withRouter(App);
