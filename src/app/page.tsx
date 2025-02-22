'use client';

import TraitRankings from './components/TraitRankings';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { STANDARD_TRAITS } from './types/standardTraits';

interface Settings {
  apiKey: string;
  llmProvider: string;
}

function getInitialTraitScores() {
  const storedScores = localStorage.getItem('traitScores');
  if (storedScores) {
    const scores = JSON.parse(storedScores);
    for (const trait of STANDARD_TRAITS) {
      if (!(trait.name in scores)) {
        scores[trait.name] = 1500;
      }
    }
    for (const trait in scores) {
      if (!STANDARD_TRAITS.find(t => t.name === trait)) {
        delete scores[trait];
      }
    }
    return scores;
  }

  // Initialize with default scores for all standard traits
  const defaultScores = STANDARD_TRAITS.reduce((acc, trait) => {
    acc[trait.name] = 1500;
    return acc;
  }, {} as Record<string, number>);

  localStorage.setItem('traitScores', JSON.stringify(defaultScores));
  return defaultScores;
}

export default function Home() {
  const [settings, setSettings] = useState<Settings | null>(null);
  const [traitScores, setTraitScores] = useState<Record<string, number>>({});
  const [totalComparisons, setTotalComparisons] = useState(0);

  useEffect(() => {
    // Load settings
    const storedSettings = localStorage.getItem('llmSettings');
    if (storedSettings) {
      setSettings(JSON.parse(storedSettings));
    }

    // Load trait scores and comparison count
    const scores = getInitialTraitScores();
    const comparisons = parseInt(localStorage.getItem('totalComparisons') || '0', 10);
    setTraitScores(scores);
    setTotalComparisons(comparisons);
  }, []);

  const rankings = {
    totalComparisons,
    traits: STANDARD_TRAITS.map(trait => ({
      name: trait.name,
      description: trait.description,
      score: traitScores[trait.name] || 1500
    })).sort((a, b) => b.score - a.score)
  };

  return (
    <div className="max-w-4xl mx-auto space-y-12">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-6">
          Understand Your Heart&apos;s Choice
        </h1>
        <p className="text-lg mb-8">
          Discover the deeper patterns in your relationship preferences through a series of 
          thoughtful comparisons. Our AI-guided process helps you understand what truly 
          resonates with you in potential partners.
        </p>
        {!settings?.apiKey ? (
          <div className="space-y-4">
            <p className="text-amber-600">
              To start generating unique personality comparisons, please configure your LLM API key.
            </p>
            <Link
              href="/settings"
              className="inline-block bg-foreground text-background px-6 py-3 rounded-lg hover:opacity-90 transition-opacity"
            >
              Configure Settings
            </Link>
          </div>
        ) : (
          <Link
            href="/compare"
            className="inline-block bg-foreground text-background px-6 py-3 rounded-lg hover:opacity-90 transition-opacity"
          >
            Start Your Journey
          </Link>
        )}
      </div>
      
      {totalComparisons > 0 ? (
        <TraitRankings rankings={rankings} />
      ) : (
        <div className="text-center text-gray-500">
          <p>Complete your first comparison to see your trait preferences.</p>
        </div>
      )}
    </div>
  );
}
