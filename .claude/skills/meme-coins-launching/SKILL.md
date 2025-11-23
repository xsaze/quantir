---
name: meme-coins-launching
description: This skill should be used when users want to create AI-generated memecoins, including token creation, smart contract deployment, liquidity provision strategies, DEX launching mechanics, community building tactics, marketing automation, and security audit protocols for Solana/Ethereum/BSC platforms. Triggers on keywords memecoin launch, token deployment, pump.fun, DEX liquidity, bonding curve, rug pull prevention, memecoin marketing, community management.
license: MIT
---

# Meme Coins Launching Skill

MUST guide memecoin creation, deployment, liquidity provision, marketing, community building on DEXs with 100% security compliance.

## Purpose

Execute complete memecoin launch workflow from smart contract deployment to community management. Address 97% failure rate through security-first approach: mandatory audits, liquidity locks, anti-bot measures. Platform choice (Solana/Ethereum/BSC) determines costs ($2 vs $200), speed (400ms vs 13s), tooling (pump.fun vs Uniswap).

## When to Use

- Creating new memecoin from concept to launch
- Deploying token smart contracts (ERC20/SPL/BEP20)
- Setting up DEX liquidity pools with bonding curves
- Implementing security measures (audits, locks, anti-bot)
- Planning marketing campaigns and community growth
- Preventing rug pulls and honeypot vulnerabilities
- Choosing between pump.fun, PancakeSwap, Uniswap platforms

## Workflow

### 1. Blockchain Selection

MUST choose EXACTLY one platform with rationale:

| Platform | Standard | Cost | Speed | Use Case |
|----------|----------|------|-------|----------|
| Solana | SPL | $2-3 | 400ms | pump.fun, speed-first, low-cost |
| Ethereum | ERC20 | $50-200 | 13s | Maximum credibility, L2 alternatives |
| BSC | BEP20 | $5-10 | 3s | PancakeSwap, balance cost/credibility |

**Decision Factors:**
- Target audience location (Solana = NA/EU, BSC = Asia)
- Budget constraints (gas fees)
- Launchpad availability (pump.fun = Solana only)
- L2 options (Arbitrum, Base for lower Ethereum costs)

### 2. Tokenomics Configuration

MUST define EXACTLY all parameters:

**Required Fields:**
- Total supply: EXACTLY [number] tokens
- Distribution: Team MAXIMUM 10% | Liquidity MINIMUM 40% | Community 50%
- Burn mechanism: [% per transaction] OR [fixed amount at intervals]
- Transaction fees: Buy [%] | Sell [%] | Transfer [%]
- Max wallet: MAXIMUM [% of supply] to prevent whale manipulation

**Anti-Rug Pull Measures:**
- Top 10 wallets: MAXIMUM 40% combined supply
- Team tokens: MUST vest over MINIMUM 12 months
- Contract ownership: MUST renounce after configuration

### 3. Smart Contract Deployment

MUST use verified approach:

**Option A: No-Code Tools (Recommended for Beginners)**
- pump.fun (Solana): 0.02 SOL fee, bonding curve automated
- FluxBeam (Multi-chain): Template selection, parameter input
- Smithii (Solana): Token creator under 10 minutes
- TokenTool, CoinTool, PinkSale (Various chains)

**Option B: Custom Smart Contract (Advanced)**
- Use OpenZeppelin ERC20 template | Solana Anchor framework
- Implement: Burnable, Pausable, AccessControl modules
- MUST verify on explorer: Etherscan | BscScan | Solscan

**Testing Protocol:**
- MUST simulate MINIMUM 3 scenarios on testnet
- Test: transfers, burns, fee collection, ownership renouncement
- NEVER deploy to mainnet without complete testnet validation

### 4. Security Audit

MANDATORY before mainnet deployment. NEVER skip.

**Audit Options:**

| Provider | Cost | Duration | Focus |
|----------|------|----------|-------|
| CertiK SkyKnight MemeScan | $500-1K | 1-2 days | Solana memecoins, one-click |
| Hacken | $5K-15K | 1-2 weeks | Full audit, all chains |
| SlowMist | $3K-10K | 1 week | Security-focused |

**Required Checks:**
- ✅ Zero backdoors allowing mint/withdraw
- ✅ Zero honeypot logic (sell restrictions)
- ✅ Zero unlimited mint capabilities
- ✅ Zero hidden ownership functions
- ✅ Proper access control implementation
- ✅ Reentrancy protection
- ✅ Integer overflow safeguards

**Vulnerability Scan Results:**
- Critical issues: MUST fix BEFORE deployment (zero tolerance)
- High severity: MUST fix within 48 hours
- Medium/Low: Document mitigation plan

### 5. Bonding Curve & Pricing

MUST implement dynamic pricing model:

**Bonding Curve Formula:**
```
P = f(S) where:
P = token price
S = circulating supply
f = curve function (linear, quadratic, logarithmic)
```

**pump.fun Specific:**
- Initial supply: EXACTLY 800M tokens on bonding curve
- Graduation threshold: EXACTLY $69,000 market cap
- Raydium migration: Automatic with $12K liquidity injection
- LP token burn: Automatic (permanent liquidity)

**Custom AMM Setup:**
- Constant product: x × y = k (Uniswap/PancakeSwap)
- Concentrated liquidity: V3 with custom price ranges
- Fee tiers: 0.25% (V2) | 0.01%-1% (V3 custom)

### 6. Liquidity Provision

MUST provide sufficient liquidity with security measures:

**Liquidity Requirements:**
- Amount: MINIMUM $400K for serious projects | $50K minimum viable
- Pairing: Stablecoin (USDT/USDC) | Major crypto (ETH/BNB/SOL)
- Ratio: EXACTLY 1:1 value at launch (prevents instant arbitrage)
- Lock duration: MINIMUM 365 days via reputable escrow
- LP token burn: MUST burn to prevent rug pull

**Lock Providers:**
- Team.Finance (Multi-chain)
- Unicrypt (Ethereum/BSC)
- Meteora (Solana permanent locks)
- PinkLock (BSC-focused)

**Liquidity Pool Creation Steps:**
1. Connect wallet to DEX
2. Select token pair (MEMECOIN/USDT)
3. Input amounts (equal value both sides)
4. Choose fee tier (0.25% recommended)
5. Approve token spending
6. Add liquidity → Receive LP tokens
7. Lock LP tokens IMMEDIATELY (365+ days)
8. Verify lock on explorer + share proof

### 7. Marketing & Community Building

MUST establish multi-platform presence BEFORE launch:

**Pre-Launch (2-4 weeks before):**
- Twitter/X: MINIMUM 1000 followers, daily meme posts
- Telegram: Setup group with clear rules, pinned token info
- Discord: Channels for announcements, memes, trading discussion
- Website: Single-page with tokenomics, roadmap, team
- Whitepaper: 2-5 pages explaining concept, use case, distribution

**Launch Day Strategy:**
- Coordinated announcements across all platforms
- Influencer partnerships: MINIMUM 3 micro-influencers (10K-50K followers)
- Twitter Spaces: Live AMA during launch
- Trending tactics: Coordinated hashtag usage, engagement pods
- First 100 buyers: Special role/benefits to incentivize early adoption

**Post-Launch Growth:**
- Daily content: Memes, updates, community highlights
- Weekly AMAs: Voice chat sessions for transparency
- Airdrop campaigns: Reward holders, attract new users
- Contest series: Meme contests, trading competitions
- Partnerships: Collaborate with other memecoin communities

**Community Management:**
- Moderators: MINIMUM 2 per platform for 24/7 coverage
- Response time: MAXIMUM 1 hour for inquiries
- FUD management: Address concerns transparently, provide evidence
- Scam protection: Ban impersonators, warn about fake accounts
- Engagement rate target: MINIMUM 5% (comments/likes per post)

### 8. Monitoring & Analytics

MUST setup real-time tracking:

**Essential Dashboards:**

| Tool | Purpose | Metrics | Refresh |
|------|---------|---------|---------|
| DexTools | Price, volume, holders | Live charts, transactions | 5 min |
| DEX Screener | Multi-DEX aggregation | Liquidity, market cap | 1 min |
| Dune Analytics | On-chain analysis | Wallet behavior, flows | Custom |
| CoinMarketCap | Visibility | Price, rankings | 15 min |
| CoinGecko | Listing credibility | Volume, social | 10 min |

**Alert Setup:**
- Large transactions: >1% supply movement
- Liquidity changes: >10% pool reduction
- Wallet concentration: Top holder exceeds 5%
- Social sentiment: Negative spike detection
- Trading volume: 50% drops signal issues

**Key Performance Indicators:**
- Holder count growth: Target 10% weekly increase
- Trading volume: MINIMUM $50K daily for listing eligibility
- Liquidity depth: MUST maintain >$100K locked
- Social engagement: 500+ interactions per day
- Price stability: Volatility <20% daily (after initial pump)

### 9. Risk Disclosure & Compliance

MUST communicate transparently:

**Mandatory Warnings:**
- 97% memecoin failure rate (cite source)
- High volatility: 50-90% swings possible within hours
- No guaranteed returns or financial advice
- Invest ONLY disposable capital you can afford to lose
- DYOR: Do Your Own Research before investing
- Regulatory uncertainty: Compliance varies by jurisdiction

**Rug Pull Indicators (Educate Community):**
- ❌ Unlocked liquidity or no LP burn proof
- ❌ Anonymous team with no verification
- ❌ No smart contract audit or verification
- ❌ Unrealistic promises ("guaranteed 100x")
- ❌ Inability to sell (honeypot contract)
- ❌ Single wallet holding >10% supply
- ❌ Unverified contract source code
- ❌ Recent contract deployment with instant hype

**Protection Measures:**
- Check contract on audit platforms before buying
- Verify liquidity lock on explorer
- Review holder distribution (avoid concentration)
- Start with small test purchase
- Use stop-loss orders where available
- Never invest based on FOMO alone

### 10. Platform-Specific Deployment Guides

#### pump.fun (Solana)

**Requirements:**
- Phantom/Solflare wallet with MINIMUM 0.1 SOL
- Token metadata: name, symbol, image (PNG/JPG <100KB)
- Description: 280 characters explaining concept

**Deployment Steps:**
1. Visit pump.fun → "Start a new coin"
2. Fill metadata: Name (e.g., "DoggoCoin"), Symbol (e.g., "DOGGO")
3. Upload image (meme-worthy, recognizable)
4. Write description (catchy, viral potential)
5. Click "Create coin" (costs ~0.02 SOL)
6. Token live immediately on bonding curve
7. Buy initial tokens to seed liquidity
8. Share CA (Contract Address) on social media
9. Monitor for $69K market cap graduation
10. Automatic Raydium listing when threshold reached

**Key Mechanics:**
- Fair launch: No presale, everyone buys from curve
- Graduation: $69K cap → $12K Raydium liquidity + LP burn
- Creator reward: 0.5 SOL when token graduates
- Platform fee: 1% on transactions

#### PancakeSwap (BSC)

**Requirements:**
- MetaMask with MINIMUM 5 BNB
- Verified BEP20 contract on BscScan
- Token balance for liquidity provision

**Deployment Steps:**
1. Deploy BEP20 contract via Remix IDE | no-code tool
2. Verify source code on BscScan (enables trust)
3. Visit PancakeSwap Liquidity page
4. Click "Add Liquidity"
5. Select token pair: MEMECOIN + BNB | BUSD
6. Input amounts (equal value, e.g., 1M tokens + $50K BNB)
7. Choose fee tier: 0.25% (V2) or custom (V3)
8. Approve token spending (2 transactions)
9. Add liquidity → Receive LP tokens
10. Lock LP tokens IMMEDIATELY via PinkLock | Team.Finance

**Critical Notes:**
- MUST apply for CoinMarketCap/CoinGecko listing separately
- Minimum liquidity: $50K for basic listing eligibility
- Security: Anti-snipe bot configuration recommended
- V3 advantage: Concentrated liquidity, capital efficiency

#### Uniswap (Ethereum)

**Requirements:**
- MetaMask with MINIMUM 1 ETH (gas fees)
- Verified ERC20 contract on Etherscan
- Consider L2 alternatives (Arbitrum/Base) for 90% cost reduction

**Deployment Steps:**
1. Deploy ERC20 via OpenZeppelin Wizard | Remix
2. Verify on Etherscan with exact compiler settings
3. Visit Uniswap interface → Pools
4. Click "New Position" (V3) or "Add Liquidity" (V2)
5. Select token pair: MEMECOIN + ETH | USDC
6. V3: Choose price range (full range for max liquidity)
7. Input liquidity amounts (equal value)
8. Set fee tier: 0.3% (standard) | 1% (exotic pairs)
9. Approve + Add liquidity (2 separate gas fees)
10. NFT position (V3) or LP tokens (V2)
11. Lock via Unicrypt or similar service

**L2 Deployment (Arbitrum/Base):**
- Same process, 90% lower gas fees
- Bridge ETH to L2 first via official bridge
- Growing ecosystem, less competition
- Trade-off: Lower initial liquidity depth

## Constraints

- Security audit: MANDATORY before mainnet (NEVER skip)
- Liquidity lock: MINIMUM 365 days with proof
- Testnet simulation: MINIMUM 3 complete scenarios
- Pre-launch community: MINIMUM 1000 engaged members
- Marketing budget: MINIMUM $5K for credible launch
- Team allocation: MAXIMUM 10% with 12-month vesting
- Wallet concentration: Top 10 holders MAXIMUM 40% combined
- NEVER promise guaranteed returns or provide financial advice
- NEVER deploy without verified smart contract on explorer
- NEVER skip disclosure of 97% failure rate and risks
- NEVER manipulate price through wash trading or pump schemes
- NEVER use audit completion as sole security validation

## Output Format

MUST provide complete launch checklist with EXACTLY 10 sections:

1. **Blockchain Selection:** Platform + rationale (cost/speed/ecosystem fit)
2. **Tokenomics:** Supply, distribution table, burn/fee mechanisms
3. **Smart Contract:** Deployment method + testnet results (3 scenarios)
4. **Security Audit:** Provider + report summary + fixes implemented
5. **Bonding Curve:** Formula + parameters + graduation threshold
6. **Liquidity Provision:** Amount + pairing + lock proof + escrow details
7. **Marketing Campaign:** Pre-launch timeline + platform strategy + influencers
8. **Community Management:** Platforms + moderator plan + engagement tactics
9. **Monitoring Setup:** Dashboard links + KPI targets + alert configuration
10. **Risk Disclosure:** Failure rate + volatility warning + rug pull indicators

Each section MUST include exact parameters (not ranges), platform-specific instructions, and security verification steps.

## Bundled Resources

Reference `references/platform-comparison.md` for detailed DEX feature matrix.
Reference `references/security-checklist.md` for complete audit verification process.
Reference `references/marketing-templates.md` for campaign schedules and content examples.

## Success Criteria

- Contract deployed with 100% security audit pass rate
- Liquidity EXACTLY locked for MINIMUM 365 days with public proof
- Community engagement MINIMUM 1000 members across platforms
- Marketing reach MINIMUM 10K impressions within 48 hours launch
- Monitoring dashboard operational with 5-minute refresh cycle
- Zero critical vulnerabilities in final security audit
- Holder distribution: Top wallet MAXIMUM 5% supply