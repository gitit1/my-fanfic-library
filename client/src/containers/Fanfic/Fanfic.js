import React,{Component} from 'react';
import {connect} from 'react-redux';
import queryString from 'query-string';

import classes from './Fanfic.module.css';

import * as actions from '../../store/actions';

import Container from '../../components/UI/Container/Container';


class Fanfic extends Component{
    state={
        fanfics:[],
        pageNumber:1,
        pageLimit:20
    }


    componentWillMount(){
        const {pageNumber,pageLimit} = this.state
        const FanficsId = queryString.parse(this.props.location.search).FanficsId;
        const FandomName = this.props.match.params.FandomName;
        console.log()
        this.props.onGetFanfics(FandomName,FanficsId,pageNumber,pageLimit).then(res=>(
            console.log(res)
        ))
    }



    render(){
        return(
            <Container header={this.props.match.params.FandomName}>
                <p>hello</p>
            </Container>
        )
    }
}

const mapStateToProps = state =>{
    return{
        fanfics:    state.fanfics.fanfics,
        message:    state.fanfics.message,
        loading:    state.fanfics.loading
    };   
  }
  
const mapDispatchedToProps = dispatch =>{
    return{
        onGetFanfics:    (FandomName,FanficsId,pageNumber,pageLimit) => dispatch(actions.getFanficsFromDB(FandomName,FanficsId,pageNumber,pageLimit)),
    };
}
  
  export default connect(mapStateToProps,mapDispatchedToProps)(Fanfic);