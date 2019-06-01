import React,{Component} from 'react';
import {connect} from 'react-redux';

import Button from '../../../components/UI/Button/Button';
import * as actions from '../../../store/actions';

class ManageFandoms extends Component{
  componentDidMount(){
    this.props.onGetFandoms()
  }
  render(){
    let page =  <p>Page is loading</p>
    if(!this.props.loading){
      if(this.props.fandoms.length === 0||this.props.fandoms ===null){
          page = (
            <div>
              <p>There Are No Fandoms On Your List - Please Add at least one</p>
              <Button>Add New Fandom</Button>
            </div>
          )
      }else{
        page = this.props.fandoms.map(fandom=>(
          <p>{fandom.Fandom_Name}</p>
        ))
      }
    }

    return(
      <div>
        <h2>Manage Fandoms</h2>
        {page}
      </div>
    )
  }
};

const mapStateToProps = state =>{
  return{
      fandoms:    state.fandoms.fandoms,
      loading:    state.fandoms.loading
  };   
}

const mapDispatchedToProps = dispatch =>{
  return{
      onGetFandoms: () => dispatch(actions.getFandomsFromDB())
  };
}

export default connect(mapStateToProps,mapDispatchedToProps)(ManageFandoms);