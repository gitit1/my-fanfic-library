import React,{Component} from 'react';
import './ImageUpload.css';
import Button from '../UI/Button/Button';

class ImageUpload extends Component {
  constructor(props) {
    super(props);
    this.state = {file: '',imagePreviewUrl: ''};
  }
  
  componentDidMount() {
        console.log('this.props.edit: ',this.props.edit)
        if(this.props.edit){
          let fileSrc = (this.props.fileName !== '') 
                     ? (`/images/fandoms/${this.props.fandomName}/${this.props.fileName}`)
                     : (`/images/fandoms/nophoto.png`);
          console.log('fileSrc: ',fileSrc)
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
      let $imagePreview = null;
      if (imagePreviewUrl) {
        $imagePreview = (<img src={imagePreviewUrl} alt={'upload'}/>);
      } else {
        $imagePreview = (<div className="previewText">Please select an Image for Preview</div>);
      }
  
      return (
        <div className="previewComponent">
          <div className="imgPreview">
            {$imagePreview}
          </div>
          <input type="file" id="selectedFile"  className="fileInput"  style={{display:'none'}} onChange={(e)=>this._handleImageChange(e)}/>
          <span className="fileInputButton">
            <Button clicked={() => {document.getElementById('selectedFile').click()}} >Browse...</Button> 
          </span>
        </div>
      )
    }
}

export default ImageUpload;
