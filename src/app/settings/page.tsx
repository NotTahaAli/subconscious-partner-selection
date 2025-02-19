export default function SettingsPage() {
  return (
    <div className="max-w-xl mx-auto">
      <h1 className="text-3xl font-bold mb-8 text-center">Settings</h1>
      <div className="bg-background border border-foreground/10 rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-4">LLM API Configuration</h2>
        <form className="space-y-4">
          <div>
            <label htmlFor="apiKey" className="block text-sm font-medium mb-1">
              API Key
            </label>
            <input
              type="password"
              id="apiKey"
              className="w-full px-3 py-2 border border-foreground/20 rounded-md bg-background"
              placeholder="Enter your API key"
            />
            <p className="mt-2 text-sm text-gray-500">
              Your API key is stored securely in your browser&apos;s local storage.
            </p>
          </div>
          <button
            type="submit"
            className="w-full bg-foreground text-background px-4 py-2 rounded hover:opacity-90 transition-opacity"
          >
            Save Settings
          </button>
        </form>
      </div>
    </div>
  );
}