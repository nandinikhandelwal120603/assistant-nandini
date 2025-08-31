export const VOICE_SUGGESTIONS = [
  "Add a task to call mom",
  "Schedule a meeting at 3pm",
  "I want to journal about my day", 
  "Show me my tasks",
  "How's the weather?",
  "I'm feeling great today",
  "Read my affirmations",
  "Go to calendar"
];

export const getRandomSuggestion = (): string => {
  return VOICE_SUGGESTIONS[Math.floor(Math.random() * VOICE_SUGGESTIONS.length)];
};