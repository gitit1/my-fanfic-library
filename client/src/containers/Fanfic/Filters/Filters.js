import React from 'react';
import Drawer from '@material-ui/core/Drawer';
import Button from '@material-ui/core/Button';
import { Grid } from '@material-ui/core';

import FiltersForm from './components/FiltersForm/FiltersForm';


const Filters = (props) => {

    const {getCategories} = props;
    const {checked,drawer,toggleDrawer,filterHandler,cancel,activeFilter} = props.filters;
    return(
        <Grid className={'buttons'} item xs={3}>
            <Button onClick={toggleDrawer(true)}>Filters</Button>
            <Drawer anchor="right" open={drawer} onClose={toggleDrawer(false)}>
                <div className='filterDrewer' role="presentation">
                    <Button onClick={toggleDrawer(false)}>Close</Button>
                    <FiltersForm    filter={filterHandler}
                                    sort={checked.currentSort}
                                    source={checked.currentSource}
                                    cancelFilters={cancel}
                                    filtersAction={activeFilter}
                                    checked={checked}
                                    getCategories={getCategories}
                                    filteredCategories={checked.categories}
                    />
                </div>
            </Drawer>
        </Grid>
    )
};

export default Filters;