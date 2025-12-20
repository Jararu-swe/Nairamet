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

// Minimal static articles list. Keep concise to avoid large inline strings.
export const articles: Article[] = [
  {
    id: "1",
    title: "Welcome to NairaMet - Naira Watch",
    excerpt: "Weekly summaries, policy analysis and market insights on the naira.",
    content: "This is a short welcome article. For full posts use markdown files in /data.",
    author: "NairaMet Editorial Team",
    date: new Date().toISOString(),
    readTime: "2",
    category: "Weekly Summary",
    trend: null,
    featured: true,
  },
];

export function readMarkdownFile(filename: string): string {
  try {
    const filePath = path.join(process.cwd(), "data", filename);
    if (!fs.existsSync(filePath)) return "";
    return fs.readFileSync(filePath, "utf-8");
  } catch (err) {
    console.error(`Failed to read ${filename}`, err);
    return "";
  }
}

function readScraped(): any[] {
  try {
    const dataPath = path.join(process.cwd(), "data", "scraped.json");
    if (!fs.existsSync(dataPath)) return [];
    const raw = fs.readFileSync(dataPath, "utf-8");
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : parsed.articles || [];
  } catch (err) {
    // Don't crash the server for malformed scraped data
    console.error("Failed to read scraped.json", err);
    return [];
  }
}

export function getArticles(): Article[] {
  const scraped = readScraped();
  const mapped = (scraped || []).map((s: any) => ({
    id: `scraped:${encodeURIComponent(s.url || String(Math.random()))}`,
    title: decodeEntities(s.title || "(no title)"),
    excerpt: decodeEntities(s.excerpt || s.content || ""),
    content: decodeEntities(s.content || ""),
    author: decodeEntities(s.source || "Wire"),
    originalUrl: s.url,
    date: s.date || new Date().toISOString(),
    readTime: "1",
    category: s.source || "Wire",
    trend: null,
    featured: false,
  })) as Article[];

  return [...articles, ...mapped].sort(
    (a, b) => (Date.parse(b.date) || 0) - (Date.parse(a.date) || 0)
  );
}

export function getArticleById(id: string): Article | null {
  const all = getArticles();

  let found = all.find((a) => a.id === id);
  if (found) return found;

  try {
    const decoded = decodeURIComponent(id);
    found = all.find((a) => a.id === decoded);
    if (found) return found;
  } catch {}

  if (id.startsWith("scraped:") || id.includes("scraped%3A")) {
    try {
      const normalized = id.replace(/scraped%3A/i, "scraped:");
      const part = normalized.slice("scraped:".length);
      found = all.find((a) => a.id === `scraped:${part}`);
      if (found) return found;

      const decodedPart = decodeURIComponent(part);
      found = all.find((a) => a.id === `scraped:${decodedPart}`);
      if (found) return found;

      const reencoded = `scraped:${encodeURIComponent(decodedPart)}`;
      found = all.find((a) => a.id === reencoded);
      if (found) return found;
    } catch {}
  }

  try {
    const maybeUrl = decodeURIComponent(id);
    found = all.find((a) => (a as any).originalUrl === maybeUrl);
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

  let s = String(str || "");
  s = s.replace(/&#(\d+);/g, (_, num) => String.fromCharCode(parseInt(num, 10)));
  s = s.replace(/&#x([0-9a-fA-F]+);/g, (_, hex) => String.fromCharCode(parseInt(hex, 16)));
  s = s.replace(/&[a-zA-Z]+;|&#\d+;|&#x[0-9a-fA-F]+;/g, (entity) => map[entity] ?? entity);
  return s.replace(/\s+/g, " ").trim();
}

export { readMarkdownFile };

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

// Minimal static articles list. Keep concise to avoid large inline strings.
export const articles: Article[] = [
  {
    id: "1",
    title: "Welcome to NairaMet - Naira Watch",
    excerpt: "Weekly summaries, policy analysis and market insights on the naira.",
    content: "This is a short welcome article. For full posts use markdown files in /data.",
    author: "NairaMet Editorial Team",
    date: new Date().toISOString(),
    readTime: "2",
    category: "Weekly Summary",
    trend: null,
    featured: true,
  },
];

export function readMarkdownFile(filename: string): string {
  try {
    const filePath = path.join(process.cwd(), "data", filename);
    if (!fs.existsSync(filePath)) return "";
    return fs.readFileSync(filePath, "utf-8");
  } catch (err) {
    console.error(`Failed to read ${filename}`, err);
    return "";
  }
}

function readScraped(): any[] {
  try {
    const dataPath = path.join(process.cwd(), "data", "scraped.json");
    if (!fs.existsSync(dataPath)) return [];
    const raw = fs.readFileSync(dataPath, "utf-8");
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : parsed.articles || [];
  } catch (err) {
    // Don't crash the server for malformed scraped data
    console.error("Failed to read scraped.json", err);
    return [];
  }
}

export function getArticles(): Article[] {
  const scraped = readScraped();
  const mapped = (scraped || []).map((s: any) => ({
    id: `scraped:${encodeURIComponent(s.url || String(Math.random()))}`,
    title: decodeEntities(s.title || "(no title)"),
    excerpt: decodeEntities(s.excerpt || s.content || ""),
    content: decodeEntities(s.content || ""),
    author: decodeEntities(s.source || "Wire"),
    originalUrl: s.url,
    date: s.date || new Date().toISOString(),
    readTime: "1",
    category: s.source || "Wire",
    trend: null,
    featured: false,
  })) as Article[];

  return [...articles, ...mapped].sort(
    (a, b) => (Date.parse(b.date) || 0) - (Date.parse(a.date) || 0)
  );
}

export function getArticleById(id: string): Article | null {
  const all = getArticles();

  let found = all.find((a) => a.id === id);
  if (found) return found;

  try {
    const decoded = decodeURIComponent(id);
    found = all.find((a) => a.id === decoded);
    if (found) return found;
  } catch {}

  if (id.startsWith("scraped:") || id.includes("scraped%3A")) {
    try {
      const normalized = id.replace(/scraped%3A/i, "scraped:");
      const part = normalized.slice("scraped:".length);
      found = all.find((a) => a.id === `scraped:${part}`);
      if (found) return found;

      const decodedPart = decodeURIComponent(part);
      found = all.find((a) => a.id === `scraped:${decodedPart}`);
      if (found) return found;

      const reencoded = `scraped:${encodeURIComponent(decodedPart)}`;
      found = all.find((a) => a.id === reencoded);
      if (found) return found;
    } catch {}
  }

  try {
    const maybeUrl = decodeURIComponent(id);
    found = all.find((a) => (a as any).originalUrl === maybeUrl);
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

  let s = String(str || "");
  s = s.replace(/&#(\d+);/g, (_, num) => String.fromCharCode(parseInt(num, 10)));
  s = s.replace(/&#x([0-9a-fA-F]+);/g, (_, hex) => String.fromCharCode(parseInt(hex, 16)));
  s = s.replace(/&[a-zA-Z]+;|&#\d+;|&#x[0-9a-fA-F]+;/g, (entity) => map[entity] ?? entity);
  return s.replace(/\s+/g, " ").trim();
}

export { readMarkdownFile };

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
  // Minimal, clean replacement to fix parse errors and restore imports/exports.
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

  function readMarkdownFile(filename: string): string {
    try {
      const filePath = path.join(process.cwd(), "data", filename);
      if (!fs.existsSync(filePath)) return "";
      return fs.readFileSync(filePath, "utf-8");
    } catch (err) {
      console.error(`Failed to read ${filename}`, err);
      return "";
    }
  }

  export const articles: Article[] = [];

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

    return [...articles, ...mapped].sort((a, b) => (Date.parse(b.date) || 0) - (Date.parse(a.date) || 0));
  }

  export function getArticleById(id: string) {
    const all = getArticles();
    return all.find((a) => a.id === id) || null;
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
    let s = str.replace(/&#(\d+);/g, (_, num) => String.fromCharCode(parseInt(num, 10)));
    s = s.replace(/&#x([0-9a-fA-F]+);/g, (_, hex) => String.fromCharCode(parseInt(hex, 16)));
    s = s.replace(/&[a-zA-Z]+;|&#\d+;|&#x[0-9a-fA-F]+;/g, (entity) => map[entity] ?? entity);
    return s.replace(/\s+/g, " ").trim();
  }

  export { readMarkdownFile };
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
