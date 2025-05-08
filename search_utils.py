import os
import praw
import requests
from bs4 import BeautifulSoup
from sentence_transformers import SentenceTransformer
from dotenv import load_dotenv
import re
from datetime import datetime, timedelta
import numpy as np  # Add this line
from newspaper import Article
import time
load_dotenv()

# Initialize models once
model = SentenceTransformer('all-mpnet-base-v2')

# Reddit API setup
reddit = praw.Reddit(
    client_id=os.getenv('REDDIT_CLIENT_ID'),
    client_secret=os.getenv('REDDIT_CLIENT_SECRET'),
    user_agent="searchAI/1.0"
)

# Load blocked domains
with open('blocked_domains.txt') as f:
    BLOCKED_DOMAINS = [line.strip() for line in f]

def process_query(query):
    """Extract keywords and semantic concepts"""
    # Simple keyword extraction
    keywords = re.findall(r'\b\w{4,}\b', query.lower())
    
    # Semantic embedding
    embedding = model.encode(query)
    
    return {
        'keywords': keywords,
        'embedding': embedding
    }

# Add these new imports at the top

def search_reddit(query_obj, limit=25, comment_limit=3):
    """Search Reddit posts AND comments"""
    results = []
    subreddit = reddit.subreddit('all')
    
    # Search posts
    for submission in subreddit.search(
        query_obj['keywords'], 
        limit=limit,
        sort='relevance',
        time_filter='month'
    ):
        if submission.domain not in BLOCKED_DOMAINS:
            # Add post itself
            results.append({
                'source': 'Reddit Post',
                'title': submission.title,
                'content': submission.selftext,
                'url': f"https://reddit.com{submission.permalink}",
                'score': submission.score,
                'created': datetime.fromtimestamp(submission.created_utc),
                'type': 'post'
            })
            
            # Add top comments
            try:
                submission.comments.replace_more(limit=0)
                for comment in submission.comments[:comment_limit]:
                    results.append({
                        'source': 'Reddit Comment',
                        'title': f"Re: {submission.title}",
                        'content': comment.body,
                        'url': f"https://reddit.com{comment.permalink}",
                        'score': comment.score,
                        'created': datetime.fromtimestamp(comment.created_utc),
                        'type': 'comment'
                    })
                    time.sleep(0.5)  # Rate limiting
            except Exception as e:
                print(f"Error fetching comments: {e}")
    
    return results

def search_web(query_obj, limit=15):
    """Improved web crawler with newspaper3k"""
    results = []
    search_url = f"https://www.google.com/search?q={'+'.join(query_obj['keywords'])}&num={limit}"
    
    try:
        response = requests.get(
            search_url, 
            headers={'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'},
            timeout=10
        )
        soup = BeautifulSoup(response.text, 'html.parser')
        
        for g in soup.find_all('div', class_='g')[:limit]:
            link = g.find('a', href=True)
            if not link: continue
            
            url = link['href']
            if any(d in url for d in BLOCKED_DOMAINS):
                continue
                
            try:
                # Use newspaper3k for better article extraction
                article = Article(url)
                article.download()
                article.parse()
                
                results.append({
                    'source': 'Web',
                    'title': article.title[:100],
                    'content': article.text[:500],
                    'url': url,
                    'score': 0,
                    'created': datetime.now(),
                    'type': 'article'
                })
                time.sleep(1)  # Be polite
                
            except Exception as e:
                print(f"Error parsing {url}: {e}")
                
    except Exception as e:
        print(f"Search failed: {e}")
    
    return results

def calculate_relevance(query_embedding, content):
    content_embedding = model.encode(content)
    similarity = np.dot(query_embedding, content_embedding.T)
    return similarity.item()

def rank_results(results, query_embedding):
    for item in results:
        # Base text for similarity
        text = f"{item['title']} {item['content']}"
        
        # Type-based weighting
        type_weight = 1.0
        if item.get('type') == 'comment':
            type_weight = 0.9  # Slightly lower weight for comments
        elif item.get('type') == 'article':
            type_weight = 1.1  # Higher weight for full articles
            
        item['relevance'] = (
            0.6 * calculate_relevance(query_embedding, text) * type_weight +
            0.2 * (item['score'] / max(100, item['score'])) +  # Normalized popularity
            0.2 * (1 - min((datetime.now() - item['created']).days/30, 1)))  # Age factor
    
    return sorted(results, key=lambda x: x['relevance'], reverse=True)