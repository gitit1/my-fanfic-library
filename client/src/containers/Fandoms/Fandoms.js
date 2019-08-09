import React,{Component} from 'react';
import {connect} from 'react-redux';

import classes from './Fandoms.module.css';

import Spinner from '../../components/UI/Spinner/Spinner';
import Container from '../../components/UI/Container/Container';

import ShowFandomData from './ShowFandomData/ShowFandomData';


class AllFandoms extends Component{
    state ={
      screenSize:null,
      mobileSize: 736,
      medSize:1000
    }

    componentWillMount(){this.setState({screenSize:window.innerWidth})}

    render(){
        const {screenSize,mobileSize,medSize} = this.state;
        let size = (screenSize>medSize) ? 'l' : (screenSize>mobileSize) ? 'm' : 's';
        console.log('screenSize:',screenSize)
        console.log('size:',size)
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
              page = (<ShowFandomData fandoms={sortedFandomList} screenSize={size}/>)
                      
          }
        }
    
        return(
          <Container header='All Fandoms'>
              { this.props.loading ?
                  <Spinner/>
                  :
                  <div className={classes.Fandoms}>
                    {page}
                  </div>           
              }
            </Container>
    
    
          
        )
      }
}

const mapStateToProps = state =>{
    return{
        fandoms:    state.fandoms.fandoms,
        message:    state.fandoms.message,
        loading:    state.fandoms.loading
    };   
  }
  
export default connect(mapStateToProps)(AllFandoms);