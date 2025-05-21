"use client";

import Mass from './Mass';
import { MassBlock } from './types';

interface MassShelfProps {
  masses: MassBlock[];
  onMassDragStart: (id: number) => void;
  onMassDrag: (id: number, position: { x: number, y: number }) => void;
  onMassDrop: (id: number, position: { x: number, y: number }) => void;
}

export default function MassShelf({
  masses,
  onMassDragStart,
  onMassDrag,
  onMassDrop
}: MassShelfProps) {
  // Filter out masses that are currently being dragged
  const displayedMasses = masses.filter(mass => !mass.isDragging);
  
  return (
    <div className="bg-gray-700 p-3 rounded-lg shadow-inner">
      <div className="flex flex-wrap gap-3 justify-center">
        {displayedMasses.map((mass) => (
          <Mass
            key={mass.id}
            mass={mass}
            isDraggable={true}
            onDragStart={onMassDragStart}
            onDrag={onMassDrag}
            onDrop={onMassDrop}
          />
        ))}
        
        {displayedMasses.length === 0 && (
          <p className="text-sm text-gray-400 py-4">
            All masses are in use. Reset to return them to the shelf.
          </p>
        )}
      </div>
    </div>
  );
}