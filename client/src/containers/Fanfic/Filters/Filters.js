import React from 'react';

const Filters = (props) => (
    <form onSubmit={(event)=>props.filtersAction(event)}>
        <p>
        <label>
            <input type="checkbox" name="Favorites" className="filled-in" onChange={()=>props.filter('Favorite')}/>
            <span>Favorites</span>
        </label>
        </p>
        <button class="btn waves-effect waves-light" type="submit" name="action">Submit
            <i class="material-icons right">send</i>
        </button>
    </form>
);

export default Filters;


