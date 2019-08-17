import React,{Component} from 'react';
import {connect} from 'react-redux';

import * as actions from '../../store/actions';

import './Layout.scss';
import Header from './components/Header/Header';
import Footer from './components/Footer/Footer';

class Layout extends Component{
    state = {
        loading:true,
        lastUpdateDate:null,
        xs: 400,
        s: 736,
        xm: 935,
        m: 1200,
        l: 1500
    }

    componentDidMount(){
        this.props.onGetFandoms().then(()=>{
            this.props.onGetLastUpdateDate().then(lastUpdateDate=>{
                this.setState({loading:false,lastUpdateDate:Number(lastUpdateDate)})
            })
        })
        this.handleResize();
        window.addEventListener('resize', this.handleResize)
    }

    componentWillUnmount() {
        window.removeEventListener('resize', this.handleResize)
    }

    logoutHandler = () =>{
        this.props.onLogout();
    }

    handleResize = () => {
        const {medSize,mobileSize,xs,s,xm,m,l} = this.state;
        let screenSize = window.innerWidth;
        let size = (screenSize>l) ? 'l' : (screenSize>m) ? 'm' : (screenSize>xm) ? 'xm' : (screenSize>m) ? 'm' : (screenSize>s) ? 's' : 'xs'
        this.props.onSaveScreenSize(size)
    }
    render(){
        console.log('size:',this.props.size)
        let page = this.state.loading ? null :(
            <div className='layout'>
                <header>
                    <Header auth={this.props.auth} logout={()=>this.logoutHandler()} size={this.props.size}/>
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
        auth:           state.auth,
        size:           state.screenSize.size
    };   
}
  
const mapDispatchedToProps = dispatch =>{
    return{
        // initFandom:     () => dispatch(actions.fandomInit()),
        onGetFandoms:           ()      =>      dispatch(actions.getFandomsFromDB()),
        onGetLastUpdateDate:    ()      =>      dispatch(actions.getLastUpdateDate()),
        onLogout:               ()      =>      dispatch(actions.logoutUser()),
        onSaveScreenSize:       (size)  =>      dispatch(actions.saveScreenSize(size))
    };
}

export default connect(mapStateToProps,mapDispatchedToProps)(Layout);