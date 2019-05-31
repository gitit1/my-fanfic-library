import React from 'react';

import './App.css';
import Layout from './hoc/Layout/Layout';
import Index from './containers/Index/Index'

function App() {
  return (
    <Layout>
      <Index/>
    </Layout>
  );
}

export default App;
