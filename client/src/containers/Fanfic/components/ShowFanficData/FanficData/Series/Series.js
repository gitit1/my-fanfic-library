import React from 'react';

const Series = (props) => {
    const {Series,SeriesPart,SeriesURL} = props.fanfic;
    return(
        <React.Fragment>
            {(Series!=='false'&&Series!==undefined&&Series!==null) &&  <p>Part <span>{SeriesPart}</span> of <a href={SeriesURL} target='_blank' rel="noopener noreferrer">{Series}</a></p> }
        </React.Fragment>
    )
};

export default Series;