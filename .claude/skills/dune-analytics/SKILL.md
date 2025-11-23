---
name: dune-analytics
description: Expert guidance for Dune Analytics SQL queries, crypto metrics dashboards, on-chain data visualization, wallet tracking, and protocol analytics for trading decisions. This skill should be used when users need help with DuneSQL queries, blockchain data analysis, DEX/NFT metrics, wallet behavior tracking, or building crypto analytics dashboards.
---

# Dune Analytics Expert

MUST provide expert Dune Analytics guidance: DuneSQL queries, crypto dashboards, wallet tracking, protocol analytics for trading decisions.

## Purpose

Guide users through Dune Analytics implementation with production-ready query patterns, performance optimization, and on-chain metrics analysis. Covers DuneSQL syntax, partition pruning, spell tables, CTEs, window functions, dashboard creation, and security practices for blockchain data analytics.

## When to Use

Trigger on keywords: Dune Analytics, DuneSQL, on-chain analytics, blockchain SQL queries, wallet tracking, DEX volume, NFT analytics, crypto dashboard, protocol metrics, trading decisions.

**Use when users need:**
- DuneSQL query writing and optimization
- Blockchain data analysis (DEX, NFT, DeFi protocols)
- Wallet behavior tracking and labeling
- Trading metrics dashboards
- Protocol analytics and comparison
- Performance troubleshooting (timeouts, slow queries)
- Data quality handling (duplicates, missing data)

## Core Capabilities

### 1. Query Construction

Load `references/query_patterns.md` for production-ready examples:
- DEX volume analysis (cross-protocol comparison)
- Wallet tracking with labels integration
- NFT collection metrics and ownership
- Window functions (rolling averages, ranking)
- Deduplication patterns for known issues
- Address format and type casting

**Standard Pattern**:
```sql
with descriptive_cte as (
    select column1, column2
    from schema.spell_table
    where block_time >= now() - interval '30' day
      and blockchain = 'ethereum'
)
select column1, count(*) as metric
from descriptive_cte
group by 1 order by 2 desc limit 100
```

### 2. Performance Optimization

Consult `references/optimization_checklist.md` before execution:
- ✅ Partition filters (block_time + blockchain)
- ✅ Column selection (NO SELECT *)
- ✅ Spell tables over raw logs
- ✅ CTEs for complex logic
- ✅ Window functions vs subqueries
- ✅ Address format (\x NOT 0x)

**Impact**: Partition pruning reduces scanned data by 90%+. Spell tables 10-100x faster than raw logs.

### 3. Table Selection

Use `references/common_tables.md` for optimal table choice:
- **dex.trades**: DEX activity across protocols
- **nft.trades**: NFT marketplace transactions
- **prices.usd**: Token prices (deduplicate prices.usd_latest)
- **tokens.transfers**: Cross-chain token flows
- **labels.addresses**: Address metadata (or get_labels() function)
- **lending.borrow**: DeFi lending activity

**Decision Tree**: Spell tables → Decoded tables → Raw logs (last resort)

### 4. Dashboard Architecture

**Multi-Panel Layout** (MINIMUM 3):
1. **Key Metrics**: Total volume, unique traders, avg size (cards)
2. **Time Series**: Daily trends, moving averages (line/area)
3. **Breakdown**: Top protocols/tokens/wallets (table LIMIT 100)

**Parameterization**: Token address, DEX dropdown, date range, blockchain filter

### 5. Known Limitations

**MUST address**:
- **Timeouts**: 30min hard limit. Optimize via partition pruning, spell tables.
- **Data Staleness**: Minutes-hours lag. NOT for millisecond trading.
- **Duplicates**: prices.usd_latest (#8796). Use ROW_NUMBER() deduplication.
- **Missing Data**: Curve incomplete (#8716), Raydium missing (#8745), Chainlink stale (#8883).

### 6. Security Practices

**API Keys**: Environment variables only. Scoped permissions. Rotate quarterly.

**Privacy**: Public queries expose logic permanently. Use private queries (paid) for proprietary metrics. De-anonymization risk—aggregate addresses in public dashboards.

**Access Control**: Public = visible to all. Unlisted = link-only. Private = team-only (paid).

## Validation Checklist

Before providing query:
- [ ] Time filter (block_time >= ...)
- [ ] Blockchain filter on multi-chain tables
- [ ] Spell tables used
- [ ] Address format \x (NOT 0x)
- [ ] Explicit type casting (date(), cast())
- [ ] CTEs for >20 lines
- [ ] LIMIT on ORDER BY
- [ ] Deduplication for prices.usd_latest
- [ ] NULL handling
- [ ] Query <100 lines

## Output Format

**For Queries**:
1. Annotated DuneSQL with inline optimization comments
2. Performance notes (execution time estimate, data reduction %)
3. Validation checklist of applied optimizations
4. Known issues warnings (duplicates, missing data)
5. Alternative approaches (spell vs raw trade-off)

**For Dashboards**:
1. Panel structure (3+ panels: metrics, time series, breakdown)
2. Parameterization (dynamic filters)
3. Visualization types (bar for comparison, line for trends)
4. Refresh strategy (frequency based on use case)

**For Troubleshooting**:
1. Root cause identification
2. Specific fix (optimization or pattern change)
3. Verification method

## Constraints

- Query examples: MINIMUM 5 lines, MAXIMUM 30 lines
- Optimization checklist: EXACTLY 6 items
- Dashboard panels: MINIMUM 3
- NEVER SELECT * on large tables
- NEVER omit time filters
- NEVER use 0x address format
- ALWAYS spell tables over raw logs
- ALWAYS lowercase SQL

## Example Interaction

**User**: "Track Uniswap volume last 30 days"

**Response**:
```sql
-- Uniswap 30-day volume analysis
-- Partition pruning: block_time reduces scanned data 95%+
-- Spell table dex.trades (10x faster vs raw logs)

select
    date_trunc('day', block_time) as day,
    blockchain,
    count(*) as trades,
    sum(amount_usd) as volume_usd
from dex.trades
where block_time >= now() - interval '30' day
  and project = 'Uniswap'
  and blockchain in ('ethereum', 'arbitrum', 'polygon')
group by 1, 2
order by 1 desc, 4 desc
limit 1000
```

**Optimizations Applied**:
✅ Partition filter (95%+ reduction)
✅ Spell table (10x faster)
✅ Blockchain filter
✅ Column selection (4 cols)
✅ LIMIT on sort
✅ Lowercase SQL

**Performance**: ~10-30s execution

**Dashboard**: Line chart (volume by day, stacked by blockchain) + bar chart (total by chain) + recent 100 days table

## Resources

### references/
- **query_patterns.md**: DEX, wallet, NFT, window functions, deduplication examples
- **optimization_checklist.md**: 6-point validation, performance targets, anti-patterns
- **common_tables.md**: Spell tables guide, decision tree, key columns

Load as needed when user request matches specific pattern or needs table selection guidance.
