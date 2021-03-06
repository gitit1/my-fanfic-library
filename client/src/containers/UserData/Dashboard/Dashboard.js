import React, { Component } from "react";
import { connect } from "react-redux";
import * as actions from '../../../store/actions';

import Container from '../../../components/UI/Container/Container';
import Spinner from '../../../components/UI/Spinner/Spinner';
import Grid from '@material-ui/core/Grid';
import Slider from "react-slick";
import classes from './Dashboard.module.scss';
import './slider.css'

import {Link} from 'react-router-dom';
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Typography from '@material-ui/core/Typography';

import {getFandomsNumbers} from '../MyStatistics/functions/functions'
import GeneralBarChart from '../MyStatistics/components/GeneralBarChart/GeneralBarChart'

const settings = {
  dots: false,
  infinite: false,
  speed: 500,
  slidesToShow: 3,
  slidesToScroll: 3
};

class Dashboard extends Component {
    state = {
      userFandomsArr:[],
      fandomData:null
    }
    componentDidMount(){
      const {onGetUserFandoms,onGetFullUserData,userFandoms,userEmail,userData,fandoms} = this.props;

      if(userFandoms===null){
        onGetUserFandoms(userEmail).then(()=>{
          const userFandoms = this.props.userFandoms;
          const userFandomsArr = (userFandoms!==null&&userFandoms.length!==0) ? fandoms.filter(fandom=>{return userFandoms.includes(fandom.FandomName)}) : []
          this.setState({userFandomsArr})
        })
        if(Object.entries(userData).length === 0){
          onGetFullUserData(userEmail).then(()=>{
            if(Object.entries(this.props.userData).length === 0){
              this.setState({noDataFlag:true,loading:false})
            }else{
              getFandomsNumbers(this.props.userData).then(fandomData=>{
                 this.setState({fandomData:fandomData,loading:false})
              })
            }
          });
        }else{
          getFandomsNumbers(userData).then(fandomData=>{
            this.setState({fandomData:fandomData,loading:false})
          })
        }
      }else{
        const userFandomsArr = fandoms.filter(fandom=>{return userFandoms.includes(fandom.FandomName)})
        this.setState({userFandomsArr})
      }
  }

  onLogoutClick = e => {
    e.preventDefault();
    this.props.logoutUser();
  };

  render() {
      const {name,loading} = this.props;
      const {userFandomsArr,fandomData} = this.state
      

      return (
          loading ? <Spinner/> :
            <Container header={`${name} Dashboard`} className={classes.Dashboard}>
              <Grid container className={classes.GridContainer}>
                <Grid item xs={12} className={classes.MyFandoms}>
                  <div className={classes.Slider}>
                    <Typography className={classes.Headers} gutterBottom variant="h5" component="h2">My Fandoms</Typography>
                    {userFandomsArr.length===0
                      ? <h3>You currently don't have Favorite Fandoms , <Link to='/fandoms'>Add some</Link></h3>
                      :
                      <Slider {...settings}>
                          {userFandomsArr.map(fandom=>(
                              <Card className={classes.Card} key={fandom.FandomName} >
                                <CardActionArea className={classes.CardActionArea}>
                                  <Link to={`/fanfics/${fandom.FandomName}`}>
                                    <CardMedia className={classes.CardMedia}
                                                image={fandom.Image_Name_Main !== '' 
                                                        ? `/fandoms/${fandom.FandomName.toLowerCase()}/${fandom.Images.Image_Name_Main}`
                                                        : `/fandoms/nophoto.png`
                                                } 
                                                title={fandom.FandomName}/>
                                    <CardContent className={classes.CardContent}>
                                    <div  className={classes.Overlay}>
                                        <Typography className={classes.OverlayCaption} gutterBottom variant="h5" component="h2">
                                            {fandom.FandomName}
                                        </Typography>
                                    </div>
                                    </CardContent>
                                  </Link>
                                </CardActionArea>
                              </Card>
                          ))}
                      </Slider>
                    }
                  </div>
                </Grid>
                <Grid item xs={12} className={classes.MyTracker}>
                  <Typography className={classes.Headers} gutterBottom variant="h5" component="h2">My Tracker</Typography>
                  {userFandomsArr.length===0
                      ? <h3>You currently don't have user data to view</h3>
                      : <><GeneralBarChart data={fandomData}/><br/></>
                  }
                </Grid>
                <Grid item xs={12} className={classes.Other}>
                  <Typography className={classes.Headers} gutterBottom variant="h5" component="h2">Reading List</Typography>
                  <div>TODO: reading list</div>
                  <br/>
                </Grid>
                <Grid item xs={12} className={classes.Other}>
                  <Typography className={classes.Headers} gutterBottom variant="h5" component="h2">User Info/Settings</Typography>
                  <div>TODO: edit info of user</div>
                  <br/>
                </Grid>               
                {/* <Grid item xs={12} className={classes.Other}>
                    <div>TODO: add images (?)</div>
                </Grid> */}
              </Grid>
              <div></div>
              
              
            </Container>
          );
        }
}


const mapStateToProps = state => ({
  name:         state.auth.user.name,
  userEmail:    state.auth.user.email,
  fandoms:      state.fandoms.fandoms,
  userData:     state.auth.userData,
  userFandoms:  state.fandoms.userFandoms,
  loading:      state.fandoms.loading,
});

const mapDispatchedToProps = dispatch =>{
  return{
      onGetFullUserData:          (userEmail)         => dispatch(actions.getFullUserData(userEmail)),
      onGetUserFandoms:           (userEmail)         =>  dispatch(actions.getUserFandoms(userEmail)),   
      logoutUser:                 ()                  =>  dispatch(actions.logoutUser())
  }
}  

export default connect(mapStateToProps,mapDispatchedToProps)(Dashboard);