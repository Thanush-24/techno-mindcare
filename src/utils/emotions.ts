
// In a real app, this would use an NLP model or API
// For demo purposes, we're using a simple keyword-based approach

const emotionKeywords = {
  happy: [
    'happy', 'joy', 'excited', 'great', 'amazing', 'fantastic', 'wonderful', 
    'good', 'positive', 'cheerful', 'delighted', 'pleased', 'thrilled',
    'glad', 'content', 'satisfied', 'upbeat', 'cheery', 'elated'
  ],
  sad: [
    'sad', 'unhappy', 'depressed', 'down', 'miserable', 'heartbroken', 
    'gloomy', 'blue', 'melancholy', 'sorrow', 'grief', 'despair',
    'disappointed', 'upset', 'disheartened', 'tearful', 'hopeless'
  ],
  angry: [
    'angry', 'mad', 'annoyed', 'frustrated', 'irritated', 'furious', 
    'rage', 'outraged', 'hostile', 'enraged', 'infuriated', 'cross',
    'resentful', 'indignant', 'agitated', 'exasperated'
  ],
  anxious: [
    'anxious', 'worried', 'nervous', 'stressed', 'tense', 'uneasy', 
    'fearful', 'afraid', 'scared', 'panicked', 'concerned', 'distressed',
    'apprehensive', 'troubled', 'frightened', 'overwhelmed'
  ],
  neutral: [
    'ok', 'okay', 'fine', 'alright', 'neutral', 'average', 'so-so',
    'meh', 'indifferent', 'neither', 'balanced'
  ]
};

export function detectEmotion(text: string): string {
  text = text.toLowerCase();
  
  // Count matches for each emotion
  const matches: Record<string, number> = {
    happy: 0,
    sad: 0,
    angry: 0,
    anxious: 0,
    neutral: 0
  };
  
  Object.entries(emotionKeywords).forEach(([emotion, keywords]) => {
    keywords.forEach(keyword => {
      if (text.includes(keyword)) {
        matches[emotion]++;
      }
    });
  });
  
  // Check for negations (e.g., "not happy")
  const negations = ['not', 'don\'t', 'doesn\'t', 'isn\'t', 'aren\'t', 'wasn\'t', 'weren\'t', 'haven\'t', 'hasn\'t', 'hadn\'t', 'couldn\'t', 'wouldn\'t', 'shouldn\'t', 'can\'t', 'won\'t'];
  
  for (const negation of negations) {
    for (const [emotion, keywords] of Object.entries(emotionKeywords)) {
      for (const keyword of keywords) {
        if (text.includes(`${negation} ${keyword}`)) {
          matches[emotion]--;
        }
      }
    }
  }
  
  // Find the emotion with the most matches
  let maxEmotion = 'neutral';
  let maxCount = 0;
  
  Object.entries(matches).forEach(([emotion, count]) => {
    if (count > maxCount) {
      maxEmotion = emotion;
      maxCount = count;
    }
  });
  
  return maxCount > 0 ? maxEmotion : 'neutral';
}

export function getEmotionColor(emotion: string): string {
  switch(emotion) {
    case 'happy':
      return 'bg-techno-mint text-techno-dark';
    case 'sad':
      return 'bg-techno-blue text-white';
    case 'angry':
      return 'bg-techno-blush text-techno-dark';
    case 'anxious':
      return 'bg-techno-lavender text-techno-dark';
    case 'neutral':
    default:
      return 'bg-techno-light-blue text-techno-dark';
  }
}

export function getEmotionEmoji(emotion: string): string {
  switch(emotion) {
    case 'happy':
      return '😊';
    case 'sad':
      return '😢';
    case 'angry':
      return '😠';
    case 'anxious':
      return '😰';
    case 'neutral':
    default:
      return '😐';
  }
}
