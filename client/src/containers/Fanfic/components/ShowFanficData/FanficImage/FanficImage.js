import React from 'react';
import CardMedia from '@material-ui/core/CardMedia';
import {getRandomColor} from '../../../../../utils/sharedFunctions';
import Typography from '@material-ui/core/Typography';

const FanficImage = ({fanfic}) => {
  const isImage = fanfic.image&&fanfic.image !== '' ? true : false;
  const color = isImage ? null : getRandomColor();
  console.log('color:',color)
  return(
    <div className='details-image'>
        <div className='card_image_layer' style={{backgroundColor:color}}>
          <CardMedia className={isImage ? 'card_image' : 'card_image_opacity card_image'}
              image={isImage 
              ? `/fandoms/${fanfic.FandomName.toLowerCase()}/fanficsImages/${fanfic.image}`
              : `/fandoms/${fanfic.FandomName.toLowerCase()}/fanfic_general.jpg`
              } 
              title={fanfic.FanficTitle}
          >
            {!isImage && <span className='card_image_overlay'>{fanfic.FanficTitle}</span>}
          </CardMedia>
        </div>
    </div>
  )
};

export default FanficImage;