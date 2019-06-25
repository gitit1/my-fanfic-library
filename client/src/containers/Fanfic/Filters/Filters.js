import React from 'react';
import classes from './Filters.module.css';

const Filters = (props) => (
    <div className={classes.Filters}>
        <form onSubmit={(event)=>props.filtersAction(event)}>
            <p>
            <label>
                <input type="checkbox" name="Favorites" className="filled-in" onChange={()=>props.filter('Favorite')}/>
                <span>Favorites</span>
            </label>
            </p>
            <p>
            <label>
                <input type="checkbox" name="Deleted (Archive)" className="filled-in" onChange={()=>props.filter('Deleted')}/>
                <span>Deleted</span>
            </label>
            </p>
            <button className="btn waves-effect waves-light" type="submit" name="action">Submit
                <i className="material-icons right">send</i>
            </button>
        </form>
    </div>
);

export default Filters;


