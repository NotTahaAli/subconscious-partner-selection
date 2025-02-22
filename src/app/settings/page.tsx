'use client';

import { useEffect, useState } from 'react';
import { LLM_PROVIDERS, API_KEY_PATTERNS, LLMProvider } from '../types/llm';

interface Settings {
  apiKey: string;
  llmProvider: string;
}

export default function SettingsPage() {
  const [settings, setSettings] = useState<Settings>({
    apiKey: '',
    llmProvider: 'gemini', // Changed default to Gemini since others are disabled
  });
  const [isSaved, setIsSaved] = useState(false);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    // Load settings from localStorage on component mount
    const storedSettings = localStorage.getItem('llmSettings');
    if (storedSettings) {
      setSettings(JSON.parse(storedSettings));
    }
  }, []);

  const validateApiKey = (key: string, provider: string): boolean => {
    if (!key) {
      setError('API key is required');
      return false;
    }

    if (!API_KEY_PATTERNS[provider].test(key)) {
      setError(`Invalid ${LLM_PROVIDERS.find(p => p.id === provider)?.name} API key format`);
      return false;
    }

    setError('');
    return true;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateApiKey(settings.apiKey, settings.llmProvider)) {
      localStorage.setItem('llmSettings', JSON.stringify(settings));
      setIsSaved(true);
      setTimeout(() => setIsSaved(false), 3000);
    }
  };

  return (
    <div className="max-w-xl mx-auto">
      <h1 className="text-3xl font-bold mb-8 text-center">Settings</h1>
      <div className="bg-background border border-foreground/10 rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-4">LLM API Configuration</h2>
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="llmProvider" className="block text-sm font-medium mb-1">
              LLM Provider
            </label>
            <select
              id="llmProvider"
              value={settings.llmProvider}
              onChange={(e) => setSettings({ ...settings, llmProvider: e.target.value })}
              className="w-full px-3 py-2 border border-foreground/20 rounded-md bg-background"
            >
              {LLM_PROVIDERS.map((provider: LLMProvider) => (
                <option 
                  key={provider.id} 
                  value={provider.id}
                  disabled={provider.disabled}
                >
                  {provider.name}{provider.disabled ? ' (Coming Soon)' : ''}
                </option>
              ))}
            </select>
          </div>
          
          <div>
            <label htmlFor="apiKey" className="block text-sm font-medium mb-1">
              API Key
            </label>
            <input
              type="password"
              id="apiKey"
              value={settings.apiKey}
              onChange={(e) => setSettings({ ...settings, apiKey: e.target.value })}
              className="w-full px-3 py-2 border border-foreground/20 rounded-md bg-background"
              placeholder={`Enter your ${LLM_PROVIDERS.find(p => p.id === settings.llmProvider)?.name} API key`}
            />
            <p className="mt-2 text-sm text-gray-500">
              Your API key is stored securely in your browser&apos;s local storage.
            </p>
            {error && (
              <p className="mt-2 text-sm text-red-500">
                {error}
              </p>
            )}
          </div>
          
          <button
            type="submit"
            className="w-full bg-foreground text-background px-4 py-2 rounded hover:opacity-90 transition-opacity"
          >
            Save Settings
          </button>
          
          {isSaved && (
            <p className="text-sm text-green-500 text-center">
              Settings saved successfully!
            </p>
          )}
        </form>
      </div>
    </div>
  );
}