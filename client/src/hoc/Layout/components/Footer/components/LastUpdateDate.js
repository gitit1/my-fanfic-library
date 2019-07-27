import React from 'react';

const LastUpdateDate = (props) => (
    <div className={'responsive_hide lastUpdateDate'}>
      <p className='header'>Last Update:&nbsp; 
        <span>
          {new Date(props.lastUpdateDate).toLocaleString('en-US', {year: 'numeric', month: 'short', day: 'numeric'})}       
        </span>
      </p>
    </div>
);

export default LastUpdateDate;