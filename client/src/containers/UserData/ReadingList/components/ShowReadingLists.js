import React from 'react';

const ShowReadingLists = (props) => {
    const {readingLists} = props;
    console.log('readingLists:',readingLists)
    return(
        readingLists.length>0 &&
        <div>
            {readingLists.map(rl=>(
                <p>{rl.Name}</p>
            ))
    
            }
        </div>
    )
};

export default ShowReadingLists;