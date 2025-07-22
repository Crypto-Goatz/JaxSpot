export interface AuthUser {
  id: string
  email: string
  name: string
  avatar?: string
  membershipTier: "free" | "herd" | "pro" | "elite"
  joinDate: string
  totalTrades: number
  winRate: number
  totalPnL: number
  isActive: boolean
  lastLogin: string
  preferences: {
    audioEnabled: boolean
    audioVolume: number
    notifications: boolean
    theme: "light" | "dark"
    timezone: string
  }
  subscription?: {
    status: "active" | "cancelled" | "expired"
    currentPeriodEnd: string
    cancelAtPeriodEnd: boolean
  }
}

export interface JaxPick {
  id: string
  symbol: string
  name: string
  entryPrice: number
  targetPrice: number
  stopLoss: number
  confidence: number
  reasoning: string
  status: "active" | "hit" | "stopped" | "cancelled"
  dateCreated: string
  dateResolved?: string
  actualExit?: number
  pnl?: number
  stage: 1 | 2 | 3 | 4
}

export interface JaxAccuracy {
  totalPicks: number
  hitRate: number
  winRate: number
  avgReturn: number
  totalReturn: number
  bestPick: { symbol: string; date: string; return: number }
  worstPick: { symbol: string; date: string; return: number }
  monthlyStats: Array<{
    month: string
    picks: number
    hits: number
    returns: number
  }>
}

export interface PlatformApp {
  id: string
  name: string
  description: string
  icon: string
  color: string
  url: string
  category: "trading" | "analytics" | "community" | "tools" | "account"
  requiredTier: "free" | "herd" | "pro" | "elite"
  badge?: string
  isExternal: boolean
}

export interface GoogleAppsScriptResponse<T = any> {
  success: boolean
  data?: T
  error?: string
  message?: string
}

// Mock data for development
const MOCK_USER: AuthUser = {
  id: "demo-user-123",
  email: "demo@jax.com",
  name: "Demo User",
  avatar: "/placeholder-user.jpg",
  membershipTier: "pro",
  joinDate: "2024-01-15T00:00:00Z",
  totalTrades: 47,
  winRate: 73.2,
  totalPnL: 12450.75,
  isActive: true,
  lastLogin: new Date().toISOString(),
  preferences: {
    audioEnabled: false,
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

const MOCK_JAX_PICKS: JaxPick[] = [
  {
    id: "pick_001",
    symbol: "BTC",
    name: "Bitcoin",
    entryPrice: 43250,
    targetPrice: 48000,
    stopLoss: 41000,
    confidence: 85,
    reasoning: "Strong technical breakout with high volume confirmation. RSI showing bullish divergence.",
    status: "active",
    dateCreated: "2024-01-15T10:30:00Z",
    stage: 1,
  },
  {
    id: "pick_002",
    symbol: "ETH",
    name: "Ethereum",
    entryPrice: 2650,
    targetPrice: 2950,
    stopLoss: 2450,
    confidence: 78,
    reasoning: "DEX activity surge indicates bullish momentum. Layer 2 adoption accelerating.",
    status: "hit",
    dateCreated: "2024-01-14T14:20:00Z",
    dateResolved: "2024-01-16T09:15:00Z",
    actualExit: 2920,
    pnl: 10.2,
    stage: 1,
  },
  {
    id: "pick_003",
    symbol: "SOL",
    name: "Solana",
    entryPrice: 98.5,
    targetPrice: 125,
    stopLoss: 85,
    confidence: 82,
    reasoning: "Network activity at ATH. Major DeFi protocols launching on Solana.",
    status: "active",
    dateCreated: "2024-01-13T16:45:00Z",
    stage: 2,
  },
  {
    id: "pick_004",
    symbol: "MATIC",
    name: "Polygon",
    entryPrice: 0.85,
    targetPrice: 1.15,
    stopLoss: 0.75,
    confidence: 88,
    reasoning: "zkEVM launch creating massive bullish momentum. Enterprise partnerships expanding.",
    status: "active",
    dateCreated: "2024-01-11T13:15:00Z",
    stage: 3,
  },
  {
    id: "pick_005",
    symbol: "ARB",
    name: "Arbitrum",
    entryPrice: 1.25,
    targetPrice: 1.65,
    stopLoss: 1.05,
    confidence: 83,
    reasoning: "Layer 2 TVL hitting new highs. Gaming ecosystem exploding on Arbitrum.",
    status: "active",
    dateCreated: "2024-01-09T15:20:00Z",
    stage: 4,
  },
  {
    id: "pick_006",
    symbol: "LINK",
    name: "Chainlink",
    entryPrice: 14.25,
    targetPrice: 18.5,
    stopLoss: 12.8,
    confidence: 91,
    reasoning: "CCIP adoption accelerating. Major partnerships with traditional finance.",
    status: "hit",
    dateCreated: "2024-01-08T11:30:00Z",
    dateResolved: "2024-01-12T14:45:00Z",
    actualExit: 17.8,
    pnl: 24.9,
    stage: 2,
  },
]

const MOCK_PLATFORM_APPS: PlatformApp[] = [
  {
    id: "crypto-dashboard",
    name: "JAX Dashboard",
    description: "Real-time crypto trading signals and market analysis",
    icon: "📊",
    color: "bg-blue-600",
    url: "/",
    category: "trading",
    requiredTier: "free",
    isExternal: false,
  },
  {
    id: "whale-tracker",
    name: "Whale Tracker",
    description: "Monitor large wallet movements and whale activity",
    icon: "🐋",
    color: "bg-purple-600",
    url: "/whale-tracker",
    category: "analytics",
    requiredTier: "herd",
    badge: "New",
    isExternal: false,
  },
  {
    id: "options-flow",
    name: "Options Flow",
    description: "Real-time options and derivatives flow analysis",
    icon: "📈",
    color: "bg-green-600",
    url: "/options-flow",
    category: "analytics",
    requiredTier: "pro",
    isExternal: false,
  },
  {
    id: "ai-analyzer",
    name: "AI Trade Analyzer",
    description: "AI-powered trade analysis and risk assessment",
    icon: "🤖",
    color: "bg-indigo-600",
    url: "/ai-analyzer",
    category: "tools",
    requiredTier: "pro",
    badge: "AI",
    isExternal: false,
  },
  {
    id: "bot-builder",
    name: "Custom Bot Builder",
    description: "Build and deploy automated trading bots",
    icon: "⚙️",
    color: "bg-orange-600",
    url: "/bot-builder",
    category: "tools",
    requiredTier: "elite",
    isExternal: false,
  },
  {
    id: "arbitrage-scanner",
    name: "Arbitrage Scanner",
    description: "Find profitable cross-exchange opportunities",
    icon: "🔄",
    color: "bg-teal-600",
    url: "/arbitrage",
    category: "tools",
    requiredTier: "elite",
    isExternal: false,
  },
  {
    id: "community",
    name: "JAX Community",
    description: "Connect with other traders and share insights",
    icon: "👥",
    color: "bg-pink-600",
    url: "/community",
    category: "community",
    requiredTier: "free",
    isExternal: false,
  },
  {
    id: "discord",
    name: "Discord Server",
    description: "Join our exclusive trading community",
    icon: "💬",
    color: "bg-violet-600",
    url: "https://discord.gg/jax-trading",
    category: "community",
    requiredTier: "herd",
    isExternal: true,
  },
  {
    id: "pricing",
    name: "Pricing & Plans",
    description: "Upgrade your membership and unlock premium features",
    icon: "💎",
    color: "bg-yellow-600",
    url: "/pricing",
    category: "account",
    requiredTier: "free",
    isExternal: false,
  },
  {
    id: "profile",
    name: "Profile Settings",
    description: "Manage your account settings and preferences",
    icon: "👤",
    color: "bg-gray-600",
    url: "/profile",
    category: "account",
    requiredTier: "free",
    isExternal: false,
  },
]

const MOCK_JAX_ACCURACY: JaxAccuracy = {
  totalPicks: 156,
  hitRate: 78.5,
  winRate: 73.2,
  avgReturn: 12.4,
  totalReturn: 156.8,
  bestPick: { symbol: "LINK", date: "2024-01-10", return: 25.4 },
  worstPick: { symbol: "AVAX", date: "2024-01-12", return: -14.5 },
  monthlyStats: [
    { month: "Jan 2024", picks: 12, hits: 9, returns: 23.5 },
    { month: "Dec 2023", picks: 15, hits: 11, returns: 18.2 },
    { month: "Nov 2023", picks: 18, hits: 14, returns: 31.1 },
    { month: "Oct 2023", picks: 22, hits: 17, returns: 28.7 },
    { month: "Sep 2023", picks: 19, hits: 15, returns: 19.3 },
    { month: "Aug 2023", picks: 21, hits: 16, returns: 22.1 },
  ],
}

class GoogleAppsScriptClient {
  private baseUrl: string
  private apiKey: string
  private authToken: string | null = null
  private isEnabled = false

  constructor() {
    // Use the provided Google Apps Script URL
    this.baseUrl =
      process.env.NEXT_PUBLIC_GAS_API_URL ||
      "https://script.google.com/a/macros/rocketopp.com/s/AKfycbxc8gUY6V-m3X-M8Mrw5-hNanLExVpWLUbM9TF1IrNJWqazKitk1TNeXgh1m4M3OEGv/exec"
    this.apiKey = process.env.NEXT_PUBLIC_GAS_API_KEY || "jax-platform-2024"

    // Check if Google Apps Script is properly configured
    this.isEnabled = !!this.baseUrl && this.baseUrl !== ""

    // Load auth token from localStorage if available
    if (typeof window !== "undefined") {
      this.authToken = localStorage.getItem("gas_auth_token")
    }

    if (this.isEnabled) {
      console.log("Google Apps Script configured with URL:", this.baseUrl)
    } else {
      console.warn("Google Apps Script not configured properly. Using mock data.")
    }
  }

  private async makeRequest<T>(action: string, data?: any, requiresAuth = true): Promise<GoogleAppsScriptResponse<T>> {
    // If Google Apps Script is not configured, return mock data
    if (!this.isEnabled) {
      console.log("Using mock response for action:", action)
      return this.getMockResponse<T>(action, data)
    }

    try {
      const payload = {
        action,
        data: data || {},
        apiKey: this.apiKey,
        authToken: requiresAuth ? this.authToken : null,
        timestamp: Date.now(),
      }

      console.log("Making GAS request:", { action, hasAuth: !!this.authToken, url: this.baseUrl })

      const response = await fetch(this.baseUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      })

      console.log("GAS response status:", response.status, response.statusText)

      if (!response.ok) {
        console.error(`HTTP error! status: ${response.status}`)
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const responseText = await response.text()
      console.log("GAS response text (first 200 chars):", responseText.substring(0, 200))

      // Check if response is HTML (error page, sign-in page, or contains authentication requirements)
      if (
        responseText.trim().startsWith("<!DOCTYPE") ||
        responseText.trim().startsWith("<html") ||
        responseText.includes("Sign in") ||
        responseText.includes("authentication") ||
        responseText.includes("404") ||
        responseText.includes("not found")
      ) {
        console.error("Google Apps Script Error - Received HTML instead of JSON")
        console.error("This usually means:")
        console.error("1. The script requires Google Workspace authentication (@rocketopp.com)")
        console.error("2. The script is not deployed as a web app with proper permissions")
        console.error("3. The script has execution errors")
        console.error("4. The script permissions are not set to 'Anyone' or 'Anyone with link'")

        // Fall back to mock data
        return this.getMockResponse<T>(action, data)
      }

      let result
      try {
        result = JSON.parse(responseText)
      } catch (parseError) {
        console.error("Failed to parse JSON response:", parseError)
        console.error("Response text:", responseText)
        // Fall back to mock data
        return this.getMockResponse<T>(action, data)
      }

      if (!result.success && result.error === "UNAUTHORIZED") {
        this.clearAuth()
        throw new Error("Session expired. Please log in again.")
      }

      return result
    } catch (error) {
      console.error("GAS API Error:", error)

      // For development, fall back to mock data instead of failing
      console.warn("Falling back to mock data due to GAS error")
      return this.getMockResponse<T>(action, data)
    }
  }

  private getMockResponse<T>(action: string, data?: any): GoogleAppsScriptResponse<T> {
    console.log("Using mock response for action:", action)

    switch (action) {
      case "auth_login":
        if (data?.email === "demo@jax.com" && data?.password === "demo123") {
          const mockUser: AuthUser = { ...MOCK_USER }
          this.setAuth("mock-token-123", mockUser)
          return { success: true, data: { user: mockUser, token: "mock-token-123" } as any }
        }
        return { success: false, error: "Invalid credentials. Try demo@jax.com / demo123" }

      case "auth_register":
        const newUser: AuthUser = {
          ...MOCK_USER,
          id: "new-user-" + Date.now(),
          email: data?.email || "user@example.com",
          name: data?.name || "New User",
          membershipTier: "free",
          joinDate: new Date().toISOString(),
          totalTrades: 0,
          winRate: 0,
          totalPnL: 0,
        }
        const token = "mock-token-" + Date.now()
        this.setAuth(token, newUser)
        return { success: true, data: { user: newUser, token } as any }

      case "user_get_profile":
        const cachedUser = this.getCachedUser()
        if (cachedUser) {
          return { success: true, data: cachedUser as any }
        }
        return { success: false, error: "UNAUTHORIZED" }

      case "jax_get_picks":
        return { success: true, data: MOCK_JAX_PICKS as any }

      case "jax_get_accuracy":
        return { success: true, data: MOCK_JAX_ACCURACY as any }

      case "platform_get_apps":
        return { success: true, data: MOCK_PLATFORM_APPS as any }

      case "user_update_preferences":
        const updatedUser = { ...MOCK_USER, preferences: { ...MOCK_USER.preferences, ...data } }
        if (typeof window !== "undefined") {
          localStorage.setItem("gas_user", JSON.stringify(updatedUser))
        }
        return { success: true, data: updatedUser as any }

      case "platform_log_usage":
        return { success: true, data: {} as any }

      case "auth_logout":
        this.clearAuth()
        return { success: true, data: {} as any }

      case "auth_refresh":
        const currentUser = this.getCachedUser()
        if (currentUser) {
          return { success: true, data: { user: currentUser, token: this.authToken } as any }
        }
        return { success: false, error: "UNAUTHORIZED" }

      default:
        return { success: true, data: null as any }
    }
  }

  private setAuth(token: string, user: AuthUser) {
    this.authToken = token
    if (typeof window !== "undefined") {
      localStorage.setItem("gas_auth_token", token)
      localStorage.setItem("gas_user", JSON.stringify(user))
    }
  }

  private clearAuth() {
    this.authToken = null
    if (typeof window !== "undefined") {
      localStorage.removeItem("gas_auth_token")
      localStorage.removeItem("gas_user")
    }
  }

  // Auth methods
  async login(email: string, password: string): Promise<GoogleAppsScriptResponse<{ user: AuthUser; token: string }>> {
    const result = await this.makeRequest<{ user: AuthUser; token: string }>(
      "auth_login",
      {
        email,
        password,
      },
      false,
    )

    if (result.success && result.data) {
      this.setAuth(result.data.token, result.data.user)
    }

    return result
  }

  async register(userData: {
    email: string
    password: string
    name: string
    referralCode?: string
  }): Promise<GoogleAppsScriptResponse<{ user: AuthUser; token: string }>> {
    const result = await this.makeRequest<{ user: AuthUser; token: string }>("auth_register", userData, false)

    if (result.success && result.data) {
      this.setAuth(result.data.token, result.data.user)
    }

    return result
  }

  async logout(): Promise<void> {
    await this.makeRequest("auth_logout")
    this.clearAuth()
  }

  async refreshSession(): Promise<GoogleAppsScriptResponse<{ user: AuthUser; token: string }>> {
    const result = await this.makeRequest<{ user: AuthUser; token: string }>("auth_refresh")

    if (result.success && result.data) {
      this.setAuth(result.data.token, result.data.user)
    }

    return result
  }

  // User methods
  async getUserProfile(): Promise<GoogleAppsScriptResponse<AuthUser>> {
    return this.makeRequest<AuthUser>("user_get_profile")
  }

  async updateUserProfile(updates: Partial<AuthUser>): Promise<GoogleAppsScriptResponse<AuthUser>> {
    const result = await this.makeRequest<AuthUser>("user_update_profile", updates)

    if (result.success && result.data && typeof window !== "undefined") {
      localStorage.setItem("gas_user", JSON.stringify(result.data))
    }

    return result
  }

  async updateUserPreferences(preferences: Partial<AuthUser["preferences"]>): Promise<GoogleAppsScriptResponse> {
    return this.makeRequest("user_update_preferences", preferences)
  }

  // JAX methods
  async getJaxAccuracy(): Promise<GoogleAppsScriptResponse<JaxAccuracy>> {
    return this.makeRequest<JaxAccuracy>("jax_get_accuracy")
  }

  async getJaxPicks(limit?: number): Promise<GoogleAppsScriptResponse<JaxPick[]>> {
    return this.makeRequest<JaxPick[]>("jax_get_picks", { limit })
  }

  async createJaxPick(pick: Omit<JaxPick, "id" | "dateCreated">): Promise<GoogleAppsScriptResponse<JaxPick>> {
    return this.makeRequest<JaxPick>("jax_create_pick", pick)
  }

  async updateJaxPick(id: string, updates: Partial<JaxPick>): Promise<GoogleAppsScriptResponse<JaxPick>> {
    return this.makeRequest<JaxPick>("jax_update_pick", { id, updates })
  }

  // Platform methods
  async getPlatformApps(): Promise<GoogleAppsScriptResponse<PlatformApp[]>> {
    return this.makeRequest<PlatformApp[]>("platform_get_apps", {}, false)
  }

  async logAppUsage(appId: string): Promise<GoogleAppsScriptResponse> {
    return this.makeRequest("platform_log_usage", { appId })
  }

  // Utility methods
  isAuthenticated(): boolean {
    return !!this.authToken
  }

  getCachedUser(): AuthUser | null {
    if (typeof window !== "undefined") {
      const userStr = localStorage.getItem("gas_user")
      return userStr ? JSON.parse(userStr) : null
    }
    return null
  }

  // Check if Google Apps Script is configured
  isConfigured(): boolean {
    return this.isEnabled
  }

  // Get demo credentials for testing
  getDemoCredentials() {
    return {
      email: "demo@jax.com",
      password: "demo123",
    }
  }

  // Real-time updates simulation
  startRealTimeUpdates(callback: (data: any) => void, interval = 30000) {
    const pollForUpdates = async () => {
      try {
        const result = await this.makeRequest("realtime_get_updates")
        if (result.success && result.data) {
          callback(result.data)
        }
      } catch (error) {
        console.error("Real-time update error:", error)
      }
    }

    // Initial poll
    pollForUpdates()

    // Set up interval
    const intervalId = setInterval(pollForUpdates, interval)

    // Return cleanup function
    return () => clearInterval(intervalId)
  }
}

export const gasClient = new GoogleAppsScriptClient()
