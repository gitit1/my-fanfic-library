import React from 'react';

const myFanficsUpdates = (props) => (
    <div className='myFanficsUpdates'>
        {/* TODO:FIX LINK TO ALL */}
        {props.updates.map(fanfics=>(
            <p>{fanfics.FanficID}</p>
        ))}
        
    </div>
);

export default myFanficsUpdates;


/*TODO: FULL PAGE OF My Fanfics: BY MONTH/YEAR
SERVER: 
            - EACH MONTH TO PUT IN ARCHIVE
*/