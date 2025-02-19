import { render, screen, fireEvent } from '@testing-library/react';
import PersonalityCard from '../PersonalityCard';

const mockTrait = {
  name: "Test Trait",
  score: 2000,
  description: "Test description"
};

const defaultProps = {
  title: "Test Title",
  description: "Test personality description",
  traits: [mockTrait],
  onSelect: jest.fn(),
};

describe('PersonalityCard', () => {
  it('renders all provided content', () => {
    render(<PersonalityCard {...defaultProps} />);
    
    expect(screen.getByText('Test Title')).toBeInTheDocument();
    expect(screen.getByText('Test personality description')).toBeInTheDocument();
    expect(screen.getByText('Test Trait')).toBeInTheDocument();
    expect(screen.getByText('Test description')).toBeInTheDocument();
  });

  it('changes appearance when selected', () => {
    const { rerender } = render(<PersonalityCard {...defaultProps} isSelected={false} />);
    const button = screen.getByRole('button');
    
    expect(button).toHaveTextContent('Select This Personality');
    
    rerender(<PersonalityCard {...defaultProps} isSelected={true} />);
    expect(button).toHaveTextContent('Selected');
  });

  it('calls onSelect when clicked', () => {
    render(<PersonalityCard {...defaultProps} />);
    
    fireEvent.click(screen.getByRole('button'));
    expect(defaultProps.onSelect).toHaveBeenCalled();
  });
});