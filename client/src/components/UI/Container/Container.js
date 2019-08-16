import React from 'react';
import './Container.scss';

const Container = (props) => (
  <div className={`app_container ${props.className ? props.className : null}`}>
      {props.header&&
        <div className='app_container_header'>
          <h3>{props.header}</h3>
        </div>
      }
      <div className='app_container_main'>
        {props.children}
      </div>
  </div>
);

export default Container
