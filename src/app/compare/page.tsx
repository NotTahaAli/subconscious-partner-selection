"use client";

import { useState } from 'react';
import PersonalityCard from '../components/PersonalityCard';
import type { PersonalityTrait } from '../types/personality';

// Mock data - will be replaced with real data later
const mockPersonalityA = {
  title: "Personality A",
  description: "A charismatic and ambitious individual with a strong drive for success. They possess natural leadership qualities and maintain a balance between professional goals and personal relationships.",
  traits: [
    { name: "Ambition", score: 2400, description: "Strong drive for success" },
    { name: "Charisma", score: 2200, description: "Natural leadership ability" },
    { name: "Balance", score: 2100, description: "Work-life harmony" },
  ] as PersonalityTrait[]
};

const mockPersonalityB = {
  title: "Personality B",
  description: "An empathetic and creative soul with a deep appreciation for arts and human connection. They approach life with curiosity and maintain strong, nurturing relationships.",
  traits: [
    { name: "Empathy", score: 2300, description: "Deep emotional understanding" },
    { name: "Creativity", score: 2200, description: "Artistic expression" },
    { name: "Curiosity", score: 2000, description: "Love for learning" },
  ] as PersonalityTrait[]
};

export default function ComparePage() {
  const [selectedPersonality, setSelectedPersonality] = useState<'A' | 'B' | null>(null);

  return (
    <div className="max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-8 text-center">Compare Personalities</h1>
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
            Clear Selection
          </button>
        </div>
      )}
    </div>
  );
}