import { TraitRankings } from "../types/personality";

function sortTraitsByScore(rankings: TraitRankings) {
  return [...rankings.traits].sort((a, b) => b.score - a.score);
}

export function generatePersonalityDescription(rankings: TraitRankings): string {
  const sortedTraits = sortTraitsByScore(rankings);
  
  if (sortedTraits.length === 0) {
    return "You haven't shared any partner preferences yet.";
  }

  if (sortedTraits.length === 1) {
    return `You're most drawn to people who ${sortedTraits[0].description.toLowerCase()}. This suggests you value authentic connections where your partner ${sortedTraits[0].name.toLowerCase() === sortedTraits[0].name ? 'shows ' + sortedTraits[0].name.toLowerCase() : 'is ' + sortedTraits[0].name.toLowerCase()}.`;
  }

  const topTraits = sortedTraits.slice(0, Math.min(3, sortedTraits.length));
  const lowerTraits = sortedTraits.slice(Math.min(3, sortedTraits.length));

  let description = "";
  
  if (topTraits.length === 2) {
    description = `You're naturally drawn to people who combine ${topTraits[0].description.toLowerCase()} with ${topTraits[1].description.toLowerCase()}. 

Your ideal partner would be someone who ${topTraits[0].description.toLowerCase()}, while also having the capacity to ${topTraits[1].description.toLowerCase()}.`;
  } else {
    description = `You tend to form the strongest connections with people who embody a blend of qualities: ${topTraits[0].description.toLowerCase()}, ${topTraits[1].description.toLowerCase()}, and ${topTraits[2].description.toLowerCase()}. 

In a partner, you particularly value someone who ${topTraits[0].description.toLowerCase()}. This core quality is beautifully complemented when they also ${topTraits[1].description.toLowerCase()}.`;
  }

  if (lowerTraits.length > 0) {
    description += `\n\nWhile you appreciate when someone ${lowerTraits[0].description.toLowerCase()}${lowerTraits.length > 1 ? ` and ${lowerTraits[1].description.toLowerCase()}` : ''}, ${lowerTraits.length > 1 ? 'these qualities appear' : 'this quality appears'} to be less crucial in your deepest connections.`;
  }

  return description;
}