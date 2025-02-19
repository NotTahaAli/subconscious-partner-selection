export interface PersonalityTrait {
  name: string;
  score: number;
  description: string;
}

export interface TraitRankings {
  traits: PersonalityTrait[];
  totalComparisons: number;
}