import React,{Component} from 'react';
import {connect} from 'react-redux';

import * as actions from '../../store/actions';

import './style/Layout.scss';
import Header from './components/Header';
import Footer from './components/Footer';

class Layout extends Component{
    state = {
        loading:true,
        lastUpdateDate:null
    }
    componentDidMount(){
        this.props.onGetFandoms().then(()=>{
            this.props.onGetLastUpdateDate().then(lastUpdateDate=>{
                this.setState({loading:false,lastUpdateDate:Number(lastUpdateDate)})
            })
        })
    }

    logoutHandler = () =>{
        this.props.onLogout()
    }

    render(){
        let page = this.state.loading ? null :(
            <div className='layout'>
                <header>
                    <Header auth={this.props.auth} logout={()=>this.logoutHandler()}/>
                </header>
                <main>
                    {this.props.children}
                </main>
                <footer>
                    <Footer lastUpdateDate={this.state.lastUpdateDate}/>
                </footer>
            </div>
        )
        return(
            page
        )
    }
};



const mapStateToProps = state =>{
    return{
        fandoms:        state.fandoms.fandoms,
        loading:        state.fandoms.loading,
        auth:           state.auth
    };   
}
  
const mapDispatchedToProps = dispatch =>{
    return{
        // initFandom:     () => dispatch(actions.fandomInit()),
        onGetFandoms:           ()      =>      dispatch(actions.getFandomsFromDB()),
        onGetLastUpdateDate:    ()      =>      dispatch(actions.getLastUpdateDate()),
        onLogout:               ()      =>      dispatch(actions.logoutUser())
    };
}

export default connect(mapStateToProps,mapDispatchedToProps)(Layout);