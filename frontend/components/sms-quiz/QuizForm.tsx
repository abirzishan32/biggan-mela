"use client";
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { quizQuestions } from '@/app/api/sms-quiz/questions';
import { AlertCircle, Send, Loader2, InfoIcon } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';

interface QuizFormProps {
  onQuizSent: () => void;
}

export default function QuizForm({ onQuizSent }: QuizFormProps) {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [questionId, setQuestionId] = useState<string>('random');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [twilioError, setTwilioError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [simulationMode, setSimulationMode] = useState(false);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!phoneNumber) {
      setError('মোবাইল নম্বর দিন');
      return;
    }
    
    setLoading(true);
    setError(null);
    setTwilioError(null);
    setSuccess(null);
    
    try {
      const response = await fetch('/api/sms-quiz', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          phoneNumber,
          questionId: questionId === 'random' ? undefined : parseInt(questionId)
        })
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        if (data.twilioError) {
          setTwilioError(data.twilioError);
        }
        throw new Error(data.error || 'Failed to send quiz');
      }
      
      setSimulationMode(data.simulated);
      setSuccess(data.simulated ? 
        'কুইজ পাঠানো হয়েছে (সিমুলেশন মোড)!' : 
        'কুইজ পাঠানো হয়েছে!');
      onQuizSent();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'কুইজ পাঠাতে ব্যর্থ হয়েছে');
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <Card className="border-purple-700/20 bg-gray-900/50 backdrop-blur-sm">
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle className="text-xl text-white">এসএমএস কুইজ পাঠান</CardTitle>
            <CardDescription>
              বিজ্ঞান বিষয়ে একটি কুইজ প্রশ্ন এসএমএস হিসেবে পাঠান
            </CardDescription>
          </div>
          {simulationMode && (
            <Badge variant="outline" className="bg-amber-900/20 text-amber-300 border-amber-500/30">
              সিমুলেশন মোড
            </Badge>
          )}
        </div>
      </CardHeader>
      
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          {error && (
            <Alert variant="destructive" className="bg-red-900/20 border-red-700/30 text-red-300">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          
          {twilioError && (
            <Alert variant="destructive" className="bg-amber-900/20 border-amber-700/30 text-amber-300">
              <InfoIcon className="h-4 w-4" />
              <AlertDescription className="text-xs overflow-auto max-h-20">
                <strong>Twilio Error:</strong> {twilioError}
              </AlertDescription>
            </Alert>
          )}
          
          {success && (
            <Alert className="bg-green-900/20 border-green-700/30 text-green-300">
              <AlertDescription>{success}</AlertDescription>
            </Alert>
          )}
          
          <div className="space-y-2">
            <label htmlFor="phoneNumber" className="text-sm font-medium text-gray-300">
              মোবাইল নাম্বার
            </label>
            <Input
              id="phoneNumber"
              placeholder="+880170XXXXXXX"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              className="bg-gray-950 border-gray-700"
            />
            <p className="text-xs text-gray-500">
              দেশের কোড সহ মোবাইল নাম্বার দিন (যেমন +880)। Twilio ফ্রি অ্যাকাউন্টে শুধু ভেরিফাইড নাম্বারে পাঠানো যাবে।
            </p>
          </div>
          
          <div className="space-y-2">
            <label htmlFor="questionSelect" className="text-sm font-medium text-gray-300">
              কুইজ প্রশ্ন
            </label>
            <Select 
              value={questionId} 
              onValueChange={setQuestionId}
            >
              <SelectTrigger id="questionSelect" className="bg-gray-950 border-gray-700">
                <SelectValue placeholder="Select a question" />
              </SelectTrigger>
              <SelectContent className="bg-gray-950 border-gray-800">
                <SelectItem value="random">র‍্যান্ডম প্রশ্ন</SelectItem>
                {quizQuestions.map((q) => (
                  <SelectItem key={q.id} value={q.id.toString()}>
                    {q.question.length > 40 ? q.question.substring(0, 40) + '...' : q.question}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
        
        <CardFooter>
          <Button 
            type="submit" 
            disabled={loading}
            className="w-full bg-purple-700 hover:bg-purple-600"
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                পাঠানো হচ্ছে...
              </>
            ) : (
              <>
                <Send className="mr-2 h-4 w-4" />
                কুইজ পাঠান
              </>
            )}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}