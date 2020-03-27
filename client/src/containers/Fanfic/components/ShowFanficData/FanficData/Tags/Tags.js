import React from 'react';
import Chip from '@material-ui/core/Chip';
import Typography from '@material-ui/core/Typography';

const Tags = (props) => (
    <React.Fragment>
        {
            props.fanfic.Tags.map((tags) => {
                return (
                    tags[Object.keys(tags)[0]].length > 0 &&
                    <div key={Object.keys(tags)[0]}>
                        <Typography variant="subtitle2" gutterBottom className='card_content_tags_caption'>{`${Object.keys(tags)[0]}: `}</Typography>
                        <div className='card_content_tags_div'>
                            {tags[Object.keys(tags)[0]].map(tag => (
                                <Chip size="small" key={tag} label={tag} className='tags_chip' onClick={() => props.filter(tag, null, 'tag', Object.keys(tags)[0])} />
                            ))}
                        </div>
                    </div>

                )
            })
        }
    </React.Fragment>
);

export default Tags;
