import React from 'react';
//import classes from '../ShowFanficData.module.css';

const Stat = (props) => (
  <React.Fragment>
    <dt>Publish Date:</dt>
    <dd>{new Date(props.fanfic.PublishDate).toLocaleString('en-US', {year: 'numeric', month: 'short', day: 'numeric'})}</dd>
    <dt>Language:</dt>
    <dd>{props.fanfic.Language}</dd>
    <dt>Words:</dt>
    <dd>{props.fanfic.Words.toLocaleString(undefined, {maximumFractionDigits:2})}</dd>
    <dt>Chapters:</dt>
    <dd>{props.fanfic.NumberOfChapters}</dd>
    <dt>Comments (Reviews):</dt>
    <dd>{props.fanfic.Comments}</dd>
    <dt>Kudos (Favs):</dt>
    <dd>{props.fanfic.Kudos}</dd>
    <dt>Bookmarks (Follows):</dt>
    <dd>{props.fanfic.Bookmarks}</dd>
    {props.fanfic.Hits &&
      <React.Fragment>
        <dt>Hits:</dt>
        <dd>{props.fanfic.Hits}</dd>
      </React.Fragment>
    }
  </React.Fragment>
);

export default Stat;