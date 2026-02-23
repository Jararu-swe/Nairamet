"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  BookOpen,
  TrendingUp,
  Bell,
  Users,
  Search,
  ArrowRight,
  Clock,
  Star,
  Target,
  DollarSign,
  BarChart3,
  AlertTriangle,
  Lightbulb,
  CheckCircle,
  ExternalLink,
} from "lucide-react";
import Link from "next/link";
import { LazyStickySkyscraperAdWrapper } from "@/components/lazy-ad-wrappers";

interface Guide {
  id: string;
  title: string;
  description: string;
  category: string;
  difficulty: "Beginner" | "Intermediate" | "Advanced";
  readTime: number;
  icon: any;
  color: string;
  featured: boolean;
  content: {
    overview: string;
    keyPoints: string[];
    steps?: string[];
    tips?: string[];
    warnings?: string[];
  };
}

const guides: Guide[] = [
  {
    id: "ngn-usd-exchange-rates",
    title: "NGN/USD Exchange Rates Explained",
    description: "Understand the factors driving USD/NGN rates and how they impact your wallet",
    category: "Currency Basics",
    difficulty: "Beginner",
    readTime: 8,
    icon: DollarSign,
    color: "text-emerald-600",
    featured: true,
    content: {
      overview: "The USD/NGN exchange rate is one of the most important financial indicators for Nigerians. Understanding what drives these rates can help you make better financial decisions.",
      keyPoints: [
        "Oil prices significantly impact the Naira since Nigeria is an oil-dependent economy",
        "CBN monetary policy decisions directly affect official exchange rates",
        "Foreign exchange supply and demand dynamics drive market rates",
        "Political stability and economic policies influence investor confidence",
        "Global economic conditions affect capital flows to Nigeria"
      ],
      steps: [
        "Monitor CBN announcements and policy changes",
        "Track oil price movements and their correlation with Naira rates",
        "Follow foreign exchange supply data from CBN",
        "Watch for major economic indicators like inflation and GDP growth",
        "Stay informed about government fiscal policies"
      ],
      tips: [
        "Use multiple rate sources to get a complete picture",
        "Consider both official and parallel market rates",
        "Track rate trends over time, not just daily movements",
        "Understand seasonal patterns in FX supply and demand"
      ]
    }
  },
  {
    id: "parallel-vs-official-rates",
    title: "Parallel vs Official Rates: Nigeria's Dual Exchange System",
    description: "Learn why Nigeria has dual rates and how to navigate the market effectively",
    category: "Market Structure",
    difficulty: "Intermediate",
    readTime: 12,
    icon: BarChart3,
    color: "text-emerald-600",
    featured: true,
    content: {
      overview: "Nigeria operates a complex foreign exchange system with multiple rates. Understanding the differences between official, parallel, and other rates is crucial for making informed decisions.",
      keyPoints: [
        "Official CBN rate is used for government transactions and some imports",
        "I&E Window rate reflects market-determined pricing for eligible transactions",
        "Parallel (black) market rate is driven by supply and demand dynamics",
        "BDC rates are regulated but often closer to parallel market rates",
        "Rate convergence is a key policy goal but remains challenging"
      ],
      steps: [
        "Identify which rate applies to your specific transaction type",
        "Check if you're eligible for official rate access",
        "Compare rates across different market segments",
        "Understand the legal implications of different rate sources",
        "Factor in transaction costs and accessibility"
      ],
      tips: [
        "Official rates may not be accessible for all transactions",
        "Parallel market rates often reflect true market sentiment",
        "BDCs offer a middle ground between official and parallel rates",
        "Rate spreads indicate market stress and FX scarcity"
      ],
      warnings: [
        "Using unauthorized dealers carries legal and financial risks",
        "Rate arbitrage opportunities may be limited by access restrictions",
        "Sudden policy changes can dramatically affect rate differentials"
      ]
    }
  },
  {
    id: "setting-rate-alerts",
    title: "Master Alert Strategies: Setting Effective Rate Alerts",
    description: "Master alert strategies to catch favorable rates for your transactions",
    category: "Trading Tools",
    difficulty: "Intermediate",
    readTime: 10,
    icon: Bell,
    color: "text-emerald-600",
    featured: true,
    content: {
      overview: "Rate alerts are powerful tools for timing your foreign exchange transactions. Setting them strategically can help you capture favorable rates and avoid losses.",
      keyPoints: [
        "Set alerts based on your specific transaction needs and timeline",
        "Use multiple alert levels to capture different market scenarios",
        "Consider both absolute rates and percentage changes",
        "Factor in transaction costs when setting alert thresholds",
        "Combine rate alerts with market analysis for better timing"
      ],
      steps: [
        "Determine your target exchange rate based on your needs",
        "Set primary alerts at your ideal rate levels",
        "Create secondary alerts for acceptable backup rates",
        "Configure alerts for both favorable and unfavorable movements",
        "Test your alert system to ensure reliable delivery",
        "Review and adjust alerts based on market conditions"
      ],
      tips: [
        "Set alerts 2-3% above/below current rates for realistic targets",
        "Use push notifications for immediate alerts on mobile",
        "Consider setting alerts for rate volatility, not just levels",
        "Keep a buffer between your alert rate and actual transaction rate"
      ],
      warnings: [
        "Don't rely solely on alerts - monitor market conditions actively",
        "Rate alerts don't guarantee you can transact at those levels",
        "Market gaps can cause rates to move past your alert levels quickly"
      ]
    }
  },
  {
    id: "optimizing-remittances",
    title: "Optimizing Remittances: Maximize Value Sent Home",
    description: "Learn how exchange rates impact remittances and maximize value sent home",
    category: "Remittances",
    difficulty: "Beginner",
    readTime: 15,
    icon: Users,
    color: "text-emerald-600",
    featured: true,
    content: {
      overview: "For Nigerians abroad, remittances are a crucial financial lifeline. Understanding how to optimize these transfers can significantly increase the value received by your family.",
      keyPoints: [
        "Timing remittances with favorable exchange rates can increase value by 5-15%",
        "Different remittance channels offer varying rates and fees",
        "Regulatory changes affect remittance rates and accessibility",
        "Volume and frequency of transfers can impact overall costs",
        "Recipient location within Nigeria may affect final rates"
      ],
      steps: [
        "Compare rates across multiple remittance providers",
        "Factor in all fees, not just exchange rate margins",
        "Consider the speed vs. cost trade-off for your needs",
        "Monitor rate trends to time larger transfers",
        "Verify recipient requirements and documentation",
        "Track transfer completion and final rates received"
      ],
      tips: [
        "Send larger amounts less frequently to reduce fixed fees",
        "Use rate alerts to time transfers during favorable periods",
        "Consider digital platforms for better rates and convenience",
        "Build relationships with reliable remittance providers",
        "Keep records for tax and regulatory compliance"
      ],
      warnings: [
        "Unregulated remittance channels carry significant risks",
        "Exchange rate guarantees may have hidden conditions",
        "Regulatory changes can affect transfer methods and rates"
      ]
    }
  },
  {
    id: "fx-trading-basics",
    title: "FX Trading Fundamentals for Nigerian Markets",
    description: "Essential concepts for trading foreign exchange in Nigerian markets",
    category: "Trading",
    difficulty: "Advanced",
    readTime: 20,
    icon: TrendingUp,
    color: "text-emerald-600",
    featured: false,
    content: {
      overview: "Foreign exchange trading in Nigeria requires understanding both global FX principles and local market dynamics. This guide covers essential concepts for Nigerian FX traders.",
      keyPoints: [
        "Nigerian FX markets have unique characteristics due to capital controls",
        "Liquidity varies significantly across different market segments",
        "Regulatory compliance is crucial for legal FX trading",
        "Risk management is essential due to high volatility",
        "Market access depends on your category and transaction type"
      ],
      steps: [
        "Understand regulatory requirements for your trading category",
        "Choose appropriate market segments for your trading style",
        "Develop a risk management strategy with position sizing",
        "Create a trading plan with entry and exit criteria",
        "Monitor both local and international factors affecting rates",
        "Keep detailed records for compliance and analysis"
      ],
      tips: [
        "Start with small positions to learn market dynamics",
        "Focus on major currency pairs with better liquidity",
        "Use technical analysis combined with fundamental factors",
        "Stay updated on CBN policies and announcements"
      ],
      warnings: [
        "FX trading carries significant financial risks",
        "Leverage can amplify both gains and losses",
        "Regulatory violations can result in serious penalties"
      ]
    }
  },
  {
    id: "cbn-policy-impact",
    title: "Understanding CBN Policy Impact on Exchange Rates",
    description: "How Central Bank policies affect Naira exchange rates and market dynamics",
    category: "Policy Analysis",
    difficulty: "Intermediate",
    readTime: 12,
    icon: Target,
    color: "text-emerald-600",
    featured: false,
    content: {
      overview: "The Central Bank of Nigeria's policies have profound effects on exchange rates. Understanding these impacts helps predict rate movements and make informed decisions.",
      keyPoints: [
        "Monetary policy decisions directly affect Naira strength",
        "FX intervention policies impact market rates and volatility",
        "Interest rate changes influence capital flows and exchange rates",
        "Reserve requirements affect banking sector FX operations",
        "Import/export restrictions influence FX demand and supply"
      ],
      steps: [
        "Follow CBN monetary policy committee meetings and decisions",
        "Monitor changes in FX allocation policies and procedures",
        "Track CBN's foreign reserves and intervention activities",
        "Analyze the impact of interest rate changes on FX flows",
        "Stay updated on regulatory changes affecting FX markets"
      ],
      tips: [
        "CBN announcements often cause immediate market reactions",
        "Policy implementation may differ from initial announcements",
        "Consider both intended and unintended policy consequences",
        "Monitor market sentiment alongside policy changes"
      ]
    }
  }
];

const categories = [
  "All Categories",
  "Currency Basics",
  "Market Structure", 
  "Trading Tools",
  "Remittances",
  "Trading",
  "Policy Analysis"
];

const difficulties = ["All Levels", "Beginner", "Intermediate", "Advanced"];

export default function GuidesPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All Categories");
  const [selectedDifficulty, setSelectedDifficulty] = useState("All Levels");
  const [selectedGuide, setSelectedGuide] = useState<Guide | null>(null);

  const filteredGuides = guides.filter(guide => {
    const matchesSearch = guide.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         guide.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "All Categories" || guide.category === selectedCategory;
    const matchesDifficulty = selectedDifficulty === "All Levels" || guide.difficulty === selectedDifficulty;
    
    return matchesSearch && matchesCategory && matchesDifficulty;
  });

  const featuredGuides = filteredGuides.filter(guide => guide.featured);
  const regularGuides = filteredGuides.filter(guide => !guide.featured);

  if (selectedGuide) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-gray-900 dark:to-gray-800 p-2 sm:p-4 md:p-6">
        <div className="max-w-4xl mx-auto">
          <div className="mb-6">
            <Button
              variant="outline"
              onClick={() => setSelectedGuide(null)}
              className="mb-4"
            >
              ← Back to Guides
            </Button>
            
            <div className="flex items-center gap-2 mb-4">
              <selectedGuide.icon className={`w-6 h-6 ${selectedGuide.color}`} />
              <Badge variant="outline">{selectedGuide.category}</Badge>
              <Badge variant="secondary">{selectedGuide.difficulty}</Badge>
              <div className="flex items-center gap-1 text-sm text-muted-foreground">
                <Clock className="w-4 h-4" />
                {selectedGuide.readTime} min read
              </div>
            </div>
            
            <h1 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
              {selectedGuide.title}
            </h1>
            <p className="text-lg text-muted-foreground">
              {selectedGuide.description}
            </p>
          </div>

          <div className="space-y-6">
            {/* Overview */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="w-5 h-5" />
                  Overview
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground leading-relaxed">
                  {selectedGuide.content.overview}
                </p>
              </CardContent>
            </Card>

            {/* Key Points */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Star className="w-5 h-5" />
                  Key Points
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {selectedGuide.content.keyPoints.map((point, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                      <span className="text-muted-foreground">{point}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            {/* Steps */}
            {selectedGuide.content.steps && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Target className="w-5 h-5" />
                    Step-by-Step Guide
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ol className="space-y-4">
                    {selectedGuide.content.steps.map((step, index) => (
                      <li key={index} className="flex items-start gap-3">
                        <div className="w-6 h-6 rounded-full bg-emerald-600 text-white text-sm font-bold flex items-center justify-center flex-shrink-0 mt-0.5">
                          {index + 1}
                        </div>
                        <span className="text-muted-foreground">{step}</span>
                      </li>
                    ))}
                  </ol>
                </CardContent>
              </Card>
            )}

            {/* Tips */}
            {selectedGuide.content.tips && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Lightbulb className="w-5 h-5" />
                    Pro Tips
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    {selectedGuide.content.tips.map((tip, index) => (
                      <li key={index} className="flex items-start gap-3">
                        <div className="w-2 h-2 rounded-full bg-amber-500 mt-2 flex-shrink-0" />
                        <span className="text-muted-foreground">{tip}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            )}

            {/* Warnings */}
            {selectedGuide.content.warnings && (
              <Card className="border-amber-200 bg-amber-50 dark:bg-amber-950/20">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-amber-800 dark:text-amber-200">
                    <AlertTriangle className="w-5 h-5" />
                    Important Warnings
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    {selectedGuide.content.warnings.map((warning, index) => (
                      <li key={index} className="flex items-start gap-3">
                        <AlertTriangle className="w-5 h-5 text-amber-600 mt-0.5 flex-shrink-0" />
                        <span className="text-amber-800 dark:text-amber-200">{warning}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            )}

            {/* Related Actions */}
            <Card className="bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-950/20 dark:to-teal-950/20">
              <CardHeader>
                <CardTitle>Ready to Apply This Knowledge?</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col sm:flex-row gap-4">
                  <Link href="/alerts" className="flex-1">
                    <Button className="w-full">
                      <Bell className="w-4 h-4 mr-2" />
                      Set Rate Alerts
                    </Button>
                  </Link>
                  <Link href="/tracker" className="flex-1">
                    <Button variant="outline" className="w-full">
                      <TrendingUp className="w-4 h-4 mr-2" />
                      View Live Rates
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-gray-900 dark:to-gray-800 p-2 sm:p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex gap-4 lg:gap-6">
          {/* Left Sidebar - Skyscraper Ad */}
          <aside className="hidden xl:block w-[160px] flex-shrink-0">
            <LazyStickySkyscraperAdWrapper zoneId="10841738" network="adcash" />
          </aside>

          {/* Main Content */}
          <div className="flex-1 space-y-6 min-w-0">
            {/* Header */}
            <div className="text-center space-y-4">
              <h1 className="text-3xl sm:text-4xl font-bold text-emerald-900 dark:text-emerald-100">
                FX Trading & Currency Guides
              </h1>
              <p className="text-base sm:text-lg text-emerald-700 dark:text-emerald-300 max-w-3xl mx-auto">
                Master currency trading, exchange rates, alerts, and remittances with our comprehensive guides
              </p>
            </div>

            {/* Search and Filters */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Search className="w-5 h-5" />
                  Find Your Guide
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Search Guides</label>
                    <Input
                      placeholder="Search by title or topic..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Category</label>
                    <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map(category => (
                          <SelectItem key={category} value={category}>
                            {category}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Difficulty</label>
                    <Select value={selectedDifficulty} onValueChange={setSelectedDifficulty}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {difficulties.map(difficulty => (
                          <SelectItem key={difficulty} value={difficulty}>
                            {difficulty}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Featured Guides */}
            {featuredGuides.length > 0 && (
              <div className="space-y-4">
                <h2 className="text-2xl font-bold text-foreground">Featured Guides</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {featuredGuides.map(guide => (
                    <Card 
                      key={guide.id} 
                      className="hover:shadow-lg transition-all duration-300 hover:-translate-y-1 cursor-pointer border-2 border-emerald-200 dark:border-emerald-800"
                      onClick={() => setSelectedGuide(guide)}
                    >
                      <CardHeader>
                        <div className="flex items-center justify-between mb-2">
                          <Badge className="bg-emerald-600 text-white">Featured</Badge>
                          <div className="flex items-center gap-1 text-sm text-muted-foreground">
                            <Clock className="w-4 h-4" />
                            {guide.readTime} min
                          </div>
                        </div>
                        <div className="flex items-center gap-3 mb-3">
                          <div className={`p-2 rounded-lg bg-gray-100 dark:bg-gray-800 ${guide.color}`}>
                            <guide.icon className="w-6 h-6" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <CardTitle className="text-lg leading-tight">{guide.title}</CardTitle>
                            <div className="flex items-center gap-2 mt-1">
                              <Badge variant="outline" className="text-xs">{guide.category}</Badge>
                              <Badge variant="secondary" className="text-xs">{guide.difficulty}</Badge>
                            </div>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <CardDescription className="text-sm leading-relaxed mb-4">
                          {guide.description}
                        </CardDescription>
                        <Button className="w-full group">
                          Read Guide
                          <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}

            {/* All Guides */}
            <div className="space-y-4">
              <h2 className="text-2xl font-bold text-foreground">
                All Guides ({filteredGuides.length})
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {regularGuides.map(guide => (
                  <Card 
                    key={guide.id} 
                    className="hover:shadow-md transition-all duration-300 hover:-translate-y-0.5 cursor-pointer"
                    onClick={() => setSelectedGuide(guide)}
                  >
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between mb-2">
                        <Badge variant="outline" className="text-xs">{guide.category}</Badge>
                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                          <Clock className="w-3 h-3" />
                          {guide.readTime} min
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <div className={`p-2 rounded-lg bg-gray-100 dark:bg-gray-800 ${guide.color} flex-shrink-0`}>
                          <guide.icon className="w-5 h-5" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <CardTitle className="text-base leading-tight">{guide.title}</CardTitle>
                          <Badge variant="secondary" className="text-xs mt-1">{guide.difficulty}</Badge>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <CardDescription className="text-sm leading-relaxed mb-3">
                        {guide.description}
                      </CardDescription>
                      <Button variant="outline" size="sm" className="w-full group">
                        Read Guide
                        <ArrowRight className="w-3 h-3 ml-2 group-hover:translate-x-1 transition-transform" />
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            {filteredGuides.length === 0 && (
              <Card>
                <CardContent className="text-center py-12">
                  <BookOpen className="w-12 h-12 mx-auto mb-4 text-muted-foreground opacity-50" />
                  <h3 className="text-lg font-semibold mb-2">No guides found</h3>
                  <p className="text-muted-foreground mb-4">
                    Try adjusting your search terms or filters
                  </p>
                  <Button 
                    variant="outline" 
                    onClick={() => {
                      setSearchTerm("");
                      setSelectedCategory("All Categories");
                      setSelectedDifficulty("All Levels");
                    }}
                  >
                    Clear Filters
                  </Button>
                </CardContent>
              </Card>
            )}

            {/* Call to Action */}
            <Card className="bg-gradient-to-r from-emerald-600 to-teal-600 text-white">
              <CardContent className="text-center py-8">
                <h3 className="text-xl font-bold mb-2">Ready to Put Knowledge into Action?</h3>
                <p className="mb-6 opacity-90">
                  Start tracking live rates and setting up alerts based on what you've learned
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Link href="/tracker">
                    <Button variant="secondary" className="w-full sm:w-auto">
                      <TrendingUp className="w-4 h-4 mr-2" />
                      View Live Rates
                    </Button>
                  </Link>
                  <Link href="/alerts">
                    <Button variant="outline" className="w-full sm:w-auto bg-white/10 border-white/20 text-white hover:bg-white/20">
                      <Bell className="w-4 h-4 mr-2" />
                      Set Rate Alerts
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Sidebar - Skyscraper Ad */}
          <aside className="hidden xl:block w-[160px] flex-shrink-0">
            <LazyStickySkyscraperAdWrapper 
              zoneId={process.env.NEXT_PUBLIC_ADCASH_SKYSCRAPER || "10841606"} 
              network="adcash" 
            />
          </aside>
        </div>
      </div>
    </div>
  );
}