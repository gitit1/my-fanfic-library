import React from 'react';

const myFanficsUpdates = (props) => {
    const {updates} = props;
    return(
        <div className='myFanficsUpdates'>
            {updates.map(fanfics=>(
                <p key={fanfics.FanficID}>{`${fanfics.FanficID} - ${fanfics.Status} - ${fanfics.StatusDetails}`}</p>
            ))}
        </div>
    )
};

export default myFanficsUpdates;


/*TODO: FULL PAGE OF My Fanfics: BY MONTH/YEAR
SERVER: 
            - EACH MONTH TO PUT IN ARCHIVE
*/
//add announcment if empty 