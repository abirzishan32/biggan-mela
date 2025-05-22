"use client"

import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, RefreshCw, Share2 } from "lucide-react";
import { toast } from "sonner";
import MermaidDiagram from './MermaidDiagram';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { ScrollArea } from '@/components/ui/scroll-area';

type RoadmapSectionProps = {
  profile: any;
  onGoalUpdate: (lifeGoal: string) => Promise<void>;
}

export default function RoadmapSection({ profile, onGoalUpdate }: RoadmapSectionProps) {
  const [lifeGoal, setLifeGoal] = useState<string>(profile.lifeGoal || '');
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [mermaidCode, setMermaidCode] = useState<string>('');
  const [roadmapText, setRoadmapText] = useState<string>('');

  const generateRoadmap = async () => {
    if (!lifeGoal.trim()) {
      toast.error('Please enter your career goal');
      return;
    }

    setIsGenerating(true);
    setMermaidCode('');
    setRoadmapText('');

    try {
      const response = await fetch('/api/life-goal', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          lifeGoal,
          studentInfo: {
            name: profile.name,
            class: profile.studentClass,
            subjects: profile.subjects,
            interests: profile.interests
          }
        }),
      });

      const data = await response.json();

      if (data.error) {
        throw new Error(data.error);
      }

      setMermaidCode(data.mermaidDiagram);
      setRoadmapText(data.explanation);
      
      // Save the life goal to profile if it's new
      if (profile.lifeGoal !== lifeGoal) {
        await onGoalUpdate(lifeGoal);
      }

      toast.success('Roadmap generated successfully!');
    } catch (error) {
      console.error('Error generating roadmap:', error);
      toast.error('Failed to generate roadmap. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleShare = async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: `Career Roadmap for ${lifeGoal}`,
          text: `Check out my career roadmap for becoming a ${lifeGoal}`,
          // url: window.location.href,
        });
      } else {
        // Fallback for browsers that don't support navigator.share
        await navigator.clipboard.writeText(roadmapText);
        toast.success('Roadmap copied to clipboard');
      }
    } catch (error) {
      console.error('Error sharing roadmap:', error);
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold mb-4">Career Roadmap Generator</h2>
        <p className="text-muted-foreground mb-6">
          Enter your career goal, and we'll create a personalized roadmap to help you achieve it.
        </p>
        
        <div className="grid gap-4">
          <div className="grid grid-cols-1 gap-2">
            <Label htmlFor="life-goal">What do you want to be in the future?</Label>
            <div className="flex gap-2">
              <Input 
                id="life-goal" 
                placeholder="e.g., Doctor, Engineer, Scientist, Programmer" 
                value={lifeGoal}
                onChange={(e) => setLifeGoal(e.target.value)}
              />
              <Button 
                onClick={generateRoadmap} 
                disabled={isGenerating || !lifeGoal.trim()}
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>Generate</>
                )}
              </Button>
            </div>
          </div>
          
          {!profile.studentClass && (
            <Alert>
              <AlertTitle>Complete your profile first</AlertTitle>
              <AlertDescription>
                For a more personalized roadmap, please fill out your class level, favorite subjects, and interests in your profile.
              </AlertDescription>
            </Alert>
          )}
        </div>
      </div>

      {isGenerating && (
        <div className="flex flex-col items-center justify-center py-12">
          <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
          <p className="text-muted-foreground">Designing your personalized roadmap...</p>
        </div>
      )}

      {mermaidCode && !isGenerating && (
        <div className="space-y-6">
          <Separator />
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <Card>
              <CardHeader>
                <CardTitle>Your Career Roadmap</CardTitle>
                <CardDescription>
                  Visual guide to achieving your goal of becoming a {lifeGoal}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="border rounded-lg overflow-hidden p-4 bg-white dark:bg-slate-950">
                  <MermaidDiagram code={mermaidCode} />
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Roadmap Explanation</CardTitle>
                <CardDescription>
                  Detailed guidance for your journey
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[400px] rounded-md border p-4">
                  <div className="prose dark:prose-invert prose-sm max-w-none">
                    {roadmapText.split('\n').map((paragraph, i) => (
                      <p key={i}>{paragraph}</p>
                    ))}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          </div>

          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => generateRoadmap()}>
              <RefreshCw className="mr-2 h-4 w-4" />
              Regenerate
            </Button>
            <Button variant="secondary" onClick={handleShare}>
              <Share2 className="mr-2 h-4 w-4" />
              Share Roadmap
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}