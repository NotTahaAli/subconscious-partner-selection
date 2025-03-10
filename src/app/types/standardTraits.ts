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
  { name: "Resilience", description: "bounces back from challenges with strength" },
  { name: "Patience", description: "handles stress and delays without frustration" },
  { name: "Vulnerability", description: "shares fears and insecurities to foster emotional intimacy" },
  { name: "Forgiveness", description: "releases grudges to resolve conflicts constructively" },
  { name: "Generosity", description: "gives time, energy, or resources without expectation" },
  { name: "Loyalty", description: "prioritizes commitment during challenges" },
  { name: "Active Listening", description: "focuses fully on understanding others without judgment" },
  { name: "Diplomacy", description: "navigates disagreements with tact and respect" },
  { name: "Inclusivity", description: "values diversity and creates welcoming spaces" },
  { name: "Assertiveness", description: "communicates needs and boundaries clearly" },
  { name: "Playfulness", description: "embraces spontaneity and shared adventures" },
  { name: "Self-Awareness", description: "reflects on motivations and impact on others" },
  { name: "Growth Mindset", description: "views challenges as opportunities to improve" },
  { name: "Humility", description: "acknowledges mistakes and celebrates others" },
  { name: "Gratitude", description: "expresses appreciation for life’s blessings" },
  { name: "Integrity", description: "acts ethically even when inconvenient" },
  { name: "Financial Responsibility", description: "manages resources with future-oriented planning" },
  { name: "Health Consciousness", description: "prioritizes physical and mental well-being" },
  { name: "Environmental Stewardship", description: "prioritizes sustainable choices to reduce ecological impact" },
  { name: "Decisiveness", description: "makes timely decisions after careful consideration" },
  { name: "Organization", description: "maintains order in spaces and schedules" },
  { name: "Optimism", description: "focuses on solutions during adversity" },
  { name: "Sensuality", description: "values and prioritizes physical connection" },
  { name: "Adventurousness", description: "seeks novel experiences and calculated risks" },
  { name: "Spirituality", description: "finds meaning beyond the material world" },
  { name: "Nurturing", description: "supports others’ growth and well-being instinctively" }
] as const;

export type StandardTraitName = typeof STANDARD_TRAITS[number]['name'];