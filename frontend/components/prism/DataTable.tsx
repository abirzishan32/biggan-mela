"use client";

interface DataTableProps {
  data: { incidentAngle: number; deviationAngle: number }[];
}

export default function DataTable({ data }: DataTableProps) {
  if (data.length === 0) {
    return (
      <div className="mt-4 bg-gray-900 p-4 rounded-lg shadow-lg border border-gray-800">
        <h2 className="text-lg font-semibold mb-2 text-white">Measurement Data</h2>
        <div className="text-center text-gray-400 py-4 bg-gray-800 rounded-md">
          No measurements taken yet. Use the controls to start collecting data.
        </div>
      </div>
    );
  }
  
  return (
    <div className="mt-4 bg-gray-900 p-4 rounded-lg shadow-lg border border-gray-800">
      <h2 className="text-lg font-semibold mb-2 text-white">Measurement Data</h2>
      <div className="overflow-x-auto bg-gray-800 rounded-md border border-gray-700">
        <table className="min-w-full divide-y divide-gray-700">
          <thead>
            <tr className="bg-gray-800">
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                #
              </th>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                Incident Angle (i)
              </th>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                Deviation Angle (D)
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-700">
            {data.map((row, index) => (
              <tr key={index} className={index % 2 === 0 ? 'bg-gray-800' : 'bg-gray-750'}>
                <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-300">
                  {index + 1}
                </td>
                <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-300">
                  {row.incidentAngle.toFixed(1)}°
                </td>
                <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-300">
                  {row.deviationAngle.toFixed(2)}°
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}