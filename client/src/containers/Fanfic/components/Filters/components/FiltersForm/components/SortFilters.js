import React from 'react';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import Divider from '@material-ui/core/Divider';

const SortFilters = ({sort,source,filter,classes,filtersArray}) => {

    return(
        <React.Fragment>
                <FormControl className={classes.FormControl}>
                    <InputLabel htmlFor="sort-filters">Sort</InputLabel>
                    <Select className={classes.SortSelect}
                            value={sort}
                            onChange={(event)=>filter(null,event,'sort')}
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
                            value={source}
                            onChange={(event)=>filter(null,event,'source')}
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
        </React.Fragment>
    )
}

export default SortFilters;