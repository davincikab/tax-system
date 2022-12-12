import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';
// import faker from 'faker';
import { faker } from "https://cdn.skypack.dev/@faker-js/faker@v7.4.0"



ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

export const options = {
//   indexAxis: 'y',
  elements: {
    bar: {
      borderWidth: 2,
    },
  },
  responsive: true,
  plugins: {
    legend: {
        display:false,
        position: 'right',
    },
    title: {
      display: false,
      text: 'Chart.js Horizontal Bar Chart',
    },
  },
};

const labels = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

export const data = {
  labels,
  datasets: [
    {
      label: 'Dataset 1',
      data: labels.map(() => faker.datatype.number({ min: 10, max: 100 })),
      borderColor: '#fff',
      borderWidth:0.1,
      backgroundColor: ['#D2C456', '#A89D5C', '#D2C456', '#A89D5C','#D2C456', '#A89D5C', '#D2C456' ],
    }
  ],
};

export default function BarChart2() {
  return <Bar 
        options={options} 
        data={data} 
        height="180px"
        // width="350px"
    />;
}
