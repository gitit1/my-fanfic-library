import React,{Component} from 'react';
import {connect} from 'react-redux';

import * as actions from '../../store/actions';

import classes from './Layout.module.css';
import Header from './Header/Header';
import Footer from './Footer/Footer';

class Layout extends Component{
    state = {
        loading:true,
        lastUpdateDate:null
    }
    componentDidMount(){
        this.props.onGetFandoms().then(()=>{
            this.props.onGetLastUpdateDate().then(lastUpdateDate=>{
                console.log('lastUpdateDate:::',lastUpdateDate)
                this.setState({loading:false,lastUpdateDate:Number(lastUpdateDate)})
            })
        })
    }

    render(){
        let page = this.state.loading ? null :(
            <div className={classes.Layout}>
                <header className={classes.Header}>
                    <Header lastUpdateDate={this.state.lastUpdateDate}/>
                </header>
                <main className={classes.Main}>
                    {this.props.children}
                </main>
                <footer className={classes.Footer}>
                    <Footer/>
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
    };   
}
  
const mapDispatchedToProps = dispatch =>{
    return{
        // initFandom:     () => dispatch(actions.fandomInit()),
        onGetFandoms:           ()      =>      dispatch(actions.getFandomsFromDB()),
        onGetLastUpdateDate:    ()      =>      dispatch(actions.getLastUpdateDate())
    };
}

export default connect(mapStateToProps,mapDispatchedToProps)(Layout);