# Query Optimization Checklist

## Pre-Execution Validation

Before running any DuneSQL query, verify:

### 1. Partition Filters (CRITICAL)
- [ ] `block_time` or `block_date` filter included
- [ ] Time range appropriate for analysis (7d, 30d, 90d)
- [ ] `blockchain` filter on multi-chain tables (dex.trades, tokens.transfers)
- [ ] Filters enable >90% data reduction

### 2. Column Selection
- [ ] Only necessary columns selected (NO `SELECT *`)
- [ ] Columnar storage optimization applied
- [ ] Calculated columns use efficient expressions

### 3. Table Choice
- [ ] Spell tables (dex.trades, nft.trades) used over raw logs
- [ ] Decoded tables preferred over raw event logs
- [ ] Community-maintained abstractions leveraged

### 4. Query Structure
- [ ] CTEs used for queries >20 lines
- [ ] Window functions instead of correlated subqueries
- [ ] `LIMIT` applied on sorted results
- [ ] Group by ordinal positions (1, 2, 3)

### 5. JOIN Optimization
- [ ] Partition filters in JOIN ON clause
- [ ] Indexed columns used (hash, block_number, address)
- [ ] Smallest table first in JOIN order
- [ ] Avoid unnecessary JOINs

### 6. Data Quality
- [ ] Address format uses `\x` prefix (NOT `0x`)
- [ ] Explicit type casting (date(), cast())
- [ ] NULL handling considered
- [ ] Deduplication pattern for known issues (prices.usd_latest)

## Performance Targets

- **Execution Time**: <5 minutes for interactive queries, <30 minutes for scheduled
- **Scanned Data**: Minimized via partition pruning
- **Result Size**: Limited with LIMIT clause (<10k rows for display)

## Common Anti-Patterns to Avoid

- ❌ No time filter on partitioned tables
- ❌ `SELECT *` on large tables (ethereum.transactions, logs)
- ❌ `ORDER BY` without `LIMIT`
- ❌ Unnecessary `DISTINCT` on large result sets
- ❌ Correlated subqueries (use window functions)
- ❌ Block explorer address format (0x instead of \x)
- ❌ Missing NULL checks on aggregations
