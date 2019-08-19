import React from 'react';
import {Link} from 'react-router-dom';

import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';
import GridList from '@material-ui/core/GridList';
import Typography from '@material-ui/core/Typography';

const IndexFandoms = (props) => (
    <Grid container >
        <Grid item xs={12}>
          <p>There are {props.numOfFandoms} Fandoms on site</p>
        </Grid>
      <GridList component="div"  cols={props.cols} cellHeight={100} className="index_section_fandoms">  
        {
          props.fandoms.map(fandom=>
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
        {( !props.smallSize && (props.fandoms.length>props.cols && (props.fandoms.length%props.cols!==0) && ((props.fandoms.length-(Math.floor(props.fandoms.length/props.cols)*props.cols)<=1)) ) ) && <Box className='index_section_fandom index_section_fandom_dummy' />}
        {( !props.smallSize && (props.fandoms.length>props.cols && (props.fandoms.length%props.cols!==0) && ((props.fandoms.length-(Math.floor(props.fandoms.length/props.cols)*props.cols)===1||props.fandoms.length-(Math.floor(props.fandoms.length/props.cols)*props.cols)===2)) ) ) && <Box className='index_section_fandom index_section_fandom_dummy' />}       
      </GridList>
      {props.numOfFandoms>9 && <Grid item xs={12}><Link to={`/fandoms`}>See All</Link></Grid>}
    </Grid>
);

export default IndexFandoms;

