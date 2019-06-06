import React,{Component} from 'react';
import './ImageUpload.css';
import Button from '../UI/Button/Button';

class ImageUpload extends Component {
    constructor(props) {
      super(props);
      this.state = {file: '',imagePreviewUrl: ''};
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
      let oldFile = file;
  
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
        $imagePreview = (<img src={imagePreviewUrl} />);
      } else {
        $imagePreview = (<div className="previewText">Please select an Image for Preview</div>);
      }
  
      return (
        <div className="previewComponent">
          <div className="imgPreview">
            {$imagePreview}
          </div>
          <form className="fileInputForm" onSubmit={(e)=>this._handleSubmit(e)}>
              {/* <input className="fileInput" 
                type="file" 
                onChange={(e)=>this._handleImageChange(e)} /> */}
              <input type="file" id="selectedFile"  className="fileInput"  style={{display:'none'}} onChange={(e)=>this._handleImageChange(e)}/>
              <span className="fileInputButton">
                <Button clicked={() => {document.getElementById('selectedFile').click()}} >Browse...</Button> 
              </span>
              {/* <button className="submitButton" 
                type="submit" 
                onClick={(e)=>this._handleSubmit(e)}>Upload Image</button> */}
            </form>
        </div>
      )
    }
}

export default ImageUpload;
