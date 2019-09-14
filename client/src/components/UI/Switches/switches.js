import React from 'react';
import Switch from '@material-ui/core/Switch';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import { withStyles } from '@material-ui/styles';
import { green } from '@material-ui/core/colors';


const StyledSwitch = withStyles({
    switchBase: {
      color: green[300],
      '&$checked': {
        color: green[500],
      },
      '&$checked + $track': {
        backgroundColor: green[500],
      },
    },
    checked: {},
    track: {},
  })(Switch);

const switched = (props) => (
    props.fandomSelect.value!=='' &&               
        <FormControlLabel control={<StyledSwitch                                             
                                            checked={props.checked}
                                            onChange={()=>props.changed(props.id)}
                                        />
                                    }
                            label={props.label}
        />  
);

export default switched;