import React,{Component} from 'react';
import {connect} from 'react-redux';
import * as actions from '../../../store/actions';

import Spinner from '../../../components/UI/Spinner/Spinner';
import Container from '../../../components/UI/Container/Container';
import Button from '../../../components/UI/Button/Button';
import ShowReadingLists from './components/ShowReadingLists';
import classes from './ReadingList.module.scss';

class ReadingList extends Component{
  

  componentWillMount(){this.getFanfics()}

  getFanfics = async () =>{
      const {userEmail,onGetReadingList} = this.props
      await onGetReadingList(userEmail)
      return null
  }
  
  render(){
    const {loading,readingLists} = this.props;
    return(
        <Container header='Reading List'>
            { loading ?
                      <Spinner/>
                      :
                      <div className='ReadingList'>
                        <Button>Add New Reading List</Button>
                        <ShowReadingLists readingLists={readingLists}/>   
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

  };
}

export default connect(mapStateToProps,mapDispatchedToProps)(ReadingList);

