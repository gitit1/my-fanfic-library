import React from 'react';
import { Route, Switch, withRouter, Redirect } from 'react-router-dom';

import './App.css';
import Layout from './hoc/Layout/Layout';
import Index from './containers/Index/Index'

function App() {
  return (
    <Layout>
      <Index/>
      {/* <Switch> */}
        {/* <Route path="/fandoms" component={asyncAuth} /> */}
        {/* <Route path="/fandom" exact component={BurgerBuilder} /> */}
        {/* <Route path="/search" exact component={BurgerBuilder} /> */}
        {/* <Route path="/my_tracking" exact component={BurgerBuilder} /> */}
        {/* <Redirect to="/" /> */}
      {/* </Switch> */}
    </Layout>
  );
}

export default App;
// export default withRouter(App);
