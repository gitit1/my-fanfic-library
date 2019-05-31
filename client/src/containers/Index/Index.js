import React,{Component} from 'react';
import classes from './Index.module.css';

class Index extends Component{
    render(){
        return(
            <div className={classes.Index}>
                <section className={classes.FavoriteFandoms}>Favorite Fandoms</section>
                <section className={classes.LatestUpdates}>Latest Updates</section>
                <section className={classes.InProgress}>In Progress</section>
                <section className={classes.MyLatestActivity}>My Latest Activity</section>
            </div>
        )
    }
}

export default Index;