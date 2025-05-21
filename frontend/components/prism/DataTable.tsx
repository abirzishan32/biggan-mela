"use client";

interface DataTableProps {
  data: { incidentAngle: number; deviationAngle: number }[];
}

export default function DataTable({ data }: DataTableProps) {
  if (data.length === 0) {
    return (
      <div className="mt-4 bg-white p-4 rounded-lg shadow">
        <h2 className="text-lg font-semibold mb-2">Measurement Data</h2>
        <div className="text-center text-gray-500 py-4">
          No measurements taken yet. Use the controls to start collecting data.
        </div>
      </div>
    );
  }
  
  return (
    <div className="mt-4 bg-white p-4 rounded-lg shadow">
      <h2 className="text-lg font-semibold mb-2">Measurement Data</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead>
            <tr>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                #
              </th>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Incident Angle (i)
              </th>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Deviation Angle (D)
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {data.map((row, index) => (
              <tr key={index} className={index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
                <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900">
                  {index + 1}
                </td>
                <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900">
                  {row.incidentAngle.toFixed(1)}°
                </td>
                <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900">
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