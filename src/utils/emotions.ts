
// More sophisticated emotion detection system with additional patterns and context awareness

const emotionKeywords = {
  happy: [
    'happy', 'joy', 'excited', 'great', 'amazing', 'fantastic', 'wonderful', 
    'good', 'positive', 'cheerful', 'delighted', 'pleased', 'thrilled',
    'glad', 'content', 'satisfied', 'upbeat', 'cheery', 'elated',
    'enjoying', 'love', 'grateful', 'thankful', 'blessed', 'fortunate',
    'accomplished', 'proud', 'fulfilled', 'hopeful', 'optimistic', 'eager'
  ],
  sad: [
    'sad', 'unhappy', 'depressed', 'down', 'miserable', 'heartbroken', 
    'gloomy', 'blue', 'melancholy', 'sorrow', 'grief', 'despair',
    'disappointed', 'upset', 'disheartened', 'tearful', 'hopeless',
    'crying', 'alone', 'lonely', 'isolated', 'abandoned', 'rejected',
    'hurt', 'pain', 'suffering', 'empty', 'numb', 'lost', 'regret',
    'missing', 'mourning', 'devastated', 'broken', 'crushed'
  ],
  angry: [
    'angry', 'mad', 'annoyed', 'frustrated', 'irritated', 'furious', 
    'rage', 'outraged', 'hostile', 'enraged', 'infuriated', 'cross',
    'resentful', 'indignant', 'agitated', 'exasperated',
    'hate', 'fed up', 'disgusted', 'irked', 'offended', 'bitter',
    'seething', 'fuming', 'heated', 'displeased', 'pissed', 'livid',
    'irate', 'incensed', 'resentment', 'vexed', 'outrage'
  ],
  anxious: [
    'anxious', 'worried', 'nervous', 'stressed', 'tense', 'uneasy', 
    'fearful', 'afraid', 'scared', 'panicked', 'concerned', 'distressed',
    'apprehensive', 'troubled', 'frightened', 'overwhelmed',
    'restless', 'fretting', 'jittery', 'agitated', 'alarmed', 'terrified',
    'dread', 'panic', 'insecure', 'uncertain', 'paranoid', 'phobia',
    'doubt', 'hesitant', 'uncomfortable', 'jumpy', 'desperate'
  ],
  neutral: [
    'ok', 'okay', 'fine', 'alright', 'neutral', 'average', 'so-so',
    'meh', 'indifferent', 'neither', 'balanced',
    'normal', 'standard', 'regular', 'usual', 'fair', 'moderate',
    'acceptable', 'tolerable', 'reasonable', 'adequate', 'satisfactory'
  ],
  confused: [
    'confused', 'puzzled', 'perplexed', 'bewildered', 'unsure', 'uncertain',
    'lost', 'disoriented', 'unclear', 'ambiguous', 'complicated', 'confusing',
    'misunderstood', 'unclear', 'doubt', 'questioning', 'mixed up',
    'not sure', 'don\'t understand', 'makes no sense', 'hard to follow'
  ],
  tired: [
    'tired', 'exhausted', 'fatigued', 'weary', 'drained', 'sleepy',
    'drowsy', 'lethargic', 'spent', 'worn out', 'burned out', 'beat',
    'dead', 'depleted', 'rundown', 'overworked', 'need rest', 'no energy'
  ]
};

// Emotion context patterns - looking for phrases that indicate emotions
const emotionPhrases = {
  happy: [
    'feeling good', 'having a good day', 'in a good mood', 'things are going well', 
    'had a great', 'feeling better', 'made me smile', 'enjoying', 'looking forward to',
    'proud of', 'succeeded in', 'accomplished', 'achieved', 'celebrated', 'exciting news',
    'wonderful time', 'best day', 'feel blessed', 'grateful for', 'appreciate', 'lucky to have'
  ],
  sad: [
    'feeling down', 'having a bad day', 'in a bad mood', 'things are not going well',
    'lost my', 'miss', 'missing', 'feeling low', 'cant stop crying', "don't feel like",
    'no motivation', 'no energy', 'difficult time', 'rough time', 'tough time',
    'feel like crying', 'worst day', 'everything goes wrong', 'nothing goes right',
    'feel hopeless', 'given up', 'too much to handle', 'heart hurts', 'breaking my heart'
  ],
  angry: [
    'makes me mad', 'pisses me off', 'getting on my nerves', 'fed up with',
    'can\'t stand', 'tired of', 'hate when', 'annoying me', 'bothering me',
    'drives me crazy', 'frustrates me', 'irritates me', 'lost my temper',
    'makes my blood boil', 'crossed the line', 'last straw', 'had enough',
    'sick and tired of', 'furious about', 'absolutely ridiculous'
  ],
  anxious: [
    'worried about', 'nervous about', 'stressed about', 'anxious about',
    'fear that', 'scared that', 'afraid of', 'concerned about', 'overthinking',
    'what if', 'keep thinking', 'can\'t stop thinking', 'obsessing over',
    'on edge', 'freaking out', 'having panic', 'anxiety attacks', 'stress levels',
    'under pressure', 'can\'t relax', 'anxious thoughts', 'racing heart', 'sweating'
  ],
  neutral: [
    'just checking in', 'wanted to talk', 'how are you', 'hello there',
    'just saying hi', 'thought I\'d', 'checking how', 'wanted to see',
    'nothing special', 'business as usual', 'same as always', 'nothing new',
    'no complaints', 'been ok', 'just normal', 'regular day', 'as expected'
  ],
  confused: [
    'not sure what', 'don\'t understand', 'confused about', 'trying to figure out',
    'can\'t make sense', 'wondering if', 'mixed messages', 'unclear about',
    'hard to tell', 'having trouble with', 'lost with', 'need clarification',
    'doesn\'t make sense', 'struggling to understand', 'complicated situation'
  ],
  tired: [
    'feeling exhausted', 'no energy', 'so tired', 'need rest', 'haven\'t slept',
    'can\'t focus', 'worn out', 'need a break', 'working too hard',
    'need to recharge', 'running on empty', 'burned out', 'mental fatigue',
    'can barely keep my eyes open', 'just want to sleep', 'drained from'
  ]
};

// Emotional states often indicated by specific situations
const situationalEmotions = {
  happy: ['got promoted', 'passed exam', 'birthday', 'anniversary', 'graduation', 'wedding', 'new job',
          'got engaged', 'pregnant', 'had a baby', 'won', 'succeeded', 'accomplished', 'vacation'],
  sad: ['lost job', 'failed exam', 'broke up', 'divorce', 'funeral', 'died', 'passed away', 'sick',
         'illness', 'hospital', 'accident', 'debt', 'homeless', 'rejection', 'alone', 'betrayed'],
  angry: ['cheated', 'lied', 'stolen', 'unfair', 'disrespected', 'insulted', 'discriminated',
           'bullied', 'harassed', 'ignored', 'betrayed', 'blamed', 'accused', 'false allegations'],
  anxious: ['interview', 'presentation', 'deadline', 'exam', 'test', 'meeting', 'performance',
             'evaluation', 'assessment', 'public speaking', 'confrontation', 'conflict', 'decision'],
  confused: ['mixed signals', 'contradicting', 'inconsistent', 'changed plans', 'unexpected',
              'surprising behavior', 'unclear instructions', 'ambiguous', 'vague', 'complicated'],
  tired: ['overworked', 'long hours', 'no breaks', 'multiple jobs', 'taking care of', 'late nights',
           'early mornings', 'insomnia', 'sleeping problems', 'jet lag', 'new baby', 'overtime']
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
    confused: 0,
    tired: 0,
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
  
  // Check for situational emotions (strongest indicators)
  Object.entries(situationalEmotions).forEach(([emotion, situations]) => {
    situations.forEach(situation => {
      // Look for these words with word boundaries
      const regex = new RegExp(`\\b${situation}\\b`, 'i');
      if (regex.test(text)) {
        matches[emotion] += 3; // Situational contexts are very strong indicators
      }
    });
  });
  
  // Check for negations (e.g., "not happy")
  const negations = ['not', 'don\'t', 'doesn\'t', 'isn\'t', 'aren\'t', 'wasn\'t', 'weren\'t', 
                     'haven\'t', 'hasn\'t', 'hadn\'t', 'couldn\'t', 'wouldn\'t', 'shouldn\'t', 
                     'can\'t', 'won\'t', 'never', 'no', 'none', 'nothing', 'nor', 'neither'];
  
  for (const negation of negations) {
    for (const [emotion, keywords] of Object.entries(emotionKeywords)) {
      for (const keyword of keywords) {
        // Look for negation followed by emotion word (with up to 3 words between)
        const negationPattern = new RegExp(`${negation}\\s+(?:\\w+\\s+){0,3}${keyword}`, 'i');
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
  const intensifiers = ['very', 'really', 'extremely', 'so', 'incredibly', 'absolutely', 'totally', 
                        'completely', 'utterly', 'terribly', 'quite', 'particularly', 'especially',
                        'unusually', 'remarkably', 'exceptionally', 'tremendously', 'immensely',
                        'exceedingly', 'highly', 'severely', 'deeply', 'profoundly', 'intensely'];
  
  for (const intensifier of intensifiers) {
    for (const [emotion, keywords] of Object.entries(emotionKeywords)) {
      for (const keyword of keywords) {
        // Look for intensifier followed by emotion word (with up to 2 words between)
        const intensifierPattern = new RegExp(`${intensifier}\\s+(?:\\w+\\s+){0,2}${keyword}`, 'i');
        if (intensifierPattern.test(text)) {
          matches[emotion] += 2; // Boost score for intensified emotions
        }
      }
    }
  }
  
  // Check for emotional questions indicating confusion
  const questionWords = ['why', 'how', 'what', 'where', 'when', 'who', 'which'];
  for (const word of questionWords) {
    if (text.includes(word) && text.includes('?')) {
      matches['confused'] += 1;
    }
  }
  
  // Analyze message length for additional context
  if (text.length > 200) { // Long messages often indicate strong emotions
    // Find the highest non-neutral emotion currently
    let strongestEmotion = 'neutral';
    let highestScore = 0;
    
    Object.entries(matches).forEach(([emotion, score]) => {
      if (emotion !== 'neutral' && score > highestScore) {
        strongestEmotion = emotion;
        highestScore = score;
      }
    });
    
    // Boost the strongest emotion if it exists
    if (strongestEmotion !== 'neutral' && highestScore > 0) {
      matches[strongestEmotion] += 1;
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
  
  // If confused or tired have high scores but aren't the highest, check if they're close
  // to the maximum and might be secondary emotions
  if (maxEmotion !== 'confused' && matches['confused'] > 0 && 
      matches['confused'] >= maxCount - 1) {
    // Add confusion as a secondary emotion - not currently handled but could be in future versions
  }
  
  if (maxEmotion !== 'tired' && matches['tired'] > 0 && 
      matches['tired'] >= maxCount - 1) {
    // Add tiredness as a secondary emotion - not currently handled but could be in future versions
  }
  
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
