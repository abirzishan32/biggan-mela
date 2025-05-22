"use client";

export default function PendulumMath() {
  return (
    <div className="bg-gray-800 p-4 rounded-lg shadow-lg mt-6">
      <h2 className="text-xl font-semibold mb-2 text-white">The Physics Explained</h2>
      
      <div className="space-y-4 text-sm">
        <div>
          <h3 className="font-semibold text-blue-300">Simple Pendulum Formula</h3>
          <p className="mb-2 text-gray-300">
            For a simple pendulum with a small angle of swing, the period (T) is:
          </p>
          <div className="bg-gray-700 p-3 rounded text-center font-medium text-blue-300 border border-gray-600">
            T = 2π√(L/g)
          </div>
          <div className="mt-2 text-gray-300">
            Where:
            <ul className="list-disc pl-5 mt-1">
              <li>T is the period (time for one complete oscillation)</li>
              <li>L is the length of the pendulum</li>
              <li>g is the acceleration due to gravity (9.8 m/s²)</li>
            </ul>
          </div>
        </div>
        
        <div>
          <h3 className="font-semibold text-blue-300">For Larger Angles</h3>
          <p className="mb-2 text-gray-300">
            The simple formula is an approximation that works well for small angles.
            For larger angles, the period increases slightly and follows:
          </p>
          <div className="bg-gray-700 p-3 rounded text-center font-medium text-blue-300 border border-gray-600">
            T = 2π√(L/g) · [1 + (1/16)sin²(θ/2) + ...]
          </div>
        </div>
        
        <div>
          <h3 className="font-semibold text-blue-300">Key Insights</h3>
          <ul className="list-disc pl-5 text-gray-300">
            <li>The period is <b className="text-white">independent of the mass</b> of the pendulum bob</li>
            <li>The period increases with the <b className="text-white">square root of the length</b></li>
            <li>Doubling the length increases the period by a factor of √2</li>
            <li>The period would be different on other planets due to different gravity</li>
          </ul>
        </div>
        
        <div>
          <h3 className="font-semibold text-blue-300">Experiment Tips</h3>
          <div className="text-gray-300">
            To get the most accurate results:
            <ul className="list-disc pl-5 mt-1">
              <li>Use small initial angles (less than 15°) for better agreement with the formula</li>
              <li>Measure multiple periods and take the average</li>
              <li>The pendulum will gradually slow down due to air resistance</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}