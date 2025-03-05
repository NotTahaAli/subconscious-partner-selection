import { GoogleGenerativeAI } from '@google/generative-ai';
import GeminiClient from '../geminiClient';

jest.mock('@google/generative-ai');

describe('GeminiClient', () => {
  let mockGoogleGenerativeAI: jest.Mocked<GoogleGenerativeAI>;
  let mockGenerateContent: jest.Mock;
  let mockGetGenerativeModel: jest.Mock;

  beforeEach(() => {
    mockGenerateContent = jest.fn();
    mockGetGenerativeModel = jest.fn().mockReturnValue({
      generateContent: mockGenerateContent
    });

    mockGoogleGenerativeAI = new GoogleGenerativeAI('') as jest.Mocked<GoogleGenerativeAI>;
    mockGoogleGenerativeAI.getGenerativeModel = mockGetGenerativeModel;

    (GoogleGenerativeAI as jest.Mock).mockImplementation(() => mockGoogleGenerativeAI);
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  describe('generatePersonalityDescription', () => {
    it('should successfully generate a personality description', async () => {
      // Mock response setup
      const mockResponse = {
        response: {
          text: jest.fn().mockReturnValue(`{
            "title": "Alex",
            "description": "Alex is thoughtful and compassionate.",
            "traits": ["Kindness", "Humor", "Intelligence"]
          }`)
        }
      };
      mockGenerateContent.mockResolvedValue(mockResponse);

      // Mock the validateTraits method to avoid validation errors in tests
      // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-empty-function
      const validateTraitsSpy = jest.spyOn(GeminiClient.prototype as any, 'validateTraits').mockImplementation(() => {});

      const client = new GeminiClient({ apiKey: 'test-key', model: 'test-model' });
      const result = await client.generatePersonalityDescription();

      expect(result).toEqual({
        title: 'Alex',
        description: 'Alex is thoughtful and compassionate.',
        traits: ['Kindness', 'Humor', 'Intelligence']
      });

      expect(mockGetGenerativeModel).toHaveBeenCalledWith({ model: 'test-model' });
      expect(mockGenerateContent).toHaveBeenCalledWith(expect.stringContaining('Generate a unique fictional personality profile'));
      
      // Clean up spy
      validateTraitsSpy.mockRestore();
    });

    it('should handle code block formatted responses', async () => {
      // Mock response with code block formatting
      const mockResponse = {
        response: {
          text: jest.fn().mockReturnValue(`\`\`\`json
{
  "title": "Jordan",
  "description": "Jordan is intellectual and witty.",
  "traits": ["Intelligence", "Humor", "Openness"]
}
\`\`\``)
        }
      };
      mockGenerateContent.mockResolvedValue(mockResponse);

      // Mock the validateTraits method to avoid validation errors in tests
      // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-empty-function
      const validateTraitsSpy = jest.spyOn(GeminiClient.prototype as any, 'validateTraits').mockImplementation(() => {});

      const client = new GeminiClient({ apiKey: 'test-key', model: 'test-model' });
      const result = await client.generatePersonalityDescription();

      expect(result).toEqual({
        title: 'Jordan',
        description: 'Jordan is intellectual and witty.',
        traits: ['Intelligence', 'Humor', 'Openness']
      });
      
      // Clean up spy
      validateTraitsSpy.mockRestore();
    });

    it('should throw an error when validation fails', async () => {
      // Mock response with invalid number of traits
      const mockResponse = {
        response: {
          text: jest.fn().mockReturnValue(`{
            "title": "Alex",
            "description": "Alex is thoughtful.",
            "traits": ["Kindness", "Humor"]
          }`)
        }
      };
      mockGenerateContent.mockResolvedValue(mockResponse);
      
      const client = new GeminiClient({ apiKey: 'test-key', model: 'test-model' });
      
      await expect(client.generatePersonalityDescription()).rejects.toThrow();
    });
  });

  describe('generatePersonalityInsight', () => {
    it('should generate an insight based on trait rankings', async () => {
      // Mock response for insight generation
      const mockInsightText = 'Your preference for kindness and humor suggests you value emotional connection and lightness in relationships.';
      const mockResponse = {
        response: {
          text: jest.fn().mockReturnValue(mockInsightText)
        }
      };
      mockGenerateContent.mockResolvedValue(mockResponse);

      const mockRankings = {
        totalComparisons: 5,
        traits: [
          { name: 'Kindness', description: 'Shows genuine compassion', score: 1700 },
          { name: 'Humor', description: 'Makes you laugh', score: 1650 },
          { name: 'Intelligence', description: 'Is intellectually stimulating', score: 1550 }
        ]
      };

      const client = new GeminiClient({ apiKey: 'test-key', model: 'test-model' });
      const result = await client.generatePersonalityInsight(mockRankings);

      expect(result).toBe(mockInsightText);
      expect(mockGetGenerativeModel).toHaveBeenCalledWith({ model: 'test-model' });
      expect(mockGenerateContent).toHaveBeenCalledWith(expect.stringContaining('Based on the following personality trait preferences'));
      expect(mockGenerateContent).toHaveBeenCalledWith(expect.stringContaining('Kindness (1700)'));
    });

    it('should handle empty traits gracefully', async () => {
      const mockRankings = {
        totalComparisons: 0,
        traits: []
      };

      const client = new GeminiClient({ apiKey: 'test-key', model: 'test-model' });
      const result = await client.generatePersonalityInsight(mockRankings);

      expect(result).toBe("You haven't shared any partner preferences yet.");
      expect(mockGenerateContent).not.toHaveBeenCalled();
    });

    it('should throw an error when API call fails', async () => {
      mockGenerateContent.mockRejectedValue(new Error('API error'));

      const mockRankings = {
        totalComparisons: 5,
        traits: [
          { name: 'Kindness', description: 'Shows genuine compassion', score: 1700 },
          { name: 'Humor', description: 'Makes you laugh', score: 1650 }
        ]
      };

      const client = new GeminiClient({ apiKey: 'test-key', model: 'test-model' });
      
      await expect(client.generatePersonalityInsight(mockRankings)).rejects.toThrow(
        'Failed to generate personality insight: API error'
      );
    });
  });
});