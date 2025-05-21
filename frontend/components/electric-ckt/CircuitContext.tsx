"use client";

import React, { createContext, useContext, useState, useReducer } from "react";
import { v4 as uuidv4 } from "uuid";

// Define component types
export type ComponentType = "resistor" | "capacitor" | "battery" | "switch" | "wire";

// Circuit component interface
export interface CircuitComponent {
  id: string;
  type: ComponentType;
  x: number;
  y: number;
  rotation: number;
  value?: number; // e.g. resistance in ohms, voltage in volts
  state?: boolean; // for switches: on/off
}

// Connection between two components
export interface Connection {
  id: string;
  from: {
    componentId: string;
    terminal: "start" | "end";
  };
  to: {
    componentId: string;
    terminal: "start" | "end";
  };
}

// Electron interface for visualization
export interface Electron {
  id: string;
  connectionId: string;
  position: number; // 0 to 1 representing position along the connection
  direction: 1 | -1; // 1 for forward, -1 for reverse flow
}

// Circuit state
interface CircuitState {
  components: CircuitComponent[];
  connections: Connection[];
  selectedComponent: string | null;
  draggedComponentType: ComponentType | null;
  connectingFrom: { componentId: string; terminal: "start" | "end" } | null;
  simulation: {
    isRunning: boolean;
    currentFlow: number; // Amperes
    electronSpeed: number; // Animation speed multiplier
  };
  electrons: Electron[];
}

// Actions
type CircuitAction = 
  | { type: "ADD_COMPONENT"; component: CircuitComponent }
  | { type: "MOVE_COMPONENT"; id: string; x: number; y: number }
  | { type: "ROTATE_COMPONENT"; id: string }
  | { type: "DELETE_COMPONENT"; id: string }
  | { type: "SELECT_COMPONENT"; id: string | null }
  | { type: "SET_DRAGGED_COMPONENT"; componentType: ComponentType | null }
  | { type: "START_CONNECTION"; componentId: string; terminal: "start" | "end" }
  | { type: "COMPLETE_CONNECTION"; componentId: string; terminal: "start" | "end" }
  | { type: "CANCEL_CONNECTION" }
  | { type: "ADD_CONNECTION"; connection: Connection }
  | { type: "DELETE_CONNECTION"; id: string }
  | { type: "TOGGLE_SWITCH"; id: string }
  | { type: "UPDATE_COMPONENT_VALUE"; id: string; value: number }
  | { type: "START_SIMULATION" }
  | { type: "STOP_SIMULATION" }
  | { type: "UPDATE_SIMULATION"; currentFlow?: number; electronSpeed?: number }
  | { type: "UPDATE_ELECTRONS"; electrons: Electron[] };

// Initial state
const initialCircuitState: CircuitState = {
  components: [],
  connections: [],
  selectedComponent: null,
  draggedComponentType: null,
  connectingFrom: null,
  simulation: {
    isRunning: false,
    currentFlow: 0.5, // Default current (Amperes)
    electronSpeed: 1.0 // Default speed multiplier
  },
  electrons: []
};

// Reducer function
function circuitReducer(state: CircuitState, action: CircuitAction): CircuitState {
  switch (action.type) {
    case "ADD_COMPONENT":
      return {
        ...state,
        components: [...state.components, action.component],
      };
    
    case "MOVE_COMPONENT":
      return {
        ...state,
        components: state.components.map(component =>
          component.id === action.id
            ? { ...component, x: action.x, y: action.y }
            : component
        ),
      };
    
    case "ROTATE_COMPONENT":
      return {
        ...state,
        components: state.components.map(component =>
          component.id === action.id
            ? { ...component, rotation: (component.rotation + 90) % 360 }
            : component
        ),
      };
    
    case "DELETE_COMPONENT":
      // Also delete connections involving this component
      const updatedConnections = state.connections.filter(
        conn => conn.from.componentId !== action.id && conn.to.componentId !== action.id
      );
      
      return {
        ...state,
        components: state.components.filter(c => c.id !== action.id),
        connections: updatedConnections,
        selectedComponent: state.selectedComponent === action.id ? null : state.selectedComponent,
      };
    
    case "SELECT_COMPONENT":
      return {
        ...state,
        selectedComponent: action.id,
      };
    
    case "SET_DRAGGED_COMPONENT":
      return {
        ...state,
        draggedComponentType: action.componentType,
      };
    
    case "START_CONNECTION":
      return {
        ...state,
        connectingFrom: {
          componentId: action.componentId,
          terminal: action.terminal,
        },
      };
    
    case "COMPLETE_CONNECTION":
      if (!state.connectingFrom) return state;
      
      // Prevent self-connections
      if (state.connectingFrom.componentId === action.componentId) {
        return state;
      }
      
      const newConnection: Connection = {
        id: uuidv4(),
        from: state.connectingFrom,
        to: {
          componentId: action.componentId,
          terminal: action.terminal,
        },
      };
      
      return {
        ...state,
        connections: [...state.connections, newConnection],
        connectingFrom: null,
      };
    
    case "CANCEL_CONNECTION":
      return {
        ...state,
        connectingFrom: null,
      };
    
    case "ADD_CONNECTION":
      return {
        ...state,
        connections: [...state.connections, action.connection],
      };
    
    case "DELETE_CONNECTION":
      return {
        ...state,
        connections: state.connections.filter(c => c.id !== action.id),
      };
    
    case "TOGGLE_SWITCH":
      return {
        ...state,
        components: state.components.map(component =>
          component.id === action.id && component.type === "switch"
            ? { ...component, state: !component.state }
            : component
        ),
      };
    
    case "UPDATE_COMPONENT_VALUE":
      return {
        ...state,
        components: state.components.map(component =>
          component.id === action.id
            ? { ...component, value: action.value }
            : component
        ),
      };
      
    case "START_SIMULATION":
      return {
        ...state,
        simulation: {
          ...state.simulation,
          isRunning: true
        },
      };
    
    case "STOP_SIMULATION":
      return {
        ...state,
        simulation: {
          ...state.simulation,
          isRunning: false
        },
        electrons: [] // Clear electrons when stopping
      };
    
    case "UPDATE_SIMULATION":
      return {
        ...state,
        simulation: {
          ...state.simulation,
          currentFlow: action.currentFlow ?? state.simulation.currentFlow,
          electronSpeed: action.electronSpeed ?? state.simulation.electronSpeed
        }
      };
      
    case "UPDATE_ELECTRONS":
      return {
        ...state,
        electrons: action.electrons
      };
    
    default:
      return state;
  }
}

// Create the context
interface CircuitContextType {
  state: CircuitState;
  dispatch: React.Dispatch<CircuitAction>;
}

const CircuitContext = createContext<CircuitContextType | undefined>(undefined);

// Provider component
export function CircuitProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(circuitReducer, initialCircuitState);
  
  return (
    <CircuitContext.Provider value={{ state, dispatch }}>
      {children}
    </CircuitContext.Provider>
  );
}

// Custom hook for using the circuit context
export function useCircuit() {
  const context = useContext(CircuitContext);
  if (context === undefined) {
    throw new Error('useCircuit must be used within a CircuitProvider');
  }
  return context;
}