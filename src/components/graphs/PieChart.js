import React from 'react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Pie } from 'react-chartjs-2';



ChartJS.register(ArcElement, Tooltip, Legend);
export const options = {
    maintainAspectRatio: false,
    plugins:{
        legend:{
            display:true,
            position: 'right',
        }
    }
}

export const data = {
  labels: ['Industrial', 'Commercial', 'Land', 'Residential'],
  datasets: [
    {
      label: '# of Units',
      data: [12, 19, 3, 5],
      backgroundColor: [
        '#3B6696',
        '#86EBE9',
        '#5DBDD3',
        '#4691B8'
      ],
      borderColor: [
        '#3B6696',
        '#86EBE9',
        '#5DBDD3',
        '#4691B8',
      ],
      borderWidth: 1,
    },
  ],
};

export function PieComponent() {
  return <Pie 
        data={data} 
        options={options} 
        width="150px"
    />;
}
