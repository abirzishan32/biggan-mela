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
    
    // Using a more reliable model
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-001" });
    
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    // Extract the Mermaid diagram code and fix any syntax issues
    const mermaidDiagram = extractMermaidDiagram(text, lifeGoal, studentInfo);
    
    // Since we're only generating Mermaid code, provide a default explanation
    const explanation = createDefaultExplanation(lifeGoal, studentInfo);
    
    return {
      mermaidDiagram,
      explanation
    };
  } catch (error) {
    console.error("Error calling Gemini API:", error);
    throw new Error("Failed to generate roadmap with AI");
  }
}

function createPrompt(lifeGoal: string, studentInfo: StudentInfo) {
  const { name, class: studentClass, subjects, interests } = studentInfo;
  
  // Convert arrays to formatted strings
  const subjectsList = subjects?.join(", ") || "not specified";
  const interestsList = interests?.join(", ") || "not specified";
  
  return `
You are a Mermaid diagram syntax expert. Create a valid mermaid.js flowchart for a career roadmap.

STUDENT INFORMATION:
- Name: ${name || "A student"}
- Current level: ${studentClass || "School/College level"}
- Favorite subjects: ${subjectsList}
- Interests/hobbies: ${interestsList}
- Future goal: ${lifeGoal}

CRITICAL SYNTAX REQUIREMENTS:
1. Start with exactly "flowchart TD" on its own line
2. Put EACH node and connection on ITS OWN LINE with proper indentation (4 spaces)
3. Use simple IDs like A, B, C, or A1, B2, C3 - NO spaces or special characters in IDs
4. Format nodes as: A[Text] or B(Text) or C{Text}
5. Format connections as: A --> B or A ==> C 
6. Use proper spacing around arrows: "A --> B" not "A-->B"
7. NEVER put text directly next to a node ID without brackets: "A[Text]" NOT "A Text"
8. NEVER put semicolons at the end of lines

INSTRUCTIONS:
1. Create a simple, valid flowchart showing the path to become a ${lifeGoal} in Bangladesh
2. Include 6-10 nodes maximum for simplicity
3. Focus on Bangladesh education system milestones
4. Use different node shapes: [] for regular steps, () for actions, {} for decisions

EXAMPLE OF CORRECT SYNTAX (notice each element on its own line):
flowchart TD
    A[Start Here] --> B[Next Step]
    B --> C{Decision Point}
    C --> D[Option 1]
    C --> E[Option 2]
    D --> F[Final Goal]
    E --> F

YOU MUST FOLLOW THIS FORMAT EXACTLY. DO NOT ADD ANY EXPLANATIONS OR COMMENTS.
`;
}

// Pass studentInfo and lifeGoal to the function
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
  
  // Ensure the code starts with flowchart TD
  if (!code.startsWith('flowchart TD') && !code.startsWith('graph TD')) {
    code = 'flowchart TD\n' + code;
  }
  
  // Apply syntax fixes
  code = sanitizeMermaidCode(code);

  // Last resort: if code is still problematic, provide a simple valid diagram
  if (!isValidMermaidSyntax(code)) {
    const studentClass = studentInfo.class || 'School';
    code = `flowchart TD
    A[Current: ${studentClass}] --> B[Complete Education]
    B --> C[Develop Skills]
    C --> D[Professional Training]
    D --> E[${lifeGoal}]`;
  }
  
  return code;
}

function isValidMermaidSyntax(code: string): boolean {
  // Basic validation to check if the syntax has proper line breaks
  const lines = code.trim().split('\n');
  if (lines.length < 3) return false; // Need at least header + 2 connections
  
  // Check if first line is flowchart declaration
  if (!lines[0].trim().startsWith('flowchart') && !lines[0].trim().startsWith('graph')) {
    return false;
  }
  
  // Check if there are any node definitions
  let hasNodeDef = false;
  for (let i = 1; i < lines.length; i++) {
    if (lines[i].match(/[A-Za-z0-9_]+\s*(\[|\(|\{)/)) {
      hasNodeDef = true;
      break;
    }
  }
  
  return hasNodeDef;
}

function sanitizeMermaidCode(code: string): string {
  // Fix any all-in-one line issues by ensuring proper line breaks
  let sanitized = code;
  
  // If everything is on one line, break it up
  if (!sanitized.includes('\n') && sanitized.includes('-->')) {
    // Replace node connections with newlines
    sanitized = sanitized.replace(/\s*-->\s*/g, '\n--> ');
    // Then add proper indentation
    sanitized = sanitized.replace(/\n/g, '\n    ');
    // Keep the header on its own line
    sanitized = sanitized.replace(/flowchart TD\s+/, 'flowchart TD\n    ');
  }
  
  // Fix common syntax issues
  sanitized = sanitized
    // Remove semicolons at line ends
    .replace(/;(\s*\n|\s*$)/g, '$1')
    // Fix spaces in node IDs (A [Text] -> A[Text])
    .replace(/([A-Za-z0-9_]+)\s+(\[|\(|\{)/g, '$1$2')
    // Fix missing brackets (A Text -> A[Text])
    .replace(/([A-Za-z0-9_]+)\s+([^-=>\s\[\(\{][^\n]*)/g, '$1[$2]')
    // Ensure proper arrow syntax
    .replace(/-->/g, ' --> ')
    .replace(/==>/g, ' ==> ')
    // Fix multiple spaces
    .replace(/\s{2,}/g, ' ')
    // Ensure proper indentation for all lines except first
    .replace(/^(?!flowchart|graph)(.+)$/gm, '    $1');

  // Split nodes and connections on the same line
  const fixedLines = [];
  const lines = sanitized.split('\n');
  
  for (const line of lines) {
    if (line.includes('-->') && line.match(/.*\].*-->/) && !line.trim().startsWith('-->')) {
      // Split complex line with multiple nodes into separate lines
      const parts = line.split('-->').map(p => p.trim());
      
      // First part likely contains a node definition
      if (parts[0] && !parts[0].trim().startsWith('flowchart')) {
        fixedLines.push('    ' + parts[0]);
      }
      
      // Add connection lines for the rest
      for (let i = 1; i < parts.length; i++) {
        const prevNodeMatch = parts[i-1].match(/([A-Za-z0-9_]+)(?:\s*\[|\(|\{)/);
        const prevNodeId = prevNodeMatch ? prevNodeMatch[1] : `Node${i-1}`;
        
        if (parts[i].includes('[') || parts[i].includes('(') || parts[i].includes('{')) {
          const currNodeMatch = parts[i].match(/([A-Za-z0-9_]+)(?:\s*\[|\(|\{)/);
          const currNodeId = currNodeMatch ? currNodeMatch[1] : `Node${i}`;
          
          fixedLines.push(`    ${prevNodeId} --> ${parts[i]}`);
        } else {
          // Just a node ID without definition
          fixedLines.push(`    ${prevNodeId} --> ${parts[i]}`);
        }
      }
    } else {
      fixedLines.push(line);
    }
  }
  
  return fixedLines.join('\n');
}

function createDefaultExplanation(lifeGoal: string, studentInfo: StudentInfo): string {
  const { class: studentClass } = studentInfo;
  
  return `
This diagram outlines a possible career pathway for becoming a ${lifeGoal} in Bangladesh.

The roadmap shows:
- Educational requirements starting from ${studentClass || "your current education level"}
- Key skills to develop at each stage
- Important exams and certifications
- Potential specializations and career paths

Follow the connected nodes in the diagram to understand the progression from your current position to achieving your goal of becoming a ${lifeGoal}.

This is a general guideline - your personal journey may vary based on your interests, abilities, and opportunities. Consider consulting with teachers, career counselors, or professionals in this field for more personalized guidance.
`;
}