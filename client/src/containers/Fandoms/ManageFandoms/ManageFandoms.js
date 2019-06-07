import React,{Component} from 'react';
import {connect} from 'react-redux';
import { withRouter } from 'react-router-dom';

import classes from './ManageFandoms.module.css';
import Button from '../../../components/UI/Button/Button';
import ShowFandomData from './ShowFandomData/ShowFandomData';
import * as actions from '../../../store/actions';

class ManageFandoms extends Component{

  componentDidMount(){
    this.props.onGetFandoms()
  }

  routeChange = () => {
    let path = '/addnewfandom';
    this.props.history.push(path);
  }

  deleteFandomHandler = (Fandom_Name) =>{
    this.props.onDeleteFandoms(Fandom_Name).then(()=>{
      console.log(this.props.message)
      switch  (this.props.message) {
          case 'Success':                
              this.props.onGetFandoms();
              break;
          case 'Error':
              break;
      }  
  });
  
  }

  render(){
    let page =  <p>Page is loading</p>
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
      <div className={classes.ManageFandoms}>
        <h2>Manage Fandoms</h2>
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

      </div>
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
      onDeleteFandoms: (Fandom_Name) => dispatch(actions.deleteFandomFromDB(Fandom_Name))
  };
}

export default connect(mapStateToProps,mapDispatchedToProps)(withRouter(ManageFandoms));