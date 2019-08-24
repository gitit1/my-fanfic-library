import React from 'react';
import Slider from "react-slick";
import './latestUpdates.scss'

const settings = {
    dots: true,
    infinite: true,
    speed: 800,
    slidesToShow: 1,
    slidesToScroll: 1,
    adaptiveHeight:false,
    autoplay:true,
    autoplaySpeed:8000,
    className:'latestUpdates_slider'
  };

const LatestUpdates = (props) => (
    <div className='latestUpdates'>
        <Slider {...settings}>
            {props.updates.map(update=>(
                <div key={update.Date}>
                    <h4 className='latestUpdates_date_header'>
                        {new Date(update.Date).toLocaleString('en-US', {year: 'numeric', month: 'short', day: 'numeric'})}
                    </h4>
                    {
                        update.Fandom.map(fandom=>
                            <span  key={fandom.FandomName} className='latestUpdates_fandom_box'>
                                <h4>{fandom.FandomName}</h4>
                                <p>{fandom.Updated>0  && `${fandom.Updated} fanfics got updated`}</p>
                                <p>{fandom.New>0  && `${fandom.New} was added to the fandom`}</p>
                            </span>
                        )
                    }
                </div>
            ))}
        </Slider>

        
    </div>
);

export default LatestUpdates;