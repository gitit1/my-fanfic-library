import React, { Component } from 'react';
import { connect } from 'react-redux';
import * as actions from '../../../../store/actions';

class DuplicateTitles extends Component {
    state = {
        index: 0,
        fanfic1: null,
        fanfic2: null
    }

    componentDidMount() {
        console.log('list length is: ',this.props.list.length)
        const fanficId1 = this.props.list[0].uniqueIds[0];
        const fanficId2 = this.props.list[0].uniqueIds[1];
        this.props.onGetFanficData('id', this.props.fandomName, fanficId1).then(() => {
            this.setState({ fanfic1: this.props.fanfic })
            console.log('fanfic1::',this.state.fanfic1)

        })
    }

    render() {
        return (
            <div>
                <p>this is a test of DuplicateTitles</p>
                {/* <p>0::: {this.props.list[0]}</p> */}
            </div>
        )
    }
}

const mapStateToProps = state => {
    return {
        fanfic: state.downloader.fanfic
    };
}

const mapDispatchedToProps = dispatch => {
    return {
        onGetFanficData: (type, fandomName, id) => dispatch(actions.getFanficData(type, fandomName, id)),
    };
}

export default connect(mapStateToProps, mapDispatchedToProps)(DuplicateTitles);