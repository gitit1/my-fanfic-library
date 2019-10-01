import React from 'react';
import Menu from '@material-ui/core/Menu';
import MenuList from '@material-ui/core/MenuList';
import MenuItem from '@material-ui/core/MenuItem';
import Button from '@material-ui/core/Button';
import { withStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import Divider from '@material-ui/core/Divider';


const StyledMenu = withStyles({
    paper: {
      border: '1px solid #d3d4d5',
    },
  })(props => (
    <Menu
      elevation={0}
      getContentAnchorEl={null}
      anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'center',
      }}
      transformOrigin={{
        vertical: 'top',
        horizontal: 'center',
      }}
      {...props}
    />
  ));


const ReadingList = (props) => {
    const {fanfic,userData,readingLists} = props;
    const [anchorEl, setAnchorEl] = React.useState(null);
    const readingListCombine = (readingLists.readingLists.length>0 && readingLists.newReadingLists.newLists.length>0) ?
                               [...new Set([...readingLists.readingLists ,...readingLists.newReadingLists.newLists])] :
                               (readingLists.readingLists.length>0 && readingLists.newReadingLists.newLists.length===0) ?
                               readingLists.readingLists :
                               (readingLists.readingLists.length===0 && readingLists.newReadingLists.newLists.length>0) ?
                               readingLists.newReadingLists.newLists :
                               null;
    const   inReadingList     =   (userData && (userData.ReadingList!==''||userData.ReadingList.length>0)) ? true : false;
    const   userReadingList     = inReadingList && userData.ReadingList;

    function handleClick(event) {
        setAnchorEl(event.currentTarget);
      }
    
    function handleClose() {
        setAnchorEl(null);
    } 

    return(
        <div className='userData'>
            <Button color='primary' onClick={handleClick} className={userReadingList&&userReadingList.length>0 ? 'userData_orange' : null}>
              {props.rlMode ? 'Remove From' : userReadingList  ? 'Add to Another' : 'Add to'} Reading List
            </Button>    
            <StyledMenu
                anchorEl={anchorEl}
                keepMounted
                open={Boolean(anchorEl)}
                onClose={handleClose}
            > 
                <div>
                    <div className='ReadingList_DropDown'>
                      {readingListCombine!==null &&
                      <MenuList className='ReadingList_DropDown_rl'>
                        {readingListCombine.map(rl=>(
                            <React.Fragment key={rl}>
                              <MenuItem onClick={()=>readingLists.addToReadingList(fanfic,rl)}>
                                  <span className={userReadingList && (userReadingList.includes(rl)) ? 'rl_green' : ''}>{rl}</span>                              
                              </MenuItem>
                              <Divider/>
                            </React.Fragment>
                          ))
                        }
                      </MenuList>
                      }
                      <div  className='ReadingList_DropDown_new'>
                        <TextField  placeholder='Add new Reading List...'
                                    margin="dense"
                                    value={readingLists.newReadingLists.value} 
                                    onKeyDown={(event)=>readingLists.setReadingList(event,fanfic)}  />
                        <Button     color='primary' 
                                    onClick={()=>readingLists.addToReadingList(fanfic,null)}>
                                    Add
                        </Button>   
                      </div>
                    </div>
                </div>
            </StyledMenu>                          
        </div>
    )
};

export default ReadingList;