import React from 'react';
import SelectCategories from '../../../../../../components/UI/Input/SelectAutoComplete';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import Chip from '@material-ui/core/Chip';
import {categories} from './assets/categoriesList'

const Categories = (props) => {
    const {getCategories,saveCategories,fanfic,curFanfic,showSelectCategory,fanficCategories} = props;
    let isAlreadySaved = (fanficCategories && fanficCategories.FanficID===fanfic.FanficID) ? true : false
    
    return(
         (((curFanfic!==fanfic.FanficID) && (fanfic.Categories && fanfic.Categories.length>0)) || (isAlreadySaved && !showSelectCategory))  ?
            <div className='card_content_categories_div'>
                <Typography variant="subtitle2" gutterBottom  className='card_content_categories_caption'>Categories</Typography>
                { fanficCategories!==null ? 
                    fanficCategories.Categories.map(category=>
                        <Chip size="medium" key={category} label={category} className='category_chip'/>

                    )
                :
                    fanfic.Categories.map(category=>
                        <Chip size="medium" key={category} label={category} className='category_chip'/>
                    )
                }
            </div>
            : (curFanfic===fanfic.FanficID) && showSelectCategory &&
            <div className='card_content_select_categories_div'>
                <Typography variant="subtitle2" gutterBottom  className='card_content_categories_caption'>Categories</Typography>
                <div className='SelectCategories_container'>
                    <SelectCategories id="categories-filters" class='SelectCategories' getDataArray={getCategories}  placeholder={'Select Categories'}
                                      suggestions={categories} exist={isAlreadySaved ? fanficCategories.Categories : fanfic.Categories}/>
                </div>
                <Button color='primary' onClick={()=>saveCategories(fanfic.FandomName,fanfic.FanficID)}>Save</Button>   
            </div>
    )
};

export default Categories;