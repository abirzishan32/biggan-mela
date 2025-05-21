"use client";

import { getColorForPH } from './PhCalculator';

interface PhScaleProps {
  highlightedValue: number | null;
}

export default function PhScale({ highlightedValue }: PhScaleProps) {
  // Create array for pH values 0-14
  const phValues = Array.from({ length: 15 }, (_, i) => i);
  
  return (
    <div className="flex flex-col">
      <h3 className="font-bold mb-3 text-center">pH Scale</h3>
      
      <div className="relative h-[400px] w-[100px] mx-auto">
        {/* Vertical scale */}
        <div className="absolute left-[48px] w-[4px] h-full bg-gray-700"></div>
        
        {/* pH level indicators */}
        {phValues.map((ph) => {
          const isHighlighted = highlightedValue !== null && 
                              Math.abs(highlightedValue - ph) < 0.5;
          
          return (
            <div 
              key={ph}
              className="absolute w-full flex items-center"
              style={{ 
                bottom: `${ph * (380/14)}px`, 
                height: '20px',
              }}
            >
              {/* Tick mark */}
              <div 
                className="absolute left-[42px] w-[16px] h-[3px]"
                style={{ backgroundColor: getColorForPH(ph) }}
              ></div>
              
              {/* pH value */}
              <div 
                className={`absolute left-0 text-sm font-mono 
                          transition-all duration-300 ${isHighlighted ? 'font-bold scale-110' : ''}`}
                style={{ color: getColorForPH(ph) }}
              >
                {ph}
              </div>
              
              {/* Label on right side */}
              <div className="absolute right-0 text-xs text-gray-300 text-right">
                {ph === 0 && 'Battery Acid'}
                {ph === 2 && 'Lemon'}
                {ph === 4 && 'Tomato'}
                {ph === 7 && 'Pure Water'}
                {ph === 10 && 'Soap'}
                {ph === 14 && 'Drain Cleaner'}
              </div>
            </div>
          );
        })}
        
        {/* Indicator for current pH */}
        {highlightedValue !== null && (
          <div 
            className="absolute left-0 w-full flex items-center"
            style={{ 
              bottom: `${highlightedValue * (380/14)}px`, 
              height: '2px',
              transition: 'bottom 0.5s ease-out'
            }}
          >
            <div className="absolute left-0 right-0 h-[2px] bg-white"></div>
            
            <div 
              className="absolute -left-12 px-2 py-1 rounded text-sm font-bold"
              style={{ backgroundColor: getColorForPH(highlightedValue) }}
            >
              {highlightedValue.toFixed(1)}
            </div>
          </div>
        )}
        
        {/* Scale labels */}
        <div className="absolute -left-20 top-0 text-xs text-gray-300">ALKALINE</div>
        <div className="absolute -left-20 top-1/2 text-xs text-gray-300">NEUTRAL</div>
        <div className="absolute -left-20 bottom-0 text-xs text-gray-300">ACIDIC</div>
      </div>
    </div>
  );
}