#!/usr/bin/env python3
"""
Reddit Data Collection Script using PRAW

Collects posts and comments from specified subreddit with rate limit handling.
Requires: pip install praw pandas
"""

import praw
import pandas as pd
import time
from prawcore.exceptions import TooManyRequests, RequestException

def create_reddit_instance(client_id, client_secret, user_agent):
    """Create authenticated Reddit instance."""
    return praw.Reddit(
        client_id=client_id,
        client_secret=client_secret,
        user_agent=user_agent
    )

def collect_submissions(subreddit, sort='hot', limit=100, time_filter='week'):
    """
    Collect submissions from subreddit with rate limit handling.

    Args:
        subreddit: praw.models.Subreddit object
        sort: 'hot', 'new', 'top', 'controversial', 'rising'
        limit: max submissions (MAXIMUM 100 per request)
        time_filter: 'hour', 'day', 'week', 'month', 'year', 'all' (for 'top' and 'controversial')

    Returns:
        pandas.DataFrame with submission data
    """
    submissions_data = []

    try:
        # Get submissions based on sort type
        if sort == 'hot':
            submissions = subreddit.hot(limit=limit)
        elif sort == 'new':
            submissions = subreddit.new(limit=limit)
        elif sort == 'top':
            submissions = subreddit.top(time_filter=time_filter, limit=limit)
        elif sort == 'controversial':
            submissions = subreddit.controversial(time_filter=time_filter, limit=limit)
        elif sort == 'rising':
            submissions = subreddit.rising(limit=limit)
        else:
            raise ValueError(f"Invalid sort type: {sort}")

        for submission in submissions:
            submissions_data.append({
                'id': submission.id,
                'title': submission.title,
                'selftext': submission.selftext,
                'score': submission.score,
                'upvote_ratio': submission.upvote_ratio,
                'num_comments': submission.num_comments,
                'created_utc': submission.created_utc,
                'author': str(submission.author),
                'url': submission.url,
                'permalink': submission.permalink
            })

    except TooManyRequests as e:
        print(f"Rate limit exceeded. Waiting {e.retry_after} seconds...")
        time.sleep(e.retry_after)
        # Retry collection
        return collect_submissions(subreddit, sort, limit, time_filter)
    except RequestException as e:
        print(f"Request error: {e}")
        return pd.DataFrame()

    return pd.DataFrame(submissions_data)

def collect_comments(submission, max_depth=None):
    """
    Collect all comments from submission including nested threads.

    Args:
        submission: praw.models.Submission object
        max_depth: maximum comment depth (None = all levels)

    Returns:
        pandas.DataFrame with comment data
    """
    comments_data = []

    try:
        # Replace MoreComments objects to get all comments
        submission.comments.replace_more(limit=0)

        for comment in submission.comments.list():
            comments_data.append({
                'comment_id': comment.id,
                'submission_id': submission.id,
                'body': comment.body,
                'score': comment.score,
                'created_utc': comment.created_utc,
                'author': str(comment.author),
                'parent_id': comment.parent_id,
                'depth': comment.depth if hasattr(comment, 'depth') else 0
            })

    except TooManyRequests as e:
        print(f"Rate limit exceeded. Waiting {e.retry_after} seconds...")
        time.sleep(e.retry_after)
        return collect_comments(submission, max_depth)
    except Exception as e:
        print(f"Error collecting comments: {e}")
        return pd.DataFrame()

    df = pd.DataFrame(comments_data)

    # Filter by max_depth if specified
    if max_depth is not None and not df.empty:
        df = df[df['depth'] <= max_depth]

    return df

def main():
    # Example usage
    reddit = create_reddit_instance(
        client_id="YOUR_CLIENT_ID",
        client_secret="YOUR_CLIENT_SECRET",
        user_agent="reddit-analytics-bot/1.0"
    )

    # Get subreddit
    subreddit = reddit.subreddit("python")

    # Collect submissions
    print("Collecting submissions...")
    submissions_df = collect_submissions(subreddit, sort='hot', limit=50)
    print(f"Collected {len(submissions_df)} submissions")

    # Collect comments from first submission
    if not submissions_df.empty:
        submission = reddit.submission(id=submissions_df.iloc[0]['id'])
        print(f"Collecting comments from: {submission.title}")
        comments_df = collect_comments(submission)
        print(f"Collected {len(comments_df)} comments")

if __name__ == "__main__":
    main()
