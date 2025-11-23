# Common Dune Tables Reference

## Most-Used Spell Tables

### dex.trades
**Purpose**: Aggregated DEX trading activity across protocols
**Partition**: `block_time`, `blockchain`
**Key Columns**: `project`, `taker`, `maker`, `token_bought_address`, `token_sold_address`, `amount_usd`, `tx_hash`
**Use Case**: DEX volume analysis, trader behavior, protocol comparison

### nft.trades
**Purpose**: NFT marketplace transactions
**Partition**: `block_time`, `blockchain`
**Key Columns**: `platform`, `nft_contract_address`, `buyer`, `seller`, `amount_usd`, `token_id`
**Use Case**: NFT collection analytics, marketplace comparison, whale tracking

### prices.usd
**Purpose**: Token price data (historical)
**Partition**: `minute`, `blockchain`
**Key Columns**: `contract_address`, `price`, `minute`, `blockchain`
**Note**: Use deduplication pattern for `prices.usd_latest` (known duplicate issue #8796)

### tokens.transfers
**Purpose**: Token transfer events across chains
**Partition**: `block_time`, `blockchain`
**Key Columns**: `contract_address`, `from_address`, `to_address`, `amount`, `amount_usd`
**Use Case**: Wallet balance tracking, token flows, holder analysis

### labels.addresses
**Purpose**: Address metadata and categorization
**Key Columns**: `address`, `name`, `category`, `blockchain`
**Use Case**: Identifying wallets (exchanges, DAOs, protocols)
**Function**: `labels.get_labels(address)` for inline labeling

### lending.borrow
**Purpose**: DeFi lending and borrowing activity
**Partition**: `block_time`, `blockchain`
**Key Columns**: `project`, `borrower`, `asset_address`, `amount`, `amount_usd`
**Use Case**: Lending protocol analysis, liquidation tracking

## Key Raw/Decoded Tables

### ethereum.transactions
**Partition**: `block_time`
**Key Columns**: `hash`, `from_address`, `to_address`, `value`, `gas_used`, `gas_price`
**Warning**: Large table—ALWAYS include time filter

### ethereum.logs
**Partition**: `block_time`
**Key Columns**: `tx_hash`, `contract_address`, `topic0`, `topic1`, `data`
**Warning**: Extremely large—prefer decoded event tables

### erc20_ethereum.evt_Transfer
**Purpose**: Decoded ERC20 transfer events
**Key Columns**: `contract_address`, `from`, `to`, `value`, `evt_block_time`
**Benefit**: Human-readable vs raw logs parsing

## Table Selection Decision Tree

1. **Need aggregated protocol data?** → Use spell tables (dex.trades, nft.trades, lending.borrow)
2. **Need token-specific data?** → Use decoded tables (erc20_ethereum.evt_Transfer)
3. **Need raw blockchain data?** → Use ethereum.transactions, ethereum.logs (with caution)
4. **Need price data?** → Use prices.usd (deduplicate prices.usd_latest)
5. **Need address context?** → Use labels.addresses or `get_labels()` function
