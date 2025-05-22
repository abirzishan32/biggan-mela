"use client"

import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from '@/components/ui/scroll-area';
import { Loader2, RefreshCw, Share2, HelpCircle } from "lucide-react";
import { toast } from "sonner";
import MermaidDiagram from '@/components/career-guide/MermaidDiagram';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

// Define class levels as English/Bengali pairs
const classLevels = [
  { value: "Class 1", label: "ক্লাস ১" },
  { value: "Class 2", label: "ক্লাস ২" },
  { value: "Class 3", label: "ক্লাস ৩" },
  { value: "Class 4", label: "ক্লাস ৪" },
  { value: "Class 5", label: "ক্লাস ৫" },
  { value: "Class 6", label: "ক্লাস ৬" },
  { value: "Class 7", label: "ক্লাস ৭" },
  { value: "Class 8", label: "ক্লাস ৮" },
  { value: "Class 9", label: "ক্লাস ৯" },
  { value: "Class 10", label: "ক্লাস ১০" },
  { value: "SSC", label: "এস.এস.সি" },
  { value: "HSC First Year", label: "এইচ.এস.সি প্রথম বর্ষ" },
  { value: "HSC Second Year", label: "এইচ.এস.সি দ্বিতীয় বর্ষ" }
];

// Define divisions as English/Bengali pairs
const divisions = [
  { value: "Dhaka", label: "ঢাকা" },
  { value: "Chittagong", label: "চট্টগ্রাম" },
  { value: "Rajshahi", label: "রাজশাহী" },
  { value: "Khulna", label: "খুলনা" },
  { value: "Barisal", label: "বরিশাল" },
  { value: "Sylhet", label: "সিলেট" },
  { value: "Rangpur", label: "রংপুর" },
  { value: "Mymensingh", label: "ময়মনসিংহ" }
];

// Form schema with text inputs for subjects and interests
const formSchema = z.object({
  name: z.string().min(2, "নাম অবশ্যই ২ অক্ষরের বেশি হতে হবে"),
  studentClass: z.string({
    required_error: "অনুগ্রহ করে আপনার শ্রেণী নির্বাচন করুন",
  }),
  division: z.string({
    required_error: "অনুগ্রহ করে আপনার বিভাগ নির্বাচন করুন",
  }),
  subjects: z.string().min(3, "অন্তত একটি বিষয় উল্লেখ করুন"),
  interests: z.string().min(3, "অন্তত একটি শখ উল্লেখ করুন"),
  lifeGoal: z.string().min(3, "আপনার লক্ষ্য উল্লেখ করুন"),
});

type FormData = z.infer<typeof formSchema>;

export default function CareerGuidancePage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [mermaidCode, setMermaidCode] = useState<string>("");
  const [roadmapText, setRoadmapText] = useState<string>("");
  const [stepComplete, setStepComplete] = useState<boolean>(false);

  // Initialize form with default values
  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      studentClass: "",
      division: "",
      subjects: "",
      interests: "",
      lifeGoal: "",
    },
  });

  // Form submission handler
  const onSubmit = async (values: FormData) => {
    setIsSubmitting(true);
    setMermaidCode("");
    setRoadmapText("");

    try {
      // Convert comma-separated inputs to arrays
      const subjectsArray = values.subjects
        .split(',')
        .map(subject => subject.trim())
        .filter(subject => subject.length > 0);
      
      const interestsArray = values.interests
        .split(',')
        .map(interest => interest.trim())
        .filter(interest => interest.length > 0);

      // Find the English value of the selected class
      const selectedClass = classLevels.find(c => c.value === values.studentClass)?.value || values.studentClass;
      
      // Find the English value of the selected division
      const selectedDivision = divisions.find(d => d.value === values.division)?.value || values.division;

      // Call the API to generate roadmap
      const response = await fetch('/api/life-goal', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          lifeGoal: values.lifeGoal,
          studentInfo: {
            name: values.name,
            class: selectedClass, // Using English value
            division: selectedDivision, // Using English value
            subjects: subjectsArray,
            interests: interestsArray
          }
        }),
      });

      const data = await response.json();

      if (data.error) {
        throw new Error(data.error);
      }

      setMermaidCode(data.mermaidDiagram);
      setRoadmapText(data.explanation);
      setStepComplete(true);
      toast.success('রোডম্যাপ সফলভাবে তৈরি করা হয়েছে!');
    } catch (error) {
      console.error('Error generating roadmap:', error);
      toast.error('রোডম্যাপ তৈরি করতে ব্যর্থ হয়েছে। দয়া করে আবার চেষ্টা করুন।');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    form.reset();
    setMermaidCode("");
    setRoadmapText("");
    setStepComplete(false);
  };

  const handleShare = async () => {
    try {
      const shareText = `আমার কেরিয়ার রোডম্যাপ: ${form.getValues('lifeGoal')}\n\n${roadmapText.substring(0, 300)}...`;
      
      if (navigator.share) {
        await navigator.share({
          title: `${form.getValues('lifeGoal')} হওয়ার রোডম্যাপ`,
          text: shareText,
        });
      } else {
        // Fallback for browsers that don't support navigator.share
        await navigator.clipboard.writeText(shareText);
        toast.success('রোডম্যাপ ক্লিপবোর্ডে কপি করা হয়েছে');
      }
    } catch (error) {
      console.error('Error sharing roadmap:', error);
    }
  };

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-2">ক্যারিয়ার গাইডেন্স</h1>
      <p className="text-muted-foreground mb-8">
        আপনার তথ্য দিন এবং আমরা আপনার জন্য একটি পারসোনালাইজড ক্যারিয়ার রোডম্যাপ তৈরি করব
      </p>

      {!stepComplete ? (
        <Card>
          <CardHeader>
            <CardTitle>আপনার তথ্য দিন</CardTitle>
            <CardDescription>
              নিচের ফরমটি পূরণ করুন এবং আপনার লক্ষ্য সম্পর্কে আমাদের জানান
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>আপনার নাম</FormLabel>
                      <FormControl>
                        <Input placeholder="আপনার পূর্ণ নাম লিখুন" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="studentClass"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>শ্রেণী</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="আপনার শ্রেণী নির্বাচন করুন" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {classLevels.map((level) => (
                              <SelectItem key={level.value} value={level.value}>
                                {level.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="division"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>বিভাগ</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="আপনার বিভাগ নির্বাচন করুন" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {divisions.map((division) => (
                              <SelectItem key={division.value} value={division.value}>
                                {division.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="subjects"
                  render={({ field }) => (
                    <FormItem>
                      <div className="flex items-center gap-2">
                        <FormLabel>পছন্দের বিষয়গুলি</FormLabel>
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <HelpCircle className="h-4 w-4 text-muted-foreground" />
                            </TooltipTrigger>
                            <TooltipContent>
                              দয়া করে ইংরেজিতে লিখুন
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </div>
                      <FormControl>
                        <Input 
                          placeholder="ইংরেজিতে, কমা দিয়ে আলাদা করে লিখুন (Mathematics, Science, English)" 
                          {...field} 
                        />
                      </FormControl>
                      <FormDescription>
                        আপনার পছন্দের বিষয়গুলি <strong>ইংরেজিতে</strong> কমা দিয়ে আলাদা করে লিখুন
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="interests"
                  render={({ field }) => (
                    <FormItem>
                      <div className="flex items-center gap-2">
                        <FormLabel>শখ এবং আগ্রহ</FormLabel>
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <HelpCircle className="h-4 w-4 text-muted-foreground" />
                            </TooltipTrigger>
                            <TooltipContent>
                              দয়া করে ইংরেজিতে লিখুন
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </div>
                      <FormControl>
                        <Input 
                          placeholder="ইংরেজিতে, কমা দিয়ে আলাদা করে লিখুন (Reading, Sports, Music)" 
                          {...field} 
                        />
                      </FormControl>
                      <FormDescription>
                        আপনার শখ এবং আগ্রহের বিষয়গুলি <strong>ইংরেজিতে</strong> কমা দিয়ে আলাদা করে লিখুন
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="lifeGoal"
                  render={({ field }) => (
                    <FormItem>
                      <div className="flex items-center gap-2">
                        <FormLabel>আপনি ভবিষ্যতে কী হতে চান?</FormLabel>
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <HelpCircle className="h-4 w-4 text-muted-foreground" />
                            </TooltipTrigger>
                            <TooltipContent>
                              দয়া করে ইংরেজিতে লিখুন
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </div>
                      <FormControl>
                        <Input 
                          placeholder="ইংরেজিতে লিখুন (Doctor, Engineer, Teacher, Programmer)" 
                          {...field} 
                        />
                      </FormControl>
                      <FormDescription>
                        আপনার কেরিয়ার লক্ষ্য বা পেশার নাম <strong>ইংরেজিতে</strong> লিখুন
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button type="submit" disabled={isSubmitting} className="w-full">
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      রোডম্যাপ তৈরি হচ্ছে...
                    </>
                  ) : (
                    "রোডম্যাপ তৈরি করুন"
                  )}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold">
              {form.getValues('name')} এর জন্য ক্যারিয়ার রোডম্যাপ
            </h2>
            <div className="flex gap-2">
              <Button variant="outline" onClick={handleReset}>
                নতুন রোডম্যাপ
              </Button>
              <Button variant="default" onClick={handleShare}>
                <Share2 className="mr-2 h-4 w-4" />
                শেয়ার করুন
              </Button>
            </div>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>আপনার ক্যারিয়ার রোডম্যাপ</CardTitle>
                <CardDescription>
                  {form.getValues('lifeGoal')} হওয়ার জন্য একটি পথনির্দেশিকা
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="border rounded-lg overflow-hidden p-4 bg-white dark:bg-gray-900">
                  <MermaidDiagram code={mermaidCode} />
                </div>
              </CardContent>
            </Card>
            
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>বিস্তারিত পথনির্দেশনা</CardTitle>
                <CardDescription>
                  আপনার লক্ষ্য অর্জনের জন্য পরামর্শ
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

          <div className="flex justify-between items-center">
            <div>
              <h3 className="font-semibold text-lg">পরামর্শ:</h3>
              <p className="text-muted-foreground">
                এই রোডম্যাপটি একটি সাধারণ গাইডলাইন। আপনার জন্য সঠিক পথ নির্ধারণ করতে একজন শিক্ষক বা কেরিয়ার কাউন্সেলরের সাথে পরামর্শ করুন।
              </p>
            </div>
            
            <Button 
              variant="outline" 
              onClick={() => {
                form.setValue("lifeGoal", form.getValues("lifeGoal"));
                onSubmit(form.getValues());
              }}
            >
              <RefreshCw className="mr-2 h-4 w-4" />
              রোডম্যাপ রিফ্রেশ করুন
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}