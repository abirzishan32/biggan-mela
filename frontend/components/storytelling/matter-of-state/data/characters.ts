export interface Character {
  id: "boy" | "girl";
  name: string;
  description: string;
  imageUrl: string;
  dialogueStyle: "curious" | "enthusiastic" | "thoughtful";
}

export const characters: Character[] = [
  {
    id: "boy",
    name: "রাজু",
    description: "আমি বিজ্ঞান ভালোবাসি এবং নতুন জিনিস শিখতে খুব আগ্রহী।",
    imageUrl: "/images/storytelling/matter-of-state/character-boy.gif",
    dialogueStyle: "enthusiastic"
  },
  {
    id: "girl",
    name: "মিতা",
    description: "আমি জানতে চাই কিভাবে সব কিছু কাজ করে এবং চারপাশের জগত সম্পর্কে জানতে ভালোবাসি।",
    imageUrl: "/images/storytelling/matter-of-state/character-girl.gif",
    dialogueStyle: "curious"
  }
];

export function getCharacterDialogue(
  characterId: "boy" | "girl", 
  context: string
): string {
  const dialogues: Record<string, Record<"boy" | "girl", string>> = {
    "solid": {
      "boy": "রাজু: এই কঠিন পদার্থের বিষয়টা খুবই মজার!",
      "girl": "মিতা: আমি বুঝতে পারছি কেন কঠিন পদার্থের নির্দিষ্ট আকার থাকে!"
    },
    "liquid": {
      "boy": "রাজু: তরল পদার্থ যে কোন পাত্রের আকার নিতে পারে!",
      "girl": "মিতা: তরল পদার্থের মলিকিউলগুলো কীভাবে চলাচল করে তা দেখে আমি অবাক!"
    },
    "gas": {
      "boy": "রাজু: গ্যাস দেখা যায় না, কিন্তু এটি আমাদের চারপাশে আছে!",
      "girl": "মিতা: গ্যাসের মলিকিউলগুলো কত দ্রুত ছড়িয়ে পড়ে!"
    },
    "transformation": {
      "boy": "রাজু: পদার্থের এক অবস্থা থেকে অন্য অবস্থায় রূপান্তর খুবই অবাক করা!",
      "girl": "মিতা: তাপমাত্রার পরিবর্তনে পদার্থের অবস্থাও পরিবর্তন হয়!"
    },
    "default": {
      "boy": "রাজু: এই বিষয়টা আমি বন্ধুদের বলব!",
      "girl": "মিতা: এই বিষয়টা জানতে পেরে আমি খুবই খুশি!"
    }
  };
  
  return dialogues[context]?.[characterId] || dialogues["default"][characterId];
}