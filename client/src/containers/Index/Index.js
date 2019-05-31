import React,{Component} from 'react';
import classes from './Index.module.css';
import IndexFandoms from './IndexFandoms/IndexFandoms'
class Index extends Component{
    render(){

        return(
            <div className={classes.Index}>
                <section className={[classes.IndexFandoms, classes.Box].join(' ')}>
                    <h3 className={classes.Heading}>Fandoms</h3>
                    <IndexFandoms />
                </section>
                <section className={[classes.LatestUpdates, classes.Box].join(' ')}>
                    <h3 className={classes.Heading}>Latest Updates</h3>
                </section>
                <section className={[classes.InProgress, classes.Box].join(' ')}>
                    <h3 className={classes.Heading}>Fanfics In Progress</h3>
                </section>
                <section className={[classes.MyLatestActivity, classes.Box].join(' ')}>
                    <h3 className={classes.Heading}>My Latest Activities</h3>
                </section>
            </div>
        )
    }
}

export default Index;