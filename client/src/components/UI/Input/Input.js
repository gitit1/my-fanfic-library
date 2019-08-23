import React from 'react';
import classes from './Input.module.css';

import TextField from '@material-ui/core/TextField';
import Select from '@material-ui/core/Select';
import InputLabel from '@material-ui/core/InputLabel';
import FormControl from '@material-ui/core/FormControl';
import Checkbox from '@material-ui/core/Checkbox';

const input = (props) => {
    let inputElement =null;
    const inputClasses = [classes.InputElement];
    
    if(props.invalid && props.shouldValidate && props.touched){
        inputClasses.push(classes.Invalid)
    }

    switch(props.elementType){
        case ('input'):
            inputElement = <TextField 
                                className={inputClasses.join(' ')} 
                                label={props.label}
                                {...props.elementConfig} 
                                value={props.value}
                                disabled={props.disabled}
                                margin="dense"
                                onChange={props.changed}/>
            break;
        case ('textarea'):
            inputElement = <textarea 
                                className={inputClasses.join(' ')} 
                                {...props.elementConfig}
                                value={props.value}
                                onChange={props.changed}/>
            break;
        case ('select'):
            inputElement =  <React.Fragment>
                                <FormControl className={classes.FormControl}>
                                    <InputLabel htmlFor={props.id}>{props.label}</InputLabel>
                                    <Select 
                                        native
                                        inputProps={{
                                            name: props.id,
                                            id: props.id,
                                        }}                                 
                                        value={props.value}
                                        onChange={props.changed}>
                                            
                                        <option value='' disabled/>
                                        {props.elementConfig.options.map(option =>(
                                            <option key={option.value} 
                                                    value={option.value}>
                                                {option.displayValue}
                                            </option>
                                        ))}                                    
                                    </Select>
                                </FormControl>
                            </React.Fragment>
            break;  
        case ('checkbox'):
            inputElement = <div className={props.classNameCustom}>
                                 {props.elementConfig.options.map(option =>(
                                    <React.Fragment key={option.value}>
                                        <Checkbox type="checkbox" 
                                            color="default"                                          
                                            name={option.value}
                                            value={option.value}
                                            onChange={props.checked}
                                            checked={option.checked}
                                        />                                           
                                        {option.displayValue}
                                    </React.Fragment>
                                ))}
                           </div>
            
            break;   
        default:
            inputElement = <input                                 
                                className={inputClasses.join(' ')} 
                                {...props.elementConfig}
                                value={props.value}
                                onChange={props.changed}/>
    }
    return(
        <div className={props.visible ? classes.Show : classes.Hidden}>
        {/* // classes.Input */}
            {/* <label className={classes.Label}>{props.label}</label> */}
            
            {inputElement}
        </div>
    )
};

export default input;