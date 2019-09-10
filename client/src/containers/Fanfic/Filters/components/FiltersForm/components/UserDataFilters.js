import React from 'react';
import FormControl from '@material-ui/core/FormControl';
import Divider from '@material-ui/core/Divider';
import FormLabel from '@material-ui/core/FormLabel';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';

const UserDataFilters = ({classes,filtersArray,checked,filter}) => {
    const [flag, setAnchorEl] = React.useState(false,null);

    function toggleFanficsFilters(e) {
        e.preventDefault();
        setAnchorEl(!flag);
    }

    return(
        <React.Fragment>
                <FormControl className={classes.FormControl} component="fieldset">
                    <FormLabel focused={false} className={classes.FiltersFanficLabel} onClick={toggleFanficsFilters}>
                        <span style={{display: 'flex',alignItems: 'center'}}>
                            <i class="material-icons">{flag ? 'keyboard_arrow_down' : 'keyboard_arrow_right'}</i>
                            User Data Filters:
                        </span>
                    </FormLabel>
                    { flag &&
                    <React.Fragment>
                    <FormLabel focused={false} className={classes.FiltersFanficLabel}></FormLabel>
                    {
                        filtersArray.UserData.map(check=>(
                            <FormControlLabel   key={check.name}
                                                label={check.display} 
                                                className={classes.FiltersFanficCheckBox} 
                                                control={<Checkbox  value={check.name} 
                                                                    onChange={()=>filter(`${check.name}`,null,'filter')}
                                                                    checked={checked[`${check.name}`]}
                                                                    style={{color:'black'}}
                                                            />} 
                            />
                        ))
                    }
                    </React.Fragment>
                    }
            </FormControl>
            <Divider variant='fullWidth' className={classes.Devider}/>   
        </React.Fragment>
    )
}
export default UserDataFilters;