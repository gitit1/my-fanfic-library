import React from 'react';

const MyLatestActivity = (props) => (
    <div className='myLatestActivity'>
        {/* TODO:FIX LINK TO ALL */}
        {props.updates.map(activity=>(
            <p>{`${activity.FandomName} - ${activity.ActivityType} - `}
                <a target='_blank' rel="noopener noreferrer"  href={`https://archiveofourown.org/works/${activity.FanficID}`}>{`${activity.Author}  ${activity.FanficTitle}`}</a> 
            </p>
        ))}
        
    </div>
);

export default MyLatestActivity;


/*TODO: FULL PAGE OF THE LATEST ACTIVITIS: BY MONTH/YEAR
SERVER: 
            - EACH MONTH TO PUT IN ARCHIVE
*/