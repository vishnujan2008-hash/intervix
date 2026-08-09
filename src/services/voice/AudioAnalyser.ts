export class AudioAnalyser {
  private audioContext: AudioContext | null = null;
  private analyser: AnalyserNode | null = null;
  private source: MediaStreamAudioSourceNode | null = null;
  private animationFrameId: number | null = null;

  public async startAnalysing(
    stream: MediaStream, 
    onFrequencyUpdate: (frequencies: number[], averageVolume: number) => void
  ): Promise<void> {
    try {
      this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      
      // Auto-resume AudioContext if suspended by browser autoplay policy
      if (this.audioContext.state === 'suspended') {
        await this.audioContext.resume();
      }

      this.analyser = this.audioContext.createAnalyser();
      this.analyser.fftSize = 64;

      this.source = this.audioContext.createMediaStreamSource(stream);
      this.source.connect(this.analyser);

      const bufferLength = this.analyser.frequencyBinCount;
      const dataArray = new Uint8Array(bufferLength);

      const update = () => {
        if (!this.analyser) return;
        this.analyser.getByteFrequencyData(dataArray);

        let sum = 0;
        const frequencies: number[] = [];
        for (let i = 0; i < bufferLength; i++) {
          const val = dataArray[i];
          sum += val;
          frequencies.push(val);
        }

        const averageVolume = Math.min(100, Math.round((sum / bufferLength) / 2.55));
        onFrequencyUpdate(frequencies, averageVolume);

        this.animationFrameId = requestAnimationFrame(update);
      };

      update();
    } catch (err) {
      console.warn('AudioAnalyser initialization warning:', err);
    }
  }

  public stop(): void {
    if (this.animationFrameId !== null) {
      cancelAnimationFrame(this.animationFrameId);
      this.animationFrameId = null;
    }
    if (this.source) {
      this.source.disconnect();
      this.source = null;
    }
    if (this.audioContext && this.audioContext.state !== 'closed') {
      this.audioContext.close();
      this.audioContext = null;
    }
    this.analyser = null;
  }
}
