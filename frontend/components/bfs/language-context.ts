"use client";

import { createContext, useContext, useState, ReactNode } from 'react';

type Language = 'en' | 'bn';

type LanguageContextType = {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
};

// Create the context
const LanguageContext = createContext<LanguageContextType>({
  language: 'en',
  setLanguage: () => {},
  t: (key: string) => key
});

// Translation dictionary
const translations: Record<Language, Record<string, string>> = {
  en: {
    // Page title
    "bfs.title": "Breadth-First Search Algorithm Visualization",
    "bfs.description": "Interactive visualization of the BFS graph traversal algorithm",
    
    // Controls
    "controls.title": "Controls",
    "controls.graphType": "Graph Type",
    "controls.teaching": "Teaching",
    "controls.random": "Random",
    "controls.startingNode": "Starting Node",
    "controls.nodes": "Nodes",
    "controls.density": "Density",
    "controls.generateGraph": "Generate Graph",
    "controls.reset": "Reset",
    "controls.step": "Step",
    "controls.of": "of",
    "controls.speed": "Speed",
    
    // Queue
    "queue.title": "Queue",
    "queue.fifo": "FIFO (First In, First Out)",
    "queue.currentNode": "Current Node",
    "queue.queue": "Queue",
    "queue.empty": "Empty queue",
    
    // Graph visualization
    "graph.title": "Graph Visualization",
    "graph.starting": "Starting BFS traversal...",
    "graph.visiting": "Visiting node",
    "graph.adding": "Adding node",
    "graph.processing": "Processing neighbors of node",
    "graph.complete": "BFS traversal complete!",
    "graph.unvisited": "Unvisited",
    "graph.current": "Current",
    "graph.visited": "Visited",
    "graph.inQueue": "In Queue",
    
    // Algorithm explanation
    "algo.title": "Breadth-First Search (BFS)",
    "algo.description": "BFS explores all vertices at the current depth before moving to the next depth level, using a queue to track the next vertices to explore.",
    "algo.currentState": "Current State",
    "algo.current": "Current",
    "algo.queue": "Queue",
    "algo.visited": "Visited",
    "algo.empty": "Empty",
    "algo.none": "None",
    "algo.noStepInfo": "No step information available yet.",
    "algo.algorithm": "Algorithm",
    "algo.characteristics": "Characteristics",
    "algo.time": "Time",
    "algo.space": "Space",
    "algo.useCases": "Use Cases",
    "algo.keyInsight": "Key Insight",
    "algo.shortestPath": "Shortest path (unweighted), level order traversal",
    "algo.visitsByDistance": "Visits nodes by distance from source",
    "algo.toQueue": "to queue",
  },
  bn: {
    // Page title
    "bfs.title": "ব্রেথ ফার্স্ট সার্চ অ্যালগরিদম ভিজুয়ালাইজেশন",
    "bfs.description": "বিএফএস গ্রাফ ট্র্যাভার্সাল অ্যালগরিদমের ইন্টারেক্টিভ ভিজুয়ালাইজেশন",
    
    // Controls
    "controls.title": "কন্ট্রোলস",
    "controls.graphType": "গ্রাফ টাইপ",
    "controls.teaching": "শিক্ষামূলক",
    "controls.random": "র‍্যান্ডম",
    "controls.startingNode": "শুরুর নোড",
    "controls.nodes": "নোডস",
    "controls.density": "ঘনত্ব",
    "controls.generateGraph": "গ্রাফ তৈরি করুন",
    "controls.reset": "রিসেট",
    "controls.step": "ধাপ",
    "controls.of": "এর মধ্যে",
    "controls.speed": "গতি",
    
    // Queue
    "queue.title": "কিউ",
    "queue.fifo": "ফাইফো (প্রথম আসা, প্রথম যাওয়া)",
    "queue.currentNode": "বর্তমান নোড",
    "queue.queue": "কিউ",
    "queue.empty": "খালি কিউ",
    
    // Graph visualization
    "graph.title": "গ্রাফ ভিজুয়ালাইজেশন",
    "graph.starting": "BFS ট্র্যাভার্সাল শুরু হচ্ছে...",
    "graph.visiting": "নোড ভিজিট করা হচ্ছে",
    "graph.adding": "নোড যোগ করা হচ্ছে",
    "graph.processing": "নোডের প্রতিবেশীদের প্রসেস করা হচ্ছে",
    "graph.complete": "BFS ট্র্যাভার্সাল সম্পূর্ণ হয়েছে!",
    "graph.unvisited": "অদেখা",
    "graph.current": "বর্তমান",
    "graph.visited": "দেখা হয়েছে",
    "graph.inQueue": "কিউ-তে আছে",
    
    // Algorithm explanation
    "algo.title": "ব্রেথ ফার্স্ট সার্চ (BFS)",
    "algo.description": "BFS পরবর্তী গভীরতা স্তরে যাওয়ার আগে বর্তমান গভীরতায় সমস্ত ভার্টেক্স অন্বেষণ করে এবং পরবর্তী নোড ট্র্যাক করার জন্য একটি কিউ ব্যবহার করে।",
    "algo.currentState": "বর্তমান অবস্থা",
    "algo.current": "বর্তমান",
    "algo.queue": "কিউ",
    "algo.visited": "দেখা হয়েছে",
    "algo.empty": "খালি",
    "algo.none": "কোনোটিই নয়",
    "algo.noStepInfo": "এখনো কোন ধাপের তথ্য নেই।",
    "algo.algorithm": "অ্যালগরিদম",
    "algo.characteristics": "বৈশিষ্ট্য",
    "algo.time": "সময়",
    "algo.space": "স্পেস",
    "algo.useCases": "ব্যবহার ক্ষেত্র",
    "algo.keyInsight": "মূল অন্তর্দৃষ্টি",
    "algo.shortestPath": "সবচেয়ে ছোট পথ (অওজনযুক্ত), লেভেল অর্ডার ট্রাভার্সাল",
    "algo.visitsByDistance": "উৎস থেকে দূরত্ব অনুসারে নোড দেখা হয়",
    "algo.toQueue": "কিউতে",
  }
};

// Create the provider component
export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>('en');

  // Translation function
  const t = (key: string): string => {
    return translations[language][key] || key;
  };

  
}

// Custom hook to use the language context
export function useLanguage() {
  return useContext(LanguageContext);
}