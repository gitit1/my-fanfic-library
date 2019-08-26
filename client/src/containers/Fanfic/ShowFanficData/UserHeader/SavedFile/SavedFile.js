import React from 'react';
import Button from '@material-ui/core/Button';

const SavedFile = (props) => {
    const {fileName,savedAs,FandomName,method} = props.fanfic;
    return(
        <div className='SavedFile'>
        {fileName && 
            <React.Fragment>
                <span>Saved on server:</span>
                {savedAs.split(',').map(method=>(
                    <a target='_blank' href={`http://myfanficlybrary.tk/fandoms/${FandomName.toLowerCase()}/fanfics/${fileName}.${method}`}>{method} </a>
                ))}
            </React.Fragment>
            
            }      
      </div>
    )
};

export default SavedFile;