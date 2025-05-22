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
    <div className="w-72 bg-gray-800 text-white p-4 overflow-y-auto border-r border-gray-700">
      <h2 className="text-xl font-bold mb-4 text-blue-300">Components</h2>
      
      <div className="space-y-2">
        {COMPONENTS.map((component) => (
          <div
            key={component.type}
            draggable
            onDragStart={() => handleDragStart(component.type as ComponentType)}
            onDragEnd={handleDragEnd}
            className={cn(
              "bg-gray-700 p-4 rounded-md flex items-center cursor-grab",
              "hover:bg-gray-600 transition border border-gray-600"
            )}
          >
            <span className="text-2xl mr-3 text-blue-300">{component.icon}</span>
            <span>{component.name}</span>
          </div>
        ))}
      </div>
      
      <div className="mt-8 p-4 bg-gray-700 rounded-md border border-gray-600">
        <h3 className="font-medium mb-2 text-blue-300">Instructions:</h3>
        <ul className="list-disc pl-4 text-sm space-y-2 text-gray-200">
          <li>Drag components onto the canvas</li>
          <li>Click to select and move components</li>
          <li>Connect terminals by clicking and dragging between components</li>
          <li>Right-click to delete components</li>
        </ul>
      </div>
      
      <div className="mt-8 p-4 bg-gray-900 rounded-md border border-gray-700">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center">
            <div className="h-3 w-3 rounded-full bg-blue-400 mr-2"></div>
            <span className="text-xs text-gray-300">Electron</span>
          </div>
          <div className="flex items-center">
            <div className="h-3 w-3 rounded-full bg-green-400 mr-2"></div>
            <span className="text-xs text-gray-300">Switch (on)</span>
          </div>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <div className="h-3 w-3 rounded-full bg-red-400 mr-2"></div>
            <span className="text-xs text-gray-300">Selected</span>
          </div>
          <div className="flex items-center">
            <div className="h-1 w-8 border-t-2 border-dashed border-gray-400 mr-2"></div>
            <span className="text-xs text-gray-300">Open circuit</span>
          </div>
        </div>
      </div>
    </div>
  );
}