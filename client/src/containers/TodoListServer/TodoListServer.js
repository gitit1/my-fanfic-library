import React from 'react';
import classes from './TodoListServer.module.css';

const TodolistServer = () => (
  <div className={classes.TodolistServer}>
      {/* <div className={classes.Row}> */}
        <div className={classes.Box}>
            <div>
                <span className={classes.Other}>Other:</span> 
                <span className={classes.Header}> Funcionality</span>
            </div>
            <ul className={classes.insideUl}>
                <li>order the functions in controllers</li>
                <li>clean the functions</li>
            </ul>
        </div>
  </div>
);

export default TodolistServer;