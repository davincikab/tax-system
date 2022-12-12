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
// import faker;
import { getNumbers } from '../../utils/faker/faker';
// import { faker } from "https://cdn.skypack.dev/@faker-js/faker@v7.4.0"



ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

export const options = {
  indexAxis: 'y',
  elements: {
    bar: {
      borderWidth: 2,
    },
  },
  responsive: true,
  scales: {
    x: {
      stacked: true,
    },
    y: {
      stacked: true,
    },
  },
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: 'bottom',
    },
    title: {
      display: true,
      text: '',
    },
  },
};

const labels = ['Zone 1', 'Zone 2', 'Zone 3', 'Zone 4', 'Zone 5', 'Zone 6', 'Zone 7', 'Zone 8'];

export const data = {
  labels,
  datasets: [
    {
      label: 'Dataset 1',
      data: getNumbers(labels.length,  10, 100 ),
      borderColor: '#fff',
      borderWidth:0.1,
      backgroundColor: '#D2C456',
    },
    {
      label: 'Dataset 2',
      data: getNumbers(labels.length,  10, 200 ),
      borderColor: '#fff',
      borderWidth:0.1,
      backgroundColor: '#56ACD2',
    },

    {
        label: 'Dataset 2',
        data: getNumbers(labels.length,  10, 100 ),
        borderColor: '#fff',
        borderWidth:0.1,
        backgroundColor: '#FA8F8F',
      },
  ],
};

export default function HorizontalBar() {
  return <Bar 
        options={options} 
        data={data} 
        width="200px"
    />;
}
