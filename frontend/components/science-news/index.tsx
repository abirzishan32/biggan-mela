import { useEffect, useState } from 'react';
import { ProcessedArticle } from '@/app/api/science-news/types';
import NewsFilter from './NewsFilter';
import NewsGallery from './NewsGallery';

export default function ScienceNews() {
  const [articles, setArticles] = useState<ProcessedArticle[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | undefined>();
  const [category, setCategory] = useState('science');
  const [searchTerm, setSearchTerm] = useState('');
  
  useEffect(() => {
    async function fetchNews() {
      setIsLoading(true);
      setError(undefined);
      
      try {
        const response = await fetch(`/api/science-news?category=${category}`);
        
        if (!response.ok) {
          throw new Error(`Failed to fetch news: ${response.status}`);
        }
        
        const data = await response.json();
        
        if (data.error) {
          throw new Error(data.error);
        }
        
        setArticles(data.articles || []);
      } catch (err) {
        console.error('Error fetching science news:', err);
        setError(err instanceof Error ? err.message : 'সংবাদ লোড করতে সমস্যা হয়েছে');
        setArticles([]);
      } finally {
        setIsLoading(false);
      }
    }
    
    fetchNews();
  }, [category]);
  
  // Filter articles by search term if present
  const filteredArticles = searchTerm 
    ? articles.filter(article => 
        article.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
        article.summary.toLowerCase().includes(searchTerm.toLowerCase()) ||
        article.bengaliSummary.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : articles;
  
  return (
    <div className="space-y-6">
      <NewsFilter 
        onFilterChange={setCategory} 
        onSearchChange={setSearchTerm} 
      />
      
      <NewsGallery 
        articles={filteredArticles} 
        isLoading={isLoading} 
        error={error} 
      />
    </div>
  );
}