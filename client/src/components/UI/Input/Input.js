import React from 'react';
import classes from './Input.module.css';

const input = (props) => {
    let inputElement =null;
    const inputClasses = [classes.InputElement];

    if(props.invalid && props.shouldValidate && props.touched){
        inputClasses.push(classes.Invalid)
    }

    switch(props.elementType){
        case ('input'):
            inputElement = <input 
                                className={inputClasses.join(' ')} 
                                {...props.elementConfig} 
                                value={props.value}
                                disabled={props.disabled}
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
            inputElement = <select 
                                className={inputClasses.join(' ')}                                     
                                value={props.value}
                                onChange={props.changed}>
                                {props.elementConfig.options.map(option =>(
                                    <option key={option.value} 
                                            value={option.value}>
                                        {option.displayValue}
                                    </option>
                                ))}                                    
                            </select>
            break;  
        case ('checkbox'):
            inputElement = <div>
                                {props.elementConfig.options.map(option =>(
                                    <React.Fragment key={option.value}>
                                        <input type="checkbox"                                           
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
            <label className={classes.Label}>{props.label}</label>
            {inputElement}
        </div>
    )
};

export default input;