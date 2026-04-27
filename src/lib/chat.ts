import type { Message, ChatState, ToolCall, SessionInfo } from '../../worker/types';
export interface ChatResponse<T = ChatState> {
  success: boolean;
  data?: T;
  error?: string;
}
export const MODELS = [
  { id: 'google-ai-studio/gemini-2.5-flash', name: 'Gemini 2.5 Flash (Core)' },
  { id: 'google-ai-studio/gemini-2.0-flash', name: 'Gemini 2.0 Flash (Fast)' },
];
class ChatService {
  private sessionId: string;
  private baseUrl: string;
  constructor(sessionId?: string) {
    const savedSession = sessionId || localStorage.getItem('worldarch_sys_session') || crypto.randomUUID();
    this.sessionId = savedSession;
    this.baseUrl = `/api/chat/${this.sessionId}`;
    localStorage.setItem('worldarch_sys_session', this.sessionId);
  }
  setSession(sessionId: string) {
    this.sessionId = sessionId;
    this.baseUrl = `/api/chat/${this.sessionId}`;
    localStorage.setItem('worldarch_sys_session', this.sessionId);
  }
  async sendMessage(
    message: string,
    model?: string,
    onChunk?: (chunk: string) => void
  ): Promise<ChatResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message, model, stream: !!onChunk }),
      });
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      if (onChunk && response.body) {
        const reader = response.body.getReader();
        const decoder = new TextDecoder();
        try {
          while (true) {
            const { done, value } = await reader.read();
            if (done) break;
            const chunk = decoder.decode(value, { stream: true });
            if (chunk) onChunk(chunk);
          }
        } finally {
          reader.releaseLock();
        }
        return { success: true };
      }
      return await response.json();
    } catch (error) {
      console.error('System failure sending message:', error);
      return { success: false, error: 'Failed to establish neural link' };
    }
  }
  async getMessages(): Promise<ChatResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/messages`);
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      return await response.json();
    } catch (error) {
      return { success: false, error: 'Failed to retrieve neural traces' };
    }
  }
  async clearMessages(): Promise<ChatResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/clear`, { method: 'DELETE' });
      return await response.json();
    } catch (error) {
      return { success: false, error: 'Failed to purge session cache' };
    }
  }
  // Session Management via AppController
  async listSessions(): Promise<ChatResponse<SessionInfo[]>> {
    try {
      const response = await fetch('/api/sessions');
      return await response.json();
    } catch (error) {
      return { success: false, error: 'Failed to list active nodes' };
    }
  }
  async createSession(title?: string, firstMessage?: string): Promise<ChatResponse<SessionInfo>> {
    try {
      const response = await fetch('/api/sessions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, firstMessage }),
      });
      const result = await response.json();
      if (result.success) {
        this.setSession(result.data.sessionId);
      }
      return result;
    } catch (error) {
      return { success: false, error: 'Failed to initialize session substrate' };
    }
  }
  async deleteSession(sessionId: string): Promise<ChatResponse<{ deleted: boolean }>> {
    try {
      const response = await fetch(`/api/sessions/${sessionId}`, { method: 'DELETE' });
      return await response.json();
    } catch (error) {
      return { success: false, error: 'Failed to decommission session node' };
    }
  }
  getSessionId(): string {
    return this.sessionId;
  }
}
export const chatService = new ChatService();
export const parseToolResult = (toolCall?: ToolCall): string | null => {
  if (!toolCall || toolCall.name !== 'generate_illustration') return null;
  const result = toolCall.result as any;
  if (result && result.image_url) return result.image_url;
  return null;
};
export const formatTime = (timestamp: number): string => {
  return new Date(timestamp).toLocaleTimeString([], { hour12: false, hour: '2-digit', minute: '2-digit' });
};