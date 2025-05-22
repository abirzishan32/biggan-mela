export interface QuizQuestion {
  id: number;
  question: string;
  options: string[];
  answer: string;
  explanation: string;
  level: 'easy' | 'medium' | 'hard';
  subject: 'physics' | 'chemistry' | 'biology' | 'environment';
  class: '6' | '7' | '8' | '9' | '10';
}

export const quizQuestions: QuizQuestion[] = [
  {
    id: 1,
    question: "পানি কয় অবস্থায় পাওয়া যায়?",
    options: ["১টি", "২টি", "৩টি", "৪টি"],
    answer: "৩টি",
    explanation: "পানি তিন অবস্থায় পাওয়া যায়: কঠিন (বরফ), তরল (পানি) এবং গ্যাসীয় (বাষ্প)।",
    level: "easy",
    subject: "physics",
    class: "6"
  },
  {
    id: 2,
    question: "সূর্য থেকে পৃথিবীতে আলো পৌঁছাতে কত সময় লাগে?",
    options: ["১ সেকেন্ড", "৮ মিনিট", "১ ঘণ্টা", "১ দিন"],
    answer: "৮ মিনিট",
    explanation: "সূর্য থেকে পৃথিবীতে আলো পৌঁছাতে প্রায় ৮ মিনিট ২০ সেকেন্ড সময় লাগে।",
    level: "medium",
    subject: "physics",
    class: "8"
  },
  {
    id: 3,
    question: "উদ্ভিদ খাদ্য তৈরি করে কোন প্রক্রিয়ায়?",
    options: ["শ্বসন", "সালোকসংশ্লেষণ", "পাচন", "প্রস্বেদন"],
    answer: "সালোকসংশ্লেষণ",
    explanation: "উদ্ভিদ সালোকসংশ্লেষণ প্রক্রিয়ায় সূর্যালোক, কার্বন ডাই-অক্সাইড এবং পানি ব্যবহার করে খাদ্য তৈরি করে।",
    level: "easy",
    subject: "biology",
    class: "7"
  },
  {
    id: 4,
    question: "প্লাস্টিক বর্জ্য কত বছরে পচনশীল হয়?",
    options: ["১০-২০ বছর", "৫০-১০০ বছর", "৪০০-৫০০ বছর", "১০০০+ বছর"],
    answer: "৪০০-৫০০ বছর",
    explanation: "বেশিরভাগ প্লাস্টিক বর্জ্য পচতে ৪০০ থেকে ৫০০ বছর সময় লাগতে পারে।",
    level: "medium",
    subject: "environment",
    class: "9"
  },
  {
    id: 5,
    question: "পর্যায় সারণীতে কয়টি মৌল আছে?",
    options: ["৯২টি", "১০৪টি", "১১২টি", "১১৮টি"],
    answer: "১১৮টি",
    explanation: "আধুনিক পর্যায় সারণীতে ১১৮টি মৌল রয়েছে, যার মধ্যে ৯৪টি প্রাকৃতিকভাবে পাওয়া যায়।",
    level: "hard",
    subject: "chemistry",
    class: "10"
  },
  // Adding more questions to have enough for each subject/class combination
  {
    id: 6,
    question: "কোনটি উষ্ণ রক্তের প্রাণী?",
    options: ["সাপ", "ব্যাঙ", "পাখি", "টিকটিকি"],
    answer: "পাখি",
    explanation: "পাখি উষ্ণ রক্তের প্রাণী, যারা তাদের শরীরের তাপমাত্রা নিয়ন্ত্রণ করতে পারে।",
    level: "easy",
    subject: "biology",
    class: "8"
  },
  {
    id: 7,
    question: "কোনটি অম্লের বৈশিষ্ট্য নয়?",
    options: ["অম্লীয় স্বাদ", "নীল লিটমাস লাল করে", "pH 7 এর নিচে", "ক্ষারের সাথে প্রতিক্রিয়া করে না"],
    answer: "ক্ষারের সাথে প্রতিক্রিয়া করে না",
    explanation: "অম্ল ক্ষারের সাথে প্রতিক্রিয়া করে লবণ ও পানি উৎপন্ন করে।",
    level: "medium",
    subject: "chemistry",
    class: "9"
  },
  {
    id: 8,
    question: "বল কাকে বলে?",
    options: ["যা বস্তুর গতি পরিবর্তন করে", "যা বস্তুর ভর পরিবর্তন করে", "যা বস্তুর আকার পরিবর্তন করে", "যা বস্তুর রঙ পরিবর্তন করে"],
    answer: "যা বস্তুর গতি পরিবর্তন করে",
    explanation: "বল হল এমন একটি বাহ্যিক প্রভাব যা কোনো বস্তুর বিরাম অবস্থা বা গতির পরিবর্তন ঘটায়।",
    level: "easy",
    subject: "physics",
    class: "7"
  },
  {
    id: 9,
    question: "জলবায়ু পরিবর্তনের জন্য প্রধানত দায়ী গ্যাস কোনটি?",
    options: ["অক্সিজেন", "কার্বন ডাই-অক্সাইড", "নাইট্রোজেন", "হাইড্রোজেন"],
    answer: "কার্বন ডাই-অক্সাইড",
    explanation: "কার্বন ডাই-অক্সাইড গ্রিনহাউজ গ্যাস হিসেবে পরিবেশে তাপ আটকে রাখে, যা জলবায়ু পরিবর্তনের অন্যতম প্রধান কারণ।",
    level: "medium",
    subject: "environment",
    class: "10"
  },
  {
    id: 10,
    question: "মাটির উর্বরতা বাড়ানোর জন্য কোন প্রক্রিয়া ব্যবহৃত হয়?",
    options: ["জ্বালানি", "সার প্রয়োগ", "বাষ্পীভবন", "বায়ুদূষণ"],
    answer: "সার প্রয়োগ",
    explanation: "মাটির উর্বরতা বাড়ানোর জন্য জৈব বা রাসায়নিক সার প্রয়োগ করা হয়।",
    level: "easy",
    subject: "environment",
    class: "6"
  },
  // More questions...
];

export function getRandomQuestion(): QuizQuestion {
  const randomIndex = Math.floor(Math.random() * quizQuestions.length);
  return quizQuestions[randomIndex];
}

export function getQuestionById(id: number): QuizQuestion | undefined {
  return quizQuestions.find(q => q.id === id);
}

// New function to get questions filtered by class and subject
export function getFilteredQuestions(classLevel: string, subject: string, count: number = 5): QuizQuestion[] {
  let filtered = quizQuestions;
  
  // Filter by class if specified
  if (classLevel && classLevel !== 'all') {
    filtered = filtered.filter(q => q.class === classLevel);
  }
  
  // Filter by subject if specified
  if (subject && subject !== 'all') {
    filtered = filtered.filter(q => q.subject === subject);
  }
  
  // If we don't have enough questions after filtering, just return all filtered questions
  if (filtered.length <= count) {
    return filtered;
  }
  
  // Get random questions from filtered list
  const randomQuestions: QuizQuestion[] = [];
  const indices = new Set<number>();
  
  while (randomQuestions.length < count && randomQuestions.length < filtered.length) {
    const randomIndex = Math.floor(Math.random() * filtered.length);
    if (!indices.has(randomIndex)) {
      indices.add(randomIndex);
      randomQuestions.push(filtered[randomIndex]);
    }
  }
  
  return randomQuestions;
}

export function formatQuizMessage(question: QuizQuestion): string {
  // Format the question for SMS
  let message = `বিজ্ঞানযজ্ঞ কুইজ:\n\n${question.question}\n\n`;
  
  // Add options
  question.options.forEach((option, index) => {
    message += `${String.fromCharCode(65 + index)}. ${option}\n`;
  });
  
  message += `\nউত্তর দিতে A, B, C বা D লিখে পাঠান।`;
  return message;
}

// New function to format multiple questions in one message
export function formatMultipleQuizMessage(questions: QuizQuestion[]): string {
  if (questions.length === 0) return "কোন প্রশ্ন খুঁজে পাওয়া যায়নি।";
  
  let message = `🧠 বিজ্ঞানযজ্ঞ কুইজ সিরিজ 🧠\n\n`;
  
  questions.forEach((question, qIndex) => {
    message += `প্রশ্ন ${qIndex + 1}: ${question.question}\n\n`;
    
    // Add options
    question.options.forEach((option, index) => {
      message += `${String.fromCharCode(65 + index)}. ${option}\n`;
    });
    
    message += `\n`;
  });
  
  message += `\nউত্তর পাঠাতে প্রশ্ন নম্বর এবং অপশন লিখুন (যেমন: 1A, 2C)`;
  return message;
}