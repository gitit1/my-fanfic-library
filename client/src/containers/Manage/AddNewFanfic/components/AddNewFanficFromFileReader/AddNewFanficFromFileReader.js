import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { Grid, Checkbox, FormGroup, FormControlLabel } from '@material-ui/core';
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
        file: "",
        deletedFlag: true,
        disableFlag: false
    }

    componentWillMount() {
        this.props.showBtns(false);
        this.props.onGetFandoms();
    }

    initialState = () => {
        console.log('initialState:')
        this.setState({
            msg: "",
            showData: 0,
            file: "",
            disableFlag: false
        })
    }

    switchChange = () => {
        this.setState({ deletedFlag: !this.state.deletedFlag })
    }

    getFanficData = () => {
        this.setState({ showData: 0 })
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
            console.log('this.state.deletedFlag::', this.state.deletedFlag)
            this.props.onGetFanficData(this.props.fandomName, fileName, fileType, formData, this.state.deletedFlag).then(res => {
                if (res === 'wrong file') {
                    this.setState({ msg: "The file you tried to upload is incorrect" })
                    return;
                }
                this.setState({ showData: 1, msg: "", file: fileUpload, disableFlag: true })
            })
        }
    }

    render() {
        const { fandomName, showBtns } = this.props;
        const { showData, msg, file, deletedFlag } = this.state;
        return (
            <div className='AddNewFanficFromFileReader'>
                <Grid container className="AddNewFanficFromFileReader_Grid">
                    <FormGroup row className="checkbox_sites">
                        <FormControlLabel
                            control={<Checkbox checked={deletedFlag} onChange={() => this.switchChange()} name="isDeleted" color="primary" />}
                            label="is Deleted from Origin?" />
                    </FormGroup>
                    <FileUploader id='file1' ref={this.fileUploadRef} edit={false} FandomName={fandomName} type='doc'/>
                    {/* <FileUploader id='file1' ref={this.fileUploadRef} edit={false} FandomName={fandomName} type='doc' disable={disableFlag} /> */}
                    <Button clicked={this.getFanficData}>Get Data</Button>
                </Grid>
                <p>{msg}</p><br />
                {showData === 1 && <AddNewFanficManually    fandomName={fandomName} fileReaderFlag={true} 
                                                            fileName={file} showBtns={showBtns} deletedFlag={deletedFlag} />}
                {/* {showData === 1 && <Button clicked={this.initialState}>Add Another One</Button>} */}
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
        onGetFanficData: (fandomName, fileName, fileType, file, deleted) => dispatch(actions.getFanficDataFromFile(fandomName, fileName, fileType, file, deleted)),
    };
}

export default connect(mapStateToProps, mapDispatchedToProps)(withRouter(AddNewFanficFromFileReader));
