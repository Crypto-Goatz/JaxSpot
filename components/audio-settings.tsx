"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Slider } from "@/components/ui/slider"
import { Badge } from "@/components/ui/badge"
import { Volume2, VolumeX, Play } from "lucide-react"
import { audioManager } from "@/lib/audio-manager"

interface AudioSettingsProps {
  isOpen: boolean
  onClose: () => void
}

export function AudioSettings({ isOpen, onClose }: AudioSettingsProps) {
  const [isEnabled, setIsEnabled] = useState(true)
  const [volume, setVolume] = useState(50)

  useEffect(() => {
    setIsEnabled(audioManager.getEnabled())
    setVolume(audioManager.getVolume() * 100)
  }, [])

  const handleEnabledChange = (enabled: boolean) => {
    setIsEnabled(enabled)
    audioManager.setEnabled(enabled)
    localStorage.setItem("audioEnabled", enabled.toString())
  }

  const handleVolumeChange = (value: number[]) => {
    const newVolume = value[0]
    setVolume(newVolume)
    audioManager.setVolume(newVolume / 100)
    localStorage.setItem("audioVolume", (newVolume / 100).toString())
  }

  const testSound = async (type: string) => {
    switch (type) {
      case "upgrade":
        await audioManager.playStageUpgrade("watchlist", "ready")
        break
      case "downgrade":
        await audioManager.playStageDowngrade("ready", "watchlist")
        break
      case "alert":
        await audioManager.playNewCoinAlert()
        break
      case "highscore":
        await audioManager.playHighScoreAlert()
        break
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            {isEnabled ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
            Audio Settings
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Enable/Disable Audio */}
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Sound Alerts</p>
              <p className="text-sm text-gray-500">Enable audio notifications for stage changes</p>
            </div>
            <Switch checked={isEnabled} onCheckedChange={handleEnabledChange} />
          </div>

          {/* Volume Control */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <p className="font-medium">Volume</p>
              <Badge variant="outline">{volume}%</Badge>
            </div>
            <Slider
              value={[volume]}
              onValueChange={handleVolumeChange}
              max={100}
              step={5}
              disabled={!isEnabled}
              className="w-full"
            />
          </div>

          {/* Sound Test Buttons */}
          <div className="space-y-3">
            <p className="font-medium">Test Sounds</p>
            <div className="grid grid-cols-2 gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => testSound("upgrade")}
                disabled={!isEnabled}
                className="flex items-center gap-2"
              >
                <Play className="w-3 h-3" />
                Stage Up
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => testSound("downgrade")}
                disabled={!isEnabled}
                className="flex items-center gap-2"
              >
                <Play className="w-3 h-3" />
                Stage Down
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => testSound("alert")}
                disabled={!isEnabled}
                className="flex items-center gap-2"
              >
                <Play className="w-3 h-3" />
                Alert
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => testSound("highscore")}
                disabled={!isEnabled}
                className="flex items-center gap-2"
              >
                <Play className="w-3 h-3" />
                High Score
              </Button>
            </div>
          </div>

          {/* Sound Descriptions */}
          <div className="space-y-2 text-sm text-gray-600">
            <p>
              <strong>Stage Up:</strong> Ascending tones when coins move to higher stages
            </p>
            <p>
              <strong>Stage Down:</strong> Descending tones when coins move to lower stages
            </p>
            <p>
              <strong>Alert:</strong> Quick beeps for new coin notifications
            </p>
            <p>
              <strong>High Score:</strong> Celebratory sound for coins reaching 95+ score
            </p>
          </div>

          {/* Close Button */}
          <div className="flex justify-end gap-2">
            <Button onClick={onClose}>Close</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
