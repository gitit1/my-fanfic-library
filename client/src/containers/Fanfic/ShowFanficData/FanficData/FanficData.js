import React from 'react';
import Header from './Header/Header'
import Tags from './Tags/Tags'
import Categories from './Categories/Categories'
import Desc from './Desc/Desc'
import Series from './Series/Series'
import Stat from './Stat/Stat'

const FanficData = (props) => {
    const { fanfic,showSelectCategory,size,showTagsToggle,showTags,categoriesTemp,
            getCategories,saveCategories,inputCategoryFlag} = props;

    let fanficCategories = categoriesTemp.filter( categories => {return categories.FanficID === fanfic.FanficID})
        fanficCategories = fanficCategories.length!==0 ? Object.values(fanficCategories)[0]: null;
    return(
        <React.Fragment>
            <section className='card_content_header'>
                <Header fanfic={fanfic} size={size} showTagsToggle={showTagsToggle} showTags={showTags}/>
            </section>
            <section className='card_content_tags'>
                <Tags fanfic={fanfic} size={size} showTags={showTags}/> 
            </section>
            <section className='card_content_categories'>
                <Categories fanfic={fanfic} getCategories={getCategories} saveCategories={saveCategories}
                            showSelectCategory={showSelectCategory} curFanfic={inputCategoryFlag} fanficCategories={fanficCategories}/> 
            </section>
            <section className='card_content_series'>
                <Series fanfic={fanfic}/>                        
            </section>
            <section className='card_content_desc'>
                <Desc fanfic={fanfic}/>                        
            </section>
            <section className='card_content_stat'>
                <Stat fanfic={fanfic}/> 
            </section>
        </React.Fragment>
    )
};

export default FanficData;