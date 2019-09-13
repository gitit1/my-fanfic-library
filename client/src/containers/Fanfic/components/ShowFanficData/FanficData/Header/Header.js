import React from 'react';
import Typography from '@material-ui/core/Typography';

import Chip from '@material-ui/core/Chip';
import {isHiatus} from './functions/isHiatus';

const Header = (props) => {
    const {LastUpdateOfFic,Rating,Complete,Deleted,FandomsTags} = props.fanfic;
    const Hiatus = !Complete ? isHiatus(LastUpdateOfFic) : false
    return(
        <React.Fragment>
            <div className='card_content_header_left'>
                <Typography variant="subtitle1" >{new Date(LastUpdateOfFic).toLocaleString('en-US', {year: 'numeric', month: 'short', day: 'numeric'})}</Typography>
            </div>
            <div className='card_content_header_right'>
                {Rating && <img src={`/images/icons/${Rating}.png`} alt={Rating} title={Rating}/>}
                <div className='text_content'>
                    <Typography variant="subtitle1" >
                        <a href={props.fanfic.URL} target="_blank" rel="noopener noreferrer" className='title'>{props.fanfic.FanficTitle}</a>
                            {(props.size==='s') ? <br/> :  ' '} by&nbsp; 
                        <a href={props.fanfic.AuthorURL} target="_blank" rel="noopener noreferrer">{props.fanfic.Author}</a>
                        {(props.size==='s') ? 
                           <React.Fragment>
                                <div className='fandom_tags_container'>{FandomsTags && FandomsTags.map(tag=>(<Chip key={tag} className='fandom_tags' size="small" label={tag} />))}</div>
                                {Complete && <span className='badge complete'>Complete</span>}
                                {Deleted && <span  className='badge deleted'>Deleted from AO3</span>}
                           </React.Fragment> :
                           <React.Fragment>
                                {Complete && <span className='badge complete'>Complete</span>}
                                {Deleted && <span  className='badge deleted'>Deleted from AO3</span>}
                                {Hiatus && <span  className='badge hiatus'>Hiatus</span>}
                                <div className='fandom_tags_container'>{FandomsTags && FandomsTags.map(tag=>(<Chip key={tag} className='fandom_tags' size="small" label={tag} />))}</div>

                           </React.Fragment>
                        }
                    </Typography>
                </div>                             
            </div>
            <div className='clear'></div>
        </React.Fragment>
    )

};

export default Header;