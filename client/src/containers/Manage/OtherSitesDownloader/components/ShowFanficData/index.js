import React from 'react';

import classes from '../../../../Fanfic/ShowFanficData/ShowFanficData.module.css';
import Header from '../../../../Fanfic/ShowFanficData/Header/Header'
import Tags from '../../../../Fanfic/ShowFanficData/Tags/Tags'
import Desc from '../../../../Fanfic/ShowFanficData/Desc/Desc'
import Stat from '../../../../Fanfic/ShowFanficData/Stat/Stat'

const ShowFanficData = (props) => (
    <React.Fragment>
        <section className={classes.Header}>
            <Header fanfic={props.fanficData}/>
        </section>
        <section className={classes.Tags}>
            <Tags fanfic={props.fanficData}/> 
        </section>
        <section className={classes.Desc}>
            <Desc fanfic={props.fanficData}/>                        
        </section>
        <section className={classes.Stat}>
            <Stat fanfic={props.fanficData}/> 
        </section>
    </React.Fragment>
);

export default ShowFanficData;