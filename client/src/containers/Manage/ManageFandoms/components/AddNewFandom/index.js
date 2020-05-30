import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';

import * as actions from '../../../../../store/actions';

import Spinner from '../../../../../components/UI/Spinner/Spinner';
import Container from '../../../../../components/UI/Container/Container';


import { updateObject } from '../../../../../utils/sharedFunctions';
import { fandomGeneralForm } from './assets/FandomGeneralDataForm';
import ImageUpload from '../../../../../components/ImageUpload/ImageUpload'
import { checkValidity } from '../../../../../components/Forms/functions';

import ErrorMessages from './components/ErrorMessages'
import BuildForm from './components/BuildForm'

import './AddNewFandom.scss'

import Grid from '@material-ui/core/Grid';
import Card from '@material-ui/core/Card';

class AddNewFandom extends Component {

    mainImageRef = React.createRef();
    mainImageGifRef = React.createRef();
    iconImageRef = React.createRef();
    fanficImageRef = React.createRef();

    state = {
        fandomForm: fandomGeneralForm[0],
        formIsValid: false,
        fandomAddedFlag: 0,
        editMode: false,
        imageNameMain: null,
        imageNameMainGif: null,
        imageNameIcon: null,
        imageNameFanfic: null,
    }

    componentWillMount() {

        if (this.props.fandom !== null) {
            this.setState({
                editMode: true,
            })
            this.editFandomInitialState()
        }
    }


    editFandomInitialState = () => {
        const { FandomName, FandomUniverse, SearchKeys, Priority, 
                SaveMethod, AutoSave, Collection } = this.props.fandom;
        let options = [];
        let initialOptions = SaveMethod;
        this.state.fandomForm['SaveMethod'].elementConfig.options.map(check => {
            if (initialOptions.includes(check.value)) {
                options.push({
                    ...check,
                    checked: true
                })
            } else {
                options.push({
                    ...check
                })
            }
            return null
        });
        this.setState(prevState => ({
            fandomForm: {
                ...prevState.fandomForm,
                'FandomName': {
                    ...prevState.fandomForm['FandomName'],
                    value: FandomName,
                    valid: true,
                    disabled: true
                },
                'FandomUniverse': {
                    ...prevState.fandomForm['FandomUniverse'],
                    value: FandomUniverse,
                    valid: true
                },
                'SearchKeys': {
                    ...prevState.fandomForm['SearchKeys'],
                    value: SearchKeys,
                    valid: true
                },
                'Priority': {
                    ...prevState.fandomForm['Priority'],
                    value: Priority
                },
                'AutoSave': {
                    ...prevState.fandomForm['AutoSave'],
                    value: JSON.parse(AutoSave)
                },
                'SaveMethod': {
                    ...prevState.fandomForm['SaveMethod'],
                    visible: JSON.parse(AutoSave),
                    'elementConfig': {
                        ...prevState.fandomForm['SaveMethod'].elementConfig,
                        options: options
                    }
                },
                'Collection': {
                    ...prevState.fandomForm['Collection'],
                    value: (Collection && Collection!=='') ?  true : false              
                },
                'CollectionName': {
                    ...prevState.fandomForm['CollectionName'],
                    value: (Collection && Collection!=='') ?  Collection : '',
                    visible: (Collection && Collection!=='') ?  true : false    
                },
            },
            formIsValid: true,
            imageNameMain: this.props.fandom.Images.Image_Name_Main_Still,
            imageNameMainGif: this.props.fandom.Images.Image_Name_Main,
            imageNameIcon: this.props.fandom.Images.Image_Name_Icon,
            imageNameFanfic: this.props.fandom.Images.Image_Name_Fanfic
        }));
    }


    sendFandomToServerHandler = (event) => {
        event.preventDefault();

        let fandomsNames = [];
        const { fandom, fandoms } = this.props
        const { fandomForm, editMode } = this.state

        fandoms.map(fandom => (
            fandomsNames.push(fandom.FandomName)
        ));

        this.setState({ uploading: true })
        let saveType = []
        fandomForm['SaveMethod'].elementConfig.options.map(type => {
            type.checked && saveType.push(type.value)
            return null
        })
        const fandomName = fandomForm['FandomName'].value;

        let fandomFormData = new FormData();
        fandomFormData.append("FandomName", fandomName);
        fandomFormData.append("FandomUniverse", fandomForm['FandomUniverse'].value);
        fandomFormData.append("SearchKeys", fandomForm['SearchKeys'].value);
        fandomFormData.append("Priority", fandomForm['Priority'].value);
        fandomFormData.append("AutoSave", fandomForm['AutoSave'].value);
        fandomFormData.append("SaveMethod", saveType);
        fandomFormData.append("CollectionName", fandomForm['CollectionName'].value);
        fandomFormData.append("FanficsInFandom", (editMode ? fandom.FanficsInFandom : 0));
        fandomFormData.append("LastUpdate", new Date().getTime());
        fandomFormData.append("fandomsNames", fandomsNames);
        (editMode) && fandomFormData.append("FandomID", fandom.id);
        (editMode && fandom.Images.Image_Name_Main !== '') && fandomFormData.append("Image_Name_Main", fandom.Images.Image_Name_Main);
        (editMode && fandom.Images.Image_Name_Main_Still !== '') && fandomFormData.append("Image_Name_Main_Still", fandom.Images.Image_Name_Main_Still);
        (editMode && fandom.Images.Image_Name_Icon !== '') && fandomFormData.append("Image_Name_Icon", fandom.Images.Image_Name_Icon);
        (editMode && fandom.Images.Image_Name_Fanfic !== '') && fandomFormData.append("Image_Name_Fanfic", fandom.Images.Image_Name_Fanfic);

        let isMainImage = (this.mainImageRef.current.state.file === undefined ||
            this.mainImageRef.current.state.file === null ||
            !this.mainImageRef.current.state.file) ? false : true;
        let isMainImageGif = (this.mainImageGifRef.current.state.file === undefined ||
            this.mainImageGifRef.current.state.file === null ||
            !this.mainImageGifRef.current.state.file) ? false : true;
        let isIconImage = (this.iconImageRef.current.state.file === undefined ||
            this.iconImageRef.current.state.file === null ||
            !this.iconImageRef.current.state.file) ? false : true;
        let isFanficImage = (this.fanficImageRef.current.state.file === undefined ||
            this.fanficImageRef.current.state.file === null ||
            !this.fanficImageRef.current.state.file) ? false : true;

        let imageDate = new Date().getTime();
        let mainImage = false, mainImageGif = false, iconImage = false, fanficImage = false;

        if (isMainImage) {
            let type = this.mainImageRef.current.state.file.name.split('.');
            type = type[type.length - 1];
            mainImage = `${fandomName.toLowerCase().replace('&', 'and')}_${imageDate}.${type}`;
            fandomFormData.append(mainImage, this.mainImageRef.current.state.file)
        }
        if (isMainImageGif) {
            let type = this.mainImageGifRef.current.state.file.name.split('.');
            type = type[type.length - 1];
            mainImageGif = `${fandomName.toLowerCase().replace('&', 'and')}_${imageDate}.${type}`;
            fandomFormData.append(mainImageGif, this.mainImageGifRef.current.state.file)
        }
        if (isIconImage) {
            let type = this.iconImageRef.current.state.file.name.split('.');
            type = type[type.length - 1];
            iconImage = `${fandomName.toLowerCase().replace('&', 'and')}_icon_${imageDate}.${type}`;
            fandomFormData.append(iconImage, this.iconImageRef.current.state.file)
        }
        if (isFanficImage) {
            let type = this.fanficImageRef.current.state.file.name.split('.');
            type = type[type.length - 1];
            fanficImage = `fanfic_general.${type}`;
            fandomFormData.append(fanficImage, this.fanficImageRef.current.state.file)
        }

        let mode = this.state.editMode ? 'edit' : 'add';

        if (this.mainImageRef.current.state.file.name) { this.setState({ imageNameMain: fandomName + '_' + imageDate + '.' + this.mainImageRef.current.state.file.name.split('.')[1] }) }
        if (this.mainImageGifRef.current.state.file.name) { this.setState({ imageNameMainGif: fandomName + '_' + imageDate + '.' + this.mainImageGifRef.current.state.file.name.split('.')[1] }) }
        if (this.iconImageRef.current.state.file.name) { this.setState({ imageNameIcon: fandomName + '_' + imageDate + '.' + this.iconImageRef.current.state.file.name.split('.')[1] }) }
        if (this.fanficImageRef.current.state.file.name) { this.setState({ imageNameFanfic: fandomName + '_' + imageDate + '.' + this.fanficImageRef.current.state.file.name.split('.')[1] }) }


        this.props.onAddFandom(this.state.fandomForm['FandomName'].value, mode, fandomFormData, mainImage, mainImageGif, iconImage, fanficImage).then(() => {

            switch (this.props.message) {
                case 'Success':
                    this.setState({ fandomAddedFlag: 1 })
                    setTimeout(() => {
                        this.props.history.push('/manageFandoms');
                    }, 1000);
                    break;
                case 'Fandom Already Exist':
                    this.setState({ fandomAddedFlag: 2 })
                    break;
                case 'Error':
                    this.setState({ fandomAddedFlag: 3 })
                    break;
                default:
                    break;
            }
        });

        return null

    }

    inputCheckedHandler = (event) => {
        let options = []
        this.state.fandomForm['SaveMethod'].elementConfig.options.map(function (check) {
            if (check.value === event.target.value) {
                options.push({
                    ...check,
                    checked: event.target.checked
                })
            } else {
                options.push({
                    ...check
                })
            }
            return null;
        });


        this.setState(prevState => ({
            fandomForm: {
                ...prevState.fandomForm,
                'SaveMethod': {
                    ...prevState.fandomForm['SaveMethod'],
                    'elementConfig': {
                        ...prevState.fandomForm['SaveMethod'].elementConfig,
                        options: options
                    }
                }
            }
        }));

    }

    inputChangedHandler = (event, inputIdentifier) => {

        const updatedFormElement = updateObject(this.state.fandomForm[inputIdentifier], {
            value: event.target.value,
            valid: checkValidity(event.target.value, this.state.fandomForm[inputIdentifier].validation),
            touched: true,
        });
        let updatedFandomForm = null;


        if (inputIdentifier === 'AutoSave' || inputIdentifier === 'Collection') {
            let changeAttr = inputIdentifier === 'AutoSave' ? 'SaveMethod' : 'CollectionName';
            const updatedFormElement1 = updateObject(this.state.fandomForm[changeAttr], {
                visible: JSON.parse(event.target.value)
            });

            updatedFandomForm = updateObject(this.state.fandomForm, {
                [inputIdentifier]: updatedFormElement,
                [changeAttr]: updatedFormElement1
            })
        } else {
            updatedFandomForm = updateObject(this.state.fandomForm, {
                [inputIdentifier]: updatedFormElement
            })
        }

        let formIsValid = true;
        for (let inputIdentifier in updatedFandomForm) {
            formIsValid = updatedFandomForm[inputIdentifier].valid && formIsValid;
        }
        this.setState({ fandomForm: updatedFandomForm, formIsValid: formIsValid });

    }

    render() {
        const { fandomForm, editMode, fandomAddedFlag, formIsValid, imageNameMain, imageNameMainGif, imageNameIcon, imageNameFanfic } = this.state;
        const { loading } = this.props;

        const formElementsArray = [];
        for (let key in fandomForm) {
            formElementsArray.push({
                id: key,
                config: fandomForm[key]
            })
        }

        let header = (editMode && !loading) ? `Edit ${fandomForm['FandomName'].value} Fandom` : 'Add New Fandom';
        let page = (loading) ? <Container><Spinner /></Container> : (
            <Container header={header}>
                <Card className='add_new_fandom'>
                    <Grid container className='add_new_fandom_box'>
                        {/* <Grid item xs={4} className='add_new_fandom_main_image'>

                        </Grid> */}
                        <Grid item xs={12} className='add_new_fandom_content'>
                            <BuildForm onSubmit={this.sendFandomToServerHandler} array={formElementsArray} check={this.inputCheckedHandler}
                                changed={this.inputChangedHandler} disabled={!formIsValid} buttonSendLabel='SEND' />
                            <ErrorMessages fandomAddedFlag={fandomAddedFlag} />
                        </Grid>
                        <Card className='add_new_fandom_images_card'>
                            <Grid item className='add_new_fandom_images_card_content'>
                                <h2>Add images for fanfics:</h2>
                                <div className='add_new_fandom_images_card_content_images_div'>
                                <ImageUpload id='main' ref={this.mainImageRef} edit={editMode} fileName={imageNameMain} FandomName={fandomForm['FandomName'].value}
                                label='Please Select Main Image' imageLabel='Main Image' type='image' />
                                <ImageUpload id='mainGif' ref={this.mainImageGifRef} edit={editMode} fileName={imageNameMainGif} FandomName={fandomForm['FandomName'].value}
                                    label='Please Select Main Image Gif' imageLabel='Main Image Gif' type='image' />
                                    <ImageUpload id='icon' ref={this.iconImageRef} edit={editMode} fileName={imageNameIcon} FandomName={fandomForm['FandomName'].value}
                                        label='Please Select Icon Image' imageLabel='Icon Image' type='image' />
                                    <ImageUpload id='fanfic' ref={this.fanficImageRef} edit={editMode} fileName={imageNameFanfic} FandomName={fandomForm['FandomName'].value}
                                        label='Please Select Fanfic General Image' imageLabel='Fanfic Image' type='image' />
                                </div>
                            </Grid>
                        </Card>
                        {/* <div className={classes.Clear}></div> */}
                    </Grid>
                </Card>
            </Container>
        );
        return (
            page
        );
    }
}


const mapStateToProps = state => {
    return {
        fandoms: state.fandoms.fandoms,
        fandom: state.fandoms.fandom,
        message: state.fandoms.message,
        loading: state.fandoms.loading
    };
}

const mapDispatchedToProps = dispatch => {
    return {
        // initFandom:     () => dispatch(actions.fandomInit()),
        onGetFandoms: () => dispatch(actions.getFandomsFromDB()),
        onAddFandom: (FandomName, mode, fandom, mainImage, mainImageGif, iconImage, fanficImage) =>
            dispatch(actions.addFandomToDB(FandomName, mode, fandom, mainImage, mainImageGif, iconImage, fanficImage)),
        onPostFandom: (fandom) => dispatch(actions.getFandom(fandom))

    };
}

export default connect(mapStateToProps, mapDispatchedToProps)(withRouter(AddNewFandom));

