import { render, screen, fireEvent } from '@testing-library/react';
import PersonalityCard from '../PersonalityCard';

const mockTrait = {
  name: "Empathy",
  score: 2000,
  description: "connects deeply with others"
};

const defaultProps = {
  title: "Alex",
  description: "A caring and thoughtful person",
  traits: [mockTrait],
  onSelect: jest.fn(),
};

describe('PersonalityCard', () => {
  it('renders all provided content', () => {
    render(<PersonalityCard {...defaultProps} />);
    
    expect(screen.getByText('Meet Alex')).toBeInTheDocument();
    expect(screen.getByText('A caring and thoughtful person')).toBeInTheDocument();
    expect(screen.getByText('Empathy:')).toBeInTheDocument();
    expect(screen.getByText('connects deeply with others')).toBeInTheDocument();
  });

  it('changes appearance when selected', () => {
    const { rerender } = render(<PersonalityCard {...defaultProps} isSelected={false} />);
    const button = screen.getByRole('button');
    
    expect(button).toHaveTextContent('Choose This Person');
    
    rerender(<PersonalityCard {...defaultProps} isSelected={true} />);
    expect(button).toHaveTextContent('I Connect With Them');
  });

  it('calls onSelect when clicked', () => {
    render(<PersonalityCard {...defaultProps} />);
    
    fireEvent.click(screen.getByRole('button'));
    expect(defaultProps.onSelect).toHaveBeenCalled();
  });
});