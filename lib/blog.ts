import fs from "fs";
import path from "path";

export type Article = {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  author: string;
  date: string;
  readTime: string;
  category: string;
  originalUrl?: string;
  trend?: "up" | "down" | null;
  featured?: boolean;
};

// Function to read markdown content (currently unused but kept for future use)
function readMarkdownFile(filename: string): string {
  try {
    const filePath = path.join(process.cwd(), "data", filename);
    if (!fs.existsSync(filePath)) return "";
    const content = fs.readFileSync(filePath, "utf-8");
    return content;
  } catch (err) {
    console.error(`Failed to read ${filename}`, err);
    return "";
  }
}

export const articles: Article[] = [
  {
    id: "1",
    title: "Understanding the Nigerian Foreign Exchange Market: A Comprehensive Guide for 2025",
    excerpt:
      "Navigate Nigeria's complex FX landscape with our complete guide covering official rates, parallel markets, CBN policies, and practical strategies for businesses and individuals.",
    content: `The Nigerian foreign exchange market is one of the most dynamic and complex in Africa, characterized by multiple exchange rate windows, significant spreads between official and parallel market rates, and frequent policy changes. Understanding this landscape is crucial for businesses, investors, and individuals looking to navigate Nigeria's economy effectively.

## The Structure of Nigeria's FX Market

Nigeria operates a managed float exchange rate system, where the Central Bank of Nigeria (CBN) plays a significant role in determining the naira's value. However, the reality is more nuanced, with several distinct markets operating simultaneously:

### 1. The Official Market (I&E Window)

The Investors and Exporters (I&E) Window, established in 2017, serves as the primary official market for FX transactions. This window was designed to improve price discovery and increase liquidity in the Nigerian FX market. Rates here are determined by market forces but with CBN intervention when deemed necessary.

The I&E Window handles transactions for:
- Invisible transactions (business travel, medical expenses, school fees)
- Capital transactions (loan repayments, dividends, capital repatriation)
- Import and export proceeds
- Portfolio investments

### 2. The Parallel Market (Black Market)

The parallel market, often called the black market, operates outside official channels and typically offers rates 5-15% higher than official rates. This market exists due to:
- Limited FX availability in official channels
- Bureaucratic hurdles in accessing official FX
- Faster transaction processing
- No documentation requirements for small amounts

While technically illegal, the parallel market is widely used and serves as a price discovery mechanism, often reflecting true market sentiment better than official rates.

### 3. The Bureau de Change (BDC) Market

Licensed BDCs serve as intermediaries, particularly for retail FX transactions. The CBN periodically supplies dollars to BDCs to serve as a buffer and help stabilize rates. However, BDC rates typically track closer to parallel market rates than official rates.

## Key Factors Influencing Exchange Rates

### Oil Prices and Production

As Nigeria's primary export and source of foreign exchange, oil prices directly impact the naira's strength. When oil prices rise, Nigeria earns more dollars, increasing FX supply and potentially strengthening the naira. Conversely, falling oil prices or production disruptions can weaken the currency significantly.

### CBN Monetary Policy

The Central Bank's decisions on interest rates, reserve requirements, and direct market interventions significantly impact exchange rates. Recent policies have included:
- Restrictions on access to official FX for certain imports
- Limits on cash withdrawals to encourage digital transactions
- Periodic devaluations to align official rates with market realities
- Introduction of the RT200 program to boost non-oil exports

### Inflation Differentials

Nigeria's inflation rate, consistently in double digits, erodes the naira's purchasing power. When domestic inflation significantly exceeds that of trading partners, the naira tends to depreciate to maintain purchasing power parity.

### Foreign Portfolio Investment

Capital flows from foreign investors seeking returns in Nigerian assets can strengthen the naira. However, these flows are volatile and can reverse quickly during global risk-off periods or when domestic conditions deteriorate.

### Remittances

Diaspora remittances constitute a significant source of FX inflows, often exceeding $20 billion annually. The CBN has implemented various incentives to channel more remittances through official channels.

## Practical Strategies for Managing FX Risk

### For Businesses

1. **Natural Hedging**: Match foreign currency revenues with foreign currency expenses where possible
2. **Forward Contracts**: Lock in rates for future transactions (though limited availability in Nigeria)
3. **Diversification**: Maintain accounts in multiple currencies
4. **Local Sourcing**: Reduce import dependence by sourcing locally when feasible
5. **Dynamic Pricing**: Implement pricing mechanisms that adjust for exchange rate movements

### For Individuals

1. **Dollar Savings**: Maintain a portion of savings in stable foreign currencies
2. **Timing**: Monitor rate trends and time large transactions strategically
3. **Multiple Channels**: Compare rates across official and parallel markets
4. **Digital Platforms**: Use licensed digital platforms for better rates and convenience
5. **Documentation**: Keep proper records for official transactions to avoid issues

## Recent Developments and Future Outlook

The CBN has been gradually moving toward a more market-determined exchange rate system. Recent reforms include:
- Unification of multiple exchange rate windows
- Increased transparency in FX allocation
- Removal of the 43 items banned from accessing official FX
- Introduction of the willing buyer-willing seller model

However, challenges remain:
- Limited FX reserves relative to import demand
- Structural economic issues requiring diversification from oil
- Need for improved export competitiveness
- Addressing the parallel market premium

## Conclusion

Understanding Nigeria's FX market requires recognizing its complexity and staying informed about policy changes. Whether you're a business owner, investor, or individual, success in this environment demands:
- Continuous monitoring of multiple rate sources
- Understanding of CBN policy directions
- Flexibility in transaction timing and channels
- Risk management strategies appropriate to your exposure
- Compliance with regulations while optimizing costs

The Nigerian FX market will likely remain dynamic, with ongoing reforms aimed at achieving greater stability and transparency. Staying informed and adaptable is key to navigating this challenging but opportunity-rich environment.`,
    author: "NairaMet Research Team",
    date: "2024-12-15",
    readTime: "12 min read",
    category: "Education",
    trend: null,
    featured: true,
  },
  {
    id: "2",
    title: "The Complete Guide to Black Market Exchange Rates in Nigeria",
    excerpt:
      "Everything you need to know about parallel market rates: how they're determined, why they exist, legal considerations, and how to navigate this unofficial but widely-used market.",
    content: `The parallel market, commonly known as the black market, is an integral part of Nigeria's foreign exchange ecosystem. Despite its unofficial status, it processes billions of dollars in transactions annually and serves as a critical price discovery mechanism. This comprehensive guide explains everything you need to know about black market exchange rates.

## What is the Black Market?

The black market refers to the unofficial foreign exchange market where currencies are traded outside the regulatory framework of the Central Bank of Nigeria (CBN). It operates through a network of street traders, bureau de change operators, and informal channels.

### Why Does the Black Market Exist?

Several factors contribute to the persistence of Nigeria's parallel FX market:

1. **Limited Official FX Supply**: Demand for foreign currency consistently exceeds supply in official channels, creating a gap that the black market fills.

2. **Bureaucratic Hurdles**: Accessing official FX often requires extensive documentation, bank relationships, and waiting periods that many find prohibitive.

3. **Restrictions on Certain Transactions**: The CBN periodically restricts official FX access for certain imports or purposes, pushing these transactions to the parallel market.

4. **Speed and Convenience**: Black market transactions can be completed in minutes without paperwork, making them attractive for urgent needs.

5. **Anonymity**: Some users prefer the privacy of parallel market transactions, though this can facilitate illicit activities.

## How Black Market Rates Are Determined

Unlike official rates influenced by CBN policy, black market rates are purely market-driven, responding to:

### Supply Factors
- Diaspora remittances channeled through informal means
- Export proceeds not repatriated through official channels
- Foreign currency brought in by travelers
- Liquidation of foreign assets by Nigerians abroad

### Demand Factors
- Import payments for goods not eligible for official FX
- School fees and medical expenses abroad
- Business travel and personal trips
- Capital flight during economic uncertainty
- Speculative demand when devaluation is anticipated

### The Rate-Setting Process

Black market rates are determined through a decentralized network:

1. **Major Dealers**: Large operators in Lagos, Abuja, and Port Harcourt set benchmark rates based on their supply-demand balance.

2. **Information Flow**: Rates spread quickly through WhatsApp groups, phone calls, and word of mouth.

3. **Regional Variations**: Rates can vary by 1-3% between cities and even neighborhoods based on local supply-demand dynamics.

4. **Time of Day**: Rates often fluctuate during the trading day, typically firming in the morning and softening in the afternoon.

## The Spread: Official vs. Black Market

The premium of black market rates over official rates varies significantly:

### Typical Spread Ranges
- **Stable Periods**: 5-10% premium
- **Moderate Uncertainty**: 10-20% premium
- **Crisis Periods**: 20-40% premium or more

### Factors Affecting the Spread

**Narrowing Factors:**
- CBN dollar sales to BDCs
- Increased oil revenues
- Large diaspora remittance inflows
- Positive economic news
- CBN devaluation of official rate

**Widening Factors:**
- Reduced CBN FX interventions
- Falling oil prices
- Political uncertainty
- Anticipated devaluation
- Capital controls tightening

## Legal Considerations

### The Legal Status

Trading in the parallel market exists in a gray area:
- Not explicitly illegal for individuals in small amounts
- Illegal for businesses to use for commercial transactions
- Licensed BDCs can operate but must follow CBN guidelines
- Large-scale unlicensed dealing is prosecutable

### Risks and Consequences

**For Individuals:**
- Generally low risk for small personal transactions
- Potential issues if caught with large amounts of foreign currency
- No legal recourse if cheated in a transaction

**For Businesses:**
- Cannot claim parallel market expenses for tax purposes
- Risk of prosecution for large-scale unofficial FX sourcing
- Potential banking relationship issues if discovered
- Audit complications

## How to Navigate the Black Market Safely

### Finding Reliable Dealers

1. **Referrals**: Use dealers recommended by trusted contacts
2. **Established Locations**: Stick to known trading areas rather than random street dealers
3. **Test Transactions**: Start with small amounts before larger deals
4. **Verification**: Always verify currency authenticity immediately

### Safety Precautions

1. **Public Locations**: Conduct transactions in busy, public areas
2. **Daylight Hours**: Avoid late evening or night transactions
3. **Bring Company**: Have someone accompany you for large amounts
4. **Count Carefully**: Verify amounts before leaving
5. **Avoid Flashing Cash**: Be discreet about carrying large sums

### Red Flags to Watch For

- Rates significantly better than market average (likely a scam)
- Pressure to transact quickly without verification
- Requests to move to secluded locations
- Dealers unwilling to let you verify currency
- Suspicious-looking or feeling notes

## Alternatives to the Black Market

### Official Channels
- **Banks**: For documented transactions, though often with delays
- **Licensed BDCs**: Slightly higher rates than banks but more accessible
- **Digital Platforms**: Emerging fintech solutions offering competitive rates

### Hybrid Approaches
- **Domiciliary Accounts**: Maintain foreign currency accounts legally
- **Crypto**: Some use cryptocurrency as an intermediary (though risky)
- **Hawala Networks**: Informal value transfer systems used by some communities

## Impact on the Economy

### Negative Effects
- Reduces CBN's ability to manage monetary policy
- Facilitates capital flight and tax evasion
- Creates uncertainty for businesses planning
- Complicates economic data and forecasting

### Positive Functions
- Provides FX access when official channels fail
- Serves as a pressure valve for excess demand
- Offers price discovery reflecting true market sentiment
- Enables economic activity that would otherwise be impossible

## The Future of the Black Market

Several trends may affect the parallel market's role:

### Potential Reduction Factors
- CBN's move toward more market-determined rates
- Increased official FX supply from reforms
- Digital payment systems reducing cash transactions
- Improved official channel efficiency

### Persistence Factors
- Deep-rooted in Nigerian commerce
- Structural FX supply-demand imbalances
- Trust issues with official institutions
- Convenience and speed advantages

## Conclusion

The black market is a reality of Nigeria's FX landscape that's unlikely to disappear soon. Understanding how it works, its risks and benefits, and how to navigate it safely is essential for anyone dealing with foreign currency in Nigeria.

While the long-term goal should be a unified, efficient official market that makes the parallel market unnecessary, in the meantime, informed participation with appropriate caution is often a practical necessity.

Key takeaways:
- The black market exists due to structural FX supply-demand imbalances
- Rates are purely market-driven and can be volatile
- Legal risks exist but are generally low for small personal transactions
- Safety and verification are crucial when transacting
- Monitor both official and parallel rates for the complete picture
- The market serves important economic functions despite its unofficial status

Stay informed, stay safe, and always prioritize legal channels when possible.`,
    author: "NairaMet Analysis Team",
    date: "2024-12-12",
    readTime: "15 min read",
    category: "Education",
    trend: null,
    featured: true,
  },

function readScraped() {
  try {
    const dataPath = path.join(process.cwd(), "data", "scraped.json");
    if (!fs.existsSync(dataPath)) return [];
    const raw = fs.readFileSync(dataPath, "utf-8");
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : parsed.articles || [];
  } catch (err) {
    console.error("Failed to read scraped.json", err);
    return [];
  }
}

export function getArticles() {
  const scraped = readScraped();

  const mapped = (scraped || []).map((s: any) => ({
    id: `scraped:${encodeURIComponent(s.url)}`,
    title: decodeEntities(s.title || "(no title)"),
    excerpt: decodeEntities(s.excerpt || s.content || ""),
    content: decodeEntities(s.content || ""),
    author: decodeEntities(s.source || "Wire"),
    originalUrl: s.url,
    date: s.date || new Date().toISOString(),
    readTime: "1 min read",
    category: s.source || "Wire",
    trend: null,
    featured: false,
  })) as Article[];

  // combine and sort by date desc
  const combined = [...articles, ...mapped];
  combined.sort((a, b) => {
    const da = Date.parse(a.date) || 0;
    const db = Date.parse(b.date) || 0;
    return db - da;
  });

  return combined;
}

export function getArticleById(id: string) {
  const all = getArticles();

  // Try exact match first
  let found = all.find((a) => a.id === id);
  if (found) return found;

  // Try decoding the incoming id (handles percent-encoded segments)
  try {
    const decoded = decodeURIComponent(id);
    found = all.find((a) => a.id === decoded);
    if (found) return found;
    
    // Also try double-decoded for cases where it was encoded twice
    const doubleDecoded = decodeURIComponent(decoded);
    found = all.find((a) => a.id === doubleDecoded);
    if (found) return found;
  } catch {}

  // If id looks like 'scraped:<encodedUrl>' try decoding the part after the colon
  if (id.startsWith("scraped:") || id.includes("scraped%3A")) {
    try {
      // Handle both encoded and non-encoded "scraped:" prefix
      const normalized = id.replace(/scraped%3A/i, "scraped:");
      const part = normalized.slice("scraped:".length);
      
      // Try the part as-is
      found = all.find((a) => a.id === `scraped:${part}`);
      if (found) return found;
      
      // Try decoding the part
      const decodedPart = decodeURIComponent(part);
      found = all.find((a) => a.id === `scraped:${decodedPart}`);
      if (found) return found;
      
      // Try re-encoding the decoded part (in case it needs to match the stored format)
      const reencoded = `scraped:${encodeURIComponent(decodedPart)}`;
      found = all.find((a) => a.id === reencoded);
      if (found) return found;
    } catch {}
  }

  // As a last resort try matching by originalUrl
  try {
    const maybeUrl = decodeURIComponent(id);
    found = all.find(
      (a) =>
        (a as any).originalUrl === maybeUrl ||
        a.id === `scraped:${encodeURIComponent(maybeUrl)}`
    );
    if (found) return found;
  } catch {}

  return null;
}

function decodeEntities(str: string = ""): string {
  const map: Record<string, string> = {
    "&nbsp;": " ",
    "&amp;": "&",
    "&quot;": '"',
    "&apos;": "'",
    "&#39;": "'",
    "&lt;": "<",
    "&gt;": ">",
    "&ndash;": "–",
    "&mdash;": "—",
    "&ldquo;": "“",
    "&rdquo;": "”",
    "&lsquo;": "‘",
    "&rsquo;": "’",
    "&hellip;": "…",
  };
  let s = str
    .replace(/&#(\d+);/g, (_, num) => String.fromCharCode(parseInt(num, 10)))
    .replace(/&#x([0-9a-fA-F]+);/g, (_, hex) =>
      String.fromCharCode(parseInt(hex, 16))
    )
    .replace(/&[a-zA-Z]+;|&#\d+;|&#x[0-9a-fA-F]+;/g, (entity) => map[entity] ?? entity);
  s = s.replace(/\s+/g, " ").trim();
  return s;
}

  {
    id: "3",
    title: "CBN Monetary Policy and Its Impact on Exchange Rates: A Deep Dive",
    excerpt:
      "Explore how Central Bank of Nigeria's monetary policy decisions affect the naira's value, from interest rates to reserve requirements and direct market interventions.",
    content: `The Central Bank of Nigeria (CBN) wields significant influence over the naira's exchange rate through various monetary policy tools. Understanding these mechanisms is crucial for anyone involved in Nigeria's economy, from businesses planning investments to individuals managing personal finances.

## The CBN's Mandate and Exchange Rate Objectives

The CBN Act of 2007 mandates the bank to:
- Maintain price stability
- Issue legal tender currency
- Maintain external reserves to safeguard the international value of the naira
- Promote a sound financial system
- Act as banker and financial adviser to the Federal Government

While the CBN officially operates a managed float system, in practice, it actively manages the exchange rate to achieve multiple, sometimes conflicting, objectives:

### Primary Objectives
1. **Exchange Rate Stability**: Minimize volatility to support economic planning
2. **Inflation Control**: Prevent imported inflation from currency depreciation
3. **Reserve Preservation**: Maintain adequate foreign reserves
4. **Economic Growth**: Support export competitiveness and domestic production

## Key Monetary Policy Tools Affecting Exchange Rates

### 1. Interest Rate Policy

The Monetary Policy Rate (MPR) is the CBN's benchmark interest rate, currently one of the highest in Africa at around 18-19%.

**How It Affects Exchange Rates:**
- **Higher Rates**: Attract foreign portfolio investment, increasing FX supply and potentially strengthening the naira
- **Lower Rates**: May lead to capital outflows, reducing FX supply and weakening the naira

**Recent Trends:**
The CBN has maintained relatively high rates to:
- Combat persistent inflation (often above 20%)
- Attract foreign investment
- Discourage speculative attacks on the naira
- Support the currency amid oil price volatility

**Trade-offs:**
- High rates support the currency but may slow economic growth
- They increase government borrowing costs
- Can crowd out private sector credit

### 2. Reserve Requirements

The CBN mandates that banks hold a percentage of deposits as reserves, affecting liquidity and lending capacity.

**Cash Reserve Ratio (CRR):**
- Currently around 32.5% for deposit money banks
- One of the highest in the world
- Reduces money supply and inflationary pressure
- Limits banks' ability to create credit

**Impact on Exchange Rates:**
- Higher CRR reduces naira liquidity, potentially supporting the currency
- Can reduce speculative demand for dollars
- May slow economic activity, affecting FX demand

### 3. Open Market Operations (OMO)

The CBN buys and sells government securities to manage liquidity.

**OMO Bills:**
- Used to mop up excess naira liquidity
- Attractive yields (often 10-15%) compete with dollar assets
- Restricted to banks and institutional investors since 2019
- Helps manage inflation and exchange rate pressure

**Effectiveness:**
- Successfully reduced excess liquidity in the banking system
- Supported naira stability during volatile periods
- Created controversy when retail investors were excluded

### 4. Direct FX Market Interventions

The CBN directly supplies dollars to the market through various channels:

**Intervention Methods:**
- Sales to banks through the I&E Window
- Allocations to Bureau de Change operators
- Special windows for specific sectors (manufacturing, agriculture, etc.)
- Retail and wholesale Dutch auction systems (historical)

**Recent Intervention Patterns:**
- Reduced interventions as reserves declined
- More targeted support for critical sectors
- Shift toward market-determined rates
- Periodic large injections to stabilize rates

### 5. Capital Controls and Restrictions

The CBN has implemented various controls to manage FX demand:

**Historical Measures:**
- Ban on 43 items from accessing official FX (later removed)
- Limits on cash withdrawals to encourage digital transactions
- Restrictions on domiciliary account operations
- Limits on international money transfer operators

**Current Approach:**
- Gradual liberalization of restrictions
- Focus on transparency and market mechanisms
- Removal of most import restrictions
- Encouragement of non-oil exports

## Recent Policy Shifts and Their Impact

### The Unification Agenda

In 2023-2024, the CBN embarked on significant reforms:

**Key Changes:**
1. **Multiple Rate Windows Collapsed**: Moving toward a single, market-determined rate
2. **I&E Window Liberalization**: Allowing more market-driven price discovery
3. **Removal of Import Restrictions**: Eliminating the 43-item ban
4. **Increased Transparency**: Better communication of FX allocation processes

**Results:**
- Initial sharp devaluation as rates converged
- Reduced parallel market premium
- Improved FX availability for legitimate transactions
- Increased volatility during transition

### The RT200 Program

Launched to boost non-oil exports and FX earnings:

**Components:**
- Rebates for exporters
- Simplified export procedures
- FX retention incentives
- Support for export-oriented industries

**Impact:**
- Modest increase in non-oil export FX
- Long-term potential but slow initial uptake
- Structural challenges remain

## Challenges Facing CBN Policy

### 1. Limited Policy Independence

**Fiscal Dominance:**
- Government borrowing from CBN (Ways and Means)
- Pressure to maintain exchange rate for political reasons
- Conflicting objectives between growth and stability

**Solutions Needed:**
- Greater CBN independence
- Fiscal discipline
- Reduced monetary financing of deficits

### 2. Structural Economic Issues

**Oil Dependency:**
- 80-90% of FX earnings from oil
- Vulnerability to global oil price shocks
- Limited diversification progress

**Import Dependence:**
- High import content in consumption and production
- Weak domestic manufacturing base
- Persistent trade deficits

### 3. Credibility and Communication

**Trust Deficit:**
- History of sudden policy reversals
- Lack of clear forward guidance
- Multiple exchange rate windows created confusion

**Improvements:**
- More consistent policy messaging
- Regular communication with stakeholders
- Predictable intervention patterns

## Impact on Different Economic Actors

### For Businesses

**Manufacturing:**
- High interest rates increase working capital costs
- FX restrictions affect raw material imports
- Need for hedging strategies

**Importers:**
- Rate volatility complicates pricing
- Access to official FX remains challenging
- Must navigate multiple channels

**Exporters:**
- Benefit from naira depreciation
- RT200 incentives provide some support
- Repatriation requirements can be burdensome

### For Individuals

**Savers:**
- High interest rates offer attractive naira returns
- But inflation often exceeds deposit rates
- Dollar savings face access restrictions

**Borrowers:**
- High MPR translates to expensive loans
- Mortgage and consumer credit remain limited
- SME financing particularly affected

**Diaspora:**
- Remittance incentives encourage official channels
- Rate differences affect transfer decisions
- Multiple channels available

## Future Policy Directions

### Likely Trends

1. **Continued Liberalization**: Gradual move toward market-determined rates
2. **Reduced Interventions**: As reserves allow and market deepens
3. **Digital Currency**: eNaira adoption may affect FX dynamics
4. **Regional Integration**: AfCFTA may influence policy approaches

### Key Uncertainties

- Oil price trajectory and production levels
- Global monetary policy (Fed rates, etc.)
- Domestic political stability
- Reform implementation consistency

## Practical Implications

### For Business Planning

1. **Scenario Analysis**: Plan for multiple exchange rate scenarios
2. **Hedging**: Use available instruments (limited as they are)
3. **Natural Hedges**: Match FX revenues and expenses
4. **Policy Monitoring**: Stay informed on CBN announcements
5. **Flexibility**: Build adaptability into business models

### For Personal Finance

1. **Diversification**: Hold multiple currencies where legal
2. **Inflation Protection**: Consider real assets
3. **Rate Monitoring**: Track both official and parallel rates
4. **Timing**: Be strategic about large FX transactions
5. **Compliance**: Use official channels for documentation

## Conclusion

CBN monetary policy profoundly affects exchange rates through multiple channels. Recent reforms signal a shift toward more market-oriented approaches, but challenges remain. Success will require:

- Consistent policy implementation
- Addressing structural economic issues
- Building credibility through transparent communication
- Balancing multiple objectives effectively
- Coordinating with fiscal policy

For businesses and individuals, understanding these dynamics is essential for effective planning and risk management in Nigeria's evolving FX landscape.

Key Takeaways:
- CBN uses multiple tools to influence exchange rates
- Recent trend toward liberalization and market determination
- Structural economic issues limit policy effectiveness
- High interest rates support currency but slow growth
- Direct interventions declining as approach evolves
- Understanding policy helps in planning and risk management`,
    author: "NairaMet Policy Team",
    date: "2024-12-10",
    readTime: "14 min read",
    category: "Policy",
    trend: null,
    featured: false,
  },
  {
    id: "4",
    title: "How to Protect Your Business from Exchange Rate Volatility in Nigeria",
    excerpt:
      "Practical strategies and tools for Nigerian businesses to manage FX risk, from natural hedging to forward contracts and operational adjustments.",
    content: `Exchange rate volatility poses one of the biggest challenges for businesses operating in Nigeria. With the naira experiencing significant fluctuations and a persistent gap between official and parallel market rates, effective FX risk management is no longer optional—it's essential for survival.

## Understanding Your FX Exposure

Before implementing hedging strategies, you must understand your business's FX exposure:

### Types of FX Exposure

**1. Transaction Exposure**
- Immediate impact from FX-denominated transactions
- Import payments, export receipts
- Foreign currency loans or receivables
- Most visible and immediate risk

**2. Translation Exposure**
- Accounting impact when consolidating foreign operations
- Affects reported earnings and balance sheet
- Important for companies with foreign subsidiaries

**3. Economic Exposure**
- Long-term impact on competitive position
- Affects pricing power and market share
- Most strategic but hardest to quantify

### Assessing Your Risk Profile

Calculate your net FX position:
- Monthly FX inflows (exports, foreign income)
- Monthly FX outflows (imports, foreign payments)
- Net position = Inflows - Outflows
- Timing mismatches between inflows and outflows

**Example:**
A manufacturing company importing $100,000 monthly in raw materials but exporting $30,000 in finished goods has a net exposure of $70,000 monthly. A 10% naira depreciation costs them ₦11.2 million extra monthly (at ₦1,600/$).

## Natural Hedging Strategies

Natural hedging involves operational changes to reduce FX exposure without financial instruments:

### 1. Match Currency Flows

**Revenue-Expense Matching:**
- If you have dollar revenues, use them for dollar expenses
- Maintain foreign currency accounts to hold export proceeds
- Pay foreign suppliers directly from export earnings

**Example:**
An exporter earning $50,000 monthly can use these proceeds to pay for $40,000 in imported inputs, reducing net exposure to $10,000.

### 2. Local Sourcing

**Import Substitution:**
- Source raw materials locally where possible
- Develop local supplier relationships
- May cost more initially but provides FX stability

**Benefits:**
- Eliminates FX risk on sourced items
- Supports local economy
- Reduces supply chain complexity
- May qualify for government incentives

**Challenges:**
- Quality concerns
- Limited local availability
- Higher initial costs
- Supplier reliability

### 3. Pricing Strategies

**Dynamic Pricing:**
- Link prices to exchange rates
- Include FX adjustment clauses in contracts
- Regular price reviews based on rate movements

**Implementation:**
- Set base price at a reference rate
- Adjust monthly/quarterly based on actual rates
- Communicate clearly with customers
- Consider competitive implications

**Example Clause:**
"Prices are based on an exchange rate of ₦1,500/$. For every 5% movement in the rate, prices will be adjusted proportionally with 30 days notice."

### 4. Diversify Markets

**Geographic Diversification:**
- Export to multiple countries/currencies
- Reduces dependence on single currency
- Natural hedge if currencies move differently

**Product Diversification:**
- Mix of local and export sales
- Reduces overall FX dependence
- Provides revenue stability

## Financial Hedging Instruments

While limited in Nigeria, some financial hedging tools are available:

### 1. Forward Contracts

**What They Are:**
- Agreement to buy/sell FX at a predetermined rate on a future date
- Locks in exchange rate for future transactions
- Eliminates uncertainty

**Availability in Nigeria:**
- Limited availability from Nigerian banks
- Typically short-term (30-90 days)
- May require collateral
- Pricing includes significant premium

**When to Use:**
- Large, predictable FX payments
- When you can't afford rate volatility
- Budget certainty is critical

**Example:**
A company with a $100,000 payment due in 60 days can lock in today's rate of ₦1,600/$, paying ₦160 million regardless of future rate movements.

### 2. Foreign Currency Accounts

**Domiciliary Accounts:**
- Hold foreign currency in Nigerian banks
- Useful for managing timing mismatches
- Subject to CBN regulations

**Best Practices:**
- Maintain working capital in dollars
- Use for import payments
- Accumulate export proceeds
- Monitor regulatory changes

**Limitations:**
- Withdrawal restrictions during crises
- Limited interest earnings
- Regulatory uncertainty

### 3. Currency Swaps

**Structure:**
- Exchange naira for dollars now, reverse later
- Can help manage short-term mismatches
- Limited availability in Nigeria

**Typical Users:**
- Large corporations
- Banks managing positions
- Companies with foreign operations

### 4. Options (Limited Availability)

**Currency Options:**
- Right but not obligation to buy/sell at set rate
- Provides protection with upside potential
- Rarely available in Nigerian market
- Expensive when available

## Operational Strategies

### 1. Inventory Management

**Strategic Stocking:**
- Build inventory before anticipated devaluation
- Reduces future import costs
- Requires capital and storage

**Considerations:**
- Working capital impact
- Storage costs
- Product shelf life
- Demand certainty

### 2. Payment Timing

**Accelerate/Delay Payments:**
- Pay imports early if devaluation expected
- Delay if appreciation expected
- Collect export proceeds quickly

**Risks:**
- Prediction difficulty
- Relationship impact
- Cash flow constraints

### 3. Invoice Currency Selection

**Negotiating Currency:**
- Try to invoice exports in dollars
- Negotiate to pay imports in naira
- Share FX risk with partners

**Success Factors:**
- Bargaining power
- Relationship strength
- Market conditions
- Competitive position

## Building an FX Risk Management Framework

### Step 1: Establish Policy

**Define:**
- Risk tolerance levels
- Hedging objectives
- Approval processes
- Monitoring procedures

**Example Policy:**
"Hedge 75% of FX exposure beyond 3 months, 50% for 1-3 months, 25% for under 1 month."

### Step 2: Forecast FX Needs

**Create Rolling Forecasts:**
- 12-month FX requirement projections
- Update monthly
- Include seasonality
- Consider growth plans

**Components:**
- Import schedules
- Export projections
- Loan payments
- Dividend repatriations

### Step 3: Monitor and Report

**Key Metrics:**
- Net FX position
- Hedged vs. unhedged exposure
- Actual vs. budgeted rates
- Hedging costs vs. benefits

**Reporting:**
- Monthly FX position reports
- Quarterly strategy reviews
- Annual policy assessments

### Step 4: Execute and Adjust

**Implementation:**
- Execute hedges per policy
- Document all transactions
- Review effectiveness
- Adjust strategy as needed

## Technology Solutions

### FX Management Software

**Features to Look For:**
- Real-time rate monitoring
- Exposure calculation
- Hedge tracking
- Reporting and analytics

**Available Solutions:**
- International platforms (limited Nigeria integration)
- Custom Excel models
- Bank-provided tools
- Emerging fintech solutions

### Digital Payment Platforms

**Benefits:**
- Better rates than traditional banks
- Faster transactions
- Transparent pricing
- Easy documentation

**Examples:**
- Licensed digital platforms
- Fintech payment solutions
- Blockchain-based transfers (emerging)

## Case Studies

### Case 1: Manufacturing Company

**Situation:**
- $200,000 monthly import bill
- $50,000 monthly export revenue
- Net exposure: $150,000

**Strategy Implemented:**
1. Sourced 30% of inputs locally (reduced exposure to $110,000)
2. Maintained 2-month inventory buffer
3. Opened domiciliary account for export proceeds
4. Implemented quarterly price adjustments

**Results:**
- 40% reduction in FX risk
- Improved budget predictability
- Better supplier relationships
- Maintained competitiveness

### Case 2: Trading Company

**Situation:**
- Pure importer, no FX revenue
- $500,000 monthly imports
- Thin margins, high competition

**Strategy Implemented:**
1. Negotiated 60-day payment terms
2. Dynamic pricing with monthly adjustments
3. Diversified supplier base across currencies
4. Built strategic inventory before devaluation

**Results:**
- Survived 30% devaluation
- Maintained market share
- Improved cash flow management
- Reduced panic buying

## Common Mistakes to Avoid

### 1. Over-Hedging
- Hedging more than actual exposure
- Locks in losses if rates move favorably
- Increases costs unnecessarily

### 2. Under-Hedging
- Leaving too much exposure unhedged
- Gambling on favorable movements
- Can devastate profitability

### 3. Ignoring Costs
- Hedging isn't free
- Must compare costs to benefits
- Consider opportunity costs

### 4. Lack of Documentation
- Poor record-keeping
- Difficulty tracking effectiveness
- Compliance issues

### 5. Inflexibility
- Rigid policies in dynamic environment
- Failure to adapt to changing conditions
- Missing opportunities

## Conclusion

Protecting your business from FX volatility in Nigeria requires a comprehensive approach combining:

**Natural Hedges:**
- Local sourcing
- Currency matching
- Pricing strategies

**Financial Instruments:**
- Forward contracts (where available)
- Foreign currency accounts
- Strategic timing

**Operational Excellence:**
- Robust forecasting
- Clear policies
- Regular monitoring
- Continuous adaptation

**Key Success Factors:**
- Understand your exposure
- Implement appropriate strategies
- Monitor and adjust regularly
- Balance cost and protection
- Stay informed on market developments

The goal isn't to eliminate all FX risk—that's often impossible and expensive. Instead, aim to manage risk to acceptable levels while maintaining business competitiveness and profitability.

Remember: The best hedge is a strong business model that can adapt to changing conditions while maintaining value for customers.`,
    author: "NairaMet Business Advisory",
    date: "2024-12-08",
    readTime: "16 min read",
    category: "Business",
    trend: null,
    featured: true,
  },
  {
    id: "5",
    title: "Nigeria's Oil Dependency and the Naira: Breaking the Cycle",
    excerpt:
      "Analyzing the relationship between oil prices, production levels, and the naira's value, plus strategies for economic diversification and FX stability.",
    content: `Nigeria's economy and the naira's value are inextricably linked to oil. With petroleum accounting for 80-90% of foreign exchange earnings and over 50% of government revenue, oil price movements directly translate to naira volatility. Understanding this relationship is crucial for anyone navigating Nigeria's FX market.

## The Oil-Naira Connection

### How Oil Dominates Nigeria's FX

**Revenue Structure:**
- Oil exports: $50-70 billion annually (depending on prices)
- Non-oil exports: $5-8 billion annually
- Remittances: $20-25 billion annually
- Foreign investment: Variable, often net outflows

This means oil provides 60-70% of total FX inflows, creating massive vulnerability to global oil markets.

**The Transmission Mechanism:**

1. **Oil Prices Rise:**
   - Nigeria earns more dollars from exports
   - CBN accumulates reserves
   - Increased FX supply in the market
   - Naira strengthens or stabilizes
   - Government spending increases
   - Economic confidence improves

2. **Oil Prices Fall:**
   - Dollar earnings decline sharply
   - CBN reserves deplete
   - FX supply tightens
   - Naira weakens
   - Government cuts spending
   - Economic uncertainty rises

### Historical Examples

**2014-2016 Oil Crash:**
- Oil fell from $110 to $30 per barrel
- Naira depreciated from ₦160 to ₦360 (125% decline)
- Reserves fell from $43 billion to $24 billion
- Recession in 2016 (first in 25 years)
- Multiple devaluations and FX restrictions

**2020 COVID Crash:**
- Oil briefly went negative
- Naira fell from ₦360 to ₦480 officially
- Parallel market hit ₦550
- Economic contraction of 1.8%
- Massive fiscal deficits

**2022 Oil Rally:**
- Oil reached $120+ per barrel
- But Nigeria couldn't capitalize fully
- Production problems limited benefits
- Naira still weakened due to structural issues

## Beyond Price: Production Matters

### Nigeria's Production Challenges

**Declining Output:**
- Peak production: 2.5 million barrels/day (2005)
- Current production: 1.2-1.5 million barrels/day
- OPEC quota: 1.8 million barrels/day (often unmet)

**Causes of Decline:**
1. **Oil Theft:**
   - Estimated 200,000-400,000 barrels/day stolen
   - Sophisticated criminal networks
   - Costs billions in lost revenue
   - Difficult to combat

2. **Pipeline Vandalism:**
   - Frequent attacks on infrastructure
   - Forces production shutdowns
   - Expensive repairs
   - Security challenges

3. **Underinvestment:**
   - Aging infrastructure
   - Limited new discoveries
   - Regulatory uncertainty
   - Funding challenges

4. **Operational Issues:**
   - Force majeures
   - Technical problems
   - Maintenance backlogs
   - Skilled labor shortages

**Impact on FX:**
Even when oil prices are high, low production means Nigeria can't fully benefit. A $100/barrel price means little if you're producing 1 million barrels instead of 2 million—that's $100 million less per day in potential revenue.

## The Subsidy Burden

### Petrol Subsidy Impact

**The Mechanism:**
- Nigeria imports refined petroleum products
- Sells domestically below cost
- Government covers the difference
- Subsidy cost: $10-15 billion annually

**FX Implications:**
1. **Increased FX Demand:**
   - Importing refined products requires dollars
   - Reduces net FX from oil sector
   - Competes with other FX needs

2. **Fiscal Pressure:**
   - Massive budget drain
   - Reduces government's ability to support naira
   - Limits infrastructure investment
   - Increases borrowing needs

3. **Inefficiency:**
   - Benefits wealthy more than poor
   - Encourages smuggling to neighbors
   - Distorts energy market
   - Prevents refinery investment

**Recent Reforms:**
- Subsidy removal announced multiple times
- Political resistance remains strong
- Partial deregulation implemented
- Full removal still pending

## Diversification: The Path Forward

### Why Diversification Matters

**Risk Reduction:**
- Multiple FX sources reduce volatility
- Less vulnerable to oil shocks
- More stable economic planning
- Improved investor confidence

**Sustainable Growth:**
- Oil is finite
- Global energy transition threatens demand
- Diversified economy more resilient
- Better job creation

### Promising Non-Oil Sectors

**1. Agriculture**

**Potential:**
- Nigeria has 84 million hectares of arable land
- Only 40% currently cultivated
- Favorable climate for diverse crops
- Large domestic and regional market

**Export Opportunities:**
- Cocoa (already significant)
- Cashew nuts
- Sesame seeds
- Ginger and other spices
- Processed foods

**Challenges:**
- Infrastructure deficits
- Insecurity in farming regions
- Limited mechanization
- Poor storage facilities
- Inconsistent policies

**FX Impact:**
- Could generate $10-20 billion annually
- Reduce food import bill ($5-7 billion)
- Create millions of jobs
- Stabilize rural economies

**2. Solid Minerals**

**Resources:**
- Gold, tin, columbite, coal, limestone
- Largely unexploited
- Estimated value in trillions
- Scattered across the country

**Current State:**
- Mostly artisanal mining
- Limited large-scale operations
- Regulatory challenges
- Security concerns

**Potential:**
- $5-10 billion annual exports possible
- Significant employment
- Regional development
- Technology transfer

**3. Manufacturing**

**Opportunities:**
- Large domestic market (200+ million people)
- Regional market access (AfCFTA)
- Competitive labor costs
- Strategic location

**Current Challenges:**
- Power supply issues
- Infrastructure gaps
- Multiple taxation
- Smuggling and dumping

**Success Stories:**
- Dangote Cement (now exporting)
- BUA Foods
- Innoson Motors
- Various consumer goods

**FX Benefits:**
- Import substitution saves FX
- Exports earn FX
- Technology development
- Skills building

**4. Services**

**Technology/IT:**
- Thriving tech ecosystem
- Successful startups (Flutterwave, Paystack, etc.)
- Growing software exports
- BPO potential

**Creative Industries:**
- Nollywood (world's 2nd largest film industry)
- Music (Afrobeats global success)
- Fashion and design
- Gaming and animation

**Professional Services:**
- Consulting
- Legal and accounting
- Engineering
- Education and training

**FX Contribution:**
- Already generating $1-2 billion
- Rapid growth potential
- Low infrastructure requirements
- High-value addition

**5. Tourism**

**Assets:**
- Diverse landscapes
- Rich cultural heritage
- Wildlife reserves
- Historical sites

**Current State:**
- Underdeveloped
- Security concerns
- Poor infrastructure
- Limited marketing

**Potential:**
- $5-10 billion annually possible
- Job creation
- Regional development
- Cultural preservation

## Policy Reforms Needed

### 1. Business Environment

**Ease of Doing Business:**
- Simplify registration processes
- Reduce bureaucracy
- Improve contract enforcement
- Streamline tax administration

**Infrastructure:**
- Reliable power supply
- Modern transportation
- Digital connectivity
- Industrial parks

### 2. Trade Policy

**Export Promotion:**
- Streamline export procedures
- Provide export financing
- Develop export processing zones
- Market access support

**Import Management:**
- Reduce dependence on imports
- Support local production
- Prevent dumping
- Encourage technology transfer

### 3. Investment Climate

**Attract FDI:**
- Policy consistency
- Investor protection
- Dispute resolution
- Repatriation guarantees

**Support Local Investment:**
- Access to finance
- Technical assistance
- Market linkages
- Innovation support

### 4. Human Capital

**Education:**
- Skills development
- Technical training
- Entrepreneurship education
- Research and development

**Health:**
- Productive workforce
- Reduced medical tourism
- Healthcare exports potential

## The Energy Transition Challenge

### Global Shift from Fossil Fuels

**Trends:**
- Net-zero commitments
- Electric vehicle adoption
- Renewable energy growth
- Carbon pricing

**Implications for Nigeria:**
- Peak oil demand may come soon
- Stranded asset risk
- Reduced oil revenues
- Urgency for diversification

### Opportunities in Transition

**Renewable Energy:**
- Abundant solar potential
- Hydropower opportunities
- Wind resources
- Biomass potential

**Gas Economy:**
- Massive gas reserves
- Cleaner than oil
- Domestic and export markets
- Petrochemicals potential

**Carbon Credits:**
- Forest conservation
- Renewable projects
- Methane reduction
- Revenue potential

## Success Stories and Lessons

### United Arab Emirates

**Transformation:**
- Oil-dependent in 1970s
- Now diversified economy
- Tourism, finance, trade, real estate
- Oil now <30% of GDP

**Key Factors:**
- Long-term vision
- Massive infrastructure investment
- Business-friendly policies
- Strategic positioning

**Lessons for Nigeria:**
- Diversification is possible
- Requires sustained commitment
- Infrastructure is critical
- Policy consistency matters

### Malaysia

**Journey:**
- Commodity-dependent (rubber, tin, oil)
- Industrialized successfully
- Now manufacturing and services hub
- Middle-income country

**Success Factors:**
- Education investment
- Industrial policy
- Export orientation
- Political stability

**Applicable to Nigeria:**
- Similar starting point
- Comparable resources
- Large population advantage
- Regional market access

## Practical Implications

### For Businesses

**Strategies:**
1. **Diversify Supply Chains:**
   - Reduce oil sector dependence
   - Develop non-oil markets
   - Build resilience

2. **Monitor Oil Markets:**
   - Track prices and production
   - Anticipate FX impacts
   - Adjust strategies accordingly

3. **Support Diversification:**
   - Invest in non-oil sectors
   - Develop local supply chains
   - Export non-oil products

### For Individuals

**Financial Planning:**
1. **Diversify Income:**
   - Don't rely solely on oil-dependent sectors
   - Develop multiple income streams
   - Build transferable skills

2. **Asset Allocation:**
   - Mix of naira and dollar assets
   - Real assets as inflation hedge
   - International diversification

3. **Career Choices:**
   - Consider non-oil sectors
   - Develop in-demand skills
   - Entrepreneurship opportunities

## Conclusion

Breaking Nigeria's oil dependency is essential for long-term FX stability and economic prosperity. While oil will remain important for years, reducing its dominance from 80% to 40-50% of FX earnings would dramatically improve resilience.

**Key Takeaways:**
- Oil dependency makes naira highly volatile
- Production problems compound price risks
- Diversification is urgent, not optional
- Multiple sectors show promise
- Policy reforms are critical
- Global energy transition adds urgency
- Success requires sustained commitment

**The Path Forward:**
1. Fix oil sector production issues
2. Remove subsidy burden
3. Invest in infrastructure
4. Support non-oil exports
5. Improve business environment
6. Develop human capital
7. Maintain policy consistency

The question isn't whether Nigeria should diversify—it's whether it will do so fast enough to avoid future crises. For businesses and individuals, understanding this dynamic and positioning accordingly is crucial for long-term success.`,
    author: "NairaMet Economic Research",
    date: "2024-12-05",
    readTime: "18 min read",
    category: "Economy",
    trend: null,
    featured: true,
  },
