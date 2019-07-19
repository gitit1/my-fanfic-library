import React from 'react';
import classes from './TodoListClient.module.css';

const TodoListClient = () => (
  <div className={classes.TodoListClient}>
      {/* <div className={classes.Row}> */}
        <div className={classes.Box}>
            <div>
                <span className={classes.Component}>Component:</span> 
                <span className={classes.Header}> Fandoms - All Fandoms:</span>
            </div>
            <ul className={classes.insideUl}>
                <li></li>
            </ul>
        </div>
        <div className={classes.Box}>
            <div>
                <span className={classes.Component}>Component:</span> 
                <span className={classes.Header}> Fandoms - Mangae Fandoms:</span>
            </div>
            <ul className={classes.insideUl}>
                <li>add spinner after delete</li>
                <li>add spinner before loading data</li>
            </ul>
        </div>
        <div className={classes.Box}>
            <div>
                <span className={classes.Component}>Component:</span> 
                <span className={classes.Header}> Fandoms - Mangae Fandoms - ShowFandomData:</span>
            </div>
            <ul className={classes.insideUl}>
                <li>add links to fandom page</li>
            </ul>
        </div>
        <div className={classes.Box}>
            <div>
                <span className={classes.Component}>Component:</span> 
                <span className={classes.Header}> Fandoms - Mangae Fandoms - add new fandom:</span>
            </div>
            <ul className={classes.insideUl}>
                <li>add spinner after adding button</li>
                <li>spaces between text in checkbox</li>
            </ul>
        </div>
        <div className={classes.Box}>
            <div>
                <span className={classes.Other}>Other: </span> 
                <span className={classes.Header}>Functionality:</span>
            </div>
            <ul>
                <li>Breadcrumbs to all the site</li>
            </ul>
        </div>
        <div className={classes.Box}>
            <div>
                <span className={classes.Other}>Other: </span> 
                <span className={classes.Header}>Style:</span>
            </div>
            <ul>
                <li>Responsability to all the site</li>
                <li>css - adapt to all views (media queries)</li>
                <li>give all pages the same 'settings': same max width/colors/buttons....</li>
            </ul>
        </div>
  </div>
);

export default TodoListClient;