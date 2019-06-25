import React from 'react';
import {Link} from 'react-router-dom'
import classes from './ShowFanficData.module.css';
import ReactSVG from 'react-svg'
import Favorite from '../../../assets/images/icons/favorite.svg'
import MarkAsRead from '../../../assets/images/icons/markAsRead.svg'

import Ignore from '../../../assets/images/icons/ignore.svg'
import ReadingList from '../../../assets/images/icons/readingList.svg'
import Chip from '@material-ui/core/Chip';
import Button from '@material-ui/core/Button';

const ShowFanficData = (props) => {
    return(
        <React.Fragment>
            <div className={classes.Fanfics}>
                { props.fanfics.map(fanfic=>{
                    let userData = props.userFanfics.filter( userFanfic => {return userFanfic.FanficID === fanfic.FanficID})
                    userData = userData.length!==0 ? Object.values(userData)[0]: null;
                    const favClassIcon = (userData && userData.Favorite===true) ? `${classes.FavoriteOn} ${classes.Icon}` : `${classes.Favorite} ${classes.Icon}`
                    const favClassLabel = (userData && userData.Favorite===true) ? `${classes.FavoriteOn} ${classes.IconLabel}` : `${classes.Favorite} ${classes.IconLabel}`
                    const favClick = userData ? userData.Favorite : null
                    const finishClick = null

                    return(
                            <div className={classes.Fanfic} key={fanfic.FanficID}>
                            {/* TODO: show only if autinticate */}                         
                                <section className={classes.UserHeader}>
                                    <div className={`${classes.ReadingList} ${classes.UserData}`}>
                                        {/* <Button className={`${classes.button} ${classes.IconLabel}`}> */}
                                        <ReactSVG src={ReadingList} className={`${classes.ReadingList} ${classes.Icon}`} wrapper='span' alt='Add to Reading List'  title='Add to Reading List' />
                                        <span className={classes.IconLabel}>Add to Reading List</span>
                                        {/* Add to Reading List */}
                                        {/* </Button>                                 */}
                                    </div>
                                    <div onClick={() =>props.markAsFavorite(fanfic.FanficID,favClick)} className={`${classes.Favorite} ${classes.UserData}`}>
                                        <ReactSVG src={Favorite} className={favClassIcon} wrapper='span' alt='Favorite'  title='Favorite' />
                                        <span className={favClassLabel}>Favorite</span>                                
                                    </div>
                                    <div  onClick={() =>props.markAsFinished(fanfic.FanficID,finishClick)} className={`${classes.MarkAsRead} ${classes.UserData}`}>
                                        <ReactSVG src={MarkAsRead} className={`${classes.MarkAsRead} ${classes.Icon}`} wrapper='span' alt='Mark as Finished'  title='Mark as Finished' />
                                        <span className={classes.IconLabel}>Mark as Finished</span>                                                              
                                    </div>
                                    <div className={`${classes.MarkAsRead} ${classes.UserData}`}>
                                        <ReactSVG src={MarkAsRead} className={`${classes.MarkAsRead} ${classes.Icon}`} wrapper='span' alt='Mark in Progress'  title='Mark in Progress' />
                                        <span className={classes.IconLabel}>Mark in Progress</span>                                
                                    </div>
                                    <div className={`${classes.Ignore} ${classes.UserData}`}>
                                        <ReactSVG src={Ignore} className={`${classes.Ignore} ${classes.Icon}`} wrapper='span' alt='Ignore'  title='Ignore' />
                                        <span className={classes.IconLabel}>Ignore Fanfic</span>                                
                                    </div>
                                    {/* TODO: <span>options to create reading lists (one shot ... if not created - save to general)</span>
                                    {/* TODO: <span>is saved? and how</span> */}
                                    {/* TODO: <span>add image</span> */}
                                    {/* TODO: <span>hiatus</span> */}
                                    {/* TODO: <span>page filters (order by: fav,date(asc,dsc),words.....)</span> */}
                                    {/* TODO: <span>save individual fanfics from ff - later</span> */}
                                    {/* TODO: <span>add from backup (upload epub/mobi/pdf...) - later</span> */}
                                    {/* TODO: Source filter */}
                                    {/* TODO: deleted indication */}
                                </section>
                                <section className={classes.Header}>
                                    <div className={classes.Right}>
                                        <img src={`/images/icons/${fanfic.Rating}.png`} alt={fanfic.Rating}/>   
                                        <div>
                                            <a href={fanfic.URL} target="_blank">{fanfic.FanficTitle}</a> by <a href={fanfic.AuthorURL}>{fanfic.Author}</a>
                                            {fanfic.Complete && <span className={classes.Complete}>Complete</span>}
                                            <br/>
                                            {fanfic.FandomsTags.map(tag=>(
                                                <span key={tag} className={classes.FandomTags}>{tag}</span>
                                            ))}
                                        </div>                             
                                    </div>
                                    <div className={classes.Left}>
                                        <p>{new Date(fanfic.LastUpdateOfFic).toLocaleString('en-US', {year: 'numeric', month: 'short', day: 'numeric'})}</p>
                                    </div>
                                    <div className={classes.Clear}></div>
                                </section>
                                <section className={classes.Tags}>
                                    {
                                        fanfic.Tags.map((tags)=>(
                                            <div key={Object.keys(tags)[0]}>
                                                <b>{ `${Object.keys(tags)[0]}: `}</b>                                                    
                                                {tags[Object.keys(tags)[0]].map(tag=>(                                           
                                                    // <span key={tag} >{tag}</span>
                                                    <Chip key={tag} label={tag} className={classes.chip} />
                                                ))}
                                            </div>

                                        ))
                                    }
                                </section>
                                <section className={classes.Desc}>
                                    <div dangerouslySetInnerHTML={{ __html:fanfic.Description}}></div>                           
                                </section>
                                <section className={classes.Stat}>
                                    <dt>Language:</dt>
                                    <dd>{fanfic.Language}</dd>
                                    <dt>Words:</dt>
                                    <dd>{fanfic.Words}</dd>
                                    <dt>Chapters:</dt>
                                    <dd>{fanfic.NumberOfChapters}</dd>
                                    <dt>Comments:</dt>
                                    <dd>{fanfic.Comments}</dd>
                                    <dt>Kudos:</dt>
                                    <dd>{fanfic.Kudos}</dd>
                                    <dt>Bookmarks:</dt>
                                    <dd>{fanfic.Bookmarks}</dd>
                                    <dt>Hits:</dt>
                                    <dd>{fanfic.Hits}</dd>
                                </section>
                            
                        </div>
                    )
                })}

                  <div className={[classes.Dummy,classes.Fandom].join(' ')}></div>
                  <div className={[classes.Dummy,classes.Fandom].join(' ')}></div>
                 </div>
        </React.Fragment>  
    )
};

export default ShowFanficData;