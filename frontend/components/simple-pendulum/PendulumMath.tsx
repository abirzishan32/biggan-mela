"use client";

export default function PendulumMath() {
  return (
    <div className="bg-white p-4 rounded-lg shadow mt-6">
      <h2 className="text-xl font-semibold mb-2">The Physics Explained</h2>
      
      <div className="space-y-4 text-sm">
        <div>
          <h3 className="font-semibold text-blue-700">Simple Pendulum Formula</h3>
          <p className="mb-2">
            For a simple pendulum with a small angle of swing, the period (T) is:
          </p>
          <div className="bg-gray-100 p-3 rounded text-center font-medium">
            T = 2π√(L/g)
          </div>
          <p className="mt-2">
            Where:
            <ul className="list-disc pl-5 mt-1">
              <li>T is the period (time for one complete oscillation)</li>
              <li>L is the length of the pendulum</li>
              <li>g is the acceleration due to gravity (9.8 m/s²)</li>
            </ul>
          </p>
        </div>
        
        <div>
          <h3 className="font-semibold text-blue-700">For Larger Angles</h3>
          <p className="mb-2">
            The simple formula is an approximation that works well for small angles.
            For larger angles, the period increases slightly and follows:
          </p>
          <div className="bg-gray-100 p-3 rounded text-center font-medium">
            T = 2π√(L/g) · [1 + (1/16)sin²(θ/2) + ...]
          </div>
        </div>
        
        <div>
          <h3 className="font-semibold text-blue-700">Key Insights</h3>
          <ul className="list-disc pl-5">
            <li>The period is <b>independent of the mass</b> of the pendulum bob</li>
            <li>The period increases with the <b>square root of the length</b></li>
            <li>Doubling the length increases the period by a factor of √2</li>
            <li>The period would be different on other planets due to different gravity</li>
          </ul>
        </div>
        
        <div>
          <h3 className="font-semibold text-blue-700">Experiment Tips</h3>
          <p>
            To get the most accurate results:
            <ul className="list-disc pl-5 mt-1">
              <li>Use small initial angles (less than 15°) for better agreement with the formula</li>
              <li>Measure multiple periods and take the average</li>
              <li>The pendulum will gradually slow down due to air resistance</li>
            </ul>
          </p>
        </div>
      </div>
    </div>
  );
}