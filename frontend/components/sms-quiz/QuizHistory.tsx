
import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Skeleton } from '@/components/ui/skeleton';
import { MessageSquare, Clock, Phone, ListChecks } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface SentMessage {
  id: string;
  to: string;
  body: string;
  questions?: number[];
  timestamp: Date;
  status?: string;
}

export default function QuizHistory({ refreshTrigger }: { refreshTrigger: number }) {
  const [messages, setMessages] = useState<SentMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [simulationMode, setSimulationMode] = useState(false);
  
  // Format phone number for privacy
  const formatPhoneNumber = (phone: string) => {
    return phone.slice(0, 5) + '••••' + phone.slice(-4);
  };
  
  // Format date for display
  const formatDate = (date: Date) => {
    return new Date(date).toLocaleString('bn-BD', {
      day: 'numeric',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit'
    });
  };
  
  useEffect(() => {
    const fetchMessages = async () => {
      setLoading(true);
      try {
        const response = await fetch('/api/sms-quiz');
        const data = await response.json();
        
        if (data.messages) {
          // Convert string dates to Date objects
          const formattedMessages = data.messages.map((message: any) => ({
            ...message,
            timestamp: new Date(message.timestamp)
          }));
          
          setMessages(formattedMessages);
          setSimulationMode(data.simulationMode);
        }
      } catch (error) {
        console.error('Failed to fetch message history:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchMessages();
  }, [refreshTrigger]);
  
  // Get status badge color based on the message status
  const getStatusBadge = (status?: string) => {
    if (!status) return null;
    
    switch (status.toLowerCase()) {
      case 'delivered':
        return <Badge variant="outline" className="bg-green-900/20 text-green-300 border-green-500/30">ডেলিভারড</Badge>;
      case 'sent':
        return <Badge variant="outline" className="bg-blue-900/20 text-blue-300 border-blue-500/30">সেন্ট</Badge>;
      case 'failed':
        return <Badge variant="outline" className="bg-red-900/20 text-red-300 border-red-500/30">ফেইলড</Badge>;
      case 'queued':
        return <Badge variant="outline" className="bg-amber-900/20 text-amber-300 border-amber-500/30">কিউড</Badge>;
      default:
        return <Badge variant="outline" className="bg-gray-900/20 text-gray-300 border-gray-500/30">{status}</Badge>;
    }
  };
  
  // Determine if a message contains multiple questions
  const isMultipleQuestionsMessage = (message: SentMessage) => {
    return message.questions && message.questions.length > 1;
  };
  
  return (
    <Card className="border-purple-700/20 bg-gray-900/50 backdrop-blur-sm">
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle className="text-xl text-white">পাঠানো কুইজ ইতিহাস</CardTitle>
            <CardDescription>সর্বশেষ পাঠানো কুইজ প্রশ্নগুলি</CardDescription>
          </div>
          {simulationMode && (
            <Badge variant="outline" className="bg-amber-900/20 text-amber-300 border-amber-500/30">
              সিমুলেশন মোড
            </Badge>
          )}
        </div>
      </CardHeader>
      
      <CardContent>
        {loading ? (
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="flex flex-col gap-2">
                <Skeleton className="h-6 w-3/4" />
                <Skeleton className="h-12 w-full" />
                <Skeleton className="h-4 w-1/4" />
              </div>
            ))}
          </div>
        ) : messages.length === 0 ? (
          <div className="text-center py-8 text-gray-400">
            <MessageSquare className="h-12 w-12 mx-auto opacity-20 mb-2" />
            <p>এখনো কোন কুইজ পাঠানো হয়নি</p>
          </div>
        ) : (
          <ScrollArea className="h-[400px] pr-4">
            <div className="space-y-4">
              {messages.map((message) => (
                <div 
                  key={message.id} 
                  className="p-3 rounded-lg bg-gray-950 border border-gray-800"
                >
                  <div className="flex justify-between items-start mb-1">
                    <div className="flex items-center gap-2 text-sm text-purple-300">
                      <Phone size={14} />
                      <span>{formatPhoneNumber(message.to)}</span>
                      {isMultipleQuestionsMessage(message) && (
                        <Badge variant="outline" className="ml-2 bg-purple-900/20 text-purple-300 border-purple-500/30">
                          <ListChecks className="h-3 w-3 mr-1" />
                          {message.questions?.length || 5}টি প্রশ্ন
                        </Badge>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      {getStatusBadge(message.status)}
                      <div className="flex items-center gap-1 text-xs text-gray-500">
                        <Clock size={12} />
                        <span>{formatDate(message.timestamp)}</span>
                      </div>
                    </div>
                  </div>
                  <div className="mt-2 whitespace-pre-wrap text-gray-300 text-sm line-clamp-4 text-ellipsis overflow-hidden">
                    {message.body}
                  </div>
                  {message.body.length > 300 && (
                    <div className="mt-1 text-xs text-purple-400 cursor-pointer hover:underline">
                      বিস্তারিত দেখুন...
                    </div>
                  )}
                </div>
              ))}
            </div>
          </ScrollArea>
        )}
      </CardContent>
    </Card>
  );
}