import React from 'react';
import Drawer from '@material-ui/core/Drawer';
import Button from '@material-ui/core/Button';
import { Grid } from '@material-ui/core';

import FiltersForm from './components/FiltersForm';


const Filters = (props) => {

    const {sort,source,getCategories} = props;
    const {checked,drawer,toggleDrawer,filterHandler,cancel,activeFilter} = props.filters
    return(
        <Grid className={'buttons'} item xs={3}>
            <Button onClick={toggleDrawer(true)}>Filters</Button>
            <Drawer anchor="right" open={drawer} onClose={toggleDrawer(false)}>
                <div className='filterDrewer' role="presentation">
                    <Button onClick={toggleDrawer(false)}>Close</Button>
                    <FiltersForm filter={filterHandler}
                                sort={sort}
                                source={source}
                                cancelFilters={cancel}
                                filtersAction={activeFilter}
                                checked={checked}
                                getCategories={getCategories}
                    />
                </div>
            </Drawer>
        </Grid>
    )
};

export default Filters;