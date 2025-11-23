# Reddit Engagement Metrics Guide

## Primary Engagement Metrics

| Metric | Source | Range | Meaning |
|--------|--------|-------|---------|
| **score** | `submission.score` | 0 to ∞ | Net votes (upvotes - downvotes) |
| **upvote_ratio** | `submission.upvote_ratio` | 0.0 to 1.0 | % upvotes vs total votes |
| **num_comments** | `submission.num_comments` | 0 to ∞ | Total comment count |
| **created_utc** | `submission.created_utc` | Unix timestamp | Post creation time |

## Derived Metrics

### Engagement Rate
```python
engagement_rate = (num_comments + score) / subscribers
```
Indicates post reach relative to subreddit size.

### Comment-to-Score Ratio
```python
comment_ratio = num_comments / max(score, 1)
```
High ratio (>1.0) = discussion-heavy, Low ratio (<0.1) = low engagement.

### Time-Based Velocity
```python
from datetime import datetime
age_hours = (datetime.utcnow().timestamp() - created_utc) / 3600
velocity = score / max(age_hours, 1)
```
Measures upvote rate over time.

### Controversy Score
```python
if upvote_ratio < 0.7:
    controversy = num_comments * (1 - upvote_ratio)
```
High comments + low upvote ratio = controversial topic.

## User Metrics

### Author Karma
```python
redditor = reddit.redditor('username')
link_karma = redditor.link_karma    # Post karma
comment_karma = redditor.comment_karma  # Comment karma
```

### Author Activity
```python
# Recent submissions
for submission in redditor.submissions.new(limit=10):
    print(submission.title)

# Recent comments
for comment in redditor.comments.new(limit=10):
    print(comment.body[:100])
```

## Subreddit-Level Metrics

### Subscriber Growth
```python
subreddit = reddit.subreddit('python')
subscribers = subreddit.subscribers
active_users = subreddit.accounts_active  # Current online users
```

### Top Contributors
```python
# Aggregate submissions by author
author_scores = submissions_df.groupby('author')['score'].agg(['sum', 'count', 'mean'])
top_authors = author_scores.sort_values('sum', ascending=False).head(10)
```

### Post Frequency
```python
import pandas as pd
submissions_df['datetime'] = pd.to_datetime(submissions_df['created_utc'], unit='s')
posts_per_hour = submissions_df.groupby(submissions_df['datetime'].dt.hour).size()
```

## Sentiment-Enhanced Metrics

### Sentiment Distribution
```python
# Using VADER compound scores
sentiment_counts = {
    'positive': (compound_scores >= 0.05).sum(),
    'neutral': ((compound_scores > -0.05) & (compound_scores < 0.05)).sum(),
    'negative': (compound_scores <= -0.05).sum()
}
```

### Sentiment-Score Correlation
```python
import numpy as np
correlation = np.corrcoef(sentiment_df['compound'], sentiment_df['score'])[0, 1]
```
Positive correlation = sentiment drives engagement.

### Toxic Comment Detection
```python
# Using VADER negative scores
toxic_threshold = 0.5
toxic_comments = comments_df[comments_df['neg'] > toxic_threshold]
toxicity_rate = len(toxic_comments) / len(comments_df)
```

## Visualization Metrics

### Time Series Trends
```python
import matplotlib.pyplot as plt
import pandas as pd

# Daily post volume
daily_posts = submissions_df.groupby(submissions_df['datetime'].dt.date).size()
daily_posts.plot(kind='line', title='Daily Post Volume')
```

### Engagement Heatmap
```python
# Posts by hour and day of week
submissions_df['hour'] = submissions_df['datetime'].dt.hour
submissions_df['weekday'] = submissions_df['datetime'].dt.dayofweek

heatmap_data = submissions_df.pivot_table(
    values='score',
    index='hour',
    columns='weekday',
    aggfunc='mean'
)
```

## Performance Benchmarks

| Metric | Good | Average | Poor |
|--------|------|---------|------|
| Upvote Ratio | >0.85 | 0.70-0.85 | <0.70 |
| Comments/Score | >0.5 | 0.1-0.5 | <0.1 |
| Engagement Rate | >0.01 | 0.001-0.01 | <0.001 |

**Note:** Benchmarks vary by subreddit size and topic.

## API Efficiency Tips

1. **Batch requests:** Collect multiple submissions before processing
2. **Cache results:** Store API responses to avoid re-fetching
3. **Selective attributes:** Only access needed submission/comment attributes
4. **Time filters:** Use `time_filter` parameter to limit data range
5. **Monitor rate limits:** Track `x-ratelimit-remaining` header
