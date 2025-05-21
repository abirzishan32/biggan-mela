"use client";

import { useRef, useEffect, useState } from "react";
import { useCircuit, CircuitComponent, ComponentType, Electron } from "./CircuitContext";
import { v4 as uuidv4 } from "uuid";

// Component rendering functions
const componentRenderers = {
  resistor: (ctx: CanvasRenderingContext2D, x: number, y: number, rotation: number) => {
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate((rotation * Math.PI) / 180);
    
    // Draw resistor symbol
    ctx.beginPath();
    ctx.moveTo(-40, 0);
    ctx.lineTo(-30, 0);
    ctx.lineTo(-25, -10);
    ctx.lineTo(-15, 10);
    ctx.lineTo(-5, -10);
    ctx.lineTo(5, 10);
    ctx.lineTo(15, -10);
    ctx.lineTo(25, 10);
    ctx.lineTo(30, 0);
    ctx.lineTo(40, 0);
    ctx.stroke();
    
    // Draw terminals
    ctx.fillStyle = "#333";
    ctx.beginPath();
    ctx.arc(-40, 0, 5, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(40, 0, 5, 0, Math.PI * 2);
    ctx.fill();
    
    ctx.restore();
  },
  
  capacitor: (ctx: CanvasRenderingContext2D, x: number, y: number, rotation: number) => {
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate((rotation * Math.PI) / 180);
    
    // Draw capacitor plates
    ctx.beginPath();
    ctx.moveTo(-40, 0);
    ctx.lineTo(-10, 0);
    ctx.moveTo(-5, -20);
    ctx.lineTo(-5, 20);
    ctx.moveTo(5, -20);
    ctx.lineTo(5, 20);
    ctx.moveTo(10, 0);
    ctx.lineTo(40, 0);
    ctx.stroke();
    
    // Draw terminals
    ctx.fillStyle = "#333";
    ctx.beginPath();
    ctx.arc(-40, 0, 5, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(40, 0, 5, 0, Math.PI * 2);
    ctx.fill();
    
    ctx.restore();
  },
  
  battery: (ctx: CanvasRenderingContext2D, x: number, y: number, rotation: number) => {
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate((rotation * Math.PI) / 180);
    
    // Draw battery symbol
    ctx.beginPath();
    ctx.moveTo(-40, 0);
    ctx.lineTo(-10, 0);
    
    // Negative terminal
    ctx.moveTo(-5, -15);
    ctx.lineTo(-5, 15);
    
    // Positive terminal
    ctx.moveTo(5, -20);
    ctx.lineTo(5, 20);
    ctx.moveTo(-5, 0);
    ctx.lineTo(15, 0);
    
    ctx.moveTo(10, 0);
    ctx.lineTo(40, 0);
    ctx.stroke();
    
    // Draw terminals
    ctx.fillStyle = "#333";
    ctx.beginPath();
    ctx.arc(-40, 0, 5, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(40, 0, 5, 0, Math.PI * 2);
    ctx.fill();
    
    ctx.restore();
  },
  
  switch: (ctx: CanvasRenderingContext2D, x: number, y: number, rotation: number, isOn: boolean = false) => {
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate((rotation * Math.PI) / 180);
    
    // Draw switch base
    ctx.beginPath();
    ctx.moveTo(-40, 0);
    ctx.lineTo(-10, 0);
    
    // Draw pivot point
    ctx.beginPath();
    ctx.arc(-5, 0, 3, 0, Math.PI * 2);
    ctx.fill();
    
    // Draw the switch lever
    ctx.beginPath();
    if (isOn) {
      // Closed switch - connected
      ctx.moveTo(-5, 0);
      ctx.lineTo(40, 0);
    } else {
      // Open switch - disconnected
      ctx.moveTo(-5, 0);
      ctx.lineTo(30, -15);
    }
    ctx.stroke();
    
    // Draw the contact point
    ctx.beginPath();
    ctx.arc(30, 0, 3, 0, Math.PI * 2);
    ctx.stroke();
    
    // Draw terminals
    ctx.fillStyle = "#333";
    ctx.beginPath();
    ctx.arc(-40, 0, 5, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(40, 0, 5, 0, Math.PI * 2);
    ctx.fill();
    
    ctx.restore();
  },
  
  wire: (ctx: CanvasRenderingContext2D, x: number, y: number, rotation: number) => {
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate((rotation * Math.PI) / 180);
    
    // Draw wire
    ctx.beginPath();
    ctx.moveTo(-40, 0);
    ctx.lineTo(40, 0);
    ctx.stroke();
    
    // Draw terminals
    ctx.fillStyle = "#333";
    ctx.beginPath();
    ctx.arc(-40, 0, 5, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(40, 0, 5, 0, Math.PI * 2);
    ctx.fill();
    
    ctx.restore();
  }
};

export default function CircuitCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { state, dispatch } = useCircuit();
  const [isDrawing, setIsDrawing] = useState(false);
  const [mousePos, setMousePos] = useState<{ x: number, y: number }>({ x: 0, y: 0 });
  const animationRef = useRef<number | null>(null);
  const lastFrameTimeRef = useRef<number>(0);
  
  // Handle component drag and drop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const handleDragOver = (e: DragEvent) => {
      e.preventDefault();
    };
    
    const handleDrop = (e: DragEvent) => {
      e.preventDefault();
      
      if (state.draggedComponentType) {
        const rect = canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        const newComponent: CircuitComponent = {
          id: uuidv4(),
          type: state.draggedComponentType,
          x,
          y,
          rotation: 0,
          value: getDefaultValue(state.draggedComponentType),
          state: state.draggedComponentType === "switch" ? false : undefined
        };
        
        dispatch({ type: "ADD_COMPONENT", component: newComponent });
      }
    };
    
    canvas.addEventListener("dragover", handleDragOver);
    canvas.addEventListener("drop", handleDrop);
    
    return () => {
      canvas.removeEventListener("dragover", handleDragOver);
      canvas.removeEventListener("drop", handleDrop);
    };
  }, [state.draggedComponentType, dispatch]);
  
  // Electron animation
  useEffect(() => {
    if (!state.simulation.isRunning || state.electrons.length === 0) {
      if (animationRef.current !== null) {
        cancelAnimationFrame(animationRef.current);
        animationRef.current = null;
      }
      return;
    }
    
    const animateElectrons = (timestamp: number) => {
      // Calculate time delta since last frame (for consistent animation speed)
      const delta = lastFrameTimeRef.current === 0 ? 0 : (timestamp - lastFrameTimeRef.current) / 16.67;
      lastFrameTimeRef.current = timestamp;
      
      // Update electron positions
      const updatedElectrons = state.electrons.map(electron => {
        // Speed based on simulation settings, adjusted by time delta
        const speed = 0.01 * state.simulation.electronSpeed * (delta || 1);
        
        // Move electron along the connection
        let newPosition = electron.position + (speed * electron.direction);
        
        // Wrap around if electron reaches end of connection
        if (newPosition > 1) newPosition = newPosition - Math.floor(newPosition);
        if (newPosition < 0) newPosition = 1 + newPosition - Math.floor(newPosition);
        
        return {
          ...electron,
          position: newPosition
        };
      });
      
      dispatch({ type: "UPDATE_ELECTRONS", electrons: updatedElectrons });
      
      // Continue animation
      animationRef.current = requestAnimationFrame(animateElectrons);
    };
    
    animationRef.current = requestAnimationFrame(animateElectrons);
    
    return () => {
      if (animationRef.current !== null) {
        cancelAnimationFrame(animationRef.current);
        animationRef.current = null;
      }
      lastFrameTimeRef.current = 0;
    };
  }, [state.simulation.isRunning, state.electrons.length, state.simulation.electronSpeed]);
  
  // Get terminal positions for a component
  const getTerminalPositions = (component: CircuitComponent) => {
    const angleInRad = (component.rotation * Math.PI) / 180;
    const startX = component.x - 40 * Math.cos(angleInRad);
    const startY = component.y - 40 * Math.sin(angleInRad);
    const endX = component.x + 40 * Math.cos(angleInRad);
    const endY = component.y + 40 * Math.sin(angleInRad);
    
    return {
      start: { x: startX, y: startY },
      end: { x: endX, y: endY }
    };
  };
  
  // Get default component value
  const getDefaultValue = (type: ComponentType): number | undefined => {
    switch (type) {
      case "resistor": return 1000; // 1k ohm
      case "capacitor": return 0.000001; // 1µF
      case "battery": return 9; // 9V
      default: return undefined;
    }
  };
  
  // Handle mouse events for component interaction
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const handleMouseDown = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      // Right click for deleting components
      if (e.button === 2) {
        // Check if we're clicking on a component
        const clickedComponent = findComponentAtPosition(x, y);
        if (clickedComponent) {
          dispatch({ type: "DELETE_COMPONENT", id: clickedComponent.id });
          return;
        }
        
        // Check if we're clicking on a connection
        const clickedConnection = findConnectionAtPosition(x, y);
        if (clickedConnection) {
          dispatch({ type: "DELETE_CONNECTION", id: clickedConnection.id });
          return;
        }
      }
      
      // Left click
      if (e.button === 0) {
        // Check if we're clicking on a component terminal
        const terminalInfo = findTerminalAtPosition(x, y);
        if (terminalInfo && state.connectingFrom) {
          // Complete the connection
          dispatch({
            type: "COMPLETE_CONNECTION",
            componentId: terminalInfo.componentId,
            terminal: terminalInfo.terminal,
          });
          return;
        } else if (terminalInfo) {
          // Start a new connection
          dispatch({
            type: "START_CONNECTION",
            componentId: terminalInfo.componentId,
            terminal: terminalInfo.terminal,
          });
          return;
        }
        
        // Check if we're clicking on a component
        const clickedComponent = findComponentAtPosition(x, y);
        if (clickedComponent) {
          if (clickedComponent.type === "switch") {
            // Toggle switch
            dispatch({ type: "TOGGLE_SWITCH", id: clickedComponent.id });
          } else {
            // Select component for moving
            dispatch({ type: "SELECT_COMPONENT", id: clickedComponent.id });
            setIsDrawing(true);
          }
          return;
        }
        
        // If we click on empty space, deselect current component
        dispatch({ type: "SELECT_COMPONENT", id: null });
        
        // If we're establishing a connection, cancel it on empty space click
        if (state.connectingFrom) {
          dispatch({ type: "CANCEL_CONNECTION" });
        }
      }
    };
    
    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      setMousePos({ x, y });
      
      // If we're dragging a selected component, move it
      if (isDrawing && state.selectedComponent) {
        dispatch({
          type: "MOVE_COMPONENT",
          id: state.selectedComponent,
          x,
          y,
        });
      }
    };
    
    const handleMouseUp = () => {
      setIsDrawing(false);
    };
    
    const handleKeyDown = (e: KeyboardEvent) => {
      // Handle rotation with 'R' key
      if (e.key === "r" && state.selectedComponent) {
        dispatch({ type: "ROTATE_COMPONENT", id: state.selectedComponent });
      }
      
      // Handle deletion with 'Delete' key
      if (e.key === "Delete" && state.selectedComponent) {
        dispatch({ type: "DELETE_COMPONENT", id: state.selectedComponent });
      }
      
      // Cancel connection with 'Escape' key
      if (e.key === "Escape" && state.connectingFrom) {
        dispatch({ type: "CANCEL_CONNECTION" });
      }
    };
    
    // Handle context menu (prevent default right-click menu)
    const handleContextMenu = (e: MouseEvent) => {
      e.preventDefault();
    };
    
    canvas.addEventListener("mousedown", handleMouseDown);
    canvas.addEventListener("mousemove", handleMouseMove);
    canvas.addEventListener("mouseup", handleMouseUp);
    window.addEventListener("keydown", handleKeyDown);
    canvas.addEventListener("contextmenu", handleContextMenu);
    
    return () => {
      canvas.removeEventListener("mousedown", handleMouseDown);
      canvas.removeEventListener("mousemove", handleMouseMove);
      canvas.removeEventListener("mouseup", handleMouseUp);
      window.removeEventListener("keydown", handleKeyDown);
      canvas.removeEventListener("contextmenu", handleContextMenu);
    };
  }, [state, dispatch, isDrawing, setIsDrawing]);
  
  // Find a component at a given position
  const findComponentAtPosition = (x: number, y: number) => {
    // We check in reverse order so that components added later (on top) are selected first
    for (let i = state.components.length - 1; i >= 0; i--) {
      const component = state.components[i];
      const distance = Math.sqrt(Math.pow(component.x - x, 2) + Math.pow(component.y - y, 2));
      if (distance < 30) {
        return component;
      }
    }
    return null;
  };
  
  // Find a terminal at a given position
  const findTerminalAtPosition = (x: number, y: number) => {
    for (const component of state.components) {
      const terminals = getTerminalPositions(component);
      
      // Check start terminal
      const startDistance = Math.sqrt(
        Math.pow(terminals.start.x - x, 2) + Math.pow(terminals.start.y - y, 2)
      );
      if (startDistance < 10) {
        return { componentId: component.id, terminal: "start" as const };
      }
      
      // Check end terminal
      const endDistance = Math.sqrt(
        Math.pow(terminals.end.x - x, 2) + Math.pow(terminals.end.y - y, 2)
      );
      if (endDistance < 10) {
        return { componentId: component.id, terminal: "end" as const };
      }
    }
    return null;
  };
  
  // Find a connection at a given position
  const findConnectionAtPosition = (x: number, y: number) => {
    for (const connection of state.connections) {
      // Get the components involved in the connection
      const fromComponent = state.components.find(c => c.id === connection.from.componentId);
      const toComponent = state.components.find(c => c.id === connection.to.componentId);
      
      if (!fromComponent || !toComponent) continue;
      
      // Get terminal positions
      const fromTerminals = getTerminalPositions(fromComponent);
      const toTerminals = getTerminalPositions(toComponent);
      
      const fromPos = connection.from.terminal === "start" ? fromTerminals.start : fromTerminals.end;
      const toPos = connection.to.terminal === "start" ? toTerminals.start : toTerminals.end;
      
      // Calculate distance from line segment
      const distance = distanceToLineSegment(
        fromPos.x, fromPos.y, 
        toPos.x, toPos.y, 
        x, y
      );
      
      if (distance < 5) {
        return connection;
      }
    }
    return null;
  };
  
  // Calculate distance from point to line segment
  const distanceToLineSegment = (
    x1: number, y1: number, 
    x2: number, y2: number, 
    x: number, y: number
  ): number => {
    const A = x - x1;
    const B = y - y1;
    const C = x2 - x1;
    const D = y2 - y1;
    
    const dot = A * C + B * D;
    const lenSq = C * C + D * D;
    let param = -1;
    
    if (lenSq !== 0) {
      param = dot / lenSq;
    }
    
    let xx, yy;
    
    if (param < 0) {
      xx = x1;
      yy = y1;
    } else if (param > 1) {
      xx = x2;
      yy = y2;
    } else {
      xx = x1 + param * C;
      yy = y1 + param * D;
    }
    
    const dx = x - xx;
    const dy = y - yy;
    
    return Math.sqrt(dx * dx + dy * dy);
  };
  
  // Render the canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    
    // Set canvas dimensions
    canvas.width = canvas.clientWidth;
    canvas.height = canvas.clientHeight;
    
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Draw grid
    ctx.strokeStyle = "#eee";
    ctx.lineWidth = 0.5;
    
    for (let x = 0; x < canvas.width; x += 20) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, canvas.height);
      ctx.stroke();
    }
    
    for (let y = 0; y < canvas.height; y += 20) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(canvas.width, y);
      ctx.stroke();
    }
    
    // Draw connections
    ctx.strokeStyle = "#000";
    ctx.lineWidth = 2;
    
    for (const connection of state.connections) {
      const fromComponent = state.components.find(c => c.id === connection.from.componentId);
      const toComponent = state.components.find(c => c.id === connection.to.componentId);
      
      if (fromComponent && toComponent) {
        const fromTerminals = getTerminalPositions(fromComponent);
        const toTerminals = getTerminalPositions(toComponent);
        
        const fromPos = connection.from.terminal === "start" ? fromTerminals.start : fromTerminals.end;
        const toPos = connection.to.terminal === "start" ? toTerminals.start : toTerminals.end;
        
        // Check if this connection involves an open switch
        const isOpen = 
          (fromComponent.type === "switch" && fromComponent.state === false) ||
          (toComponent.type === "switch" && toComponent.state === false);
        
        // Use dashed line for open circuit paths
        if (isOpen) {
          ctx.setLineDash([5, 3]);
          ctx.strokeStyle = "#888";
        } else {
          ctx.setLineDash([]);
          ctx.strokeStyle = "#000";
        }
        
        ctx.beginPath();
        ctx.moveTo(fromPos.x, fromPos.y);
        ctx.lineTo(toPos.x, toPos.y);
        ctx.stroke();
        
        // Reset dash pattern
        ctx.setLineDash([]);
      }
    }
    
    // Draw current connection in progress
    if (state.connectingFrom) {
      const fromComponent = state.components.find(c => c.id === state.connectingFrom?.componentId);
      
      if (fromComponent) {
        const fromTerminals = getTerminalPositions(fromComponent);
        const fromPos = state.connectingFrom.terminal === "start" ? fromTerminals.start : fromTerminals.end;
        
        ctx.beginPath();
        ctx.strokeStyle = "#00f";
        ctx.setLineDash([5, 5]);
        ctx.moveTo(fromPos.x, fromPos.y);
        ctx.lineTo(mousePos.x, mousePos.y);
        ctx.stroke();
        ctx.setLineDash([]);
      }
    }
    
    // Draw electrons when simulation is running
    if (state.simulation.isRunning && state.electrons.length > 0) {
      for (const electron of state.electrons) {
        const connection = state.connections.find(c => c.id === electron.connectionId);
        if (!connection) continue;
        
        const fromComponent = state.components.find(c => c.id === connection.from.componentId);
        const toComponent = state.components.find(c => c.id === connection.to.componentId);
        
        if (!fromComponent || !toComponent) continue;
        
        // Skip electrons on connections with open switches
        if ((fromComponent.type === "switch" && fromComponent.state === false) ||
            (toComponent.type === "switch" && toComponent.state === false)) {
          continue;
        }
        
        const fromTerminals = getTerminalPositions(fromComponent);
        const toTerminals = getTerminalPositions(toComponent);
        
        const fromPos = connection.from.terminal === "start" ? fromTerminals.start : fromTerminals.end;
        const toPos = connection.to.terminal === "start" ? toTerminals.start : toTerminals.end;
        
        // Interpolate position
        const x = fromPos.x + (toPos.x - fromPos.x) * electron.position;
        const y = fromPos.y + (toPos.y - fromPos.y) * electron.position;
        
        // Draw electron glow effect
        const gradient = ctx.createRadialGradient(x, y, 1, x, y, 4);
        gradient.addColorStop(0, "rgba(0, 163, 255, 0.8)");
        gradient.addColorStop(1, "rgba(0, 163, 255, 0)");
        
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(x, y, 4, 0, Math.PI * 2);
        ctx.fill();
        
        // Draw electron core
        ctx.fillStyle = "#FFFFFF";
        ctx.beginPath();
        ctx.arc(x, y, 2, 0, Math.PI * 2);
        ctx.fill();
      }
    }
    
    // Draw components
    ctx.strokeStyle = "#000";
    ctx.lineWidth = 2;
    
    for (const component of state.components) {
      // Highlight selected component
      if (component.id === state.selectedComponent) {
        ctx.save();
        ctx.strokeStyle = "#00f";
        ctx.lineWidth = 3;
      }
      
      // Render the component
      const renderer = componentRenderers[component.type];
      if (renderer) {
        renderer(ctx, component.x, component.y, component.rotation, component.state);
      }
      
      // Restore context if it was saved
      if (component.id === state.selectedComponent) {
        ctx.restore();
      }
    }
    
  }, [state, mousePos]);
  
  return (
    <div className="w-full h-full relative">
      <canvas 
        ref={canvasRef} 
        className="w-full h-full block bg-white"
      />
      <div className="absolute bottom-4 right-4 bg-white p-2 rounded shadow text-sm">
        {state.selectedComponent ? (
          <div>
            <p>Selected: {state.components.find(c => c.id === state.selectedComponent)?.type}</p>
            <p className="text-xs text-gray-500">Press 'R' to rotate, 'Delete' to remove</p>
          </div>
        ) : state.connectingFrom ? (
          <p>Click on a terminal to complete connection</p>
        ) : (
          <p>Drag components from panel</p>
        )}
      </div>
    </div>
  );
}