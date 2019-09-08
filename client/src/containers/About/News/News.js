import React from 'react';
import Container from '../../../components/UI/Container/Container';
import classes from './News.module.scss'
const News = () => (
  <Container header='News & Updates'>
    <div className={classes.News}>
        <p><span className={classes.Date}><strong>09-07-2019:</strong></span><span className={classes.Content}>"Login" and "Registrer" Pages got Design</span></p>
        <p><span className={classes.Date}><strong>09-08-2019:</strong></span><span className={classes.Content}>Added "Fandom Universe" attribute to Fandoms on site</span></p>
    </div>
  </Container>
);

export default News;