import React from 'react';
import Typography from '@material-ui/core/Typography';

import Chip from '@material-ui/core/Chip';
import { isHiatus } from './functions/isHiatus';

const Header = (props) => {
    const { LastUpdateOfFic, Rating, Complete, Deleted, FandomsTags, FanficTitle,
        FandomName, Oneshot, Source, URL, Author, AuthorURL,
        Author1, AuthorURL1 } = props.fanfic;
    const Hiatus = !Complete ? isHiatus(LastUpdateOfFic) : false;

    const url = (URL && (URL.length < 2 || !URL)) ? '' : URL.includes("http") ? URL : `http://${URL}`;
    const authorURL = ( (AuthorURL && AuthorURL.length < 2) || !AuthorURL) ? '' : AuthorURL.includes("http") ? AuthorURL : `http://${AuthorURL}`;
    const authorURL1 = ( (AuthorURL1 && AuthorURL1.length < 2) || !AuthorURL1) ? '' : AuthorURL1.includes("http") ? AuthorURL1 : `http://${AuthorURL1}`;

    return (
        <React.Fragment>
            <div className='card_content_header_left'>
                <Typography variant="subtitle1" >{new Date(LastUpdateOfFic).toLocaleString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}</Typography>
            </div>
            <div className='card_content_header_right'>
                {Rating && <img src={`/images/icons/${Rating}.png`} alt={Rating} title={Rating} />}
                <div className='text_content'>
                    <Typography variant="subtitle1" >
                        <a href={url} target="_blank" rel="noopener noreferrer" className='title'>{FanficTitle}</a>
                        {(props.size === 's') ? <br /> : ' '} by&nbsp;
                        <a href={authorURL} target="_blank" rel="noopener noreferrer" className='author'>{Author}</a>
                        {Author1 && <> , <a href={authorURL1} target="_blank" rel="noopener noreferrer" className='author'>{Author1}</a></>}
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