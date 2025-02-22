"use client";

import { useEffect, useState } from 'react';
import Link from 'next/link';
import PersonalityCard from '../components/PersonalityCard';
import { generatePersonalityPair } from '../utils/generatePersonalities';
import { updateEloRatings } from '../utils/eloAlgorithm';
import type { PersonalityTrait } from '../types/personality';

interface Settings {
  apiKey: string;
  llmProvider: string;
}

interface PersonalityDescription {
  title: string;
  description: string;
  traits: PersonalityTrait[];
}

export default function ComparePage() {
  const [selectedPersonality, setSelectedPersonality] = useState<'A' | 'B' | null>(null);
  const [settings, setSettings] = useState<Settings | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [personalityA, setPersonalityA] = useState<PersonalityDescription | null>(null);
  const [personalityB, setPersonalityB] = useState<PersonalityDescription | null>(null);
  const [alreadyCompared, setAlreadyCompared] = useState(false);

  useEffect(() => {
    const storedSettings = localStorage.getItem('llmSettings');
    if (storedSettings) {
      setSettings(JSON.parse(storedSettings));
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    const generatePair = async () => {
      if (settings?.apiKey) {
        try {
          setLoading(true);
          setError(null);
          const { a, b } = await generatePersonalityPair(settings.apiKey, settings.llmProvider);
          setPersonalityA(a);
          setPersonalityB(b);
        } catch (err) {
          setError('Failed to generate personalities. Please try again.');
          console.error(err);
        } finally {
          setLoading(false);
        }
      }
    };

    if (settings?.apiKey && (!personalityA || !personalityB)) {
      generatePair();
    }
  }, [settings, personalityA, personalityB]);

  const handleSelection = async (selected: 'A' | 'B') => {
    if (!personalityA || !personalityB) return;
    
    setSelectedPersonality(selected);

    // Update trait scores using Elo algorithm
    const winner = selected === 'A' ? personalityA : personalityB;
    const loser = selected === 'A' ? personalityB : personalityA;

    // Get current scores
    const storedScores = JSON.parse(localStorage.getItem('traitScores') || '{}');
    const updatedScores = { ...storedScores };

    // Update scores for traits from both personalities
    [...winner.traits, ...loser.traits].forEach(trait => {
      const winnerScore = winner.traits.find(t => t.name === trait.name)?.score || storedScores[trait.name] || 1500;
      const loserScore = loser.traits.find(t => t.name === trait.name)?.score || storedScores[trait.name] || 1500;
      
      if (winner.traits.find(t => t.name === trait.name)) {
        // Trait is in winning personality
        updatedScores[trait.name] = updateEloRatings(winnerScore, loserScore).winner;
      }
      if (loser.traits.find(t => t.name === trait.name)) {
        // Trait is in losing personality
        updatedScores[trait.name] = updateEloRatings(winnerScore, loserScore).loser;
      }
    });

    // Update total comparisons
    if (!alreadyCompared) {
      setAlreadyCompared(true);
      const totalComparisons = parseInt(localStorage.getItem('totalComparisons') || '0', 10);
      localStorage.setItem('totalComparisons', (totalComparisons + 1).toString());
    }
    
    // Save updated scores
    localStorage.setItem('traitScores', JSON.stringify(updatedScores));
  };

  if (loading) {
    return (
      <div className="max-w-xl mx-auto text-center py-12">
        <p className="text-lg">Loading...</p>
      </div>
    );
  }

  if (!settings?.apiKey) {
    return (
      <div className="max-w-xl mx-auto text-center space-y-6">
        <h1 className="text-3xl font-bold">API Key Required</h1>
        <p className="text-lg">
          To generate unique personality comparisons, you need to configure your LLM API key first.
        </p>
        <Link
          href="/settings"
          className="inline-block bg-foreground text-background px-6 py-3 rounded-lg hover:opacity-90 transition-opacity"
        >
          Configure Settings
        </Link>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-xl mx-auto text-center space-y-6">
        <h1 className="text-3xl font-bold text-red-500">Error</h1>
        <p className="text-lg">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="inline-block bg-foreground text-background px-6 py-3 rounded-lg hover:opacity-90 transition-opacity"
        >
          Try Again
        </button>
      </div>
    );
  }

  if (!personalityA || !personalityB) {
    return null;
  }

  return (
    <div className="max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-8 text-center">Who Do You Connect With More?</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <PersonalityCard 
          {...personalityA}
          isSelected={selectedPersonality === 'A'}
          onSelect={() => handleSelection('A')}
        />
        <PersonalityCard 
          {...personalityB}
          isSelected={selectedPersonality === 'B'}
          onSelect={() => handleSelection('B')}
        />
      </div>
      {selectedPersonality && (
        <div className="mt-8 text-center space-y-4">
          <button 
            onClick={() => {
              setSelectedPersonality(null);
              setPersonalityA(null);
              setPersonalityB(null);
            }}
            className="inline-block bg-foreground text-background px-6 py-3 rounded-lg hover:opacity-90 transition-opacity"
          >
            Compare New Pair
          </button>
          <p className="text-sm text-gray-300">Your trait preferences have been updated!</p>
        </div>
      )}
    </div>
  );
}