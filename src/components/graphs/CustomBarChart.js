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
import { getNumbers } from '../../utils/faker/faker';



ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

export default function CustomBarChart({ items, title }) {
  const options = {
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
          display: true,
          text: title,
        },
      },
  };

  const labels = [...Object.keys(items)];

  // console.log(Object.values(items));
  const data = {
        labels,
        datasets: [
            {
            label: title,
            data:[...Object.values(items)],
            borderColor: '#fff',
            borderWidth:0.5,
            backgroundColor: ['#56B8D2', '#89B0B7', '#56B8D2', '#89B0B7','#56B8D2', '#89B0B7', '#56B8D2' ],
            }
        ],
  };

  return <Bar 
        options={options} 
        data={data} 
        // height="120px"
        width="200px"
    />;
}
