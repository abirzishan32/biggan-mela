import { NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';
import prisma from '@/lib/prisma';

export async function DELETE(
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

    // Delete chat and its messages (cascade delete is configured in schema)
    await prisma.chat.delete({
      where: { id: chatId }
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Error deleting chat:', error);
    return NextResponse.json(
      { error: `Failed to delete chat: ${error.message}` },
      { status: 500 }
    );
  }
}