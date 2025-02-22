import { GoogleGenerativeAI } from '@google/generative-ai';
import { STANDARD_TRAITS } from '../types/standardTraits';

interface GeminiConfig {
  apiKey: string;
  model: string;
}

export class GeminiClient {
  private client: GoogleGenerativeAI;
  private model: string;

  constructor(config: GeminiConfig) {
    this.client = new GoogleGenerativeAI(config.apiKey);
    this.model = config.model || 'gemini-pro';
  }

  async generatePersonalityDescription(): Promise<{title: string; description: string; traits: string[]}> {
    const availableTraits = STANDARD_TRAITS.map(t => `${t.name}: ${t.description}`).join('\n');
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