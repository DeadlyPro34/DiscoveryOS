/**
 * AI Configuration Types
 * Defines interfaces for AI providers, models, and configuration settings
 */

export type AIProviderType = 'groq' | 'openai' | 'anthropic' | 'local';

export interface ModelConfig {
  id: string;
  name: string;
  provider: AIProviderType;
  maxTokens: number;
  contextWindow: number;
  costPer1kTokens?: {
    input: number;
    output: number;
  };
}

export interface ProviderConfig {
  provider: AIProviderType;
  apiKey?: string;
  baseUrl?: string;
  timeout?: number;
  maxRetries?: number;
}

export interface AIConfig {
  defaultProvider: AIProviderType;
  defaultModel: string;
  providers: Record<AIProviderType, ProviderConfig>;
  models: Record<string, ModelConfig>;
  temperature: number;
  maxTokens: number;
  topP: number;
  topK?: number;
  frequencyPenalty?: number;
  presencePenalty?: number;
  stopSequences?: string[];
  enableStreaming?: boolean;
  enableCache?: boolean;
  cacheTTL?: number;
}

export interface AIServiceOptions {
  temperature?: number;
  maxTokens?: number;
  topP?: number;
  topK?: number;
  frequencyPenalty?: number;
  presencePenalty?: number;
  stopSequences?: string[];
  model?: string;
  provider?: AIProviderType;
}

export interface AIResponse {
  content: string;
  tokens: {
    input: number;
    output: number;
  };
  model: string;
  provider: AIProviderType;
  timestamp: Date;
  cached?: boolean;
}

export interface AIStreamOptions extends AIServiceOptions {
  onChunk?: (chunk: string) => void;
  onComplete?: (content: string) => void;
  onError?: (error: Error) => void;
}
