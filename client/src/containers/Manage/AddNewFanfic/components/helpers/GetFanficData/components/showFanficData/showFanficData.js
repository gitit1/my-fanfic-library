import React from 'react';

import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';

import '../../../../../../../Fanfic/ShowFanficData/showFandomData.scss'

// import classes from '../../../../../Fanfic/ShowFanficData/ShowFanficData.module.css'
import Header from '../../../../../../../Fanfic/ShowFanficData/Header/Header';
import Tags from '../../../../../../../Fanfic/ShowFanficData/Tags/Tags';
import Desc from '../../../../../../../Fanfic/ShowFanficData/Desc/Desc';
import Stat from '../../../../../../../Fanfic/ShowFanficData/Stat/Stat';

import Follow from './Follow.js'
import Favorite from './Favorite.js'
import Finished from './Finished.js'
import InProgress from './InProgress.js'

const ShowFanficData = (props) => (
    <div className="root">
        <Card className='card'  key={props.fanfic.FanficID}>
            <CardContent className='card_content'> 
                <section className='card_content_header'>
                    <Header fanfic={props.fanfic} size={props.size}/>
                </section>
                <section className='card_content_tags'>
                    <Tags fanfic={props.fanfic} size={props.size}/> 
                </section>
                <section className='card_content_desc'>
                    <Desc fanfic={props.fanfic}/>                        
                </section>
                <section className='card_content_stat'>
                    <Stat fanfic={props.fanfic}/> 
                </section>
                {props.showUserData &&
                    <section className='card_content_userData'>
                        <Follow     fanfic={props.fanfic} userData={props.userData}  markAs={props.markAs} />   
                        <Favorite   fanfic={props.fanfic} userData={props.userData}  markAs={props.markAs} />   
                        <Finished   fanfic={props.fanfic} userData={props.userData}  markStatus={props.markStatus} />   
                        <InProgress fanfic={props.fanfic} userData={props.userData}  markStatus={props.markStatus} toggleChapterB={props.toggleChapterB}/>   
                    </section>
                }
            </CardContent>
        </Card>
    </div>
);

export default ShowFanficData;