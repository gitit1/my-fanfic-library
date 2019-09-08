import React,{Component} from 'react';
import {connect} from 'react-redux';
import * as actions from '../../store/actions';

import Spinner from '../../components/UI/Spinner/Spinner';
import Container from '../../components/UI/Container/Container';

import ShowFandomData from './components/ShowFandomData/ShowFandomData';
import BoxContent from './components/BoxContent'

class AllFandoms extends Component{

  state = {
    userFandoms:[]
  }

  componentWillMount(){
      if(this.props.userFandoms===null){
        this.props.onGetUserFandoms(this.props.userEmail).then(()=>{
        this.setState({userFandoms:this.props.userFandoms})
      })
      }else{
        this.setState({userFandoms:this.props.userFandoms})
      }
  }

  componentWillUnmount(){
    this.props.onGetUserFandoms(this.props.userEmail)
  }

  markFavoriteFandom = (fandom,userEmail) =>{
    console.log('markFavoriteFandom')
    console.log('fandom,userEmail',fandom,userEmail)
    console.log('fandom,userEmail',fandom,userEmail)
    console.log('this.props.userFandoms',this.props.userFandoms)
    console.log('this.state.userFandoms',this.state.userFandoms)
    let isExsist = this.state.userFandoms.includes(fandom) ? true : false;
    let userFandoms = [...this.state.userFandoms];

    
    this.props.onAddFandomToUserFavorite(userEmail,fandom,!isExsist).then(()=>{
      console.log('here 111')
      if(isExsist){
        userFandoms = userFandoms.filter(f => {return f !== fandom});
        console.log('isAdd:',isExsist)
        console.log('userFandoms:',userFandoms)
      }else{
        userFandoms.push(fandom)
        console.log('isAdd:',isExsist)
        console.log('userFandoms:',userFandoms)
      }    
      this.setState({userFandoms})
    })
  }

  render(){
      const {fandoms,isAuthenticated,userEmail,size,smallSize,loading} = this.props;
      const {userFandoms} = this.state;
      let page =  null;
      if(!loading){
        if(fandoms.length === 0||fandoms ===null){
            page = (
              <div>
                <p>There Are No Fandoms On Your List - Please Add at least one</p>             
              </div>
            )
        }else{
            const sortedFandomList = fandoms.sort((a, b) => a.FandomName.localeCompare(b.FandomName))
            page = (<ShowFandomData fandoms={sortedFandomList} screenSize={size} smallSize={smallSize} hadButtons={false} userFandoms={userFandoms}
                                    userEmail={userEmail} isAuthenticated={isAuthenticated} markFavFandom={this.markFavoriteFandom} 
                                    boxContent={<BoxContent />}/>)
                    
        }
      }
  
      return(<Container header='All Fandoms'>{ loading ?<Spinner/> : <React.Fragment>{page}</React.Fragment> }</Container>)
    }
}

const mapStateToProps = state =>{
    return{
        fandoms:          state.fandoms.fandoms,
        message:          state.fandoms.message,
        userFandoms:      state.fandoms.userFandoms,
        loading:          state.fandoms.loading,
        size:             state.screenSize.size,
        smallSize:        state.screenSize.smallSize,
        userEmail:        state.auth.user.email,
        isAuthenticated:  state.auth.isAuthenticated,
    };   
  }
  
  const mapDispatchedToProps = dispatch =>{
    return{
        onGetUserFandoms:           (userEmail)               =>  dispatch(actions.getUserFandoms(userEmail)),   
        onAddFandomToUserFavorite:  (userEmail,fandom,status)  =>  dispatch(actions.addFandomToUserFavorite(userEmail,fandom,status)),   
    }
}  
  

export default connect(mapStateToProps,mapDispatchedToProps)(AllFandoms);