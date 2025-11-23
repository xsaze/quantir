---
name: reddit-analytics
description: Reddit data analysis, sentiment tracking, subreddit insights, and engagement metrics using PRAW API. Use when analyzing Reddit posts/comments, tracking sentiment trends, measuring community engagement, or building Reddit analytics dashboards. Triggers on Reddit API, PRAW, subreddit analysis, sentiment tracking, and engagement metrics keywords.
---

# Reddit Analytics

MUST analyze Reddit data with sentiment tracking, subreddit insights, engagement metrics.

## When to Use

Triggers on:
- Reddit API data collection | PRAW integration
- Sentiment analysis on posts/comments | VADER/BERT
- Subreddit engagement metrics | community insights
- Reddit analytics dashboard | visualization
- Social media monitoring | trend analysis

## Core Capabilities

### 1. Data Collection with PRAW

MUST use PRAW 7.7.1+ for Reddit API access.

**Authentication Setup:**
```python
import praw

reddit = praw.Reddit(
    client_id="YOUR_CLIENT_ID",
    client_secret="YOUR_CLIENT_SECRET",
    user_agent="platform:app_id:v1.0 (by u/username)"
)
```

**Get credentials:** https://www.reddit.com/prefs/apps → Create App → Script type

**Collect Submissions:**
- `subreddit.hot(limit=N)` - trending posts
- `subreddit.new(limit=N)` - recent posts
- `subreddit.top(time_filter='week', limit=N)` - top posts
- Time filters: hour, day, week, month, year, all

**Collect Comments:**
```python
submission.comments.replace_more(limit=0)  # MUST expand collapsed threads
for comment in submission.comments.list():  # Flattened tree
    process(comment.body, comment.score)
```

**CRITICAL:** ALWAYS use `replace_more()` for complete comment data.

**Rate Limits:** MAXIMUM 60 requests/min OR 600 requests/10min (free tier).

**Error Handling:**
```python
from prawcore.exceptions import TooManyRequests
import time

try:
    data = subreddit.hot(limit=100)
except TooManyRequests as e:
    time.sleep(e.retry_after)  # Exponential backoff
```

**Reference:** `references/praw_quickstart.md` for complete PRAW guide.

**Script:** `scripts/collect_data.py` for collection template with rate limit handling.

### 2. Sentiment Analysis

MUST apply sentiment scoring to text data.

**VADER (Lexicon-Based - Fast):**
```python
from vaderSentiment.vaderSentiment import SentimentIntensityAnalyzer

analyzer = SentimentIntensityAnalyzer()
scores = analyzer.polarity_scores(text)

# Output: {'neg': 0.2, 'neu': 0.3, 'pos': 0.5, 'compound': 0.6}
# compound range: -1.0 (most negative) to +1.0 (most positive)
```

**Classification:**
- compound ≥ 0.05 → positive
- -0.05 < compound < 0.05 → neutral
- compound ≤ -0.05 → negative

**BERT (ML-Based - Accurate):**
```python
from transformers import pipeline

sentiment = pipeline("sentiment-analysis")
result = sentiment(text[:512])  # MAXIMUM 512 tokens

# Output: [{'label': 'POSITIVE', 'score': 0.95}]
```

**Comparison:**
| Tool | Speed | Accuracy | Best For |
|------|-------|----------|----------|
| VADER | Fast | 85% | Social media, high volume |
| BERT | Slow | 92% | Context-dependent, quality |

**Script:** `scripts/sentiment_analysis.py` for both VADER and BERT implementations.

### 3. Engagement Metrics

MUST track key Reddit engagement indicators.

**Primary Metrics:**
| Metric | Source | Meaning |
|--------|--------|---------|
| score | `submission.score` | Upvotes - downvotes |
| upvote_ratio | `submission.upvote_ratio` | % upvotes (0.0-1.0) |
| num_comments | `submission.num_comments` | Total comments |
| created_utc | `submission.created_utc` | Unix timestamp |

**Derived Metrics:**
```python
# Engagement rate (relative to subreddit size)
engagement = (num_comments + score) / subscribers

# Comment-to-score ratio (discussion intensity)
discussion = num_comments / max(score, 1)

# Velocity (upvotes per hour)
age_hours = (now - created_utc) / 3600
velocity = score / max(age_hours, 1)

# Controversy (high comments + low upvote ratio)
if upvote_ratio < 0.7:
    controversy = num_comments * (1 - upvote_ratio)
```

**Benchmarks:**
- Good upvote_ratio: >0.85
- Average discussion ratio: 0.1-0.5
- High engagement rate: >0.01

**Reference:** `references/metrics_guide.md` for complete metrics catalog.

### 4. Analytics Dashboard

MUST create interactive visualizations with Streamlit/Dash.

**Streamlit Template:**
```python
import streamlit as st
import plotly.express as px

# Sentiment distribution
fig = px.pie(
    values=sentiment_counts,
    names=['positive', 'neutral', 'negative']
)
st.plotly_chart(fig)

# Engagement over time
fig = px.line(df, x='created_utc', y='score')
st.plotly_chart(fig)
```

**Key Visualizations:**
- Sentiment distribution (pie chart)
- Sentiment over time (line/bar)
- Score vs comments (scatter)
- Upvote ratio distribution (histogram)
- Top contributors (bar chart)
- Posting frequency heatmap (hour × weekday)

**Asset:** `assets/streamlit_dashboard.py` for complete dashboard template.

**Run:** `streamlit run assets/streamlit_dashboard.py`

## Workflow Example

**Task:** Analyze r/python sentiment and engagement for past week.

**Steps:**
1. **Authenticate:** Set up PRAW with OAuth2 credentials (NEVER hardcode)
2. **Collect:** `subreddit.top(time_filter='week', limit=100)` + comments
3. **Analyze Sentiment:** Apply VADER to titles + selftext + comment bodies
4. **Calculate Metrics:** Aggregate score, upvote_ratio, num_comments, sentiment
5. **Visualize:** Load dashboard template, plot sentiment distribution + engagement trends
6. **Export:** Save results to CSV/JSON for further analysis

**Output:** DataFrame with columns: id, title, score, upvote_ratio, num_comments, sentiment_compound, sentiment_label

## Production Deployment

**Orchestration:** Apache Airflow for scheduled data collection
```python
from airflow import DAG
from airflow.operators.python import PythonOperator

dag = DAG('reddit_analytics', schedule_interval='@daily')
collect_task = PythonOperator(task_id='collect', python_callable=collect_data)
sentiment_task = PythonOperator(task_id='sentiment', python_callable=analyze_sentiment)
```

**Monitoring:** Grafana + Prometheus for metrics tracking
- API request count
- Rate limit remaining
- Sentiment distribution
- Data collection latency

**Storage:** PostgreSQL OR AWS S3 for historical data
- Schema: submissions(id, title, score, created_utc, sentiment)
- Schema: comments(id, submission_id, body, score, sentiment)

**GDPR Compliance:**
- NEVER store PII (email, IP addresses)
- Implement data retention limits (MAXIMUM 90 days for personal data)
- Provide user data deletion capability

## Security Requirements

**Authentication:**
- MUST use OAuth2 with client credentials
- NEVER commit secrets to version control
- Store in environment variables: `REDDIT_CLIENT_ID`, `REDDIT_CLIENT_SECRET`
- Tokens expire after 1 hour → implement refresh token rotation

**API Security:**
- ONLY use HTTPS/TLS for API calls
- Validate SSL certificates (NEVER disable verification)
- Implement rate limit backoff (exponential: 1s, 2s, 4s, 8s...)
- Monitor `x-ratelimit-remaining` header proactively

**Data Privacy:**
- ONLY analyze public subreddits
- NEVER collect private/restricted content without authorization
- Anonymize usernames in public reports (GDPR Article 5)
- Implement data minimization (collect ONLY necessary fields)

## Anti-Patterns

❌ **NEVER:**
- Hardcode credentials in scripts
- Skip `replace_more()` for comments (incomplete data)
- Ignore HTTP 429 rate limit errors
- Exceed 60 requests/minute
- Store raw PII without consent
- Use deprecated Pushshift API without fallback
- Disable SSL verification

✅ **ALWAYS:**
- Implement exponential backoff on rate limits
- Validate OAuth2 tokens before requests
- Monitor rate limit headers
- Use environment variables for credentials
- Aggregate data before storage (minimize PII)
- Test with small limits before production
- Handle prawcore exceptions gracefully

## Bundled Resources

**scripts/:**
- `collect_data.py` - PRAW data collection with rate limit handling
- `sentiment_analysis.py` - VADER and BERT sentiment analysis functions

**references/:**
- `praw_quickstart.md` - Complete PRAW API reference (authentication, data access, attributes)
- `metrics_guide.md` - Engagement metrics catalog with formulas and benchmarks

**assets/:**
- `streamlit_dashboard.py` - Interactive analytics dashboard template

## Installation

```bash
# Core dependencies
pip install praw pandas vaderSentiment

# Visualization (optional)
pip install streamlit plotly matplotlib seaborn

# BERT sentiment (optional, requires GPU for speed)
pip install transformers torch
```

## Constraints

- Rate limit: MAXIMUM 60 requests per minute (free tier)
- Authentication: EXACTLY OAuth2 with refresh tokens (expire 1 hour)
- Sentiment range: EXACTLY -1.0 to +1.0 (compound score)
- BERT input: MAXIMUM 512 tokens per text
- GDPR: NEVER store PII without explicit consent
- Public data: ONLY analyze public subreddits
- SSL: NEVER disable certificate verification
