import React,{Component} from 'react';
import {connect} from 'react-redux';
import queryString from 'query-string';

import classes from './Fanfic.module.css';

import * as actions from '../../store/actions';

import Container from '../../components/UI/Container/Container';
import Spinner from '../../components/UI/Spinner/Spinner';


class Fanfic extends Component{
    state={
        fanfics:[],
        pageNumber:1,
        pageLimit:4
    }


    componentWillMount(){
        const {pageNumber,pageLimit} = this.state
        //const FanficsId = queryString.parse(this.props.location.search).FanficsId;
        const FandomName = this.props.match.params.FandomName;
        
        this.props.onGetFanfics(FandomName,pageNumber,pageLimit).then(res=>(
            console.log(res)
        ))
    }



    render(){
        let page = null
        page = this.props.loading ? <Container header={this.props.match.params.FandomName}><Spinner/></Container> : (
            <Container header={this.props.match.params.FandomName}>
                {this.props.fanfics.map((fanfic,index)=>(
                    <p key={fanfic.FanficID}>{index+1} - {fanfic.FanficTitle}</p>
                ))}
            </Container>
        )
        return(
            page
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
        onGetFanfics:    (FandomName,pageNumber,pageLimit) => dispatch(actions.getFanficsFromDB(FandomName,pageNumber,pageLimit)),
    };
}
  
  export default connect(mapStateToProps,mapDispatchedToProps)(Fanfic);