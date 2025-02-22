// A curated list of personality traits with descriptions
export const STANDARD_TRAITS = [
  { name: "Empathy", description: "connects deeply with others' emotions" },
  { name: "Ambition", description: "pursues goals with passion and purpose" },
  { name: "Humor", description: "brings joy and lightness to shared moments" },
  { name: "Intelligence", description: "engages in meaningful intellectual exchanges" },
  { name: "Reliability", description: "shows up consistently in relationships" },
  { name: "Creativity", description: "brings imagination and innovation to daily life" },
  { name: "Adaptability", description: "embraces change with grace and flexibility" },
  { name: "Leadership", description: "naturally guides and inspires others" },
  { name: "Curiosity", description: "shows genuine interest in learning and exploring" },
  { name: "Balance", description: "maintains harmony between different life aspects" },
  { name: "Authenticity", description: "stays true to their values and beliefs" },
  { name: "Kindness", description: "shows compassion and consideration for others" },
  { name: "Confidence", description: "carries themselves with self-assurance" },
  { name: "Mindfulness", description: "stays present and aware in interactions" },
  { name: "Resilience", description: "bounces back from challenges with strength" }
] as const;

export type StandardTraitName = typeof STANDARD_TRAITS[number]['name'];