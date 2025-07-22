"use client"

import { useState } from "react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { X, Info, LogIn, ExternalLink } from "lucide-react"
import { gasClient } from "@/lib/google-apps-script-client"
import { useAuth } from "@/lib/auth-context"

export function DevelopmentNotice() {
  const [isVisible, setIsVisible] = useState(true)
  const [isLoggingIn, setIsLoggingIn] = useState(false)
  const { login, isAuthenticated } = useAuth()

  // Don't show if Google Apps Script is configured or user is already authenticated
  if (gasClient.isConfigured() || isAuthenticated || !isVisible) {
    return null
  }

  const handleDemoLogin = async () => {
    setIsLoggingIn(true)
    try {
      const credentials = gasClient.getDemoCredentials()
      await login(credentials.email, credentials.password)
    } catch (error) {
      console.error("Demo login failed:", error)
    } finally {
      setIsLoggingIn(false)
    }
  }

  return (
    <div className="fixed top-4 left-4 right-4 z-50 max-w-4xl mx-auto">
      <Alert className="bg-blue-50 border-blue-200 shadow-lg">
        <Info className="h-4 w-4 text-blue-600" />
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <AlertDescription className="text-blue-800">
              <div className="flex items-center gap-2 mb-2">
                <Badge className="bg-blue-100 text-blue-800">Development Mode</Badge>
                <span className="font-semibold">Using Mock Data</span>
              </div>
              <p className="mb-3">
                Google Apps Script backend is not configured. The app is running with realistic sample data for
                demonstration purposes.
              </p>
              <div className="flex flex-col sm:flex-row gap-2">
                <Button
                  size="sm"
                  onClick={handleDemoLogin}
                  disabled={isLoggingIn}
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                >
                  <LogIn className="h-4 w-4 mr-1" />
                  {isLoggingIn ? "Logging in..." : "Try Demo (Pro Tier)"}
                </Button>
                <Button size="sm" variant="outline" asChild>
                  <a
                    href="https://github.com/your-repo/setup-guide"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center"
                  >
                    <ExternalLink className="h-4 w-4 mr-1" />
                    Setup Guide
                  </a>
                </Button>
              </div>
              <div className="mt-2 text-sm">
                <strong>Demo Credentials:</strong> demo@jax.com / demo123
              </div>
            </AlertDescription>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsVisible(false)}
            className="text-blue-600 hover:text-blue-800 hover:bg-blue-100"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </Alert>
    </div>
  )
}
