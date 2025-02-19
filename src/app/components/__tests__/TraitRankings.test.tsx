import { render, screen } from '@testing-library/react';
import TraitRankings from '../TraitRankings';

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
    }
  ]
};

describe('TraitRankings', () => {
  it('displays total comparisons count', () => {
    render(<TraitRankings rankings={mockRankings} />);
    expect(screen.getByText(/based on 25 comparisons/i)).toBeInTheDocument();
  });

  it('renders all traits with their scores', () => {
    render(<TraitRankings rankings={mockRankings} />);
    
    mockRankings.traits.forEach(trait => {
      expect(screen.getByText(trait.name)).toBeInTheDocument();
      expect(screen.getByText(`Score: ${trait.score}`)).toBeInTheDocument();
      expect(screen.getByText(trait.description)).toBeInTheDocument();
    });
  });

  it('shows AI-generated insight section', () => {
    render(<TraitRankings rankings={mockRankings} />);
    expect(screen.getByText('AI-Generated Insight')).toBeInTheDocument();
    expect(screen.getByText(/based on your preferences/i)).toBeInTheDocument();
  });
});