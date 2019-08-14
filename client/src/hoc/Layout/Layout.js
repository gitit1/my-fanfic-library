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
        mobileSize: 736,
        medSize:1000
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
        const {medSize,mobileSize} = this.state
        let screenSize = window.innerWidth;
        let size =  (screenSize>medSize) ? 'l' : (screenSize>mobileSize) ? 'm' : 's'  
        this.props.onSaveScreenSize(size)
    }
    render(){
        console.log('size:',this.state.size)
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
        auth:           state.auth,
        size:           state.sceenSize.size
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