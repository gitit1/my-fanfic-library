import React from 'react';
import classes from '../ShowFanficData.module.css';

const Header = (props) => (
    <React.Fragment>
        <div className={classes.Right}>
            {props.fanfic.Rating && <img src={`/images/icons/${props.fanfic.Rating}.png`} alt={props.fanfic.Rating}/>}
            <div>
                <a href={props.fanfic.URL} target="_blank" rel="noopener noreferrer">{props.fanfic.FanficTitle}</a> by <a href={props.fanfic.AuthorURL}>{props.fanfic.Author}</a>
                {props.fanfic.Complete && <span className={`${classes.Badge} ${classes.Complete}`}>Complete</span>}
                {props.fanfic.Deleted && <span  className={`${classes.Badge} ${classes.Deleted}`}>Deleted from AO3</span>}
                <br/>
                {props.fanfic.FandomsTags && props.fanfic.FandomsTags.map(tag=>(
                    <span key={tag} className={classes.FandomTags}>{tag}</span>
                ))}
            </div>                             
            </div>
            <div className={classes.Left}>
                <p>{new Date(props.fanfic.LastUpdateOfFic).toLocaleString('en-US', {year: 'numeric', month: 'short', day: 'numeric'})}</p>
            </div>
        <div className={classes.Clear}></div>
    </React.Fragment>

);

export default Header;