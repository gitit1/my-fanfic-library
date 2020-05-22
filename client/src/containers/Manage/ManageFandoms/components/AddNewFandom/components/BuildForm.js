import React from 'react';
import Input from '../../../../../../components/UI/Input/Input';
import Button from '@material-ui/core/Button';

const BuildForm = (props) => (
    <form>
        {props.array.map(formElement=>(
                <Input
                    label={formElement.config.label}
                    classNameCustom={formElement.config.classNameCustom}
                    key={formElement.id}
                    elementType={formElement.config.elementType} 
                    elementConfig={formElement.config.elementConfig} 
                    value={formElement.config.value} 
                    invalid={!formElement.config.valid}
                    shouldValidate={formElement.config.validation}
                    touched={formElement.config.touched}
                    visible={formElement.config.visible}
                    disabled={formElement.config.disabled}
                    checked={(event) => props.check(event,formElement.id)}
                    changed={(event) => props.changed(event,formElement.id)}
                    getCategories={(array) => props.getCategories(array)}
                    exist={props.exist}
                    />
        ))}
        {/* <br/>                                */}
        <Button  type="submit" variant="contained"  className='send_button' disabled={props.disabled} onClick={(e)=>props.onSubmit(e)}>{props.buttonSendLabel}</Button>
        <br/> 
    </form>
);

export default BuildForm;