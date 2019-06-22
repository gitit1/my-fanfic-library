import React,{Component} from 'react';
import {connect} from 'react-redux';
import ReactPaginate from 'react-paginate';
// import queryString from 'query-string';

import classes from './Fanfic.module.css';

import * as actions from '../../store/actions';

import Container from '../../components/UI/Container/Container';
import Spinner from '../../components/UI/Spinner/Spinner';

import ShowFanficData from './ShowFanficData/ShowFanficData';

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

    componentWillReceiveProps(nextProps) {
        let pre = JSON.stringify(this.props.payload)
        let next = JSON.stringify(nextProps.payload)
        if (pre !== next) {
          this.setState({pageNumber: 0})
        }
      }

    getFanfics = async () =>{
        const {pageNumber,pageLimit} = this.state
        console.log('pageNumber: ',pageNumber)
        const {fandoms,fanfics,onGetFandoms,onGetFanfics} = this.props
        const fandomName = this.props.match.params.FandomName;
        
        (fandoms.length===0) &&  await onGetFandoms();
        await onGetFanfics(fandomName,pageNumber,pageLimit).then(async ()=>{
            let fanficsCount = fandoms.filter(fandom=> (fandomName===fandom.FandomName))[0].FanficsInFandom;
            this.setState({pageCount:Math.ceil(fanficsCount/pageLimit)})
        });

        return null
    }

    handlePageClick = async (data ) =>{
        let selected = data.selected;
        console.log('selected:',selected)
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
                disableInitialCallback={ true }
                />
                <ShowFanficData fanfics={this.props.fanfics}/>
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