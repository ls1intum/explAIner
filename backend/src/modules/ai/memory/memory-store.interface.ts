export interface MemoryStore {
  get(sessionId: string): Promise<any>;
  set(sessionId: string, data: any): Promise<void>;
  delete(sessionId: string): Promise<void>;
}
