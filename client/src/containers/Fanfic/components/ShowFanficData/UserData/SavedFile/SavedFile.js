import React from 'react';

const SavedFile = (props) => {
    const {fileName,savedAs,FandomName} = props.fanfic;
    
    return(
        <div className='SavedFile'>
        {savedAs && fileName && 
            <React.Fragment>
                <span>Saved on server:&nbsp;</span>
                {savedAs && savedAs.split(',').map(method=>(
                    <a  target='_blank' rel="noopener noreferrer" key={`${fileName}.${method}`}
                        href={`http://www.myfanficslibrary.com/fandoms/${FandomName.toLowerCase()}/fanfics/${fileName}.${method}`}>{method} </a>
                ))}
            </React.Fragment>
            
            }      
      </div>
    )
};

export default SavedFile;