export interface NewsApiResponse {
  status: string;
  totalResults: number;
  articles: Article[];
}

export interface Article {
  source: {
    id: string | null;
    name: string;
  };
  author: string | null;
  title: string;
  description: string;
  url: string;
  urlToImage: string | null;
  publishedAt: string;
  content: string;
}

export interface ProcessedArticle extends Article {
  summary: string;
  bengaliSummary: string;
  id: string; // Unique identifier
}

export interface NewsApiError {
  status: string;
  code: string;
  message: string;
}