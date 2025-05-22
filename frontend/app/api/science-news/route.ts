import { NextRequest, NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';
import { summarizeAndTranslate } from './agent';
import { NewsApiResponse, ProcessedArticle, Article } from './types';

export async function GET(request: NextRequest) {
  try {
    // Get query parameters
    const searchParams = request.nextUrl.searchParams;
    const category = searchParams.get('category') || 'science';
    const pageSize = searchParams.get('pageSize') || '10';
    const page = searchParams.get('page') || '1';
    
    // Fetch news from NewsAPI
    const apiKey = process.env.NEWS_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: 'News API key is not configured' },
        { status: 500 }
      );
    }
    
    const newsApiUrl = `https://newsapi.org/v2/top-headlines?category=${category}&pageSize=${pageSize}&page=${page}&language=en&apiKey=${apiKey}`;
    
    const response = await fetch(newsApiUrl);
    const data: NewsApiResponse = await response.json();
    
    // Check for errors from NewsAPI
    if (data.status !== 'ok') {
      return NextResponse.json(
        { error: data.status || 'Failed to fetch news' },
        { status: 400 }
      );
    }
    
    // Process only a subset of articles for development to avoid hitting rate limits
    const articlesToProcess = data.articles.slice(0, 5);
    
    // Process each article in parallel
    const processedArticlesPromises = articlesToProcess.map(async (article: Article) => {
      try {
        // Generate summaries for each article
        const { summary, bengaliSummary } = await summarizeAndTranslate(article);
        
        // Return processed article with summaries
        return {
          ...article,
          summary,
          bengaliSummary,
          id: uuidv4() // Add a unique ID
        } as ProcessedArticle;
      } catch (error) {
        console.error(`Failed to process article: ${article.title}`, error);
        // Return article with error summaries
        return {
          ...article,
          summary: "Unable to generate summary.",
          bengaliSummary: "সারাংশ তৈরি করতে ব্যর্থ হয়েছে।",
          id: uuidv4()
        } as ProcessedArticle;
      }
    });
    
    // Wait for all articles to be processed
    const processedArticles = await Promise.all(processedArticlesPromises);
    
    return NextResponse.json({
      status: 'ok',
      totalResults: data.totalResults,
      articles: processedArticles
    });
  } catch (error) {
    console.error('Science news API error:', error);
    return NextResponse.json(
      { error: 'Failed to process science news' },
      { status: 500 }
    );
  }
}