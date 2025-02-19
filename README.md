# Subconscious Partner Selection

A Next.js application that helps users understand their subconscious partner preferences through AI-generated personality comparisons.

## Features

- 🧠 AI-generated personality descriptions
- 🔄 Side-by-side personality comparisons
- 📊 ELO-based trait ranking system
- 📱 Responsive design for all devices
- 🔑 LLM API integration (configurable)
- 📈 Visual trait preference tracking

## Getting Started

### Prerequisites

- Node.js 18+ and npm

### Installation

1. Clone the repository:
```bash
git clone https://github.com/NotTahaAli/subconscious-partner-selection.git
cd subconscious-partner-selection
```

2. Install dependencies:
```bash
npm install
```

3. Set up your environment variables:
   - Copy `.env.local.example` to `.env.local`
   - Update the values as needed

4. Run the development server:
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

### Testing

The project includes comprehensive testing:

```bash
# Run all tests (unit tests + build verification)
npm test

# Run tests in watch mode during development
npm run test:watch

# Run only build verification
npm run test:build
```

### Production

Build and start the production server:
```bash
npm run build
npm start
```

## Architecture

### Project Structure

```
src/
├── app/                    # Next.js App Router files
│   ├── components/        # Reusable React components
│   ├── utils/            # Utility functions and helpers
│   │   ├── generateDescription.ts  # Personality description generator
│   │   └── eloAlgorithm.ts        # ELO ranking implementation
│   ├── types/            # TypeScript type definitions
│   ├── layout.tsx        # Root layout with header/footer
│   ├── page.tsx          # Home page with trait rankings
│   ├── compare/          # Personality comparison feature
│   └── settings/         # API configuration page
└── __tests__/           # Test suites
```

### Key Components

#### PersonalityCard
Displays an individual personality description with traits and selection controls.

Props:
```typescript
interface PersonalityCardProps {
  title: string;
  description: string;
  traits: PersonalityTrait[];
  onSelect: () => void;
  isSelected?: boolean;
}
```

#### TraitRankings
Visualizes current trait preferences with AI-generated insights.

Props:
```typescript
interface TraitRankingsProps {
  rankings: TraitRankings;
}
```

### Type Definitions

```typescript
interface PersonalityTrait {
  name: string;
  score: number;
  description: string;
}

interface TraitRankings {
  traits: PersonalityTrait[];
  totalComparisons: number;
}
```

## Testing

The project uses Jest and React Testing Library. Tests are co-located with their components:

- `src/app/components/__tests__/`: Component unit tests
- `src/app/__tests__/build.test.ts`: Build and routing tests

## Technical Details

### Styling
- Tailwind CSS for utility-first styling
- Mobile-first responsive design
- Dark/light mode support via CSS variables
- Consistent UI components with hover/active states

### State Management
- React hooks for local state
- Browser's localStorage for persistence
- Potential for server-side storage via API routes

### API Integration
- Configurable LLM API endpoint
- Secure API key storage in browser
- Fallback personality generation when API is unavailable

## Contributing

1. Fork the repository
2. Create your feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- Next.js team for the amazing framework
- Tailwind CSS for the utility-first CSS framework
- Testing Library team for the testing utilities
