import React from 'react';
import classes from './TodoList.module.css';

const TodoList = () => (
  <div className={classes.TodoList}>
      {/* <div className={classes.Row}> */}
        <div className={classes.Box}>
            <div>
                <span className={classes.Component}>Component:</span> 
                <span className={classes.Header}> Fandoms - All Fandoms:</span>
            </div>
            <ul className={classes.insideUl}>
                <li>css - adapt to all views (media queries)</li>
            </ul>
        </div>
        <div className={classes.Box}>
            <div>
                <span className={classes.Component}>Component:</span> 
                <span className={classes.Header}> Navigator.js:</span>
            </div>
            <ul>
                <li>Autorization to pages</li>
            </ul>
        </div>
  </div>
);

export default TodoList;