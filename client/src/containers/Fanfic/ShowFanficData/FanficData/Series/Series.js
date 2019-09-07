import React from 'react';
import Chip from '@material-ui/core/Chip';
import Typography from '@material-ui/core/Typography';

const Series = (props) => {
    const {Series,SeriesPart,SeriesURL} = props.fanfic;

    return(
        <React.Fragment>
            {Series!=='false' &&  <p>Part <span>{SeriesPart}</span> of <a href={SeriesURL} target='_blank' rel="noopener noreferrer">{Series}</a></p> }
        </React.Fragment>
    )
};

export default Series;