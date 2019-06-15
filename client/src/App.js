import React from 'react';
import { Route, Switch, withRouter, Redirect } from 'react-router-dom';

import Layout from './hoc/Layout/Layout';
import Index from './containers/Index/Index';
import ManageFandoms from './containers/Fandoms/ManageFandoms/ManageFandoms';
import ManageDownloader from './containers/ManageDownloader/ManageDownloader';
import AllFandoms from './containers/Fandoms/AllFandoms/AllFandoms';
import AddNewFandom from './containers/Fandoms/ManageFandoms/AddNewFandom/AddNewFandom';
import TodoListClient from './containers/TodoListClient/TodoListClient';
import TodoListServer from './containers/TodoListServer/TodoListServer';

function App() {
  return (
    <Layout>
      <Switch>
        <Route path="/manageFandoms" component={ManageFandoms} />
        <Route path="/manageDownloader" component={ManageDownloader} />
        <Route path="/allFandoms" component={AllFandoms} />
        <Route path="/addnewfandom" component={AddNewFandom} />
        <Route path="/todolistClient" component={TodoListClient} />
        <Route path="/todolistServer" component={TodoListServer} />
        {/* <Route name="manageAuthor" path="/manageAuthor/:id" component={ManageAuthorPage} /> */}
        <Route path="/" exact component={Index} />
        <Redirect to="/" />
      </Switch>
    </Layout>
  );
}

export default withRouter(App);
