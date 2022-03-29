import React from 'react';
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Legend
  } from "recharts";

const data= [
    {
        "day": "Tue",
        "max": 40,
        "min": 33,
        "desc":"Breezy"
    },{
        "max": 41,
        "min": 32,
        "day":"Wed",
        "desc": "Clear"
    },{
        "max":39,
        "min": 30,
        "day":"Thu",
        "desc":"Cloudy"
    },{
        "max": 42,
        "min": 38,
        "day": "Fri",
        "desc": "Haze"
    },{
        "max": 40,
        "min": 32,
        "day": "Sat",
        "desc":"Cloudy"
    },
    {
        "max": 39,
        "min": 33,
        "day": "Sun",
        "desc":"Clear"
    },
    {
        "max": 40,
        "min": 34,
        "day": "Mon",
        "desc":"Cloudy"
    }
];

console.log(data)

const CustomTooltip = ({
    active,
    payload,
    label,
  }) => {
    if (active) {
      return (
          
        <div className="custom-tooltip">
            {
            console.log('payload is',payload)
        }
          <span className="content">Day of the week: <strong>{`${payload?.[0].payload.day}`}</strong></span>
          <span className="content">High Temperature: <strong>{`${payload?.[0].payload.max}`}</strong></span>
          <span className="content">Low Temperature: <strong>{`${payload?.[0].payload.min}`}</strong></span>
          <span className="content">Weather Description: <strong>{`${payload?.[0].payload.desc}`}</strong></span>        </div>
      );
    }
  
    return null;
  };

export const ChartComponent=(weatherUpdate)=>{
    return(  
       <> <h2>Weather Forcast</h2>
       <ResponsiveContainer width="99%" aspect={2} ><LineChart
        width={550}
        height={300}
        data={data}
        margin={{
          top: 5,
          right: 30,
          left: 20,
          bottom: 5
        }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="day" />
        <YAxis />
        <Tooltip content={<CustomTooltip />} />
        
        <Line
          type="monotone"
          dataKey="max"
          stroke="red"
          activeDot={{ r: 8 }}
        />
        <Line type="monotone" dataKey="min" stroke="orange" />
      </LineChart></ResponsiveContainer></>);
};

