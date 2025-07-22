// JAX Platform - Google Apps Script Backend
// Deploy this as a web app with execute permissions set to "Anyone"

// Declare variables
var ContentService = ContentService
var SpreadsheetApp = SpreadsheetApp
var Utilities = Utilities

// Configuration
const CONFIG = {
  API_KEY: "jax-platform-2024", // Change this to a secure key
  JWT_SECRET: "jax-secret-2024", // Change this to a secure secret
  SESSION_DURATION: 7 * 24 * 60 * 60 * 1000, // 7 days in milliseconds
}

// Sheet names
const SHEETS = {
  USERS: "Users",
  JAX_PICKS: "JaxPicks",
  PLATFORM_APPS: "PlatformApps",
  USER_SESSIONS: "UserSessions",
  USAGE_LOGS: "UsageLogs",
}

// Main entry point for all API calls
function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents)
    const { action, data: requestData, apiKey, authToken, timestamp } = data

    // Verify API key
    if (apiKey !== CONFIG.API_KEY) {
      return createResponse(false, null, "Invalid API key")
    }

    // Route to appropriate handler
    switch (action) {
      // Authentication
      case "auth_login":
        return handleLogin(requestData)
      case "auth_register":
        return handleRegister(requestData)
      case "auth_logout":
        return handleLogout(authToken)
      case "auth_refresh":
        return handleRefreshSession(authToken)

      // User Profile
      case "user_get_profile":
        return handleGetUserProfile(authToken)
      case "user_update_profile":
        return handleUpdateUserProfile(authToken, requestData)
      case "user_update_preferences":
        return handleUpdateUserPreferences(authToken, requestData)

      // JAX Picks
      case "jax_get_picks":
        return handleGetJaxPicks(authToken, requestData)
      case "jax_create_pick":
        return handleCreateJaxPick(authToken, requestData)
      case "jax_update_pick":
        return handleUpdateJaxPick(authToken, requestData)
      case "jax_get_accuracy":
        return handleGetJaxAccuracy(authToken)

      // Platform Apps
      case "platform_get_apps":
        return handleGetPlatformApps()
      case "platform_log_usage":
        return handleLogAppUsage(authToken, requestData)

      // Real-time updates
      case "realtime_get_updates":
        return handleGetRealTimeUpdates(authToken)

      default:
        return createResponse(false, null, "Unknown action: " + action)
    }
  } catch (error) {
    console.error("API Error:", error)
    return createResponse(false, null, "Internal server error: " + error.message)
  }
}

// Utility Functions
function createResponse(success, data = null, error = null, message = null) {
  const response = { success }
  if (data !== null) response.data = data
  if (error) response.error = error
  if (message) response.message = message

  return ContentService.createTextOutput(JSON.stringify(response)).setMimeType(ContentService.MimeType.JSON)
}

function getOrCreateSheet(sheetName) {
  const ss = SpreadsheetApp.getActiveSpreadsheet()
  let sheet = ss.getSheetByName(sheetName)

  if (!sheet) {
    sheet = ss.insertSheet(sheetName)
    initializeSheet(sheet, sheetName)
  }

  return sheet
}

function initializeSheet(sheet, sheetName) {
  switch (sheetName) {
    case SHEETS.USERS:
      sheet
        .getRange(1, 1, 1, 13)
        .setValues([
          [
            "ID",
            "Email",
            "Name",
            "PasswordHash",
            "Avatar",
            "MembershipTier",
            "JoinDate",
            "TotalTrades",
            "WinRate",
            "TotalPnL",
            "IsActive",
            "LastLogin",
            "Preferences",
          ],
        ])
      break

    case SHEETS.JAX_PICKS:
      sheet
        .getRange(1, 1, 1, 15)
        .setValues([
          [
            "ID",
            "Symbol",
            "Name",
            "EntryPrice",
            "TargetPrice",
            "StopLoss",
            "Confidence",
            "Reasoning",
            "Status",
            "DateCreated",
            "DateResolved",
            "ActualExit",
            "PnL",
            "Stage",
            "CreatedBy",
          ],
        ])
      initializeJaxPicks(sheet)
      break

    case SHEETS.PLATFORM_APPS:
      sheet
        .getRange(1, 1, 1, 9)
        .setValues([["ID", "Name", "Description", "Icon", "Color", "URL", "Category", "RequiredTier", "IsExternal"]])
      initializePlatformApps(sheet)
      break

    case SHEETS.USER_SESSIONS:
      sheet.getRange(1, 1, 1, 5).setValues([["Token", "UserID", "CreatedAt", "ExpiresAt", "LastUsed"]])
      break

    case SHEETS.USAGE_LOGS:
      sheet.getRange(1, 1, 1, 4).setValues([["UserID", "AppID", "Timestamp", "SessionDuration"]])
      break
  }
}

function initializeJaxPicks(sheet) {
  const samplePicks = [
    [
      "pick_001",
      "BTC",
      "Bitcoin",
      43250,
      48000,
      41000,
      85,
      "Strong technical breakout with high volume confirmation. RSI showing bullish divergence.",
      "active",
      "2024-01-15T10:30:00Z",
      "",
      "",
      "",
      1,
      "JAX",
    ],
    [
      "pick_002",
      "ETH",
      "Ethereum",
      2650,
      2950,
      2450,
      78,
      "DEX activity surge indicates bullish momentum. Layer 2 adoption accelerating.",
      "hit",
      "2024-01-14T14:20:00Z",
      "2024-01-16T09:15:00Z",
      2920,
      10.2,
      1,
      "JAX",
    ],
    [
      "pick_003",
      "SOL",
      "Solana",
      98.5,
      125,
      85,
      82,
      "Network activity at ATH. Major DeFi protocols launching on Solana.",
      "active",
      "2024-01-13T16:45:00Z",
      "",
      "",
      "",
      2,
      "JAX",
    ],
    [
      "pick_004",
      "AVAX",
      "Avalanche",
      35.2,
      45,
      30,
      75,
      "Subnet activity increasing. Institutional adoption growing.",
      "stopped",
      "2024-01-12T11:30:00Z",
      "2024-01-14T08:20:00Z",
      30.1,
      -14.5,
      2,
      "JAX",
    ],
    [
      "pick_005",
      "MATIC",
      "Polygon",
      0.85,
      1.15,
      0.75,
      88,
      "zkEVM launch creating massive bullish momentum. Enterprise partnerships expanding.",
      "active",
      "2024-01-11T13:15:00Z",
      "",
      "",
      "",
      3,
      "JAX",
    ],
    [
      "pick_006",
      "LINK",
      "Chainlink",
      14.2,
      18.5,
      12.8,
      79,
      "CCIP adoption accelerating. Major banks integrating Chainlink oracles.",
      "hit",
      "2024-01-10T09:45:00Z",
      "2024-01-15T14:30:00Z",
      17.8,
      25.4,
      3,
      "JAX",
    ],
    [
      "pick_007",
      "ARB",
      "Arbitrum",
      1.25,
      1.65,
      1.05,
      83,
      "Layer 2 TVL hitting new highs. Gaming ecosystem exploding on Arbitrum.",
      "active",
      "2024-01-09T15:20:00Z",
      "",
      "",
      "",
      4,
      "JAX",
    ],
    [
      "pick_008",
      "OP",
      "Optimism",
      2.15,
      2.85,
      1.85,
      76,
      "Superchain narrative gaining traction. Major protocols migrating to OP Stack.",
      "active",
      "2024-01-08T12:10:00Z",
      "",
      "",
      "",
      4,
      "JAX",
    ],
  ]

  sheet.getRange(2, 1, samplePicks.length, samplePicks[0].length).setValues(samplePicks)
}

function initializePlatformApps(sheet) {
  const apps = [
    [
      "crypto-dashboard",
      "JAX Crypto Dashboard",
      "Real-time crypto trading signals and market analysis",
      "📊",
      "bg-blue-600",
      "/",
      "trading",
      "free",
      false,
    ],
    [
      "portfolio-tracker",
      "Portfolio Tracker",
      "Track your investments and performance metrics",
      "💼",
      "bg-green-600",
      "/portfolio",
      "trading",
      "herd",
      false,
    ],
    [
      "market-scanner",
      "Market Scanner",
      "Advanced market scanning and screening tools",
      "🔍",
      "bg-purple-600",
      "/scanner",
      "analytics",
      "herd",
      false,
    ],
    [
      "trading-signals",
      "Trading Signals",
      "AI-powered trading signals and alerts",
      "📡",
      "bg-orange-600",
      "/signals",
      "trading",
      "pro",
      false,
    ],
    [
      "whale-tracker",
      "Whale Tracker",
      "Track large wallet movements and whale activity",
      "🐋",
      "bg-cyan-600",
      "/whale-tracker",
      "analytics",
      "pro",
      false,
    ],
    [
      "options-flow",
      "Options Flow",
      "Real-time options and derivatives flow analysis",
      "📈",
      "bg-red-600",
      "/options-flow",
      "analytics",
      "elite",
      false,
    ],
    [
      "ai-analyzer",
      "AI Trade Analyzer",
      "Advanced AI analysis for trade optimization",
      "🤖",
      "bg-indigo-600",
      "/ai-analyzer",
      "tools",
      "elite",
      false,
    ],
    [
      "community-hub",
      "Community Hub",
      "Connect with other traders and share insights",
      "👥",
      "bg-pink-600",
      "/community",
      "community",
      "free",
      false,
    ],
    [
      "education-center",
      "Education Center",
      "Learn trading strategies and market analysis",
      "🎓",
      "bg-yellow-600",
      "/education",
      "tools",
      "free",
      false,
    ],
    [
      "pricing",
      "Pricing & Plans",
      "View and manage your subscription plans",
      "💳",
      "bg-emerald-600",
      "/pricing",
      "account",
      "free",
      false,
    ],
  ]

  sheet.getRange(2, 1, apps.length, apps[0].length).setValues(apps)
}

// Authentication Handlers
function handleLogin(data) {
  const { email, password } = data

  if (!email || !password) {
    return createResponse(false, null, "Email and password are required")
  }

  const sheet = getOrCreateSheet(SHEETS.USERS)
  const users = sheet.getDataRange().getValues()

  // Find user by email
  for (let i = 1; i < users.length; i++) {
    const user = users[i]
    if (user[1] === email && verifyPassword(password, user[3])) {
      const sessionToken = createSession(user[0])
      const userProfile = {
        id: user[0],
        email: user[1],
        name: user[2],
        avatar: user[4],
        membershipTier: user[5],
        joinDate: user[6],
        totalTrades: user[7],
        winRate: user[8],
        totalPnL: user[9],
        isActive: user[10],
        lastLogin: new Date().toISOString(),
        preferences: JSON.parse(
          user[12] || '{"audioEnabled":false,"audioVolume":0.5,"notifications":true,"theme":"light","timezone":"UTC"}',
        ),
      }

      // Update last login
      sheet.getRange(i + 1, 12).setValue(userProfile.lastLogin)

      return createResponse(true, { user: userProfile, token: sessionToken })
    }
  }

  return createResponse(false, null, "Invalid email or password")
}

function handleRegister(data) {
  const { email, password, name, referralCode } = data

  if (!email || !password || !name) {
    return createResponse(false, null, "Name, email, and password are required")
  }

  const sheet = getOrCreateSheet(SHEETS.USERS)
  const users = sheet.getDataRange().getValues()

  // Check if email already exists
  for (let i = 1; i < users.length; i++) {
    if (users[i][1] === email) {
      return createResponse(false, null, "Email already registered")
    }
  }

  const userId = Utilities.getUuid()
  const passwordHash = hashPassword(password)
  const joinDate = new Date().toISOString()
  const defaultPreferences = {
    audioEnabled: false,
    audioVolume: 0.5,
    notifications: true,
    theme: "light",
    timezone: "UTC",
  }

  const newUser = [
    userId,
    email,
    name,
    passwordHash,
    "", // avatar
    "free", // membershipTier
    joinDate,
    0, // totalTrades
    0, // winRate
    0, // totalPnL
    true, // isActive
    joinDate, // lastLogin
    JSON.stringify(defaultPreferences),
  ]

  sheet.appendRow(newUser)

  const sessionToken = createSession(userId)
  const userProfile = {
    id: userId,
    email,
    name,
    avatar: "",
    membershipTier: "free",
    joinDate,
    totalTrades: 0,
    winRate: 0,
    totalPnL: 0,
    isActive: true,
    lastLogin: joinDate,
    preferences: defaultPreferences,
  }

  return createResponse(true, { user: userProfile, token: sessionToken }, null, "Account created successfully")
}

function handleLogout(sessionToken) {
  if (sessionToken) {
    const sheet = getOrCreateSheet(SHEETS.USER_SESSIONS)
    const sessions = sheet.getDataRange().getValues()

    for (let i = 1; i < sessions.length; i++) {
      if (sessions[i][0] === sessionToken) {
        sheet.deleteRow(i + 1)
        break
      }
    }
  }

  return createResponse(true, null, null, "Logged out successfully")
}

function handleRefreshSession(sessionToken) {
  const userId = validateSession(sessionToken)
  if (!userId) {
    return createResponse(false, null, "UNAUTHORIZED")
  }

  const userProfile = getUserProfile(userId)
  if (!userProfile) {
    return createResponse(false, null, "User not found")
  }

  const newToken = createSession(userId)
  return createResponse(true, { user: userProfile, token: newToken })
}

// Session Management
function createSession(userId) {
  const token = Utilities.getUuid()
  const sheet = getOrCreateSheet(SHEETS.USER_SESSIONS)
  const now = new Date()
  const expiresAt = new Date(now.getTime() + CONFIG.SESSION_DURATION)

  sheet.appendRow([token, userId, now.toISOString(), expiresAt.toISOString(), now.toISOString()])

  return token
}

function validateSession(sessionToken) {
  if (!sessionToken) return null

  const sheet = getOrCreateSheet(SHEETS.USER_SESSIONS)
  const sessions = sheet.getDataRange().getValues()
  const now = new Date()

  for (let i = 1; i < sessions.length; i++) {
    const session = sessions[i]
    if (session[0] === sessionToken) {
      const expiresAt = new Date(session[3])
      if (now < expiresAt) {
        // Update last used
        sheet.getRange(i + 1, 5).setValue(now.toISOString())
        return session[1] // Return userId
      } else {
        // Session expired, delete it
        sheet.deleteRow(i + 1)
        return null
      }
    }
  }

  return null
}

// User Profile Handlers
function handleGetUserProfile(sessionToken) {
  const userId = validateSession(sessionToken)
  if (!userId) {
    return createResponse(false, null, "UNAUTHORIZED")
  }

  const userProfile = getUserProfile(userId)
  if (!userProfile) {
    return createResponse(false, null, "User not found")
  }

  return createResponse(true, userProfile)
}

function getUserProfile(userId) {
  const sheet = getOrCreateSheet(SHEETS.USERS)
  const users = sheet.getDataRange().getValues()

  for (let i = 1; i < users.length; i++) {
    const user = users[i]
    if (user[0] === userId) {
      return {
        id: user[0],
        email: user[1],
        name: user[2],
        avatar: user[4],
        membershipTier: user[5],
        joinDate: user[6],
        totalTrades: user[7],
        winRate: user[8],
        totalPnL: user[9],
        isActive: user[10],
        lastLogin: user[11],
        preferences: JSON.parse(
          user[12] || '{"audioEnabled":false,"audioVolume":0.5,"notifications":true,"theme":"light","timezone":"UTC"}',
        ),
      }
    }
  }

  return null
}

function handleUpdateUserProfile(sessionToken, data) {
  const userId = validateSession(sessionToken)
  if (!userId) {
    return createResponse(false, null, "UNAUTHORIZED")
  }

  const sheet = getOrCreateSheet(SHEETS.USERS)
  const users = sheet.getDataRange().getValues()

  for (let i = 1; i < users.length; i++) {
    const user = users[i]
    if (user[0] === userId) {
      // Update allowed fields
      if (data.name) sheet.getRange(i + 1, 3).setValue(data.name)
      if (data.avatar) sheet.getRange(i + 1, 5).setValue(data.avatar)
      if (data.membershipTier) sheet.getRange(i + 1, 6).setValue(data.membershipTier)

      const updatedUser = getUserProfile(userId)
      return createResponse(true, updatedUser, null, "Profile updated successfully")
    }
  }

  return createResponse(false, null, "User not found")
}

function handleUpdateUserPreferences(sessionToken, data) {
  const userId = validateSession(sessionToken)
  if (!userId) {
    return createResponse(false, null, "UNAUTHORIZED")
  }

  const sheet = getOrCreateSheet(SHEETS.USERS)
  const users = sheet.getDataRange().getValues()

  for (let i = 1; i < users.length; i++) {
    const user = users[i]
    if (user[0] === userId) {
      const currentPreferences = JSON.parse(
        user[12] || '{"audioEnabled":false,"audioVolume":0.5,"notifications":true,"theme":"light","timezone":"UTC"}',
      )
      const updatedPreferences = { ...currentPreferences, ...data }

      sheet.getRange(i + 1, 13).setValue(JSON.stringify(updatedPreferences))

      return createResponse(true, null, null, "Preferences updated successfully")
    }
  }

  return createResponse(false, null, "User not found")
}

// JAX Picks Handlers
function handleGetJaxPicks(sessionToken, data) {
  const userId = validateSession(sessionToken)
  if (!userId) {
    return createResponse(false, null, "UNAUTHORIZED")
  }

  const { limit = 50 } = data
  const sheet = getOrCreateSheet(SHEETS.JAX_PICKS)
  const picks = sheet.getDataRange().getValues()
  const result = []

  for (let i = 1; i < picks.length && result.length < limit; i++) {
    const pick = picks[i]
    result.push({
      id: pick[0],
      symbol: pick[1],
      name: pick[2],
      entryPrice: pick[3],
      targetPrice: pick[4],
      stopLoss: pick[5],
      confidence: pick[6],
      reasoning: pick[7],
      status: pick[8],
      dateCreated: pick[9],
      dateResolved: pick[10],
      actualExit: pick[11],
      pnl: pick[12],
      stage: pick[13],
    })
  }

  return createResponse(true, result.reverse()) // Most recent first
}

function handleCreateJaxPick(sessionToken, data) {
  const userId = validateSession(sessionToken)
  if (!userId) {
    return createResponse(false, null, "UNAUTHORIZED")
  }

  const sheet = getOrCreateSheet(SHEETS.JAX_PICKS)
  const pickId = Utilities.getUuid()
  const now = new Date().toISOString()

  const newPick = [
    pickId,
    data.symbol,
    data.name,
    data.entryPrice,
    data.targetPrice,
    data.stopLoss,
    data.confidence,
    data.reasoning,
    "active",
    now,
    "",
    "",
    "",
    data.stage || 1,
    userId,
  ]

  sheet.appendRow(newPick)

  return createResponse(
    true,
    {
      id: pickId,
      ...data,
      status: "active",
      dateCreated: now,
    },
    null,
    "JAX pick created successfully",
  )
}

function handleUpdateJaxPick(sessionToken, data) {
  const userId = validateSession(sessionToken)
  if (!userId) {
    return createResponse(false, null, "UNAUTHORIZED")
  }

  const { id, updates } = data
  const sheet = getOrCreateSheet(SHEETS.JAX_PICKS)
  const picks = sheet.getDataRange().getValues()

  for (let i = 1; i < picks.length; i++) {
    const pick = picks[i]
    if (pick[0] === id) {
      // Update fields
      if (updates.status) sheet.getRange(i + 1, 9).setValue(updates.status)
      if (updates.actualExit) sheet.getRange(i + 1, 12).setValue(updates.actualExit)
      if (updates.pnl) sheet.getRange(i + 1, 13).setValue(updates.pnl)
      if (updates.status === "hit" || updates.status === "stopped") {
        sheet.getRange(i + 1, 11).setValue(new Date().toISOString())
      }

      return createResponse(true, null, null, "JAX pick updated successfully")
    }
  }

  return createResponse(false, null, "JAX pick not found")
}

function handleGetJaxAccuracy(sessionToken) {
  const userId = validateSession(sessionToken)
  if (!userId) {
    return createResponse(false, null, "UNAUTHORIZED")
  }

  const sheet = getOrCreateSheet(SHEETS.JAX_PICKS)
  const picks = sheet.getDataRange().getValues()

  let totalPicks = 0
  let hitPicks = 0
  let totalReturn = 0
  let bestPick = { symbol: "", date: "", return: Number.NEGATIVE_INFINITY }
  let worstPick = { symbol: "", date: "", return: Number.POSITIVE_INFINITY }
  const monthlyStats = {}

  for (let i = 1; i < picks.length; i++) {
    const pick = picks[i]
    if (pick[8] === "hit" || pick[8] === "stopped") {
      totalPicks++
      const returnValue = pick[12] || 0
      totalReturn += returnValue

      if (pick[8] === "hit") hitPicks++

      if (returnValue > bestPick.return) {
        bestPick = { symbol: pick[1], date: pick[9], return: returnValue }
      }

      if (returnValue < worstPick.return) {
        worstPick = { symbol: pick[1], date: pick[9], return: returnValue }
      }

      // Monthly stats
      const month = new Date(pick[9]).toISOString().substring(0, 7)
      if (!monthlyStats[month]) {
        monthlyStats[month] = { picks: 0, hits: 0, totalReturn: 0 }
      }
      monthlyStats[month].picks++
      if (pick[8] === "hit") monthlyStats[month].hits++
      monthlyStats[month].totalReturn += returnValue
    }
  }

  const hitRate = totalPicks > 0 ? (hitPicks / totalPicks) * 100 : 0
  const winRate = totalPicks > 0 ? (hitPicks / totalPicks) * 100 : 0
  const avgReturn = totalPicks > 0 ? totalReturn / totalPicks : 0

  const monthlyStatsArray = Object.entries(monthlyStats)
    .map(([month, stats]) => ({
      month: new Date(month + "-01").toLocaleDateString("en-US", { year: "numeric", month: "short" }),
      picks: stats.picks,
      hits: stats.hits,
      returns: stats.totalReturn,
    }))
    .sort((a, b) => b.month.localeCompare(a.month))

  return createResponse(true, {
    totalPicks,
    hitRate,
    winRate,
    avgReturn,
    totalReturn,
    bestPick,
    worstPick,
    monthlyStats: monthlyStatsArray,
  })
}

// Platform Apps Handlers
function handleGetPlatformApps() {
  const sheet = getOrCreateSheet(SHEETS.PLATFORM_APPS)
  const apps = sheet.getDataRange().getValues()
  const result = []

  for (let i = 1; i < apps.length; i++) {
    const app = apps[i]
    result.push({
      id: app[0],
      name: app[1],
      description: app[2],
      icon: app[3],
      color: app[4],
      url: app[5],
      category: app[6],
      requiredTier: app[7],
      isExternal: app[8],
    })
  }

  return createResponse(true, result)
}

function handleLogAppUsage(sessionToken, data) {
  const userId = validateSession(sessionToken)
  if (!userId) {
    return createResponse(false, null, "UNAUTHORIZED")
  }

  const { appId } = data
  const sheet = getOrCreateSheet(SHEETS.USAGE_LOGS)
  const now = new Date().toISOString()

  sheet.appendRow([userId, appId, now, 0]) // 0 for session duration placeholder

  return createResponse(true, null, null, "Usage logged successfully")
}

// Real-time Updates Handler
function handleGetRealTimeUpdates(sessionToken) {
  const userId = validateSession(sessionToken)
  if (!userId) {
    return createResponse(false, null, "UNAUTHORIZED")
  }

  // Return mock real-time data
  const updates = {
    marketData: {
      btc: { price: 43250 + Math.random() * 1000 - 500, change24h: Math.random() * 10 - 5 },
      eth: { price: 2650 + Math.random() * 100 - 50, change24h: Math.random() * 8 - 4 },
    },
    newPicks: Math.floor(Math.random() * 3),
    activeAlerts: Math.floor(Math.random() * 5),
    timestamp: new Date().toISOString(),
  }

  return createResponse(true, updates)
}

// Password utilities
function hashPassword(password) {
  return Utilities.computeDigest(Utilities.DigestAlgorithm.SHA_256, password + CONFIG.JWT_SECRET)
    .map((byte) => (byte + 256) % 256)
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("")
}

function verifyPassword(password, hash) {
  return hashPassword(password) === hash
}
