import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Button } from '@material-ui/core';
import * as actions from '../../../../store/actions';
import Spinner from '../../../../components/UI/Spinner/Spinner';
import ShowFanficData from '../../AddNewFanfic/components/helpers/GetFanficData/components/showFanficData/showFanficData'
class DuplicateTitles extends Component {
    state = {
        index: 0,
        showFlag: false,
        hideButtons: false,
        fanfic1: null,
        fanfic2: null,
        msg: ''
    }

    componentDidMount() {
        console.log('list length is: ', this.props.list.length);
        this.loadNewPair();
    }

    loadNewPair = () => {
        const { index } = this.state;
        const { list } = this.props;
        
        this.setState({
            showFlag: false,
            msg: `Waiting for data for Pair ${index} out of ${list.length}`
        }, ()=>this.getFanficsData())      
    }

    getFanficsData = async () => {
        const { index, showFlag } = this.state;
        const { list, onGetFanficData, fandomName } = this.props;

        const id1 = list[index].uniqueIds[0];
        const id2 = list[index].uniqueIds[1];
        await onGetFanficData('id', fandomName, id1).then(() => {
            console.log('got 1', id1)
            this.setState({ fanfic1: this.props.fanfic })
        })
        await onGetFanficData('id', fandomName, id2).then(() => {
            console.log('got 2', id2)
            this.setState({ fanfic2: this.props.fanfic })
        })
        this.setState({
            showFlag: true,
            index: index + 1,
            msg: `Comparing Pair ${index + 1} out of ${list.length}`
        })
    }

    saveAsSimilar = (isSimilar) => {
        const { index, fanfic1, fanfic2 } = this.state;
        const { list } = this.props;
        let id1, id2;

        this.setState({
            showFlag: false,
            msg: isSimilar ? `Saving as Similar....` : `Saving as Unique`
        });
        setTimeout(() => {
            if (fanfic1.Source === 'AO3') {
                id1 = fanfic1.FanficID;
                id2 = fanfic2.FanficID;
            } else {
                id1 = fanfic2.FanficID;
                id2 = fanfic1.FanficID;
            }
    
            this.props.onSaveAsSimilarFanfic(isSimilar, this.props.fandomName, id1, id2).then(res => {
                console.log('res:',res);
                const isFinished = !(index < list.length);
                this.setState({
                    showFlag: isFinished,
                    msg: !isFinished ? `Saved! Moving to next one...` : `Done!`,
                    hideButtons: isFinished
                },()=>{
                    !isFinished && setTimeout(() => {
                        this.getFanficsData()
                    }, 2000);
                });
            });            
        }, 2000);
    }

    render() {
        const { index, fanfic1, fanfic2, showFlag, msg, hideButtons } = this.state;
        const { list, size } = this.props;
        return (
            <div className='duplicateTitles'>
                {showFlag ?
                    <>
                        <p>{msg}</p>
                        <ShowFanficData fanfic={fanfic1} size={size} showUserData={false} />
                        <ShowFanficData fanfic={fanfic2} size={size} showUserData={false} />
                        <br />
                        { !hideButtons && <>
                            <Button variant="contained"
                                className="merge"
                                color="secondary"
                                onClick={() => this.saveAsSimilar(true)}>Save as Similar (Merge)</Button>
                            <Button variant="contained"
                                className="merge"
                                color="primary"
                                onClick={() => this.saveAsSimilar(false)}>Save as Unique (UnMerge)</Button> 
                        </>}
                    </>
                    :
                    <>
                        {msg}
                        <Spinner />
                    </>
                }
            </div>
        )
    }
}

const mapStateToProps = state => {
    return {
        fanfic: state.downloader.fanfic,
        size: state.screenSize.size
    };
}

const mapDispatchedToProps = dispatch => {
    return {
        onGetFanficData: (type, fandomName, id) => dispatch(actions.getFanficData(type, fandomName, id)),
        onSaveAsSimilarFanfic: (isSimilar, fandomName, id1, id2) => dispatch(actions.saveAsSimilarFanfic(isSimilar, fandomName, id1, id2))
    };
}

export default connect(mapStateToProps, mapDispatchedToProps)(DuplicateTitles);