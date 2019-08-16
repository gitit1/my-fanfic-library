import React from 'react';

const ErrorMessages = (props) => {
    switch (props.fandomAddedFlag) {
        case 1:
            return <p className='message' style={{color:'green'}}>Fandom Added Successfully</p>;             
        case 2:
            return <p className='message' style={{color:'red'}}>Fandom Alredy Exsist!!</p>;
        case 3:
            return <p className='message' style={{color:'red'}}>There was an error</p>;
        default:
            return null;            
    }
};

export default ErrorMessages;