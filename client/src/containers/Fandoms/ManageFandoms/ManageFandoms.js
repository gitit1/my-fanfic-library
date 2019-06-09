import React,{Component} from 'react';
import {connect} from 'react-redux';
import { withRouter } from 'react-router-dom';

import classes from './ManageFandoms.module.css';

import * as actions from '../../../store/actions';

import Button from '../../../components/UI/Button/Button';
import Container from '../../../components/UI/Container/Container';

import ShowFandomData from './ShowFandomData/ShowFandomData';


class ManageFandoms extends Component{

  componentDidMount(){
    this.props.onGetFandoms()
  }

  routeChange = () => {
    this.props.history.push({
      pathname: '/addnewfandom',
      state: {editMode: false}
    });
  }

  deleteFandomHandler = (id,Fandom_Name) =>{
    this.props.onDeleteFandoms(id,Fandom_Name).then(()=>{
      console.log(this.props.message)
      switch  (this.props.message) {
          case 'Success':                
              this.props.onGetFandoms()
              break;
          case 'Error':
              break;
          default:
              break;
      }  
  });
  }

  editFandomHandler = (fandom) => {
    this.props.onPostFandom(fandom)
    this.props.history.push({
      pathname: '/addnewfandom',
      state: {editMode: true}
    });
  }

  render(){
    let page =  this.props.loading && <p>Page is loading</p>
    if(!this.props.loading){
      if(this.props.fandoms.length === 0||this.props.fandoms ===null){
          page = (
            <div>
              <p>There Are No Fandoms On Your List - Please Add at least one</p>             
            </div>
          )
      }else{
          const sortedFandomList = this.props.fandoms.sort((a, b) => a.Fandom_Name.localeCompare(b.Fandom_Name))
          page = (<ShowFandomData 
                                  fandoms={sortedFandomList}
                                  editFandom={this.editFandomHandler}
                                  deleteFandom={this.deleteFandomHandler}/>)
                  
      }
    }

    return(
      <Container header={'Manage Fandoms'}>
          { this.props.loading ?
              <p>Page is loading</p>
              :
              <React.Fragment>
                <div className={classes.AddNew}>
                  <Button clicked={this.routeChange}>Add New Fandom</Button>
                </div>
                <div className={classes.Fandoms}>
                  {page}
                </div>  
                <div className={classes.Clear}></div>
              </React.Fragment>
          
          }
        </Container>


      
    )
  }
};

const mapStateToProps = state =>{
  return{
      fandoms:    state.fandoms.fandoms,
      message:    state.fandoms.message,
      loading:    state.fandoms.loading
  };   
}

const mapDispatchedToProps = dispatch =>{
  return{
      onGetFandoms:    () => dispatch(actions.getFandomsFromDB()),
      onPostFandom:    (fandom) => dispatch(actions.getFandom(fandom)),
      onDeleteFandoms: (id,Fandom_Name) => dispatch(actions.deleteFandomFromDB(id,Fandom_Name))
  };
}

export default connect(mapStateToProps,mapDispatchedToProps)(withRouter(ManageFandoms));