import { PersonalityTrait } from "../../types/personality";
import { updateTraitScores } from "../eloAlgorithm";

describe('ELO Algorithm', () => {
  const trait1: PersonalityTrait = {
    name: "Empathy",
    score: 2000,
    description: "Understanding others"
  };

  const trait2: PersonalityTrait = {
    name: "Empathy",
    score: 2000,
    description: "Understanding others"
  };

  it('increases winning trait score and decreases losing trait score', () => {
    const [updatedWinners, updatedLosers] = updateTraitScores([trait1], [trait2]);
    
    expect(updatedWinners[0].score).toBeGreaterThan(trait1.score);
    expect(updatedLosers[0].score).toBeLessThan(trait2.score);
  });

  it('changes scores symmetrically', () => {
    const [updatedWinners, updatedLosers] = updateTraitScores([trait1], [trait2]);
    
    const winnerGain = updatedWinners[0].score - trait1.score;
    const loserLoss = trait2.score - updatedLosers[0].score;
    
    expect(winnerGain).toBe(loserLoss);
  });

  it('respects maximum score change limit', () => {
    const highRatedTrait: PersonalityTrait = {
      name: "Empathy",
      score: 2800,
      description: "Understanding others"
    };

    const lowRatedTrait: PersonalityTrait = {
      name: "Empathy",
      score: 1200,
      description: "Understanding others"
    };

    // Low rated trait wins against high rated trait
    const [updatedWinners] = updateTraitScores([lowRatedTrait], [highRatedTrait]);
    const scoreChange = updatedWinners[0].score - lowRatedTrait.score;

    expect(scoreChange).toBeLessThanOrEqual(100);
  });

  it('handles traits with different names', () => {
    const trait3: PersonalityTrait = {
      name: "Ambition",
      score: 2000,
      description: "Drive for success"
    };

    const [updatedWinners] = updateTraitScores(
      [trait1, trait3],
      [trait2]
    );

    // Only matching traits should be updated
    expect(updatedWinners[1]).toEqual(trait3);
    expect(updatedWinners[0].score).not.toBe(trait1.score);
  });
});