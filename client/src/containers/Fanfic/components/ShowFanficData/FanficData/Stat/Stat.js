import React from 'react';
import Typography from '@material-ui/core/Typography';

const Stat = (props) => (
  <React.Fragment>
    <Typography className='card_content_stat_dt' variant="subtitle2" gutterBottom>Source:</Typography>
    <Typography className={`card_content_stat_dd card_content_stat_source color_${props.fanfic.Source}`} variant="subtitle2" gutterBottom>{props.fanfic.Source}</Typography >
    <Typography className='card_content_stat_dt' variant="subtitle2" gutterBottom>Publish Date:</Typography>
    <Typography className='card_content_stat_dd' variant="subtitle2" gutterBottom>{new Date(props.fanfic.PublishDate).toLocaleString('en-US', {year: 'numeric', month: 'short', day: 'numeric'})}</Typography>
    <Typography className='card_content_stat_dt' variant="subtitle2" gutterBottom>Language:</Typography>
    <Typography className='card_content_stat_dd' variant="subtitle2" gutterBottom>{props.fanfic.Language}</Typography >
    <Typography className='card_content_stat_dt' variant="subtitle2" gutterBottom>Words:</Typography>
    <Typography className='card_content_stat_dd' variant="subtitle2" gutterBottom>{Number(props.fanfic.Words).toLocaleString(undefined, {maximumFractionDigits:2})}</Typography >
    <Typography className='card_content_stat_dt' variant="subtitle2" gutterBottom>Chapters:</Typography>
    <Typography className='card_content_stat_dd' variant="subtitle2" gutterBottom>{props.fanfic.NumberOfChapters}</Typography >
    <Typography className='card_content_stat_dt' variant="subtitle2" gutterBottom>Comments (Reviews):</Typography>
    <Typography className='card_content_stat_dd' variant="subtitle2" gutterBottom>{props.fanfic.Comments}</Typography >
    <Typography className='card_content_stat_dt' variant="subtitle2" gutterBottom>Kudos (Favs):</Typography>
    <Typography className='card_content_stat_dd' variant="subtitle2" gutterBottom>{Number(props.fanfic.Kudos).toLocaleString(undefined, {maximumFractionDigits:2})}</Typography >
    <Typography className='card_content_stat_dt' variant="subtitle2" gutterBottom>Bookmarks (Follows):</Typography>
    <Typography className='card_content_stat_dd' variant="subtitle2" gutterBottom>{Number(props.fanfic.Bookmarks).toLocaleString(undefined, {maximumFractionDigits:2})}</Typography >


    {props.fanfic.Hits &&
      <React.Fragment>
        <Typography className='card_content_stat_dt' variant="subtitle2" gutterBottom>Hits:</Typography>
        <Typography className='card_content_stat_dd' variant="subtitle2" gutterBottom>{Number(props.fanfic.Hits).toLocaleString(undefined, {maximumFractionDigits:2})}</Typography >
      </React.Fragment>
    }
  </React.Fragment>
);

export default Stat;