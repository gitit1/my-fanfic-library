import React from 'react';

import { makeStyles } from '@material-ui/core/styles';
import Input from '@material-ui/core/Input';
import OutlinedInput from '@material-ui/core/OutlinedInput';
import FilledInput from '@material-ui/core/FilledInput';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormHelperText from '@material-ui/core/FormHelperText';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';

import classes from './Filters.module.css';
import {filtersArray} from './FiltersArray';

const Filters = (props) => (
    <div>
        <form className={classes.Root} onSubmit={(event)=>props.filtersAction(event)} autoComplete="off">
            <FormControl className={classes.FormControl}>
                <InputLabel htmlFor="sort-filters">Sort</InputLabel>
                <Select value={props.sort}
                        onChange={(event)=>props.filter(null,event,'sort')}
                        inputProps={{
                            name: 'sort',
                            id: 'sort-filters',
                        }}
                        >
                        {
                            filtersArray.Sort.map(filter=>(
                                <MenuItem   key={filter.name}
                                            value={filter.name} 
                                            >
                                    {filter.display}
                                </MenuItem>
                            ))  
                        }
                </Select>
            </FormControl>
        </form>
        <div className={classes.Filters}>
        <form onSubmit={(event)=>props.filtersAction(event)}>
            {/* TODO: */}
            {/* <h6>Search:</h6> */}
            {/* TODO: add delete button for deleted fanfics (only for manage user!) */}
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
            <br/>           
            <br/>           
            <br/>           
            <button className="btn waves-effect waves-light" type="submit" name="action">Submit
                <i className="material-icons right">send</i>
            </button>           
            <button className={`btn waves-effect waves-light ${classes.CancelButton}`}  type="button" onClick={()=>props.cancelFilters()} name="action">Cancel
                <i className="material-icons right">cancel</i>
            </button>
        </form>
        </div>
        
    </div>
);

export default Filters;


