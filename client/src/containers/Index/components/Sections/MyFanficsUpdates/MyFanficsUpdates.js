import React from 'react';
import { Link } from "react-router-dom";
import './MyFanficsUpdates.scss';

const MyFanficsUpdates = (props) => {
    const {updates} = props;
    return(
        <React.Fragment>
            <div className='myFanficsUpdates'>
                {(props.updates && props.updates!==null) ? updates.map(fanfics=>(
                    <p key={fanfics.FanficID}>{`${fanfics.FanficID} - ${fanfics.Status} - ${fanfics.StatusDetails}`}</p>
                )) : <p></p>}
            </div>
            <div className='link_see_all'><Link to="/myFanficsUpdates">See All</Link></div>
        </React.Fragment>
    )
};

export default MyFanficsUpdates;