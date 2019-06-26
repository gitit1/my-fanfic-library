import React from 'react';
import classes from './Filters.module.css';

const Filters = (props) => (
    <div className={classes.Filters}>
        <form onSubmit={(event)=>props.filtersAction(event)}>
            <h6>Fanfic:</h6>
            <p>
            <label>
                {/* <input type="checkbox" name="Deleted (Archive)" checked={props.checked['deleted']} className="filled-in" onChange={()=>props.filter('Deleted')}/> */}
                <input type="checkbox" name="deleted" checked={props.checked['deleted']} className="filled-in" onChange={()=>props.filter('deleted')}/>
                <span style={{color:'green'}}>Deleted (Archive)</span>
            </label>
            </p>
            {/* TODO: */}
            <p>
            <label>
                <input type="checkbox" name="complete" checked={props.checked['complete']} className="filled-in" onChange={()=>props.filter('complete')}/>
                {/* <input type="checkbox" name="Complete" checked={props.checked['complete']} className="filled-in" onChange={()=>props.filter('Complete')}/> */}
                <span style={{color:'green'}}>Complete</span>
            </label>
            </p>
            {/* TODO: */}
            <p>
            <label>
                <input type="checkbox" name="Wip" className="filled-in" onChange={()=>props.filter('Wip')}/>
                <span>Work in Progress</span>
            </label>
            </p> 
            
            {/* TODO: */}
            <p>
            <label>
                <input type="checkbox" name="One Shot" className="filled-in" onChange={()=>props.filter('One Shot')}/>
                <span>One Shot</span>
            </label>
            </p>              
            {/* TODO: */}
            <p>
            <label>
                <input type="checkbox" name="Hits" className="filled-in" onChange={()=>props.filter('Hits')}/>
                <span>Hits</span>
            </label>
            </p> 
                          
            {/* TODO: */}
            <p>
            <label>
                <input type="checkbox" name="Kudos" className="filled-in" onChange={()=>props.filter('Kudos')}/>
                <span>Kudos</span>
            </label>
            </p>                           
            {/* TODO: */}
            <p>
            <label>
                <input type="checkbox" name="Bookmarks" className="filled-in" onChange={()=>props.filter('Bookmarks')}/>
                <span>Bookmarks</span>
            </label>
            </p> 
                                       
            {/* TODO: */}
            <p>
            <label>
                <input type="checkbox" name="Comments" className="filled-in" onChange={()=>props.filter('Comments')}/>
                <span>Comments</span>
            </label>
            </p>                                       
            {/* TODO: */}
            <p>
            <label>
                <input type="checkbox" name="Words" className="filled-in" onChange={()=>props.filter('Words')}/>
                <span>Words</span>
            </label>
            </p>                                                    
            {/* TODO: */}
            <p>
            <label>
                <input type="checkbox" name="Language" className="filled-in" onChange={()=>props.filter('Language')}/>
                <span>Language</span>
            </label>
            </p> 
            <br/>           
            <br/>           
            <br/>
            <br/>            
            <h6>User Data:</h6>
            <p>
            <label>
                <input type="checkbox" name="favorite" checked={props.checked['favorite']} className="filled-in" onChange={()=>props.filter('favorite')}/>
                <span style={{color:'green'}}>Favorites</span>
            </label>
            </p>
            {/* TODO: */}
            <p>
            <label>
                <input type="checkbox" name="Reading List" className="filled-in" onChange={()=>props.filter('Reading List')}/>
                <span>Reading List</span>
            </label>
            </p>
            {/* TODO: */}
            <p>
            <label>
                <input type="checkbox" name="Finished" className="filled-in" onChange={()=>props.filter('Finished')}/>
                <span>Finished</span>
            </label>
            </p>
            {/* TODO: */}
            <p></p>
            {/* TODO: */}
            <p>
            <label>
                <input type="checkbox" name="In Progress" className="filled-in" onChange={()=>props.filter('In Progress')}/>
                <span>In Progress</span>
            </label>
            </p>
            {/* TODO: */}
            <p>
            <label>
                <input type="checkbox" name="Ignored" className="filled-in" onChange={()=>props.filter('Ignored')}/>
                <span>Ignored</span>
            </label>
            </p>
            <br/>           
            <br/>           
            <br/>           
            <h6>Sort:</h6>
            {/* TODO: */}
            <p>
            <label>
                <input type="checkbox" name="Author" className="filled-in" onChange={()=>props.filter('Sort-Author')}/>
                <span>Author</span>
            </label>
            </p>
            {/* TODO: */}
            <p>
            <label>
                <input type="checkbox" name="Title" className="filled-in" onChange={()=>props.filter('Sort-Title')}/>
                <span>Title</span>
            </label>
            </p>
            {/* TODO: */}
            <p>
            <label>
                <input type="checkbox" name="Date Posted" className="filled-in" onChange={()=>props.filter('Sort-Date Posted')}/>
                <span>Date Posted</span>
            </label>
            </p>
            {/* TODO: */}
            <p>
            <label>
                <input type="checkbox" name="Date Updated" className="filled-in" onChange={()=>props.filter('Sort-Date Updated')}/>
                <span>Date Updated</span>
            </label>
            </p>
            {/* TODO: */}
            <p>
            <label>
                <input type="checkbox" name="Words Count" className="filled-in" onChange={()=>props.filter('Sort-Words Count')}/>
                <span>Words Count</span>
            </label>
            </p>
            {/* TODO: */}
            <p>
            <label>
                <input type="checkbox" name="Hits" className="filled-in" onChange={()=>props.filter('Sort-Hits')}/>
                <span>Hits</span>
            </label>
            </p>
            {/* TODO: */}
            <p>
            <label>
                <input type="checkbox" name="Kudos" className="filled-in" onChange={()=>props.filter('Sort-Kudos')}/>
                <span>Kudos</span>
            </label>
            </p>
            {/* TODO: */}
            <p>
            <label>
                <input type="checkbox" name="Comments" className="filled-in" onChange={()=>props.filter('Sort-Comments')}/>
                <span>Comments</span>
            </label>
            </p>
            {/* TODO: */}
            <p>
            <label>
                <input type="checkbox" name="Bookmarks" className="filled-in" onChange={()=>props.filter('Sort-Bookmarks')}/>
                <span>Bookmarks</span>
            </label>
            </p>
            <br/>
            <button className="btn waves-effect waves-light" type="submit" name="action">Submit
                <i className="material-icons right">send</i>
            </button>           
            <button className={`btn waves-effect waves-light ${classes.CancelButton}`}  type="button" onClick={()=>props.cancelFilters()} name="action">Cancel
                <i className="material-icons right">cancel</i>
            </button>
        </form>
    </div>
);

export default Filters;


