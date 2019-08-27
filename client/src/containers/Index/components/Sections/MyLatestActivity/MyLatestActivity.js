import React from 'react';

const MyLatestActivity = (props) => {
    const {updates} = props;
    return(
        <div className='myLatestActivity'>
            {/* TODO:FIX LINK TO ALL */}
            {updates.map(activity=>(
                <p key={activity.Date}>{`${activity.FandomName} - ${activity.ActivityType} - `}
                    <a target='_blank' rel="noopener noreferrer"  href={`https://archiveofourown.org/works/${activity.FanficID}`}>{`${activity.Author}  ${activity.FanficTitle}`}</a> 
                </p>
            ))}
        </div>
    )
};

export default MyLatestActivity;


/*TODO: FULL PAGE OF THE LATEST ACTIVITIS: BY MONTH/YEAR
SERVER: 
            - EACH MONTH TO PUT IN ARCHIVE
*/