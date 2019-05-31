import React from 'react';
import classes from './Layout.module.css';
import Header from './Header/Header';
import Footer from './Footer/Footer';

const Layout = (props) => (
  <div className={classes.Layout}>
      <header className={classes.Header}>
          <Header/>
      </header>
      <main className={classes.Main}>
          {props.children}
      </main>
      <footer className={classes.Footer}>
          <Footer/>
      </footer>

  </div>
);

export default Layout;