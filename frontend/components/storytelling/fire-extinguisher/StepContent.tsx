"use client";

import { Lightbulb, CheckCircle2, AlertTriangle, Info } from "lucide-react";

interface StepContentProps {
  currentStep: number;
}

export default function StepContent({ currentStep }: StepContentProps) {
  return (
    <div className="bg-amber-50 p-4 rounded-xl border border-amber-200 shadow-inner">
      {currentStep === 0 && (
        <div className="flex flex-col items-center text-center">
          <div className="bg-amber-100 p-3 rounded-full mb-3">
            <Lightbulb size={28} className="text-amber-500" />
          </div>
          <h3 className="text-amber-900 text-lg font-medium mb-2">আগুন নিয়ে শিখতে চলেছেন?</h3>
          <p className="text-amber-700">
            আমরা শিখব আগুন কীভাবে জ্বলে এবং অগ্নি নির্বাপক কীভাবে আগুন নেভায়। 
            শুরু করতে নিচের "শুরু করুন" বোতামে ক্লিক করুন!
          </p>
        </div>
      )}
      
      {currentStep === 1 && (
        <div className="space-y-2">
          <div className="flex items-start gap-3">
            <div className="bg-amber-100 p-1.5 rounded-full shrink-0 mt-0.5">
              <Info size={16} className="text-amber-600" />
            </div>
            <div>
              <h4 className="font-medium text-amber-900">আগুনের ত্রিভুজ</h4>
              <p className="text-amber-700 text-sm">
                আগুন জ্বলার জন্য তিনটি জিনিসের প্রয়োজন: জ্বালানি, অক্সিজেন এবং তাপ। 
                এই তিনটি উপাদান একসাথে থাকলেই আগুন জ্বলতে পারে।
              </p>
            </div>
          </div>
          
          <div className="flex items-start gap-3">
            <div className="bg-red-100 p-1.5 rounded-full shrink-0 mt-0.5">
              <AlertTriangle size={16} className="text-red-600" />
            </div>
            <div>
              <h4 className="font-medium text-amber-900">বিপদ!</h4>
              <p className="text-amber-700 text-sm">
                দেখো, টেবিলের উপর রাখা মোমবাতিতে আগুন ধরেছে! 
                আমাদের দ্রুত এই আগুন নেভাতে হবে।
              </p>
            </div>
          </div>
        </div>
      )}
      
      {currentStep === 2 && (
        <div className="space-y-2">
          <div className="flex items-start gap-3">
            <div className="bg-amber-100 p-1.5 rounded-full shrink-0 mt-0.5">
              <Info size={16} className="text-amber-600" />
            </div>
            <div>
              <h4 className="font-medium text-amber-900">অগ্নি নির্বাপক পরিচিতি</h4>
              <p className="text-amber-700 text-sm">
                সেই দেওয়ালে লাল রঙের অগ্নি নির্বাপক দেখতে পাচ্ছ? এটি একটি বিশেষ যন্ত্র যা আগুন নেভাতে ব্যবহার করা হয়।
                অগ্নি নির্বাপকের মধ্যে এমন রাসায়নিক পদার্থ থাকে যা আগুনকে খুব দ্রুত নিভিয়ে দিতে পারে।
              </p>
            </div>
          </div>
          

        </div>
      )}
      
      {currentStep === 3 && (
        <div className="space-y-2">
          <div className="flex items-start gap-3">
            <div className="bg-blue-100 p-1.5 rounded-full shrink-0 mt-0.5">
              <Info size={16} className="text-blue-600" />
            </div>
            <div>
              <h4 className="font-medium text-amber-900">আগুন নেভানোর প্রক্রিয়া</h4>
              <p className="text-amber-700 text-sm">
                অগ্নি নির্বাপক থেকে বেরোনো পদার্থ আগুনকে ঢেকে দেয়। এতে আগুনে অক্সিজেন পৌঁছাতে 
                পারে না এবং আগুন নিভে যায়। আমরা আগুনের ত্রিভুজের অক্সিজেন অংশকে সরিয়ে দিচ্ছি।
              </p>
            </div>
          </div>
          
          <div className="flex items-start gap-3">
            <div className="bg-amber-100 p-1.5 rounded-full shrink-0 mt-0.5">
              <AlertTriangle size={16} className="text-amber-600" />
            </div>
            <div>
              <h4 className="font-medium text-amber-900">সতর্কতা!</h4>
              <p className="text-amber-700 text-sm">
                কখনও নিজে আগুন নেভাতে চেষ্টা করবে না! বড় আগুন দেখলে সবসময় 
                বড়দের ডাকবে এবং প্রয়োজনে ফায়ার সার্ভিসকে কল করবে (১০১)।
              </p>
            </div>
          </div>
        </div>
      )}
      
      {currentStep === 4 && (
        <div className="space-y-2">
          <div className="flex items-start gap-3">
            <div className="bg-green-100 p-1.5 rounded-full shrink-0 mt-0.5">
              <CheckCircle2 size={16} className="text-green-600" />
            </div>
            <div>
              <h4 className="font-medium text-amber-900">আমরা সফল হয়েছি!</h4>
              <p className="text-amber-700 text-sm">
                অগ্নি নির্বাপকের সাহায্যে আমরা আগুন নিভিয়ে ফেলেছি। আমরা দেখলাম কীভাবে অগ্নি নির্বাপক 
                আগুনের ত্রিভুজকে ভেঙে দেয়। এটি হয় অক্সিজেন সরিয়ে, জ্বালানি ঢেকে দিয়ে, অথবা আগুনকে 
                ঠান্ডা করে।
              </p>
            </div>
          </div>
          
        </div>
      )}
    </div>
  );
}