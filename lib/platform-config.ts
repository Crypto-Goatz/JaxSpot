import type { PlatformApp, AuthUser } from "./google-apps-script-client"

export const platformApps: PlatformApp[] = [
  // Trading Apps
  {
    id: "crypto-dashboard",
    name: "JAX Crypto Dashboard",
    description: "Real-time crypto trading signals",
    icon: "📊",
    color: "bg-blue-600",
    url: "/",
    category: "trading",
    requiredTier: "free",
    isExternal: false,
  },
  {
    id: "advanced-scanner",
    name: "Advanced Scanner",
    description: "AI-powered market scanner",
    icon: "🔍",
    color: "bg-purple-600",
    url: "/scanner",
    category: "trading",
    requiredTier: "herd",
    badge: "New",
    isExternal: false,
  },
  {
    id: "options-flow",
    name: "Options Flow",
    description: "Real-time options activity",
    icon: "📈",
    color: "bg-green-600",
    url: "/options",
    category: "trading",
    requiredTier: "pro",
    isExternal: false,
  },
  {
    id: "whale-tracker",
    name: "Whale Tracker",
    description: "Track large wallet movements",
    icon: "🐋",
    color: "bg-indigo-600",
    url: "/whales",
    category: "trading",
    requiredTier: "elite",
    badge: "Elite",
    isExternal: false,
  },

  // Analytics Apps
  {
    id: "portfolio-analyzer",
    name: "Portfolio Analyzer",
    description: "Advanced portfolio insights",
    icon: "📊",
    color: "bg-orange-600",
    url: "/portfolio",
    category: "analytics",
    requiredTier: "herd",
    isExternal: false,
  },
  {
    id: "backtester",
    name: "Strategy Backtester",
    description: "Test your trading strategies",
    icon: "⚡",
    color: "bg-yellow-600",
    url: "/backtest",
    category: "analytics",
    requiredTier: "pro",
    isExternal: false,
  },
  {
    id: "risk-calculator",
    name: "Risk Calculator",
    description: "Position sizing and risk management",
    icon: "🛡️",
    color: "bg-red-600",
    url: "/risk",
    category: "analytics",
    requiredTier: "pro",
    isExternal: false,
  },
  {
    id: "market-sentiment",
    name: "Market Sentiment",
    description: "AI sentiment analysis",
    icon: "🧠",
    color: "bg-pink-600",
    url: "/sentiment",
    category: "analytics",
    requiredTier: "elite",
    isExternal: false,
  },

  // Community Apps
  {
    id: "discord-community",
    name: "Discord Community",
    description: "Join our trading community",
    icon: "💬",
    color: "bg-purple-500",
    url: "https://discord.gg/jaxcrypto",
    category: "community",
    requiredTier: "free",
    isExternal: true,
  },
  {
    id: "premium-chat",
    name: "Premium Chat",
    description: "Exclusive member discussions",
    icon: "👥",
    color: "bg-blue-500",
    url: "/chat",
    category: "community",
    requiredTier: "herd",
    isExternal: false,
  },
  {
    id: "live-calls",
    name: "Live Trading Calls",
    description: "Real-time trading sessions",
    icon: "📞",
    color: "bg-green-500",
    url: "/live",
    category: "community",
    requiredTier: "pro",
    badge: "Live",
    isExternal: false,
  },
  {
    id: "elite-lounge",
    name: "Elite Lounge",
    description: "Exclusive whale discussions",
    icon: "👑",
    color: "bg-yellow-500",
    url: "/elite",
    category: "community",
    requiredTier: "elite",
    badge: "VIP",
    isExternal: false,
  },

  // Tools Apps
  {
    id: "news-aggregator",
    name: "News Aggregator",
    description: "Curated crypto news feed",
    icon: "📰",
    color: "bg-gray-600",
    url: "/news",
    category: "tools",
    requiredTier: "free",
    isExternal: false,
  },
  {
    id: "alert-builder",
    name: "Alert Builder",
    description: "Custom price and volume alerts",
    icon: "🔔",
    color: "bg-blue-600",
    url: "/alerts",
    category: "tools",
    requiredTier: "herd",
    isExternal: false,
  },
  {
    id: "api-dashboard",
    name: "API Dashboard",
    description: "Manage your API access",
    icon: "🔌",
    color: "bg-purple-600",
    url: "/api",
    category: "tools",
    requiredTier: "pro",
    isExternal: false,
  },
  {
    id: "bot-builder",
    name: "Trading Bot Builder",
    description: "Create custom trading bots",
    icon: "🤖",
    color: "bg-indigo-600",
    url: "/bots",
    category: "tools",
    requiredTier: "elite",
    badge: "Beta",
    isExternal: false,
  },

  // Account Apps
  {
    id: "pricing",
    name: "Pricing & Plans",
    description: "Upgrade your membership",
    icon: "💎",
    color: "bg-gradient-to-r from-blue-600 to-purple-600",
    url: "/pricing",
    category: "account",
    requiredTier: "free",
    isExternal: false,
  },
  {
    id: "profile-settings",
    name: "Profile Settings",
    description: "Manage your account",
    icon: "⚙️",
    color: "bg-gray-600",
    url: "/settings",
    category: "account",
    requiredTier: "free",
    isExternal: false,
  },
  {
    id: "billing",
    name: "Billing & Invoices",
    description: "Manage your subscription",
    icon: "💳",
    color: "bg-green-600",
    url: "/billing",
    category: "account",
    requiredTier: "herd",
    isExternal: false,
  },
  {
    id: "referrals",
    name: "Referral Program",
    description: "Earn rewards for referrals",
    icon: "🎁",
    color: "bg-orange-600",
    url: "/referrals",
    category: "account",
    requiredTier: "free",
    isExternal: false,
  },
]

// Mock user profile for development
export const mockUserProfile: AuthUser = {
  id: "user_123",
  email: "trader@example.com",
  name: "John Trader",
  avatar: "/placeholder-user.jpg",
  membershipTier: "free",
  joinDate: "2024-01-15T00:00:00Z",
  totalTrades: 156,
  winRate: 73.2,
  totalPnL: 12450,
  preferences: {
    audioEnabled: false, // Default to false
    audioVolume: 0.5,
    notifications: true,
    theme: "light",
    timezone: "UTC",
  },
  subscription: {
    status: "active",
    currentPeriodEnd: "2024-02-15T00:00:00Z",
    cancelAtPeriodEnd: false,
  },
}

// Helper functions
export function getAppsByTier(tier: AuthUser["membershipTier"]): PlatformApp[] {
  const tierOrder = { free: 0, herd: 1, pro: 2, elite: 3 }
  const userTierLevel = tierOrder[tier]

  return platformApps.filter((app) => {
    const requiredTierLevel = tierOrder[app.requiredTier]
    return userTierLevel >= requiredTierLevel
  })
}

export function canUserAccessApp(user: AuthUser | null, app: PlatformApp): boolean {
  if (!user) return app.requiredTier === "free"

  const tierOrder = { free: 0, herd: 1, pro: 2, elite: 3 }
  const userTierLevel = tierOrder[user.membershipTier]
  const requiredTierLevel = tierOrder[app.requiredTier]

  return userTierLevel >= requiredTierLevel
}
