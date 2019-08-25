import React from 'react';
import { Grid } from '@material-ui/core';
import RCPagination from 'rc-pagination';
import './Pagination.css';

const Pagination = (props) => (
    <Grid className={props.gridClass}>
        <RCPagination   onChange={(e) => props.onChange(e)} 
                        current={props.current} 
                        total={props.total}
                        className={props.paginationClass}
                        defaultPageSize={props.pageLimit}
                        showTotal= {(total, range) => props.showTotal&& `${range[0]} - ${range[1]} of ${total} Works`}
        />
    </Grid>
);

export default Pagination;