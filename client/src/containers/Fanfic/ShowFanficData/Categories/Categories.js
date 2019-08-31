import React from 'react';
import SelectCategories from '../../../../components/UI/Input/SelectAutoComplete';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import Chip from '@material-ui/core/Chip';
import {categories} from './assets/categoriesList'

const Categories = (props) => {
    const {getCategories,saveCategories,fanfic,curFanfic,showSelectCategory,fanficCategories} = props;
    return(
         ((curFanfic!==fanfic.FanficID) && (fanfic.Categories && fanfic.Categories.length>0))  ?
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
                    <SelectCategories getDataArray={getCategories} suggestions={categories} exist={fanfic.Categories} placeholder={'Select Categories'}/>
                </div>
                <Button color='primary' onClick={()=>saveCategories(fanfic.FandomName,fanfic.FanficID)}>Save</Button>   
            </div>
    )
};

export default Categories;


// TODO: ADD CATEGORIES TO FILTER