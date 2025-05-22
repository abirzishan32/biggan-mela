import { GoogleGenerativeAI } from "@google/generative-ai";

// Initialize the Google Generative AI client with your API key
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

type StudentInfo = {
  name?: string | null;
  class?: string | null;
  subjects?: string[] | null;
  interests?: string[] | null;
}

export async function generateRoadmap(lifeGoal: string, studentInfo: StudentInfo) {
  try {
    // Generate contextual prompt based on student information
    const prompt = createPrompt(lifeGoal, studentInfo);
    
    // Use gemini-pro model for more reliable results
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });
    
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    // Extract the Mermaid diagram code and fix any syntax issues
    let mermaidDiagram = "";
    
    try {
      mermaidDiagram = extractMermaidDiagram(text, lifeGoal, studentInfo);
    } catch (diagramError) {
      console.error("Error processing mermaid diagram:", diagramError);
      // Fallback to a simple valid diagram
      mermaidDiagram = createFallbackDiagram(lifeGoal, studentInfo);
    }
    
    // Since we're only generating Mermaid code, provide a default explanation
    const explanation = createDefaultExplanation(lifeGoal, studentInfo);
    
    return {
      mermaidDiagram,
      explanation
    };
  } catch (error) {
    console.error("Error calling Gemini API:", error);
    // Return a fallback diagram and explanation if API call fails
    return {
      mermaidDiagram: createFallbackDiagram(lifeGoal, studentInfo),
      explanation: createDefaultExplanation(lifeGoal, studentInfo)
    };
  }
}

function createPrompt(lifeGoal: string, studentInfo: StudentInfo) {
  const { name, class: studentClass, subjects, interests } = studentInfo;
  
  // Convert arrays to formatted strings
  const subjectsList = subjects?.join(", ") || "not specified";
  const interestsList = interests?.join(", ") || "not specified";
  
  return `
You are a Mermaid diagram syntax expert. Generate only valid mermaid.js flowchart code.

STUDENT INFORMATION:
- Name: ${name || "A student"}
- Current level: ${studentClass || "School/College level"}
- Favorite subjects: ${subjectsList}
- Interests/hobbies: ${interestsList}
- Future goal: ${lifeGoal}

CRITICAL SYNTAX REQUIREMENTS:
1. EXACTLY START WITH "flowchart TD" AS THE FIRST LINE
2. PUT EACH NODE AND CONNECTION ON A SEPARATE LINE
3. USE PROPER INDENTATION (4 spaces)
4. USE ONLY SIMPLE ALPHANUMERIC IDs LIKE A, B, C, or A1, B2, C3
5. FORMAT NODES AS: "A[Text]" or "B(Text)" or "C{Text}"
6. CONNECTION SYNTAX: "A --> B" with spaces before and after arrows
7. DO NOT use semicolons at line ends

YOUR TASK:
Create a simple, valid flowchart showing educational/career path to become a ${lifeGoal}.
Include 5-7 nodes maximum for simplicity.
Focus on Bangladesh education system milestones.

EXAMPLE OF VALID SYNTAX:
flowchart TD
    A[Start] --> B[Education]
    B --> C[Training]
    C --> D{Decision}
    D --> E[Option 1]
    D --> F[Option 2]
    E --> G[Goal]
    F --> G

ONLY PROVIDE THE MERMAID CODE, NO EXPLANATIONS OR OTHER TEXT.
`;
}

function extractMermaidDiagram(text: string, lifeGoal: string, studentInfo: StudentInfo): string {
  // First, try to extract any existing code block format
  const mermaidRegex = /```mermaid\s*([\s\S]*?)```/;
  const match = text.match(mermaidRegex);
  
  let code = "";
  
  if (match && match[1]) {
    code = match[1].trim();
  } else {
    // If no code block, assume the entire response is mermaid code
    code = text.trim();
  }
  
  // Ensure it starts with the flowchart declaration
  if (!code.startsWith('flowchart TD') && !code.startsWith('graph TD')) {
    code = 'flowchart TD\n' + code;
  }
  
  // Remove any non-mermaid text before or after the diagram
  const lines = code.split('\n');
  let startIndex = 0;
  let endIndex = lines.length;
  
  for (let i = 0; i < lines.length; i++) {
    if (lines[i].trim().startsWith('flowchart TD') || lines[i].trim().startsWith('graph TD')) {
      startIndex = i;
      break;
    }
  }
  
  // Apply thorough syntax fixes
  code = lines.slice(startIndex, endIndex).join('\n');
  code = sanitizeMermaidCode(code);
  
  // Validate if the code is well-formed
  if (!isValidMermaidSyntax(code)) {
    return createFallbackDiagram(lifeGoal, studentInfo);
  }
  
  return code;
}

function createFallbackDiagram(lifeGoal: string, studentInfo: StudentInfo): string {
  const className = studentInfo.class || 'Current Education';
  const sanitizedLifeGoal = lifeGoal.replace(/[^\w\s]/gi, '').trim();
  
  // Create a simple, guaranteed valid diagram
  return `flowchart TD
    A[${className}] --> B[Secondary Education]
    B --> C[Higher Education]
    C --> D[Skill Development]
    D --> E[Professional Training]
    E --> F[${sanitizedLifeGoal}]`;
}

function isValidMermaidSyntax(code: string): boolean {
  // Basic validation checks
  const lines = code.split('\n');
  
  if (lines.length < 3) return false; // Need at least declaration and 2 nodes
  if (!lines[0].includes('flowchart TD') && !lines[0].includes('graph TD')) return false;
  
  // Check if there are node definitions and connections
  let hasNodeDef = false;
  let hasConnection = false;
  
  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim();
    if (line.match(/\w+\s*(\[|\(|\{)/)) hasNodeDef = true;
    if (line.includes('-->') || line.includes('==>')) hasConnection = true;
  }
  
  return hasNodeDef && hasConnection;
}

function sanitizeMermaidCode(code: string): string {
  // Fix common issues in the mermaid code
  let sanitized = code;
  
  // Fix broken flowchart declaration
  if (sanitized.includes('flowchart') && !sanitized.startsWith('flowchart')) {
    sanitized = sanitized.replace(/.*flowchart/, 'flowchart');
  }
  
  // Fix nodes without proper brackets
  const lines = sanitized.split('\n');
  const fixedLines = [];
  
  let insideNodeDef = false;
  
  for (const line of lines) {
    // Keep flowchart declaration as is
    if (line.trim().startsWith('flowchart') || line.trim().startsWith('graph')) {
      fixedLines.push(line);
      continue;
    }
    
    // Skip empty lines
    if (!line.trim()) continue;
    
    let fixedLine = line;
    
    // Fix lines with direct node-to-arrow connections
    if (fixedLine.includes('-->')) {
      if (!fixedLine.match(/\[|\(|\{/)) {
        // Line has connection but no proper node definition
        const parts = fixedLine.split('-->').map(p => p.trim());
        
        // Fix each part that doesn't have a proper node definition
        const fixedParts = parts.map(part => {
          const nodeMatch = part.match(/^([A-Za-z0-9]+)(?!\[|\(|\{)(.*)/);
          if (nodeMatch) {
            return `${nodeMatch[1]}[${nodeMatch[2] || nodeMatch[1]}]`;
          }
          return part;
        });
        
        fixedLine = fixedParts.join(' --> ');
      }
    }
    
    // Ensure proper node formatting
    fixedLine = fixedLine
      .replace(/([A-Za-z0-9]+)\s+(?!\[|\(|\{)([^\s-=]+)/g, '$1[$2]')
      .replace(/\s*-->\s*/g, ' --> ')
      .replace(/;/g, '');
    
    // Add proper indentation for readability
    if (!fixedLine.startsWith('    ')) {
      fixedLine = '    ' + fixedLine;
    }
    
    fixedLines.push(fixedLine);
  }
  
  return fixedLines.join('\n');
}

function createDefaultExplanation(lifeGoal: string, studentInfo: StudentInfo): string {
  const { class: studentClass } = studentInfo;
  
  return `
This diagram outlines a possible career pathway for becoming a ${lifeGoal} in Bangladesh.

The roadmap shows:
- Educational stages starting from ${studentClass || "your current education level"}
- Key skills to develop at each step
- Important exams and certifications
- Potential specializations and career paths

Follow the connected nodes in the diagram to understand the progression from your current position to achieving your goal of becoming a ${lifeGoal}.

This is a general guideline - your personal journey may vary based on your interests, abilities, and opportunities. Consider consulting with teachers, career counselors, or professionals in this field for more personalized guidance.
`;
}