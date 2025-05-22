"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Loader2 } from "lucide-react"
import { MultiSelect } from '@/components/career-guide/MultiSelect'

// Define class levels in Bangladesh
const classLevels = [
  "Class 1", "Class 2", "Class 3", "Class 4", "Class 5",
  "Class 6", "Class 7", "Class 8", "Class 9", "Class 10",
  "SSC", "HSC First Year", "HSC Second Year"
];

// Define divisions in Bangladesh
const divisions = [
  "Dhaka", "Chittagong", "Rajshahi", "Khulna", 
  "Barisal", "Sylhet", "Rangpur", "Mymensingh"
];

// Define common subjects
const subjectOptions = [
  { value: "bangla", label: "Bangla" },
  { value: "english", label: "English" },
  { value: "mathematics", label: "Mathematics" },
  { value: "science", label: "Science" },
  { value: "social_science", label: "Social Science" },
  { value: "physics", label: "Physics" },
  { value: "chemistry", label: "Chemistry" },
  { value: "biology", label: "Biology" },
  { value: "ict", label: "ICT" },
  { value: "economics", label: "Economics" },
  { value: "accounting", label: "Accounting" },
  { value: "business_studies", label: "Business Studies" },
  { value: "history", label: "History" },
  { value: "geography", label: "Geography" },
  { value: "islamic_studies", label: "Islamic Studies" },
];

// Define common interests
const interestOptions = [
  { value: "reading", label: "Reading" },
  { value: "sports", label: "Sports" },
  { value: "music", label: "Music" },
  { value: "art", label: "Art & Crafts" },
  { value: "coding", label: "Coding" },
  { value: "robotics", label: "Robotics" },
  { value: "debate", label: "Debate" },
  { value: "science_experiments", label: "Science Experiments" },
  { value: "writing", label: "Writing" },
  { value: "gaming", label: "Gaming" },
  { value: "gardening", label: "Gardening" },
  { value: "cooking", label: "Cooking" },
  { value: "photography", label: "Photography" },
  { value: "math_puzzles", label: "Math Puzzles" },
  { value: "chess", label: "Chess" },
];

// Define form schema
const formSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  bio: z.string().max(500).optional().nullable(),
  institution: z.string().min(2, "Institution name is required").max(100),
  studentClass: z.string({
    required_error: "Please select your class",
  }),
  division: z.string({
    required_error: "Please select your division",
  }),
  subjects: z.array(z.string()).optional().nullable(),
  interests: z.array(z.string()).optional().nullable(),
});

type ProfileFormProps = {
  profile: any;
  onUpdate: (data: any) => Promise<void>;
  isUpdating: boolean;
}

export default function ProfileForm({ profile, onUpdate, isUpdating }: ProfileFormProps) {
  // Initialize form with default values
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: profile.name || "",
      bio: profile.bio || "",
      institution: profile.institution || "",
      studentClass: profile.studentClass || "",
      division: profile.division || "",
      subjects: profile.subjects || [],
      interests: profile.interests || [],
    },
  });

  // Form submission handler
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    await onUpdate(values);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Name */}
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Full Name</FormLabel>
                <FormControl>
                  <Input placeholder="Your name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Institution */}
          <FormField
            control={form.control}
            name="institution"
            render={({ field }) => (
              <FormItem>
                <FormLabel>School/College</FormLabel>
                <FormControl>
                  <Input placeholder="Your educational institution" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Class Level */}
          <FormField
            control={form.control}
            name="studentClass"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Class</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select your class" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {classLevels.map((level) => (
                      <SelectItem key={level} value={level}>
                        {level}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Division */}
          <FormField
            control={form.control}
            name="division"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Division</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select your division" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {divisions.map((division) => (
                      <SelectItem key={division} value={division}>
                        {division}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Favorite Subjects */}
        <FormField
          control={form.control}
          name="subjects"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Favorite Subjects</FormLabel>
              <FormControl>
                <MultiSelect
                  options={subjectOptions}
                  selected={field.value || []}
                  onChange={field.onChange}
                  placeholder="Select your favorite subjects"
                />
              </FormControl>
              <FormDescription>
                Select subjects you enjoy and excel at
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Interests/Hobbies */}
        <FormField
          control={form.control}
          name="interests"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Interests & Hobbies</FormLabel>
              <FormControl>
                <MultiSelect
                  options={interestOptions}
                  selected={field.value || []}
                  onChange={field.onChange}
                  placeholder="Select your interests and hobbies"
                />
              </FormControl>
              <FormDescription>
                Choose activities you enjoy in your free time
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Bio */}
        <FormField
          control={form.control}
          name="bio"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Bio</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="Tell us a little about yourself..." 
                  className="resize-none h-24"
                  {...field}
                  value={field.value || ''}
                />
              </FormControl>
              <FormDescription>
                Share something about yourself, your achievements, or aspirations
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" disabled={isUpdating}>
          {isUpdating && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {isUpdating ? "Updating..." : "Save Changes"}
        </Button>
      </form>
    </Form>
  );
}