import React from 'react';
import classes from './ShowFandomData.module.css';
import Button from '../../../../components/UI/Button/Button';
import {Link} from 'react-router-dom'


const ShowFandomData = (props) => {
    return(
        <React.Fragment>
                <div className={classes.Fandoms}>
                  { props.fandoms.map(fandom=>(
                      <div className={classes.Fandom} key={fandom.fandomName}>
                          <section className={classes.ImageSection}>
                              {
                                  fandom.Image_Name !== '' 
                                  ? <Link to='/'>
                                        <img src={`/images/fandoms/${fandom.fandomName}/${fandom.Image_Name}`} alt={fandom.fandomName}/>
                                    </Link> 
                                  
                                  : <Link to='/'>
                                        <img src={`/images/fandoms/nophoto.png`} alt={fandom.fandomName} className={classes.NoImage}/> 
                                    </Link>
                              }
                          </section>
                            <section className={classes.DataSection}>
                                <Link to='/'>
                                    <h3>{fandom.fandomName}</h3>         
                                    <p><span>Fanfics in Fandoms: </span><b>{fandom.FanficsInFandom}</b></p>           
                                    <p><span>Complete Fanfics: </span>{fandom.CompleteFanfics}</p> 
                                    <p><span>In Progress Fanfics: </span>{fandom.OnGoingFanfics}</p>                            
                                </Link>
                            </section>
                          

                          {/* <div className={classes.Clear}></div>   */}
                      </div>
                  ))}
                  <div className={[classes.Dummy,classes.Fandom].join(' ')}></div>
                  <div className={[classes.Dummy,classes.Fandom].join(' ')}></div>
                 </div>
        </React.Fragment>  
    )
};

export default ShowFandomData;