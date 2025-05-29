import Database from "better-sqlite3"
import { hashPassword } from "./auth"

const db = new Database("daytrader.db")

// Enable foreign keys
db.pragma("foreign_keys = ON")

// Create tables
db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    name TEXT NOT NULL,
    role TEXT DEFAULT 'user',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS articles (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    content TEXT NOT NULL,
    excerpt TEXT,
    tags TEXT, -- JSON array
    status TEXT DEFAULT 'draft',
    author_id INTEGER,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (author_id) REFERENCES users (id)
  );

  CREATE TABLE IF NOT EXISTS indicators (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    description TEXT,
    content TEXT NOT NULL,
    categories TEXT, -- JSON array
    complexity TEXT DEFAULT 'beginner',
    status TEXT DEFAULT 'draft',
    author_id INTEGER,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (author_id) REFERENCES users (id)
  );
`)

// Create admin user if it doesn't exist
const checkAdmin = db.prepare("SELECT id FROM users WHERE email = ?")
const adminExists = checkAdmin.get("admin@daytraderplaybook.com")

if (!adminExists) {
  const createAdmin = async () => {
    const hashedPassword = await hashPassword("admin123")
    const insertAdmin = db.prepare(`
      INSERT INTO users (email, password, name, role)
      VALUES (?, ?, ?, ?)
    `)
    insertAdmin.run("admin@daytraderplaybook.com", hashedPassword, "Admin", "admin")
    console.log("Admin user created: admin@daytraderplaybook.com / admin123")
  }
  createAdmin()
}

// Create sample data if tables are empty
const articleCount = db.prepare("SELECT COUNT(*) as count FROM articles").get() as { count: number }
const indicatorCount = db.prepare("SELECT COUNT(*) as count FROM indicators").get() as { count: number }

if (articleCount.count === 0) {
  const insertArticle = db.prepare(`
    INSERT INTO articles (title, slug, content, excerpt, tags, status, author_id)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `)

  const sampleArticles = [
    {
      title: "NQ Futures Market Analysis - December 2024",
      slug: "nq-futures-market-analysis-december-2024",
      content: `# NQ Futures Market Analysis - December 2024

## Market Overview

The Nasdaq-100 futures (NQ) have shown significant volatility in December 2024, with key technical levels being tested repeatedly. This analysis covers the major market internals and breadth indicators that are driving current price action.

## Key Market Internals

### NYSE TICK Analysis
The NYSE TICK has been showing extreme readings, with multiple +1000 and -1000 spikes indicating high institutional activity. These extremes often precede significant directional moves in the NQ.

### Advance/Decline Data
The advance/decline ratio has been deteriorating, suggesting underlying weakness despite recent highs. This divergence is worth monitoring for potential reversal signals.

## Trading Implications

Based on current market internals:
- Watch for TICK extremes as entry signals
- Monitor volume participation on breakouts
- Use breadth divergences for timing exits

## Conclusion

The current market environment requires careful attention to internals rather than just price action. The divergences we're seeing suggest caution is warranted.`,
      excerpt:
        "Comprehensive analysis of NQ futures market conditions in December 2024, focusing on market internals and breadth indicators.",
      tags: JSON.stringify(["NQ", "Market Analysis", "Technical Analysis", "Futures"]),
      status: "published",
      authorId: 1,
    },
    {
      title: "Understanding Market Breadth Indicators",
      slug: "understanding-market-breadth-indicators",
      content: `# Understanding Market Breadth Indicators

Market breadth indicators are essential tools for understanding the underlying health of the market beyond just price movements.

## What Are Breadth Indicators?

Breadth indicators measure the participation of individual stocks in market moves. They help identify:
- Market strength or weakness
- Potential reversals
- Confirmation of trends

## Key Breadth Indicators

### Advance/Decline Line
Tracks the cumulative difference between advancing and declining stocks.

### McClellan Oscillator
A momentum oscillator based on advance/decline data.

### Up/Down Volume Ratio
Compares volume in advancing vs declining stocks.

## Application in NQ Trading

These indicators are particularly useful for NQ futures trading because they provide early warning signals for market turns.`,
      excerpt: "Learn how to use market breadth indicators to improve your NQ futures trading decisions.",
      tags: JSON.stringify(["Market Breadth", "Technical Analysis", "Education"]),
      status: "published",
      authorId: 1,
    },
  ]

  sampleArticles.forEach((article) => {
    insertArticle.run(
      article.title,
      article.slug,
      article.content,
      article.excerpt,
      article.tags,
      article.status,
      article.authorId,
    )
  })
}

if (indicatorCount.count === 0) {
  const insertIndicator = db.prepare(`
    INSERT INTO indicators (name, slug, description, content, categories, complexity, status, author_id)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `)

  const sampleIndicators = [
    {
      name: "NYSE TICK Indicator",
      slug: "nyse-tick-indicator",
      description:
        "Real-time measure of market sentiment showing the difference between upticking and downticking stocks on the NYSE.",
      content: `# NYSE TICK Indicator

## Overview
The NYSE TICK is one of the most important real-time sentiment indicators for day traders. It measures the difference between the number of stocks trading on an uptick versus a downtick on the New York Stock Exchange.

## How It Works
- Positive TICK values indicate more stocks are upticking
- Negative TICK values indicate more stocks are downticking
- Extreme readings (+1000 or -1000) often signal short-term reversals

## Trading Applications
### Entry Signals
- TICK extremes often provide excellent entry points
- Look for divergences between TICK and price action
- Use TICK to confirm breakout strength

### Risk Management
- Extreme TICK readings can signal overbought/oversold conditions
- Use TICK to time exits on momentum trades

## Key Levels
- +1000: Extreme bullish reading
- +500: Strong bullish sentiment
- 0: Neutral
- -500: Strong bearish sentiment
- -1000: Extreme bearish reading`,
      categories: JSON.stringify(["sentiment", "breadth", "real-time"]),
      complexity: "beginner",
      status: "published",
      authorId: 1,
    },
    {
      name: "Cumulative TICK",
      slug: "cumulative-tick",
      description:
        "A running total of NYSE TICK readings that helps identify longer-term market bias and momentum shifts.",
      content: `# Cumulative TICK Indicator

## What is Cumulative TICK?
The Cumulative TICK is a running total of NYSE TICK readings throughout the trading session. It provides insight into the overall market bias and helps identify momentum shifts.

## Calculation
Simply add each TICK reading to the previous cumulative total:
Cumulative TICK = Previous Cumulative TICK + Current TICK

## Interpretation
### Upward Slope
- Indicates sustained buying pressure
- Confirms bullish momentum
- Supports long positions

### Downward Slope
- Shows persistent selling pressure
- Confirms bearish momentum
- Supports short positions

### Divergences
- Price making new highs while Cumulative TICK fails to confirm
- Often signals potential reversal

## Trading Strategy
1. Use slope direction for bias
2. Look for divergences with price
3. Combine with other breadth indicators
4. Time entries with regular TICK extremes`,
      categories: JSON.stringify(["sentiment", "breadth", "momentum"]),
      complexity: "intermediate",
      status: "published",
      authorId: 1,
    },
  ]

  sampleIndicators.forEach((indicator) => {
    insertIndicator.run(
      indicator.name,
      indicator.slug,
      indicator.description,
      indicator.content,
      indicator.categories,
      indicator.complexity,
      indicator.status,
      indicator.authorId,
    )
  })
}

export { db }
