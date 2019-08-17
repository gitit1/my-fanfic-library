import React from 'react';
import {Link} from 'react-router-dom'
import classes from './ShowFandomData.module.css';

import {shorten} from '../../../../utils/sharedFunctions'

const ShowFandomData = (props) => {
    return(
        <React.Fragment>
                <div>Total: [number] were finished, there are [number] in Reading List, there are [number] in in progress, there are [number] in favs</div><br/>
                <div className={classes.Fandoms}>
                    { props.fandoms.map(fandom=>(
                        <div className={classes.Fandom} key={fandom.FandomName}>
                            <section className={classes.ImageSection}>
                                {
                                fandom.Image_Name_Main !== '' 
                                ? <Link to={`/fanfics/${fandom.FandomName}`}>
                                    <img src={`/fandoms/${fandom.FandomName.toLowerCase()}/${fandom.Image_Name_Main}`} alt={fandom.FandomName}/>
                                    </Link> 

                                : <Link to={`/fanfics/${fandom.FandomName}`}>
                                    <img src={`/fandoms/nophoto.png`} alt={fandom.FandomName} className={classes.NoImage}/> 
                                    </Link>
                                }
                            </section>
                            <section className={classes.DataSection}>
                                <h3>
                                    <Link to={`/fanfics/${fandom.FandomName}`}>
                                        {shorten(fandom.FandomName,12)}
                                    </Link>
                                </h3>         
                                <p>[number] out of [number] fanfics were reviewd:</p>           
                                <p>if [number!==0]:</p>           
                                <p>[number] were marked as <b>Reading List</b></p>           
                                <p>[number] were marked as <b>Finished</b></p>           
                                <p>[number] were marked as <b>In progress</b></p>           
                                <p>[number] were marked as <b>Favorits</b></p>           
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