import React from 'react';
import './showFandomData.scss'

import UserData from './UserData/UserData'
import FanficData from './FanficData/FanficData'

import GridList from '@material-ui/core/GridList';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';



const ShowFanficData = (props) => {
    const {fanfics,userFanfics,showTagsToggle,showTags,readingLists,filter} = props;
    const {isManager,isAuthenticated,size} = props.props
    const {getCategories,saveCategories,showSelectCategory,inputCategoryFlag,categoriesTemp,showCategory} = props.categories
    return(
        <React.Fragment>
            <div className='root' style={{width:'100%'}}>
                <GridList cellHeight='auto' className='grid_list' cols={1}>
                    { fanfics.map(fanfic=>{
                        return(
                            <Card className='card'  key={fanfic.FanficID}>
                                <CardContent className='card_content'>
                                    <FanficData fanfic={fanfic} size={size} showTagsToggle={showTagsToggle} showTags={showTags} filter={filter}
                                                getCategories={getCategories} saveCategories={saveCategories} showSelectCategory={showSelectCategory} 
                                                inputCategoryFlag={inputCategoryFlag} categoriesTemp={categoriesTemp}/>                           
                                    { isAuthenticated &&
                                        <section className='card_content_userData'>
                                            <UserData   props={props} 
                                                        userFanfics={userFanfics} 
                                                        fanfic={fanfic}
                                                        isManager={isManager}
                                                        showCategory={showCategory}
                                                        showSelectCategory={showSelectCategory}
                                                        readingLists={readingLists}
                                            />
                                        </section>
                                    }
                                </CardContent>
                            </Card>
                        )
                    }) }
                </GridList>
            </div>
        </React.Fragment>
    )
};

export default ShowFanficData;