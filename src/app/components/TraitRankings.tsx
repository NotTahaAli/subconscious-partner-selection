import { useState, useEffect } from 'react';
import { TraitRankings as TraitRankingsType } from '../types/personality';
import { generateStaticPersonalityDescription, generateAIPersonalityInsight } from '../utils/generateDescription';

interface TraitRankingsProps {
  rankings: TraitRankingsType;
  apiKey?: string;
  llmProvider?: string;
}

export default function TraitRankings({ rankings, apiKey, llmProvider }: TraitRankingsProps) {
  const [personalityDescription, setPersonalityDescription] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(true);
  
  useEffect(() => {
    async function fetchInsight() {
      setIsLoading(true);
      try {
        // If API key and provider are available, generate AI insight
        if (apiKey && llmProvider) {
          const insight = await generateAIPersonalityInsight(rankings, apiKey, llmProvider);
          setPersonalityDescription(insight);
        } else {
          // Fall back to static description
          setPersonalityDescription(generateStaticPersonalityDescription(rankings));
        }
      } catch (error) {
        console.error('Failed to generate insight:', error);
        setPersonalityDescription(generateStaticPersonalityDescription(rankings));
      } finally {
        setIsLoading(false);
      }
    }
    
    fetchInsight();
  }, [rankings, apiKey, llmProvider]);

  // Ensure personalityDescription is a string
  const descriptionText = typeof personalityDescription === 'string' ? personalityDescription : '';
  const paragraphs = descriptionText.split('\n\n');

  return (
    <div className="space-y-8">
      <div className="bg-background border border-foreground/10 rounded-lg p-6">
        <h2 className="text-2xl font-semibold mb-4">Your Subconscious Preferences</h2>
        <p className="text-sm text-gray-300 mb-6">
          Based on {rankings.totalComparisons} comparisons
        </p>
        <div className="space-y-4">
          {rankings.traits.map((trait) => (
            <div key={trait.name}>
              <div className="flex justify-between items-center mb-1">
                <span className="font-medium">{trait.name}</span>
                <span className="text-sm text-gray-300">Score: {trait.score}</span>
              </div>
              <div className="h-2 bg-foreground/10 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-foreground transition-all" 
                  style={{ width: `${(trait.score / 3000) * 100}%` }}
                />
              </div>
              <p className="text-sm text-gray-300 mt-1">{trait.description}</p>
            </div>
          ))}
        </div>
      </div>
      <div className="bg-background border border-foreground/10 rounded-lg p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-semibold">AI-Generated Insight</h2>
          {isLoading && (
            <div className="text-sm text-gray-300">
              Generating insight...
            </div>
          )}
        </div>
        <div className="prose prose-gray">
          {isLoading ? (
            <div data-testid="loading-animation" className="animate-pulse space-y-2">
              <div className="h-4 bg-foreground/10 rounded w-3/4"></div>
              <div className="h-4 bg-foreground/10 rounded"></div>
              <div className="h-4 bg-foreground/10 rounded w-5/6"></div>
              <div className="h-4 bg-foreground/10 rounded w-4/6"></div>
            </div>
          ) : (
            paragraphs.map((paragraph, index) => (
              <p key={index} className="mb-4 text-gray-400 last:mb-0">
                {paragraph}
              </p>
            ))
          )}
        </div>
      </div>
    </div>
  );
}