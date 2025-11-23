#!/usr/bin/env python3
"""
Reddit Analytics Dashboard Template - Streamlit

Interactive dashboard for Reddit sentiment and engagement analysis.
Requires: pip install streamlit pandas plotly praw vaderSentiment
"""

import streamlit as st
import pandas as pd
import plotly.express as px
import plotly.graph_objects as go
from datetime import datetime

# Page configuration
st.set_page_config(
    page_title="Reddit Analytics Dashboard",
    page_icon="📊",
    layout="wide"
)

def main():
    st.title("📊 Reddit Analytics Dashboard")
    st.markdown("---")

    # Sidebar - Configuration
    with st.sidebar:
        st.header("⚙️ Configuration")

        subreddit_name = st.text_input("Subreddit", value="python")
        sort_option = st.selectbox("Sort By", ["hot", "new", "top", "controversial"])
        limit = st.slider("Number of Posts", min_value=10, max_value=100, value=50)

        if sort_option in ["top", "controversial"]:
            time_filter = st.selectbox(
                "Time Filter",
                ["hour", "day", "week", "month", "year", "all"]
            )
        else:
            time_filter = "week"

        analyze_button = st.button("🔍 Analyze Subreddit", type="primary")

    # Main content area
    if analyze_button:
        with st.spinner(f"Analyzing r/{subreddit_name}..."):
            # TODO: Replace with actual data collection
            # For template purposes, using sample data
            sample_data = create_sample_data(limit)

            # Display metrics
            display_metrics(sample_data)

            # Sentiment analysis section
            st.markdown("---")
            st.subheader("😊 Sentiment Analysis")
            display_sentiment_charts(sample_data)

            # Engagement metrics section
            st.markdown("---")
            st.subheader("📈 Engagement Metrics")
            display_engagement_charts(sample_data)

            # Top posts table
            st.markdown("---")
            st.subheader("🔥 Top Posts")
            display_posts_table(sample_data)

    else:
        st.info("👈 Configure settings and click 'Analyze Subreddit' to start")

        # Show example visualizations
        st.markdown("### Example Dashboard Features")
        col1, col2, col3 = st.columns(3)

        with col1:
            st.metric("Total Posts", "50", "+5")
        with col2:
            st.metric("Avg Score", "142", "+12%")
        with col3:
            st.metric("Positive Sentiment", "65%", "+3%")

def create_sample_data(n=50):
    """Create sample Reddit data for template demonstration."""
    import numpy as np

    dates = pd.date_range(end=datetime.now(), periods=n, freq='H')

    data = {
        'title': [f"Sample Post {i+1}" for i in range(n)],
        'score': np.random.randint(10, 500, n),
        'upvote_ratio': np.random.uniform(0.6, 1.0, n),
        'num_comments': np.random.randint(5, 200, n),
        'created_utc': dates,
        'sentiment_compound': np.random.uniform(-0.5, 0.8, n),
        'sentiment_pos': np.random.uniform(0.1, 0.6, n),
        'sentiment_neu': np.random.uniform(0.2, 0.7, n),
        'sentiment_neg': np.random.uniform(0.0, 0.3, n),
    }

    df = pd.DataFrame(data)
    df['sentiment'] = df['sentiment_compound'].apply(
        lambda x: 'positive' if x >= 0.05 else ('negative' if x <= -0.05 else 'neutral')
    )

    return df

def display_metrics(df):
    """Display key metrics in columns."""
    col1, col2, col3, col4 = st.columns(4)

    with col1:
        st.metric(
            "Total Posts",
            len(df),
            help="Number of posts analyzed"
        )

    with col2:
        avg_score = df['score'].mean()
        st.metric(
            "Average Score",
            f"{avg_score:.0f}",
            help="Mean upvotes - downvotes"
        )

    with col3:
        avg_ratio = df['upvote_ratio'].mean()
        st.metric(
            "Avg Upvote Ratio",
            f"{avg_ratio:.2%}",
            help="Average % of upvotes"
        )

    with col4:
        positive_pct = (df['sentiment'] == 'positive').mean()
        st.metric(
            "Positive Sentiment",
            f"{positive_pct:.1%}",
            help="% posts with positive sentiment"
        )

def display_sentiment_charts(df):
    """Display sentiment analysis visualizations."""
    col1, col2 = st.columns(2)

    with col1:
        # Sentiment distribution pie chart
        sentiment_counts = df['sentiment'].value_counts()

        fig = px.pie(
            values=sentiment_counts.values,
            names=sentiment_counts.index,
            title="Sentiment Distribution",
            color=sentiment_counts.index,
            color_discrete_map={
                'positive': '#00CC96',
                'neutral': '#636EFA',
                'negative': '#EF553B'
            }
        )
        st.plotly_chart(fig, use_container_width=True)

    with col2:
        # Sentiment over time
        time_sentiment = df.groupby([df['created_utc'].dt.date, 'sentiment']).size().reset_index(name='count')

        fig = px.bar(
            time_sentiment,
            x='created_utc',
            y='count',
            color='sentiment',
            title="Sentiment Over Time",
            color_discrete_map={
                'positive': '#00CC96',
                'neutral': '#636EFA',
                'negative': '#EF553B'
            }
        )
        st.plotly_chart(fig, use_container_width=True)

def display_engagement_charts(df):
    """Display engagement metrics visualizations."""
    col1, col2 = st.columns(2)

    with col1:
        # Score vs Comments scatter
        fig = px.scatter(
            df,
            x='score',
            y='num_comments',
            color='sentiment',
            title="Score vs Comments",
            hover_data=['title'],
            color_discrete_map={
                'positive': '#00CC96',
                'neutral': '#636EFA',
                'negative': '#EF553B'
            }
        )
        st.plotly_chart(fig, use_container_width=True)

    with col2:
        # Upvote ratio distribution
        fig = px.histogram(
            df,
            x='upvote_ratio',
            nbins=20,
            title="Upvote Ratio Distribution",
            labels={'upvote_ratio': 'Upvote Ratio', 'count': 'Number of Posts'}
        )
        st.plotly_chart(fig, use_container_width=True)

def display_posts_table(df):
    """Display top posts in a table."""
    top_posts = df.nlargest(10, 'score')[['title', 'score', 'num_comments', 'upvote_ratio', 'sentiment']]

    st.dataframe(
        top_posts,
        column_config={
            "title": st.column_config.TextColumn("Title", width="large"),
            "score": st.column_config.NumberColumn("Score", format="%d"),
            "num_comments": st.column_config.NumberColumn("Comments", format="%d"),
            "upvote_ratio": st.column_config.ProgressColumn(
                "Upvote Ratio",
                format="%.1f%%",
                min_value=0,
                max_value=1,
            ),
            "sentiment": st.column_config.TextColumn("Sentiment")
        },
        hide_index=True,
        use_container_width=True
    )

if __name__ == "__main__":
    main()
