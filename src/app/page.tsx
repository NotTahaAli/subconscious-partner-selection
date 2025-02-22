import TraitRankings from './components/TraitRankings';
import Link from 'next/link';

// Mock data - in a real implementation this would come from local storage or an API
const mockRankings = {
  totalComparisons: 25,
  traits: [
    {
      name: "Empathy",
      score: 2100,
      description: "connects deeply with others&apos; emotions"
    },
    {
      name: "Ambition",
      score: 1800,
      description: "pursues goals with passion and purpose"
    },
    {
      name: "Humor",
      score: 2400,
      description: "brings joy and lightness to shared moments"
    },
    {
      name: "Intelligence",
      score: 2200,
      description: "engages in meaningful intellectual exchanges"
    },
    {
      name: "Reliability",
      score: 1950,
      description: "shows up consistently in relationships"
    }
  ]
};

export default function Home() {
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
        <Link
          href="/compare"
          className="inline-block bg-foreground text-background px-6 py-3 rounded-lg hover:opacity-90 transition-opacity"
        >
          Start Your Journey
        </Link>
      </div>
      
      <TraitRankings rankings={mockRankings} />
    </div>
  );
}
