import { PersonalityTrait } from '../types/personality';
import { STANDARD_TRAITS } from '../types/standardTraits';
import GeminiClient from './geminiClient';

interface PersonalityDescription {
  title: string;
  description: string;
  traits: PersonalityTrait[];
}

interface PersonalityPair {
  a: PersonalityDescription;
  b: PersonalityDescription;
}

const MAX_RETRIES = 3;

function parseTraits(traitStrings: string[]): PersonalityTrait[] {
  return traitStrings.map(trait => {
    // Find the matching standard trait
    const [traitName] = trait.split(':');
    const standardTrait = STANDARD_TRAITS.find(st => st.name === traitName.trim());
    
    if (!standardTrait) {
      throw new Error(`Invalid trait name: ${traitName}`);
    }

    // Get the current score for this trait from localStorage or use default
    const storedScores = JSON.parse(localStorage.getItem('traitScores') || '{}');
    const score = storedScores[standardTrait.name] || 1500;

    return {
      name: standardTrait.name,
      description: standardTrait.description,
      score
    };
  });
}

export async function generatePersonalityPair(
  apiKey: string, 
  llmProvider: string,
  retryCount = 0
): Promise<PersonalityPair> {
  if (llmProvider !== 'gemini') {
    throw new Error('Only Gemini LLM provider is currently supported');
  }

  if (retryCount >= MAX_RETRIES) {
    throw new Error('Maximum retry attempts reached while trying to generate unique personalities');
  }

  try {
    const client = new GeminiClient({ apiKey, model: 'gemini-pro' });
    
    // Generate first personality
    const resultA = await client.generatePersonalityDescription();
    const personalityA: PersonalityDescription = {
      title: resultA.title,
      description: resultA.description,
      traits: parseTraits(resultA.traits)
    };

    // Generate second personality
    const resultB = await client.generatePersonalityDescription();
    const personalityB: PersonalityDescription = {
      title: resultB.title,
      description: resultB.description,
      traits: parseTraits(resultB.traits)
    };

    // If same name or too similar traits (>2 traits in common), retry
    if (personalityA.title === personalityB.title || hasTooManyCommonTraits(personalityA, personalityB)) {
      return generatePersonalityPair(apiKey, llmProvider, retryCount + 1);
    }

    return {
      a: personalityA,
      b: personalityB
    };
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Failed to generate personalities: ${error.message}`);
    }
    throw error;
  }
}

function hasTooManyCommonTraits(a: PersonalityDescription, b: PersonalityDescription): boolean {
  const traitsA = new Set(a.traits.map(t => t.name));
  const commonTraits = b.traits.filter(t => traitsA.has(t.name));
  return commonTraits.length > 1; // Allow at most 1 trait in common
}