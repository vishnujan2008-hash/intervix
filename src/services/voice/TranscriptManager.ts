import { TranscriptMessage } from '../../types';

export class TranscriptManager {
  private messages: TranscriptMessage[] = [];
  private listeners: ((messages: TranscriptMessage[]) => void)[] = [];

  constructor(initialMessages: TranscriptMessage[] = []) {
    this.messages = [...initialMessages];
  }

  public getMessages(): TranscriptMessage[] {
    return [...this.messages];
  }

  public addMessage(sender: 'ai' | 'candidate', text: string, codeSnippet?: string): TranscriptMessage {
    const newMessage: TranscriptMessage = {
      id: `trans-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      sender,
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
      audioDuration: sender === 'ai' ? '00:16' : '00:20',
      metrics: sender === 'candidate' ? { confidence: Math.floor(Math.random() * 8) + 92, clarity: Math.floor(Math.random() * 8) + 90 } : undefined,
      codeSnippet,
    };

    this.messages.push(newMessage);
    this.notify();
    return newMessage;
  }

  public clear(): void {
    this.messages = [];
    this.notify();
  }

  public subscribe(listener: (messages: TranscriptMessage[]) => void): () => void {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  private notify(): void {
    this.listeners.forEach(l => l([...this.messages]));
  }
}
