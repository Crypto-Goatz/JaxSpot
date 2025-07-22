"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Target, Calendar, DollarSign, BarChart3, Trophy, Zap, RefreshCw } from "lucide-react"
import { useJaxAccuracy, useJaxPicks } from "@/lib/use-jax-data"
import { useAuth } from "@/lib/auth-context"

interface JaxAccuracyModalProps {
  isOpen: boolean
  onClose: () => void
}

export function JaxAccuracyModal({ isOpen, onClose }: JaxAccuracyModalProps) {
  const [activeTab, setActiveTab] = useState("overview")
  const { user, isAuthenticated } = useAuth()
  const { accuracy, isLoading: accuracyLoading, refetch: refetchAccuracy } = useJaxAccuracy()
  const { picks, isLoading: picksLoading, refetch: refetchPicks } = useJaxPicks(20)

  const handleRefresh = async () => {
    await Promise.all([refetchAccuracy(), refetchPicks()])
  }

  if (!isAuthenticated || !user) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Target className="w-5 h-5 text-green-500" />
              JAX Accuracy Tracker
            </DialogTitle>
          </DialogHeader>
          <div className="text-center py-8">
            <p className="text-gray-500 mb-4">Please sign in to view your JAX accuracy data</p>
            <Button onClick={onClose}>Close</Button>
          </div>
        </DialogContent>
      </Dialog>
    )
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
    }).format(amount)
  }

  const formatPercentage = (value: number) => {
    return `${value >= 0 ? "+" : ""}${value.toFixed(1)}%`
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "hit":
        return "bg-green-500"
      case "stopped":
        return "bg-red-500"
      case "active":
        return "bg-blue-500"
      case "cancelled":
        return "bg-gray-500"
      default:
        return "bg-gray-500"
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case "hit":
        return "Target Hit"
      case "stopped":
        return "Stop Loss"
      case "active":
        return "Active"
      case "cancelled":
        return "Cancelled"
      default:
        return status
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="flex items-center gap-2">
              <Target className="w-5 h-5 text-green-500" />
              JAX Accuracy Tracker
            </DialogTitle>
            <Button variant="outline" size="sm" onClick={handleRefresh} disabled={accuracyLoading || picksLoading}>
              <RefreshCw className={`w-4 h-4 mr-2 ${accuracyLoading || picksLoading ? "animate-spin" : ""}`} />
              Refresh
            </Button>
          </div>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="picks">Recent Picks</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {accuracyLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {[1, 2, 3].map((i) => (
                  <Card key={i} className="animate-pulse">
                    <CardContent className="p-6">
                      <div className="h-4 bg-gray-200 rounded mb-2"></div>
                      <div className="h-8 bg-gray-200 rounded"></div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : accuracy ? (
              <>
                {/* Key Metrics */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Card>
                    <CardContent className="p-6">
                      <div className="flex items-center gap-2 mb-2">
                        <Trophy className="w-5 h-5 text-yellow-500" />
                        <span className="text-sm font-medium text-gray-600">Win Rate</span>
                      </div>
                      <div className="text-2xl font-bold text-green-600">{accuracy.winRate.toFixed(1)}%</div>
                      <Progress value={accuracy.winRate} className="mt-2" />
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="p-6">
                      <div className="flex items-center gap-2 mb-2">
                        <Target className="w-5 h-5 text-blue-500" />
                        <span className="text-sm font-medium text-gray-600">Hit Rate</span>
                      </div>
                      <div className="text-2xl font-bold text-blue-600">{accuracy.hitRate.toFixed(1)}%</div>
                      <Progress value={accuracy.hitRate} className="mt-2" />
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="p-6">
                      <div className="flex items-center gap-2 mb-2">
                        <BarChart3 className="w-5 h-5 text-purple-500" />
                        <span className="text-sm font-medium text-gray-600">Total Picks</span>
                      </div>
                      <div className="text-2xl font-bold text-gray-900">{accuracy.totalPicks}</div>
                    </CardContent>
                  </Card>
                </div>

                {/* Performance Metrics */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <DollarSign className="w-5 h-5 text-green-500" />
                        Return Metrics
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Average Return</span>
                        <span
                          className={`font-semibold ${accuracy.avgReturn >= 0 ? "text-green-600" : "text-red-600"}`}
                        >
                          {formatPercentage(accuracy.avgReturn)}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Total Return</span>
                        <span
                          className={`font-semibold ${accuracy.totalReturn >= 0 ? "text-green-600" : "text-red-600"}`}
                        >
                          {formatPercentage(accuracy.totalReturn)}
                        </span>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Zap className="w-5 h-5 text-orange-500" />
                        Performance Grade
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-center">
                        <div className="text-4xl font-bold mb-2">
                          {accuracy.winRate >= 80
                            ? "A+"
                            : accuracy.winRate >= 70
                              ? "A"
                              : accuracy.winRate >= 60
                                ? "B+"
                                : accuracy.winRate >= 50
                                  ? "B"
                                  : "C"}
                        </div>
                        <p className="text-sm text-gray-600">
                          {accuracy.winRate >= 80
                            ? "Exceptional Performance"
                            : accuracy.winRate >= 70
                              ? "Excellent Performance"
                              : accuracy.winRate >= 60
                                ? "Good Performance"
                                : accuracy.winRate >= 50
                                  ? "Average Performance"
                                  : "Needs Improvement"}
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </>
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-500">No accuracy data available</p>
              </div>
            )}
          </TabsContent>

          <TabsContent value="picks" className="space-y-4">
            {picksLoading ? (
              <div className="space-y-4">
                {[1, 2, 3, 4, 5].map((i) => (
                  <Card key={i} className="animate-pulse">
                    <CardContent className="p-4">
                      <div className="flex justify-between items-start mb-2">
                        <div className="h-4 bg-gray-200 rounded w-24"></div>
                        <div className="h-6 bg-gray-200 rounded w-16"></div>
                      </div>
                      <div className="h-3 bg-gray-200 rounded w-full mb-2"></div>
                      <div className="h-3 bg-gray-200 rounded w-3/4"></div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : picks.length > 0 ? (
              <div className="space-y-4">
                {picks.map((pick) => (
                  <Card key={pick.id}>
                    <CardContent className="p-4">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h3 className="font-semibold">
                            {pick.name} ({pick.symbol})
                          </h3>
                          <p className="text-sm text-gray-600">
                            Entry: {formatCurrency(pick.entryPrice)} | Target: {formatCurrency(pick.targetPrice)} |
                            Stop: {formatCurrency(pick.stopLoss)}
                          </p>
                        </div>
                        <Badge className={`${getStatusColor(pick.status)} text-white`}>
                          {getStatusText(pick.status)}
                        </Badge>
                      </div>

                      <div className="mb-2">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-xs text-gray-500">Confidence</span>
                          <span className="text-xs font-semibold">{pick.confidence}%</span>
                        </div>
                        <Progress value={pick.confidence} className="h-2" />
                      </div>

                      <p className="text-sm text-gray-700 mb-2">{pick.reasoning}</p>

                      <div className="flex justify-between items-center text-xs text-gray-500">
                        <span>Created: {new Date(pick.dateCreated).toLocaleDateString()}</span>
                        {pick.pnl !== undefined && (
                          <span className={`font-semibold ${pick.pnl >= 0 ? "text-green-600" : "text-red-600"}`}>
                            P&L: {formatPercentage(pick.pnl)}
                          </span>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-500">No picks available</p>
              </div>
            )}
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            {accuracyLoading ? (
              <div className="animate-pulse space-y-4">
                <div className="h-64 bg-gray-200 rounded"></div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="h-32 bg-gray-200 rounded"></div>
                  <div className="h-32 bg-gray-200 rounded"></div>
                </div>
              </div>
            ) : accuracy?.monthlyStats ? (
              <>
                {/* Monthly Performance Chart */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Calendar className="w-5 h-5 text-blue-500" />
                      Monthly Performance
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {accuracy.monthlyStats.map((stat, index) => (
                        <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <div>
                            <p className="font-medium">{stat.month}</p>
                            <p className="text-sm text-gray-600">{stat.picks} picks</p>
                          </div>
                          <div className="text-right">
                            <p className="font-semibold">
                              {stat.hits}/{stat.picks} hits
                            </p>
                            <p className={`text-sm ${stat.returns >= 0 ? "text-green-600" : "text-red-600"}`}>
                              {formatPercentage(stat.returns)}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Additional Analytics */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Card>
                    <CardHeader>
                      <CardTitle>Best Month</CardTitle>
                    </CardHeader>
                    <CardContent>
                      {(() => {
                        const bestMonth = accuracy.monthlyStats.reduce((best, current) =>
                          current.returns > best.returns ? current : best,
                        )
                        return (
                          <div>
                            <p className="text-2xl font-bold text-green-600">{bestMonth.month}</p>
                            <p className="text-sm text-gray-600">{formatPercentage(bestMonth.returns)} return</p>
                          </div>
                        )
                      })()}
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Most Active Month</CardTitle>
                    </CardHeader>
                    <CardContent>
                      {(() => {
                        const mostActive = accuracy.monthlyStats.reduce((most, current) =>
                          current.picks > most.picks ? current : most,
                        )
                        return (
                          <div>
                            <p className="text-2xl font-bold text-blue-600">{mostActive.month}</p>
                            <p className="text-sm text-gray-600">{mostActive.picks} picks</p>
                          </div>
                        )
                      })()}
                    </CardContent>
                  </Card>
                </div>
              </>
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-500">No analytics data available</p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}
