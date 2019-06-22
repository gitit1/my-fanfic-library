import React from 'react';
import {Link} from 'react-router-dom'
import classes from './ShowFanficData.module.css';


const ShowFanficData = (props) => {
    return(
        <React.Fragment>
            <div className={classes.Fanfics}>
                { props.fanfics.map(fanfic=>(
                    <div className={classes.Fanfic} key={fanfic.FanficID}>
                        <section className={classes.UserHeader}>
                            <span>Fav</span>
                            <span>.....</span>
                            <span>Mark as read</span>
                            <span>.....</span>
                            <span>Mark in progress - if so - chapter</span>
                            <span>.....</span>
                            <span>ignore fic</span>
                            <span>.....</span>
                            <span>add to reading list (need to read)</span>
                            <span>.....</span>
                            <span>options to create reading lists (one shot ... if not created - save to general)</span>
                            <span>.....</span>
                            <span>is saved? and how</span>
                            <span>.....</span>
                            <span>add image</span>
                            <span>.....</span>
                            <span>hiatus</span>
                            <span>.....</span>
                            <span>page filters (order by: fav,date(asc,dsc),words.....)</span>
                            <span>.....</span>
                            <span>fix pagination</span>
                            <span>.....</span>
                            <span>fix to be the same order as ao3</span>
                            <span>.....</span>
                            <span>save individual fanfics from ff - later</span>
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
                                            <span key={tag} >{tag}</span>
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
                  ))}
                  <div className={[classes.Dummy,classes.Fandom].join(' ')}></div>
                  <div className={[classes.Dummy,classes.Fandom].join(' ')}></div>
                 </div>
        </React.Fragment>  
    )
};

export default ShowFanficData;