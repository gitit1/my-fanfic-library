import React,{Component} from 'react';
import {connect} from 'react-redux';


import Spinner from '../../components/UI/Spinner/Spinner';
import Container from '../../components/UI/Container/Container';

import ShowFandomData from './components/ShowFandomData/ShowFandomData';
import BoxContent from './components/BoxContent'

class AllFandoms extends Component{
    
    render(){
        let page =  null;
        if(!this.props.loading){
          if(this.props.fandoms.length === 0||this.props.fandoms ===null){
              page = (
                <div>
                  <p>There Are No Fandoms On Your List - Please Add at least one</p>             
                </div>
              )
          }else{
              const sortedFandomList = this.props.fandoms.sort((a, b) => a.FandomName.localeCompare(b.FandomName))
              page = (<ShowFandomData fandoms={sortedFandomList} screenSize={this.props.size} smallSize={this.props.smallSize} hadButtons={false} boxContent={<BoxContent />}/>)
                      
          }
        }
    
        return(<Container header='All Fandoms'>{ this.props.loading ?<Spinner/> : <React.Fragment>{page}</React.Fragment> }</Container>)
      }
}

const mapStateToProps = state =>{
    return{
        fandoms:    state.fandoms.fandoms,
        message:    state.fandoms.message,
        loading:    state.fandoms.loading,
        size:       state.screenSize.size,
        smallSize:  state.screenSize.smallSize
    };   
  }
  
export default connect(mapStateToProps)(AllFandoms);