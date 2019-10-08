import React from 'react';
import { CSSTransition } from 'react-transition-group';

import './showFandomData.scss'

import UserData from './UserData/UserData'
import FanficData from './FanficData/FanficData'
import FanficImage from './FanficImage/FanficImage'

import GridList from '@material-ui/core/GridList';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';



const ShowFanficData = (props) => {
    const {fanfics,userFanfics,showTagsToggle,showTags,readingLists,filter,switches,images,rlMode} = props;
    const {isManager,isAuthenticated,size} = props.props
    const {getCategories,saveCategories,showSelectCategory,inputCategoryFlag,categoriesTemp,showCategory} = props.categories;
    const tagSwitch=switches[1].checked,showImagesSwitch=switches[2].checked,showMnagerButtonsSwitch=switches[4].checked;

    return(
        <React.Fragment>
            <div className='root' style={{width:'100%'}}>
                <GridList cellHeight='auto' className='grid_list' cols={1}>
                    { fanfics.map(fanfic=>{
                        return(
                            <Card className='card'  key={fanfic.FanficID}>
                                {showImagesSwitch && <FanficImage fanfic={fanfic} images={images}/>}
                                <div className={showImagesSwitch?'detailsWithImage':'detailsWithoutImage'}>
                                    <CardContent className='card_content'>
                                        
                                        <FanficData         fanfic={fanfic} size={size} showTagsToggle={showTagsToggle} showTags={showTags} filter={filter} rlMode={rlMode}
                                                            getCategories={getCategories} saveCategories={saveCategories} showSelectCategory={showSelectCategory} 
                                                            inputCategoryFlag={inputCategoryFlag} categoriesTemp={categoriesTemp} tagSwitch={tagSwitch}/>                           
                                        { isAuthenticated &&
                                            <section className='card_content_userData'>
                                                <UserData   props={props} 
                                                            userFanfics={userFanfics} 
                                                            fanfic={fanfic}
                                                            isManager={isManager}
                                                            showCategory={showCategory}
                                                            showSelectCategory={showSelectCategory}
                                                            readingLists={readingLists}
                                                            showMnagerButtonsSwitch={showMnagerButtonsSwitch}
                                                            images={images}
                                                            rlMode={rlMode}
                                                />
                                            </section>
                                        }
                                    </CardContent>
                                </div>
                            </Card>
                        )
                    }) }
                </GridList>
            </div>
        </React.Fragment>
    )
};

export default ShowFanficData;