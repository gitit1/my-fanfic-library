import React from 'react';
import { Link } from "react-router-dom";

import './MyLatestActivity.scss';

const MyLatestActivity = (props) => {
    const {updates} = props;
    return(
        <React.Fragment>
            <div className='myLatestActivity'>
                {(props.updates && props.updates!==null) ? updates.map(activity=>{
                    const {Date,FandomName,ActivityType,Author,FanficTitle,FanficID,Source} = activity;
                    return(
                        <p key={Date}>{`${FandomName} - ${ActivityType} - `}
                            <a target='_blank' rel="noopener noreferrer"  
                            href={(Source==='AO3') ? `https://archiveofourown.org/works/${FanficID}` : `https://www.fanfiction.net/s/${FanficID}`}>
                            {`${Author}  ${FanficTitle}`}
                            </a> 
                        </p>
                    )
    
                }) : <p></p>}
            </div>
            <div className='link_see_all'><Link to="/myLatestActivity">See All</Link></div>
        </React.Fragment>
    )
};

export default MyLatestActivity;