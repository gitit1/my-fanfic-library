import React from 'react';
import Container from '../../../components/UI/Container/Container';
import classes from './News.module.scss'
const News = () => (
  <Container header='News & Updates'>
    <div className={classes.News}>
        <p><span className={classes.Date}><strong>09-07-2019:</strong></span><span className={classes.Content}>[001-git] "Login" and "Registrer" Pages got Design</span></p>
        <p><span className={classes.Date}><strong>09-08-2019:</strong></span><span className={classes.Content}>[002-git] Added "Fandom Universe" attribute to Fandoms on site</span></p>
        <p><span className={classes.Date}><strong>09-08-2019:</strong></span><span className={classes.Content}>[003-git] Added "Favorite" Fandom mark</span></p>
        <p><span className={classes.Date}></span>&nbsp;</p>
        <p><span className={classes.Date}><strong>09-09-2019:</strong></span><span className={classes.Content}>[004-git] Added First Information + design to "About.js"</span></p>
        <p><span className={classes.Date}><strong>09-09-2019:</strong></span><span className={classes.Content}>[005-git] Design and finished Funcionality for "Contact-Us.js"</span></p>
        <p><span className={classes.Date}></span>&nbsp;</p>
        <p><span className={classes.Date}><strong>09-10-2019:</strong></span><span className={classes.Content}>[006-git] Made the user tags linkble (can filter by them)</span></p>
        <p><span className={classes.Date}><strong>09-10-2019:</strong></span><span className={classes.Content}>[007-git] Fix some issue that with filters and url Queries</span></p>
        <p><span className={classes.Date}><strong>09-10-2019:</strong></span><span className={classes.Content}>[008-git] Redesign the Filter Drewer in Fanfic page</span></p>
        <p><span className={classes.Date}></span>&nbsp;</p>
        <p><span className={classes.Date}><strong>09-13-2019:</strong></span><span className={classes.Content}>[009-git] Added images options to fanfics (still no functionality)</span></p>
        <p><span className={classes.Date}><strong>09-13-2019:</strong></span><span className={classes.Content}>[009-git] Added switches to toggle between difference part in the fanfic component</span></p>
        <p><span className={classes.Date}><strong>09-13-2019:</strong></span><span className={classes.Content}>[010-git] Added New Filter: "search for only new fanfics (no user data yet)"</span></p>
        <p><span className={classes.Date}></span>&nbsp;</p>
        <p><span className={classes.Date}><strong>09-14-2019:</strong></span><span className={classes.Content}>[011-git] Changed the way the DB saves the images</span></p>
        <p><span className={classes.Date}><strong>09-14-2019:</strong></span><span className={classes.Content}>[012-git] Created randomize color for fanfics with general image</span></p>
        <p><span className={classes.Date}><strong>09-14-2019:</strong></span><span className={classes.Content}>[013-git] Added switch "Show Marked Stories" in fandom.js  instead of the filter</span></p>
        <p><span className={classes.Date}><strong>09-14-2019:</strong></span><span className={classes.Content}>[014-git] Added functionality for "Add Image" button in fanfic.js</span></p>
        <p><span className={classes.Date}></span>&nbsp;</p>
        <p><span className={classes.Date}><strong>09-17-2019:</strong></span><span className={classes.Content}>[015-git] Fixed "Show marked stories sort" on the switch in fanfic.js</span></p>
        <p><span className={classes.Date}><strong>09-17-2019:</strong></span><span className={classes.Content}>[016-git] Added a responisive design to add new fanfic manually page</span></p>
        <p><span className={classes.Date}></span>&nbsp;</p>
        <p><span className={classes.Date}><strong>09-20-2019:</strong></span><span className={classes.Content}>[017-git] Added series to addNewFanficManually + fix bug in button "add another one" || added first design to gallery view</span></p>
        <p><span className={classes.Date}></span>&nbsp;</p>
        <p><span className={classes.Date}><strong>09-20-2019:</strong></span><span className={classes.Content}>[018-git] fix another bug in button "add another one"</span></p>
        <p><span className={classes.Date}></span>&nbsp;</p>
        <p><span className={classes.Date}><strong>09-22-2019:</strong></span><span className={classes.Content}>[019-git] gallery view - made it look better</span></p>
        <p><span className={classes.Date}></span>&nbsp;</p>
        <p><span className={classes.Date}><strong>09-23-2019:</strong></span><span className={classes.Content}>[020-git] Edit fanfic for backup fanfics</span></p>
        <p><span className={classes.Date}></span>&nbsp;</p>
        <p><span className={classes.Date}><strong>09-27-2019:</strong></span><span className={classes.Content}>[021-git] Added "My Tracker" page with funcionality</span></p>
        <p><span className={classes.Date}></span>&nbsp;</p>
        <p><span className={classes.Date}><strong>09-28-2019:</strong></span><span className={classes.Content}>[022-git] Fixed ignore list count on fanfic pages.</span></p>
    </div>
  </Container>
);

export default News;