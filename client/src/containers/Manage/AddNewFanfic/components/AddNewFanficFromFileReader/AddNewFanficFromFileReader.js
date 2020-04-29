import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import Grid from '@material-ui/core/Grid';
import * as actions from '../../../../../store/actions';
import Button from '../../../../../components/UI/Button/Button';
import FileUploader from '../../../../../components/ImageUpload/ImageUpload'
import './AddNewFanficFromFileReader.scss';
import AddNewFanficManually from '../AddNewFanficManually/AddNewFanficManually';

class AddNewFanficFromFileReader extends Component {
    fileUploadRef = React.createRef();
    state = {
        msg: "",
        showData: 0,
        file: ""
    }

    componentWillMount() {
        this.props.showBtns(false);
        this.props.onGetFandoms();
    }

    getFanficData = () => {
        if (this.fileUploadRef.current === null ||
            (this.fileUploadRef.current !== null && this.fileUploadRef.current.state.file === '')) {
            let msg = "Please upload a file";
            this.setState({ msg })
        } else {
            let formData = new FormData();

            let fileType = this.fileUploadRef.current.state.file.name.split('.')[1];
            let fileName = `filetocheck_${Date.now()}`
            let fileUpload = `${fileName}.${fileType}`;
            
            formData.append(fileUpload, this.fileUploadRef.current.state.file)
            this.props.onGetFanficData(this.props.fandomName, fileName, fileType, formData).then(res => {
                if (res==='wrong file') {
                    this.setState({ msg: "The file you tried to upload is incorrect" })
                    return;
                }
                // console.log(this.props.fanfic)
                this.setState({ showData: 1, msg: "", file: fileUpload })
            })
        }
    }

    render() {
        const { fandomName, showBtns } = this.props;
        const { showData, msg, file } = this.state;
        return (
            <div className='AddNewFanficFromFileReader'>
                <Grid container className="AddNewFanficFromFileReader_Grid">
                    <FileUploader id='file1' ref={this.fileUploadRef} edit={false} FandomName={fandomName} type='doc' />
                    <Button clicked={this.getFanficData}>Get Data</Button>
                </Grid>
                <p>{msg}</p><br />
                {showData === 1 && <AddNewFanficManually fandomName={fandomName} fileReaderFlag={true} fileName={file} showBtns={showBtns} />}
            </div>
        )
    }
}

const mapStateToProps = state => {
    return {
        fanfic: state.downloader.fanfic,
        similarFanfic: state.downloader.similarFanfic,
        loading: state.downloader.loading,
        userEmail: state.auth.user.email,
        size: state.screenSize.size
    };
}

const mapDispatchedToProps = dispatch => {
    return {
        onGetFandoms: () => dispatch(actions.getFandomsFromDB()),
        onGetFanficData: (fandomName, fileName, fileType, file) => dispatch(actions.getFanficDataFromFile(fandomName, fileName, fileType, file)),
    };
}

export default connect(mapStateToProps, mapDispatchedToProps)(withRouter(AddNewFanficFromFileReader));
