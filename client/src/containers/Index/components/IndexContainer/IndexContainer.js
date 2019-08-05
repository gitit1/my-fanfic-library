import React from 'react';
import classes from './IndexContainer.module.css';

const IndexContainer = (props) => (
  <div className={classes.Index}>
  <section className={[classes.IndexFandoms, classes.Box].join(' ')}>
  <h3 className={classes.Heading}>{props.header}</h3>
      {props.children}                           
  </section>
</div>
);

export default IndexContainer;