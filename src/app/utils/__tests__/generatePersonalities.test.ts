import { generatePersonalityPair } from '../generatePersonalities';
import GeminiClient from '../geminiClient';

// Mock the GeminiClient
jest.mock('../geminiClient');

describe('generatePersonalities', () => {
  const mockApiKey = 'test-api-key';
  const mockPersonalityA = {
    title: "Alex",
    description: "A thoughtful and creative individual who approaches life with curiosity.",
    traits: [
      "Empathy: connects deeply with others' emotions",
      "Creativity: brings imagination and innovation to daily life",
      "Reliability: shows up consistently in relationships"
    ]
  };

  const mockPersonalityB = {
    title: "Jordan",
    description: "An energetic and passionate person who inspires those around them.",
    traits: [
      "Leadership: naturally guides and inspires others",
      "Curiosity: shows genuine interest in learning and exploring",
      "Adaptability: embraces change with grace and flexibility"
    ]
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('generates two different personalities successfully', async () => {
    const generateMock = jest.fn()
      .mockImplementationOnce(() => Promise.resolve(mockPersonalityA))
      .mockImplementationOnce(() => Promise.resolve(mockPersonalityB));

    (GeminiClient as jest.Mock).mockImplementation(() => ({
      generatePersonalityDescription: generateMock
    }));

    const result = await generatePersonalityPair(mockApiKey, 'gemini');

    expect(GeminiClient).toHaveBeenCalledWith({ apiKey: mockApiKey, model: 'gemini-2.0-flash' });
    expect(result.a.title).toBe('Alex');
    expect(result.b.title).toBe('Jordan');
    expect(result.a.traits).toHaveLength(3);
    expect(result.b.traits).toHaveLength(3);
    expect(result.a.traits[0].score).toBe(1500);
    expect(generateMock).toHaveBeenCalledTimes(2);
  });

  it('throws error for unsupported LLM provider', async () => {
    await expect(generatePersonalityPair(mockApiKey, 'openai'))
      .rejects
      .toThrow('Only Gemini LLM provider is currently supported');
  });

  it('handles API errors appropriately', async () => {
    (GeminiClient as jest.Mock).mockImplementation(() => ({
      generatePersonalityDescription: jest.fn().mockRejectedValue(new Error('API Error'))
    }));

    await expect(generatePersonalityPair(mockApiKey, 'gemini'))
      .rejects
      .toThrow('Failed to generate personalities: API Error');
  });

  it('retries up to max attempts if same name is generated', async () => {
    const generateMock = jest.fn()
      .mockImplementationOnce(() => Promise.resolve(mockPersonalityA))
      .mockImplementationOnce(() => Promise.resolve({ ...mockPersonalityA }))
      .mockImplementationOnce(() => Promise.resolve(mockPersonalityA))
      .mockImplementationOnce(() => Promise.resolve({ ...mockPersonalityA }))
      .mockImplementationOnce(() => Promise.resolve(mockPersonalityA))
      .mockImplementationOnce(() => Promise.resolve({ ...mockPersonalityA }));

    (GeminiClient as jest.Mock).mockImplementation(() => ({
      generatePersonalityDescription: generateMock
    }));

    await expect(generatePersonalityPair(mockApiKey, 'gemini'))
      .rejects
      .toThrow('Maximum retry attempts reached while trying to generate unique personalities');

    expect(generateMock).toHaveBeenCalledTimes(6); // 2 calls per attempt, 3 attempts total (initial + 2 retries)
  });
});