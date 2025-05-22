import { NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';
import prisma from '@/lib/prisma';

// Get chats for authenticated user
export async function GET() {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const chats = await prisma.chat.findMany({
      where: { profileId: user.id },
      include: {
        messages: {
          orderBy: { createdAt: 'asc' }
        }
      },
      orderBy: { updatedAt: 'desc' }
    });

    return NextResponse.json(chats);
  } catch (error: any) {
    console.error('Error fetching chats:', error);
    return NextResponse.json(
      { error: `Failed to fetch chats: ${error.message}` },
      { status: 500 }
    );
  }
}

// Create new chat
export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { title, message } = await request.json();

    if (!title || !message) {
      return NextResponse.json(
        { error: 'Title and initial message are required' },
        { status: 400 }
      );
    }

    // Get or create user profile
    const profile = await prisma.profile.upsert({
      where: { email: user.email! },
      update: {},
      create: {
        email: user.email!,
        name: user.user_metadata?.name
      }
    });

    // Create new chat with initial message
    const chat = await prisma.chat.create({
      data: {
        title,
        profileId: profile.id,
        messages: {
          create: {
            content: message,
            role: 'user',
            profileId: profile.id
          }
        }
      },
      include: {
        messages: true
      }
    });

    return NextResponse.json(chat);
  } catch (error: any) {
    console.error('Error creating chat:', error);
    return NextResponse.json(
      { error: `Failed to create chat: ${error.message}` },
      { status: 500 }
    );
  }
}