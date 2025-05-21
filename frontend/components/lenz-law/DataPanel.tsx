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

interface DataPanelProps {
  inducedCurrent: number;
  magneticFlux: number;
  currentHistory: { time: number; current: number }[];
  elapsedTime: number;
}

export default function DataPanel({
  inducedCurrent,
  magneticFlux,
  currentHistory,
  elapsedTime
}: DataPanelProps) {
  // Fix: Use the correct type for the chart reference
  const chartRef = useRef<ChartJS<"line", number[], unknown>>(null);
  
  // Prepare chart data
  const chartData: ChartData<'line'> = {
    labels: currentHistory.map(data => data.time.toFixed(1)),
    datasets: [
      {
        label: 'Induced Current (A)',
        data: currentHistory.map(data => data.current),
        borderColor: 'rgb(75, 192, 192)',
        backgroundColor: 'rgba(75, 192, 192, 0.5)',
        tension: 0.2,
        fill: false
      }
    ]
  };
  
  // Chart options
  const chartOptions: ChartOptions<'line'> = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: {
        title: {
          display: true,
          text: 'Time (s)'
        }
      },
      y: {
        title: {
          display: true,
          text: 'Current (A)'
        },
        min: -2,
        max: 2
      }
    },
    animation: {
      duration: 0 // Disable animations for better performance
    }
  };
  
  // Update chart when data changes
  useEffect(() => {
    if (chartRef.current) {
      chartRef.current.update();
    }
  }, [currentHistory]);
  
  return (
    <div className="bg-white p-4 rounded-lg shadow mb-4">
      <h2 className="text-xl font-semibold mb-4">Measurement Data</h2>
      
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="bg-blue-50 p-3 rounded-md">
          <div className="text-sm text-blue-800 font-medium">Current</div>
          <div className="text-2xl font-bold">{inducedCurrent.toFixed(2)} A</div>
        </div>
        
        <div className="bg-purple-50 p-3 rounded-md">
          <div className="text-sm text-purple-800 font-medium">Magnetic Flux</div>
          <div className="text-2xl font-bold">{magneticFlux.toFixed(2)} Wb</div>
        </div>
      </div>
      
      {/* Current graph */}
      <div className="h-64 mb-2">
        <Line 
          ref={chartRef}
          data={chartData} 
          options={chartOptions} 
        />
      </div>
      
      <div className="text-sm text-gray-600 mt-2">
        <p>
          Observe how the current changes direction when the magnet's movement changes 
          or when it passes through the coil.
        </p>
      </div>
    </div>
  );
}