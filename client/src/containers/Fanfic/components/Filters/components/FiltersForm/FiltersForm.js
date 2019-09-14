import React from 'react';
import Button from '@material-ui/core/Button';

import classes from '../../Filters.module.scss';
import {filtersArray} from '../../assets/FiltersArray';

import SortFilters from './components/SortFilters'
import FanficsFilters from './components/FanficsFilters'
import GeneralFilters from './components/GeneralFilters'
import UserDataFilters from './components/UserDataFilters'

const Filters = (props) => {
    const {sort,source,filter,checked,getCategories,filteredCategories} = props;

    return (
        <div className={classes.Filters}>
            <form className={classes.Form} onSubmit={(event)=>props.filtersAction(event)} autoComplete="off">
                <SortFilters {...{classes,sort,source,filter,filtersArray}}/>            
                <FanficsFilters {...{classes,filtersArray,checked,filter,getCategories,filteredCategories}}/>
                <GeneralFilters {...{classes,checked,filter}}/>
                <UserDataFilters {...{classes,filtersArray,checked,filter}}/>

                <Button variant="outlined" type="submit" name="action" color="primary" className={classes.Button}>Sort & Filter</Button>
                <Button variant="outlined" color="secondary" className={classes.Button} onClick={()=>props.cancelFilters()} name="action">Cancel</Button>
            </form>                                                                       
        </div>
    )
};

export default Filters;


