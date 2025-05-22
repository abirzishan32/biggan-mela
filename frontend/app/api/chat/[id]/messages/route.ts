import { NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';
import prisma from '@/lib/prisma';

// Get messages for a specific chat
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id: chatId } = await params;

    // Verify chat belongs to user
    const chat = await prisma.chat.findFirst({
      where: {
        id: chatId,
        profileId: user.id
      }
    });

    if (!chat) {
      return NextResponse.json({ error: 'Chat not found' }, { status: 404 });
    }

    const messages = await prisma.message.findMany({
      where: { chatId },
      orderBy: { createdAt: 'asc' }
    });

    return NextResponse.json(messages);
  } catch (error: any) {
    console.error('Error fetching messages:', error);
    return NextResponse.json(
      { error: `Failed to fetch messages: ${error.message}` },
      { status: 500 }
    );
  }
}

// Add message to chat
export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id: chatId } = await params;
    const { content, role = 'user', metadata } = await request.json();

    if (!content) {
      return NextResponse.json(
        { error: 'Message content is required' },
        { status: 400 }
      );
    }

    // Get user profile
    const profile = await prisma.profile.findUnique({
      where: { email: user.email! }
    });

    if (!profile) {
      return NextResponse.json({ error: 'Profile not found' }, { status: 404 });
    }

    // Verify chat belongs to user
    const chat = await prisma.chat.findFirst({
      where: {
        id: chatId,
        profileId: profile.id
      }
    });

    if (!chat) {
      return NextResponse.json({ error: 'Chat not found' }, { status: 404 });
    }

    // Create user message
    const userMessage = await prisma.message.create({
      data: {
        chatId,
        content,
        role,
        metadata,
        profileId: profile.id
      }
    });

    // Get Socket.IO ID from request headers
    const socketId = request.headers.get('x-socket-id');

    // Send message to Python server for fact-checking
    const response = await fetch('http://localhost:5000/api/factcheck', {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'X-Socket-ID': socketId || ''
      },
      body: JSON.stringify({ query: content })
    });

    if (!response.ok) {
      throw new Error('Failed to get response from fact-checking service');
    }

    const factCheckResult = await response.json();

    console.log(factCheckResult);

    // Format sources as markdown list with links
    const sourcesList = factCheckResult.sources && factCheckResult.sources.length > 0
      ? factCheckResult.sources
          .map((source: any) => `- [${source.title}](${source.url})`)
          .join('\n')
      : 'No sources available';

    // Create formatted response with analysis and sources
    const formattedResponse = `${factCheckResult.analysis}\n\n**Sources:**\n${sourcesList}`;

    // Create assistant message with fact-checked response
    const assistantMessage = await prisma.message.create({
      data: {
        chatId,
        content: formattedResponse,
        role: 'assistant',
        metadata: { sources: factCheckResult.sources },
        profileId: profile.id
      }
    });

    // Update chat's updatedAt
    await prisma.chat.update({
      where: { id: chatId },
      data: { updatedAt: new Date() }
    });

    return NextResponse.json({
      messages: [userMessage, assistantMessage],
      status: 'success'
    });
  } catch (error: any) {
    console.error('Error creating message:', error);
    return NextResponse.json(
      { error: `Failed to create message: ${error.message}` },
      { status: 500 }
    );
  }
}