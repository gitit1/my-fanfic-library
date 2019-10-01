import React,{Component} from 'react';
import {connect} from 'react-redux';
import * as actions from '../../../../store/actions';

import CardMedia from '@material-ui/core/CardMedia';
import Button from '@material-ui/core/Button';
import ImageUpload from '../../../../components/ImageUpload/ImageUpload';
import classes from '../ReadingList.module.scss';

class ReadingListImage extends Component{  
  fileUploadRef= React.createRef();

  state = {
    imagePath:''
  }

  saveImageOfFanfic = async () => {
    console.log('saveImageOfFanfic')
    const {readingList,userEmail,onSaveImageOfReadingList} = this.props;
    if(this.fileUploadRef.current.state.file!==''){
        let type= this.fileUploadRef.current.state.file.name.split('.')[1];
        let fileUpload = `${readingList.Name}.${type}`;
        let formData = new FormData();
        formData.append('fileName',fileUpload);
        formData.append(fileUpload,this.fileUploadRef.current.state.file)
        await onSaveImageOfReadingList(userEmail,readingList.Name,formData).then(res=>{
            res && this.setState({imagePath:fileUpload})
        })
    }
  }

  render(){
    const {readingList,userEmail,imageFlag,imageRlID} = this.props
    let isImage = readingList.image&&readingList.image !== '' ? true : false;

    return(
      <div className={classes.DetailsImage}>
            { imageFlag&&imageRlID===readingList.Name ?
              <div className={classes.ReadingListImage}>
                <ImageUpload  id='ReadingListImage' ref={this.fileUploadRef}   FandomName={readingList.Name}
                              imageLabel='Reading List Image' type='image' /> 
                <Button  type="submit" 
                         variant="contained" 
                         className='send_button' 
                         onClick={this.saveImageOfFanfic}>Upload</Button>

              </div>
              : 
                <CardMedia className={classes.ReadingListCardImage}
                    image={isImage 
                    ? `/users/${userEmail}/readingLists/${readingList.Name}/${readingList.image}`
                    : `/fandoms/nophoto.png`
                    } 
                    title={readingList.Name}
                >
                    {/* {!isImage && <span className='card_image_overlay'>{fanfic.FanficTitle}</span>} */}
                </CardMedia>
            }
      </div>
    )
  }
};



const mapDispatchedToProps = dispatch =>{
  return{
    onSaveImageOfReadingList: (userEmail,name,image)    =>  dispatch(actions.saveImageOfReadingList(userEmail,name,image))
  };
}

export default connect(null,mapDispatchedToProps)(ReadingListImage);