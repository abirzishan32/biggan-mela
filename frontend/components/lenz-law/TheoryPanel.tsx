"use client";

export default function TheoryPanel() {
  return (
    <div className="bg-white p-4 rounded-lg shadow">
      <h2 className="text-xl font-semibold mb-4">Lenz's Law Explained</h2>
      
      <div className="space-y-4 text-sm">
        <div>
          <h3 className="font-semibold text-indigo-700">What is Lenz's Law?</h3>
          <p className="mt-1">
            Lenz's law states that an induced electric current flows in a direction such that 
            the current opposes the change that induced it. It's a manifestation of conservation of energy.
          </p>
        </div>
        
        <div>
          <h3 className="font-semibold text-indigo-700">The Physics Explained</h3>
          <p className="mt-1">
            When a magnet moves near a coil of wire:
          </p>
          <ol className="list-decimal pl-5 mt-1 space-y-1">
            <li>The changing magnetic field creates a changing magnetic flux through the coil</li>
            <li>According to Faraday's Law, this induces an electromotive force (EMF): <strong>EMF = -dΦ/dt</strong></li>
            <li>The negative sign represents Lenz's Law - the induced current creates its own magnetic field that opposes the change</li>
          </ol>
        </div>
        
        <div className="bg-gray-100 p-3 rounded">
          <h3 className="font-semibold">Key Equations</h3>
          <div className="space-y-2 mt-2">
            <div>
              <div className="font-medium">Magnetic Flux (Φ):</div>
              <div className="pl-4">Φ = B·A·cosθ</div>
            </div>
            <div>
              <div className="font-medium">Faraday's Law with Lenz's Law:</div>
              <div className="pl-4">EMF = -N·(dΦ/dt)</div>
            </div>
            <div>
              <div className="font-medium">Induced Current:</div>
              <div className="pl-4">I = EMF / R</div>
            </div>
          </div>
          <div className="mt-2 text-xs text-gray-600">
            where N is the number of turns in the coil, and R is the resistance.
          </div>
        </div>
        
        <div>
          <h3 className="font-semibold text-indigo-700">Real-World Applications</h3>
          <ul className="list-disc pl-5 mt-1">
            <li>Electric generators and alternators</li>
            <li>Transformers and inductors</li>
            <li>Induction cooktops</li>
            <li>Electromagnetic braking systems</li>
            <li>Metal detectors</li>
          </ul>
        </div>
        
        <div className="text-xs text-gray-600 pt-2 border-t border-gray-200">
          <p>
            Experiment with the simulator to see how changing the magnet strength, coil properties, 
            and movement speed affects the induced current.
          </p>
        </div>
      </div>
    </div>
  );
}