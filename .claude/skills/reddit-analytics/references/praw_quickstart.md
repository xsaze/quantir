# PRAW Quick Reference

## Authentication Setup

**Read-Only Access (3 credentials):**
```python
import praw

reddit = praw.Reddit(
    client_id="YOUR_CLIENT_ID",
    client_secret="YOUR_CLIENT_SECRET",
    user_agent="platform:app_id:version (by u/username)"
)
```

**Authorized Access (5 credentials):**
```python
reddit = praw.Reddit(
    client_id="YOUR_CLIENT_ID",
    client_secret="YOUR_CLIENT_SECRET",
    user_agent="platform:app_id:version (by u/username)",
    username="YOUR_USERNAME",
    password="YOUR_PASSWORD"
)
```

**Get Credentials:** https://www.reddit.com/prefs/apps → Create App → Script type

## Core Data Access Methods

### Subreddit Access
```python
subreddit = reddit.subreddit("python")

# Properties
print(subreddit.display_name)  # "python"
print(subreddit.title)          # Full title
print(subreddit.subscribers)    # Subscriber count
```

### Submission Retrieval

**Sort Options:** `hot`, `new`, `top`, `controversial`, `rising`

```python
# Hot posts (default)
for submission in subreddit.hot(limit=10):
    print(submission.title, submission.score)

# Top posts (requires time_filter)
for submission in subreddit.top(time_filter='week', limit=10):
    print(submission.title)

# Time filters: 'hour', 'day', 'week', 'month', 'year', 'all'
```

### Submission Attributes
```python
submission.id              # Unique identifier
submission.title           # Post title
submission.selftext        # Post body (self posts)
submission.score           # Upvotes - downvotes
submission.upvote_ratio    # % upvotes (0.0-1.0)
submission.num_comments    # Comment count
submission.created_utc     # Unix timestamp
submission.author          # Redditor object
submission.url             # Link URL
submission.permalink       # Reddit URL
```

### Comment Extraction

**CRITICAL:** Use `replace_more()` to expand collapsed comments

```python
submission = reddit.submission(id='abc123')

# Expand all collapsed comment threads
submission.comments.replace_more(limit=0)

# Flatten comment tree
for comment in submission.comments.list():
    print(comment.body, comment.score)

# Iterate comment forest (maintains hierarchy)
for top_level_comment in submission.comments:
    print(top_level_comment.body)
    for reply in top_level_comment.replies:
        print("  ", reply.body)
```

### Comment Attributes
```python
comment.id           # Unique identifier
comment.body         # Comment text
comment.score        # Upvotes - downvotes
comment.created_utc  # Unix timestamp
comment.author       # Redditor object
comment.parent_id    # Parent comment/submission ID
comment.depth        # Nesting level (0 = top-level)
```

## Rate Limit Handling

**Limits:** 60 requests/min OR 600 requests/10min (free tier)

**Headers (accessible via prawcore):**
- `x-ratelimit-remaining`: Requests left
- `x-ratelimit-reset`: Unix timestamp for reset
- `x-ratelimit-used`: Requests used

**Error Handling:**
```python
from prawcore.exceptions import TooManyRequests
import time

try:
    submissions = subreddit.hot(limit=100)
except TooManyRequests as e:
    print(f"Rate limit hit. Wait {e.retry_after} seconds")
    time.sleep(e.retry_after)
    # Retry request
```

## Lazy Loading Behavior

**IMPORTANT:** API calls occur ONLY when attributes are accessed, not on object creation.

```python
submission = reddit.submission(id='abc123')  # No API call
title = submission.title                      # API call happens HERE
```

## Best Practices

1. **NEVER** hardcode credentials → use environment variables
2. **ALWAYS** use `replace_more()` for complete comment trees
3. **ALWAYS** implement rate limit error handling
4. **NEVER** exceed 60 requests/minute
5. Use `limit=None` to get all available items (careful with rate limits)
6. Monitor `x-ratelimit-remaining` header for proactive rate management
