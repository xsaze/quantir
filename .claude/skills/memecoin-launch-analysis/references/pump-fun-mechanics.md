# Pump.fun Platform Mechanics

## Bonding Curve Model

**Core Mechanism:**
- Mathematical function automatically adjusts token prices based on supply/demand
- Price increases with purchases, decreases with sales
- Rewards earliest buyers with lowest prices

**Pricing Function:**
```
y = 1073000191 - 32190005730/(30+x)
```
- x = SOL amount purchased
- y = corresponding tokens obtained

**Token Specifications:**
- Total Supply: 1 billion tokens (ALL launches)
- Precision: 9 decimal places
- Bonding Curve Allocation: 800M tokens
- Standard: Solana SPL contract

## Token Creation Cost

**Current Model (Post-August 2024):**
- Creator Cost: FREE
- First Buyer Pays: ~$2 worth SOL for token creation
- Transaction Fee: ~0.02 SOL for gas
- Creator Incentive: 0.5 SOL (~$80) upon bonding curve completion

**Previous Model (Pre-August 2024):**
- Creator Fee: 0.02 SOL ($3)

## Graduation Mechanics

**Bonding Curve Completion:**
- Threshold: $69,000 market cap
- Liquidity Injection: $12,000 deposited to Raydium DEX
- SOL Required: 84-86 SOL (varies slightly)
- Liquidity Pool: Automatically created and burned

**Post-March 2025 Update:**
- Graduation Destination: PumpSwap (replaces Raydium)
- New Threshold: ~$75,000 market cap
- Liquidity Injection: $17,000 worth

## Success Rates

**Graduation Statistics:**
- Success Rate: 1.4% (98.6% fail to graduate)
- Daily Launches: 20,000+ tokens
- Daily Graduations: 100-200 tokens
- Inactive Pools: 74.6% of graduated tokens
- Locked SOL: 1.38M SOL ($287M+) in inactive pools

**Failure Patterns:**
- 98.6% tokens never complete bonding curve
- Majority fall under $1,000 liquidity
- Most become essentially worthless

## Fair Launch Principles

**Anti-Rug Pull Protections:**
1. No presales or team allocations
2. All tokens distributed evenly among participants
3. No ability to withdraw liquidity (bonding curve controlled)
4. Automatic liquidity provision on graduation
5. Liquidity pools burned (cannot be removed)

**Limitations:**
- Cannot prevent "soft rugs" (hype then abandonment)
- Large holders can dump after graduation
- No protection against coordinated exit strategies

## Revenue Model

**Platform Fees:**
- Trading fees on bonding curve transactions
- Peak Daily Revenue: $14M (January 2025)
- Total Revenue: $50M+ by July 2024

## Technical Setup

**Prerequisites:**
- Solana wallet (Phantom, Solflare)
- Minimum SOL for gas fees (~0.02 SOL)

**Launch Process:**
1. Connect Solana wallet
2. Enter token name
3. Upload image
4. Pay gas fee (first buyer covers creation cost)
5. Token instantly live on bonding curve

**No Technical Skills Required:**
- No coding knowledge needed
- No smart contract deployment
- No liquidity pool setup
- Platform handles all technical complexity

## Bonding Curve Strategy

**Early Buyer Advantages:**
- Lowest prices at curve start
- Exponential gains if token graduates
- First 10-30% holdings recommended for creators

**Price Floor Tactics:**
- Strategic initial purchases establish baseline
- Coordinated team/friend buys create momentum
- Timing intervals between purchases optimize perception

## Migration Monitoring

**Analytics Available:**
- Real-time bonding curve progress
- Migration events to Raydium/PumpSwap
- Holder distribution tracking
- Volume and transaction monitoring

**Tools:**
- Blockworks Analytics
- DappRadar
- Dune Analytics dashboards
- Flipside Crypto
- Apify token scrapers
- PumpFun Sniper
