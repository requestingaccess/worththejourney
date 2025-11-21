export const getInsight = async (): Promise<string> => {
  const insights = [
    "True confidence is not the absence of doubt, but the courage to proceed despite it.",
    "Your worth is not defined by what you produce.",
    "You are exactly where you need to be.",
    "Doubt is a sign of growth, not incompetence.",
    "Silence is where the truth resides.",
    "No one has it all figured out.",
    "You belong here.",
    "It is safe to be a work in progress.",
    "Breathe. You are enough.",
    "The feeling of being a fraud is the growing pain of competence."
  ];

  // Small delay to simulate thoughtfulness
  await new Promise(resolve => setTimeout(resolve, 800));

  return insights[Math.floor(Math.random() * insights.length)];
};