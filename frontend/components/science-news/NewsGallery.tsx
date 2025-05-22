import { ProcessedArticle } from "@/app/api/science-news/types";
import NewsCard from "./NewsCard";
import NewsLoading from "./NewsLoading";

interface NewsGalleryProps {
  articles: ProcessedArticle[];
  isLoading: boolean;
  error?: string;
}

export default function NewsGallery({ articles, isLoading, error }: NewsGalleryProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, i) => (
          <NewsLoading key={i} />
        ))}
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="text-center py-12 border border-red-800/30 bg-red-900/10 rounded-lg">
        <p className="text-red-400">
          {error}
        </p>
      </div>
    );
  }
  
  if (articles.length === 0) {
    return (
      <div className="text-center py-12 border border-gray-800 bg-gray-900/50 rounded-lg">
        <p className="text-gray-400">
          কোন সংবাদ পাওয়া যায়নি। অনুগ্রহ করে আপনার ফিল্টার পরিবর্তন করুন।
        </p>
      </div>
    );
  }
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {articles.map((article) => (
        <NewsCard key={article.id} article={article} />
      ))}
    </div>
  );
}