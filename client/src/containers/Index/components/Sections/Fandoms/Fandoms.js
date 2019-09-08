import React from 'react';
import {Link} from 'react-router-dom';

import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';
import GridList from '@material-ui/core/GridList';
import Typography from '@material-ui/core/Typography';

const IndexFandoms = (props) => {
  const {userFandoms,fandoms,screenSize} = props; let shuffledFandoms = [],cols=0;
  const userHaveFandoms = (userFandoms!==null && userFandoms.length!==0) ? true :false;
  const seeMore = userHaveFandoms ? userFandoms.length : props.numOfFandoms

  if(userHaveFandoms){
    shuffledFandoms = userFandoms.sort(() => 0.5 - Math.random());
    shuffledFandoms = fandoms.filter(fandom=>{
      return userFandoms.includes(fandom.FandomName)
    })
    cols = (userFandoms.length < 6||screenSize==='m'|screenSize==='xm') ? 3 : screenSize!=='l' ? 1 : 4;
  }else{
    shuffledFandoms = fandoms.sort(() => 0.5 - Math.random());
    cols = (fandoms.length < 6||screenSize==='m'|screenSize==='xm') ? 3 : screenSize!=='l' ? 1 : 4;
  }
  console.log('cols:',cols)
  const selectedFandoms = (screenSize==='m'|screenSize==='xm') ? shuffledFandoms.slice(0, 6) : screenSize!=='l' ? shuffledFandoms.slice(0, 3) : shuffledFandoms.slice(0, 9);
  const fandomsArray = selectedFandoms.sort((a, b) => a.FandomName.localeCompare(b.FandomName));
  
    //IndexFandoms

    
  return(
    <Grid container >
        <Grid item xs={12}>
          { userHaveFandoms
            ? <p>You have {userFandoms.length} Favorite Fandoms</p>
            : <p>There are {props.numOfFandoms} Fandoms on site</p>
          }
          
        </Grid>
      <GridList component="div"  cols={cols} cellHeight={100} className="index_section_fandoms">  
        {
          fandomsArray.map(fandom=>
            <Box key={fandom.FandomName} className="index_section_fandom">
              <Link to={`/fanfics/${fandom.FandomName}`}>
                <img  alt={'fandoms'} src={fandom.Image_Name_Icon !== '' 
                                            ? `/fandoms/${fandom.FandomName.toLowerCase()}/${fandom.Image_Name_Icon}`
                                            : fandom.Image_Name_Main !== '' ? `/fandoms/${fandom.FandomName.toLowerCase()}/${fandom.Image_Name_Main}` : `/fandoms/nophoto.png`} />
                <Typography gutterBottom variant="body2" component="p" className='index_section_overlay'>{fandom.FandomName}</Typography>
              
              </Link>
            </Box>
          )
        } 
        {/* {( !props.smallSize && (props.fandoms.length>props.cols && (props.fandoms.length%props.cols!==0) && ((props.fandoms.length-(Math.floor(props.fandoms.length/props.cols)*props.cols)<=1)) ) ) && <Box className='index_section_fandom index_section_fandom_dummy' />} */}
        {/* {( !props.smallSize && (props.fandoms.length>props.cols && (props.fandoms.length%props.cols!==0) && ((props.fandoms.length-(Math.floor(props.fandoms.length/props.cols)*props.cols)===1||props.fandoms.length-(Math.floor(props.fandoms.length/props.cols)*props.cols)===2)) ) ) && <Box className='index_section_fandom index_section_fandom_dummy' />}        */}
      </GridList>
      {seeMore>9 && <Grid item xs={12}><Link to={`/fandoms`}>See All</Link></Grid>}
    </Grid>
  )
};

export default IndexFandoms;

