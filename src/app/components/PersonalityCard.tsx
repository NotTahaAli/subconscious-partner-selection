import { PersonalityTrait } from '../types/personality';

interface PersonalityCardProps {
  title: string;
  description: string;
  traits: PersonalityTrait[];
  onSelect: () => void;
  isSelected?: boolean;
}

export default function PersonalityCard({ 
  title, 
  description, 
  traits, 
  onSelect,
  isSelected = false
}: PersonalityCardProps) {
  return (
    <div className={`
      bg-background border rounded-lg p-6 transition-all
      ${isSelected 
        ? 'border-foreground shadow-lg scale-[1.02]' 
        : 'border-foreground/10 hover:border-foreground/30'
      }
    `}>
      <h2 className="text-xl font-semibold mb-4">Meet {title}</h2>
      
      <div className="prose prose-gray mb-6">
        <p className="text-gray-400">{description}</p>
      </div>

      <div className="space-y-3 mb-6">
        <h3 className="text-sm font-semibold text-gray-300 uppercase tracking-wider">What Makes Them Special</h3>
        {traits.map((trait) => (
          <div key={trait.name} className="flex items-center gap-2">
            <div className="w-1 h-1 rounded-full bg-foreground/60"></div>
            <span className="font-medium">{trait.name}:</span>
            <span className="text-sm text-gray-300">{trait.description}</span>
          </div>
        ))}
      </div>

      <button 
        onClick={onSelect}
        className={`
          w-full px-4 py-2 rounded transition-colors
          ${isSelected
            ? 'bg-green-600 text-white hover:bg-green-700'
            : 'bg-foreground text-background hover:opacity-90'
          }
        `}
      >
        {isSelected ? 'I Connect With Them' : 'Choose This Person'}
      </button>
    </div>
  );
}