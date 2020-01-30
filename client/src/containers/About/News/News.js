import React from 'react';
import Container from '../../../components/UI/Container/Container';
import classes from './News.module.scss';
import LazyLoad from 'react-lazyload';

const News = () => (
  <Container header='News & Updates'>
    <div className={classes.News}>
      <LazyLoad height={100} >
        <p><span className={classes.Date}><strong>01-26-2020:</strong></span><span className={classes.Content}>0004/feat/create_backup_cron_for_db</span></p>
        <p><span className={classes.Date}></span>&nbsp;</p>
      </LazyLoad>
      <LazyLoad height={100} >
        <p><span className={classes.Date}><strong>01-18-2020:</strong></span><span className={classes.Content}>0002/fix/when-mark-fanfic-the-became-white</span></p>
        <p><span className={classes.Date}><strong>01-18-2020:</strong></span><span className={classes.Content}>0001/feat/create_backup_cron_for_db</span></p>
        <p><span className={classes.Date}></span>&nbsp;</p>
      </LazyLoad>
      <LazyLoad height={100} >
        <p><span className={classes.Date}><strong>01-11-2020:</strong></span><span className={classes.Content}>[0001] fix downloder - get a03 fanfics</span></p>
        <p><span className={classes.Date}></span>&nbsp;</p>
      </LazyLoad>
      <LazyLoad height={100} >
        <p><span className={classes.Date}><strong>01-04-2020:</strong></span><span className={classes.Content}>[038-git] fix bug in saving resources (path string fix)</span></p>
        <p><span className={classes.Date}><strong>01-04-2020:</strong></span><span className={classes.Content}>[038-git] fix bug in reading list button</span></p>
        <p><span className={classes.Date}></span>&nbsp;</p>
      </LazyLoad>
      <LazyLoad height={100} >
        <p><span className={classes.Date}><strong>12-28-2019:</strong></span><span className={classes.Content}>[037-git] fix little bug in dashboard for new users</span></p>
        <p><span className={classes.Date}><strong>12-28-2019:</strong></span><span className={classes.Content}>[036-git] Added logs for downloader methods</span></p>
        <p><span className={classes.Date}></span>&nbsp;</p>
      </LazyLoad>
       <LazyLoad height={100} >
        <p><span className={classes.Date}><strong>12-27-2019:</strong></span><span className={classes.Content}>[035-git] split download fanfic method to 2 - partial and full</span></p>
        <p><span className={classes.Date}><strong>12-27-2019:</strong></span><span className={classes.Content}>[035-git] Added category - "Army/Solider"</span></p>
        <p><span className={classes.Date}></span>&nbsp;</p>
      </LazyLoad>
       <LazyLoad height={100} >
        <p><span className={classes.Date}><strong>12-03-2019:</strong></span><span className={classes.Content}>[034-git] Change Domain - www.myfanficslibrary.com</span></p>
        <p><span className={classes.Date}></span>&nbsp;</p>
      </LazyLoad>
      <LazyLoad height={100} >
          <p><span className={classes.Date}><strong>11-25-2019:</strong></span><span className={classes.Content}>[033-git] Added categories - "Mental Health"/"Prison"</span></p>
          <p><span className={classes.Date}><strong>11-25-2019:</strong></span><span className={classes.Content}>[033-git] Fix a bug in downloader (couldn't deal with spanish letters)</span></p>
          <p><span className={classes.Date}><strong>11-25-2019:</strong></span><span className={classes.Content}>[033-git] Added timeout for connection to easy on the scrapping</span></p>
          <p><span className={classes.Date}></span>&nbsp;</p>
        </LazyLoad>
      <LazyLoad height={100} >
          <p><span className={classes.Date}><strong>11-24-2019:</strong></span><span className={classes.Content}>[032-git] Added category - "small town"</span></p>
          <p><span className={classes.Date}><strong>11-24-2019:</strong></span><span className={classes.Content}>[032-git] Changed cron job - updeted deleted fanfics will happen once a week</span></p>
          <p><span className={classes.Date}><strong>11-24-2019:</strong></span><span className={classes.Content}>[031-git] Fix deleted fanfic function</span></p>
          <p><span className={classes.Date}><strong>11-24-2019:</strong></span><span className={classes.Content}>[031-git] Added category "friends to lovers" in categories list </span></p>
          <p><span className={classes.Date}></span>&nbsp;</p>
        </LazyLoad>
        <LazyLoad height={100} >
          <p><span className={classes.Date}><strong>11-23-2019:</strong></span><span className={classes.Content}>[030-git] Blocked the site only for registrer users for now</span></p>
          <p><span className={classes.Date}><strong>11-23-2019:</strong></span><span className={classes.Content}>[030-git] Fanfic Page - made the image still and animated only if you standing on it</span></p>
          <p><span className={classes.Date}><strong>11-23-2019:</strong></span><span className={classes.Content}>[030-git] Added Category to categiries list</span></p>
          <p><span className={classes.Date}><strong>11-23-2019:</strong></span><span className={classes.Content}>[030-git] edited the disclaimer</span></p>
          <p><span className={classes.Date}></span>&nbsp;</p>
        </LazyLoad>
        <LazyLoad height={100} >
          <p><span className={classes.Date}><strong>10-08-2019:</strong></span><span className={classes.Content}>[029-git] Redesign fanfics numbers in fanfic page</span></p>
          <p><span className={classes.Date}><strong>10-08-2019:</strong></span><span className={classes.Content}>[028-git] Changed favicon</span></p>
          <p><span className={classes.Date}><strong>10-08-2019:</strong></span><span className={classes.Content}>[027-git] Fix sorting issue in fanfics filters</span></p>
          <p><span className={classes.Date}></span>&nbsp;</p>
        </LazyLoad>
        <LazyLoad height={100} >
          <p><span className={classes.Date}><strong>10-01-2019:</strong></span><span className={classes.Content}>[026-git] Added Wattpad to manually downloader</span></p>
          <p><span className={classes.Date}><strong>10-01-2019:</strong></span><span className={classes.Content}>[025-git] Added Lazy Loading to News Page</span></p>
          <p><span className={classes.Date}><strong>10-01-2019:</strong></span><span className={classes.Content}>[024-git] Added reading list page with delete and image</span></p>
          <p><span className={classes.Date}></span>&nbsp;</p>
        </LazyLoad> 
        <LazyLoad height={100} >
          <p><span className={classes.Date}><strong>09-28-2019:</strong></span><span className={classes.Content}>[023-git] Added tumblr counter to Fanfics page</span></p>
          <p><span className={classes.Date}><strong>09-28-2019:</strong></span><span className={classes.Content}>[022-git] Fixed ignore list count on fanfic pages.</span></p>
          <p><span className={classes.Date}></span>&nbsp;</p>
        </LazyLoad> 
        <LazyLoad height={100} >
          <p><span className={classes.Date}><strong>09-27-2019:</strong></span><span className={classes.Content}>[021-git] Added "My Tracker" page with funcionality</span></p>
          <p><span className={classes.Date}></span>&nbsp;</p>
        </LazyLoad>  
        <LazyLoad height={100} >
          <p><span className={classes.Date}><strong>09-23-2019:</strong></span><span className={classes.Content}>[020-git] Edit fanfic for backup fanfics</span></p>
          <p><span className={classes.Date}></span>&nbsp;</p>
        </LazyLoad> 
        <LazyLoad height={100} >
          <p><span className={classes.Date}><strong>09-22-2019:</strong></span><span className={classes.Content}>[019-git] gallery view - made it look better</span></p>
          <p><span className={classes.Date}></span>&nbsp;</p>
        </LazyLoad>       
        <LazyLoad height={100} >
          <p><span className={classes.Date}><strong>09-20-2019:</strong></span><span className={classes.Content}>[018-git] fix another bug in button "add another one"</span></p>
          <p><span className={classes.Date}><strong>09-20-2019:</strong></span><span className={classes.Content}>[017-git] Added series to addNewFanficManually + fix bug in button "add another one" || added first design to gallery view</span></p>
          <p><span className={classes.Date}></span>&nbsp;</p>
        </LazyLoad>       
        <LazyLoad height={100} >
          <p><span className={classes.Date}><strong>09-17-2019:</strong></span><span className={classes.Content}>[016-git] Added a responisive design to add new fanfic manually page</span></p>
          <p><span className={classes.Date}><strong>09-17-2019:</strong></span><span className={classes.Content}>[015-git] Fixed "Show marked stories sort" on the switch in fanfic.js</span></p>
          <p><span className={classes.Date}></span>&nbsp;</p>
        </LazyLoad>      
        <LazyLoad height={100} >
          <p><span className={classes.Date}><strong>09-14-2019:</strong></span><span className={classes.Content}>[014-git] Added functionality for "Add Image" button in fanfic.js</span></p>
          <p><span className={classes.Date}><strong>09-14-2019:</strong></span><span className={classes.Content}>[013-git] Added switch "Show Marked Stories" in fandom.js  instead of the filter</span></p>
          <p><span className={classes.Date}><strong>09-14-2019:</strong></span><span className={classes.Content}>[012-git] Created randomize color for fanfics with general image</span></p>
          <p><span className={classes.Date}><strong>09-14-2019:</strong></span><span className={classes.Content}>[011-git] Changed the way the DB saves the images</span></p>
          <p><span className={classes.Date}></span>&nbsp;</p>
        </LazyLoad>
        <LazyLoad height={100} >
          <p><span className={classes.Date}><strong>09-13-2019:</strong></span><span className={classes.Content}>[010-git] Added New Filter: "search for only new fanfics (no user data yet)"</span></p>
          <p><span className={classes.Date}><strong>09-13-2019:</strong></span><span className={classes.Content}>[009-1-git] Added images options to fanfics (still no functionality)</span></p>
          <p><span className={classes.Date}><strong>09-13-2019:</strong></span><span className={classes.Content}>[009-git] Added switches to toggle between difference part in the fanfic component</span></p>
          <p><span className={classes.Date}></span>&nbsp;</p>
        </LazyLoad>
        <LazyLoad height={100}>
          <p><span className={classes.Date}><strong>09-10-2019:</strong></span><span className={classes.Content}>[008-git] Redesign the Filter Drewer in Fanfic page</span></p>
          <p><span className={classes.Date}><strong>09-10-2019:</strong></span><span className={classes.Content}>[007-git] Fix some issue that with filters and url Queries</span></p>
          <p><span className={classes.Date}><strong>09-10-2019:</strong></span><span className={classes.Content}>[006-git] Made the user tags linkble (can filter by them)</span></p>
          <p><span className={classes.Date}></span>&nbsp;</p>
        </LazyLoad>
        <LazyLoad height={100}>
          <p><span className={classes.Date}><strong>09-09-2019:</strong></span><span className={classes.Content}>[005-git] Design and finished Funcionality for "Contact-Us.js"</span></p>
          <p><span className={classes.Date}><strong>09-09-2019:</strong></span><span className={classes.Content}>[004-git] Added First Information + design to "About.js"</span></p>
          <p><span className={classes.Date}></span>&nbsp;</p>
        </LazyLoad>
        <LazyLoad height={100}>
          <p><span className={classes.Date}><strong>09-08-2019:</strong></span><span className={classes.Content}>[003-git] Added "Favorite" Fandom mark</span></p>
          <p><span className={classes.Date}><strong>09-08-2019:</strong></span><span className={classes.Content}>[002-git] Added "Fandom Universe" attribute to Fandoms on site</span></p>
          <p><span className={classes.Date}></span>&nbsp;</p>
        </LazyLoad>
        <LazyLoad height={100}>
          <p><span className={classes.Date}><strong>09-07-2019:</strong></span><span className={classes.Content}>[001-git] "Login" and "Registrer" Pages got Design</span></p>
          <p><span className={classes.Date}></span>&nbsp;</p>
        </LazyLoad>
    </div>
  </Container>
);

export default News;