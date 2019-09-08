import React from 'react';

import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';

import '../../../../../../../Fanfic/ShowFanficData/showFandomData.scss'

// import classes from '../../../../../Fanfic/ShowFanficData/ShowFanficData.module.css'
import Header from '../../../../../../../Fanfic/ShowFanficData/FanficData/Header/Header';
import Tags from '../../../../../../../Fanfic/ShowFanficData/FanficData/Tags/Tags';
import Desc from '../../../../../../../Fanfic/ShowFanficData/FanficData/Desc/Desc';
import Stat from '../../../../../../../Fanfic/ShowFanficData/FanficData/Stat/Stat';
import Categories from '../../../../../../../Fanfic/ShowFanficData/FanficData/Categories/Categories';

import Follow from './Follow.js'
import Favorite from './Favorite.js'
import Finished from './Finished.js'
import InProgress from './InProgress.js'
import AddCategories from '../../../../../../../Fanfic/ShowFanficData/UserData/AddCategories/AddCategories'

const ShowFanficData = ({userData,fanfic,categoriesTemp,size,getCategories,saveCategories,markAs,showCategory,
                         markStatus,inputCategoryFlag,showSelectCategory,showUserData,toggleChapterB}) => {

    let fanficCategories = categoriesTemp && categoriesTemp.filter( categories => {return categories.FanficID === fanfic.FanficID})
    fanficCategories = (categoriesTemp && fanficCategories.length!==0) ? Object.values(fanficCategories)[0]: null;
    
    console.log('userData:',userData)
    return(
        <div className="root">
        <Card className='card'  key={fanfic.FanficID}>
            <CardContent className='card_content'> 
                <section className='card_content_header'>
                    <Header fanfic={fanfic} size={size}/>
                </section>
                <section className='card_content_tags'>
                    <Tags fanfic={fanfic} size={size}/> 
                </section>
                <section className='card_content_categories'>
                    <Categories fanfic={fanfic} getCategories={getCategories}  saveCategories={saveCategories}
                                showSelectCategory={showSelectCategory} curFanfic={inputCategoryFlag} fanficCategories={fanficCategories}/> 
                </section>
                <section className='card_content_desc'>
                    <Desc fanfic={fanfic}/>                        
                </section>
                <section className='card_content_stat'>
                    <Stat fanfic={fanfic}/> 
                </section>
                {showUserData &&
                    <section className='card_content_userData'>
                        <Follow         fanfic={fanfic} userData={userData}  markAs={markAs} />   
                        <Favorite       fanfic={fanfic} userData={userData}  markAs={markAs} />   
                        <Finished       fanfic={fanfic} userData={userData}  markStatus={markStatus} />   
                        <InProgress     fanfic={fanfic} userData={userData}  markStatus={markStatus} toggleChapterB={toggleChapterB}/>   
                        <AddCategories  fanfic={fanfic} showCategory={showCategory} showSelectCategory={showSelectCategory}/>    
                    </section>
                }
            </CardContent>
        </Card>
    </div>
    )
};

export default ShowFanficData;