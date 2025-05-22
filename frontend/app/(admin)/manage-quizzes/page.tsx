"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { Loader2, Search, PlusCircle, Filter, Clock } from "lucide-react";
import { createClient } from "@/utils/supabase/client";
import { format } from "date-fns";
import { toast } from "sonner";
import Link from "next/link";

interface Quiz {
  id: string;
  title: string;
  subject: string;
  topic: string;
  difficulty: string;
  language: string;
  durationMinutes: number;
  createdAt: string;
  questionCount: number;
  attemptCount: number;
}

export default function ManageQuizesPage() {
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [filteredQuizzes, setFilteredQuizzes] = useState<Quiz[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [subjectFilter, setSubjectFilter] = useState<string | null>(null);
  const [difficultyFilter, setDifficultyFilter] = useState<string | null>(null);
  const supabase = createClient();

  useEffect(() => {
    async function fetchQuizzes() {
      setIsLoading(true);
      try {
        const { data: quizData, error } = await supabase
          .from("Quiz")
          .select("*");

        if (error) {
          throw error;
        }

        // Fetch question count and attempt count for each quiz
        const enrichedQuizzes = await Promise.all(
          quizData.map(async (quiz) => {
            const { count: questionCount, error: questionError } = await supabase
              .from("Question")
              .select("*", { count: "exact", head: true })
              .eq("quizId", quiz.id);

            const { count: attemptCount, error: attemptError } = await supabase
              .from("QuizAttempt")
              .select("*", { count: "exact", head: true })
              .eq("quizId", quiz.id);

            return {
              ...quiz,
              questionCount: questionCount || 0,
              attemptCount: attemptCount || 0,
            };
          })
        );

        setQuizzes(enrichedQuizzes);
        setFilteredQuizzes(enrichedQuizzes);
      } catch (error) {
        console.error("Error fetching quizzes:", error);
        toast.error("Failed to fetch quizzes");
      } finally {
        setIsLoading(false);
      }
    }

    fetchQuizzes();
  }, [supabase]);

useEffect(() => {
  // Filter quizzes based on search query and filters
  let result = quizzes;

  if (searchQuery) {
    const query = searchQuery.toLowerCase();
    result = result.filter(
      (quiz) =>
        quiz.title.toLowerCase().includes(query) ||
        quiz.topic.toLowerCase().includes(query)
    );
  }

  if (subjectFilter && subjectFilter !== "all") {
    result = result.filter((quiz) => quiz.subject === subjectFilter);
  }

  if (difficultyFilter && difficultyFilter !== "all") {
    result = result.filter((quiz) => quiz.difficulty === difficultyFilter);
  }

  setFilteredQuizzes(result);
}, [searchQuery, subjectFilter, difficultyFilter, quizzes]);

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty.toLowerCase()) {
      case "easy":
        return "bg-green-500";
      case "medium":
        return "bg-amber-500";
      case "hard":
        return "bg-red-500";
      default:
        return "bg-slate-500";
    }
  };

  const getSubjectBadgeVariant = (subject: string) => {
    switch (subject.toLowerCase()) {
      case "physics":
        return "default";
      case "chemistry":
        return "secondary";
      case "biology":
        return "destructive";
      default:
        return "outline";
    }
  };

  return (
    <div className="container mx-auto py-8 space-y-6">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Manage Quizzes</h1>
          <p className="text-muted-foreground mt-1">
            View, edit and create quizzes for students
          </p>
        </div>

        <Button asChild className="flex items-center gap-2">
          <Link href="/create-quiz">
            <PlusCircle size={16} />
            Create Quiz
          </Link>
        </Button>
      </div>

      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={18} />
          <Input 
            placeholder="Search by title or topic..." 
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <Select
          value={subjectFilter || "all"}
          onValueChange={(value) => setSubjectFilter(value || null)}
        >
          <SelectTrigger className="w-[180px]">
            <div className="flex items-center gap-2">
              <Filter size={16} />
              <span>{subjectFilter && subjectFilter !== "all" ? subjectFilter : "Filter by Subject"}</span>
            </div>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Subjects</SelectItem>
            <SelectItem value="physics">Physics</SelectItem>
            <SelectItem value="chemistry">Chemistry</SelectItem>
            <SelectItem value="biology">Biology</SelectItem>
          </SelectContent>
        </Select>

        <Select
          value={difficultyFilter || "all"}
          onValueChange={(value) => setDifficultyFilter(value || null)}
        >
          <SelectTrigger className="w-[180px]">
            <div className="flex items-center gap-2">
              <Filter size={16} />
              <span>{difficultyFilter && difficultyFilter !== "all" ? difficultyFilter : "Filter by Difficulty"}</span>
            </div>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Difficulties</SelectItem>
            <SelectItem value="easy">Easy</SelectItem>
            <SelectItem value="medium">Medium</SelectItem>
            <SelectItem value="hard">Hard</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="border rounded-lg overflow-hidden">
        <Table>
          <TableCaption>
            {isLoading 
              ? "Loading quiz data..." 
              : `Showing ${filteredQuizzes.length} of ${quizzes.length} total quizzes`}
          </TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[250px]">Title</TableHead>
              <TableHead>Subject</TableHead>
              <TableHead>Topic</TableHead>
              <TableHead>Difficulty</TableHead>
              <TableHead>Language</TableHead>
              <TableHead className="text-center">Questions</TableHead>
              <TableHead className="text-center">Duration</TableHead>
              <TableHead className="text-center">Attempts</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={9} className="text-center py-10">
                  <div className="flex justify-center items-center gap-2">
                    <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
                    <span className="text-muted-foreground">Loading quizzes...</span>
                  </div>
                </TableCell>
              </TableRow>
            ) : filteredQuizzes.length === 0 ? (
              <TableRow>
                <TableCell colSpan={9} className="text-center py-10">
                  <p className="text-muted-foreground">No quizzes found</p>
                  {(searchQuery || subjectFilter || difficultyFilter) && (
                    <p className="text-sm text-muted-foreground mt-1">
                      Try adjusting your search or filter criteria
                    </p>
                  )}
                </TableCell>
              </TableRow>
            ) : (
              filteredQuizzes.map((quiz) => (
                <TableRow key={quiz.id}>
                  <TableCell className="font-medium">
                    {quiz.title}
                  </TableCell>
                  <TableCell>
                    <Badge variant={getSubjectBadgeVariant(quiz.subject)}>
                      {quiz.subject}
                    </Badge>
                  </TableCell>
                  <TableCell>{quiz.topic}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <div 
                        className={`h-2.5 w-2.5 rounded-full ${getDifficultyColor(quiz.difficulty)}`} 
                      />
                      {quiz.difficulty}
                    </div>
                  </TableCell>
                  <TableCell>
                    {quiz.language === "english" ? "English" : "বাংলা"}
                  </TableCell>
                  <TableCell className="text-center">
                    <div className="flex flex-col items-center">
                      <span>{quiz.questionCount}</span>
                      <Progress 
                        value={Math.min(quiz.questionCount * 10, 100)} 
                        className="h-1.5 w-16" 
                      />
                    </div>
                  </TableCell>
                  <TableCell className="text-center">
                    <div className="flex items-center justify-center gap-1">
                      <Clock size={14} />
                      <span>{quiz.durationMinutes} min</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-center">
                    {quiz.attemptCount}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="sm" asChild>
                      <Link href={`/quiz-details/${quiz.id}`}>View</Link>
                    </Button>
                    <Button variant="ghost" size="sm" asChild>
                      <Link href={`/edit-quiz/${quiz.id}`}>Edit</Link>
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}