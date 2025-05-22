import { NextRequest, NextResponse } from 'next/server';
import twilio from 'twilio';
import { getRandomQuestion, getQuestionById, getFilteredQuestions, formatQuizMessage, formatMultipleQuizMessage } from './questions';

// Initialize Twilio client
const client = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

// Store sent messages in memory for development/demo purposes
const sentMessages: {
  id: string;
  to: string;
  body: string;
  questions?: number[];
  timestamp: Date;
  status: string;
}[] = [];

interface QuizRequest {
  phoneNumber: string;
  questionId?: number;
  classLevel?: string;
  subject?: string;
  multipleQuestions?: boolean;
}

export async function GET() {
  return NextResponse.json({
    simulationMode: !isTwilioConfigured(),
    messages: sentMessages
  });
}

function isTwilioConfigured() {
  return Boolean(
    process.env.TWILIO_ACCOUNT_SID && 
    process.env.TWILIO_AUTH_TOKEN && 
    process.env.TWILIO_PHONE_NUMBER_SENDER
  );
}

export async function POST(request: NextRequest) {
  try {
    // Parse request body
    const body: QuizRequest = await request.json();
    const { phoneNumber, questionId, classLevel, subject, multipleQuestions = false } = body;
    
    if (!phoneNumber) {
      return NextResponse.json({ error: 'Phone number is required' }, { status: 400 });
    }
    
    // Format phone number - ensure it has the correct format with + sign
    const formattedPhoneNumber = formatPhoneNumber(phoneNumber);
    
    let messageBody = '';
    let questionIds: number[] = [];
    
    if (multipleQuestions) {
      // Get 5 questions based on class and subject
      const questions = getFilteredQuestions(classLevel || 'all', subject || 'all', 5);
      
      if (questions.length === 0) {
        return NextResponse.json(
          { error: `No questions found for class ${classLevel} and subject ${subject}` }, 
          { status: 404 }
        );
      }
      
      // Store question IDs
      questionIds = questions.map(q => q.id);
      
      // Format the multiple quiz message
      messageBody = formatMultipleQuizMessage(questions);
    } else {
      // Get single quiz question (either specific one or random)
      const question = questionId ? getQuestionById(questionId) : getRandomQuestion();
      
      if (!question) {
        return NextResponse.json({ error: 'Question not found' }, { status: 404 });
      }
      
      // Store question ID
      questionIds = [question.id];
      
      // Format the SMS message
      messageBody = formatQuizMessage(question);
    }
    
    let messageId = '';
    let simulated = false;
    let status = 'sent';
    let errorMessage = null;
    
    // Check if Twilio is properly configured
    if (!isTwilioConfigured()) {
      // In simulation mode, just create a fake message ID
      messageId = `sim-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
      simulated = true;
      
      console.log('---- SIMULATION MODE: SMS would be sent ----');
      console.log(`To: ${formattedPhoneNumber}`);
      console.log(`From: ${process.env.TWILIO_PHONE_NUMBER_SENDER || 'VIRTUAL_NUMBER'}`);
      console.log(`Message: ${messageBody}`);
      console.log('-------------------------------------------');
    } else {
      // Use Twilio client to send actual SMS
      try {
        // Use receiver number if provided, otherwise use the phoneNumber from request
        const toNumber = process.env.TWILIO_PHONE_NUMBER_RECEIVER || formattedPhoneNumber;
        
        const message = await client.messages.create({
          body: messageBody,
          from: process.env.TWILIO_PHONE_NUMBER_SENDER!,
          to: toNumber
        });
        
        messageId = message.sid;
        status = message.status;
        console.log('Twilio message sent with SID:', message.sid, 'Status:', message.status);
        
      } catch (twilioError: any) {
        console.error('Twilio error:', twilioError);
        status = 'failed';
        errorMessage = twilioError.message || 'Unknown Twilio error';
        
        // Return the specific Twilio error for debugging
        return NextResponse.json({ 
          error: 'Failed to send SMS', 
          twilioError: errorMessage,
          twilioCode: twilioError.code
        }, { status: 500 });
      }
    }
    
    // Store the message in our in-memory database for demo purposes
    const sentMessage = {
      id: messageId,
      to: formattedPhoneNumber,
      body: messageBody,
      questions: questionIds,
      timestamp: new Date(),
      status
    };
    
    sentMessages.unshift(sentMessage); // Add to the beginning of the array
    
    // Keep only the latest 50 messages
    if (sentMessages.length > 50) {
      sentMessages.pop();
    }
    
    return NextResponse.json({ 
      success: true, 
      messageId, 
      simulated,
      message: sentMessage,
      status
    });
    
  } catch (error) {
    console.error('Error sending quiz SMS:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// Helper function to format phone numbers correctly
function formatPhoneNumber(phoneNumber: string): string {
  // Remove any non-digit characters except the + sign
  let cleaned = phoneNumber.replace(/[^\d+]/g, '');
  
  // Ensure the number starts with + if it doesn't already
  if (!cleaned.startsWith('+')) {
    cleaned = '+' + cleaned;
  }
  
  return cleaned;
}