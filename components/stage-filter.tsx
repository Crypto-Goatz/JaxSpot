"use client"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Eye, Activity, ShoppingCart, CheckCircle } from "lucide-react"

interface StageFilterProps {
  activeStage: string | null
  onStageChange: (stage: string | null) => void
  stageCounts: Record<string, number>
}

const stageConfig = {
  all: {
    title: "ALL STAGES",
    icon: null,
    color: "bg-gray-600",
    hoverColor: "hover:bg-gray-700",
  },
  scanning: {
    title: "SCANNING",
    icon: Eye,
    color: "bg-purple-500",
    hoverColor: "hover:bg-purple-600",
  },
  watchlist: {
    title: "WATCHLIST",
    icon: Activity,
    color: "bg-yellow-500",
    hoverColor: "hover:bg-yellow-600",
  },
  ready: {
    title: "READY TO BUY",
    icon: ShoppingCart,
    color: "bg-orange-500",
    hoverColor: "hover:bg-orange-600",
  },
  purchased: {
    title: "PURCHASED",
    icon: CheckCircle,
    color: "bg-green-500",
    hoverColor: "hover:bg-green-600",
  },
}

export function StageFilter({ activeStage, onStageChange, stageCounts }: StageFilterProps) {
  return (
    <div className="flex flex-wrap gap-2 mb-6 p-4 bg-white rounded-lg border border-gray-200 shadow-sm">
      {Object.entries(stageConfig).map(([stageKey, config]) => {
        const StageIcon = config.icon
        const isActive = activeStage === (stageKey === "all" ? null : stageKey)
        const count =
          stageKey === "all"
            ? Object.values(stageCounts).reduce((sum, count) => sum + count, 0)
            : stageCounts[stageKey] || 0

        return (
          <Button
            key={stageKey}
            variant={isActive ? "default" : "outline"}
            onClick={() => onStageChange(stageKey === "all" ? null : stageKey)}
            className={`flex items-center gap-2 transition-all duration-200 transform hover:scale-105 ${
              isActive
                ? `${config.color} text-white shadow-lg`
                : `hover:bg-gray-50 ${config.hoverColor} hover:text-white`
            }`}
          >
            {StageIcon && <StageIcon className="w-4 h-4" />}
            <span className="font-medium text-sm">{config.title}</span>
            <Badge variant="secondary" className={`ml-1 ${isActive ? "bg-white/20 text-white" : "bg-gray-100"}`}>
              {count}
            </Badge>
          </Button>
        )
      })}
    </div>
  )
}
