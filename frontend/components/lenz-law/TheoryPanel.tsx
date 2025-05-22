"use client";

export default function TheoryPanel() {
  return (
    <div className="bg-gray-900 p-4 rounded-lg shadow-lg mb-4 border border-gray-800">
      <h2 className="text-xl font-semibold mb-4 text-white">Lenz's Law Explained</h2>
      
      <div className="space-y-4 text-sm">
        <div>
          <h3 className="font-semibold text-blue-300">What is Lenz's Law?</h3>
          <p className="mt-1 text-gray-300">
            Lenz's law states that an induced electric current flows in a direction such that 
            the current opposes the change that induced it. It's a manifestation of conservation of energy.
          </p>
        </div>
        
        <div>
          <h3 className="font-semibold text-blue-300">The Physics Explained</h3>
          <p className="mt-1 text-gray-300">
            When a magnet moves near a coil of wire:
          </p>
          <ol className="list-decimal pl-5 mt-1 space-y-1 text-gray-300">
            <li>The changing magnetic field creates a changing magnetic flux through the coil</li>
            <li>According to Faraday's Law, this induces an electromotive force (EMF): <strong className="text-white">EMF = -dΦ/dt</strong></li>
            <li>The negative sign represents Lenz's Law - the induced current creates its own magnetic field that opposes the change</li>
          </ol>
        </div>
        
        <div className="bg-gray-800 p-3 rounded border border-gray-700">
          <h3 className="font-semibold text-blue-300">Key Equations</h3>
          <div className="space-y-2 mt-2 text-gray-300">
            <div>
              <div className="font-medium text-white">Magnetic Flux (Φ):</div>
              <div className="pl-4 font-mono">Φ = B·A·cosθ</div>
            </div>
            <div>
              <div className="font-medium text-white">Faraday's Law with Lenz's Law:</div>
              <div className="pl-4 font-mono">EMF = -N·(dΦ/dt)</div>
            </div>
            <div>
              <div className="font-medium text-white">Induced Current:</div>
              <div className="pl-4 font-mono">I = EMF / R</div>
            </div>
          </div>
          <div className="mt-2 text-xs text-gray-400">
            where N is the number of turns in the coil, and R is the resistance.
          </div>
        </div>
        
        <div>
          <h3 className="font-semibold text-blue-300">Real-World Applications</h3>
          <ul className="list-disc pl-5 mt-1 text-gray-300">
            <li>Electric generators and alternators</li>
            <li>Transformers and inductors</li>
            <li>Induction cooktops</li>
            <li>Electromagnetic braking systems</li>
            <li>Metal detectors</li>
          </ul>
        </div>
        
        <div className="text-xs text-gray-400 pt-2 border-t border-gray-700">
          <p>
            Experiment with the simulator to see how changing the magnet strength, coil properties, 
            and movement speed affects the induced current.
          </p>
        </div>
      </div>
    </div>
  );
}