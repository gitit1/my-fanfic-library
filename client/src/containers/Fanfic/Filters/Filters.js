import React from 'react';

import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import FormLabel from '@material-ui/core/FormLabel';
import Select from '@material-ui/core/Select';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';

import classes from './Filters.module.css';
import {filtersArray} from './FiltersArray';

const Filters = (props) => (
    <div>
        <form className={classes.Root} onSubmit={(event)=>props.filtersAction(event)} autoComplete="off">
            <FormControl className={classes.FormControl}>
                <InputLabel htmlFor="sort-filters">Sort</InputLabel>
                <Select className={classes.SortSelect}
                        value={props.sort}
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
            <FormControl component="fieldset">
                <FormLabel focused={false} className={classes.FiltersFanficLabel}>General Filters:</FormLabel>
                <TextField
                    id="words_from"
                    label="Words Count"
                    // style={{ margin: 8 }}
                    placeholder="From"
                    type="number"
                    // fullWidth
                    margin="normal"
                    InputLabelProps={{
                        shrink: true,
                    }}
                    value={props.checked['wordsFrom']} 
                    onChange={(event)=>props.filter('wordsFrom',event,'filter')}
                />
                <TextField
                    id="words_to"
                    className={classes.textField}
                    value={props.checked['wordsTo']} 
                    type="number"
                    // style={{ margin: 8 }}
                    margin="normal"
                    placeholder="To"
                    onChange={(event)=>props.filter(`wordsTo`,event,'filter')}
                />
                <TextField
                    id="title"
                    label="Title"
                    // style={{ margin: 8 }}
                    // fullWidth
                    margin="normal"
                    InputLabelProps={{
                        shrink: true,
                    }}
                    value={props.checked['title']}
                    onChange={(event)=>props.filter('title',event,'filter')}
                />
                <TextField
                    id="author"
                    label="Author"
                    // style={{ margin: 8 }}
                    // fullWidth
                    margin="normal"
                    InputLabelProps={{
                        shrink: true,
                    }}
                    value={props.checked['author']}
                    onChange={(event)=>props.filter('author',event,'filter')}
                />
            </FormControl>
            <FormControl component="fieldset">
                <FormLabel focused={false} className={classes.FiltersFanficLabel}>Fanfic Filters</FormLabel>
                {
                    filtersArray.Fanfic.map(filter=>(
                        <FormControlLabel   key={filter.name}
                                            label={filter.display} 
                                            className={classes.FiltersFanficCheckBox} 
                                            control={<Checkbox  value={filter.name} 
                                                                onChange={()=>props.filter(`${filter.name}`,null,'filter')}
                                                                checked={props.checked[`${filter.name}`]}
                                                                style={{color:'black'}}
                                                        />} 
                        />
                    ))
                }
            </FormControl>
            <FormControl component="fieldset">
                <FormLabel focused={false} className={classes.FiltersFanficLabel}>User Data Filters</FormLabel>
                {
                    filtersArray.UserData.map(filter=>(
                        <FormControlLabel   key={filter.name}
                                            label={filter.display} 
                                            className={classes.FiltersFanficCheckBox} 
                                            control={<Checkbox  value={filter.name} 
                                                                onChange={()=>props.filter(`${filter.name}`,null,'filter')}
                                                                checked={props.checked[`${filter.name}`]}
                                                                style={{color:'black'}}
                                                        />} 
                        />
                    ))
                }
            </FormControl>
            <Button variant="outlined" type="submit" name="action" color="primary" className={classes.button}>Sort & Filter</Button>
            <Button variant="outlined" color="secondary" className={classes.button} onClick={()=>props.cancelFilters()} name="action">Cancel</Button>
        </form>                                                                 
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
            {/* TODO: */}
            {/* <p>
            <label>
                <input type="checkbox" name="Reading List" className="filled-in" onChange={()=>props.filter('Reading List')}/>
                <span>Reading List</span>
            </label>
            </p> */}          
    </div>
);

export default Filters;


