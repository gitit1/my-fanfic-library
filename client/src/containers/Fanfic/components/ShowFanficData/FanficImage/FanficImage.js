import React,{Component} from 'react';
import {connect} from 'react-redux';
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
    //   if(  this.fileUploadRef.current===null || 
    //     (this.fileUploadRef.current!==null && this.fileUploadRef.current.state.file==='') ){
    //       let msg = <p>Please upload a file</p>
    //       this.setState({msg})
    // }
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
    const {fanfic,images} = this.props
    const {imagePath,color} = this.state
    let isImage = fanfic.image&&fanfic.image !== '' ? true : false;
    isImage = imagePath!=='' ? true :  isImage;
    let fanficImage = fanfic.image ? fanfic.image : imagePath;

    // const color = isImage && (images.addImageFlag===null) ? null : getRandomColor();
    return(
      <div className='details-image'>
            { images.addImageFlag===fanfic.FanficID ?
              <div className='card_image_layer' >
                <ImageUpload  id='fanficImage' ref={this.fileUploadRef}   FandomName={fanfic.FandomName}
                              imageLabel='Fanfic Image' type='image'/> 
                <Button  type="submit" variant="contained"  className='send_button' onClick={this.saveImageOfFanfic}>Upload</Button>

              </div>
              : 
              <div className='card_image_layer' style={{backgroundColor:color}}>
                <CardMedia className={isImage ? 'card_image' : 'card_image_opacity card_image'}
                    image={isImage 
                    ? `/fandoms/${fanfic.FandomName.toLowerCase()}/fanficsImages/${fanficImage}`
                    : `/fandoms/${fanfic.FandomName.toLowerCase()}/fanfic_general.jpg`
                    } 
                    title={fanfic.FanficTitle}
                >
                  {!isImage && <span className='card_image_overlay'>{fanfic.FanficTitle}</span>}
                </CardMedia>
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