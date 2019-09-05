import React from 'react';

import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import Divider from '@material-ui/core/Divider';
import FormControl from '@material-ui/core/FormControl';
import FormLabel from '@material-ui/core/FormLabel';
import Select from '@material-ui/core/Select';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';

import classes from '../Filters.module.scss';
import {filtersArray} from '../assets/FiltersArray';
import {categories} from '../../ShowFanficData/FanficData/Categories/assets/categoriesList';
import SelectCategories from '../../../../components/UI/Input/SelectAutoComplete'

const Filters = (props) => (
    <div className={classes.Filters}>
        <form className={classes.Form} onSubmit={(event)=>props.filtersAction(event)} autoComplete="off">
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
            <FormControl className={`${classes.FormControl} ${classes.Source}`}>
                <InputLabel htmlFor="source-filters">Source</InputLabel>
                <Select className={classes.SortSelect}
                        value={props.source}
                        onChange={(event)=>props.filter(null,event,'source')}
                        inputProps={{
                            name: 'source',
                            id: 'source-filters',
                        }}
                        >
                        {
                            filtersArray.Source.map(filter=>(
                                <MenuItem   key={filter.name}
                                            value={filter.name} 
                                            >
                                    {filter.display}
                                </MenuItem>
                            ))  
                        }
                </Select>
            </FormControl>    
            <Divider variant='fullWidth' className={classes.Devider}/>              
            <FormControl  className={classes.FormControl} component="fieldset">
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
                <SelectCategories id="categories-filters" class={classes.SelectCategories} label='Categories'
                                  getDataArray={props.getCategories} suggestions={categories}  placeholder={'Select Categories'}/>
                <SelectCategories id="categories-filters" class={classes.SelectCategories} label='Tags'
                                  getDataArray={props.getCategories} suggestions={categories}  placeholder={'Select Tags'}/>
            </FormControl>
            <Divider variant='fullWidth' className={classes.Devider}/>
            <FormControl className={classes.FormControl}  component="fieldset">
                <FormLabel focused={false} className={classes.FiltersFanficLabel}>General Filters:</FormLabel>
                <TextField
                    id="id"
                    label="Fanfic ID"
                    // style={{ margin: 8 }}
                    // fullWidth
                    margin="normal"
                    InputLabelProps={{
                        shrink: true,
                    }}
                    value={props.checked['fanficId']}
                    onChange={(event)=>props.filter('fanficId',event,'filter')}
                />
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
            <Divider variant='fullWidth' className={classes.Devider}/>  

            <FormControl  className={classes.FormControl} component="fieldset">
                
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
            <Divider variant='fullWidth'  className={classes.Devider} />
            <Button variant="outlined" type="submit" name="action" color="primary" className={classes.Button}>Sort & Filter</Button>
            <Button variant="outlined" color="secondary" className={classes.Button} onClick={()=>props.cancelFilters()} name="action">Cancel</Button>
        </form>                                                                       
    </div>
);

export default Filters;


