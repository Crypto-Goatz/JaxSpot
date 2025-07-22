"use client"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Eye, Activity, ShoppingCart, CheckCircle } from "lucide-react"

interface StageFilterProps {
  activeStage: string | null
  onStageChange: (stage: string | null) => void
  stageCounts: {
    scanning: number
    watchlist: number
    ready: number
    purchased: number
  }
}

const stageConfig = {
  scanning: {
    title: "Scanning",
    icon: Eye,
    color: "bg-purple-500",
    hoverColor: "hover:bg-purple-600",
    activeColor: "bg-purple-600",
  },
  watchlist: {
    title: "Watchlist",
    icon: Activity,
    color: "bg-yellow-500",
    hoverColor: "hover:bg-yellow-600",
    activeColor: "bg-yellow-600",
  },
  ready: {
    title: "Ready to Buy",
    icon: ShoppingCart,
    color: "bg-orange-500",
    hoverColor: "hover:bg-orange-600",
    activeColor: "bg-orange-600",
  },
  purchased: {
    title: "Purchased",
    icon: CheckCircle,
    color: "bg-green-500",
    hoverColor: "hover:bg-green-600",
    activeColor: "bg-green-600",
  },
}

export function StageFilter({ activeStage, onStageChange, stageCounts }: StageFilterProps) {
  return (
    <div className="mb-6 lg:mb-8">
      <div className="flex flex-wrap gap-2 lg:gap-4">
        <Button
          variant={activeStage === null ? "default" : "outline"}
          onClick={() => onStageChange(null)}
          className="flex items-center gap-2 transition-all duration-200"
        >
          All Stages
          <Badge variant="secondary" className="ml-1">
            {Object.values(stageCounts).reduce((a, b) => a + b, 0)}
          </Badge>
        </Button>

        {Object.entries(stageConfig).map(([stageKey, config]) => {
          const StageIcon = config.icon
          const count = stageCounts[stageKey as keyof typeof stageCounts]
          const isActive = activeStage === stageKey

          return (
            <Button
              key={stageKey}
              variant="outline"
              onClick={() => onStageChange(stageKey)}
              className={`flex items-center gap-2 transition-all duration-200 ${
                isActive
                  ? `${config.activeColor} text-white border-transparent hover:${config.activeColor}`
                  : `${config.hoverColor} hover:text-white`
              }`}
            >
              <div className={`p-1 rounded ${isActive ? "bg-white/20" : config.color} text-white`}>
                <StageIcon className="w-3 h-3" />
              </div>
              <span className="hidden sm:inline">{config.title}</span>
              <Badge
                variant="secondary"
                className={`ml-1 ${isActive ? "bg-white/20 text-white" : "bg-gray-100 text-gray-700"}`}
              >
                {count}
              </Badge>
            </Button>
          )
        })}
      </div>
    </div>
  )
}
