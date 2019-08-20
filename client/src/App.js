import React from 'react';
import { Route, Switch, withRouter, Redirect } from 'react-router-dom';
import jwt_decode from "jwt-decode";

import store from "./store/store";
import setAuthToken from "./utils/setAuthToken";
import { setCurrentUser, logoutUser } from "./store/actions";

import Layout from './hoc/Layout/Layout';
import PrivateRoute from "./components/private-route/PrivateRoute";

import Index from './containers/Index/Index';
//Fandoms
import Fandoms from './containers/Fandoms/Fandoms';
import Fanfic from './containers/Fanfic/Fanfic'
//Search
import Search from './containers/Search/Search'
//UserData
import Dashboard from './containers/UserData/Dashboard/Dashboard';
import MyFandoms from './containers/UserData/MyFandoms/MyFandoms';
import ReadingList from './containers/UserData/ReadingList/ReadingList';
//Manage
import ManageFandoms from './containers/Manage/ManageFandoms';
import ManageDownloader from './containers/Manage/ManageDownloader/ManageDownloader';
import AddNewFandom from './containers/Manage/ManageFandoms/components/AddNewFandom';
//Auth
import Registrer from './containers/Auth/Register'
import Login from './containers/Auth/Login'
//TODO: DELETE WHEN DONE
import TodoListClient from './containers/TodoListClient/TodoListClient';
import TodoListServer from './containers/TodoListServer/TodoListServer';



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
          <Route        exact path="/"                    component={Index}                       />
          {/* Fandoms */}
          <Route              path="/fandoms"             component={Fandoms}                     />
          <Route              path="/fanfics/:FandomName" component={Fanfic}                      />
          {/* Search */}
          <Route              path="/search"              component={Search}                      />
          {/* UserData */}  
          <PrivateRoute exact path="/dashboard"           component={Dashboard}         level={2} />
          <PrivateRoute exact path="/myFandoms"           component={MyFandoms}         level={2} />
          <PrivateRoute exact path="/readingList"         component={ReadingList}       level={2} />
          {/* Manage */}  
          <PrivateRoute exact path="/manageDownloader"    component={ManageDownloader}  level={1} />
          <PrivateRoute exact path="/manageFandoms"       component={ManageFandoms}     level={1} />
          <PrivateRoute exact path="/addnewfandom"        component={AddNewFandom}      level={1} />
          <PrivateRoute exact path="/editfandom"          component={AddNewFandom}      level={1} />
          {/* Auth */}  
          <Route              path="/register"           component={Registrer}                   />
          <Route              path="/login"               component={Login}                       />
          {/* TODO: DELETE WHEN DONE */}  
          {/* <PrivateRoute exact path="/todolistClient"      component={TodoListClient}    level={1} /> */}
          {/* <PrivateRoute exact path="/todolistServer"      component={TodoListServer}    level={1} /> */}

          <Redirect to="/" />
        </Switch>
      </Layout>
  );
}

export default withRouter(App);
