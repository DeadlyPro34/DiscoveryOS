import { z } from 'zod';
import { BaseAgent } from '../base/baseAgent';
import { AgentInput, AgentCategory } from '@/types/ai/agent';

export class CleaningAgent extends BaseAgent {
  id = 'cleaning-agent';
  name = 'Cleaning Agent';
  description = 'Removes noise, normalizes spacing, and detects language in raw text before downstream processing.';
  category = 'analyzer' as AgentCategory;
  icon = '🧹';
  version = '1.0.0';

  inputSchema = z.object({
    content: z.string(),
    metadata: z.record(z.unknown()).optional(),
  });

  outputSchema = z.object({
    cleanedContent: z.string(),
    language: z.string(),
    noiseRemoved: z.boolean(),
  });

  protected getAgentPrompt() {
    return {
      systemPrompt: `You are the Cleaning Agent for DiscoveryOS.
Your job is to take raw customer research data (transcripts, emails, feedback) and clean it.
1. Remove meaningless noise (e.g., filler words like "um", "uh", timestamp artifacts, signature blocks).
2. Fix egregious formatting issues.
3. Keep the original intent and verbatim quotes intact—do not paraphrase.
4. Detect the primary language of the text.

Respond ONLY with a JSON object in this format:
{
  "cleanedContent": "The sanitized text",
  "language": "Detected language (e.g., English, Spanish)",
  "noiseRemoved": true or false
}`,
      userPromptPrefix: `Clean the following customer research text:`,
    };
  }

  protected async executeAgent(
    input: AgentInput,
  ): Promise<{ result: unknown; structured?: Record<string, unknown> }> {
    // Fallback Mock Logic
    let cleaned = input.content
      .replace(/(\b(um|uh|like|you know)\b)/gi, '')
      .replace(/\n{3,}/g, '\n\n')
      .trim();

    const output = {
      cleanedContent: cleaned,
      language: 'English',
      noiseRemoved: true,
    };

    return this.createOutput(output, output);
  }
}

export const cleaningAgent = new CleaningAgent();
