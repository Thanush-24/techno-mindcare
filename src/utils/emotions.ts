// More sophisticated emotion detection system with additional patterns and context awareness

const emotionKeywords = {
  happy: [
    'happy', 'joy', 'excited', 'great', 'amazing', 'fantastic', 'wonderful', 
    'good', 'positive', 'cheerful', 'delighted', 'pleased', 'thrilled',
    'glad', 'content', 'satisfied', 'upbeat', 'cheery', 'elated',
    'enjoying', 'love', 'grateful', 'thankful', 'blessed', 'fortunate'
  ],
  sad: [
    'sad', 'unhappy', 'depressed', 'down', 'miserable', 'heartbroken', 
    'gloomy', 'blue', 'melancholy', 'sorrow', 'grief', 'despair',
    'disappointed', 'upset', 'disheartened', 'tearful', 'hopeless',
    'crying', 'alone', 'lonely', 'isolated', 'abandoned', 'rejected',
    'hurt', 'pain', 'suffering', 'empty', 'numb', 'lost'
  ],
  angry: [
    'angry', 'mad', 'annoyed', 'frustrated', 'irritated', 'furious', 
    'rage', 'outraged', 'hostile', 'enraged', 'infuriated', 'cross',
    'resentful', 'indignant', 'agitated', 'exasperated',
    'hate', 'fed up', 'disgusted', 'irked', 'offended', 'bitter',
    'seething', 'fuming', 'heated', 'displeased', 'pissed'
  ],
  anxious: [
    'anxious', 'worried', 'nervous', 'stressed', 'tense', 'uneasy', 
    'fearful', 'afraid', 'scared', 'panicked', 'concerned', 'distressed',
    'apprehensive', 'troubled', 'frightened', 'overwhelmed',
    'restless', 'fretting', 'jittery', 'agitated', 'alarmed', 'terrified',
    'dread', 'panic', 'insecure', 'uncertain', 'paranoid', 'phobia'
  ],
  neutral: [
    'ok', 'okay', 'fine', 'alright', 'neutral', 'average', 'so-so',
    'meh', 'indifferent', 'neither', 'balanced',
    'normal', 'standard', 'regular', 'usual', 'fair', 'moderate'
  ]
};

// Emotion context patterns - looking for phrases that indicate emotions
const emotionPhrases = {
  happy: [
    'feeling good', 'having a good day', 'in a good mood', 'things are going well', 
    'had a great', 'feeling better', 'made me smile', 'enjoying', 'looking forward to'
  ],
  sad: [
    'feeling down', 'having a bad day', 'in a bad mood', 'things are not going well',
    'lost my', 'miss', 'missing', 'feeling low', 'cant stop crying', "don't feel like",
    'no motivation', 'no energy', 'difficult time', 'rough time', 'tough time'
  ],
  angry: [
    'makes me mad', 'pisses me off', 'getting on my nerves', 'fed up with',
    'can\'t stand', 'tired of', 'hate when', 'annoying me', 'bothering me'
  ],
  anxious: [
    'worried about', 'nervous about', 'stressed about', 'anxious about',
    'fear that', 'scared that', 'afraid of', 'concerned about', 'overthinking',
    'what if', 'keep thinking', 'can\'t stop thinking', 'obsessing over'
  ],
  neutral: [
    'just checking in', 'wanted to talk', 'how are you', 'hello there',
    'just saying hi', 'thought I\'d', 'checking how', 'wanted to see'
  ]
};

export function detectEmotion(text: string): string {
  if (!text) return 'neutral';
  
  text = text.toLowerCase();
  
  // Count matches for each emotion
  const matches: Record<string, number> = {
    happy: 0,
    sad: 0,
    angry: 0,
    anxious: 0,
    neutral: 0
  };
  
  // Check for individual keywords
  Object.entries(emotionKeywords).forEach(([emotion, keywords]) => {
    keywords.forEach(keyword => {
      // Full word matching with word boundaries
      const regex = new RegExp(`\\b${keyword}\\b`, 'i');
      if (regex.test(text)) {
        matches[emotion] += 1;
      }
    });
  });
  
  // Check for emotional phrases (stronger indicator)
  Object.entries(emotionPhrases).forEach(([emotion, phrases]) => {
    phrases.forEach(phrase => {
      if (text.includes(phrase)) {
        matches[emotion] += 2; // Phrases are stronger indicators than single words
      }
    });
  });
  
  // Check for negations (e.g., "not happy")
  const negations = ['not', 'don\'t', 'doesn\'t', 'isn\'t', 'aren\'t', 'wasn\'t', 'weren\'t', 
                     'haven\'t', 'hasn\'t', 'hadn\'t', 'couldn\'t', 'wouldn\'t', 'shouldn\'t', 
                     'can\'t', 'won\'t', 'never'];
  
  for (const negation of negations) {
    for (const [emotion, keywords] of Object.entries(emotionKeywords)) {
      for (const keyword of keywords) {
        // Look for negation followed by emotion word
        const negationPattern = new RegExp(`${negation}\\s+\\w*\\s*${keyword}`, 'i');
        if (negationPattern.test(text)) {
          matches[emotion] -= 2; // Stronger negative impact
          
          // If negating happiness, increase sad slightly
          if (emotion === 'happy') {
            matches['sad'] += 1;
          }
          // If negating sadness, increase happy slightly
          else if (emotion === 'sad') {
            matches['happy'] += 1;
          }
        }
      }
    }
  }
  
  // Check for intensity modifiers
  const intensifiers = ['very', 'really', 'extremely', 'so', 'incredibly', 'absolutely', 'totally', 'completely'];
  
  for (const intensifier of intensifiers) {
    for (const [emotion, keywords] of Object.entries(emotionKeywords)) {
      for (const keyword of keywords) {
        const intensifierPattern = new RegExp(`${intensifier}\\s+${keyword}`, 'i');
        if (intensifierPattern.test(text)) {
          matches[emotion] += 1; // Boost score for intensified emotions
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
  
  // Default to neutral if no strong indicators or when scores are tied
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
