"use client";

import { useCircuit, ComponentType } from "./CircuitContext";
import { cn } from "@/lib/utils";

const COMPONENTS = [
  { type: "resistor", name: "Resistor", icon: "⊗" },
  { type: "capacitor", name: "Capacitor", icon: "⊥⊥" },
  { type: "battery", name: "Battery", icon: "⎓" },
  { type: "switch", name: "Switch", icon: "⏻" },
  { type: "wire", name: "Wire", icon: "━" },
];

export default function ComponentPanel() {
  const { state, dispatch } = useCircuit();
  
  const handleDragStart = (type: ComponentType) => {
    dispatch({ type: "SET_DRAGGED_COMPONENT", componentType: type });
  };
  
  const handleDragEnd = () => {
    dispatch({ type: "SET_DRAGGED_COMPONENT", componentType: null });
  };

  return (
    <div className="w-64 bg-gray-800 text-white p-4 overflow-y-auto">
      <h2 className="text-xl font-bold mb-4">Components</h2>
      
      <div className="space-y-2">
        {COMPONENTS.map((component) => (
          <div
            key={component.type}
            draggable
            onDragStart={() => handleDragStart(component.type as ComponentType)}
            onDragEnd={handleDragEnd}
            className={cn(
              "bg-gray-700 p-4 rounded flex items-center cursor-grab",
              "hover:bg-gray-600 transition"
            )}
          >
            <span className="text-2xl mr-3">{component.icon}</span>
            <span>{component.name}</span>
          </div>
        ))}
      </div>
      
      <div className="mt-8 p-4 bg-gray-700 rounded">
        <h3 className="font-medium mb-2">Instructions:</h3>
        <ul className="list-disc pl-4 text-sm">
          <li>Drag components onto the canvas</li>
          <li>Click to select and move components</li>
          <li>Connect terminals by clicking and dragging between components</li>
          <li>Right-click to delete components</li>
        </ul>
      </div>
    </div>
  );
}