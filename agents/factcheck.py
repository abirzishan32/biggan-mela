from langchain_google_genai import ChatGoogleGenerativeAI
from langchain.embeddings import SentenceTransformerEmbeddings
from tavily import TavilyClient
import time

class FactCheckChain:
    def __init__(self, tavily_api_key, google_api_key):
        self.tavily_client = TavilyClient(api_key=tavily_api_key)
        self.model = ChatGoogleGenerativeAI(model="gemini-2.0-flash", google_api_key=google_api_key)
        self.embeddings = SentenceTransformerEmbeddings(model_name="all-MiniLM-L6-v2")
    
    async def verify_fact(self, socketio, query, socket_id=None):
        try:
            print(f"Starting fact check for query: {query}")
            print(f"Socket ID: {socket_id}")
            
            # Emit search start
            if socket_id:
                socketio.emit('fact_check_update', {
                    'type': 'search_start',
                    'message': 'Starting search for relevant sources...',
                    'status': 'searching'
                }, room=socket_id)
                print("Emitted search_start event")
            
            # Search for sources
            print("Searching with Tavily...")
            search_results = self.tavily_client.search(
                query=query,
                search_depth="advanced",
                max_results=5
            )
            print(f"Search results: {len(search_results.get('results', []))} sources found")
            
            # Process sources for better formatting
            sources = []
            for result in search_results.get('results', []):
                sources.append({
                    'title': result.get('title', 'Unknown Source'),
                    'url': result.get('url', ''),
                    'content': result.get('content', ''),
                    'score': result.get('score', 0.5),
                    'raw_content': result.get('raw_content', None)
                })
            
            # Emit search completion
            if socket_id:
                socketio.emit('fact_check_update', {
                    'type': 'search_complete',
                    'message': f'Found {len(sources)} relevant sources',
                    'status': 'analyzing',
                    'sources': sources
                }, room=socket_id)
                print("Emitted search_complete event")
            
            # Small delay for better UX
            time.sleep(0.5)
            
            # Analyze results
            if socket_id:
                socketio.emit('fact_check_update', {
                    'type': 'analysis_start',
                    'message': 'Analyzing sources and generating fact-check report...',
                    'status': 'generating'
                }, room=socket_id)
                print("Emitted analysis_start event")
            
            # Create context for the AI model
            context = f"""
            Query to fact-check: {query}
            
            Sources found:
            """
            
            for i, source in enumerate(sources, 1):
                context += f"""
            Source {i}:
            Title: {source['title']}
            URL: {source['url']}
            Content: {source['content'][:500]}...
            Relevance Score: {source['score']:.2f}
            
            """
            
            prompt = f"""
            As a fact-checking expert, analyze the following query and sources to provide a comprehensive fact-check report.
            
            {context}
            
            Please provide:
            1. A clear summary of what the query is asking
            2. Detailed analysis based on the sources
            3. Fact-checking verdict with evidence
            4. Any important caveats or limitations
            
            Format your response in clear, readable markdown with proper headings and structure.
            """
            
            # Generate final response
            print("Generating AI response...")
            response = await self.model.ainvoke(prompt)
            print("AI response generated")
            
            # Emit completion
            if socket_id:
                socketio.emit('fact_check_update', {
                    'type': 'analysis_complete',
                    'message': 'Fact-check analysis complete',
                    'status': 'complete'
                }, room=socket_id)
                print("Emitted analysis_complete event")
            
            result = {
                'verified': True,
                'analysis': response.content,
                'sources': sources,
                'query': query,
                'timestamp': time.time()
            }
            
            print("Fact check completed successfully")
            return result
            
        except Exception as e:
            print(f"Error during fact-checking: {e}")
            
            # Emit error
            if socket_id:
                socketio.emit('fact_check_update', {
                    'type': 'error',
                    'message': f'Error during fact-checking: {str(e)}',
                    'status': 'error'
                }, room=socket_id)
            
            raise e