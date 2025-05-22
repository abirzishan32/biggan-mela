'use client';

import { useChat } from '@/context/chat-context';
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { MessageSquarePlus, Loader2, Trash2, MessageSquare } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

export default function ChatList() {
  const { chats, currentChat, isLoading, selectChat, deleteChat } = useChat();

  return (
    <div className="w-full md:w-80 border-r h-full flex flex-col bg-card">
      {/* Header */}
      <div className="p-4 border-b bg-muted/30">
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-semibold text-foreground flex items-center gap-2">
            <MessageSquare className="w-5 h-5" />
            Conversations
          </h2>
          <Badge variant="secondary" className="text-xs">
            {chats.length}
          </Badge>
        </div>
        <Button
          variant="default"
          className="w-full justify-start gap-2 shadow-sm"
          onClick={() => selectChat('')}
        >
          <MessageSquarePlus className="h-4 w-4" />
          New Fact Check
        </Button>
      </div>

      {/* Chat List */}
      <ScrollArea className="flex-1">
        <div className="p-2 space-y-1">
          {isLoading ? (
            <div className="flex justify-center py-8">
              <div className="text-center">
                <Loader2 className="h-6 w-6 animate-spin mx-auto mb-2 text-primary" />
                <p className="text-sm text-muted-foreground">Loading chats...</p>
              </div>
            </div>
          ) : chats.length === 0 ? (
            <div className="text-center py-8 px-4">
              <MessageSquarePlus className="w-12 h-12 mx-auto mb-3 text-muted-foreground/50" />
              <h3 className="font-medium text-foreground mb-1">No conversations yet</h3>
              <p className="text-sm text-muted-foreground">
                Start a new fact-check conversation
              </p>
            </div>
          ) : (
            chats.map((chat) => (
              <div key={chat.id} className="group relative">
                <Button
                  variant={currentChat?.id === chat.id ? 'secondary' : 'ghost'}
                  className={`w-full justify-start text-left h-auto py-3 px-3 transition-all ${
                    currentChat?.id === chat.id 
                      ? 'bg-primary/10 border-l-4 border-primary shadow-sm' 
                      : 'hover:bg-muted/50'
                  }`}
                  onClick={() => selectChat(chat.id)}
                >
                  <div className="space-y-1 min-w-0 flex-1">
                    <div className="font-medium truncate text-sm leading-tight">
                      {chat.title}
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="text-xs text-muted-foreground">
                        {formatDistanceToNow(new Date(chat.updatedAt), { addSuffix: true })}
                      </div>
                      <Badge variant="outline" className="text-xs">
                        {chat.messages?.length || 0} msgs
                      </Badge>
                    </div>
                  </div>
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="absolute right-2 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity p-1 h-8 w-8"
                  onClick={(e) => {
                    e.stopPropagation();
                    deleteChat(chat.id);
                  }}
                >
                  <Trash2 className="h-4 w-4 text-muted-foreground hover:text-destructive" />
                </Button>
              </div>
            ))
          )}
        </div>
      </ScrollArea>

      {/* Footer */}
      <div className="p-4 border-t bg-muted/30">
        <div className="text-center">
          <Badge variant="outline" className="text-xs">
            BigGan Mela Fact Checker
          </Badge>
        </div>
      </div>
    </div>
  );
}