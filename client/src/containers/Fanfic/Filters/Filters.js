import React from 'react';
import classes from './Filters.module.css';
import {filtersArray} from '../../../components/Forms/FiltersArray'
const Filters = (props) => (
    <div className={classes.Filters}>
        <form onSubmit={(event)=>props.filtersAction(event)}>
            {/* TODO: */}
            {/* <h6>Search:</h6> */}
            <h6>Fanfic:</h6>
            {
                filtersArray.Fanfic.map(filter=>(
                    <p key={filter.name}>
                        <label>
                           <input type={filter.type} name={filter.name} checked={props.checked[`${filter.name}`]} className="filled-in" onChange={()=>props.filter(`${filter.name}`)}/>
                            <span style={{color:'green'}}>{filter.display}</span>
                        </label>
                    </p>
                ))
            } 
            <br/>                    
            <br/>  
            <h6>Sort:</h6>           
            {
                filtersArray.Sort.map(filter=>(
                    <p key={filter.name}>
                        <label>
                           <input type={filter.type} name={filter.name} checked={props.checked[`${filter.name}`]} className="filled-in" onChange={()=>props.filter(`${filter.name}`)}/>
                            <span style={{color:'green'}}>{filter.display}</span>
                        </label>
                    </p>
                ))
            }                                                                  
            {/* TODO: */}
            <div className="row">
                <div className="col s12">
                    <b>Words Count:</b> From:
                    <div className="input-field inline">
                        <input id="words_from" type="number" value={props.checked['wordsFrom']} onChange={(event)=>props.filter('wordsFrom',event)}/>
                    </div>
                    &nbsp;To&nbsp; 
                    <div className="input-field inline">
                        <input id="words_to" type="number" value={props.checked['wordsTo']}  onChange={(event)=>props.filter(`wordsTo`,event)}/>
                    </div>
                    &nbsp;&nbsp;&nbsp;<b>Title:</b>
                    <div className="input-field inline">
                        <input id="Title" type="text"  value={props.checked['title']}  onChange={(event)=>props.filter('title',event)}/>
                    </div>
                    &nbsp;&nbsp;&nbsp;<b>Author:</b>
                    <div className="input-field inline">
                        <input id="Author" type="text"  value={props.checked['author']}  onChange={(event)=>props.filter('author',event)}/>
                    </div>
                {/* TODO: */}
                {/* <div className="input-field inline">
                    <select name="language">
                        <option value="English">English</option>
                        <option value="Deutsch">Deutsch</option>
                        <option value="Italiano">Italiano</option>
                        <option value="Français">Français</option>
                        <option value="Español">Español</option>
                        <option value="Magyar">Magyar</option>
                        <option value="Polski">Polski</option>
                        <option value="Português brasileiro">Português brasileiro</option>
                        <option value="Português europeu">Português europeu</option>
                        <option value="Русский">Русский</option>
                        <option value="Spanish">Spanish</option>
                    </select>
                </div> */}
                </div>
            </div>
            <br/>            
            <h6>User Data:</h6>
            {
                filtersArray.UserData.map(filter=>(
                    <p key={filter.name}>
                        <label>
                           <input type={filter.type} name={filter.name} checked={props.checked[`${filter.name}`]} className="filled-in" onChange={()=>props.filter(`${filter.name}`)}/>
                            <span style={{color:'green'}}>{filter.display}</span>
                        </label>
                    </p>
                ))
            }
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
            {/* TODO: */}
            {/* filters by tags */}
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


