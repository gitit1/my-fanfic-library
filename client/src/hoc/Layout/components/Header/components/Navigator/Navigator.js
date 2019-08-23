import React from 'react';

import NavWeb from './components/NavWeb/NavWeb'
import NavMobile from './components/NavMobile/NavMobile'


const Navigator = (props) =>(
    
    <React.Fragment>
      {(props.size==='l') ? <NavWeb  auth={props.auth}/> : <NavMobile auth={props.auth}/>}
    </React.Fragment>
);

export default Navigator;
