"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import {
  BarChart3,
  TrendingUp,
  Wallet,
  Settings,
  Bell,
  User,
  CreditCard,
  Shield,
  HelpCircle,
  ChevronRight,
  ChevronLeft,
  Activity,
  PieChart,
  Target,
  Zap,
} from "lucide-react"

const menuItems = [
  {
    category: "Trading",
    items: [
      { icon: BarChart3, label: "Portfolio Overview", badge: "Live", color: "bg-green-500" },
      { icon: TrendingUp, label: "Market Analysis", badge: "New", color: "bg-blue-500" },
      { icon: Activity, label: "Trading Signals", badge: "24", color: "bg-orange-500" },
      { icon: Target, label: "Strategy Builder", badge: null, color: "bg-purple-500" },
    ],
  },
  {
    category: "Wallet & Assets",
    items: [
      { icon: Wallet, label: "My Wallet", badge: "$12.5K", color: "bg-emerald-500" },
      { icon: PieChart, label: "Asset Allocation", badge: null, color: "bg-cyan-500" },
      { icon: CreditCard, label: "Payment Methods", badge: "3", color: "bg-indigo-500" },
      { icon: Zap, label: "Quick Trade", badge: "Hot", color: "bg-red-500" },
    ],
  },
  {
    category: "Account",
    items: [
      { icon: User, label: "Profile Settings", badge: null, color: "bg-gray-500" },
      { icon: Bell, label: "Notifications", badge: "5", color: "bg-yellow-500" },
      { icon: Shield, label: "Security", badge: null, color: "bg-green-600" },
      { icon: Settings, label: "Preferences", badge: null, color: "bg-slate-500" },
    ],
  },
  {
    category: "Support",
    items: [{ icon: HelpCircle, label: "Help Center", badge: null, color: "bg-blue-600" }],
  },
]

interface RightSidebarProps {
  isCollapsed: boolean
  onToggle: () => void
}

export function RightSidebar({ isCollapsed, onToggle }: RightSidebarProps) {
  const [activeItem, setActiveItem] = useState<string | null>(null)

  return (
    <div
      className={`bg-white border-l border-gray-200 h-screen sticky top-0 overflow-y-auto transition-all duration-300 ease-in-out ${
        isCollapsed ? "w-16" : "w-80"
      }`}
    >
      <div className={`p-${isCollapsed ? "2" : "6"} transition-all duration-300`}>
        {/* Header with Toggle */}
        <div className="mb-6 flex items-center justify-between">
          {!isCollapsed && (
            <div>
              <h2 className="text-lg font-semibold text-gray-900">Dashboard Menu</h2>
              <p className="text-sm text-gray-500">Quick access to all features</p>
            </div>
          )}
          <Button variant="ghost" size="sm" onClick={onToggle} className="p-2 hover:bg-gray-100 transition-colors">
            {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </Button>
        </div>

        {/* Menu Categories */}
        <div className="space-y-6">
          {menuItems.map((category) => (
            <div key={category.category}>
              {!isCollapsed && (
                <h3 className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-3 transition-opacity duration-300">
                  {category.category}
                </h3>
              )}
              <div className="space-y-1">
                {category.items.map((item) => {
                  const IconComponent = item.icon
                  const isActive = activeItem === item.label

                  return (
                    <Button
                      key={item.label}
                      variant="ghost"
                      className={`w-full justify-start h-auto p-3 hover:bg-gray-50 transition-all duration-200 ${
                        isActive ? "bg-blue-50 border-l-2 border-blue-500" : ""
                      } ${isCollapsed ? "px-2" : ""}`}
                      onClick={() => setActiveItem(item.label)}
                      title={isCollapsed ? item.label : undefined}
                    >
                      <div className={`flex items-center ${isCollapsed ? "justify-center" : "justify-between"} w-full`}>
                        <div className={`flex items-center ${isCollapsed ? "justify-center" : "gap-3"}`}>
                          <div className={`p-2 rounded-lg ${item.color} text-white relative`}>
                            <IconComponent className="w-4 h-4" />
                            {item.badge && isCollapsed && (
                              <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></div>
                            )}
                          </div>
                          {!isCollapsed && (
                            <div className="text-left">
                              <p className="text-sm font-medium text-gray-900">{item.label}</p>
                            </div>
                          )}
                        </div>
                        {!isCollapsed && (
                          <div className="flex items-center gap-2">
                            {item.badge && (
                              <Badge
                                variant={item.badge === "Live" ? "default" : "secondary"}
                                className={`text-xs ${
                                  item.badge === "Live"
                                    ? "bg-green-500"
                                    : item.badge === "New"
                                      ? "bg-blue-500"
                                      : item.badge === "Hot"
                                        ? "bg-red-500"
                                        : "bg-gray-500"
                                } text-white`}
                              >
                                {item.badge}
                              </Badge>
                            )}
                            <ChevronRight className="w-4 h-4 text-gray-400" />
                          </div>
                        )}
                      </div>
                    </Button>
                  )
                })}
              </div>
              {category.category !== "Support" && !isCollapsed && <Separator className="mt-4" />}
            </div>
          ))}
        </div>

        {/* Quick Stats Card - Only show when expanded */}
        {!isCollapsed && (
          <Card className="mt-6 transition-all duration-300">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">Quick Stats</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-xs text-gray-500">Active Positions</span>
                <span className="text-sm font-semibold">5</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-xs text-gray-500">Total P&L</span>
                <span className="text-sm font-semibold text-green-600">+$2,847</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-xs text-gray-500">Win Rate</span>
                <span className="text-sm font-semibold">73%</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-xs text-gray-500">Alerts</span>
                <span className="text-sm font-semibold text-orange-600">3 New</span>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Action Buttons - Only show when expanded */}
        {!isCollapsed && (
          <div className="mt-6 space-y-3 transition-all duration-300">
            <Button className="w-full bg-blue-600 hover:bg-blue-700">
              <Zap className="w-4 h-4 mr-2" />
              Quick Trade
            </Button>
            <Button variant="outline" className="w-full bg-transparent">
              <Settings className="w-4 h-4 mr-2" />
              Settings
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
