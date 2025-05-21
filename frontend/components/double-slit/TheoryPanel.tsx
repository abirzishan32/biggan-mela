"use client";

export default function TheoryPanel() {
  return (
    <div className="mt-4 bg-white p-4 rounded-lg shadow mb-4">
      <h2 className="text-lg font-semibold mb-4">Theory & Wave-Particle Duality</h2>
      
      <div className="space-y-4 text-sm">
        <div>
          <h3 className="font-semibold text-indigo-700">The Double-Slit Experiment</h3>
          <p className="mt-1">
            Young's double-slit experiment, first performed in 1801, demonstrates the wave nature of light. 
            When light passes through two closely spaced slits, an interference pattern of bright and dark bands 
            appears on a screen, which can only be explained by wave behavior.
          </p>
        </div>
        
        <div>
          <h3 className="font-semibold text-indigo-700">Mathematical Description</h3>
          <p className="mt-1">
            The positions of the bright fringes (constructive interference) are given by:
          </p>
          <div className="bg-gray-100 p-3 rounded my-2 text-center font-medium">
            d sin θ = mλ (where m = 0, ±1, ±2, ...)
          </div>
          <p>
            For small angles, this can be approximated as:
          </p>
          <div className="bg-gray-100 p-3 rounded my-2 text-center font-medium">
            y = m(λL/d)
          </div>
          <p>
            Where y is the distance from the central maximum, λ is the wavelength, L is the distance 
            to the screen, d is the slit separation, and m is the order of the maximum.
          </p>
        </div>
        
        <div className="bg-gray-100 p-3 rounded">
          <h3 className="font-semibold">Wave-Particle Duality</h3>
          <p className="mt-2">
            Even when light is sent through the slits one photon at a time, the interference pattern still emerges 
            over time. This demonstrates the wave-particle duality of light - it behaves as both a wave and a particle.
          </p>
          <p className="mt-2">
            This principle extends beyond light to all matter, as formulated in de Broglie's hypothesis:
          </p>
          <div className="bg-gray-100 p-2 rounded my-1 text-center font-medium border border-gray-200">
            λ = h/p
          </div>
          <p>
            Where λ is the wavelength, h is Planck's constant, and p is momentum. This means all particles 
            exhibit wave-like properties, which become observable for very small particles.
          </p>
        </div>
        
        <div>
          <h3 className="font-semibold text-indigo-700">Single-Slit Diffraction</h3>
          <p className="mt-1">
            The width of each slit also affects the pattern through single-slit diffraction, which modulates 
            the overall intensity of the double-slit interference pattern. The minima for single-slit diffraction occur at:
          </p>
          <div className="bg-gray-100 p-2 rounded my-2 text-center font-medium">
            a sin θ = nλ (where n = ±1, ±2, ...)
          </div>
          <p>
            Where a is the slit width and n is the order of the minimum.
          </p>
        </div>
        
        <div className="text-xs text-gray-600 pt-2 border-t border-gray-200">
          <p>
            The double-slit experiment stands as one of the most beautiful demonstrations of quantum mechanics, 
            illustrating both the wave and particle nature of light and matter. Modern variants have been performed 
            with electrons, neutrons, atoms, and even large molecules, all showing similar interference effects.
          </p>
        </div>
      </div>
    </div>
  );
}