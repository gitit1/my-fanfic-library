import React,{Component} from 'react';
import {connect} from 'react-redux';

import * as actions from '../../../store/actions';

class ManageFandoms extends Component{
  componentDidMount(){
    this.props.onGetFandoms()
  }
  render(){
    return(
      <div>
        <h2>ManageFandoms</h2>
        
      </div>
    )
  }
};

const mapStateToProps = state =>{
  return{
      fandoms:    state.fandoms.orders,
      loading:    state.fandoms.loading
  };   
}

const mapDispatchedToProps = dispatch =>{
  return{
      onGetFandoms: () => dispatch(actions.getFandomsFromDB())
  };
}

export default connect(mapStateToProps,mapDispatchedToProps)(ManageFandoms);