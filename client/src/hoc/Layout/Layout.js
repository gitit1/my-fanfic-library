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
        l: 1499,
    }

    componentDidMount(){
        this.props.onGetFandoms().then(()=>{
            console.log('done')
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
        const {s,xm,m,l} = this.state;
        let screenSize = window.innerWidth;
        let size = (screenSize>l) ? 'l' : (screenSize>m) ? 'm' : (screenSize>xm) ? 'xm' : (screenSize>m) ? 'm' : (screenSize>s) ? 's' : 'xs';
        let smallSize = (screenSize<=s) ? true : false;
        this.props.onSaveScreenSize(size,smallSize)
    }
    render(){
        const {loading} = this.state;
        const {auth,children,size} = this.props;
        console.log('loading:',loading)
        let page = loading ? null :(
            <div className='layout'>
                <header>
                    <Header auth={auth} logout={()=>this.logoutHandler()} size={size}/>
                </header>
                <main>
                    {children}
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
        onSaveScreenSize:       (size,smallSize)  =>      dispatch(actions.saveScreenSize(size,smallSize))
    };
}

export default connect(mapStateToProps,mapDispatchedToProps)(Layout);