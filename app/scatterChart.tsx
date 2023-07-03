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

export default function ScatterChart({points}:ScatterChartProps) {
  // Extract x and y values from the data array
  const chartData = {
    labels: points.map((point) => point.id),
    datasets: [      
      {        
        label:"Base Gas",
        fill: true,
        data: points.map((point) => {if(point.baseGas) return Number(point.baseGas.substring(0,point.baseGas.indexOf('.'))) }),
        borderColor: 'rgba(75,192,192,0.4)',
        backgroundColor: 'rgba(75,192,192,0.4)',
        pointRadius: 3
      },
    ],
  };

  const chartOptions: ChartOptions<ChartType> = {
    scales: {
      x: {
        ticks: {
          callback: (value: number, index: number, values: number[]) => {
              return '';
          },
        }
      },
      y:{
        beginAtZero: true,
      }
    },
    plugins: {
      legend: {
        position: 'top' as const,
      },
    },
    responsive: true,
    maintainAspectRatio: false,
    aspectRatio: 20
  };

  return (
    <div>
      <Line data={chartData} options={chartOptions} />
    </div>
  );
}

