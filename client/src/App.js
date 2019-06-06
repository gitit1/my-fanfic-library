import React from 'react';
import { Route, Switch, withRouter, Redirect } from 'react-router-dom';

import './App.css';
import Layout from './hoc/Layout/Layout';
import Index from './containers/Index/Index';
import ManageFandoms from './containers/Fandoms/ManageFandoms/ManageFandoms';
import ManageDownloader from './containers/ManageDownloader/ManageDownloader';
import AddNewFandom from './containers/Fandoms/ManageFandoms/AddNewFandom/AddNewFandom';
import TodoList from './containers/TodoList/TodoList';

function App() {
  return (
    <Layout>
      <Switch>
        <Route path="/manageFandoms" component={ManageFandoms} />
        <Route path="/manageDownloader" component={ManageDownloader} />
        <Route path="/addnewfandom" component={AddNewFandom} />
        <Route path="/todolist" component={TodoList} />
        <Route path="/" exact component={Index} />
        <Redirect to="/" />
      </Switch>
    </Layout>
  );
}


export default withRouter(App);
