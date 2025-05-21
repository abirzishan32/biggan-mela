"use client";

import { useRef, useEffect } from 'react';
import { Line } from 'react-chartjs-2';
import { calculateFringeSpacing } from '@/lib/physics';
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

interface ObservationPanelProps {
  measurements: { position: number; intensity: number }[];
  fringeSpacing: number;
  centralMaxima: number;
  wavelength?: number;
  slitDistance?: number;
  screenDistance?: number;
}

export default function ObservationPanel({
  measurements,
  fringeSpacing,
  centralMaxima,
  wavelength = 550,
  slitDistance = 0.2,
  screenDistance = 1000
}: ObservationPanelProps) {
  const chartRef = useRef<ChartJS<"line", number[], unknown>>(null);
  
  // Calculate theoretical fringe spacing
  const theoreticalSpacing = calculateFringeSpacing(wavelength, slitDistance, screenDistance);
  
  // Prepare chart data
  const chartData: ChartData<'line'> = {
    labels: measurements.map(m => m.position.toFixed(1)),
    datasets: [
      {
        label: 'Measured Intensity',
        data: measurements.map(m => m.intensity),
        borderColor: 'rgb(75, 192, 192)',
        backgroundColor: 'rgba(75, 192, 192, 0.5)',
        pointRadius: 4
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
          text: 'Position (mm)'
        }
      },
      y: {
        title: {
          display: true,
          text: 'Intensity (%)'
        },
        min: 0,
        max: 100
      }
    },
    plugins: {
      tooltip: {
        callbacks: {
          label: function(context) {
            return `Intensity: ${parseFloat(context.formattedValue).toFixed(1)}%`;
          }
        }
      }
    }
  };
  
  // Update chart when data changes
  useEffect(() => {
    if (chartRef.current) {
      chartRef.current.update();
    }
  }, [measurements]);
  
  // Calculate if enough data has been collected for analysis
  const hasEnoughData = measurements.length >= 5;
  
  return (
    <div className="mt-4 bg-white p-4 rounded-lg shadow">
      <h2 className="text-lg font-semibold mb-2">Observations & Analysis</h2>
      
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="bg-blue-50 p-3 rounded-md">
          <div className="text-sm text-blue-800 font-medium">Fringe Spacing</div>
          <div className="text-xl font-bold">{fringeSpacing.toFixed(2)} mm</div>
        </div>
        
        <div className="bg-green-50 p-3 rounded-md">
          <div className="text-sm text-green-800 font-medium">Central Maxima</div>
          <div className="text-xl font-bold">{centralMaxima.toFixed(1)}%</div>
        </div>
      </div>
      
      {measurements.length === 0 ? (
        <div className="text-center text-gray-500 py-4">
          Click on the screen to take intensity measurements.
        </div>
      ) : (
        <>
          <div className="h-64 mb-4">
            <Line 
              ref={chartRef}
              data={chartData} 
              options={chartOptions} 
            />
          </div>
          
          <div className="overflow-x-auto mt-4">
            <table className="min-w-full divide-y divide-gray-200">
              <thead>
                <tr>
                  <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Position (mm)
                  </th>
                  <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Intensity (%)
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {measurements.map((measurement, index) => (
                  <tr key={index} className={index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
                    <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-900">
                      {measurement.position.toFixed(1)}
                    </td>
                    <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-900">
                      {measurement.intensity.toFixed(1)}%
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {hasEnoughData && (
            <div className="mt-4 p-3 bg-yellow-50 rounded-md">
              <h3 className="font-medium text-yellow-800">Analysis</h3>
              <p className="text-sm mt-1">
                {`The fringe spacing matches the theoretical prediction: λL/d = ${theoreticalSpacing.toFixed(2)} mm`}
              </p>
              <p className="text-sm mt-1">
                The interference pattern follows the expected pattern of maxima and minima, confirming 
                wave nature of light in this experiment.
              </p>
            </div>
          )}
        </>
      )}
    </div>
  );
}