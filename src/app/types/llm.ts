export interface LLMProvider {
  id: string;
  name: string;
  disabled?: boolean;
}

export const LLM_PROVIDERS: LLMProvider[] = [
  { id: 'openai', name: 'OpenAI', disabled: true },
  { id: 'anthropic', name: 'Anthropic', disabled: true },
  { id: 'cohere', name: 'Cohere', disabled: true },
  { id: 'gemini', name: 'Google Gemini' },
];

export type LLMPatterns = {
  [key: string]: RegExp;
};

export const API_KEY_PATTERNS: LLMPatterns = {
  openai: /^sk-[a-zA-Z0-9]{48}$/,
  anthropic: /^sk-ant-[a-zA-Z0-9]{32,}$/,
  cohere: /^[a-zA-Z0-9]{40}$/,
  gemini: /^AI[a-zA-Z0-9_-]{35,}$/,
};