import React from 'react';
import Typography from '@material-ui/core/Typography';

const Stat = ({fanfic}) => (
  <React.Fragment>
    
<Typography className='card_content_stat_dt' variant="subtitle2" gutterBottom>{fanfic.HasFFLink ? 'Sources:' : 'Source:'}</Typography>
    <Typography className={`card_content_stat_dd card_content_stat_source `} variant="subtitle2" gutterBottom>
      <a href={fanfic.URL} className={`color_${fanfic.Source}`} target='_blank' rel='noopener noreferrer'>{fanfic.Source}</a>
      {fanfic.HasFFLink && <a href={fanfic.URL_FF} className='color_FF' target='_blank' rel='noopener noreferrer'> , FF</a>}
    </Typography >
    <Typography className='card_content_stat_dt' variant="subtitle2" gutterBottom>Publish Date:</Typography>
    <Typography className='card_content_stat_dd' variant="subtitle2" gutterBottom>{new Date(fanfic.PublishDate).toLocaleString('en-US', {year: 'numeric', month: 'short', day: 'numeric'})}</Typography>
    <Typography className='card_content_stat_dt' variant="subtitle2" gutterBottom>Language:</Typography>
    <Typography className='card_content_stat_dd' variant="subtitle2" gutterBottom>{fanfic.Language}</Typography >
    <Typography className='card_content_stat_dt' variant="subtitle2" gutterBottom>Words:</Typography>
    <Typography className='card_content_stat_dd' variant="subtitle2" gutterBottom>{Number(fanfic.Words).toLocaleString(undefined, {maximumFractionDigits:2})}</Typography >
    <Typography className='card_content_stat_dt' variant="subtitle2" gutterBottom>Chapters:</Typography>
    <Typography className='card_content_stat_dd' variant="subtitle2" gutterBottom>{fanfic.NumberOfChapters}</Typography >
    <Typography className='card_content_stat_dt' variant="subtitle2" gutterBottom>Comments (Reviews):</Typography>
    <Typography className='card_content_stat_dd' variant="subtitle2" gutterBottom>{fanfic.Comments}</Typography >
    <Typography className='card_content_stat_dt' variant="subtitle2" gutterBottom>Kudos (Favs):</Typography>
    <Typography className='card_content_stat_dd' variant="subtitle2" gutterBottom>{Number(fanfic.Kudos).toLocaleString(undefined, {maximumFractionDigits:2})}</Typography >
    <Typography className='card_content_stat_dt' variant="subtitle2" gutterBottom>Bookmarks (Follows):</Typography>
    <Typography className='card_content_stat_dd' variant="subtitle2" gutterBottom>{Number(fanfic.Bookmarks).toLocaleString(undefined, {maximumFractionDigits:2})}</Typography >


    {fanfic.Hits &&
      <React.Fragment>
        <Typography className='card_content_stat_dt' variant="subtitle2" gutterBottom>Hits:</Typography>
        <Typography className='card_content_stat_dd' variant="subtitle2" gutterBottom>{Number(fanfic.Hits).toLocaleString(undefined, {maximumFractionDigits:2})}</Typography >
      </React.Fragment>
    }
  </React.Fragment>
);

export default Stat;