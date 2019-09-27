import React from 'react';
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
  } from 'recharts';

const GeneralBarChart = (props) => {
    const {data} = props;
    return(
        <ResponsiveContainer width='50%' height={300}>
            <BarChart
                // width={700}
                // height={300}
                data={data}
                margin={{top: 20, right: 30, left: 20, bottom: 5}}
            >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="Finished" stackId="a" fill="#82ca9d" />
                <Bar dataKey="In Progress" stackId="a" fill="#8884d8" />
                <Bar dataKey="Favorite" stackId="a" fill="#ffc658" />
                <Bar dataKey="Ignored"  stackId="a" fill="#D62728" />
            </BarChart>
        </ResponsiveContainer>
    )
};

export default GeneralBarChart;