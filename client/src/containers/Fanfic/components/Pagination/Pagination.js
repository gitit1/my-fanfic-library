import React from 'react';
import { Grid } from '@material-ui/core';
import RCPagination from 'rc-pagination';

const Pagination = (props) => (
    <Grid className={'paginationGrid'}>
        <RCPagination onChange={props.paginationClickHandler} 
                current={props.pageNumber} 
                total={props.fanficsCurrentCount}
                className={'pagination'}
                defaultPageSize={props.pageLimit}
                showTotal={(total, range) => `${range[0]} - ${range[1]} of ${total} Works`}
        />
    </Grid>
);

export default Pagination;