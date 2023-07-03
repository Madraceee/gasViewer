import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Filler,
  Legend,
  ChartOptions,
  ChartType
} from 'chart.js';
import { Line, Chart } from 'react-chartjs-2';

import { BlockBaseGasProps } from './page';

interface ScatterChartProps  {
    points : BlockBaseGasProps[]
}

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Filler,
  Legend
);

export default function LineChart({points}:ScatterChartProps) {
  // Extract x and y values from the data array
  const chartData = {
    labels: points.map((point) => `Block No : ${point.id}`),
    datasets: [      
      {        
        fill: true,
        label: "gwei",
        data: points.map((point) => {if(point.baseGas) return Number(point.baseGas.substring(0,point.baseGas.indexOf('.'))) }),
        borderColor: 'rgb(101, 71, 192,0.8)',
        backgroundColor: 'rgb(101, 71, 192,0.4)',
        pointRadius: 2
      },
    ],
  };

  const chartOptions: ChartOptions<"line"> = {
    scales: {
      x: {
        ticks: {
          display: false
        }
      },
      y:{
        beginAtZero: true,
      }
    },
    plugins: {
      legend: {
        display: false
      },
    },
    responsive: true,
    maintainAspectRatio: true,
  };

  return (
    <div style={{width: "1000px",marginTop: "30px"}}>
      <Line data={chartData}  options={chartOptions} />
    </div>
  );
}

