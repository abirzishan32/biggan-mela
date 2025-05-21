"use client";

import { useState } from 'react';
import { Solution } from './types';

interface SolutionSelectorProps {
  solutions: Solution[];
  selectedSolution: Solution | null;
  onSelect: (solution: Solution) => void;
}

export default function SolutionSelector({ 
  solutions, 
  selectedSolution, 
  onSelect 
}: SolutionSelectorProps) {
  const [filterValue, setFilterValue] = useState<string>('');
  const [activeTab, setActiveTab] = useState<'all' | 'acid' | 'neutral' | 'alkaline'>('all');
  
  // Filter solutions based on search and tab
  const filteredSolutions = solutions.filter(solution => {
    // Text filter
    const matchesText = solution.name.toLowerCase().includes(filterValue.toLowerCase()) ||
                       solution.description.toLowerCase().includes(filterValue.toLowerCase());
    
    // Tab filter
    const matchesTab = 
      activeTab === 'all' ||
      (activeTab === 'acid' && solution.basePh < 7) ||
      (activeTab === 'neutral' && solution.basePh === 7) ||
      (activeTab === 'alkaline' && solution.basePh > 7);
    
    return matchesText && matchesTab;
  });
  
  return (
    <div className="flex flex-col h-full">
      {/* Search input */}
      <div className="mb-3">
        <input
          type="text"
          placeholder="Search solutions..."
          className="w-full p-2 bg-gray-800 border border-gray-700 rounded text-white"
          value={filterValue}
          onChange={(e) => setFilterValue(e.target.value)}
        />
      </div>
      
      {/* Filter tabs */}
      <div className="flex mb-4 bg-gray-800 rounded overflow-hidden">
        <button 
          className={`flex-1 py-2 text-sm ${activeTab === 'all' ? 'bg-indigo-700' : 'bg-gray-800'}`}
          onClick={() => setActiveTab('all')}
        >
          All
        </button>
        <button 
          className={`flex-1 py-2 text-sm ${activeTab === 'acid' ? 'bg-red-700' : 'bg-gray-800'}`}
          onClick={() => setActiveTab('acid')}
        >
          Acids
        </button>
        <button 
          className={`flex-1 py-2 text-sm ${activeTab === 'neutral' ? 'bg-green-700' : 'bg-gray-800'}`}
          onClick={() => setActiveTab('neutral')}
        >
          Neutral
        </button>
        <button 
          className={`flex-1 py-2 text-sm ${activeTab === 'alkaline' ? 'bg-blue-700' : 'bg-gray-800'}`}
          onClick={() => setActiveTab('alkaline')}
        >
          Alkaline
        </button>
      </div>
      
      {/* Solution list */}
      <div className="flex-1 overflow-y-auto pr-2">
        <div className="grid grid-cols-1 gap-2">
          {filteredSolutions.map(solution => (
            <button
              key={solution.id}
              className={`p-3 rounded-lg text-left transition-all ${
                selectedSolution?.id === solution.id 
                  ? 'bg-indigo-700 border-indigo-500' 
                  : 'bg-gray-800 hover:bg-gray-700 border-gray-700'
              } border`}
              onClick={() => onSelect(solution)}
            >
              <div className="flex items-center">
                <span className="text-2xl mr-3">{solution.icon}</span>
                <div>
                  <div className="font-medium">{solution.name}</div>
                  <div className="text-xs text-gray-300 mt-1">pH: {solution.basePh.toFixed(1)}</div>
                </div>
              </div>
            </button>
          ))}
          
          {filteredSolutions.length === 0 && (
            <div className="p-4 text-center text-gray-400">
              No solutions match your search
            </div>
          )}
        </div>
      </div>
    </div>
  );
}