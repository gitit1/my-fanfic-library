import React from 'react';

import Grid from '@material-ui/core/Grid';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';

import './IndexContainer.scss';

const IndexContainer = (props) => (
  <Grid item sm={6} className='index_container' >
    <Card className='index_container_box'>
      <CardContent>
          <Typography gutterBottom variant="h5" component="h3">
          {props.header}
          </Typography>
        {props.children}  
      </CardContent>
    </Card>
  </Grid>
);

export default IndexContainer;