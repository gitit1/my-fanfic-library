import React from 'react';
import classes from './ShowFandomData.module.css';
import {Link} from 'react-router-dom'


const ShowFandomData = (props) => {
    return(
        <React.Fragment>
                <div className={classes.Fandoms}>
                  { props.fandoms.map(fandom=>(
                      <div className={classes.Fandom} key={fandom.FandomName}>
                          <section className={classes.ImageSection}>
                              {
                                  fandom.Image_Name !== '' 
                                  ? <Link to={`/fanfics/${fandom.FandomName}`}>
                                        <img src={`/fandoms/${fandom.FandomName.toLowerCase()}/${fandom.Image_Name}`} alt={fandom.FandomName}/>
                                    </Link> 
                                  
                                  : <Link to={`/fandom/${fandom.FandomName}`}>
                                        <img src={`/fandoms/nophoto.png`} alt={fandom.FandomName} className={classes.NoImage}/> 
                                    </Link>
                              }
                          </section>
                            <section className={classes.DataSection}>
                                <Link to={`/fanfics/${fandom.FandomName}`}>
                                    <h3>{fandom.FandomName}</h3>         
                                    <p><span>Fanfics in Fandoms: </span><b>{fandom.FanficsInFandom}</b></p>           
                                    <p><span>Complete Fanfics: </span>{fandom.CompleteFanfics}</p> 
                                    <p><span>In Progress Fanfics: </span>{fandom.OnGoingFanfics}</p>                            
                                </Link>
                            </section>

                      </div>
                  ))}
                  <div className={[classes.Dummy,classes.Fandom].join(' ')}></div>
                  <div className={[classes.Dummy,classes.Fandom].join(' ')}></div>
                 </div>
        </React.Fragment>  
    )
};

export default ShowFandomData;