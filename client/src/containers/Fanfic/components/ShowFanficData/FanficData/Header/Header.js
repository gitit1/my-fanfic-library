import React from 'react';
import Typography from '@material-ui/core/Typography';

import Chip from '@material-ui/core/Chip';
import { isHiatus } from './functions/isHiatus';

const Header = (props) => {
    const { LastUpdateOfFic, Rating, Complete, Deleted, FandomsTags, FandomName, Oneshot, Source } = props.fanfic;
    const Hiatus = !Complete ? isHiatus(LastUpdateOfFic) : false;
    const url = props.fanfic.URL.includes("http") ? props.fanfic.URL : `http://${props.fanfic.URL}`;
    const authorURL = props.fanfic.AuthorURL.includes("http") ? props.fanfic.URL : `http://${props.fanfic.AuthorURL}`;
    return (
        <React.Fragment>
            <div className='card_content_header_left'>
                <Typography variant="subtitle1" >{new Date(LastUpdateOfFic).toLocaleString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}</Typography>
            </div>
            <div className='card_content_header_right'>
                {Rating && <img src={`/images/icons/${Rating}.png`} alt={Rating} title={Rating} />}
                <div className='text_content'>
                    <Typography variant="subtitle1" >
                        <a href={url} target="_blank" rel="noopener noreferrer" className='title'>{props.fanfic.FanficTitle}</a>
                        {(props.size === 's') ? <br /> : ' '} by&nbsp;
                        <a href={authorURL} target="_blank" rel="noopener noreferrer">{props.fanfic.Author}</a>
                        {props.rlMode && ` [${FandomName}]`}
                        {(props.size === 's') ?
                            <React.Fragment>
                                <div className='fandom_tags_container'>{FandomsTags && FandomsTags.map(tag => (<Chip key={tag} className='fandom_tags' size="small" label={tag} />))}</div>
                                {Complete && <span className='badge complete'>Complete</span>}
                                {Oneshot && <span className='badge oneshot'>Oneshot</span>}
                                {Hiatus && <span className='badge hiatus'>Hiatus</span>}
                                {(Deleted) && <span className='badge deleted'>Deleted from {Source}</span>}
                            </React.Fragment> :
                            <React.Fragment>
                                {Complete && <span className='badge complete'>Complete</span>}
                                {Oneshot && <span className='badge oneshot'>Oneshot</span>}
                                {Hiatus && <span className='badge hiatus'>Hiatus</span>}
                                {(Deleted) && <span className='badge deleted'>Deleted from {Source}</span>}
                                <div className='fandom_tags_container'>{FandomsTags && FandomsTags.map(tag => (<Chip key={tag} className='fandom_tags' size="small" label={tag} />))}</div>

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