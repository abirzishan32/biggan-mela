import MatterStory from "@/components/storytelling/matter-of-state/MatterStory";
import { StoryProvider } from "@/components/storytelling/matter-of-state/StoryProvider";

export const metadata = {
  title: "পদার্থের অবস্থা | বাংলা শিক্ষামূলক গল্প",
  description: "বাংলা গল্পের মাধ্যমে কঠিন, তরল এবং গ্যাসীয় পদার্থের অবস্থা সম্পর্কে শিখুন",
};

export default function MatterOfStatePage() {
  return (
    <StoryProvider>
      <main className="min-h-screen bg-gradient-to-b from-sky-100 to-indigo-100 dark:from-sky-950 dark:to-indigo-950">
        <MatterStory />
      </main>
    </StoryProvider>
  );
}