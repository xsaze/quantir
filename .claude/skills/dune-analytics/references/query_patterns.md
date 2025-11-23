# DuneSQL Query Patterns Reference

## Essential Query Structure

```sql
-- Standard pattern with partition pruning
with base_data as (
    select
        column1,
        column2,
        column3
    from schema.spell_table
    where block_time >= now() - interval '30' day  -- Partition pruning
      and blockchain = 'ethereum'                   -- Multi-chain filter
)

select
    column1,
    count(*) as metric
from base_data
group by 1
order by 2 desc
limit 100
```

## DEX Volume Analysis

```sql
-- Cross-DEX comparison with time series
select
    date_trunc('day', block_time) as day,
    project,
    blockchain,
    count(*) as trades,
    sum(amount_usd) as volume_usd
from dex.trades
where block_time >= now() - interval '30' day
  and blockchain in ('ethereum', 'arbitrum', 'polygon')
group by 1, 2, 3
order by 1 desc, 5 desc
```

## Wallet Tracking

```sql
-- Wallet activity with labels
select
    taker as wallet,
    labels.get_labels(taker) as wallet_labels,
    count(distinct date_trunc('day', block_time)) as active_days,
    count(*) as trade_count,
    sum(amount_usd) as total_volume,
    avg(amount_usd) as avg_trade_size,
    min(block_time) as first_trade,
    max(block_time) as last_trade
from dex.trades
where taker = '\xWALLET_ADDRESS_HERE'
  and block_time >= now() - interval '90' day
group by 1
```

## NFT Analytics

```sql
-- NFT collection metrics with ownership
select
    nft_contract_address,
    count(distinct buyer) as unique_buyers,
    count(*) as sales_count,
    sum(amount_usd) as volume_usd,
    avg(amount_usd) as avg_sale_price,
    max(amount_usd) as max_sale
from nft.trades
where block_time >= now() - interval '7' day
  and platform = 'OpenSea'
  and blockchain = 'ethereum'
group by 1
order by 4 desc
limit 50
```

## Window Functions

```sql
-- Rolling averages and ranking
with daily_metrics as (
    select
        date_trunc('day', block_time) as day,
        sum(amount_usd) as volume
    from dex.trades
    where block_time >= now() - interval '90' day
      and project = 'Uniswap'
    group by 1
)

select
    day,
    volume,
    avg(volume) over (
        order by day
        rows between 6 preceding and current row
    ) as ma_7day,
    volume - lag(volume, 1) over (order by day) as daily_change
from daily_metrics
order by day desc
```

## Deduplication Pattern

```sql
-- Handle known duplicate issues (prices.usd_latest #8796)
with deduplicated_prices as (
    select
        contract_address,
        blockchain,
        price,
        minute,
        row_number() over (
            partition by contract_address, blockchain
            order by minute desc
        ) as rn
    from prices.usd_latest
)

select
    contract_address,
    blockchain,
    price
from deduplicated_prices
where rn = 1
```

## Performance Optimization

```sql
-- JOIN optimization with partition filters
select
    t.hash,
    t.from_address,
    t.to_address,
    l.contract_address,
    l.topic1
from ethereum.transactions t
inner join ethereum.logs l
    on t.hash = l.tx_hash
    and t.block_time >= date('2025-11-01')  -- Partition filter in JOIN
    and l.block_time >= date('2025-11-01')
where t.to_address = '\xCONTRACT_ADDRESS'
limit 1000
```

## Address Format Examples

```sql
-- ✅ CORRECT - Use \x prefix
where token_address = '\xA0b86991c6218b36c1d19D4a027118707551378d'
  and taker = '\x742d35Cc6634C0532925a3b844Bc9e7595f0bEb'

-- ❌ WRONG - Block explorer format
where token_address = '0xA0b86991c6218b36c1d19D4a027118707551378d'
```

## Type Casting

```sql
-- Explicit date casting
where block_time > date('2025-11-01')
  and block_time < cast('2025-12-01' as timestamp)

-- Bytea to numeric
select
    hash,
    cast(value as double) / 1e18 as eth_value,
    cast(gas_price as double) / 1e9 as gas_gwei
from ethereum.transactions
```
