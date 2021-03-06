import React from 'react';
import { Route, Switch, withRouter, Redirect } from 'react-router-dom';
import jwt_decode from "jwt-decode";

import ReactGA from 'react-ga';

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
import MyStatistics from './containers/UserData/MyStatistics/MyStatistics';
import ReadingList from './containers/UserData/ReadingList/ReadingList';
//Manage
import ManageFandoms from './containers/Manage/ManageFandoms';
import ManageDownloader from './containers/Manage/ManageDownloader/ManageDownloader';
import AddNewFandom from './containers/Manage/ManageFandoms/components/AddNewFandom';
import AddNewFanfic from './containers/Manage/AddNewFanfic/AddNewFanfic';
//Updates
import FullLatestUpdates from './containers/Updates/FullLatestUpdates/FullLatestUpdates'
import FullMyLatestActivity from './containers/Updates/FullMyLatestActivity/FullMyLatestActivity'
import FullMyFanficsUpdates from './containers/Updates/FullMyFanficsUpdates/FullMyFanficsUpdates'
//Auth
import Registrer from './containers/Auth/Register'
import Login from './containers/Auth/Login'
import RedirectPage from './containers/Auth/404/404'
//About
import About from './containers/About/About/About';
import ContactUs from './containers/About/ContactUs/ContactUs';
import Disclaimers from './containers/About/Disclaimers/Disclaimers';
import News from './containers/About/News/News';
// import RedirectToLink from './components/RedirectToLink/RedirectToLink'
ReactGA.initialize('UA-146053520-01');
ReactGA.pageview(window.location.pathname + window.location.search);

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

const siteVer = (!process.env.NODE_ENV || process.env.NODE_ENV === 'development') ? 1 : (window.location.href.includes('mfl')) ? 3 : 2;
console.log('Site Version:', siteVer);

function App() {


  return (
    <Layout>
      <Switch>
        <Route exact path="/" component={Index} />
        {/* UserData */}
        <PrivateRoute exact path="/dashboard" component={Dashboard} level={2} />
        <PrivateRoute exact path="/myTracker" component={MyStatistics} level={2} />
        <PrivateRoute exact path="/readingList" component={ReadingList} level={2} />
        {/* Manage */}
        <PrivateRoute exact path="/manageDownloader" component={ManageDownloader} level={1} />
        <PrivateRoute exact path="/manageFandoms" component={ManageFandoms} level={1} />
        <PrivateRoute exact path="/addnewfandom" component={AddNewFandom} level={1} />
        <PrivateRoute exact path="/addNewFanfic" component={AddNewFanfic} level={1} />
        {/* About */}
        <Route path="/about" component={About} />
        <Route path="/contact" component={ContactUs} />
        <Route path="/disclaimers" component={Disclaimers} />
        <Route path="/news" component={News} />
        {/* Auth */}
        <Route path="/login" component={Login} />
        <Route path="/404" component={RedirectPage} />
        {/* Updates */}
        <Route path="/latestUpdates" component={FullLatestUpdates} level={2} />
        <Route path="/myLatestActivity" component={FullMyLatestActivity} level={2} />
        <Route path="/myFanficsUpdates" component={FullMyFanficsUpdates} level={2} />
        {
          siteVer === 3 ?
            <>
              {/* Fandoms */}
              <Route path="/fandoms" component={Fandoms} level={1} />
              <Route path="/fanfics/:FandomName" component={Fanfic} level={1} />
              {/* Search */}
              <Route path="/search" component={Search} />
              {/* Auth */}
              <Route path="/register" component={Registrer} />
            </>
            :
            <>
              {/* Fandoms */}
              <PrivateRoute path="/fandoms" component={Fandoms} level={2} />
              <PrivateRoute path="/fanfics/:FandomName" component={Fanfic} level={2} />
              {/* Search */}
              <PrivateRoute path="/search" component={Search} level={1} />
              {/* Auth */}
              <PrivateRoute path="/register" component={Registrer} level={2} />
            </>
        }
        <Redirect to="/404" />
      </Switch>
    </Layout>
  );
}

export default withRouter(App);
