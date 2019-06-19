import React,{Component} from 'react';
import {connect} from 'react-redux';
import ReactPaginate from 'react-paginate';
// import queryString from 'query-string';

import classes from './Fanfic.module.css';

import * as actions from '../../store/actions';

import Container from '../../components/UI/Container/Container';
import Spinner from '../../components/UI/Spinner/Spinner';


class Fanfic extends Component{
    state={
        fanfics:[],
        pageNumber:1,
        pageLimit:20,
        pageCount: 0
    }


    componentWillMount(){     
        this.getFanfics()
    }

    getFanfics = async () =>{
        const {pageNumber,pageLimit} = this.state
        console.log('pageNumber: ',pageNumber)
        const {fandoms,fanfics,onGetFandoms,onGetFanfics} = this.props
        const FandomName = this.props.match.params.FandomName;
        
        (fandoms.length===0) &&  await onGetFandoms();
        await onGetFanfics(FandomName,pageNumber,pageLimit).then(async ()=>{
            let fanficsCount = fandoms.filter(fandom=> (FandomName===fandom.FandomName))[0].FanficsInFandom;
            this.setState({pageCount:Math.ceil(fanficsCount/pageLimit)})
        });

        return null
    }

    handlePageClick = async (data ) =>{
        let selected = data.selected;
        selected!==0 && selected++
        await this.setState({pageNumber:selected},await this.getFanfics)       
        return
    }
    render(){
        let page = null
        page = this.props.loading ? <Container header={this.props.match.params.FandomName}><Spinner/></Container> : (
            <Container header={this.props.match.params.FandomName}>
                <ReactPaginate
                previousLabel={'previous'}
                nextLabel={'next'}
                breakLabel={'...'}
                breakClassName={'break-me'}
                pageCount={this.state.pageCount}
                marginPagesDisplayed={2}
                pageRangeDisplayed={8}
                onPageChange={this.handlePageClick}
                containerClassName={classes.Pagination}
                subContainerClassName={'pages pagination'}
                activeClassName={'active'}
                />
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
        fandoms:    state.fandoms.fandoms,
        fanfics:    state.fanfics.fanfics,
        message:    state.fanfics.message,
        loading:    state.fanfics.loading
    };   
  }
  
const mapDispatchedToProps = dispatch =>{
    return{
        onGetFandoms:    () => dispatch(actions.getFandomsFromDB()),
        onGetFanfics:    (FandomName,pageNumber,pageLimit) => dispatch(actions.getFanficsFromDB(FandomName,pageNumber,pageLimit))
    };
}
  
  export default connect(mapStateToProps,mapDispatchedToProps)(Fanfic);