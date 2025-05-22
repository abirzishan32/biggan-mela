'use client';

import { useState, useRef, useEffect } from 'react';
import { useChat } from '@/context/chat-context';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Loader2, Send, ExternalLink } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

interface SourceBadgeProps {
  source: {
    title: string;
    url: string;
    score: number;
  };
}

function SourceBadge({ source }: SourceBadgeProps) {
  const getScoreColor = (score: number) => {
    if (score >= 0.9) return 'bg-green-500 hover:bg-green-600';
    if (score >= 0.8) return 'bg-blue-500 hover:bg-blue-600';
    if (score >= 0.7) return 'bg-yellow-500 hover:bg-yellow-600';
    if (score >= 0.6) return 'bg-orange-500 hover:bg-orange-600';
    return 'bg-red-500 hover:bg-red-600';
  };

  const getScoreLabel = (score: number) => {
    if (score >= 0.9) return 'Excellent';
    if (score >= 0.8) return 'Good';
    if (score >= 0.7) return 'Fair';
    if (score >= 0.6) return 'Poor';
    return 'Low';
  };

  return (
    <Badge
      variant="secondary"
      className={`${getScoreColor(source.score)} text-white cursor-pointer transition-colors`}
      onClick={() => window.open(source.url, '_blank')}
    >
      <ExternalLink className="w-3 h-3 mr-1" />
      {source.title} ({getScoreLabel(source.score)}: {(source.score * 100).toFixed(1)}%)
    </Badge>
  );
}

interface MessageProps {
  message: {
    id: string;
    content: string;
    role: 'user' | 'assistant';
    metadata?: {
      sources?: Array<{
        title: string;
        url: string;
        score: number;
      }>;
    };
  };
}

function MessageBubble({ message }: MessageProps) {
  const isUser = message.role === 'user';
  
  return (
    <div className={`flex w-full mb-6 ${isUser ? 'justify-end' : 'justify-start'}`}>
      <div className={`max-w-[85%] sm:max-w-[75%] ${isUser ? 'order-2' : 'order-1'}`}>
        <div
          className={`rounded-2xl px-4 py-3 shadow-sm ${
            isUser 
              ? 'bg-primary text-primary-foreground ml-4' 
              : 'bg-muted mr-4'
          }`}
        >
          {isUser ? (
            <p className="whitespace-pre-wrap">{message.content}</p>
          ) : (
            <div className="prose prose-sm dark:prose-invert max-w-none">
              <ReactMarkdown
                components={{
                  p: ({ children }) => <p className="mb-2 last:mb-0">{children}</p>,
                  ul: ({ children }) => <ul className="list-disc pl-4 mb-2">{children}</ul>,
                  ol: ({ children }) => <ol className="list-decimal pl-4 mb-2">{children}</ol>,
                  li: ({ children }) => <li className="mb-1">{children}</li>,
                  strong: ({ children }) => <strong className="font-semibold text-foreground">{children}</strong>,
                  em: ({ children }) => <em className="italic">{children}</em>,
                  h1: ({ children }) => <h1 className="text-lg font-bold mb-2">{children}</h1>,
                  h2: ({ children }) => <h2 className="text-md font-semibold mb-2">{children}</h2>,
                  h3: ({ children }) => <h3 className="text-sm font-semibold mb-1">{children}</h3>,
                }}
              >
                {message.content}
              </ReactMarkdown>
            </div>
          )}
        </div>
        
        {!isUser && message.metadata?.sources && message.metadata.sources.length > 0 && (
          <div className="mt-3 mr-4">
            <p className="text-xs text-muted-foreground mb-2 font-medium">Sources:</p>
            <div className="flex flex-wrap gap-2">
              {message.metadata.sources.map((source, index) => (
                <SourceBadge key={index} source={source} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function ChatInterface() {
  const {
    chats,
    currentChat,
    isLoading,
    error,
    createChat,
    sendMessage,
    selectChat
  } = useChat();

  const [input, setInput] = useState('');
  const [title, setTitle] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [currentChat?.messages]);

  const handleSend = async () => {
    if (!input.trim()) return;

    if (!currentChat) {
      const chatTitle = title || input.slice(0, 30) + (input.length > 30 ? '...' : '');
      await createChat(chatTitle, input);
    } else {
      await sendMessage(currentChat.id, input);
    }

    setInput('');
    setTitle('');
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex flex-col h-full w-full max-w-4xl mx-auto bg-background">
      {/* Header */}
      <div className="flex-shrink-0 border-b bg-card p-4 shadow-sm">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-semibold text-foreground">
              {currentChat ? currentChat.title : 'BigGan Mela Fact Checker'}
            </h1>
            <p className="text-sm text-muted-foreground">
              {currentChat 
                ? `${currentChat.messages.length} messages` 
                : 'Start a conversation to fact-check information'}
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <Badge variant="secondary" className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100">
              Fact Checker
            </Badge>
          </div>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-hidden bg-gradient-to-b from-background to-muted/20">
        <ScrollArea className="h-full">
          <div className="p-4 space-y-1">
            {!currentChat && !isLoading && (
              <div className="text-center py-12">
                <div className="w-16 h-16 mx-auto mb-4 bg-primary/10 rounded-full flex items-center justify-center">
                  <Send className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  Welcome to BigGan Mela Fact Checker
                </h3>
                <p className="text-muted-foreground max-w-md mx-auto">
                  Ask any question and get fact-checked information with reliable sources. 
                  Our AI analyzes multiple sources to provide accurate answers.
                </p>
              </div>
            )}

            {currentChat?.messages.map((message) => (
              <MessageBubble key={message.id} message={message} />
            ))}

            {error && (
              <div className="flex justify-center py-4">
                <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 max-w-md">
                  <p className="text-red-800 dark:text-red-200 text-sm">{error}</p>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>
        </ScrollArea>
      </div>

      {/* Input Area */}
      <div className="flex-shrink-0 border-t bg-card p-4 shadow-lg">
        <div className="max-w-3xl mx-auto">
          <div className="flex gap-3">
            <div className="flex-1">
              <Input
                placeholder="Ask a question to fact-check..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={handleKeyPress}
                disabled={isLoading}
                className="border-2 focus:border-primary transition-colors resize-none min-h-[44px]"
              />
            </div>
            <Button
              onClick={handleSend}
              disabled={!input.trim() || isLoading}
              size="lg"
              className="px-6 shadow-md hover:shadow-lg transition-shadow"
            >
              {isLoading ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                <Send className="h-5 w-5" />
              )}
            </Button>
          </div>
          <div className="flex items-center justify-between mt-2 text-xs text-muted-foreground">
            <span>Press Enter to send • Shift+Enter for new line</span>
            <span className="flex items-center gap-1">
              Powered by AI <Badge variant="outline" className="text-xs">Beta</Badge>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}