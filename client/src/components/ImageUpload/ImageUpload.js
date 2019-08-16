import React,{Component} from 'react';
import './ImageUpload.scss';
import Button from '../UI/Button/Button';
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import Typography from '@material-ui/core/Typography';

class ImageUpload extends Component {
  constructor(props) {
    super(props);
    this.state = {file: '',imagePreviewUrl: ''};
  }
  
  componentDidMount() {
        if(this.props.fileName !== null){
          let fileSrc = (this.props.fileName !== '') ? (`/fandoms/${this.props.FandomName}/${this.props.fileName}`): (`/fandoms/nophoto.png`);

          this.setState({
            imagePreviewUrl:fileSrc
          })
        }
  }


    _handleSubmit(e) {
      e.preventDefault();
      // TODO: do something with -> this.state.file
      console.log('handle uploading-', this.state.file);
    }

    
    _handleImageChange(e) {
      e.preventDefault();
  
      let reader = new FileReader();

      let file = e.target.files[0];
  
      reader.onloadend = () => {
        this.setState({
          file: file,
          imagePreviewUrl: reader.result
        });
      }
      if (e.target.files && e.target.files[0]) {
        reader.readAsDataURL(file);
      }
      
    }
  
    render() {
      let {imagePreviewUrl} = this.state;
      let {id,label,imageLabel} = this.props;
      let $imagePreview = null;
      if (imagePreviewUrl) {
        $imagePreview = (
          <span>
            <img  src={imagePreviewUrl} alt={'upload'}/>
            <Typography gutterBottom variant="body2" component="span" className='fandoms_mobile_overlay'>{imageLabel}</Typography>
          </span>);
      } else {
        $imagePreview = (<div className="image_upload_image_text">{label}</div>);
      }
  
      return (
        <Card className="image_upload">
          {/* <div className="image_upload_image_box"> */}
            <CardActionArea onClick={() => {document.getElementById(id).click()}}>
              <input type="file" id={id}  style={{display:'none'}} onChange={(e)=>this._handleImageChange(e)}/>
              {$imagePreview}
            </CardActionArea>
          {/* </div> */}
          {/* <span className="image_upload_button">
            <Button clicked={() => {document.getElementById(this.props.id).click()}} >Browse...</Button> 
          </span> */}
        </Card>
      )
    }
}

export default ImageUpload;
