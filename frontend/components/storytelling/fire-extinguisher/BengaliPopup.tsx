"use client";

import { motion } from "framer-motion";

interface BengaliPopupProps {
  title: string;
  description: string;
  position: { x: number, y: number };
  onClose: () => void;
}

export default function BengaliPopup({ 
  title, 
  description, 
  position, 
  onClose 
}: BengaliPopupProps) {
  return (
    <motion.div
      initial={{ scale: 0.5, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0.5, opacity: 0 }}
      className="absolute z-30 w-64 max-w-[75%]"
      style={{ 
        left: position.x, 
        top: position.y,
        transform: "translate(-50%, -50%)" 
      }}
    >
      <div className="bg-white rounded-2xl shadow-xl border-2 border-amber-300 overflow-hidden">
        <div className="bg-gradient-to-r from-amber-500 to-red-500 px-3 py-1.5 flex justify-between items-center">
          <h3 className="text-base font-bold text-white">{title}</h3>
          <button 
            onClick={onClose}
            className="text-white hover:bg-white/20 rounded-full h-5 w-5 flex items-center justify-center"
          >
            ✕
          </button>
        </div>
        
        <div className="p-3 bg-gradient-to-b from-amber-50 to-white">
          <p className="text-gray-800 text-sm leading-snug">{description}</p>
        </div>
        
        <div className="bg-gradient-to-r from-amber-100 to-orange-100 px-3 py-1.5 text-center">
          <button 
            onClick={onClose}
            className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white rounded-full px-4 py-1 text-sm font-medium"
          >
            বুঝেছি ✓
          </button>
        </div>
      </div>
      
      {/* Triangle pointer */}
      <div 
        className="absolute w-5 h-5 bg-white border-2 border-amber-300 transform rotate-45"
        style={{
          left: "50%",
          marginLeft: "-10px",
          top: "-10px"
        }}
      />
    </motion.div>
  );
}