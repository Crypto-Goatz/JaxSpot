"use client"

import { useState, useEffect, useCallback } from "react"
import { gasClient, type JaxPick, type JaxAccuracy } from "./google-apps-script-client"
import { useAuth } from "./auth-context"

export interface UseJaxPicksOptions {
  stage?: 1 | 2 | 3 | 4
  limit?: number
  refreshInterval?: number
}

export interface UseJaxPicksReturn {
  picks: JaxPick[]
  isLoading: boolean
  error: string | null
  refresh: () => Promise<void>
  getPicksByStage: (stage: 1 | 2 | 3 | 4) => JaxPick[]
  hasAccessToStage: (stage: 1 | 2 | 3 | 4) => boolean
}

export function useJaxPicks(options: UseJaxPicksOptions = {}): UseJaxPicksReturn {
  const { stage, limit, refreshInterval = 30000 } = options
  const { user } = useAuth()
  const [picks, setPicks] = useState<JaxPick[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const hasAccessToStage = useCallback(
    (stageNumber: 1 | 2 | 3 | 4): boolean => {
      if (!user) return stageNumber <= 2 // Free users can see stages 1-2

      switch (user.membershipTier) {
        case "free":
          return stageNumber <= 2
        case "herd":
          return stageNumber <= 2
        case "pro":
          return stageNumber <= 3
        case "elite":
          return true
        default:
          return stageNumber <= 2
      }
    },
    [user],
  )

  const getPicksByStage = useCallback(
    (stageNumber: 1 | 2 | 3 | 4): JaxPick[] => {
      return picks.filter((pick) => pick.stage === stageNumber)
    },
    [picks],
  )

  const fetchPicks = useCallback(async () => {
    try {
      setIsLoading(true)
      setError(null)

      const result = await gasClient.getJaxPicks(limit)

      if (result.success && result.data) {
        let filteredPicks = result.data

        // Filter by stage if specified
        if (stage) {
          filteredPicks = filteredPicks.filter((pick) => pick.stage === stage)
        }

        // Filter by access level - hide picks user doesn't have access to
        filteredPicks = filteredPicks.filter((pick) => hasAccessToStage(pick.stage))

        setPicks(filteredPicks)
      } else {
        setError(result.error || "Failed to fetch JAX picks")
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred")
    } finally {
      setIsLoading(false)
    }
  }, [stage, limit, hasAccessToStage])

  const refresh = useCallback(async () => {
    await fetchPicks()
  }, [fetchPicks])

  // Initial fetch
  useEffect(() => {
    fetchPicks()
  }, [fetchPicks])

  // Set up refresh interval
  useEffect(() => {
    if (refreshInterval > 0) {
      const interval = setInterval(fetchPicks, refreshInterval)
      return () => clearInterval(interval)
    }
  }, [fetchPicks, refreshInterval])

  return {
    picks,
    isLoading,
    error,
    refresh,
    getPicksByStage,
    hasAccessToStage,
  }
}

export interface UseJaxAccuracyReturn {
  accuracy: JaxAccuracy | null
  isLoading: boolean
  error: string | null
  refresh: () => Promise<void>
}

export function useJaxAccuracy(): UseJaxAccuracyReturn {
  const [accuracy, setAccuracy] = useState<JaxAccuracy | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchAccuracy = useCallback(async () => {
    try {
      setIsLoading(true)
      setError(null)

      const result = await gasClient.getJaxAccuracy()

      if (result.success && result.data) {
        setAccuracy(result.data)
      } else {
        setError(result.error || "Failed to fetch JAX accuracy")
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred")
    } finally {
      setIsLoading(false)
    }
  }, [])

  const refresh = useCallback(async () => {
    await fetchAccuracy()
  }, [fetchAccuracy])

  useEffect(() => {
    fetchAccuracy()
  }, [fetchAccuracy])

  return {
    accuracy,
    isLoading,
    error,
    refresh,
  }
}

// Hook for real-time updates
export function useJaxRealTimeUpdates() {
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null)
  const [isConnected, setIsConnected] = useState(false)

  useEffect(() => {
    const cleanup = gasClient.startRealTimeUpdates(
      (data) => {
        setLastUpdate(new Date())
        setIsConnected(true)

        // Dispatch custom event for components to listen to
        window.dispatchEvent(
          new CustomEvent("jax-data-update", {
            detail: data,
          }),
        )
      },
      30000, // 30 second intervals
    )

    setIsConnected(true)

    return () => {
      cleanup()
      setIsConnected(false)
    }
  }, [])

  return {
    lastUpdate,
    isConnected,
  }
}

// Hook for stage access management
export function useStageAccess() {
  const { user } = useAuth()

  const getAccessibleStages = useCallback((): number[] => {
    if (!user) return [1, 2]

    switch (user.membershipTier) {
      case "free":
        return [1, 2]
      case "herd":
        return [1, 2]
      case "pro":
        return [1, 2, 3]
      case "elite":
        return [1, 2, 3, 4]
      default:
        return [1, 2]
    }
  }, [user])

  const hasAccess = useCallback(
    (stage: number): boolean => {
      return getAccessibleStages().includes(stage)
    },
    [getAccessibleStages],
  )

  const getRestrictedStages = useCallback((): number[] => {
    const accessible = getAccessibleStages()
    return [1, 2, 3, 4].filter((stage) => !accessible.includes(stage))
  }, [getAccessibleStages])

  const getUpgradeMessage = useCallback((): string => {
    if (!user) return "Sign up to access more stages"

    switch (user.membershipTier) {
      case "free":
        return "Upgrade to Herd membership to access all stages"
      case "herd":
        return "Upgrade to Pro to access Stage 3"
      case "pro":
        return "Upgrade to Elite to access Stage 4"
      default:
        return "Upgrade your membership for full access"
    }
  }, [user])

  return {
    accessibleStages: getAccessibleStages(),
    restrictedStages: getRestrictedStages(),
    hasAccess,
    upgradeMessage: getUpgradeMessage(),
    currentTier: user?.membershipTier || "free",
  }
}
