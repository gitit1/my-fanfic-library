import React from 'react';
import {Link} from 'react-router-dom';

import {Cell, Pie, PieChart} from 'recharts';
import classes from  '../../MyStatistics.module.scss';

import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';

import {getLatestFanfic,buildFanficLink} from '../../functions/functions'

const RADIAN = Math.PI / 180;

const renderCustomizedLabel = (data) => (
    {cx, cy, midAngle, innerRadius, outerRadius, percent, index,
      }) => {
        const radius = innerRadius + (outerRadius - innerRadius) * 0.6;
        const x  = cx + radius * Math.cos(-midAngle * RADIAN);
        const y = cy  + radius * Math.sin(-midAngle * RADIAN);
      
    return (
      Number(data[index].value)>0 ? 
      <text transform={`translate(${x},${y}) `} fill="white" textAnchor={`middle`}  fontSize="12"  dominantBaseline="central">
        {/* {`${(percent * 100).toFixed(0)}%`} */}
        {`${data[index].name} (${data[index].value})`}
      </text>
      : null
    );
  };

const FandomCard = (props) => {
    const {fandomData,fandoms,userData} = props;
    return(
        fandomData.map(f=>{
            const COLORS = ['#82ca9d', '#8884d8', '#ffc658', '#D62728','#1f77b4'];
            const data = [
              { name: 'Finished', value: f.Finished },
              { name: 'In Progress', value: f["In Progress"] },
              { name: 'Favorite', value: f["Favorite"] },
              { name: 'Ignored', value: f.Ignored },
              { name: 'Following', value: f.Follow },
            ]
            const fandom = fandoms.find(fan => {
                return f.name === fan.FandomName;
            });
            const latestFics = getLatestFanfic(userData,fandom.FandomName);
            
            return(
                <Card className={classes.StatisticsCard} key={f.name} >
                    <CardContent className={classes.CardContent}>
                        <div className={classes.cardHeader}>
                            <div className={classes.details}>
                                <Link to={`/fanfics/${f.name}`}>
                                    <img  alt={'fandoms'} src={fandom.Images.Image_Name_Icon !== '' 
                                                                ? `/fandoms/${fandom.FandomName.toLowerCase()}/${fandom.Images.Image_Name_Icon}`
                                                                : fandom.Image_Name_Main !== '' ? `/fandoms/${fandom.FandomName.toLowerCase()}/${fandom.Images.Image_Name_Main}` : `/fandoms/nophoto.png`} />
                                    <Typography gutterBottom variant="h5" component="h5" className={classes.cardHeader}>                                                   
                                        {f.name}
                                    </Typography> 
                                </Link>
                            </div>
                        </div> 
                        <div className={classes.cardPieChart}>
                            <PieChart width={300} height={300}>
                                <Pie
                                    data={data}
                                    cx={150}
                                    cy={150}
                                    outerRadius={120}
                                    labelLine={false}
                                    label={renderCustomizedLabel(data)}
                                    // outerRadius={180}
                                    fill="#8884d8"
                                    dataKey="value"
                                    >
                                    {
                                        data.map((entry, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]}/>)
                                    }
                                </Pie>
                            </PieChart>
                        </div>
                        <div className={classes.cardData}>
                            <div className={classes.cardDataDetails}>
                                {latestFics[0]!==null &&
                                    <div className={classes.cardDataDetailsTypes}>
                                        <p>Latest Finished Fanfic: 
                                            <a href={buildFanficLink(latestFics[0])} target='_blank' className={classes.cardDataDetailsLink1}>
                                                {latestFics[0].Author} - {latestFics[0].FanficTitle}
                                            </a>
                                        </p>
                                        <Link to={`/fanfics/${f.name}?page=1&filters=true&finished`} className={classes.cardDataDetailsLink2}>See All</Link>
                                    </div>
                                }
                                {latestFics[1]!==null &&
                                    <div className={classes.cardDataDetailsTypes}>
                                        <p>Latest In progress Fanfic: 
                                            <a href={buildFanficLink(latestFics[1])} target='_blank' className={classes.cardDataDetailsLink1}>
                                                {latestFics[1].Author} - {latestFics[1].FanficTitle}
                                            </a>
                                        </p>
                                        <Link to={`/fanfics/${f.name}?page=1&filters=true&inProgress`} className={classes.cardDataDetailsLink2}>See All</Link>
                                    </div>
                                }
                                {latestFics[2]!==null &&
                                    <div className={classes.cardDataDetailsTypes}>
                                        <p>Latest Favotire Fanfic:
                                            <a href={buildFanficLink(latestFics[2])} target='_blank' className={classes.cardDataDetailsLink1}>
                                                {latestFics[2].Author} - {latestFics[2].FanficTitle}
                                            </a>
                                        </p>
                                        <Link to={`/fanfics/${f.name}?page=1&&filters=true&favorite`} className={classes.cardDataDetailsLink2}>See All</Link>
                                    </div>
                                }
                                {latestFics[3]!==null &&
                                    <div className={classes.cardDataDetailsTypes}>
                                        <p>Latest Ignored Fanfic:
                                            <a href={buildFanficLink(latestFics[3])} target='_blank' className={classes.cardDataDetailsLink1}>
                                                {latestFics[3].Author} - {latestFics[3].FanficTitle}
                                            </a>
                                        </p>
                                        <Link to={`/fanfics/${f.name}?page=1&filters=true&ignore`} className={classes.cardDataDetailsLink2}>See All</Link>
                                    </div>
                                }
                                {latestFics[4]!==null &&
                                    <div className={classes.cardDataDetailsTypes}>
                                        <p>Latest Follow Fanfic:
                                            <a href={buildFanficLink(latestFics[4])} target='_blank' className={classes.cardDataDetailsLink1}>
                                                {latestFics[4].Author} - {latestFics[4].FanficTitle}
                                            </a>
                                        </p>
                                        <Link to={`/fanfics/${f.name}?page=1&filters=true&follow`} className={classes.cardDataDetailsLink2}>See All</Link>
                                    </div>
                                }
                            </div>
                        </div>

                    </CardContent>
              </Card>
            )
          })
    )
};

export default FandomCard;