"use client";
import SMSQuiz from "@/components/sms-quiz";
import { Smartphone, MessageSquare, Brain, Zap, ScrollText, Layers } from 'lucide-react';

export default function SMSQuizPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900/20 to-gray-900">
      {/* Header Section */}
      <div className="bg-gray-900/80 backdrop-blur-sm border-b border-purple-700/20">
        <div className="container mx-auto px-4 py-6">
          <div className="text-center">
            <div className="flex justify-center items-center gap-3 mb-3">
              <div className="p-2 bg-purple-700/20 rounded-lg">
                <Smartphone className="h-8 w-8 text-purple-400" />
              </div>
              <h1 className="text-3xl md:text-4xl font-bold text-white">
                এসএমএস কুইজ সিস্টেম
              </h1>
            </div>
            <p className="text-gray-300 text-lg max-w-2xl mx-auto">
              Twilio ব্যবহার করে বিজ্ঞান বিষয়ে কুইজ প্রশ্ন এসএমএস হিসেবে পাঠান
            </p>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-gray-900/50 backdrop-blur-sm border border-purple-700/20 rounded-lg p-4">
            <div className="flex items-center gap-3 mb-2">
              <MessageSquare className="h-6 w-6 text-purple-400" />
              <h3 className="text-white font-semibold">SMS Integration</h3>
            </div>
            <p className="text-gray-400 text-sm">
              Twilio API ব্যবহার করে সরাসরি মোবাইলে কুইজ পাঠান
            </p>
          </div>
          
          <div className="bg-gray-900/50 backdrop-blur-sm border border-purple-700/20 rounded-lg p-4">
            <div className="flex items-center gap-3 mb-2">
              <Brain className="h-6 w-6 text-purple-400" />
              <h3 className="text-white font-semibold">বিজ্ঞান কুইজ</h3>
            </div>
            <p className="text-gray-400 text-sm">
              পদার্থবিদ্যা, রসায়ন, জীববিদ্যা ও পরিবেশ বিষয়ে প্রশ্ন
            </p>
          </div>
          
          <div className="bg-gray-900/50 backdrop-blur-sm border border-purple-700/20 rounded-lg p-4">
            <div className="flex items-center gap-3 mb-2">
              <Layers className="h-6 w-6 text-purple-400" />
              <h3 className="text-white font-semibold">শ্রেণী অনুযায়ী</h3>
            </div>
            <p className="text-gray-400 text-sm">
              ৬ষ্ঠ থেকে ১০ম শ্রেণী পর্যন্ত বিভিন্ন স্তরের প্রশ্ন
            </p>
          </div>
        </div>
        
        {/* New Feature Callout */}
        <div className="bg-purple-900/20 border border-purple-600/30 rounded-lg p-4 mb-8">
          <div className="flex items-start gap-3">
            <div className="p-2 rounded-full bg-purple-800/40">
              <ScrollText className="h-5 w-5 text-purple-300" />
            </div>
            <div>
              <h3 className="text-white font-medium mb-1">নতুন ফিচার: ৫টি কুইজ একসাথে পাঠান</h3>
              <p className="text-gray-300 text-sm">
                শ্রেণী এবং বিষয় অনুযায়ী ৫টি কুইজ প্রশ্ন একসাথে পাঠান। শিক্ষার্থীদের জন্য আকর্ষণীয় 
                এবং শিক্ষামূলক কুইজ সিরিজ তৈরি করুন।
              </p>
            </div>
          </div>
        </div>

        {/* Main Quiz Interface */}
        <SMSQuiz />

        {/* Instructions Section */}
        <div className="mt-8 bg-gray-900/30 backdrop-blur-sm border border-purple-700/20 rounded-lg p-6">
          <h2 className="text-xl font-semibold text-white mb-4">ব্যবহারের নিয়মাবলী</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-gray-300">
            <div>
              <h3 className="font-medium text-purple-400 mb-2">📱 ফোন নম্বর</h3>
              <ul className="space-y-1 text-sm">
                <li>• দেশের কোড সহ নম্বর দিন (+880)</li>
                <li>• Twilio ফ্রি অ্যাকাউন্টে ভেরিফাইড নম্বর প্রয়োজন</li>
                <li>• শুধু মোবাইল নম্বর সাপোর্ট করে</li>
              </ul>
            </div>
            <div>
              <h3 className="font-medium text-purple-400 mb-2">🧠 কুইজ প্রশ্ন</h3>
              <ul className="space-y-1 text-sm">
                <li>• একটি প্রশ্ন বা ৫টি প্রশ্ন একসাথে পাঠাতে পারেন</li>
                <li>• শ্রেণী ও বিষয় অনুসারে প্রশ্ন নির্বাচন করুন</li>
                <li>• MCQ ফরম্যাটে A, B, C, D অপশন</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}