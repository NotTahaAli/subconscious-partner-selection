"use client";

import { useState } from 'react';
import PersonalityCard from '../components/PersonalityCard';
import type { PersonalityTrait } from '../types/personality';

// Mock data - will be replaced with real data later
const mockPersonalityA = {
  title: "Alex",
  description: "A warm-hearted person who brings passion to both their career and relationships. They naturally inspire others through their leadership while maintaining genuine connections with those around them.",
  traits: [
    { name: "Ambition", score: 2400, description: "Passionately pursues meaningful goals" },
    { name: "Charisma", score: 2200, description: "Connects deeply with others" },
    { name: "Balance", score: 2100, description: "Values both career and relationships" },
  ] as PersonalityTrait[]
};

const mockPersonalityB = {
  title: "Jordan",
  description: "A thoughtful and creative individual who sees beauty in life's little moments. They form deep emotional bonds and approach relationships with genuine curiosity and care.",
  traits: [
    { name: "Empathy", score: 2300, description: "Understands and shares others' feelings naturally" },
    { name: "Creativity", score: 2200, description: "Brings imagination to daily life" },
    { name: "Curiosity", score: 2000, description: "Shows genuine interest in others" },
  ] as PersonalityTrait[]
};

export default function ComparePage() {
  const [selectedPersonality, setSelectedPersonality] = useState<'A' | 'B' | null>(null);

  return (
    <div className="max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-8 text-center">Who Do You Connect With More?</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <PersonalityCard 
          {...mockPersonalityA}
          isSelected={selectedPersonality === 'A'}
          onSelect={() => setSelectedPersonality('A')}
        />
        <PersonalityCard 
          {...mockPersonalityB}
          isSelected={selectedPersonality === 'B'}
          onSelect={() => setSelectedPersonality('B')}
        />
      </div>
      {selectedPersonality && (
        <div className="mt-8 text-center">
          <button 
            onClick={() => setSelectedPersonality(null)}
            className="text-sm text-gray-500 hover:text-gray-700"
          >
            Compare Again
          </button>
        </div>
      )}
    </div>
  );
}