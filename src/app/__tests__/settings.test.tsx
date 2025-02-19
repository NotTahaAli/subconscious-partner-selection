import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import SettingsPage from '../settings/page';

// Mock localStorage
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  clear: jest.fn(),
};
Object.defineProperty(window, 'localStorage', { value: localStorageMock });

describe('SettingsPage', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders settings form with default values', () => {
    render(<SettingsPage />);
    
    expect(screen.getByLabelText(/LLM Provider/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/API Key/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /save settings/i })).toBeInTheDocument();
  });

  it('loads settings from localStorage on mount', () => {
    const mockSettings = {
      apiKey: 'sk-test123',
      llmProvider: 'anthropic',
    };
    localStorageMock.getItem.mockReturnValue(JSON.stringify(mockSettings));

    render(<SettingsPage />);
    
    const providerSelect = screen.getByLabelText(/LLM Provider/i) as HTMLSelectElement;
    const apiKeyInput = screen.getByLabelText(/API Key/i) as HTMLInputElement;
    
    expect(providerSelect.value).toBe('anthropic');
    expect(apiKeyInput.value).toBe('sk-test123');
  });

  it('validates OpenAI API key format', async () => {
    render(<SettingsPage />);
    
    const providerSelect = screen.getByLabelText(/LLM Provider/i);
    const apiKeyInput = screen.getByLabelText(/API Key/i);
    const submitButton = screen.getByRole('button', { name: /save settings/i });

    // Ensure OpenAI is selected
    fireEvent.change(providerSelect, { target: { value: 'openai' } });

    // Test invalid key
    fireEvent.change(apiKeyInput, { target: { value: 'invalid-key' } });
    fireEvent.click(submitButton);

    await screen.findByText(/Invalid OpenAI API key format/i);

    // Test valid key
    fireEvent.change(apiKeyInput, { target: { value: 'sk-' + 'a'.repeat(48) } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.queryByText(/Invalid OpenAI API key format/i)).not.toBeInTheDocument();
      expect(screen.getByText(/Settings saved successfully!/i)).toBeInTheDocument();
    });
  });

  it('validates Anthropic API key format', async () => {
    render(<SettingsPage />);
    
    const providerSelect = screen.getByLabelText(/LLM Provider/i);
    const apiKeyInput = screen.getByLabelText(/API Key/i);
    const submitButton = screen.getByRole('button', { name: /save settings/i });

    // Select Anthropic provider
    fireEvent.change(providerSelect, { target: { value: 'anthropic' } });

    // Test invalid key
    fireEvent.change(apiKeyInput, { target: { value: 'invalid-key' } });
    fireEvent.click(submitButton);

    expect(await screen.findByText(/Invalid Anthropic API key format/i)).toBeInTheDocument();

    // Test valid key
    fireEvent.change(apiKeyInput, { target: { value: 'sk-ant-' + 'a'.repeat(32) } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.queryByText(/Invalid Anthropic API key format/i)).not.toBeInTheDocument();
    });
  });

  it('validates Cohere API key format', async () => {
    render(<SettingsPage />);
    
    const providerSelect = screen.getByLabelText(/LLM Provider/i);
    const apiKeyInput = screen.getByLabelText(/API Key/i);
    const submitButton = screen.getByRole('button', { name: /save settings/i });

    // Select Cohere provider
    fireEvent.change(providerSelect, { target: { value: 'cohere' } });

    // Test invalid key
    fireEvent.change(apiKeyInput, { target: { value: 'invalid-key' } });
    fireEvent.click(submitButton);

    expect(await screen.findByText(/Invalid Cohere API key format/i)).toBeInTheDocument();

    // Test valid key
    fireEvent.change(apiKeyInput, { target: { value: 'a'.repeat(40) } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.queryByText(/Invalid Cohere API key format/i)).not.toBeInTheDocument();
    });
  });

  it('validates Gemini API key format', async () => {
    render(<SettingsPage />);
    
    const providerSelect = screen.getByLabelText(/LLM Provider/i);
    const apiKeyInput = screen.getByLabelText(/API Key/i);
    const submitButton = screen.getByRole('button', { name: /save settings/i });

    // Select Gemini provider
    fireEvent.change(providerSelect, { target: { value: 'gemini' } });

    // Test invalid key
    fireEvent.change(apiKeyInput, { target: { value: 'invalid-key' } });
    fireEvent.click(submitButton);

    expect(await screen.findByText(/Invalid Google Gemini API key format/i)).toBeInTheDocument();

    // Test valid key
    fireEvent.change(apiKeyInput, { target: { value: 'AIzaSyD_example_key_' + 'a'.repeat(35) } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.queryByText(/Invalid Google Gemini API key format/i)).not.toBeInTheDocument();
      expect(screen.getByText(/Settings saved successfully!/i)).toBeInTheDocument();
    });
  });

  it('saves settings to localStorage when valid', async () => {
    render(<SettingsPage />);
    
    const providerSelect = screen.getByLabelText(/LLM Provider/i);
    const apiKeyInput = screen.getByLabelText(/API Key/i);
    const submitButton = screen.getByRole('button', { name: /save settings/i });

    // Enter valid settings
    fireEvent.change(providerSelect, { target: { value: 'openai' } });
    fireEvent.change(apiKeyInput, { target: { value: 'sk-' + 'a'.repeat(48) } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(localStorageMock.setItem).toHaveBeenCalledWith(
        'llmSettings',
        JSON.stringify({
          apiKey: 'sk-' + 'a'.repeat(48),
          llmProvider: 'openai'
        })
      );
    });

    expect(await screen.findByText(/Settings saved successfully!/i)).toBeInTheDocument();
  });
});