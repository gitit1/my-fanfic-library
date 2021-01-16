import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Helmet } from "react-helmet";
import TextField from '@material-ui/core/TextField';
import * as actions from '../../store/actions';
import Spinner from '../../components/UI/Spinner/Spinner';
import Container from '../../components/UI/Container/Container';
import ShowFandomData from './components/ShowFandomData/ShowFandomData';
import BoxContent from './components/BoxContent'
import classes from './Fandoms.module.scss';

class AllFandoms extends Component {
  state = {
    userFandoms: [],
    listFandoms: [],
    filteredFandomList: [],
    changeImageFlag: ''
  }

  componentWillMount() {
    if (this.props.userFandoms === null) {
      this.props.onGetUserFandoms(this.props.userEmail).then(() => {
        this.setState({ userFandoms: this.props.userFandoms })
      })
    } else {
      this.setState({ userFandoms: this.props.userFandoms })
    }
    const sortedFandomList = this.props.fandoms.sort((a, b) => a.FandomName.localeCompare(b.FandomName));
    this.setState({ listFandoms: sortedFandomList, filteredFandomList: sortedFandomList });
  }

  componentWillUnmount() {
    this.props.onGetUserFandoms(this.props.userEmail)
  }

  markFavoriteFandom = (fandom, userEmail) => {
    let isExsist = this.state.userFandoms.includes(fandom) ? true : false;
    let userFandoms = [...this.state.userFandoms];


    this.props.onAddFandomToUserFavorite(userEmail, fandom, !isExsist).then(() => {
      if (isExsist) {
        userFandoms = userFandoms.filter(f => { return f !== fandom });
      } else {
        userFandoms.push(fandom)
      }
      this.setState({ userFandoms })
    })
  }

  changeImage = (id, fandom) => {
    const changeImageFlag = id === 0 ? null : fandom;
    this.setState({ changeImageFlag });
  }

  getNewFilteredArray(e) {
    let newList = this.state.listFandoms.filter(function (v, i) {
      if (v.FandomName.toLowerCase().indexOf(e.target.value.toLowerCase()) >= 0) {
        return true;
      } else {
        return false;
      }
    });
    this.setState({ filteredFandomList: newList })
  }

  render() {
    const { fandoms, isAuthenticated, userEmail, size, smallSize, loading } = this.props;
    const { userFandoms, changeImageFlag, listFandoms, filteredFandomList } = this.state;
    let page = null;


    if (!loading) {
      if (fandoms.length === 0 || fandoms === null) {
        page = (
          <div>
            <p>There Are No Fandoms On Your List - Please Add at least one</p>
          </div>
        )
      } else {
        let fandomsList = [];
        listFandoms.map(fandom => {
          fandomsList.push({ value: fandom.FandomName, label: fandom.FandomName })
          return null;
        });
        page = (
          <>
            <Helmet>
              <meta charSet="utf-8" />
              <title>Fandoms</title>
              <description></description>
              <meta name={`This page contains wlw fandoms`} content={`fandoms,fandom,lesbian,wlw,fanfic,fanfics,love,gay`}></meta>
            </Helmet>
            <div className={classes.FilterSection}>
              <TextField id="fandom-search" label="Search For Fandom" onChange={(e) => this.getNewFilteredArray(e)} />
            </div>
            <ShowFandomData fandoms={filteredFandomList} screenSize={size} smallSize={smallSize} hadButtons={false} userFandoms={userFandoms}
              userEmail={userEmail} isAuthenticated={isAuthenticated} markFavFandom={this.markFavoriteFandom} changeImage={this.changeImage}
              changeImageFlag={changeImageFlag}
              boxContent={<BoxContent />} />
          </>
        )

      }
    }

    return (<Container header='All Fandoms'>{loading ? <Spinner /> : <React.Fragment>{page}</React.Fragment>}</Container>)
  }
}

const mapStateToProps = state => {
  return {
    fandoms: state.fandoms.fandoms,
    message: state.fandoms.message,
    userFandoms: state.fandoms.userFandoms,
    loading: state.fandoms.loading,
    size: state.screenSize.size,
    smallSize: state.screenSize.smallSize,
    userEmail: state.auth.user.email,
    isAuthenticated: state.auth.isAuthenticated,
  };
}

const mapDispatchedToProps = dispatch => {
  return {
    onGetUserFandoms: (userEmail) => dispatch(actions.getUserFandoms(userEmail)),
    onAddFandomToUserFavorite: (userEmail, fandom, status) => dispatch(actions.addFandomToUserFavorite(userEmail, fandom, status)),
  }
}


export default connect(mapStateToProps, mapDispatchedToProps)(AllFandoms);