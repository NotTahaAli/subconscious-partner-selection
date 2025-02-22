import { PersonalityTrait } from "../types/personality";

/**
 * Standard ELO K-factor. Higher values mean faster rating changes.
 * Using 32 as it's a common value for newer rating systems.
 */
const K_FACTOR = 32;

/**
 * Maximum change in score per comparison to prevent wild swings
 */
const MAX_SCORE_CHANGE = 100;

/**
 * Calculate the expected score for a trait based on ELO formula
 * @param traitScore Current score of the trait
 * @param opposingScore Score of the opposing trait
 * @returns Expected score (between 0 and 1)
 */
function calculateExpectedScore(traitScore: number, opposingScore: number): number {
  return 1 / (1 + Math.pow(10, (opposingScore - traitScore) / 400));
}

/**
 * Calculate Elo rating changes for a single pair of scores
 */
export function updateEloRatings(winnerScore: number, loserScore: number): { winner: number; loser: number } {
  const expectedWinnerScore = calculateExpectedScore(winnerScore, loserScore);
  let scoreChange = Math.round(K_FACTOR * (1 - expectedWinnerScore));
  scoreChange = Math.min(scoreChange, MAX_SCORE_CHANGE);

  return {
    winner: winnerScore + scoreChange,
    loser: loserScore - scoreChange
  };
}

/**
 * Update trait scores using the ELO rating system
 * @param winningTraits Traits from the winning personality
 * @param losingTraits Traits from the losing personality
 * @returns Updated traits for both personalities
 */
export function updateTraitScores(
  winningTraits: PersonalityTrait[],
  losingTraits: PersonalityTrait[]
): [PersonalityTrait[], PersonalityTrait[]] {
  // Create new arrays to avoid mutating the originals
  const updatedWinningTraits = [...winningTraits];
  const updatedLosingTraits = [...losingTraits];

  // Match traits by name and update their scores
  winningTraits.forEach((winningTrait, index) => {
    const losingTraitIndex = losingTraits.findIndex(t => t.name === winningTrait.name);
    if (losingTraitIndex === -1) return; // Skip if no matching trait found

    const expectedWinScore = calculateExpectedScore(winningTrait.score, losingTraits[losingTraitIndex].score);
    
    // Calculate score changes
    let scoreChange = Math.round(K_FACTOR * (1 - expectedWinScore));
    scoreChange = Math.min(scoreChange, MAX_SCORE_CHANGE);

    // Update scores
    updatedWinningTraits[index] = {
      ...winningTrait,
      score: winningTrait.score + scoreChange
    };

    updatedLosingTraits[losingTraitIndex] = {
      ...losingTraits[losingTraitIndex],
      score: losingTraits[losingTraitIndex].score - scoreChange
    };
  });

  return [updatedWinningTraits, updatedLosingTraits];
}