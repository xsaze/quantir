#!/usr/bin/env python3
"""
Reddit Sentiment Analysis using VADER and BERT

Analyzes sentiment of Reddit posts and comments.
Requires: pip install vaderSentiment transformers torch pandas
"""

import pandas as pd
from vaderSentiment.vaderSentiment import SentimentIntensityAnalyzer

def analyze_vader_sentiment(texts):
    """
    Analyze sentiment using VADER (Valence Aware Dictionary and sEntiment Reasoner).
    Fast, lexicon-based, optimized for social media.

    Args:
        texts: list of strings or pandas.Series

    Returns:
        pandas.DataFrame with sentiment scores
    """
    analyzer = SentimentIntensityAnalyzer()
    results = []

    for text in texts:
        if pd.isna(text) or text == '':
            results.append({
                'neg': 0.0,
                'neu': 0.0,
                'pos': 0.0,
                'compound': 0.0
            })
        else:
            scores = analyzer.polarity_scores(str(text))
            results.append(scores)

    return pd.DataFrame(results)

def classify_sentiment(compound_score):
    """
    Classify sentiment based on VADER compound score.

    Args:
        compound_score: float between -1.0 and 1.0

    Returns:
        'positive', 'neutral', or 'negative'
    """
    if compound_score >= 0.05:
        return 'positive'
    elif compound_score <= -0.05:
        return 'negative'
    else:
        return 'neutral'

def analyze_bert_sentiment(texts, model_name='distilbert-base-uncased-finetuned-sst-2-english'):
    """
    Analyze sentiment using BERT-based model.
    More accurate but computationally intensive.

    Args:
        texts: list of strings or pandas.Series
        model_name: HuggingFace model name

    Returns:
        pandas.DataFrame with sentiment scores
    """
    try:
        from transformers import pipeline

        # Initialize sentiment pipeline
        sentiment_pipeline = pipeline(
            "sentiment-analysis",
            model=model_name,
            device=-1  # Use CPU; change to 0 for GPU
        )

        results = []

        # Process in batches to avoid memory issues
        batch_size = 16
        for i in range(0, len(texts), batch_size):
            batch = texts[i:i+batch_size]

            # Filter out empty/null texts
            valid_texts = [str(t)[:512] for t in batch if pd.notna(t) and str(t).strip()]

            if valid_texts:
                batch_results = sentiment_pipeline(valid_texts)
                results.extend(batch_results)
            else:
                results.extend([{'label': 'NEUTRAL', 'score': 0.5}] * len(batch))

        # Convert to DataFrame
        df = pd.DataFrame(results)
        df['sentiment'] = df['label'].str.lower()
        df['confidence'] = df['score']

        return df[['sentiment', 'confidence']]

    except ImportError:
        print("BERT analysis requires: pip install transformers torch")
        return pd.DataFrame()
    except Exception as e:
        print(f"BERT analysis error: {e}")
        return pd.DataFrame()

def aggregate_subreddit_sentiment(df, text_column='text', id_column='id'):
    """
    Aggregate sentiment statistics for subreddit data.

    Args:
        df: pandas.DataFrame with text data
        text_column: column name containing text to analyze
        id_column: column name for unique identifier

    Returns:
        dict with aggregated sentiment statistics
    """
    # Run VADER sentiment analysis
    sentiment_scores = analyze_vader_sentiment(df[text_column])

    # Add sentiment classification
    sentiment_scores['sentiment'] = sentiment_scores['compound'].apply(classify_sentiment)

    # Combine with original data
    result_df = pd.concat([df, sentiment_scores], axis=1)

    # Calculate aggregated statistics
    stats = {
        'total_items': len(result_df),
        'positive_count': (result_df['sentiment'] == 'positive').sum(),
        'neutral_count': (result_df['sentiment'] == 'neutral').sum(),
        'negative_count': (result_df['sentiment'] == 'negative').sum(),
        'positive_pct': (result_df['sentiment'] == 'positive').mean() * 100,
        'neutral_pct': (result_df['sentiment'] == 'neutral').mean() * 100,
        'negative_pct': (result_df['sentiment'] == 'negative').mean() * 100,
        'avg_compound': result_df['compound'].mean(),
        'median_compound': result_df['compound'].median(),
        'std_compound': result_df['compound'].std()
    }

    return result_df, stats

def main():
    # Example usage
    sample_texts = [
        "This is the best subreddit ever! Love the community.",
        "I'm not sure about this post, seems okay I guess.",
        "This is terrible content. Worst post I've seen.",
        "Great discussion here! Very insightful comments.",
        "Meh, nothing special."
    ]

    # VADER analysis
    print("=== VADER Sentiment Analysis ===")
    vader_results = analyze_vader_sentiment(sample_texts)
    vader_results['text'] = sample_texts
    vader_results['sentiment'] = vader_results['compound'].apply(classify_sentiment)
    print(vader_results[['text', 'compound', 'sentiment']])

    print("\n=== BERT Sentiment Analysis ===")
    # BERT analysis (optional - requires transformers)
    try:
        bert_results = analyze_bert_sentiment(sample_texts)
        bert_results['text'] = sample_texts
        print(bert_results)
    except:
        print("BERT analysis not available (requires transformers library)")

if __name__ == "__main__":
    main()
