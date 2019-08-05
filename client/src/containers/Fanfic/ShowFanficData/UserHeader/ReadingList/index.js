import React from 'react';
import ReactSVG from 'react-svg';

import classes from '../../ShowFanficData.module.css';
import ReadingListSVG from '../../../../../assets/images/icons/readingList.svg'

import Button from '@material-ui/core/Button';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';

const ReadingList = (props) => (
    <div className={`${classes.UserData}`}>
        <Button
            aria-haspopup="true"
            onClick={(event) =>props.props.openReadingListBox(event,props.inReadingList,props.fanfic.FanficID)}
        >
            Add to Reading List
        </Button>       
        {/* <ReactSVG src={ReadingListSVG} className={`${classes.ReadingList} ${classes.Icon}`} wrapper='span' alt='Add to Reading List'  title='Add to Reading List' /> */}
        {/* <span className={classes.IconLabel}>Add to Reading List</span> */}
            <Menu   getContentAnchorEl={null}
                    elevation={0}
                    anchorOrigin={{
                        vertical: 'bottom',
                        horizontal: 'center',
                    }}
                    transformOrigin={{
                        vertical: 'top',
                        horizontal: 'center',
                    }}
                    anchorEl={props.props.readingListAncor} 
                    keepMounted 
                    open={Boolean(props.props.readingListAncor)}
                    onClose={props.props.closeReadingListBox}
                    >
                <MenuItem key={props.fanfic.FanficID} onClick={props.props.closeReadingListBox}>
                    <h1>gitit</h1>
                </MenuItem>
            </Menu>
        }
    </div> 
);

export default ReadingList;
