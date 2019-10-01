import React,{Component} from 'react';
import {connect} from 'react-redux';
import * as actions from '../../../store/actions';

import Spinner from '../../../components/UI/Spinner/Spinner';
import Container from '../../../components/UI/Container/Container';
import ShowReadingLists from './components/ShowReadingLists';
// import classes from './ReadingList.module.scss';

class ReadingList extends Component{
  state = {
    loadingState:false,
    imageFlag:false,
    imageRlID:null
  }

  componentWillMount(){this.getFanfics()}

  getFanfics = async () =>{
      const {userEmail,onGetReadingList,readingLists} = this.props;
      readingLists.length===0 && await onGetReadingList(userEmail)
      return null
  }
  
  goToFanfics = (name) => {
    this.props.history.push(`/fanfics/${name}?list=true`);
  }

  deleteReadingList = (name) =>{
    console.log('deleteReadingList')
    const {onDeleteReadingList,onGetReadingList,userEmail} = this.props;
    this.setState({loading:true})
    onDeleteReadingList(userEmail,name).then(()=>{
      onGetReadingList(userEmail).then(()=>this.setState({loading:false}))
    })
  }

  toggleImage = (id) =>{
    this.setState({imageFlag:!this.state.imageFlag,imageRlID:id})
  }
  render(){
    const {loading,readingLists,userEmail} = this.props;
    const {imageFlag,imageRlID} = this.state;
    return(
        <Container header='Reading List'>
            { loading&&this.state.loadingState ?
                      <Spinner/>
                      :
                      <div className='ReadingList'>
                        {/* <Button>Add New Reading List</Button> */}
                        <ShowReadingLists readingLists={readingLists} 
                                          userEmail={userEmail} 
                                          deleteReadingList={this.deleteReadingList}
                                          goToFanfics={this.goToFanfics}
                                          toggleImage={this.toggleImage}
                                          imageFlag={imageFlag}
                                          imageRlID={imageRlID}
                        />   
                      </div>
            }
        </Container>
    )
  }

};
const mapStateToProps = state =>{
  return{
    userEmail:          state.auth.user.email,
    loading:            state.fanfics.loading,
    readingLists:       state.fanfics.readingListsFull,
  };   
}

const mapDispatchedToProps = dispatch =>{
  return{
    onGetReadingList:           (userEmail) =>  dispatch(actions.getReadingList(userEmail)),
    onDeleteReadingList:        (userEamil,name) => dispatch(actions.deleteReadingList(userEamil,name))
  };
}

export default connect(mapStateToProps,mapDispatchedToProps)(ReadingList);

