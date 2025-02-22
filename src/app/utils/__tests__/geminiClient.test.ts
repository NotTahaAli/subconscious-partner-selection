import { GoogleGenerativeAI } from '@google/generative-ai';
import GeminiClient from '../geminiClient';

// Mock the Google Generative AI SDK
jest.mock('@google/generative-ai');

describe('GeminiClient', () => {
  const mockApiKey = 'test-api-key';
  const mockResponse = {
    title: "Alex",
    description: "A thoughtful and creative individual who approaches life with curiosity and warmth.",
    traits: [
      "Empathy: connects deeply with others' emotions",
      "Creativity: brings imagination and innovation to daily life",
      "Reliability: shows up consistently in relationships"
    ]
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('initializes with provided API key and default model', () => {
    new GeminiClient({ apiKey: mockApiKey });
    expect(GoogleGenerativeAI).toHaveBeenCalledWith(mockApiKey);
  });

  it('successfully generates a personality description', async () => {
    const mockGenerateContent = jest.fn().mockResolvedValue({
      response: {
        text: () => JSON.stringify(mockResponse)
      }
    });

    const mockGetModel = jest.fn().mockReturnValue({
      generateContent: mockGenerateContent
    });

    (GoogleGenerativeAI as jest.Mock).mockImplementation(() => ({
      getGenerativeModel: mockGetModel
    }));

    const client = new GeminiClient({ apiKey: mockApiKey });
    const result = await client.generatePersonalityDescription();

    expect(result).toEqual(mockResponse);
    expect(mockGetModel).toHaveBeenCalledWith({ model: 'gemini-2.0-flash' });
    expect(mockGenerateContent).toHaveBeenCalled();
  });

  it('handles non-JSON responses gracefully', async () => {
    const mockGenerateContent = jest.fn().mockResolvedValue({
      response: {
        text: () => 'Invalid JSON response'
      }
    });

    (GoogleGenerativeAI as jest.Mock).mockImplementation(() => ({
      getGenerativeModel: () => ({
        generateContent: mockGenerateContent
      })
    }));

    const client = new GeminiClient({ apiKey: mockApiKey });
    await expect(client.generatePersonalityDescription())
      .rejects
      .toThrow('Gemini API error: Failed to parse or validate Gemini response');
  });

  it('handles API errors appropriately', async () => {
    const mockError = new Error('API Error');
    const mockGenerateContent = jest.fn().mockRejectedValue(mockError);

    (GoogleGenerativeAI as jest.Mock).mockImplementation(() => ({
      getGenerativeModel: () => ({
        generateContent: mockGenerateContent
      })
    }));

    const client = new GeminiClient({ apiKey: mockApiKey });
    await expect(client.generatePersonalityDescription())
      .rejects
      .toThrow('Gemini API error: API Error');
  });
});