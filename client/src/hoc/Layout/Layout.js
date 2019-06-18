import React,{Component} from 'react';
import {connect} from 'react-redux';

import * as actions from '../../store/actions';

import classes from './Layout.module.css';
import Header from './Header/Header';
import Footer from './Footer/Footer';
import Spinner from '../../components/UI/Spinner/Spinner';

class Layout extends Component{
    componentDidMount(){
        this.uploadData()
    }

    uploadData = async () => {
        try {
            if(this.props.fandoms.length===0){await this.props.onGetFandoms()} 
            console.log('....')
        } catch(e) {
            console.warn(e);
        }
    }

    render(){
        return(
            <div className={classes.Layout}>
                <header className={classes.Header}>
                    <Header/>
                </header>
                {this.props.loading ? <Spinner/> : (
                    <main className={classes.Main}>
                        {this.props.children}
                    </main>
                )}
                <footer className={classes.Footer}>
                    <Footer/>
                </footer>
            </div>
        )
    }
};



const mapStateToProps = state =>{
    return{
        fandoms:        state.fandoms.fandoms,
        loading:        state.fandoms.loading
    };   
}
  
const mapDispatchedToProps = dispatch =>{
    return{
        // initFandom:     () => dispatch(actions.fandomInit()),
        onGetFandoms:       ()                                  =>      dispatch(actions.getFandomsFromDB()),
    };
}

export default connect(mapStateToProps,mapDispatchedToProps)(Layout);