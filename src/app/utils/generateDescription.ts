import { TraitRankings } from "../types/personality";

function sortTraitsByScore(rankings: TraitRankings) {
  return [...rankings.traits].sort((a, b) => b.score - a.score);
}

export function generatePersonalityDescription(rankings: TraitRankings): string {
  const sortedTraits = sortTraitsByScore(rankings);
  
  if (sortedTraits.length === 0) {
    return "No personality preferences have been recorded yet.";
  }

  if (sortedTraits.length === 1) {
    return `Based on your preferences, you are primarily drawn to individuals who embody ${sortedTraits[0].name.toLowerCase()}. 
    
Specifically, you value ${sortedTraits[0].description.toLowerCase()}.`;
  }

  const topTraits = sortedTraits.slice(0, Math.min(3, sortedTraits.length));
  const lowerTraits = sortedTraits.slice(Math.min(3, sortedTraits.length));

  let description = "";
  
  if (topTraits.length === 2) {
    description = `Based on your preferences, you are drawn to individuals who embody ${topTraits[0].name.toLowerCase()} and ${topTraits[1].name.toLowerCase()}. 

Specifically, you value ${topTraits[0].description.toLowerCase()} as a primary characteristic. This is complemented by ${topTraits[1].description.toLowerCase()}.`;
  } else {
    description = `Based on your preferences, you are drawn to individuals who embody ${topTraits[0].name.toLowerCase()}, ${topTraits[1].name.toLowerCase()}, and ${topTraits[2].name.toLowerCase()}. 

Specifically, you value ${topTraits[0].description.toLowerCase()} as a primary characteristic. This is complemented by a strong appreciation for ${topTraits[1].description.toLowerCase()}.`;
  }

  if (lowerTraits.length > 0) {
    description += `\n\nWhile you also consider ${lowerTraits[0].name.toLowerCase()}${lowerTraits.length > 1 ? ` and ${lowerTraits[1].name.toLowerCase()}` : ''}, ${lowerTraits.length > 1 ? 'these traits appear' : 'this trait appears'} to be secondary in your subconscious preferences.`;
  }

  return description;
}