import React from 'react';
import Card from '@material-ui/core/Card';
import GridList from '@material-ui/core/GridList';

import './ShowFandomData.scss'


const ShowFandomData = (props) => {
    const {screenSize,fandoms,editFandom,deleteFandomHandler} = props;

    const cellHeight = (props.cellHeight && !(screenSize==='s')) ? props.cellHeight : (screenSize==='s') ? 300 : props.cellHeight ?   props.cellHeight : 400;
    let length = fandoms.length;
    const cols = (screenSize==='l') ? 3 : (screenSize==='m') ? 2 : 1;

    return(
        <React.Fragment>
            <div className='fandoms' style={(screenSize==='l'||screenSize==='m') ? {width:'90%'} : {width:'100%'}}>
                <GridList cellHeight={cellHeight} className='fandoms_grid' cols={cols}>
                    {fandoms.map(fandom=>(
                        <Card className='fandoms_card fandoms_fandom' key={fandom.FandomName} >
                            {React.cloneElement(props.boxContent,{fandom:fandom,screenSize:screenSize,height:cellHeight,editFandom:editFandom,deleteFandomHandler:deleteFandomHandler})}
                        </Card>
                    ))} 
                    {( (screenSize==='l'||screenSize==='m') && (length>cols && (length%cols!==0) && ((length-(Math.floor(length/cols)*cols)<=1)) ) ) && <Card className='fandoms_card fandoms_fandom fandoms_dummy' />}
                    {( (screenSize==='l'||screenSize==='m') && (length>cols && (length%cols!==0) && ((length-(Math.floor(length/cols)*cols)===2)) ) ) && <Card className='fandoms_card fandoms_fandom fandoms_dummy' />}
                </GridList>
            </div>
        </React.Fragment>  
    )
};

export default ShowFandomData;