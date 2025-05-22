import { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ProcessedArticle } from "@/app/api/science-news/types";
import { Calendar, ExternalLink, Newspaper } from "lucide-react";

interface NewsCardProps {
  article: ProcessedArticle;
}

export default function NewsCard({ article }: NewsCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  
  // Format the publication date
  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    };
    return new Date(dateString).toLocaleDateString('bn-BD', options);
  };
  
  return (
    <Card className="overflow-hidden transition-all duration-300 bg-gradient-to-br from-gray-900 to-gray-950 border-gray-800 hover:border-purple-800/30">
      <CardHeader className="p-4">
        {/* Text-only header with category icon instead of image */}
        <div className="flex items-center gap-3 mb-3">
          <div className="p-2 rounded-md bg-purple-900/30 text-purple-300">
            <Newspaper size={18} />
          </div>
          <span className="text-xs text-purple-300/70 uppercase tracking-wider">
            {article.source.name}
          </span>
        </div>
        
        <CardTitle className="text-lg text-white">{article.title}</CardTitle>
        <CardDescription className="flex items-center gap-2 text-gray-400 mt-2">
          <Calendar size={14} />
          <span>{formatDate(article.publishedAt)}</span>
        </CardDescription>
      </CardHeader>
      
      <CardContent className="p-4 pt-0">
        <Tabs defaultValue="bengali" className="w-full">
          <TabsList className="grid w-full grid-cols-2 bg-gray-800">
            <TabsTrigger value="bengali" className="text-sm">বাংলা সারাংশ</TabsTrigger>
            <TabsTrigger value="english" className="text-sm">English Summary</TabsTrigger>
          </TabsList>
          
          <TabsContent value="bengali" className="mt-3">
            <p className={`text-gray-300 ${!isExpanded && 'line-clamp-3'}`}>
              {article.bengaliSummary}
            </p>
          </TabsContent>
          
          <TabsContent value="english" className="mt-3">
            <p className={`text-gray-300 ${!isExpanded && 'line-clamp-3'}`}>
              {article.summary}
            </p>
          </TabsContent>
        </Tabs>
        
        {(article.bengaliSummary?.length > 150 || article.summary?.length > 150) && (
          <Button 
            variant="link" 
            onClick={() => setIsExpanded(!isExpanded)} 
            className="p-0 h-auto mt-2 text-purple-400"
          >
            {isExpanded ? 'সংক্ষিপ্ত করুন' : 'আরও পড়ুন...'}
          </Button>
        )}
      </CardContent>
      
      <CardFooter className="p-4 pt-0 flex justify-end">
        <Button 
          variant="outline" 
          size="sm" 
          className="gap-2 border-gray-700 text-gray-300 hover:text-white hover:bg-gray-800"
          onClick={() => window.open(article.url, '_blank')}
        >
          আসল নিবন্ধ পড়ুন
          <ExternalLink size={14} />
        </Button>
      </CardFooter>
    </Card>
  );
}