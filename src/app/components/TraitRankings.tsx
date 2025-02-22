import { TraitRankings as TraitRankingsType } from '../types/personality';
import { generatePersonalityDescription } from '../utils/generateDescription';

export default function TraitRankings({ rankings }: { rankings: TraitRankingsType }) {
  const personalityDescription = generatePersonalityDescription(rankings);

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
        <h2 className="text-2xl font-semibold mb-4">AI-Generated Insight</h2>
        <div className="prose prose-gray">
          {personalityDescription.split('\n\n').map((paragraph, index) => (
            <p key={index} className="mb-4 text-gray-400 last:mb-0">
              {paragraph}
            </p>
          ))}
        </div>
      </div>
    </div>
  );
}