"use client";

import { useEffect, useRef } from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ChartData,
  ChartOptions
} from 'chart.js';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

interface GraphProps {
  data: { incidentAngle: number; deviationAngle: number }[];
  minDeviation: number | null;
}

export default function Graph({ data, minDeviation }: GraphProps) {
  const chartRef = useRef<ChartJS<"line", number[], unknown>>(null);
  
  // Sort data by incident angle
  const sortedData = [...data].sort((a, b) => a.incidentAngle - b.incidentAngle);
  
  // Prepare chart data
  const chartData: ChartData<'line'> = {
    labels: sortedData.map(d => d.incidentAngle.toString()),
    datasets: [
      {
        label: 'Angle of Deviation',
        data: sortedData.map(d => d.deviationAngle),
        borderColor: 'rgb(56, 189, 248)',
        backgroundColor: 'rgba(56, 189, 248, 0.5)',
        tension: 0.3,
        pointRadius: 4,
        pointBackgroundColor: 'rgb(56, 189, 248)',
      }
    ]
  };
  
  // Add horizontal line for minimum deviation if available
  if (minDeviation !== null) {
    chartData.datasets.push({
      label: 'Minimum Deviation',
      data: Array(sortedData.length).fill(minDeviation),
      borderColor: 'rgba(248, 113, 113, 0.8)',
      borderDash: [5, 5],
      borderWidth: 2,
      pointRadius: 0,
      tension: 0
    });
  }
  
  // Chart options
  const chartOptions: ChartOptions<'line'> = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: {
        title: {
          display: true,
          text: 'Angle of Incidence (degrees)',
          color: '#e2e8f0'
        },
        grid: {
          color: 'rgba(255, 255, 255, 0.1)'
        },
        ticks: {
          color: '#e2e8f0'
        }
      },
      y: {
        title: {
          display: true,
          text: 'Angle of Deviation (degrees)',
          color: '#e2e8f0'
        },
        min: minDeviation ? Math.max(0, minDeviation - 10) : undefined,
        grid: {
          color: 'rgba(255, 255, 255, 0.1)'
        },
        ticks: {
          color: '#e2e8f0'
        }
      }
    },
    plugins: {
      legend: {
        position: 'top',
        labels: {
          color: '#e2e8f0'
        }
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            return `${context.dataset.label}: ${parseFloat(context.formattedValue).toFixed(2)}°`;
          }
        },
        backgroundColor: 'rgba(17, 24, 39, 0.8)',
        titleColor: '#ffffff',
        bodyColor: '#e2e8f0',
        borderColor: 'rgba(56, 189, 248, 0.5)',
        borderWidth: 1,
      }
    }
  };
  
  // Update chart when data changes
  useEffect(() => {
    if (chartRef.current) {
      chartRef.current.update();
    }
  }, [data, minDeviation]);
  
  if (data.length < 2) {
    return (
      <div className="mt-4 bg-gray-900 p-4 rounded-lg shadow-lg border border-gray-800">
        <h2 className="text-lg font-semibold mb-2 text-white">i-D Graph</h2>
        <div className="text-center text-gray-400 py-4 bg-gray-800 rounded-md">
          Take at least 2 measurements to generate a graph.
        </div>
      </div>
    );
  }
  
  return (
    <div className="mt-4 bg-gray-900 p-4 rounded-lg shadow-lg border border-gray-800">
      <h2 className="text-lg font-semibold mb-2 text-white">i-D Graph</h2>
      <div className="h-64 mb-2 bg-gray-800 p-3 rounded-md border border-gray-700">
        <Line 
          ref={chartRef}
          data={chartData} 
          options={chartOptions} 
        />
      </div>
      <div className="text-xs text-gray-400 mt-2">
        <p>
          The minimum of the curve indicates the angle of minimum deviation (Dm).
          At this point, the light ray passes symmetrically through the prism.
        </p>
      </div>
    </div>
  );
}