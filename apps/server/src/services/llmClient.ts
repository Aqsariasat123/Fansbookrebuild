import Anthropic from '@anthropic-ai/sdk';
import { env } from '../config/env.js';
import { logger } from '../utils/logger.js';

/**
 * Single LLM client used by every chat-AI service. Picks the provider
 * dynamically per call:
 *
 *   - If OPENROUTER_API_KEY is set, calls OpenRouter (OpenAI-compatible REST)
 *     with OPENROUTER_MODEL — this is the preferred path because OpenRouter
 *     gives us access to permissive open-source models that handle flirty /
 *     companion content properly, which is the whole point of card #13.
 *   - Otherwise falls back to Anthropic Claude with the supplied
 *     `anthropicModel`. This keeps the chat working during the deploy
 *     window before the OpenRouter key is provisioned, even though Claude
 *     will keep refusing flirty content until we flip the switch.
 *
 * The return shape is normalised so callers don't care which backend ran.
 */

const OPENROUTER_BASE = 'https://openrouter.ai/api/v1';

export interface LlmMessage {
  role: 'user' | 'assistant';
  content: string;
}

export interface LlmCompletion {
  text: string;
  inputTokens: number;
  outputTokens: number;
  provider: 'openrouter' | 'anthropic';
}

export interface LlmCallOptions {
  system?: string;
  messages: LlmMessage[];
  maxTokens?: number;
  /** Override the OpenRouter model for this call. */
  openrouterModel?: string;
  /** Anthropic model name used only if OpenRouter is not configured. */
  anthropicModel: string;
}

let anthropicClient: Anthropic | null = null;
function getAnthropic(): Anthropic {
  if (!anthropicClient) anthropicClient = new Anthropic({ apiKey: env.ANTHROPIC_API_KEY });
  return anthropicClient;
}

// eslint-disable-next-line complexity -- single HTTP-call helper with optional system + usage parsing
async function callOpenRouter(opts: LlmCallOptions): Promise<LlmCompletion> {
  const model = opts.openrouterModel || env.OPENROUTER_MODEL;
  const messages: Array<{ role: 'system' | 'user' | 'assistant'; content: string }> = [];
  if (opts.system) messages.push({ role: 'system', content: opts.system });
  for (const m of opts.messages) messages.push({ role: m.role, content: m.content });

  const res = await fetch(`${OPENROUTER_BASE}/chat/completions`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${env.OPENROUTER_API_KEY}`,
      'Content-Type': 'application/json',
      'HTTP-Referer': 'https://inscrio.com',
      'X-Title': 'Inscrio',
    },
    body: JSON.stringify({
      model,
      messages,
      max_tokens: opts.maxTokens ?? 300,
    }),
  });
  if (!res.ok) {
    const body = await res.text().catch(() => '');
    throw new Error(`OpenRouter ${res.status}: ${body.slice(0, 200)}`);
  }
  const json = (await res.json()) as {
    choices: Array<{ message: { content: string } }>;
    usage?: { prompt_tokens?: number; completion_tokens?: number };
  };
  return {
    text: json.choices[0]?.message?.content ?? '',
    inputTokens: json.usage?.prompt_tokens ?? 0,
    outputTokens: json.usage?.completion_tokens ?? 0,
    provider: 'openrouter',
  };
}

async function callAnthropic(opts: LlmCallOptions): Promise<LlmCompletion> {
  if (!env.ANTHROPIC_API_KEY)
    throw new Error('Neither OPENROUTER_API_KEY nor ANTHROPIC_API_KEY is configured');
  const response = await getAnthropic().messages.create({
    model: opts.anthropicModel,
    max_tokens: opts.maxTokens ?? 300,
    ...(opts.system ? { system: opts.system } : {}),
    messages: opts.messages,
  });
  const text = response.content[0]?.type === 'text' ? response.content[0].text : '';
  return {
    text,
    inputTokens: response.usage.input_tokens,
    outputTokens: response.usage.output_tokens,
    provider: 'anthropic',
  };
}

export async function llmComplete(opts: LlmCallOptions): Promise<LlmCompletion> {
  if (env.OPENROUTER_API_KEY) {
    try {
      return await callOpenRouter(opts);
    } catch (err) {
      logger.warn({ err }, 'OpenRouter call failed, falling back to Anthropic');
      // fall through to Anthropic
    }
  }
  return callAnthropic(opts);
}
