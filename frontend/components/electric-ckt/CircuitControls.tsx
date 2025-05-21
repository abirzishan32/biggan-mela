"use client";

import { useState } from "react";
import { useCircuit, CircuitComponent } from "./CircuitContext";
import { v4 as uuidv4 } from "uuid";

export default function CircuitControls() {
  const { state, dispatch } = useCircuit();
  
  const selectedComponent = state.components.find(
    (c) => c.id === state.selectedComponent
  );
  
  const handleValueChange = (value: number) => {
    if (state.selectedComponent) {
      dispatch({
        type: "UPDATE_COMPONENT_VALUE",
        id: state.selectedComponent,
        value,
      });
    }
  };
  
  const resetCircuit = () => {
    dispatch({ type: "SELECT_COMPONENT", id: null });
    state.components.forEach(component => {
      dispatch({ type: "DELETE_COMPONENT", id: component.id });
    });
  };
  
  const toggleSimulation = () => {
    if (state.simulation.isRunning) {
      dispatch({ type: "STOP_SIMULATION" });
    } else {
      // Start simulation
      dispatch({ type: "START_SIMULATION" });
      
      // Calculate circuit properties
      const totalVoltage = calculateTotalVoltage(state.components);
      const totalResistance = calculateTotalResistance(state.components);
      
      // Using Ohm's Law: I = V/R
      const currentFlow = totalResistance > 0 
        ? totalVoltage / totalResistance 
        : 0;
      
      // Update simulation parameters
      dispatch({ 
        type: "UPDATE_SIMULATION",
        currentFlow: Math.min(Math.max(currentFlow, 0.1), 2), // Limit between 0.1A and 2A
        electronSpeed: Math.min(Math.max(currentFlow * 0.5, 0.2), 2) // Speed based on current
      });
      
      // Initialize electrons
      initializeElectrons();
    }
  };
  
  // Initialize electrons on the connections
  const initializeElectrons = () => {
    const newElectrons = [];
    
    for (const connection of state.connections) {
      // Check for open switches that would break the circuit
      const fromComponent = state.components.find(c => c.id === connection.from.componentId);
      const toComponent = state.components.find(c => c.id === connection.to.componentId);
      
      if (!fromComponent || !toComponent) continue;
      
      // Skip if there's an open switch
      if ((fromComponent.type === "switch" && fromComponent.state === false) ||
          (toComponent.type === "switch" && toComponent.state === false)) {
        continue;
      }
      
      // Determine flow direction (simplified)
      const flowDirection = determineFlowDirection(connection, state.components);
      
      // Number of electrons based on current flow
      const electronCount = Math.ceil(3 + state.simulation.currentFlow * 5);
      
      for (let i = 0; i < electronCount; i++) {
        newElectrons.push({
          id: uuidv4(),
          connectionId: connection.id,
          position: Math.random(), // Random position along connection
          direction: flowDirection
        });
      }
    }
    
    dispatch({ type: "UPDATE_ELECTRONS", electrons: newElectrons });
  };
  
  // Determine flow direction in a connection (simplified)
  const determineFlowDirection = (connection: any, components: CircuitComponent[]): 1 | -1 => {
    const fromComponent = components.find(c => c.id === connection.from.componentId);
    const toComponent = components.find(c => c.id === connection.to.componentId);
    
    if (!fromComponent || !toComponent) return 1;
    
    // Simple rule: flow from battery positive to other components
    if (fromComponent.type === "battery") {
      return 1;
    } else if (toComponent.type === "battery") {
      return -1;
    }
    
    // Default flow direction
    return 1;
  };
  
  // Calculate total voltage from batteries
  function calculateTotalVoltage(components: CircuitComponent[]): number {
    return components
      .filter(c => c.type === "battery")
      .reduce((sum, battery) => {
        // Skip batteries in open circuit branches
        return sum + (battery.value || 0);
      }, 0);
  }
  
  // Calculate total resistance (simplified)
  function calculateTotalResistance(components: CircuitComponent[]): number {
    const resistors = components.filter(c => c.type === "resistor");
    const totalResistance = resistors.reduce((sum, resistor) => sum + (resistor.value || 0), 0);
    
    // If no resistors, use a small value to avoid division by zero
    return totalResistance > 0 ? totalResistance : 100;
  }
  
  const formatValue = (type: string, value?: number): string => {
    if (value === undefined) return "N/A";
    
    switch (type) {
      case "resistor":
        return value >= 1000 ? `${value/1000} kΩ` : `${value} Ω`;
      case "capacitor":
        return `${value * 1000000} μF`;
      case "battery":
        return `${value} V`;
      default:
        return `${value}`;
    }
  };

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Circuit Controls</h2>
      
      <div className="mb-6">
        <button
          onClick={toggleSimulation}
          className={`w-full p-2 rounded font-medium ${
            state.simulation.isRunning 
              ? "bg-red-500 hover:bg-red-600" 
              : "bg-green-500 hover:bg-green-600"
          } text-white transition`}
        >
          {state.simulation.isRunning ? "Stop Simulation" : "Run Simulation"}
        </button>
      </div>
      
      <div className="mb-6">
        <button
          onClick={resetCircuit}
          className="w-full p-2 rounded bg-gray-300 hover:bg-gray-400 transition"
        >
          Reset Circuit
        </button>
      </div>
      
      {selectedComponent && (
        <div className="bg-white p-3 rounded shadow-md">
          <h3 className="font-medium mb-2 capitalize">
            {selectedComponent.type} Properties
          </h3>
          
          {selectedComponent.type === "switch" ? (
            <div className="mb-4">
              <label className="flex items-center cursor-pointer">
                <span className="mr-2">State:</span>
                <div className="relative">
                  <input
                    type="checkbox"
                    className="sr-only"
                    checked={selectedComponent.state || false}
                    onChange={() => 
                      dispatch({ 
                        type: "TOGGLE_SWITCH", 
                        id: selectedComponent.id 
                      })
                    }
                  />
                  <div className={`w-10 h-5 rounded-full ${
                    selectedComponent.state ? "bg-green-500" : "bg-gray-300"
                  } transition`}></div>
                  <div className={`absolute left-0.5 top-0.5 bg-white w-4 h-4 rounded-full transition transform ${
                    selectedComponent.state ? "translate-x-5" : ""
                  }`}></div>
                </div>
                <span className="ml-2">
                  {selectedComponent.state ? "Closed" : "Open"}
                </span>
              </label>
            </div>
          ) : selectedComponent.value !== undefined && (
            <div className="mb-4">
              <label className="block mb-1">
                Value: {formatValue(selectedComponent.type, selectedComponent.value)}
              </label>
              <input
                type="range"
                min={getMinValue(selectedComponent.type)}
                max={getMaxValue(selectedComponent.type)}
                step={getStepValue(selectedComponent.type)}
                value={selectedComponent.value}
                onChange={(e) => handleValueChange(parseFloat(e.target.value))}
                className="w-full"
              />
            </div>
          )}
          
          <div className="mb-4">
            <label className="block mb-1">Rotation: {selectedComponent.rotation}°</label>
            <button
              onClick={() => 
                dispatch({ 
                  type: "ROTATE_COMPONENT", 
                  id: selectedComponent.id 
                })
              }
              className="w-full p-1 text-sm bg-blue-100 hover:bg-blue-200 rounded transition"
            >
              Rotate 90°
            </button>
          </div>
          
          <button
            onClick={() => 
              dispatch({ 
                type: "DELETE_COMPONENT", 
                id: selectedComponent.id 
              })
            }
            className="w-full p-1 text-sm bg-red-100 hover:bg-red-200 rounded transition"
          >
            Delete Component
          </button>
        </div>
      )}
      
      {state.simulation.isRunning && (
        <div className="mt-6 bg-gray-100 p-3 rounded">
          <h3 className="font-medium mb-2">Simulation Results</h3>
          <p className="text-sm">Current flowing: {state.simulation.currentFlow.toFixed(2)}A</p>
          <p className="text-sm">Total resistance: {(calculateTotalResistance(state.components) / 1000).toFixed(2)}kΩ</p>
          <p className="text-sm">Total voltage: {calculateTotalVoltage(state.components).toFixed(1)}V</p>
          <p className="text-sm">Power: {(state.simulation.currentFlow * calculateTotalVoltage(state.components)).toFixed(2)}W</p>
          
          <div className="mt-3">
            <label className="block text-sm font-medium">Electron Speed</label>
            <input
              type="range"
              min="0.2"
              max="2"
              step="0.1"
              value={state.simulation.electronSpeed}
              onChange={(e) => dispatch({
                type: "UPDATE_SIMULATION",
                electronSpeed: parseFloat(e.target.value)
              })}
              className="w-full mt-1"
            />
            <div className="flex justify-between text-xs text-gray-500">
              <span>Slow</span>
              <span>Fast</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Helper functions to get range input values based on component type
function getMinValue(type: string): number {
  switch (type) {
    case "resistor": return 10;       // 10 ohms
    case "capacitor": return 0.000001; // 1 μF
    case "battery": return 1.5;       // 1.5 volts
    default: return 0;
  }
}

function getMaxValue(type: string): number {
  switch (type) {
    case "resistor": return 10000;     // 10k ohms
    case "capacitor": return 0.001;    // 1000 μF
    case "battery": return 24;         // 24 volts
    default: return 100;
  }
}

function getStepValue(type: string): number {
  switch (type) {
    case "resistor": return 10;
    case "capacitor": return 0.000001;
    case "battery": return 0.5;
    default: return 1;
  }
}