import React,{Component} from 'react';
import {connect} from 'react-redux';
import ImageZoom from 'react-medium-image-zoom'
import * as actions from '../../../../../store/actions';

import CardMedia from '@material-ui/core/CardMedia';
import {getRandomColor} from '../../../../../utils/sharedFunctions';
import ImageUpload from '../../../../../components/ImageUpload/ImageUpload';
import Button from '@material-ui/core/Button';

class FanficImage extends Component{  
  fileUploadRef= React.createRef();

  state = {
    imagePath:'',
    color: getRandomColor()
  }

  componentDidMount(){

    this.setState({})
  }
  saveImageOfFanfic = async () => {
    console.log('saveImageOfFanfic')
    const {fanfic,images,onSaveImageOfFanfic} = this.props;

    let type= this.fileUploadRef.current.state.file.name.split('.')[1];
    let fileUpload = `${fanfic.Author}_${fanfic.FanficTitle} (${fanfic.FanficID}).${type}`;
    let formData = new FormData();
    formData.append('fileName',fileUpload);
    formData.append(fileUpload,this.fileUploadRef.current.state.file)
    await onSaveImageOfFanfic(fanfic.FandomName,fanfic.FanficID,formData).then(res=>{
      console.log('res:',res)
        res && this.setState({imagePath:fileUpload})
        images.addImageToggle(null)
    })
  }

  render(){
    const {fanfic,images} = this.props;
    const { FandomName, FanficID, FanficTitle } = fanfic;
    const {imagePath,color} = this.state
    let isImage = fanfic.image&&fanfic.image !== '' ? true : false;
    isImage = imagePath!=='' ? true :  isImage;
    let fanficImage = fanfic.image ? fanfic.image : imagePath;
    const src = isImage 
      ? `/fandoms/${FandomName.toLowerCase()}/fanficsImages/${fanficImage}`
      : `/fandoms/${FandomName.toLowerCase()}/fanfic_general.jpg`;
    const  alt = FanficTitle;
    const className = isImage ? 'card_image' : 'card_image_opacity card_image';
    return(
      <div className='details-image'>
            { images.addImageFlag===FanficID ?
              <div className='card_image_layer' >
                <ImageUpload  id='fanficImage' ref={this.fileUploadRef}   FandomName={FandomName}
                              imageLabel='Fanfic Image' type='image'/> 
                <Button  type="submit" variant="contained"  className='send_button' onClick={this.saveImageOfFanfic}>Upload</Button>

              </div>
              : 
              <div className='card_image_layer' style={{backgroundColor:color}}>
                  <ImageZoom
                    defaultStyles={{overlay: {backgroundColor:  '#212121' }}}
                    image={{ src, alt, className }}
                  />
              </div>
            }
      </div>
    )
  }
};



const mapDispatchedToProps = dispatch =>{
  return{
      onSaveImageOfFanfic: (fandomName,fanficId,image)    =>  dispatch(actions.saveImageOfFanfic(fandomName,fanficId,image))
  };
}

export default connect(null,mapDispatchedToProps)(FanficImage);