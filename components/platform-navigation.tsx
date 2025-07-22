"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  ChevronRight,
  ChevronLeft,
  User,
  Settings,
  LogOut,
  Crown,
  Target,
  Bell,
  HelpCircle,
  ExternalLink,
  Volume2,
  LogIn,
} from "lucide-react"
import { useAuth } from "@/lib/auth-context"
import { usePlatformApps, useAppNavigation } from "@/lib/use-platform-apps"
import { useJaxAccuracy } from "@/lib/use-jax-data"
import { useUserPreferences } from "@/lib/auth-context"
import { AudioSettings } from "./audio-settings"
import { JaxAccuracyModal } from "./jax-accuracy-modal"
import { AuthModal } from "./auth-modal"

interface PlatformNavigationProps {
  isCollapsed: boolean
  onToggle: () => void
  currentAppId?: string
}

export function PlatformNavigation({
  isCollapsed,
  onToggle,
  currentAppId = "crypto-dashboard",
}: PlatformNavigationProps) {
  const [showAudioSettings, setShowAudioSettings] = useState(false)
  const [showJaxAccuracy, setShowJaxAccuracy] = useState(false)
  const [showAuthModal, setShowAuthModal] = useState(false)

  const { user, isAuthenticated, logout, isLoading: authLoading } = useAuth()
  const { getAppsByCategory, isLoading: appsLoading } = usePlatformApps()
  const { navigateToApp } = useAppNavigation(currentAppId)
  const { accuracy, isLoading: accuracyLoading } = useJaxAccuracy()
  const { preferences, updatePreferences } = useUserPreferences()

  // Sync audio preferences with audio manager
  useEffect(() => {
    if (preferences) {
      // Update audio manager with user preferences
      import("@/lib/audio-manager").then(({ audioManager }) => {
        audioManager.setEnabled(preferences.audioEnabled)
        audioManager.setVolume(preferences.audioVolume)
      })
    }
  }, [preferences])

  const appsByCategory = getAppsByCategory()

  const categoryConfig = {
    trading: { label: "Trading", icon: "📊" },
    analytics: { label: "Analytics", icon: "📈" },
    community: { label: "Community", icon: "👥" },
    tools: { label: "Tools", icon: "🛠️" },
    account: { label: "Account", icon: "👤" },
  }

  const getMembershipBadge = (tier: string) => {
    const badges = {
      free: { label: "Free", color: "bg-gray-500" },
      premium: { label: "Premium", color: "bg-blue-500" },
      pro: { label: "Pro", color: "bg-purple-500" },
      enterprise: { label: "Enterprise", color: "bg-yellow-500" },
    }
    return badges[tier as keyof typeof badges] || badges.free
  }

  const handleLogout = async () => {
    await logout()
  }

  const handleAudioSettingsUpdate = async (settings: { enabled: boolean; volume: number }) => {
    await updatePreferences({
      audioEnabled: settings.enabled,
      audioVolume: settings.volume,
    })
  }

  if (authLoading || appsLoading) {
    return (
      <div
        className={`bg-white border-l border-gray-200 h-screen sticky top-0 transition-all duration-300 ease-in-out ${
          isCollapsed ? "w-16" : "w-80"
        }`}
      >
        <div className="p-6 animate-pulse">
          <div className="h-4 bg-gray-200 rounded mb-4"></div>
          <div className="h-12 bg-gray-200 rounded mb-4"></div>
          <div className="space-y-2">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="h-8 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <>
      <div
        className={`bg-white border-l border-gray-200 h-screen sticky top-0 overflow-y-auto transition-all duration-300 ease-in-out ${
          isCollapsed ? "w-16" : "w-80"
        }`}
      >
        <div className={`p-${isCollapsed ? "2" : "6"} transition-all duration-300`}>
          {/* Header with User Profile */}
          <div className="mb-6">
            {!isCollapsed ? (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-semibold text-gray-900">Platform Hub</h2>
                  <Button variant="ghost" size="sm" onClick={onToggle} className="p-2 hover:bg-gray-100">
                    <ChevronLeft className="w-4 h-4" />
                  </Button>
                </div>

                {/* User Profile Card */}
                {isAuthenticated && user ? (
                  <Card className="bg-gradient-to-r from-blue-50 to-purple-50">
                    <CardContent className="p-4">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="w-full justify-start p-0 h-auto">
                            <div className="flex items-center gap-3 w-full">
                              <Avatar className="h-10 w-10">
                                <AvatarImage src={user.avatar || "/placeholder.svg"} alt={user.name} />
                                <AvatarFallback>
                                  {user.name
                                    .split(" ")
                                    .map((n) => n[0])
                                    .join("")}
                                </AvatarFallback>
                              </Avatar>
                              <div className="flex-1 text-left">
                                <p className="font-semibold text-sm">{user.name}</p>
                                <div className="flex items-center gap-2">
                                  <Badge
                                    className={`text-xs ${getMembershipBadge(user.membershipTier).color} text-white`}
                                  >
                                    {getMembershipBadge(user.membershipTier).label}
                                  </Badge>
                                  {user.membershipTier === "pro" && <Crown className="w-3 h-3 text-yellow-500" />}
                                </div>
                              </div>
                              <ChevronRight className="w-4 h-4 text-gray-400" />
                            </div>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="start" className="w-56">
                          <DropdownMenuLabel>My Account</DropdownMenuLabel>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem>
                            <User className="mr-2 h-4 w-4" />
                            Profile Settings
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Settings className="mr-2 h-4 w-4" />
                            Preferences
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Bell className="mr-2 h-4 w-4" />
                            Notifications
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem onClick={handleLogout}>
                            <LogOut className="mr-2 h-4 w-4" />
                            Sign Out
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </CardContent>
                  </Card>
                ) : (
                  <Card className="bg-gradient-to-r from-gray-50 to-blue-50">
                    <CardContent className="p-4">
                      <Button
                        onClick={() => setShowAuthModal(true)}
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                      >
                        <LogIn className="w-4 h-4 mr-2" />
                        Sign In / Sign Up
                      </Button>
                    </CardContent>
                  </Card>
                )}
              </div>
            ) : (
              <div className="flex flex-col items-center gap-4">
                <Button variant="ghost" size="sm" onClick={onToggle} className="p-2 hover:bg-gray-100">
                  <ChevronRight className="w-4 h-4" />
                </Button>
                {isAuthenticated && user ? (
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={user.avatar || "/placeholder.svg"} alt={user.name} />
                    <AvatarFallback className="text-xs">
                      {user.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                ) : (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowAuthModal(true)}
                    className="p-2 hover:bg-gray-100"
                  >
                    <LogIn className="w-4 h-4" />
                  </Button>
                )}
              </div>
            )}
          </div>

          {/* JAX Accuracy Button - Only show if authenticated */}
          {isAuthenticated && (
            <div className="mb-6">
              <Button
                onClick={() => setShowJaxAccuracy(true)}
                className={`w-full ${isCollapsed ? "px-2" : "justify-start"} bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-white`}
                title={isCollapsed ? "JAX Accuracy Tracker" : undefined}
                disabled={accuracyLoading}
              >
                {isCollapsed ? (
                  <Target className="w-4 h-4" />
                ) : (
                  <>
                    <Target className="w-4 h-4 mr-2" />
                    JAX Accuracy: {accuracy?.winRate?.toFixed(1) || "--"}%
                  </>
                )}
              </Button>
            </div>
          )}

          {/* Platform Apps */}
          <div className="space-y-6">
            {Object.entries(appsByCategory).map(([category, apps]) => (
              <div key={category}>
                {!isCollapsed && (
                  <h3 className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-3 flex items-center gap-2">
                    <span>{categoryConfig[category as keyof typeof categoryConfig]?.icon}</span>
                    {categoryConfig[category as keyof typeof categoryConfig]?.label}
                  </h3>
                )}
                <div className="space-y-1">
                  {apps.map((app) => {
                    const isActive = app.id === currentAppId

                    return (
                      <Button
                        key={app.id}
                        variant="ghost"
                        className={`w-full justify-start h-auto p-3 hover:bg-gray-50 transition-all duration-200 ${
                          isActive ? "bg-blue-50 border-l-2 border-blue-500" : ""
                        } ${isCollapsed ? "px-2" : ""}`}
                        onClick={() => navigateToApp(app)}
                        title={isCollapsed ? app.name : undefined}
                      >
                        <div
                          className={`flex items-center ${isCollapsed ? "justify-center" : "justify-between"} w-full`}
                        >
                          <div className={`flex items-center ${isCollapsed ? "justify-center" : "gap-3"}`}>
                            <div className={`p-2 rounded-lg ${app.color} text-white relative`}>
                              <span className="text-sm">{app.icon}</span>
                              {app.badge && isCollapsed && (
                                <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></div>
                              )}
                            </div>
                            {!isCollapsed && (
                              <div className="text-left">
                                <p className="text-sm font-medium text-gray-900">{app.name}</p>
                                <p className="text-xs text-gray-500">{app.description}</p>
                              </div>
                            )}
                          </div>
                          {!isCollapsed && (
                            <div className="flex items-center gap-2">
                              {app.badge && (
                                <Badge variant="secondary" className="text-xs bg-gray-100 text-gray-700">
                                  {app.badge}
                                </Badge>
                              )}
                              {app.url.startsWith("http") ? (
                                <ExternalLink className="w-4 h-4 text-gray-400" />
                              ) : (
                                <ChevronRight className="w-4 h-4 text-gray-400" />
                              )}
                            </div>
                          )}
                        </div>
                      </Button>
                    )
                  })}
                </div>
                {category !== "account" && !isCollapsed && <Separator className="mt-4" />}
              </div>
            ))}

            {/* Additional Settings */}
            <div>
              {!isCollapsed && (
                <h3 className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-3">Settings</h3>
              )}
              <div className="space-y-1">
                <Button
                  variant="ghost"
                  className={`w-full justify-start h-auto p-3 hover:bg-gray-50 transition-all duration-200 ${
                    isCollapsed ? "px-2" : ""
                  }`}
                  onClick={() => setShowAudioSettings(true)}
                  title={isCollapsed ? "Audio Settings" : undefined}
                >
                  <div className={`flex items-center ${isCollapsed ? "justify-center" : "justify-between"} w-full`}>
                    <div className={`flex items-center ${isCollapsed ? "justify-center" : "gap-3"}`}>
                      <div className="p-2 rounded-lg bg-purple-600 text-white">
                        <Volume2 className="w-4 h-4" />
                      </div>
                      {!isCollapsed && (
                        <div className="text-left">
                          <p className="text-sm font-medium text-gray-900">Audio Settings</p>
                        </div>
                      )}
                    </div>
                    {!isCollapsed && <ChevronRight className="w-4 h-4 text-gray-400" />}
                  </div>
                </Button>

                <Button
                  variant="ghost"
                  className={`w-full justify-start h-auto p-3 hover:bg-gray-50 transition-all duration-200 ${
                    isCollapsed ? "px-2" : ""
                  }`}
                  title={isCollapsed ? "Help Center" : undefined}
                >
                  <div className={`flex items-center ${isCollapsed ? "justify-center" : "justify-between"} w-full`}>
                    <div className={`flex items-center ${isCollapsed ? "justify-center" : "gap-3"}`}>
                      <div className="p-2 rounded-lg bg-blue-600 text-white">
                        <HelpCircle className="w-4 h-4" />
                      </div>
                      {!isCollapsed && (
                        <div className="text-left">
                          <p className="text-sm font-medium text-gray-900">Help Center</p>
                        </div>
                      )}
                    </div>
                    {!isCollapsed && <ChevronRight className="w-4 h-4 text-gray-400" />}
                  </div>
                </Button>
              </div>
            </div>
          </div>

          {/* Quick Stats Card - Only show when expanded and authenticated */}
          {!isCollapsed && isAuthenticated && user && (
            <Card className="mt-6 transition-all duration-300">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium">Your Performance</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-xs text-gray-500">Total Trades</span>
                  <span className="text-sm font-semibold">{user.totalTrades}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-xs text-gray-500">Win Rate</span>
                  <span className="text-sm font-semibold text-green-600">{user.winRate}%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-xs text-gray-500">Total P&L</span>
                  <span className="text-sm font-semibold text-green-600">+${user.totalPnL.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-xs text-gray-500">Member Since</span>
                  <span className="text-sm font-semibold">{new Date(user.joinDate).getFullYear()}</span>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {/* Modals */}
      <AudioSettings
        isOpen={showAudioSettings}
        onClose={() => setShowAudioSettings(false)}
        onSettingsUpdate={handleAudioSettingsUpdate}
      />
      <JaxAccuracyModal isOpen={showJaxAccuracy} onClose={() => setShowJaxAccuracy(false)} />
      <AuthModal isOpen={showAuthModal} onClose={() => setShowAuthModal(false)} />
    </>
  )
}
