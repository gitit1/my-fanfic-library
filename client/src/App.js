import React from 'react';
import { Route, Switch, withRouter, Redirect } from 'react-router-dom';
import jwt_decode from "jwt-decode";

import setAuthToken from "./utils/setAuthToken";
import { setCurrentUser, logoutUser } from "./store/actions";
import store from "./store/store";

import Layout from './hoc/Layout/Layout';
import Index from './containers/Index/Index';

import AllFandoms from './containers/Fandoms/AllFandoms/AllFandoms';
import ManageFandoms from './containers/Fandoms/ManageFandoms/ManageFandoms';
import AddNewFandom from './containers/Fandoms/ManageFandoms/AddNewFandom/AddNewFandom';

import Fanfic from './containers/Fanfic/Fanfic'

import ManageDownloader from './containers/ManageDownloader/ManageDownloader';

import TodoListClient from './containers/TodoListClient/TodoListClient';
import TodoListServer from './containers/TodoListServer/TodoListServer';

import Registrer from './containers/Auth/Register'
import Login from './containers/Auth/Login'
import PrivateRoute from "./components/private-route/PrivateRoute";
import Dashboard from "./containers/Auth/Dashboard";

if (localStorage.jwtToken) {
  // Set auth token header auth
  const token = localStorage.jwtToken;
  setAuthToken(token);
  // Decode token and get user info and exp
  const decoded = jwt_decode(token);
  // Set user and isAuthenticated
  store.dispatch(setCurrentUser(decoded));
// Check for expired token
  const currentTime = Date.now() / 1000; // to get in milliseconds
  if (decoded.exp < currentTime) {
    // Logout user
    store.dispatch(logoutUser());
    // Redirect to login
    window.location.href = "./login";
  }
}

function App() {
  return (
    <Layout>
      <Switch>
        <Route path="/manageFandoms" component={ManageFandoms} />
        <Route path="/manageDownloader" component={ManageDownloader} />
        <Route path="/allFandoms" component={AllFandoms} />
        <Route path="/addnewfandom" component={AddNewFandom} />
        <Route path="/fanfics/:FandomName" component={Fanfic} />
        <Route path="/registrer" component={Registrer} />
        <Route path="/login" component={Login} />
        <Route path="/todolistClient" component={TodoListClient} />
        <Route path="/todolistServer" component={TodoListServer} />
        <Route path="/" exact component={Index} />
        <PrivateRoute exact path="/dashboard" component={Dashboard} />
        <Redirect to="/" />
      </Switch>
    </Layout>
  );
}

export default withRouter(App);
