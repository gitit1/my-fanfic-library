import React from 'react';
import {Link} from 'react-router-dom'
// import classes from './IndexFandoms.module.css';

const IndexFandoms = (props) => (
  <div>
    <div className="favorite module odd"> 
      <ul>
      {
        props.fandoms.map(fandom=>
          <li key={fandom.FandomName}><Link to={`/fanfics/${fandom.FandomName}`}>{fandom.FandomName}</Link></li>
        )
      }        
      </ul>
    </div>
  </div>
);

export default IndexFandoms;