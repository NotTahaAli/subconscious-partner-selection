# Subconscious Partner Selection

A thoughtful tool designed to help you understand your deeper preferences in potential life partners. Rather than using rigid questionnaires or superficial criteria, this application uses AI-guided personality comparisons to reveal what truly resonates with you in meaningful relationships.

## About

This project takes a uniquely human approach to understanding relationship preferences. Instead of treating personalities as abstract concepts, it presents potential partners as real people with authentic qualities and characteristics. Through a series of thoughtful comparisons, you'll discover patterns in the types of people you naturally connect with most deeply.

## Features

- **Natural Comparisons**: Meet and compare different personalities in a way that feels like genuine human interaction
- **Personalized Insights**: Gain deep understanding of your relationship preferences through AI-generated insights
- **Meaningful Traits**: Focus on qualities that matter in real relationships, not just personality categories
- **Privacy-First**: Your preferences are stored locally in your browser
- **Adaptive Learning**: Uses the ELO algorithm to continuously refine understanding of your preferences
- **AI Integration**: Supports Google's Gemini API for generating authentic personality descriptions and insights

## Getting Started

1. **Installation**
   ```bash
   git clone https://github.com/NotTahaAli/subconscious-partner-selection.git
   cd subconscious-partner-selection
   npm install
   ```

2. **Environment Setup**
   Copy the example environment file to create your local environment:
   ```bash
   cp .env.local.example .env.local
   ```
   Then edit `.env.local` to add your Gemini API key (obtain one from [Google AI Studio](https://makersuite.google.com/app/apikey))

3. **Running the Application**
   ```bash
   npm run dev
   ```
   Visit `http://localhost:3000` to start your journey

4. **API Configuration**
   - Navigate to the Settings page
   - Enter your Gemini API key (obtain one from [Google AI Studio](https://makersuite.google.com/app/apikey))
   - Select "gemini" as your LLM provider
   - Your settings are stored locally in your browser

## How It Works

1. **Start Your Journey**: Begin by comparing two potential partners, each presented as a real person with unique qualities
2. **Make Connections**: Choose the personality you connect with more naturally
3. **Discover Patterns**: As you make more comparisons, the application reveals deeper insights about your relationship preferences
4. **Gain Understanding**: Review your evolving preferences and AI-generated insights about what you value in potential partners

## Technology

- Next.js 15+ with App Router
- TypeScript for type safety
- Tailwind CSS for styling
- ELO algorithm for preference ranking
- Google Gemini API integration for personality generation and insights
- Jest and React Testing Library for comprehensive testing

## Development

### Testing
Run the test suite with:
```bash
npm test
```

This will:
1. Run ESLint to check code quality
2. Build the project to verify compilation
3. Execute Jest tests with coverage reports

To run tests in watch mode during development:
```bash
npm run test:watch
```

## Deployment
This project is set up for easy deployment on Vercel:
```bash
npm run build
```
You can then deploy to your preferred hosting service. For Vercel, simply connect your GitHub repository and it will automatically build and deploy your application.

## Contributing

We welcome contributions that enhance the human-centric approach of this project. Please feel free to submit issues and pull requests.

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Uses Google Gemini API to generate authentic personality descriptions
- Inspired by the complexity and beauty of human connections
