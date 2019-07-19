import React from 'react';
import classes from '../ShowFanficData.module.css';
import Chip from '@material-ui/core/Chip';

const Tags = (props) => (
    <React.Fragment>
        {
            props.fanfic.Tags.map((tags)=>(
                <div key={Object.keys(tags)[0]}>
                    <b>{ `${Object.keys(tags)[0]}: `}</b>                                                    
                    {tags[Object.keys(tags)[0]].map(tag=>(                                           
                        // <span key={tag} >{tag}</span>
                        <Chip key={tag} label={tag} className={classes.chip} />
                    ))}
                </div>
    
            ))
        }
    </React.Fragment>
);

export default Tags;