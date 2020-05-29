import React, { Component } from 'react';
import { connect } from 'react-redux';
import io from 'socket.io-client';

import * as actions from '../../../store/actions';

import Container from '../../../components/UI/Container/Container';

import { Grid } from '@material-ui/core';

import GridChooseFandom from './components/GridChooseFnadom'
import GridButtons from './components/GridButtons'
import GridDataBox from './components/GridDataBox';
import Button from '@material-ui/core/Button';

import './ManageDownloader.scss';

const socket = (!process.env.NODE_ENV || process.env.NODE_ENV === 'development')
    ? io('ws://localhost:8080', { transports: ['websocket'] }, { secure: false })
    : (window.location.origin.includes('mfl'))
        ? io(window.location.origin.replace(/^http/, 'ws') + ':8081', { transports: ['websocket'] }, { secure: false })
        : io(window.location.origin.replace(/^http/, 'ws') + ':8080', { transports: ['websocket'] }, { secure: false });




class ManageDownloader extends Component {

    state = {
        fandom: 'All',
        fandomSelect: {
            label: 'Choose Fandom',
            elementType: 'select',
            elementConfig: { options: [] },
            value: '',
            visible: true,
            ready: false,
            id: 'select-fandom'
        },
        typeSelect: {
            label: 'Choose Type for saving fanfics',
            elementType: 'select',
            elementConfig: {
                options: [
                    { value: 'azw3', displayValue: 'azw3', checked: false },
                    { value: 'epub', displayValue: 'epub', checked: false },
                    { value: 'mobi', displayValue: 'mobi', checked: false },
                    { value: 'pdf', displayValue: 'pdf', checked: false },
                    { value: 'html', displayValue: 'html', checked: false }]
            },
            value: 'epub',
            visible: true,
            ready: true
        },
        serverData: null,
        duplicatesList: [],
        logs: [],
        showSwitches: true,
        switches: {
            AO3: true,
            FF: true
        },
        showData: 0,
        showGridDataBox: false,
        showGridButtons: true,
        backupDBmsg: ''
    }

    componentDidMount() {
        console.log('window.location.origin:', (window.location.origin))
        this.createOptionsForFandomSelect();
        socket.removeAllListeners();
        !this.props.smallSize && this.setState({ showGridDataBox: true })
    }

    componentWillUnmount() { this.props.onGetFandoms() }

    createOptionsForFandomSelect = () => {
        let options = [{ value: 'All', displayValue: 'All' }];
        this.props.fandoms.sort((a, b) => a.FandomName.localeCompare(b.FandomName)).map(fandom => {
            options.push({ value: fandom.FandomName, displayValue: fandom.FandomName })
            return null
        });
        this.setState(prevState => ({
            fandomSelect: {
                ...prevState.fandomSelect,
                'elementConfig': { ...prevState.fandomSelect.elementConfig.options, options: options },
                ready: true
            }
        }));
    }

    sendRequestsToServerHandler = async (choice) => {
        socket.removeAllListeners()
        this.setState({ serverData: null, logs: [], showData: 0 })
        this.props.smallSize && this.setState({ showGridDataBox: true, showGridButtons: false });

        let ao3 = this.state.switches.AO3;
        let ff = this.state.switches.FF;


        socket.on('getFanficsData', serverData => {
            this.setState({ serverData })
            this.state.logs.push(this.state.serverData)
            if (this.state.serverData === 'End') {
                this.state.logs.push('Done!');
                this.props.onGetFandoms();
            }
        });

        socket.on('getDuplicateList', serverData => {
            this.setState({
                duplicatesList: serverData,
                showData: 0
            });
            if (this.state.duplicatesList.length > 0) {
                setTimeout(() => {
                    this.setState({
                        showData: 2
                    });
                }, 2000);
            }
        });

        socket.emit('getFandomFanfics', this.state.fandom, choice, ao3, ff);

    }

    inputChangedHandler = (event) => {
        socket.removeAllListeners()

        const selectedFandom = event.target.value, logs = [], serverData = null;
        let fandom = (selectedFandom === 'All') ? 'All' : (this.props.fandoms.filter(fandom => fandom.FandomName === selectedFandom)[0]);
        let showData = (selectedFandom === 'All') ? 0 : 1;

        this.props.smallSizeMode && this.setState({ showGridDataBox: false, showGridButtons: true });
        this.setState(prevState => ({
            fandom, serverData, logs, showData,
            fandomSelect: { ...prevState.fandomSelect, value: selectedFandom },
            switches: { ...prevState.switches, checked: fandom.AutoSave }
        }));
    }

    typeInputChangedHandler = (event) => {
        socket.removeAllListeners()

        let selectedMethod = event.target.value;

        this.setState(prevState => ({ typeSelect: { ...prevState.typeSelect, value: selectedMethod } }));
    }

    switchChangeHandler = (name) => {
        console.log('in switchChangeHandler')
        this.setState(prevState => ({
            switches: {
                ...prevState.switches,
                [name]: !this.state.switches[name]
            }
        }));
    }

    toggleBottons = () => {
        this.props.smallSize && this.setState({ showGridDataBox: false, showGridButtons: true });
    }
    backupDB = () => {
        this.setState({ backupDBmsg: 'Backup is happening on server...' });
        this.props.backupDB().then(() => {
            this.setState({ backupDBmsg: 'Done with backup' });
        })
    }

    render() {
        const { fandom, fandomSelect, switches, logs, showData, showGridButtons, showGridDataBox, backupDBmsg, duplicatesList } = this.state
        const { smallSize } = this.props;
        const isAllFandoms = (fandom === 'All') ? true : false
        return (
            <Container header='Downloader' className='managedownloader'>
                <Grid container className='downloader'>
                    <GridChooseFandom fandomSelect={fandomSelect} inputChange={this.inputChangedHandler} />
                    {this.props.smallSize && showGridDataBox &&
                        <Button variant="contained" className='backButton' onClick={() => this.toggleBottons()}>Back to Bottons</Button>
                    }
                    {
                        fandomSelect.value !== '' ?
                            <>
                                <GridButtons
                                    sendRequestsToServer={this.sendRequestsToServerHandler}
                                    showBox={showGridButtons}
                                    switches={switches}
                                    switchChange={this.switchChangeHandler}
                                    isAllFandoms={isAllFandoms}
                                    xs={4}
                                />
                                <GridDataBox
                                    fandom={fandom}
                                    showData={showData}
                                    logs={logs}
                                    showBox={showGridDataBox}
                                    smallSizeMode={smallSize}
                                    duplicatesList={duplicatesList}
                                    xs={8}
                                />
                            </> :
                            <div className='backup'>
                                <Button variant="contained" className='backupButton' onClick={() => this.backupDB()}>Backup DB</Button>
                                <div className='backupMessage'>{backupDBmsg}</div>
                            </div>
                    }
                </Grid>
            </Container>
        )
    }
}

const mapStateToProps = state => {
    return {
        fandoms: state.fandoms.fandoms,
        size: state.screenSize.size,
        smallSize: state.screenSize.smallSize
    };
}

const mapDispatchedToProps = dispatch => {
    return {
        // initFandom:     () => dispatch(actions.fandomInit()),
        onGetFandoms: () => dispatch(actions.getFandomsFromDB()),
        backupDB: () => dispatch(actions.backupDB())
    };
}

export default connect(mapStateToProps, mapDispatchedToProps)(ManageDownloader);