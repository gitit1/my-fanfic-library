import React from 'react';
import Button from '../../../../../../components/UI/Button/Button';
import Spinner from '../../../../../../components/UI/Spinner/Spinner';
import ShowFanficData from './components/showFanficData/showFanficData'

const GetFanficData = ({fanfic,size,showUserData,loadingFlag,loading,showData,userData,showSaveButton
                        ,similarFanfic,msg,saveFanficData,markStatus,toggleChapterB,markAs}) => {
    return (
        <React.Fragment>
            { (loading) ?
                <Spinner/>
                :
                (!loadingFlag && showData) && 
                <React.Fragment>
                    <ShowFanficData fanfic={fanfic} size={size} showUserData={showUserData} userData={userData}
                                    markAs={markAs} markStatus={markStatus} toggleChapterB={toggleChapterB}/>
                    {showSaveButton && (similarFanfic===null) && <Button color="primary" clicked={()=>saveFanficData(true)}>Save</Button>}
                </React.Fragment> 
                    
            } 
            {
                (similarFanfic!==null && showData) &&
                <React.Fragment>
                    {
                    similarFanfic.FanficID===fanfic.FanficID
                        ? <p>This Fanfic already Saved!</p>
                        : <div className='addNewFanfic_similar_fanfics'>
                            <br/>
                            <p style={{color:'red'}}><b>Found similar fanfic that is already in the DB:</b></p>
                            <br/>
                            <br/>
                            <br/>
                            <ShowFanficData fanfic={similarFanfic} size={size} showUserData={showUserData}/> 
                            <br/>
                            <br/>
                            <br/>
                            <p style={{color:'red'}}><b>Are you sure you want to save it?</b></p>
                            <Button color="primary" clicked={()=>saveFanficData(true)}>Yes</Button>
                            <Button color="secondary" clicked={()=>saveFanficData(false)}>No</Button>
                        </div>
                    }
                </React.Fragment>
                
            }
            {msg}
        </React.Fragment>
    )
};



export default GetFanficData;