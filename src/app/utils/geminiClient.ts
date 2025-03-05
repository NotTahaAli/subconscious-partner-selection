import { GoogleGenerativeAI } from '@google/generative-ai';
import { STANDARD_TRAITS } from '../types/standardTraits';
import { shuffleArray } from './shuffle';
import { TraitRankings } from '../types/personality';

interface GeminiConfig {
  apiKey: string;
  model: string;
}

export class GeminiClient {
  private client: GoogleGenerativeAI;
  private model: string;

  constructor(config: GeminiConfig) {
    this.client = new GoogleGenerativeAI(config.apiKey);
    this.model = config.model || 'gemini-2.0-flash';
  }

  async generatePersonalityDescription(): Promise<{title: string; description: string; traits: string[]}> {
    const traitsArr = STANDARD_TRAITS.slice(0);
    shuffleArray(traitsArr);
    const availableTraits = traitsArr.map(t => `${t.name}: ${t.description}`).join('\n');
    const prompt = `Generate a unique fictional personality profile for a potential romantic partner. Include:
    1. A gender-neutral name
    2. A 2-3 sentence description of their personality that reflects their key traits
    3. Select exactly three traits from the following list (keep the exact names):
    
    ${availableTraits}
    
    Format the response as valid JSON with this structure:
    {
      "title": "name",
      "description": "personality description that references the selected traits",
      "traits": ["Trait Name: trait description", "Trait Name: trait description", "Trait Name: trait description"]
    }
    
    Important: Only use traits from the provided list, keeping their exact names.`;

    try {
      const model = this.client.getGenerativeModel({ model: this.model });
      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text().trim();
      
      // Extract JSON if in the format ```json...```
      const jsonMatch = text.match(/```json\n([^`]*)\n```/i);
      if (jsonMatch) {
        try {
          const parsed = JSON.parse(jsonMatch[1].trim());
          this.validateTraits(parsed.traits);
          return parsed;
        } catch {
          throw new Error('Failed to parse or validate Gemini response');
        }
      }
      
      try {
        const parsed = JSON.parse(text);
        this.validateTraits(parsed.traits);
        return parsed;
      } catch {
        throw new Error('Failed to parse or validate Gemini response');
      }
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Gemini API error: ${error.message}`);
      }
      throw error;
    }
  }

  async generatePersonalityInsight(rankings: TraitRankings): Promise<string> {
    if (!rankings.traits.length) {
      return "You haven't shared any partner preferences yet.";
    }

    // Sort traits by score (highest to lowest)
    const sortedTraits = [...rankings.traits].sort((a, b) => b.score - a.score);
    
    // Create a list of traits with their scores and descriptions
    const traitsWithScores = sortedTraits.map(t => 
      `${t.name} (${t.score}): ${t.description}`
    ).join('\n');
    
    const prompt = `Based on the following personality trait preferences ranked by ELO score (higher score = more preferred), 
    create an insightful analysis of the user's romantic preferences. The user has completed ${rankings.totalComparisons} comparison(s).
    
    TRAIT PREFERENCES (sorted by preference score):
    ${traitsWithScores}
    
    Provide a thoughtful, 2-3 paragraph analysis that:
    1. Discusses patterns in their top 3-4 traits and what these reveal about their romantic preferences
    2. Identifies potential complementary traits or personalities
    3. Offers insight into what might make relationships satisfying for them based on these preferences
    
    Write in second person ("you"). Be concise but meaningful. Focus on genuine psychological insights rather than generic statements.`;

    try {
      const model = this.client.getGenerativeModel({ model: this.model });
      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text().trim();
      
      return text;
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Failed to generate personality insight: ${error.message}`);
      }
      throw error;
    }
  }

  private validateTraits(traits: string[]): void {
    if (!Array.isArray(traits) || traits.length !== 3) {
      throw new Error('Response must include exactly three traits');
    }

    const standardTraitStrings: string[] = STANDARD_TRAITS.map(t => t.name);
    const invalidTraits = traits.filter(trait => !standardTraitStrings.includes(trait.split(":")[0].trim()));
    
    if (invalidTraits.length > 0) {
      throw new Error(`Invalid traits detected: ${invalidTraits.join(', ')}`);
    }
  }
}

export default GeminiClient;