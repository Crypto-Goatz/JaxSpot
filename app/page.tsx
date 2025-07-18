"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { TrendingUp, TrendingDown, Eye, ShoppingCart, CheckCircle, Activity } from "lucide-react"

interface CoinData {
  id: string
  name: string
  symbol: string
  icon: string
  price: number
  change24h: number
  score: number
  stage: "scanning" | "watchlist" | "ready" | "purchased"
  reasoning: string
  volume: string
  marketCap: string
  lastUpdated: Date
}

const initialCoins: CoinData[] = [
  // STAGE 1: SCANNING
  {
    id: "1",
    name: "Bitcoin",
    symbol: "BTC",
    icon: "₿",
    price: 43250.0,
    change24h: 2.5,
    score: 45,
    stage: "scanning",
    reasoning: "Monitoring on-chain metrics and sentiment analysis",
    volume: "$28.5B",
    marketCap: "$847B",
    lastUpdated: new Date(),
  },
  {
    id: "6",
    name: "Avalanche",
    symbol: "AVAX",
    icon: "🔺",
    price: 36.8,
    change24h: 4.1,
    score: 35,
    stage: "scanning",
    reasoning: "Below threshold, waiting for confirmation signals",
    volume: "$580M",
    marketCap: "$13.5B",
    lastUpdated: new Date(),
  },
  {
    id: "7",
    name: "Cardano",
    symbol: "ADA",
    icon: "₳",
    price: 0.52,
    change24h: -1.8,
    score: 42,
    stage: "scanning",
    reasoning: "Development activity increasing, monitoring for breakout",
    volume: "$450M",
    marketCap: "$18.2B",
    lastUpdated: new Date(),
  },
  {
    id: "8",
    name: "Dogecoin",
    symbol: "DOGE",
    icon: "Ð",
    price: 0.085,
    change24h: 1.2,
    score: 38,
    stage: "scanning",
    reasoning: "Social sentiment mixed, waiting for technical confirmation",
    volume: "$680M",
    marketCap: "$12.1B",
    lastUpdated: new Date(),
  },
  {
    id: "9",
    name: "Litecoin",
    symbol: "LTC",
    icon: "Ł",
    price: 72.5,
    change24h: 0.8,
    score: 41,
    stage: "scanning",
    reasoning: "Consolidation pattern forming, monitoring volume",
    volume: "$420M",
    marketCap: "$5.4B",
    lastUpdated: new Date(),
  },
  {
    id: "10",
    name: "Shiba Inu",
    symbol: "SHIB",
    icon: "🐕",
    price: 0.0000098,
    change24h: -2.1,
    score: 33,
    stage: "scanning",
    reasoning: "High volatility, waiting for stabilization signals",
    volume: "$180M",
    marketCap: "$5.8B",
    lastUpdated: new Date(),
  },

  // STAGE 2: WATCHLIST
  {
    id: "2",
    name: "Ethereum",
    symbol: "ETH",
    icon: "Ξ",
    price: 2650.0,
    change24h: -1.2,
    score: 75,
    stage: "watchlist",
    reasoning: "High DEX activity detected, positive sentiment score",
    volume: "$15.2B",
    marketCap: "$318B",
    lastUpdated: new Date(),
  },
  {
    id: "5",
    name: "Polygon",
    symbol: "MATIC",
    icon: "⬟",
    price: 0.85,
    change24h: -0.8,
    score: 62,
    stage: "watchlist",
    reasoning: "Accumulation phase detected, monitoring for breakout",
    volume: "$320M",
    marketCap: "$7.8B",
    lastUpdated: new Date(),
  },
  {
    id: "11",
    name: "Binance Coin",
    symbol: "BNB",
    icon: "🟡",
    price: 315.8,
    change24h: 2.3,
    score: 68,
    stage: "watchlist",
    reasoning: "Exchange volume increasing, bullish momentum building",
    volume: "$1.2B",
    marketCap: "$47.2B",
    lastUpdated: new Date(),
  },
  {
    id: "12",
    name: "XRP",
    symbol: "XRP",
    icon: "◉",
    price: 0.63,
    change24h: 3.7,
    score: 71,
    stage: "watchlist",
    reasoning: "Legal clarity improving, institutional interest growing",
    volume: "$1.8B",
    marketCap: "$34.5B",
    lastUpdated: new Date(),
  },
  {
    id: "13",
    name: "Polkadot",
    symbol: "DOT",
    icon: "●",
    price: 7.2,
    change24h: 1.9,
    score: 66,
    stage: "watchlist",
    reasoning: "Parachain activity increasing, ecosystem growth positive",
    volume: "$290M",
    marketCap: "$9.2B",
    lastUpdated: new Date(),
  },
  {
    id: "14",
    name: "Uniswap",
    symbol: "UNI",
    icon: "🦄",
    price: 6.8,
    change24h: 4.2,
    score: 73,
    stage: "watchlist",
    reasoning: "DEX volume surging, governance proposals active",
    volume: "$180M",
    marketCap: "$4.1B",
    lastUpdated: new Date(),
  },

  // STAGE 3: READY TO BUY
  {
    id: "3",
    name: "Solana",
    symbol: "SOL",
    icon: "◎",
    price: 98.5,
    change24h: 5.8,
    score: 88,
    stage: "ready",
    reasoning: "Confluence of high volume, DEX activity, and bullish sentiment",
    volume: "$2.8B",
    marketCap: "$43B",
    lastUpdated: new Date(),
  },
  {
    id: "15",
    name: "Arbitrum",
    symbol: "ARB",
    icon: "🔵",
    price: 1.25,
    change24h: 8.3,
    score: 84,
    stage: "ready",
    reasoning: "Layer 2 adoption accelerating, TVL growing rapidly",
    volume: "$420M",
    marketCap: "$1.6B",
    lastUpdated: new Date(),
  },
  {
    id: "16",
    name: "Optimism",
    symbol: "OP",
    icon: "🔴",
    price: 2.15,
    change24h: 6.7,
    score: 82,
    stage: "ready",
    reasoning: "Superchain narrative strong, developer activity high",
    volume: "$180M",
    marketCap: "$2.2B",
    lastUpdated: new Date(),
  },
  {
    id: "17",
    name: "Sui",
    symbol: "SUI",
    icon: "💧",
    price: 3.45,
    change24h: 12.1,
    score: 86,
    stage: "ready",
    reasoning: "Move language adoption, gaming ecosystem expanding",
    volume: "$680M",
    marketCap: "$9.8B",
    lastUpdated: new Date(),
  },
  {
    id: "18",
    name: "Aptos",
    symbol: "APT",
    icon: "🅰️",
    price: 8.9,
    change24h: 9.4,
    score: 81,
    stage: "ready",
    reasoning: "Technical breakout confirmed, institutional backing strong",
    volume: "$320M",
    marketCap: "$3.8B",
    lastUpdated: new Date(),
  },

  // STAGE 4: PURCHASED
  {
    id: "4",
    name: "Chainlink",
    symbol: "LINK",
    icon: "⬡",
    price: 14.25,
    change24h: 3.2,
    score: 95,
    stage: "purchased",
    reasoning: "Position entered at optimal entry point",
    volume: "$485M",
    marketCap: "$8.4B",
    lastUpdated: new Date(),
  },
  {
    id: "19",
    name: "Render Token",
    symbol: "RNDR",
    icon: "🎨",
    price: 7.8,
    change24h: 15.2,
    score: 96,
    stage: "purchased",
    reasoning: "AI narrative strong, GPU demand increasing",
    volume: "$280M",
    marketCap: "$2.9B",
    lastUpdated: new Date(),
  },
  {
    id: "20",
    name: "Injective",
    symbol: "INJ",
    icon: "⚡",
    price: 23.4,
    change24h: 11.8,
    score: 94,
    stage: "purchased",
    reasoning: "DeFi hub gaining traction, cross-chain volume up",
    volume: "$95M",
    marketCap: "$2.1B",
    lastUpdated: new Date(),
  },
  {
    id: "21",
    name: "Celestia",
    symbol: "TIA",
    icon: "🌌",
    price: 5.2,
    change24h: 18.7,
    score: 97,
    stage: "purchased",
    reasoning: "Modular blockchain thesis playing out, staking rewards high",
    volume: "$180M",
    marketCap: "$1.1B",
    lastUpdated: new Date(),
  },
  {
    id: "22",
    name: "JupiterAG",
    symbol: "JUP",
    icon: "🪐",
    price: 0.92,
    change24h: 22.3,
    score: 98,
    stage: "purchased",
    reasoning: "Solana DEX aggregator dominance, airdrop momentum",
    volume: "$420M",
    marketCap: "$1.2B",
    lastUpdated: new Date(),
  },
]

const stageConfig = {
  scanning: {
    title: "STAGE 1: SCANNING",
    icon: Eye,
    color: "bg-gray-500",
    threshold: "< 60",
    description: "Monitoring market signals",
  },
  watchlist: {
    title: "STAGE 2: WATCHLIST",
    icon: Activity,
    color: "bg-yellow-500",
    threshold: "60-79",
    description: "High potential detected",
  },
  ready: {
    title: "STAGE 3: READY TO BUY",
    icon: ShoppingCart,
    color: "bg-orange-500",
    threshold: "80-94",
    description: "Optimal entry conditions",
  },
  purchased: {
    title: "STAGE 4: PURCHASED",
    icon: CheckCircle,
    color: "bg-green-500",
    threshold: "95+",
    description: "Position active",
  },
}

export default function CryptoDashboard() {
  const [coins, setCoins] = useState<CoinData[]>(initialCoins)
  const [lastUpdate, setLastUpdate] = useState(new Date())
  const [isLive, setIsLive] = useState(true)

  // Simulate real-time updates
  useEffect(() => {
    if (!isLive) return

    const interval = setInterval(() => {
      setCoins((prevCoins) =>
        prevCoins.map((coin) => {
          // Simulate score changes
          const scoreChange = (Math.random() - 0.5) * 10
          const newScore = Math.max(0, Math.min(100, coin.score + scoreChange))

          // Determine new stage based on score
          let newStage: CoinData["stage"] = "scanning"
          if (newScore >= 95) newStage = "purchased"
          else if (newScore >= 80) newStage = "ready"
          else if (newScore >= 60) newStage = "watchlist"

          // Update reasoning based on stage
          let newReasoning = coin.reasoning
          if (newStage !== coin.stage) {
            switch (newStage) {
              case "scanning":
                newReasoning = "Score dropped below threshold, monitoring for re-entry"
                break
              case "watchlist":
                newReasoning = "Positive signals detected, moving to watchlist"
                break
              case "ready":
                newReasoning = "Confluence of high volume, DEX activity, and bullish sentiment"
                break
              case "purchased":
                newReasoning = "Optimal entry conditions met, position entered"
                break
            }
          }

          // Simulate price changes
          const priceChange = (Math.random() - 0.5) * 0.02
          const newPrice = coin.price * (1 + priceChange)
          const newChange24h = coin.change24h + (Math.random() - 0.5) * 2

          return {
            ...coin,
            score: Math.round(newScore),
            stage: newStage,
            reasoning: newReasoning,
            price: newPrice,
            change24h: newChange24h,
            lastUpdated: new Date(),
          }
        }),
      )
      setLastUpdate(new Date())
    }, 5000) // Update every 5 seconds

    return () => clearInterval(interval)
  }, [isLive])

  const getStageCoins = (stage: CoinData["stage"]) => {
    return coins.filter((coin) => coin.stage === stage)
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
      maximumFractionDigits: price < 1 ? 4 : 2,
    }).format(price)
  }

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString("en-US", {
      hour12: false,
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    })
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">JaxSpot Trading Pipeline</h1>
              <p className="text-gray-600 mt-2">Automated crypto monitoring and trading signals</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="text-sm text-gray-500">Last Updated</p>
                <p className="font-mono text-sm">{formatTime(lastUpdate)}</p>
              </div>
              <Button
                variant={isLive ? "default" : "outline"}
                onClick={() => setIsLive(!isLive)}
                className="flex items-center gap-2"
              >
                <div className={`w-2 h-2 rounded-full ${isLive ? "bg-green-400" : "bg-gray-400"}`} />
                {isLive ? "LIVE" : "PAUSED"}
              </Button>
            </div>
          </div>
        </div>

        {/* Pipeline Stages */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {Object.entries(stageConfig).map(([stageKey, config]) => {
            const stageCoins = getStageCoins(stageKey as CoinData["stage"])
            const StageIcon = config.icon

            return (
              <Card key={stageKey} className="h-fit">
                <CardHeader className="pb-3">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${config.color} text-white`}>
                      <StageIcon className="w-5 h-5" />
                    </div>
                    <div>
                      <CardTitle className="text-sm font-semibold">{config.title}</CardTitle>
                      <p className="text-xs text-gray-500">{config.description}</p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between mt-2">
                    <Badge variant="outline" className="text-xs">
                      Score: {config.threshold}
                    </Badge>
                    <span className="text-sm font-medium">{stageCoins.length} coins</span>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  {stageCoins.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                      <p className="text-sm">No coins in this stage</p>
                    </div>
                  ) : (
                    stageCoins.map((coin) => (
                      <Card key={coin.id} className="p-3 bg-gray-50">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <span className="text-lg font-bold text-blue-600">{coin.icon}</span>
                            <div>
                              <p className="font-semibold text-sm">{coin.name}</p>
                              <p className="text-xs text-gray-500">{coin.symbol}</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="font-semibold text-sm">{formatPrice(coin.price)}</p>
                            <div className="flex items-center gap-1">
                              {coin.change24h >= 0 ? (
                                <TrendingUp className="w-3 h-3 text-green-500" />
                              ) : (
                                <TrendingDown className="w-3 h-3 text-red-500" />
                              )}
                              <span className={`text-xs ${coin.change24h >= 0 ? "text-green-500" : "text-red-500"}`}>
                                {coin.change24h >= 0 ? "+" : ""}
                                {coin.change24h.toFixed(1)}%
                              </span>
                            </div>
                          </div>
                        </div>

                        <div className="mb-2">
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-xs text-gray-500">JaxSpot Score</span>
                            <span className="text-xs font-semibold">{coin.score}/100</span>
                          </div>
                          <Progress value={coin.score} className="h-2" />
                        </div>

                        <div className="space-y-1">
                          <p className="text-xs text-gray-600">{coin.reasoning}</p>
                          <div className="flex justify-between text-xs text-gray-500">
                            <span>Vol: {coin.volume}</span>
                            <span>MCap: {coin.marketCap}</span>
                          </div>
                          <p className="text-xs text-gray-400">Updated: {formatTime(coin.lastUpdated)}</p>
                        </div>
                      </Card>
                    ))
                  )}
                </CardContent>
              </Card>
            )
          })}
        </div>

        {/* Summary Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-8">
          <Card className="p-4">
            <div className="flex items-center gap-3">
              <Eye className="w-8 h-8 text-gray-500" />
              <div>
                <p className="text-2xl font-bold">{getStageCoins("scanning").length}</p>
                <p className="text-sm text-gray-500">Scanning</p>
              </div>
            </div>
          </Card>
          <Card className="p-4">
            <div className="flex items-center gap-3">
              <Activity className="w-8 h-8 text-yellow-500" />
              <div>
                <p className="text-2xl font-bold">{getStageCoins("watchlist").length}</p>
                <p className="text-sm text-gray-500">Watchlist</p>
              </div>
            </div>
          </Card>
          <Card className="p-4">
            <div className="flex items-center gap-3">
              <ShoppingCart className="w-8 h-8 text-orange-500" />
              <div>
                <p className="text-2xl font-bold">{getStageCoins("ready").length}</p>
                <p className="text-sm text-gray-500">Ready to Buy</p>
              </div>
            </div>
          </Card>
          <Card className="p-4">
            <div className="flex items-center gap-3">
              <CheckCircle className="w-8 h-8 text-green-500" />
              <div>
                <p className="text-2xl font-bold">{getStageCoins("purchased").length}</p>
                <p className="text-sm text-gray-500">Purchased</p>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}
