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
  maintainAspectRatio: false,
  responsive: true,
  plugins: {
    legend: {
        display:false,
        position: 'right',
    },
    title: {
      display: false,
      text: '',
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
      backgroundColor: ['#56B8D2', '#89B0B7', '#56B8D2', '#89B0B7','#56B8D2', '#89B0B7', '#56B8D2' ],
    }
  ],
};

export default function BarChart1() {
  return <Bar 
        options={options} 
        data={data} 
        // height="120px"
        width="200px"
    />;
}
