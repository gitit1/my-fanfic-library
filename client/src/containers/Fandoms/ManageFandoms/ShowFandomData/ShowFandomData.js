import React from 'react';
import classes from './ShowFandomData.module.css';
import Button from '../../../../components/UI/Button/Button';

const ShowFandomData = (props) => {
    return(
        <React.Fragment>
                <div className={classes.Fandoms}>
                  { props.fandoms.map(fandom=>(
                      <div className={classes.Fandom} key={fandom.Fandom_Name}>
                          <section className={classes.ImageSection}>
                              {
                                  fandom.Image_Name != '' 
                                  ? <img src={require(`../../../../assets/images/fandoms/${fandom.Fandom_Name}/${fandom.Image_Name}`)} alt={fandom.Fandom_Name}/>
                                  : <img src={require(`../../../../assets/images/fandoms/nophoto.png`)} alt={fandom.Fandom_Name} className={classes.NoImage}/> 
                              }
                          </section>
                          <section className={classes.DataSection}>
                            <h3>{fandom.Fandom_Name}</h3>           
                            <p><span>Search Keys: </span>{fandom.Search_Keys}</p>           
                            <p><span>Auto Save: </span>{fandom.Auto_Save==='true' ? 'Yes' : 'No'}</p> 
                            {fandom.Auto_Save==='true' ? <p><span>Auto Save Types: </span>{fandom.Save_Method}</p>  : null}  

                            <div className={classes.ButtonsSection}>
                                <Button clicked={() => props.editFandom(fandom.Fandom_Name)}>Edit</Button>
                                <Button clicked={() => props.deleteFandom(fandom.Fandom_Name)}>Delete</Button>
                            </div>       
                          </section>

                          {/* <div className={classes.Clear}></div>   */}
                      </div>
                  ))}
                 </div>
        </React.Fragment>  
    )
};

export default ShowFandomData;