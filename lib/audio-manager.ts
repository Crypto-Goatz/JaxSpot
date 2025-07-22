class AudioManager {
  private audioContext: AudioContext | null = null
  private enabled = true
  private volume = 0.5

  constructor() {
    if (typeof window !== "undefined") {
      this.initializeAudioContext()
    }
  }

  private initializeAudioContext() {
    try {
      this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)()
    } catch (error) {
      console.warn("Web Audio API not supported:", error)
    }
  }

  private async createTone(frequency: number, duration: number, type: OscillatorType = "sine"): Promise<void> {
    if (!this.audioContext || !this.enabled) return

    const oscillator = this.audioContext.createOscillator()
    const gainNode = this.audioContext.createGain()

    oscillator.connect(gainNode)
    gainNode.connect(this.audioContext.destination)

    oscillator.frequency.setValueAtTime(frequency, this.audioContext.currentTime)
    oscillator.type = type

    gainNode.gain.setValueAtTime(0, this.audioContext.currentTime)
    gainNode.gain.linearRampToValueAtTime(this.volume * 0.3, this.audioContext.currentTime + 0.01)
    gainNode.gain.exponentialRampToValueAtTime(0.001, this.audioContext.currentTime + duration)

    oscillator.start(this.audioContext.currentTime)
    oscillator.stop(this.audioContext.currentTime + duration)

    return new Promise((resolve) => {
      oscillator.onended = () => resolve()
    })
  }

  private async playSequence(frequencies: number[], noteDuration = 0.2, gap = 0.05): Promise<void> {
    for (let i = 0; i < frequencies.length; i++) {
      await this.createTone(frequencies[i], noteDuration)
      if (i < frequencies.length - 1) {
        await new Promise((resolve) => setTimeout(resolve, gap * 1000))
      }
    }
  }

  async playStageUpgrade(fromStage: string, toStage: string): Promise<void> {
    const sequences = {
      "scanning-watchlist": [440, 523, 659], // A4, C5, E5
      "watchlist-ready": [523, 659, 784, 880], // C5, E5, G5, A5
      "ready-purchased": [659, 784, 880, 1047, 1319], // E5, G5, A5, C6, E6
    }

    const key = `${fromStage}-${toStage}` as keyof typeof sequences
    const sequence = sequences[key] || [440, 523, 659]

    await this.playSequence(sequence, 0.15, 0.05)
  }

  async playStageDowngrade(fromStage: string, toStage: string): Promise<void> {
    const sequences = {
      "purchased-ready": [1319, 1047, 880, 784], // E6, C6, A5, G5
      "ready-watchlist": [880, 784, 659, 523], // A5, G5, E5, C5
      "watchlist-scanning": [659, 523, 440], // E5, C5, A4
    }

    const key = `${fromStage}-${toStage}` as keyof typeof sequences
    const sequence = sequences[key] || [659, 523, 440]

    await this.playSequence(sequence, 0.2, 0.1)
  }

  async playNewCoinAlert(): Promise<void> {
    await this.playSequence([800, 1000, 800], 0.1, 0.05)
  }

  async playHighScoreAlert(): Promise<void> {
    const celebratory = [523, 659, 784, 1047, 1319, 1047, 784, 659, 523]
    await this.playSequence(celebratory, 0.12, 0.03)
  }

  setEnabled(enabled: boolean): void {
    this.enabled = enabled
  }

  getEnabled(): boolean {
    return this.enabled
  }

  setVolume(volume: number): void {
    this.volume = Math.max(0, Math.min(1, volume))
  }

  getVolume(): number {
    return this.volume
  }
}

export const audioManager = new AudioManager()
