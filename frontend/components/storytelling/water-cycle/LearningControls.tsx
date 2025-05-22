"use client";

import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, Play, RefreshCw, Droplets } from 'lucide-react';

interface Step {
  id: string;
  title: string;
}

interface LearningControlsProps {
  steps: Step[];
  currentStep: number;
  setCurrentStep: (step: number) => void;
  setActiveProcess: (process: string | null) => void;
}

export default function LearningControls({
  steps,
  currentStep,
  setCurrentStep,
  setActiveProcess
}: LearningControlsProps) {
  const isFirstStep = currentStep === 0;
  const isLastStep = currentStep === steps.length - 1;
  
  const handlePrevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
      setActiveProcess(null);
    }
  };
  
  const handleNextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
      setActiveProcess(null);
    }
  };
  
  const goToStart = () => {
    setCurrentStep(0);
    setActiveProcess(null);
  };
  
  return (
    <div className="bg-white rounded-xl shadow-lg border border-sky-200 flex flex-col">
      {/* Top section: Progress indicator and steps */}
      <div className="p-3 pb-0">
        {/* Progress indicator and step counter */}
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-lg font-bold text-sky-800">
            {currentStep === 0 ? 'শুরু করুন' : steps[currentStep]?.title || ''}
          </h2>
          
          <div className="flex items-center">
            <span className="text-sm text-sky-600">
              {currentStep}/{steps.length - 1} ধাপ
            </span>
          </div>
        </div>
        
        {/* Progress bar */}
        <div className="w-full h-2 bg-gray-200 rounded-full mb-3 overflow-hidden">
          <motion.div 
            className="h-full bg-gradient-to-r from-sky-400 to-blue-500"
            initial={{ width: '0%' }}
            animate={{ width: `${(currentStep / (steps.length - 1)) * 100}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>
        
        {/* Step indicators - more compact */}
        <div className="flex justify-between items-center mb-3 relative">
          {steps.map((step, index) => (
            <div 
              key={step.id}
              className="flex flex-col items-center"
              style={{ width: `${100 / steps.length}%` }}
            >
              <button
                onClick={() => {
                  setCurrentStep(index);
                  setActiveProcess(null);
                }}
                className={`w-8 h-8 rounded-full flex items-center justify-center mb-1 transition-colors ${
                  index === 0 
                    ? 'bg-white text-sky-500 border-2 border-sky-500' 
                    : index <= currentStep 
                    ? 'bg-gradient-to-r from-sky-500 to-blue-500 text-white' 
                    : 'bg-gray-200 text-gray-400'
                }`}
                disabled={index === 0 && currentStep === 0}
              >
                {index === 0 ? (
                  <Play size={14} />
                ) : (
                  <span className="text-xs font-medium">{index}</span>
                )}
              </button>
              
              <span className={`text-xs font-medium text-center truncate w-full ${
                index <= currentStep ? 'text-sky-800' : 'text-gray-500'
              }`}>
                {step.title}
              </span>
              
              {index < steps.length - 1 && (
                <div 
                  className={`h-0.5 absolute w-[calc(100%/${steps.length}-2rem)] left-[calc(${index*100/steps.length}%+1rem)] top-[1rem] ${
                    index < currentStep ? 'bg-gradient-to-r from-sky-500 to-blue-500' : 'bg-gray-200'
                  }`}
                  style={{
                    transform: 'translateX(1.25rem)'
                  }}
                />
              )}
            </div>
          ))}
        </div>
      </div>
      
      {/* Middle section: Content area */}
      <div className="px-3">
        <div className="bg-sky-50 p-3 rounded-xl min-h-[80px] flex items-center justify-center">
          {currentStep === 0 ? (
            <div className="text-center">
              <div className="flex justify-center mb-2">
                <Droplets size={36} className="text-sky-500" />
              </div>
              <p className="text-sky-900 text-base mb-1 font-medium">
                পানি চক্র শিখতে চলেছেন?
              </p>
              <p className="text-sky-700 text-sm">
                নিচের "শুরু করুন" বাটনে ক্লিক করুন এবং পানি কীভাবে পৃথিবীর চারপাশে ঘুরে বেড়ায় তা শিখুন!
              </p>
            </div>
          ) : (
            <div>
              {currentStep === 1 && (
                <p className="text-sky-700 font-bengali text-sm md:text-base">
                  সূর্যের উত্তাপে পানি বাষ্প হয়ে আকাশে উঠে যায়। এই প্রক্রিয়াকে বাষ্পীভবন বলে।
                  নদী, সমুদ্র, পুকুর থেকে পানি এভাবে বাষ্প হয়ে আকাশে ওঠে।
                </p>
              )}
              {currentStep === 2 && (
                <p className="text-sky-700 font-bengali text-sm md:text-base">
                  আকাশে উপরে উঠে জলীয় বাষ্প ঠান্ডা হয়ে ছোট ছোট জলকণায় পরিণত হয় এবং মেঘ তৈরি হয়।
                  একে ঘনীভবন বলে। এভাবেই আকাশে বাদল জমে থাকে!
                </p>
              )}
              {currentStep === 3 && (
                <p className="text-sky-700 font-bengali text-sm md:text-base">
                  মেঘের ভেতরে জলকণা বড় হয়ে ভারী হয়ে যায় এবং বৃষ্টি হিসেবে পৃথিবীতে নেমে আসে।
                  এই প্রক্রিয়াকেই বৃষ্টিপাত বলে।
                </p>
              )}
              {currentStep === 4 && (
                <p className="text-sky-700 font-bengali text-sm md:text-base">
                  বৃষ্টির পানি মাটিতে পড়ে নদী, পুকুর এবং মাটির নিচে সংগ্রহ হয়, যা আমরা ব্যবহার করি।
                  মাটির নিচে জমে থাকা পানিকে ভূ-গর্ভস্থ জল বলে।
                </p>
              )}
              {currentStep === 5 && (
                <p className="text-sky-700 font-bengali text-sm md:text-base">
                  এভাবেই পানি চক্রের মাধ্যমে সারা বিশ্বের পানি ঘুরে বেড়ায় এবং পরিশোধিত হয়।
                  এই চক্রের কারণে পৃথিবীতে পানির অভাব হয় না।
                </p>
              )}
            </div>
          )}
        </div>
      </div>
      
      {/* Bottom section: Navigation buttons */}
      <div className="flex justify-between items-center p-3 pt-2 mt-auto">
        <button
          onClick={handlePrevStep}
          disabled={isFirstStep}
          className={`flex items-center px-3 py-1.5 rounded-lg text-sm ${
            isFirstStep 
              ? 'bg-gray-200 text-gray-400 cursor-not-allowed' 
              : 'bg-white border border-sky-500 text-sky-600 hover:bg-sky-50'
          }`}
        >
          <ChevronLeft size={14} className="mr-1" />
          <span>আগের ধাপ</span>
        </button>
        
        {isFirstStep ? (
          <button
            onClick={handleNextStep}
            className="bg-gradient-to-r from-sky-500 to-blue-500 hover:from-sky-600 hover:to-blue-600 text-white px-4 py-1.5 rounded-lg flex items-center shadow-md text-sm"
          >
            <span>শুরু করুন</span>
            <Play size={14} className="ml-1.5" />
          </button>
        ) : isLastStep ? (
          <button
            onClick={goToStart}
            className="bg-gradient-to-r from-sky-500 to-blue-500 hover:from-sky-600 hover:to-blue-600 text-white px-4 py-1.5 rounded-lg flex items-center shadow-md text-sm"
          >
            <RefreshCw size={14} className="mr-1.5" />
            <span>আবার শুরু করুন</span>
          </button>
        ) : (
          <button
            onClick={handleNextStep}
            className="bg-gradient-to-r from-sky-500 to-blue-500 hover:from-sky-600 hover:to-blue-600 text-white px-4 py-1.5 rounded-lg flex items-center shadow-md text-sm"
          >
            <span>পরের ধাপ</span>
            <ChevronRight size={14} className="ml-1.5" />
          </button>
        )}
      </div>
    </div>
  );
}