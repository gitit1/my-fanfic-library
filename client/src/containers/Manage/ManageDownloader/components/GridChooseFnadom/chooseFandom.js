import React from 'react';
import Input from '../../../../../components/UI/Input/Input';

const ChooseFandom = (props) => (
    <Input
        id={props.fandomSelect.id}
        label={props.fandomSelect.label}
        elementType={props.fandomSelect.elementType} 
        elementConfig={props.fandomSelect.elementConfig} 
        value={props.fandomSelect.value} 
        visible={props.fandomSelect.visible}
        changed={props.changed}
    />
);

export default ChooseFandom;