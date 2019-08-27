import React from 'react';
import Input from '../../../../../../components/UI/Input/Input';
import Button from '../../../../../../components/UI/Button/Button';

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
                    changed={(event) => props.changed(event,formElement.id)}/>
        ))}
        <br/>                               
        <Button  type="submit" disabled={props.disabled} clicked={()=>props.onSubmit()}>{props.buttonSendLabel}</Button>
        {/* <Button  btnType="Success" disabled={!this.state.formIsValid}>{this.state.editMode ? 'EDIT': 'ADD'} </Button> */}
    </form>
);

export default BuildForm;