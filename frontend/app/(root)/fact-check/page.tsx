'use client';

import { ChatProvider } from '@/context/chat-context';
import ChatList from '@/components/chat/ChatList';
import ChatInterface from '@/components/chat/ChatInterface';

export default function ChatPage() {
  return (
    <ChatProvider>
      <div className="flex h-[calc(100vh-4rem)]">
        <ChatList />
        <div className="flex-1 p-4 bg-muted/10">
          <ChatInterface />
        </div>
      </div>
    </ChatProvider>
  );
}