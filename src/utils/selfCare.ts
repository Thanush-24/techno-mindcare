
interface SelfCareSuggestion {
  activity: string;
  description: string;
}

const selfCareActivities: Record<string, SelfCareSuggestion[]> = {
  happy: [
    {
      activity: "Gratitude Journaling",
      description: "Take a moment to write down three things you're grateful for today to amplify your positive feelings."
    },
    {
      activity: "Share Your Joy",
      description: "Consider reaching out to a friend or family member to share your positive experience."
    },
    {
      activity: "Mindful Appreciation",
      description: "Practice mindfulness to fully savor this positive moment and the good feelings you're experiencing."
    }
  ],
  sad: [
    {
      activity: "Gentle Movement",
      description: "Try going for a short walk or doing some gentle stretching to release endorphins."
    },
    {
      activity: "Creative Expression",
      description: "Consider expressing your feelings through art, music, or writing – it doesn't have to be perfect."
    },
    {
      activity: "Comfort Connection",
      description: "Reach out to someone you trust, or even just cuddle with a pet or soft blanket."
    },
    {
      activity: "Self-Compassion Break",
      description: "Place a hand on your heart and remind yourself: 'This is a moment of suffering. Suffering is part of life. May I be kind to myself in this moment.'"
    }
  ],
  angry: [
    {
      activity: "Deep Breathing",
      description: "Try taking 5 slow, deep breaths, focusing on the sensation of your breath moving in and out."
    },
    {
      activity: "Physical Release",
      description: "Channel your energy into a quick physical activity like brisk walking, punching a pillow, or dancing to intense music."
    },
    {
      activity: "Cool Down Technique",
      description: "Hold something cold, like an ice cube or cold water on your wrists, to help physiologically calm your body."
    }
  ],
  anxious: [
    {
      activity: "5-4-3-2-1 Grounding",
      description: "Notice 5 things you can see, 4 things you can touch, 3 things you can hear, 2 things you can smell, and 1 thing you can taste."
    },
    {
      activity: "Progressive Muscle Relaxation",
      description: "Tense and then release each muscle group in your body, starting from your toes and working up to your head."
    },
    {
      activity: "Worry Time",
      description: "Schedule a specific 15-minute 'worry time' later in the day, then gently postpone current worries until then."
    }
  ],
  neutral: [
    {
      activity: "Mindful Check-in",
      description: "Take a moment to scan your body and notice any sensations, emotions, or thoughts without judgment."
    },
    {
      activity: "Nature Connection",
      description: "Spend a few minutes observing something natural – the sky, plants, or even just the breeze on your skin."
    },
    {
      activity: "Small Act of Kindness",
      description: "Do something small and kind for yourself or someone else – it can boost your mood and sense of connection."
    }
  ]
};

export function getSelfCareSuggestion(emotion: string): string {
  const suggestions = selfCareActivities[emotion] || selfCareActivities.neutral;
  const randomSuggestion = suggestions[Math.floor(Math.random() * suggestions.length)];
  
  return `Here's a suggestion that might help: **${randomSuggestion.activity}** - ${randomSuggestion.description}`;
}

export function getAllSelfCareActivities(emotion?: string): SelfCareSuggestion[] {
  if (emotion && selfCareActivities[emotion]) {
    return selfCareActivities[emotion];
  }
  
  // If no emotion specified or not found, return all activities
  return Object.values(selfCareActivities).flat();
}

export function getMoodString(mood: number): string {
  if (mood >= 4) return 'happy';
  if (mood >= 3) return 'neutral';
  if (mood >= 2) return 'anxious';
  return 'sad';
}

export function getMoodColor(mood: number): string {
  if (mood >= 4) return 'bg-techno-mint';
  if (mood >= 3) return 'bg-techno-light-blue';
  if (mood >= 2) return 'bg-techno-lavender';
  return 'bg-techno-blue';
}

export function getMoodEmoji(mood: number): string {
  if (mood >= 4) return '😊';
  if (mood >= 3) return '😐';
  if (mood >= 2) return '😰';
  return '😢';
}
