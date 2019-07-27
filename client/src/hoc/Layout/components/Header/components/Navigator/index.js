import React,{Component} from 'react';

import NavWeb from './components/NavWeb'
import NavMobile from './components/NavMobile'

class Navigator extends Component{
  state ={
    screenSize:null,
    mobileSize: 736
  }

  componentWillMount(){
    this.setState({screenSize:window.innerWidth})
  }
  render(){
    const {screenSize,mobileSize} = this.state
    return(
      <React.Fragment>
        {(screenSize > mobileSize) ? <NavWeb  auth={this.props.auth}/> : <NavMobile  auth={this.props.auth}/>}
      </React.Fragment>

    )
  }
};

export default Navigator;
