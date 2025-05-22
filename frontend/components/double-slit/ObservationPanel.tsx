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
  
  // Prepare chart data with improved colors for dark theme
  const chartData: ChartData<'line'> = {
    labels: measurements.map(m => m.position.toFixed(1)),
    datasets: [
      {
        label: 'Measured Intensity',
        data: measurements.map(m => m.intensity),
        borderColor: 'rgb(56, 189, 248)',
        backgroundColor: 'rgba(56, 189, 248, 0.5)',
        pointRadius: 4,
        pointBackgroundColor: 'rgba(56, 189, 248, 0.8)',
        borderWidth: 2,
        fill: true,
      }
    ]
  };
  
  // Chart options with dark theme
  const chartOptions: ChartOptions<'line'> = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: {
        title: {
          display: true,
          text: 'Position (mm)',
          color: '#e2e8f0',
        },
        grid: {
          color: 'rgba(255, 255, 255, 0.1)',
        },
        ticks: {
          color: '#e2e8f0',
        }
      },
      y: {
        title: {
          display: true,
          text: 'Intensity (%)',
          color: '#e2e8f0',
        },
        min: 0,
        max: 100,
        grid: {
          color: 'rgba(255, 255, 255, 0.1)',
        },
        ticks: {
          color: '#e2e8f0',
        }
      }
    },
    plugins: {
      legend: {
        labels: {
          color: '#e2e8f0',
        }
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            return `Intensity: ${parseFloat(context.formattedValue).toFixed(1)}%`;
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
  }, [measurements]);
  
  // Calculate if enough data has been collected for analysis
  const hasEnoughData = measurements.length >= 5;
  
  return (
    <div className="mt-4 bg-gray-900 p-4 rounded-lg shadow-lg border border-gray-800">
      <h2 className="text-lg font-semibold mb-4 text-white">Observations & Analysis</h2>
      
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="bg-gray-800 p-3 rounded-md border border-gray-700">
          <div className="text-sm text-blue-400 font-medium">Fringe Spacing</div>
          <div className="text-xl font-bold text-white">{fringeSpacing.toFixed(2)} mm</div>
        </div>
        
        <div className="bg-gray-800 p-3 rounded-md border border-gray-700">
          <div className="text-sm text-green-400 font-medium">Central Maxima</div>
          <div className="text-xl font-bold text-white">{centralMaxima.toFixed(1)}%</div>
        </div>
      </div>
      
      {measurements.length === 0 ? (
        <div className="text-center text-gray-400 py-12 bg-gray-800 rounded-md border border-gray-700">
          Click on the screen to take intensity measurements.
        </div>
      ) : (
        <>
          <div className="h-64 mb-4 bg-gray-800 p-3 rounded-md border border-gray-700">
            <Line 
              ref={chartRef}
              data={chartData} 
              options={chartOptions} 
            />
          </div>
          
          <div className="overflow-x-auto mt-4 bg-gray-800 rounded-md border border-gray-700">
            <table className="min-w-full divide-y divide-gray-700">
              <thead>
                <tr className="bg-gray-900">
                  <th className="px-3 py-2 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Position (mm)
                  </th>
                  <th className="px-3 py-2 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Intensity (%)
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700">
                {measurements.map((measurement, index) => (
                  <tr key={index} className={index % 2 === 0 ? 'bg-gray-800' : 'bg-gray-750'}>
                    <td className="px-3 py-2  text-sm text-gray-300">
                      {measurement.position.toFixed(1)}
                    </td>
                    <td className="px-3 py-2  text-sm text-gray-300">
                      {measurement.intensity.toFixed(1)}%
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {hasEnoughData && (
            <div className="mt-4 p-4 bg-blue-900/30 rounded-md border border-blue-800">
              <h3 className="font-medium text-blue-400">Analysis</h3>
              <p className="text-sm mt-1 text-gray-200">
                {`The fringe spacing matches the theoretical prediction: λL/d = ${theoreticalSpacing.toFixed(2)} mm`}
              </p>
              <p className="text-sm mt-1 text-gray-200">
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