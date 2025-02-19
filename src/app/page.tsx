import TraitRankings from './components/TraitRankings';
import Link from 'next/link';

// Mock data - in a real implementation this would come from local storage or an API
const mockRankings = {
  totalComparisons: 25,
  traits: [
    {
      name: "Empathy",
      score: 2100,
      description: "Ability to understand and share others' feelings"
    },
    {
      name: "Ambition",
      score: 1800,
      description: "Drive and determination to achieve goals"
    },
    {
      name: "Humor",
      score: 2400,
      description: "Ability to make others laugh and find joy in life"
    },
    {
      name: "Intelligence",
      score: 2200,
      description: "Capacity for learning, understanding, and problem-solving"
    },
    {
      name: "Reliability",
      score: 1950,
      description: "Consistency and dependability in actions and commitments"
    }
  ]
};

export default function Home() {
  return (
    <div className="max-w-4xl mx-auto space-y-12">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-6">
          Discover Your Partner Preferences
        </h1>
        <p className="text-lg mb-8">
          Through a series of comparisons, this tool helps you understand your
          subconscious preferences in potential partners using AI-generated
          personality descriptions.
        </p>
        <Link
          href="/compare"
          className="inline-block bg-foreground text-background px-6 py-3 rounded-lg hover:opacity-90 transition-opacity"
        >
          Start Comparing
        </Link>
      </div>
      
      <TraitRankings rankings={mockRankings} />
    </div>
  );
}
