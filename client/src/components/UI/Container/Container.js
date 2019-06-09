import React from 'react';
import classes from './Container.module.css';

const Container = (props) => (
  <div className={classes.Container}>
      <div className={classes.Header}>
        <h3>{props.header}</h3>
      </div>
      <div className={classes.Main}>
        {props.children}
      </div>
  </div>
);

export default Container
