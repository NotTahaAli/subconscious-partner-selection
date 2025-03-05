import { generateStaticPersonalityDescription, generateAIPersonalityInsight } from '../generateDescription';
import GeminiClient from '../geminiClient';

// Mock the GeminiClient
jest.mock('../geminiClient', () => {
  return jest.fn().mockImplementation(() => {
    return {
      generatePersonalityInsight: jest.fn().mockResolvedValue(
        "This is a mock AI-generated insight about your personality traits."
      )
    };
  });
});

describe('generateDescription', () => {
  describe('generateStaticPersonalityDescription', () => {
    it('handles empty trait array', () => {
      const mockRankings = { totalComparisons: 0, traits: [] };
      const result = generateStaticPersonalityDescription(mockRankings);
      expect(result).toBe("You haven't shared any partner preferences yet.");
    });

    it('handles single trait', () => {
      const mockRankings = { 
        totalComparisons: 1, 
        traits: [{ name: 'Kindness', description: 'Shows genuine compassion', score: 1600 }]
      };
      const result = generateStaticPersonalityDescription(mockRankings);
      expect(result).toContain("You're most drawn to people who shows genuine compassion");
    });

    it('generates description for two traits', () => {
      const mockRankings = { 
        totalComparisons: 1, 
        traits: [
          { name: 'Kindness', description: 'Shows genuine compassion', score: 1600 },
          { name: 'Humor', description: 'Makes you laugh', score: 1550 }
        ]
      };
      const result = generateStaticPersonalityDescription(mockRankings);
      expect(result).toContain("You're naturally drawn to people who");
      expect(result).toContain("shows genuine compassion");
      expect(result).toContain("makes you laugh");
    });

    it('generates description for multiple traits', () => {
      const mockRankings = { 
        totalComparisons: 5, 
        traits: [
          { name: 'Kindness', description: 'Shows genuine compassion', score: 1600 },
          { name: 'Humor', description: 'Makes you laugh', score: 1550 },
          { name: 'Intelligence', description: 'Is intellectually stimulating', score: 1520 },
          { name: 'Ambition', description: 'Has clear goals', score: 1480 }
        ]
      };
      const result = generateStaticPersonalityDescription(mockRankings);
      expect(result).toContain("You tend to form the strongest connections");
      expect(result).toContain("shows genuine compassion");
      expect(result).toContain("makes you laugh");
      expect(result).toContain("is intellectually stimulating");
      expect(result).toContain("While you appreciate when someone has clear goals");
    });
  });

  describe('generateAIPersonalityInsight', () => {
    it('returns default message when no comparisons', async () => {
      const mockRankings = { totalComparisons: 0, traits: [] };
      const result = await generateAIPersonalityInsight(mockRankings, 'mock-api-key', 'gemini');
      expect(result).toBe("You haven't shared any partner preferences yet.");
    });

    it('calls geminiClient.generatePersonalityInsight with correct parameters', async () => {
      const mockRankings = { 
        totalComparisons: 5, 
        traits: [
          { name: 'Kindness', description: 'Shows genuine compassion', score: 1600 },
          { name: 'Humor', description: 'Makes you laugh', score: 1550 }
        ]
      };
      
      const result = await generateAIPersonalityInsight(mockRankings, 'mock-api-key', 'gemini');
      expect(GeminiClient).toHaveBeenCalledWith({ apiKey: 'mock-api-key', model: 'gemini-2.0-flash' });
      
      const mockClientInstance = (GeminiClient as jest.Mock).mock.results[0].value;
      expect(mockClientInstance.generatePersonalityInsight).toHaveBeenCalledWith(mockRankings);
      
      expect(result).toBe("This is a mock AI-generated insight about your personality traits.");
    });

    it('falls back to static description when LLM provider is not supported', async () => {
      const mockRankings = { 
        totalComparisons: 5, 
        traits: [
          { name: 'Kindness', description: 'Shows genuine compassion', score: 1600 },
          { name: 'Humor', description: 'Makes you laugh', score: 1550 }
        ]
      };
      
      const result = await generateAIPersonalityInsight(mockRankings, 'mock-api-key', 'unsupported-provider');
      expect(result).toContain("You're naturally drawn to people who");
    });

    it('falls back to static description when API call fails', async () => {
      // Override mock for this test to simulate failure
      (GeminiClient as jest.Mock).mockImplementationOnce(() => {
        return {
          generatePersonalityInsight: jest.fn().mockRejectedValue(new Error('API error'))
        };
      });

      const mockRankings = { 
        totalComparisons: 5, 
        traits: [
          { name: 'Kindness', description: 'Shows genuine compassion', score: 1600 },
          { name: 'Humor', description: 'Makes you laugh', score: 1550 }
        ]
      };
      
      const result = await generateAIPersonalityInsight(mockRankings, 'mock-api-key', 'gemini');
      expect(result).toContain("You're naturally drawn to people who");
    });
  });
});