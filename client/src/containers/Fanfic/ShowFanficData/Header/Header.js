import React from 'react';
import Typography from '@material-ui/core/Typography';

import Chip from '@material-ui/core/Chip';
import Icon from '@material-ui/core/Icon';

const Header = (props) => {
    return(
        <React.Fragment>
            <div className='card_content_header_left'>
                <Typography variant="subtitle1" >{new Date(props.fanfic.LastUpdateOfFic).toLocaleString('en-US', {year: 'numeric', month: 'short', day: 'numeric'})}</Typography>
            </div>
            <div className='card_content_header_right'>
                {props.fanfic.Rating && <img src={`/images/icons/${props.fanfic.Rating}.png`} alt={props.fanfic.Rating} title={props.fanfic.Rating}/>}
                <div className='text_content'>
                    <Typography variant="subtitle1" >
                        <a href={props.fanfic.URL} target="_blank" rel="noopener noreferrer" className='title'>{props.fanfic.FanficTitle}</a>
                            {(props.size==='s') ? <br/> :  ' '} by&nbsp; 
                        <a href={props.fanfic.AuthorURL} target="_blank">{props.fanfic.Author}</a>
                        {(props.size==='s') ? 
                           <React.Fragment>
                                <div className='fandom_tags_container'>{props.fanfic.FandomsTags && props.fanfic.FandomsTags.map(tag=>(<Chip key={tag} className='fandom_tags' size="small" label={tag} />))}</div>
                                {props.fanfic.Complete && <span className='badge complete'>Complete</span>}
                                {props.fanfic.Deleted && <span  className='badge deleted'>Deleted from AO3</span>}
                           </React.Fragment> :
                           <React.Fragment>
                                {props.fanfic.Complete && <span className='badge complete'>Complete</span>}
                                {props.fanfic.Deleted && <span  className='badge deleted'>Deleted from AO3</span>}
                                <div className='fandom_tags_container'>{props.fanfic.FandomsTags && props.fanfic.FandomsTags.map(tag=>(<Chip key={tag} className='fandom_tags' size="small" label={tag} />))}</div>

                           </React.Fragment>
                        }
                    </Typography>
                    <br/>
                    {/* {
                        (props.size==='s') && <Typography variant='button' className='tags_button' onClick={()=>props.showTagsToggle()}>Tags<Icon color="action">{props.showTags ? 'keyboard_arrow_down' : 'keyboard_arrow_right'}</Icon></Typography>
                    } */}
                    {/* {
                        (props.showTags) && <div className='fandom_tags_container'>{props.fanfic.FandomsTags && props.fanfic.FandomsTags.map(tag=>(<Chip key={tag} className='fandom_tags' size="small" label={tag} />))}</div>
                    } */}
                </div>                             
            </div>
            <div className='clear'></div>
        </React.Fragment>
    )

};

export default Header;