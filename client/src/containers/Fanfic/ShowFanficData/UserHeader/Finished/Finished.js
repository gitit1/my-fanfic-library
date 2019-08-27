import React from 'react';
import Button from '@material-ui/core/Button';

const Finished = (props) => {
    const {isFinished} = props;
    const {markStatus} = props.props;
    const {FanficID,Author,FanficTitle,Source} = props.fanfic;

    return(
        <div  className={isFinished[0]}>
            <Button  onClick={() =>markStatus(FanficID,Author,FanficTitle,Source,'Finished',isFinished[2])} 
                    color='primary' className={isFinished[1] ? 'userData_green' : null}>
                        {isFinished[1] ? 'Finished' : 'Mark As Finished'}
            </Button>                                
        </div>
    )
};

export default Finished;
