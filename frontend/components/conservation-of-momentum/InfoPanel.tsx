"use client";

import { useState } from "react";
import { 
  FaArrowRight, 
  FaChevronDown, 
  FaChevronUp 
} from "react-icons/fa";

export default function InfoPanel() {
  const [isExpanded, setIsExpanded] = useState(false);
  
  return (
    <div className="bg-white p-6 rounded-xl shadow-lg">
      <div 
        className="flex items-center justify-between cursor-pointer"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <h2 className="text-xl font-semibold text-blue-800">
          What is Conservation of Momentum?
        </h2>
        {isExpanded ? <FaChevronUp /> : <FaChevronDown />}
      </div>
      
      {isExpanded && (
        <div className="mt-4 space-y-4">
          <p className="text-gray-700">
            Conservation of momentum is a fundamental principle in physics that states that 
            the total momentum of an isolated system remains constant over time, regardless 
            of what happens inside the system.
          </p>
          
          <div className="bg-blue-50 p-4 rounded-lg">
            <h3 className="text-lg font-medium text-blue-800 mb-2">The Mathematical Formula:</h3>
            <p className="font-mono text-center text-lg my-3">
              m₁v₁ + m₂v₂ = m₁v₁′ + m₂v₂′
            </p>
            <p className="text-sm text-gray-600">
              Where m₁ and m₂ are the masses, v₁ and v₂ are the initial velocities, 
              and v₁′ and v₂′ are the final velocities after collision.
            </p>
          </div>
          
          <div className="bg-purple-50 p-4 rounded-lg">
            <h3 className="text-lg font-medium text-purple-800 mb-2">For Elastic Collisions:</h3>
            <p className="text-gray-700">
              In an elastic collision, both momentum and kinetic energy are conserved. 
              The final velocities can be calculated using:
            </p>
            <div className="my-3 space-y-2">
              <p className="font-mono text-center">
                v₁′ = ((m₁-m₂)v₁ + 2m₂v₂) / (m₁+m₂)
              </p>
              <p className="font-mono text-center">
                v₂′ = ((m₂-m₁)v₂ + 2m₁v₁) / (m₁+m₂)
              </p>
            </div>
          </div>
          
          <div className="flex items-center space-x-3 text-gray-700">
            <div className="w-3 h-3 rounded-full bg-blue-500"></div>
            <p>Ball 1</p>
            <FaArrowRight />
            <div className="w-3 h-3 rounded-full bg-purple-500"></div>
            <p>Ball 2</p>
          </div>
          
          <p className="text-sm text-gray-600">
            This simulation demonstrates perfectly elastic collisions, where both momentum 
            and kinetic energy are conserved. Try different mass and velocity combinations 
            to see how the conservation principles work!
          </p>
        </div>
      )}
    </div>
  );
}