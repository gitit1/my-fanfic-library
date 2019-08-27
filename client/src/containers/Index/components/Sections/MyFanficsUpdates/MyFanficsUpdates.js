import React from 'react';
import { Link } from "react-router-dom";
import './MyFanficsUpdates.scss';

const MyFanficsUpdates = (props) => {
    const {updates} = props;
    return(
        <React.Fragment>
            <div className='myFanficsUpdates'>
                {updates.map(fanfics=>(
                    <p key={fanfics.FanficID}>{`${fanfics.FanficID} - ${fanfics.Status} - ${fanfics.StatusDetails}`}</p>
                ))}
            </div>
            <div className='link_see_all'><Link to="/myFanficsUpdates">See All</Link></div>
        </React.Fragment>
    )
};

export default MyFanficsUpdates;


/*TODO: FULL PAGE OF My Fanfics: BY MONTH/YEAR
SERVER: 
            - EACH MONTH TO PUT IN ARCHIVE
*/
//add announcment if empty 