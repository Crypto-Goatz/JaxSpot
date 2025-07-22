"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Check, X, Zap, Crown, Users, TrendingUp, ArrowLeft, Info } from "lucide-react"
import { useAuth } from "@/lib/auth-context"
import Link from "next/link"

interface PricingTier {
  id: "free" | "herd" | "pro" | "elite"
  name: string
  description: string
  monthlyPrice: number
  yearlyPrice: number
  icon: React.ReactNode
  color: string
  badge?: string
  features: {
    name: string
    included: boolean
    description?: string
  }[]
  limits: {
    jaxPicks: string
    stages: string
    alerts: string
    support: string
  }
  popular?: boolean
}

const pricingTiers: PricingTier[] = [
  {
    id: "free",
    name: "Community",
    description: "Get started with basic crypto insights",
    monthlyPrice: 0,
    yearlyPrice: 0,
    icon: <Users className="w-6 h-6" />,
    color: "border-gray-200",
    features: [
      { name: "Community Access", included: true, description: "Join our trading community" },
      { name: "JAX Picks Stages 1-2", included: true, description: "Access to early-stage picks" },
      { name: "Basic Market Analysis", included: true, description: "Daily market insights" },
      { name: "Discord Community", included: true, description: "Chat with other traders" },
      { name: "Educational Content", included: true, description: "Learn trading fundamentals" },
      { name: "Real-time Alerts", included: false },
      { name: "Advanced Analytics", included: false },
      { name: "JAX Picks Stages 3-4", included: false },
      { name: "AI Trade Analyzer", included: false },
      { name: "Custom Bot Builder", included: false },
      { name: "Priority Support", included: false },
      { name: "1-on-1 Sessions", included: false },
    ],
    limits: {
      jaxPicks: "Stages 1-2 only",
      stages: "2 of 4 stages",
      alerts: "Basic notifications",
      support: "Community support",
    },
  },
  {
    id: "herd",
    name: "Herd Member",
    description: "Join the herd with full JAX picks access",
    monthlyPrice: 29,
    yearlyPrice: 24,
    icon: <TrendingUp className="w-6 h-6" />,
    color: "border-blue-200",
    features: [
      { name: "Everything in Community", included: true },
      { name: "Full JAX Picks Access", included: true, description: "All 4 stages of picks" },
      { name: "Real-time Alerts", included: true, description: "Instant notifications" },
      { name: "Whale Tracker", included: true, description: "Monitor large wallet movements" },
      { name: "Advanced Charts", included: true, description: "Professional trading charts" },
      { name: "Market Sentiment AI", included: true, description: "AI-powered sentiment analysis" },
      { name: "Priority Discord Access", included: true, description: "Exclusive channels" },
      { name: "Weekly Market Reports", included: true, description: "Detailed analysis reports" },
      { name: "AI Trade Analyzer", included: false },
      { name: "Custom Bot Builder", included: false },
      { name: "Priority Support", included: false },
      { name: "1-on-1 Sessions", included: false },
    ],
    limits: {
      jaxPicks: "All 4 stages",
      stages: "4 of 4 stages",
      alerts: "Real-time alerts",
      support: "Email support",
    },
  },
  {
    id: "pro",
    name: "Pro Trader",
    description: "Advanced tools for serious traders",
    monthlyPrice: 49,
    yearlyPrice: 41,
    icon: <Zap className="w-6 h-6" />,
    color: "border-purple-200",
    badge: "Most Popular",
    popular: true,
    features: [
      { name: "Everything in Herd Member", included: true },
      { name: "AI Trade Analyzer", included: true, description: "AI-powered trade analysis" },
      { name: "Options Flow Scanner", included: true, description: "Track institutional options" },
      { name: "Custom Alerts", included: true, description: "Set personalized alerts" },
      { name: "API Access", included: true, description: "Integrate with your tools" },
      { name: "Backtesting Tools", included: true, description: "Test strategies historically" },
      { name: "Risk Management Tools", included: true, description: "Advanced risk analysis" },
      { name: "Monthly 1-on-1 Session", included: true, description: "Personal trading consultation" },
      { name: "Priority Support", included: true, description: "24/7 priority support" },
      { name: "Custom Bot Builder", included: false },
      { name: "Institutional Tools", included: false },
      { name: "Direct JAX Access", included: false },
    ],
    limits: {
      jaxPicks: "All stages + analysis",
      stages: "4 of 4 + AI insights",
      alerts: "Unlimited custom alerts",
      support: "Priority 24/7 support",
    },
  },
  {
    id: "elite",
    name: "Elite Whale",
    description: "Ultimate trading platform for whales",
    monthlyPrice: 99,
    yearlyPrice: 82,
    icon: <Crown className="w-6 h-6" />,
    color: "border-yellow-200",
    badge: "Premium",
    features: [
      { name: "Everything in Pro Trader", included: true },
      { name: "Custom Bot Builder", included: true, description: "Build automated trading bots" },
      { name: "Arbitrage Scanner", included: true, description: "Cross-exchange opportunities" },
      { name: "Institutional Tools", included: true, description: "Professional-grade tools" },
      { name: "Direct JAX Access", included: true, description: "Direct communication with JAX" },
      { name: "Whale Alert System", included: true, description: "Track whale movements" },
      { name: "Custom Indicators", included: true, description: "Build custom trading indicators" },
      { name: "Weekly Group Calls", included: true, description: "Exclusive group sessions" },
      { name: "Dedicated Account Manager", included: true, description: "Personal account support" },
      { name: "White-label Solutions", included: true, description: "Brand the platform" },
      { name: "Unlimited Everything", included: true, description: "No limits on any features" },
    ],
    limits: {
      jaxPicks: "Unlimited access",
      stages: "All stages + exclusive",
      alerts: "Unlimited + whale alerts",
      support: "Dedicated account manager",
    },
  },
]

const faqs = [
  {
    question: "What are JAX Picks?",
    answer:
      "JAX Picks are cryptocurrency trading signals generated through our proprietary 4-stage analysis system. Each pick includes entry points, targets, stop losses, and detailed reasoning.",
  },
  {
    question: "How does the 4-stage system work?",
    answer:
      "Stage 1: Scanning - Initial market screening. Stage 2: Watchlist - Coins showing potential. Stage 3: Ready - High-confidence picks ready for entry. Stage 4: Purchased - Active positions with ongoing management.",
  },
  {
    question: "Can I cancel my subscription anytime?",
    answer:
      "Yes, you can cancel your subscription at any time. You'll continue to have access until the end of your current billing period.",
  },
  {
    question: "What's the difference between monthly and yearly billing?",
    answer:
      "Yearly billing offers a 17% discount compared to monthly billing. You pay upfront for the year and save money.",
  },
  {
    question: "Do you offer refunds?",
    answer:
      "We offer a 7-day money-back guarantee for all paid plans. If you're not satisfied, contact support for a full refund.",
  },
  {
    question: "How accurate are the JAX Picks?",
    answer:
      "Our current accuracy rate is 73.2% with an average return of 12.4%. Past performance doesn't guarantee future results, but we maintain transparent tracking of all picks.",
  },
]

export default function PricingPage() {
  const [isYearly, setIsYearly] = useState(false)
  const { user, isAuthenticated } = useAuth()

  const getCurrentPlan = () => {
    if (!isAuthenticated || !user) return "free"
    return user.membershipTier
  }

  const getPrice = (tier: PricingTier) => {
    return isYearly ? tier.yearlyPrice : tier.monthlyPrice
  }

  const getSavings = (tier: PricingTier) => {
    if (tier.monthlyPrice === 0) return 0
    const yearlyTotal = tier.yearlyPrice * 12
    const monthlyTotal = tier.monthlyPrice * 12
    return monthlyTotal - yearlyTotal
  }

  const handleUpgrade = (tierId: string) => {
    // In a real app, this would integrate with Stripe or another payment processor
    console.log(`Upgrading to ${tierId}`)
    alert(`Upgrade to ${tierId} - Payment integration would go here`)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center text-gray-600 hover:text-gray-900">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Dashboard
            </Link>
            {isAuthenticated && (
              <Badge variant="outline" className="capitalize">
                Current: {getCurrentPlan()}
              </Badge>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Choose Your Trading Edge</h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Join thousands of traders who trust JAX for crypto market insights. From community access to elite whale
            tools, find the perfect plan for your trading journey.
          </p>

          {/* Demo Credentials Alert */}
          {!isAuthenticated && (
            <Alert className="max-w-2xl mx-auto mb-8 bg-blue-50 border-blue-200">
              <Info className="h-4 w-4 text-blue-600" />
              <AlertDescription className="text-blue-800">
                <strong>Try the demo:</strong> Login with{" "}
                <code className="bg-blue-100 px-2 py-1 rounded">demo@jax.com</code> /{" "}
                <code className="bg-blue-100 px-2 py-1 rounded">demo123</code> to see Pro tier features
              </AlertDescription>
            </Alert>
          )}

          {/* Billing Toggle */}
          <div className="flex items-center justify-center space-x-4 mb-8">
            <span className={`text-sm ${!isYearly ? "text-gray-900 font-medium" : "text-gray-500"}`}>Monthly</span>
            <Switch checked={isYearly} onCheckedChange={setIsYearly} className="data-[state=checked]:bg-green-600" />
            <span className={`text-sm ${isYearly ? "text-gray-900 font-medium" : "text-gray-500"}`}>Yearly</span>
            <Badge className="bg-green-100 text-green-800 border-green-200">Save 17%</Badge>
          </div>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          {pricingTiers.map((tier) => (
            <Card
              key={tier.id}
              className={`relative ${tier.color} ${tier.popular ? "ring-2 ring-purple-500 shadow-lg scale-105" : "hover:shadow-lg"} transition-all duration-200`}
            >
              {tier.badge && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <Badge className={`${tier.popular ? "bg-purple-600" : "bg-yellow-600"} text-white`}>
                    {tier.badge}
                  </Badge>
                </div>
              )}

              <CardHeader className="text-center pb-4">
                <div
                  className={`w-12 h-12 mx-auto mb-4 rounded-full ${tier.popular ? "bg-purple-100 text-purple-600" : "bg-gray-100 text-gray-600"} flex items-center justify-center`}
                >
                  {tier.icon}
                </div>
                <CardTitle className="text-xl font-bold">{tier.name}</CardTitle>
                <CardDescription className="text-sm">{tier.description}</CardDescription>

                <div className="mt-4">
                  <div className="flex items-baseline justify-center">
                    <span className="text-3xl font-bold">${getPrice(tier)}</span>
                    {tier.monthlyPrice > 0 && <span className="text-gray-500 ml-1">/{isYearly ? "mo" : "month"}</span>}
                  </div>
                  {isYearly && tier.monthlyPrice > 0 && (
                    <div className="text-sm text-green-600 mt-1">Save ${getSavings(tier)}/year</div>
                  )}
                  {isYearly && tier.monthlyPrice > 0 && (
                    <div className="text-xs text-gray-500 mt-1">Billed annually (${tier.yearlyPrice * 12})</div>
                  )}
                </div>
              </CardHeader>

              <CardContent className="space-y-3">
                {/* Key Limits */}
                <div className="bg-gray-50 rounded-lg p-3 text-sm">
                  <div className="grid grid-cols-1 gap-1">
                    <div>
                      <strong>JAX Picks:</strong> {tier.limits.jaxPicks}
                    </div>
                    <div>
                      <strong>Stages:</strong> {tier.limits.stages}
                    </div>
                    <div>
                      <strong>Support:</strong> {tier.limits.support}
                    </div>
                  </div>
                </div>

                {/* Top Features */}
                <div className="space-y-2">
                  {tier.features.slice(0, 6).map((feature, index) => (
                    <div key={index} className="flex items-start space-x-2">
                      {feature.included ? (
                        <Check className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                      ) : (
                        <X className="w-4 h-4 text-gray-300 mt-0.5 flex-shrink-0" />
                      )}
                      <span className={`text-sm ${feature.included ? "text-gray-900" : "text-gray-400"}`}>
                        {feature.name}
                      </span>
                    </div>
                  ))}
                  {tier.features.length > 6 && (
                    <div className="text-xs text-gray-500 mt-2">+{tier.features.length - 6} more features</div>
                  )}
                </div>
              </CardContent>

              <CardFooter>
                <Button
                  className="w-full"
                  variant={tier.popular ? "default" : "outline"}
                  onClick={() => handleUpgrade(tier.id)}
                  disabled={getCurrentPlan() === tier.id}
                >
                  {getCurrentPlan() === tier.id
                    ? "Current Plan"
                    : tier.monthlyPrice === 0
                      ? "Get Started Free"
                      : `Upgrade to ${tier.name}`}
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>

        {/* Feature Comparison Table */}
        <div className="mb-16">
          <h2 className="text-2xl font-bold text-center mb-8">Feature Comparison</h2>
          <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="text-left p-4 font-medium text-gray-900">Features</th>
                    {pricingTiers.map((tier) => (
                      <th key={tier.id} className="text-center p-4 font-medium text-gray-900 min-w-[120px]">
                        {tier.name}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {/* Get all unique features */}
                  {Array.from(new Set(pricingTiers.flatMap((tier) => tier.features.map((f) => f.name)))).map(
                    (featureName) => (
                      <tr key={featureName} className="hover:bg-gray-50">
                        <td className="p-4 text-sm font-medium text-gray-900">{featureName}</td>
                        {pricingTiers.map((tier) => {
                          const feature = tier.features.find((f) => f.name === featureName)
                          return (
                            <td key={tier.id} className="p-4 text-center">
                              {feature?.included ? (
                                <Check className="w-5 h-5 text-green-500 mx-auto" />
                              ) : (
                                <X className="w-5 h-5 text-gray-300 mx-auto" />
                              )}
                            </td>
                          )
                        })}
                      </tr>
                    ),
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="mb-16">
          <h2 className="text-2xl font-bold text-center mb-8">Frequently Asked Questions</h2>
          <div className="max-w-3xl mx-auto">
            <Accordion type="single" collapsible className="space-y-4">
              {faqs.map((faq, index) => (
                <AccordionItem key={index} value={`item-${index}`} className="bg-white rounded-lg border px-6">
                  <AccordionTrigger className="text-left font-medium">{faq.question}</AccordionTrigger>
                  <AccordionContent className="text-gray-600">{faq.answer}</AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center bg-white rounded-lg p-8 shadow-sm border">
          <h2 className="text-2xl font-bold mb-4">Ready to Start Trading Smarter?</h2>
          <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
            Join thousands of traders who have improved their performance with JAX. Start with our free community or
            jump straight to a paid plan.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" onClick={() => handleUpgrade("herd")}>
              Start Free Trial
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href="/">View Demo</Link>
            </Button>
          </div>
          <p className="text-sm text-gray-500 mt-4">7-day money-back guarantee • No setup fees • Cancel anytime</p>
        </div>
      </div>
    </div>
  )
}
