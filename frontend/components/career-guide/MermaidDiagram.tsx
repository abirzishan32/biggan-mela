"use client"

import { useEffect, useRef, useState } from "react";
import mermaid from "mermaid";

type MermaidDiagramProps = {
  code: string;
}

export default function MermaidDiagram({ code }: MermaidDiagramProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!code) return;

    // Initialize and configure Mermaid
    mermaid.initialize({
      startOnLoad: true,
      theme: 'default',
      securityLevel: 'loose', // Required for dynamic rendering
      flowchart: {
        useMaxWidth: true,
        htmlLabels: true,
        curve: 'basis',
      },
    });

    // Use the Mermaid API to render the diagram
    const renderDiagram = async () => {
      if (!containerRef.current) return;

      try {
        setError(null);
        // Clear the container first
        containerRef.current.innerHTML = '';
        
        // Generate a unique ID for the diagram
        const id = `mermaid-${Math.round(Math.random() * 100000)}`;
        
        // Render the diagram
        const { svg } = await mermaid.render(id, code);
        containerRef.current.innerHTML = svg;
        
        // Add dark mode support if needed
        const svgElement = containerRef.current.querySelector('svg');
        if (svgElement) {
          svgElement.style.width = '100%';
          svgElement.style.height = 'auto';
          svgElement.style.maxWidth = '100%';
        }
      } catch (err) {
        console.error("Mermaid rendering error:", err);
        setError("Failed to render diagram. The diagram code may be invalid.");
      }
    };

    renderDiagram();
  }, [code]);

  if (error) {
    return (
      <div className="p-4 bg-red-50 text-red-700 rounded-md">
        <p className="font-bold">Error:</p>
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className="mermaid-container overflow-x-auto">
      <div ref={containerRef} className="flex justify-center"></div>
    </div>
  );
}