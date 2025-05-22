'use client';

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { io, Socket } from 'socket.io-client';

interface Message {
  id: string;
  content: string;
  role: 'user' | 'assistant';
  metadata?: any;
  createdAt: Date;
}

interface Chat {
  id: string;
  title: string;
  messages: Message[];
  createdAt: Date;
  updatedAt: Date;
}

interface ChatContextType {
  chats: Chat[];
  currentChat: Chat | null;
  isLoading: boolean;
  error: string | null;
  socket: Socket | null;
  connectionStatus: 'connecting' | 'connected' | 'disconnected';
  createChat: (title: string, initialMessage: string) => Promise<void>;
  sendMessage: (chatId: string, content: string) => Promise<void>;
  sendMessageWithFiles: (chatId: string, content: string, files: File[]) => Promise<void>;
  selectChat: (chatId: string) => Promise<void>;
  deleteChat: (chatId: string) => Promise<void>;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export function ChatProvider({ children }: { children: React.ReactNode }) {
  const [chats, setChats] = useState<Chat[]>([]);
  const [currentChat, setCurrentChat] = useState<Chat | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [socket, setSocket] = useState<Socket | null>(null);
  const [connectionStatus, setConnectionStatus] = useState<'connecting' | 'connected' | 'disconnected'>('disconnected');

  const updateAssistantMessage = useCallback((content: string, metadata?: any) => {
    setCurrentChat(prev => {
      if (!prev) return prev;
      const messages = [...prev.messages];
      const lastMessage = messages[messages.length - 1];
      
      if (lastMessage && lastMessage.role === 'assistant') {
        messages[messages.length - 1] = {
          ...lastMessage,
          content,
          metadata: metadata || lastMessage.metadata
        };
      }
      
      return {
        ...prev,
        messages
      };
    });
  }, []);

  useEffect(() => {
    const socketUrl = process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost:5000';
    console.log('Connecting to socket server:', socketUrl);
    
    setConnectionStatus('connecting');
    
    const socketInstance = io(socketUrl, {
      transports: ['websocket', 'polling'],
      autoConnect: true,
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    });

    socketInstance.on('connect', () => {
      console.log('Socket connected:', socketInstance.id);
      setConnectionStatus('connected');
      setError(null);
      socketInstance.emit('join_room', { room: socketInstance.id });
    });

    socketInstance.on('disconnect', (reason) => {
      console.log('Socket disconnected:', reason);
      setConnectionStatus('disconnected');
    });

    socketInstance.on('connect_error', (error) => {
      console.error('Socket connection error:', error);
      setConnectionStatus('disconnected');
      setError('Failed to connect to server');
    });

    socketInstance.on('connected', (data) => {
      console.log('Server confirmation:', data);
    });

    socketInstance.on('room_joined', (data) => {
      console.log('Joined room:', data.room);
    });

    socketInstance.on('fact_check_update', (update: { 
      type: string; 
      message: string; 
      status?: string;
      sources?: any[] 
    }) => {
      console.log('Fact check update received:', update);
      
      let content = update.message;
      let metadata = undefined;
      
      switch (update.type) {
        case 'file_upload_start':
          content = '📁 ' + update.message;
          break;
        case 'file_processing':
          content = '⚙️ ' + update.message;
          break;
        case 'content_extracted':
          content = '📄 ' + update.message;
          break;
        case 'search_start':
          content = '🔍 ' + update.message;
          break;
        case 'search_complete':
          content = '📊 ' + update.message;
          metadata = update.sources ? { sources: update.sources } : undefined;
          break;
        case 'analysis_start':
          content = '🧠 ' + update.message;
          break;
        case 'analysis_complete':
          content = '✅ ' + update.message;
          break;
        case 'error':
          content = '❌ ' + update.message;
          break;
        default:
          content = update.message;
      }
      
      updateAssistantMessage(content, metadata);
    });

    setSocket(socketInstance);

    return () => {
      console.log('Cleaning up socket connection');
      socketInstance.disconnect();
    };
  }, [updateAssistantMessage]);

  useEffect(() => {
    fetchChats();
  }, []);

  const fetchChats = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/chat');
      if (!response.ok) throw new Error('Failed to fetch chats');
      const data = await response.json();
      setChats(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const createChat = async (title: string, initialMessage: string) => {
    try {
      setIsLoading(true);
      setError(null);
      
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, message: initialMessage })
      });

      if (!response.ok) throw new Error('Failed to create chat');
      
      const newChat = await response.json();
      setChats(prev => [newChat, ...prev]);
      setCurrentChat(newChat);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const sendMessage = async (chatId: string, content: string) => {
    try {
      setIsLoading(true);
      setError(null);
      
      const userMessage: Message = {
        id: Date.now().toString(),
        content,
        role: 'user',
        createdAt: new Date()
      };

      if (currentChat?.id === chatId) {
        setCurrentChat(prev => {
          if (!prev) return prev;
          return {
            ...prev,
            messages: [...prev.messages, userMessage]
          };
        });
      }

      const tempAssistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: '🤖 Initializing fact-check process...',
        role: 'assistant',
        createdAt: new Date()
      };

      if (currentChat?.id === chatId) {
        setCurrentChat(prev => {
          if (!prev) return prev;
          return {
            ...prev,
            messages: [...prev.messages, tempAssistantMessage]
          };
        });
      }

      const response = await fetch(`/api/chat/${chatId}/messages`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'X-Socket-ID': socket?.id || ''
        },
        body: JSON.stringify({ content })
      });

      if (!response.ok) throw new Error('Failed to send message');
      
      const { messages: newMessages } = await response.json();
      
      if (currentChat?.id === chatId) {
        setCurrentChat(prev => {
          if (!prev) return prev;
          const filteredMessages = prev.messages.filter(msg => 
            msg.id !== userMessage.id && msg.id !== tempAssistantMessage.id
          );
          return {
            ...prev,
            messages: [...filteredMessages, ...newMessages]
          };
        });
      }
    } catch (err: any) {
      setError(err.message);
      if (currentChat?.id === chatId) {
        setCurrentChat(prev => {
          if (!prev) return prev;
          const filteredMessages = prev.messages.filter(msg => 
            msg.role === 'user' || !msg.content.includes('🤖 Initializing')
          );
          return {
            ...prev,
            messages: [...filteredMessages, {
              id: Date.now().toString(),
              content: '❌ Failed to process message. Please try again.',
              role: 'assistant',
              createdAt: new Date()
            }]
          };
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  const sendMessageWithFiles = async (chatId: string, content: string, files: File[]) => {
    try {
      setIsLoading(true);
      setError(null);
      
      const userMessage: Message = {
        id: Date.now().toString(),
        content: content || 'Analyze uploaded files',
        role: 'user',
        metadata: { 
          files: files.map(f => ({ name: f.name, type: f.type, size: f.size }))
        },
        createdAt: new Date()
      };

      if (currentChat?.id === chatId) {
        setCurrentChat(prev => {
          if (!prev) return prev;
          return {
            ...prev,
            messages: [...prev.messages, userMessage]
          };
        });
      }

      const tempAssistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: '🤖 Processing uploaded files...',
        role: 'assistant',
        createdAt: new Date()
      };

      if (currentChat?.id === chatId) {
        setCurrentChat(prev => {
          if (!prev) return prev;
          return {
            ...prev,
            messages: [...prev.messages, tempAssistantMessage]
          };
        });
      }

      // Create FormData for file upload
      const formData = new FormData();
      files.forEach(file => {
        formData.append('files', file);
      });
      if (content) {
        formData.append('query', content);
      }

      const response = await fetch('http://localhost:5000/api/factcheck-files', {
        method: 'POST',
        headers: {
          'X-Socket-ID': socket?.id || ''
        },
        body: formData
      });

      if (!response.ok) throw new Error('Failed to process files');
      
      const result = await response.json();
      
      // Create assistant response message
      const assistantMessage: Message = {
        id: (Date.now() + 2).toString(),
        content: result.analysis || 'File processing completed',
        role: 'assistant',
        metadata: {
          sources: result.sources || [],
          file_metadata: result.file_metadata
        },
        createdAt: new Date()
      };

      if (currentChat?.id === chatId) {
        setCurrentChat(prev => {
          if (!prev) return prev;
          const filteredMessages = prev.messages.filter(msg => 
            msg.id !== userMessage.id && msg.id !== tempAssistantMessage.id
          );
          return {
            ...prev,
            messages: [...filteredMessages, userMessage, assistantMessage]
          };
        });
      }
    } catch (err: any) {
      setError(err.message);
      if (currentChat?.id === chatId) {
        setCurrentChat(prev => {
          if (!prev) return prev;
          const filteredMessages = prev.messages.filter(msg => 
            msg.role === 'user' || !msg.content.includes('🤖 Processing')
          );
          return {
            ...prev,
            messages: [...filteredMessages, {
              id: Date.now().toString(),
              content: '❌ Failed to process files. Please try again.',
              role: 'assistant',
              createdAt: new Date()
            }]
          };
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  const selectChat = async (chatId: string) => {
    if (!chatId) {
      setCurrentChat(null);
      return;
    }

    try {
      setIsLoading(true);
      const response = await fetch(`/api/chat/${chatId}/messages`);
      if (!response.ok) throw new Error('Failed to fetch messages');
      
      const messages = await response.json();
      const selectedChat = chats.find(chat => chat.id === chatId);
      
      if (selectedChat) {
        setCurrentChat({
          ...selectedChat,
          messages
        });
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const deleteChat = async (chatId: string) => {
    try {
      setIsLoading(true);
      const response = await fetch(`/api/chat/${chatId}`, {
        method: 'DELETE'
      });

      if (!response.ok) throw new Error('Failed to delete chat');
      
      setChats(prev => prev.filter(chat => chat.id !== chatId));
      if (currentChat?.id === chatId) {
        setCurrentChat(null);
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ChatContext.Provider
      value={{
        chats,
        currentChat,
        isLoading,
        error,
        socket,
        connectionStatus,
        createChat,
        sendMessage,
        sendMessageWithFiles,
        selectChat,
        deleteChat
      }}
    >
      {children}
    </ChatContext.Provider>
  );
}

export function useChat() {
  const context = useContext(ChatContext);
  if (context === undefined) {
    throw new Error('useChat must be used within a ChatProvider');
  }
  return context;
}