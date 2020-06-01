import React from 'react';
import Button from '../../../../../../components/UI/Button/Button';
import Spinner from '../../../../../../components/UI/Spinner/Spinner';
import ShowFanficData from './components/showFanficData/showFanficData'

const GetFanficData = ({fanfic,size,showUserData,loadingFlag,loading,showData,userData,showSaveButton,savedData
                        ,similarFanfic,msg,saveFanficData,markStatus,toggleChapterB,markAs,inputCategoryFlag,
                        showSelectCategory,showCategory,getCategories,saveCategories,categoriesTemp,fileReaderFlag}) => {
                            
    const showFanfic = (similarFanfic!==null && similarFanfic.FanficID===fanfic.FanficID) ? similarFanfic : fanfic;
    return (
        <React.Fragment>
            { (loading) ?
                <Spinner/>
                :
                (!loadingFlag && showData) && 
                <React.Fragment>
                    <div className='GetFanficData_data_box'>
                    <ShowFanficData fanfic={showFanfic} size={size} showUserData={showUserData} userData={userData}
                                    markAs={markAs} markStatus={markStatus} toggleChapterB={toggleChapterB}
                                    getCategories={getCategories} inputCategoryFlag={inputCategoryFlag} showSelectCategory={showSelectCategory}
                                    showCategory={showCategory} saveCategories={saveCategories} categoriesTemp={categoriesTemp}/>
                    </div> 
                    {showSaveButton && (similarFanfic===null) && 
                    <div className='GetFanficData_buttons'>
                        <Button color="primary" clicked={()=>saveFanficData(true)}>Save</Button>
                    </div> 
                }
                </React.Fragment> 
                    
            } 
            {
                (similarFanfic!==null && showData && !savedData) &&
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
                            <ShowFanficData fanfic={similarFanfic} size={size} showUserData={showUserData}  userData={userData}/> 
                            <br/>
                            <br/>
                            <br/>
                            { !fileReaderFlag && <>
                                <p style={{color:'red'}}><b>Are you sure you want to save it?</b></p>
                                <Button color="primary" clicked={()=>saveFanficData(true)}>Yes</Button>
                                <Button color="secondary" clicked={()=>saveFanficData(false)}>No</Button>
                            </>}
                        </div>
                    }
                </React.Fragment>
                
            }
            {msg}
        </React.Fragment>
    )
};



export default GetFanficData;