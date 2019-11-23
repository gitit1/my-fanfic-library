import React from 'react';
import Card from '@material-ui/core/Card';
import GridList from '@material-ui/core/GridList';

import './ShowFandomData.scss'


const ShowFandomData = (props) => {
    const {smallSize,screenSize,fandoms,editFandom,deleteFandom,isAuthenticated,userEmail,markFavFandom,changeImage,changeImageFlag,userFandoms} = props;

    const cellHeight = (props.cellHeight && !smallSize) ? props.cellHeight : smallSize ? 300 : props.cellHeight ?   props.cellHeight : 400;
    let length = fandoms.length;
    const cols = (screenSize==='l') ? 3 : (screenSize==='m') ? 2 : 1;

    return(
        <React.Fragment>
            <div className='fandoms' style={!smallSize ? {width:'90%'} : {width:'100%'}}>
                <GridList cellHeight={cellHeight} className='fandoms_grid' cols={cols}>
                    {fandoms.map(fandom=>(
                        <Card className='fandoms_card fandoms_fandom' key={fandom.FandomName} onMouseOver={()=>changeImage(1,fandom.FandomName)} 
                              onMouseOut={()=>changeImage(0,fandom.FandomName)} >
                            {React.cloneElement(props.boxContent,{fandom:fandom,smallSize:smallSize,height:cellHeight,editFandom:editFandom,deleteFandom:deleteFandom,
                                                                  userFandoms,isAuthenticated:isAuthenticated,userEmail:userEmail,markFavFandom:markFavFandom,changeImageFlag:changeImageFlag})}
                        </Card>
                    ))} 

                    {( !smallSize && (length>cols && (length%cols!==0) && ((length-(Math.floor(length/cols)*cols)<=1)) ) ) && <Card className='fandoms_card fandoms_fandom fandoms_dummy' />}
                    {( !smallSize && (length>cols && (length%cols!==0) && ((length-(Math.floor(length/cols)*cols)===1||length-(Math.floor(length/cols)*cols)===2)) ) ) && <Card className='fandoms_card fandoms_fandom fandoms_dummy' />}
                </GridList>
            </div>
        </React.Fragment>  
    )
};

export default ShowFandomData;