"use client";

import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, Image as ImageIcon, Send, Trash2, Mic, MicOff, Volume2, VolumeX } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import ReactMarkdown from 'react-markdown';
import { motion, AnimatePresence } from "framer-motion";

export default function ImageExplanation() {
  const [image, setImage] = useState(null);
  const [question, setQuestion] = useState("");
  const [loading, setLoading] = useState(false);
  const [chatHistory, setChatHistory] = useState([]);
  const [extractedText, setExtractedText] = useState("");
  const [aiResponse, setAiResponse] = useState(null);
  const [isListening, setIsListening] = useState(false);
  const [recognition, setRecognition] = useState(null);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [currentSpeakingIndex, setCurrentSpeakingIndex] = useState(null);

  useEffect(() => {
    const savedHistory = localStorage.getItem('chatHistory');
    if (savedHistory) {
      setChatHistory(JSON.parse(savedHistory));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('chatHistory', JSON.stringify(chatHistory));
  }, [chatHistory]);

  useEffect(() => {
    // Initialize speech recognition
    if (typeof window !== 'undefined') {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      if (SpeechRecognition) {
        const recognition = new SpeechRecognition();
        recognition.lang = 'bn-BD'; // Bangla (Bangladesh)
        recognition.interimResults = false;
        recognition.maxAlternatives = 1;

        recognition.onresult = (event) => {
          const transcript = event.results[0][0].transcript;
          setQuestion(prev => prev + ' ' + transcript);
          setIsListening(false);
        };

        recognition.onerror = (event) => {
          console.error('Speech recognition error:', event.error);
          setIsListening(false);
        };

        recognition.onend = () => {
          setIsListening(false);
        };

        setRecognition(recognition);
      }
    }
  }, []);

  const toggleListening = () => {
    if (!recognition) {
      alert('Speech recognition is not supported in your browser.');
      return;
    }

    if (isListening) {
      recognition.stop();
      setIsListening(false);
    } else {
      try {
        recognition.start();
        setIsListening(true);
      } catch (error) {
        console.error('Error starting speech recognition:', error);
        setIsListening(false);
      }
    }
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const formatMarkdownResponse = (response) => {
    let markdown = `
# 📚 AI স্টাডি পার্টনার রেসপন্স

## 📝 ব্যাখ্যা
${response.explanation}

## 🔑 মূল পয়েন্টসমূহ
${response.keyPoints.map(point => `- ${point}`).join('\n')}

## 💡 উদাহরণসমূহ
${response.examples.map(example => `- ${example}`).join('\n')}

## 📊 কঠিনতার মাত্রা
\`${response.difficultyLevel}\``;

    // Add mathematical solution section if present
    if (response.mathematicalSolution) {
      markdown += `\n\n## 🧮 গাণিতিক সমাধান

### সমস্যা
${response.mathematicalSolution.problem}

### সমাধানের ধাপসমূহ
${response.mathematicalSolution.steps.map(step => `- ${step}`).join('\n')}

### উত্তর
${response.mathematicalSolution.answer}

### ব্যাখ্যা
${response.mathematicalSolution.explanation}

### সম্পূর্ণ সমাধান
${response.mathematicalSolution.fullSolution}`;
    }

    return markdown;
  };

  const clearChat = () => {
    setChatHistory([]);
    setExtractedText("");
    setAiResponse(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!image || !question.trim()) return;

    setLoading(true);
    setChatHistory(prev => [...prev, { role: 'user', content: question }]);

    try {
      const response = await fetch(image);
      const blob = await response.blob();
      const file = new File([blob], "image.jpg", { type: "image/jpeg" });

      const formData = new FormData();
      formData.append('image', file);
      formData.append('question', question);

      const result = await fetch('/api/image-explanation', {
        method: 'POST',
        body: formData,
      });

      const data = await result.json();

      if (!result.ok) {
        throw new Error(data.error || 'Failed to process image');
      }

      setExtractedText(data.text);
      
      setAiResponse({
        explanation: data.explanation,
        keyPoints: data.keyPoints,
        examples: data.examples,
        difficultyLevel: data.difficultyLevel,
        mathematicalSolution: data.mathematicalSolution
      });

      const markdownResponse = formatMarkdownResponse({
        explanation: data.explanation,
        keyPoints: data.keyPoints,
        examples: data.examples,
        difficultyLevel: data.difficultyLevel,
        mathematicalSolution: data.mathematicalSolution
      });

      setChatHistory(prev => [
        ...prev,
        { 
          role: 'assistant', 
          content: `## 📄 Extracted Text\n${data.text}\n\n${markdownResponse}` 
        }
      ]);

    } catch (error) {
      console.error('Error:', error);
      setChatHistory(prev => [
        ...prev,
        { 
          role: 'assistant', 
          content: 'Sorry, there was an error processing your image. Please try again.' 
        }
      ]);
    } finally {
      setLoading(false);
      setQuestion("");
    }
  };

  // Add text-to-speech function
  const speakBangla = (text, index) => {
    // Cancel any ongoing speech
    window.speechSynthesis.cancel();
    setIsSpeaking(false);
    setCurrentSpeakingIndex(null);

    // If clicking the same message that's currently speaking, just stop
    if (currentSpeakingIndex === index) {
      return;
    }

    // Clean and prepare the text
    const cleanText = text
      .replace(/```[\s\S]*?```/g, '') // Remove code blocks
      .replace(/`([^`]+)`/g, '$1')    // Remove inline code
      .replace(/#{1,6}\s/g, '')       // Remove markdown headers
      .replace(/\*\*/g, '')           // Remove bold markers
      .replace(/\*/g, '')             // Remove italic markers
      .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1') // Remove markdown links
      .trim();

    // Split text into sentences for better handling
    const sentences = cleanText.split(/[.!?।]+/).filter(s => s.trim().length > 0);

    // Create utterances for each sentence
    const utterances = sentences.map(sentence => {
      const utterance = new SpeechSynthesisUtterance(sentence.trim());
      utterance.lang = 'bn-BD';
      utterance.rate = 0.9;
      utterance.pitch = 1;

      // Get all available voices
      const voices = window.speechSynthesis.getVoices();
      
      // Try to find a Bengali voice
      let banglaVoice = voices.find(v => v.lang === 'bn-BD' || v.lang.startsWith('bn'));
      
      // If no Bengali voice is found, try to find any Indian voice
      if (!banglaVoice) {
        banglaVoice = voices.find(v => v.lang.startsWith('hi') || v.lang.startsWith('en-IN'));
      }

      if (banglaVoice) {
        utterance.voice = banglaVoice;
      }

      return utterance;
    });

    // Set up event handlers for the first utterance
    if (utterances.length > 0) {
      utterances[0].onstart = () => {
        setIsSpeaking(true);
        setCurrentSpeakingIndex(index);
      };

      utterances[utterances.length - 1].onend = () => {
        setIsSpeaking(false);
        setCurrentSpeakingIndex(null);
      };

      utterances[utterances.length - 1].onerror = (event) => {
        console.error('Speech error:', event);
        setIsSpeaking(false);
        setCurrentSpeakingIndex(null);
      };

      // Queue all utterances
      utterances.forEach(utterance => {
        window.speechSynthesis.speak(utterance);
      });
    }
  };

  // Clean up speech synthesis when component unmounts
  useEffect(() => {
    return () => {
      window.speechSynthesis.cancel();
    };
  }, []);

  // Load voices when component mounts
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const loadVoices = () => {
        const voices = window.speechSynthesis.getVoices();
        console.log('Available voices:', voices.map(v => `${v.name} (${v.lang})`));
      };

      loadVoices();
      
      if (window.speechSynthesis.onvoiceschanged !== undefined) {
        window.speechSynthesis.onvoiceschanged = loadVoices;
      }
    }
  }, []);

  return (
    <div className="h-screen w-screen overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <Card className="h-full w-full rounded-none border-0 shadow-none bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
        <div className="h-full flex flex-col md:flex-row">
          {/* Image Section */}
          <div className="w-full md:w-[30%] p-6 border-b md:border-b-0 md:border-r border-gray-200 dark:border-gray-700">
            <div className="flex flex-col h-full">
              <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-200">
                ছবির প্রিভিউ
              </h2>
              
              {/* Image Upload Area */}
              <div className="flex-1 flex flex-col">
                <label className="block mb-4">
                  <div className="flex justify-center px-6 pt-5 pb-6 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg hover:border-primary/50 dark:hover:border-primary/50 transition-colors">
                    <div className="space-y-1 text-center">
                      <ImageIcon className="mx-auto h-12 w-12 text-gray-400" />
                      <div className="flex text-sm text-gray-600 dark:text-gray-400">
                        <label className="relative cursor-pointer rounded-md font-medium text-primary hover:text-primary/80 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-primary">
                          <span>ফাইল আপলোড করুন</span>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={handleImageUpload}
                            className="sr-only"
                          />
                        </label>
                        <p className="pl-1">বা ড্র্যাগ এন্ড ড্রপ করুন</p>
                      </div>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        PNG, JPG, GIF সর্বোচ্চ ১০MB
                      </p>
                    </div>
                  </div>
                </label>

                {/* Image Preview */}
                <AnimatePresence>
                  {image && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      className="flex-1 relative group"
                    >
                      <div className="absolute inset-0 rounded-lg overflow-hidden shadow-lg border border-gray-200 dark:border-gray-700">
                        <img
                          src={image}
                          alt="Uploaded"
                          className="w-full h-full object-contain transition-transform duration-300 group-hover:scale-105"
                        />
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>

          {/* Chat Section */}
          <div className="flex-1 flex flex-col h-full">
            {/* Header */}
            <div className="flex justify-between items-center p-6 border-b border-gray-200 dark:border-gray-700">
              <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                ছবি থেকে টেক্সট এক্সট্র্যাকশন ও ব্যাখ্যা
              </h1>
              <Button
                variant="ghost"
                onClick={clearChat}
                className="text-sm hover:bg-red-100 dark:hover:bg-red-900/20 transition-colors"
              >
                <Trash2 className="w-4 h-4 mr-2" />
                চ্যাট মুছে ফেলুন
              </Button>
            </div>

            {/* Chat Messages */}
            <div className="flex-1 overflow-y-auto p-6">
              <div className="space-y-4">
                <AnimatePresence>
                  {chatHistory.map((message, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      className={`flex ${
                        message.role === 'user' ? 'justify-end' : 'justify-start'
                      }`}
                    >
                      <div
                        className={`max-w-[80%] rounded-2xl p-4 shadow-md ${
                          message.role === 'user'
                            ? 'bg-primary text-primary-foreground ml-4'
                            : 'bg-white dark:bg-gray-800 mr-4'
                        }`}
                      >
                        <div className="prose prose-sm dark:prose-invert max-w-none [&>h1]:text-xl [&>h1]:font-bold [&>h1]:mb-4 [&>h2]:text-lg [&>h2]:font-semibold [&>h2]:mt-6 [&>h2]:mb-3 [&>p]:text-sm [&>p]:leading-relaxed [&>ul]:list-disc [&>ul]:pl-4 [&>ul]:space-y-1 [&>ul>li]:text-sm [&>code]:bg-muted-foreground/20 [&>code]:px-1.5 [&>code]:py-0.5 [&>code]:rounded [&>h3]:text-base [&>h3]:font-medium [&>h3]:mt-4 [&>h3]:mb-2">
                          <ReactMarkdown>
                            {message.content}
                          </ReactMarkdown>
                          {message.role === 'assistant' && (
                            <Button
                              type="button"
                              onClick={() => speakBangla(message.content)}
                              className={`mt-2 p-2 rounded-full ${
                                isSpeaking 
                                  ? 'bg-red-500 hover:bg-red-600' 
                                  : 'bg-primary hover:bg-primary/90'
                              }`}
                              title={isSpeaking ? 'অডিও বন্ধ করুন' : 'অডিও শুনুন'}
                            >
                              {isSpeaking ? (
                                <VolumeX className="h-4 w-4 text-white" />
                              ) : (
                                <Volume2 className="h-4 w-4 text-white" />
                              )}
                            </Button>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </div>

            {/* Input Form */}
            <div className="p-6 border-t border-gray-200 dark:border-gray-700 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm">
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="relative">
                  <Textarea
                    value={question}
                    onChange={(e) => setQuestion(e.target.value)}
                    placeholder="ছবি সম্পর্কে জিজ্ঞাসা করুন..."
                    className="min-h-[100px] resize-none rounded-xl border-gray-200 dark:border-gray-700 focus:border-primary dark:focus:border-primary transition-colors pr-12"
                  />
                  <Button
                    type="button"
                    onClick={toggleListening}
                    className={`absolute right-2 bottom-2 p-2 rounded-full ${
                      isListening 
                        ? 'bg-red-500 hover:bg-red-600' 
                        : 'bg-primary hover:bg-primary/90'
                    }`}
                    title={isListening ? 'ভয়েস রেকর্ডিং বন্ধ করুন' : 'ভয়েস দিয়ে প্রশ্ন করুন'}
                  >
                    {isListening ? (
                      <MicOff className="h-5 w-5 text-white" />
                    ) : (
                      <Mic className="h-5 w-5 text-white" />
                    )}
                  </Button>
                </div>
                <Button
                  type="submit"
                  disabled={!image || !question.trim() || loading}
                  className="w-full rounded-xl bg-primary hover:bg-primary/90 text-white font-medium py-3 transition-all duration-200 transform hover:scale-[1.02] focus:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      প্রসেসিং...
                    </>
                  ) : (
                    <>
                      <Send className="mr-2 h-4 w-4" />
                      ব্যাখ্যা পান
                    </>
                  )}
                </Button>
              </form>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
