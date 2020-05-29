import React from 'react';

const Series = (props) => {
    const {Series,SeriesPart,SeriesURL} = props.fanfic;
    const hasSeries = (!Series || Series==='false' || Series===undefined || Series===null) ? false : true;
    return(
        <React.Fragment>
            { hasSeries && 
                <p>Part <span>{SeriesPart}</span> of <a href={SeriesURL} target='_blank' rel="noopener noreferrer">{Series}</a></p> 
            }
        </React.Fragment>
    )
};

export default Series;