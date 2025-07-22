"use client"

import { useState, useEffect, useCallback } from "react"
import { gasClient, type PlatformApp } from "./google-apps-script-client"
import { useAuth } from "./auth-context"

export interface UsePlatformAppsOptions {
  category?: PlatformApp["category"]
  includeExternal?: boolean
}

export interface UsePlatformAppsReturn {
  apps: PlatformApp[]
  isLoading: boolean
  error: string | null
  refresh: () => Promise<void>
  getAppsByCategory: (category: PlatformApp["category"]) => PlatformApp[]
  getAccessibleApps: () => PlatformApp[]
  getRestrictedApps: () => PlatformApp[]
  hasAccessToApp: (app: PlatformApp) => boolean
}

export function usePlatformApps(options: UsePlatformAppsOptions = {}): UsePlatformAppsReturn {
  const { category, includeExternal = true } = options
  const { user } = useAuth()
  const [apps, setApps] = useState<PlatformApp[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const hasAccessToApp = useCallback(
    (app: PlatformApp): boolean => {
      if (!user) return app.requiredTier === "free"

      const tierHierarchy = {
        free: 0,
        herd: 1,
        pro: 2,
        elite: 3,
      }

      const userTierLevel = tierHierarchy[user.membershipTier] || 0
      const requiredTierLevel = tierHierarchy[app.requiredTier] || 0

      return userTierLevel >= requiredTierLevel
    },
    [user],
  )

  const getAppsByCategory = useCallback(
    (categoryFilter: PlatformApp["category"]): PlatformApp[] => {
      return apps.filter((app) => app.category === categoryFilter)
    },
    [apps],
  )

  const getAccessibleApps = useCallback((): PlatformApp[] => {
    return apps.filter((app) => hasAccessToApp(app))
  }, [apps, hasAccessToApp])

  const getRestrictedApps = useCallback((): PlatformApp[] => {
    return apps.filter((app) => !hasAccessToApp(app))
  }, [apps, hasAccessToApp])

  const fetchApps = useCallback(async () => {
    try {
      setIsLoading(true)
      setError(null)

      const result = await gasClient.getPlatformApps()

      if (result.success && result.data) {
        let filteredApps = result.data

        // Filter by category if specified
        if (category) {
          filteredApps = filteredApps.filter((app) => app.category === category)
        }

        // Filter external apps if not included
        if (!includeExternal) {
          filteredApps = filteredApps.filter((app) => !app.isExternal)
        }

        setApps(filteredApps)
      } else {
        setError(result.error || "Failed to fetch platform apps")
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred")
    } finally {
      setIsLoading(false)
    }
  }, [category, includeExternal])

  const refresh = useCallback(async () => {
    await fetchApps()
  }, [fetchApps])

  useEffect(() => {
    fetchApps()
  }, [fetchApps])

  return {
    apps,
    isLoading,
    error,
    refresh,
    getAppsByCategory,
    getAccessibleApps,
    getRestrictedApps,
    hasAccessToApp,
  }
}

// Hook for app navigation and usage tracking
export interface UseAppNavigationOptions {
  trackUsage?: boolean
}

export interface UseAppNavigationReturn {
  navigateToApp: (app: PlatformApp) => Promise<void>
  canAccessApp: (app: PlatformApp) => boolean
  getUpgradeMessage: (app: PlatformApp) => string
  logAppUsage: (appId: string) => Promise<void>
}

export function useAppNavigation(options: UseAppNavigationOptions = {}): UseAppNavigationReturn {
  const { trackUsage = true } = options
  const { user } = useAuth()

  const canAccessApp = useCallback(
    (app: PlatformApp): boolean => {
      if (!user) return app.requiredTier === "free"

      const tierHierarchy = {
        free: 0,
        herd: 1,
        pro: 2,
        elite: 3,
      }

      const userTierLevel = tierHierarchy[user.membershipTier] || 0
      const requiredTierLevel = tierHierarchy[app.requiredTier] || 0

      return userTierLevel >= requiredTierLevel
    },
    [user],
  )

  const getUpgradeMessage = useCallback(
    (app: PlatformApp): string => {
      if (!user) {
        return `Sign up to access ${app.name}`
      }

      const currentTier = user.membershipTier
      const requiredTier = app.requiredTier

      if (currentTier === requiredTier) {
        return `You have access to ${app.name}`
      }

      const upgradeMessages = {
        free: {
          herd: "Upgrade to Herd ($29/month) to access this feature",
          pro: "Upgrade to Pro ($49/month) to access this feature",
          elite: "Upgrade to Elite ($99/month) to access this feature",
        },
        herd: {
          pro: "Upgrade to Pro ($49/month) to access this feature",
          elite: "Upgrade to Elite ($99/month) to access this feature",
        },
        pro: {
          elite: "Upgrade to Elite ($99/month) to access this feature",
        },
      }

      return (
        upgradeMessages[currentTier as keyof typeof upgradeMessages]?.[
          requiredTier as keyof (typeof upgradeMessages)[keyof typeof upgradeMessages]
        ] || `Upgrade your membership to access ${app.name}`
      )
    },
    [user],
  )

  const logAppUsage = useCallback(
    async (appId: string): Promise<void> => {
      if (!trackUsage) return

      try {
        await gasClient.logAppUsage(appId)
      } catch (error) {
        console.error("Failed to log app usage:", error)
      }
    },
    [trackUsage],
  )

  const navigateToApp = useCallback(
    async (app: PlatformApp): Promise<void> => {
      // Check access
      if (!canAccessApp(app)) {
        // Redirect to pricing page for upgrade
        window.location.href = "/pricing"
        return
      }

      // Log usage
      if (trackUsage) {
        await logAppUsage(app.id)
      }

      // Navigate to app
      if (app.isExternal) {
        window.open(app.url, "_blank", "noopener,noreferrer")
      } else {
        window.location.href = app.url
      }
    },
    [canAccessApp, trackUsage, logAppUsage],
  )

  return {
    navigateToApp,
    canAccessApp,
    getUpgradeMessage,
    logAppUsage,
  }
}

// Hook for app categories and filtering
export function useAppCategories() {
  const { apps } = usePlatformApps()

  const getCategories = useCallback((): PlatformApp["category"][] => {
    const categories = new Set(apps.map((app) => app.category))
    return Array.from(categories).sort()
  }, [apps])

  const getAppCountByCategory = useCallback((): Record<PlatformApp["category"], number> => {
    const counts = {} as Record<PlatformApp["category"], number>

    apps.forEach((app) => {
      counts[app.category] = (counts[app.category] || 0) + 1
    })

    return counts
  }, [apps])

  const getCategoryDisplayName = useCallback((category: PlatformApp["category"]): string => {
    const displayNames = {
      trading: "Trading",
      analytics: "Analytics",
      community: "Community",
      tools: "Tools",
      account: "Account",
    }

    return displayNames[category] || category
  }, [])

  const getCategoryIcon = useCallback((category: PlatformApp["category"]): string => {
    const icons = {
      trading: "📈",
      analytics: "📊",
      community: "👥",
      tools: "🛠️",
      account: "⚙️",
    }

    return icons[category] || "📱"
  }, [])

  return {
    categories: getCategories(),
    appCountByCategory: getAppCountByCategory(),
    getCategoryDisplayName,
    getCategoryIcon,
  }
}

// Hook for app search and filtering
export interface UseAppSearchOptions {
  searchTerm?: string
  category?: PlatformApp["category"]
  accessibleOnly?: boolean
}

export function useAppSearch(options: UseAppSearchOptions = {}) {
  const { searchTerm = "", category, accessibleOnly = false } = options
  const { apps, hasAccessToApp } = usePlatformApps()

  const filteredApps = useCallback((): PlatformApp[] => {
    let filtered = apps

    // Filter by search term
    if (searchTerm) {
      const term = searchTerm.toLowerCase()
      filtered = filtered.filter(
        (app) =>
          app.name.toLowerCase().includes(term) ||
          app.description.toLowerCase().includes(term) ||
          app.category.toLowerCase().includes(term),
      )
    }

    // Filter by category
    if (category) {
      filtered = filtered.filter((app) => app.category === category)
    }

    // Filter by accessibility
    if (accessibleOnly) {
      filtered = filtered.filter((app) => hasAccessToApp(app))
    }

    return filtered
  }, [apps, searchTerm, category, accessibleOnly, hasAccessToApp])

  return {
    filteredApps: filteredApps(),
    resultCount: filteredApps().length,
    hasResults: filteredApps().length > 0,
  }
}
