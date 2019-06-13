import React,{Component} from 'react';
import {connect} from 'react-redux';

import * as actions from '../../store/actions';

import classes from './Layout.module.css';
import Header from './Header/Header';
import Footer from './Footer/Footer';

class Layout extends Component{
    componentDidMount(){
        if(this.props.fandoms.length===0){this.props.onGetFandoms()}  
    }

    render(){
        return(
            <div className={classes.Layout}>
                <header className={classes.Header}>
                    <Header/>
                </header>
                <main className={classes.Main}>
                    {this.props.children}
                </main>
                <footer className={classes.Footer}>
                    <Footer/>
                </footer>
            </div>
        )
    }
};



const mapStateToProps = state =>{
    return{
        fandoms:        state.fandoms.fandoms
    };   
}
  
const mapDispatchedToProps = dispatch =>{
    return{
        // initFandom:     () => dispatch(actions.fandomInit()),
        onGetFandoms:       ()                                  =>      dispatch(actions.getFandomsFromDB()),
    };
}

export default connect(mapStateToProps,mapDispatchedToProps)(Layout);