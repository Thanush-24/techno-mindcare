import { getSelfCareSuggestion } from './selfCare';

// Types of conversational contexts
type ConversationalContext = 
  | 'greeting' 
  | 'follow_up' 
  | 'self_reflection' 
  | 'emotion_support' 
  | 'general'
  | 'problem_solving'
  | 'clarification'
  | 'deeper_exploration';

interface ResponseTemplate {
  text: string;
  followUp?: string;
  priority?: number; // Higher priority templates will be preferred for selection
}

interface ConversationState {
  topicsDiscussed: string[];
  questionCount: number;
  userEmotionalState: string;
  userEmotionIntensity: number;
  selfCareRecommended: boolean;
  conversationDepth: number;
}

// Dictionary of response templates based on emotion and context
const responseTemplates: Record<string, Record<ConversationalContext, ResponseTemplate[]>> = {
  happy: {
    greeting: [
      { text: "Hello! You sound like you're in a good mood today. That's wonderful to hear!", followUp: "What's been going well for you?" },
      { text: "Hi there! I'm picking up some positive energy from you - that's great!", followUp: "What's bringing you joy today?" },
      { text: "Good to see you! Your positivity is contagious. I'd love to hear more about what's making you happy." }
    ],
    follow_up: [
      { text: "That's fantastic! It's important to acknowledge and celebrate these positive moments." },
      { text: "I'm really glad to hear that. Positive experiences, even small ones, are worth cherishing." },
      { text: "That sounds wonderful! Savoring these good moments can help build resilience for tougher times." }
    ],
    self_reflection: [
      { text: "It's great that you're feeling good! Have you noticed what factors or activities tend to boost your mood like this?" },
      { text: "That's really positive! Reflecting on what contributes to our happiness can help us intentionally create more good days." },
      { text: "Wonderful! It can be useful to take mental notes about what makes you feel this way so you can return to these activities when needed." }
    ],
    emotion_support: [
      { text: "Your positive energy is wonderful! Remember this feeling - you've earned this moment of happiness." },
      { text: "I'm so happy to hear you're doing well! You deserve these good feelings." },
      { text: "That's really great to hear! Your happiness matters, and it's wonderful that you're experiencing this right now." }
    ],
    general: [
      { text: "Sounds like things are going well! Is there anything specific you'd like to talk about today?" },
      { text: "That's great to hear! I'm here to chat about whatever's on your mind." },
      { text: "Wonderful! I'm here for you whether things are going well or if you need support." }
    ],
    problem_solving: [
      { text: "It's great that you're approaching this with such positive energy! Let's think about some solutions together.", priority: 2 },
      { text: "Your optimism will be helpful in addressing this. What specific aspects would you like to focus on first?" },
      { text: "I appreciate your positive mindset. Let's channel that energy into finding a good approach for this situation." }
    ],
    clarification: [
      { text: "I'm glad you're asking for clarity. Let me try to explain this differently..." },
      { text: "Happy to clarify! Sometimes looking at things from a different perspective can help. Here's another way to think about it:" },
      { text: "Great question! Let me try to make this clearer:", priority: 2 }
    ],
    deeper_exploration: [
      { text: "I love your enthusiasm for exploring this topic more deeply! Let's dive in.", priority: 2 },
      { text: "That's a thoughtful direction to take our conversation. Your positive engagement makes these explorations even more valuable." },
      { text: "What an interesting point to explore further! Your curiosity combined with your positive outlook creates a great space for deeper discussion." }
    ]
  },
  sad: {
    greeting: [
      { text: "I notice you might be feeling down today. I'm here to listen if you'd like to talk about it.", followUp: "Would you like to share what's troubling you?" },
      { text: "I'm picking up that you might not be feeling your best right now. That's okay - we all have those days.", followUp: "Is there something specific that's weighing on your mind?" },
      { text: "It sounds like you might be going through a difficult time. I'm here for you.", followUp: "Would it help to talk about what's happening?" }
    ],
    follow_up: [
      { text: "Thank you for sharing that with me. It takes courage to be vulnerable about difficult feelings." },
      { text: "I appreciate you opening up. It's completely valid to feel this way given what you're experiencing." },
      { text: "I'm listening and I hear you. These feelings are a natural response to challenging situations." }
    ],
    self_reflection: [
      { text: "When we're feeling low, sometimes it helps to identify if there are any patterns to these feelings. Have you noticed any triggers?" },
      { text: "These feelings are valid, and also temporary. What has helped you navigate similar feelings in the past?" },
      { text: "It's okay to not be okay sometimes. Is there something small you could do today that might bring you a moment of comfort?" }
    ],
    emotion_support: [
      { text: "I'm sorry you're feeling this way. Remember that you won't always feel like this - emotions come and go like weather patterns." },
      { text: "It's really hard to sit with these feelings, and I'm here with you. Be gentle with yourself right now." },
      { text: "Your feelings are valid, and so important to acknowledge. At the same time, remember that you are not defined by this moment or these emotions." }
    ],
    general: [
      { text: "I'm here to support you through this difficult time. Would you like to talk more about it or would you prefer a distraction?" },
      { text: "However you're feeling is okay. What would be most helpful for you right now - to process these feelings or focus on something else?" },
      { text: "Thank you for trusting me with these feelings. Would you like me to suggest some coping strategies, or would you prefer to just talk?" }
    ],
    problem_solving: [
      { text: "Even when feeling down, tackling problems one small step at a time can help. Would it be okay if we break this down into manageable pieces?", priority: 2 },
      { text: "I understand this is difficult, especially when you're not feeling your best. Let's go slowly and think about what might help in this situation." },
      { text: "Sometimes finding solutions when we're feeling low can be overwhelming. We can take this at whatever pace feels comfortable for you." }
    ],
    clarification: [
      { text: "I want to make sure I'm explaining things in a helpful way, especially since you might be feeling down. Does this make sense...", priority: 2 },
      { text: "Let me try to clarify this. When we're not feeling our best, clear information can sometimes provide a bit of stability:" },
      { text: "Thank you for asking for clarification. I'll try to be as clear as possible:" }
    ],
    deeper_exploration: [
      { text: "Thank you for being willing to explore this topic more deeply, even when you're feeling down. That takes courage.", priority: 2 },
      { text: "I appreciate you wanting to delve deeper into this, especially given how you're feeling. Your willingness to engage is really valuable." },
      { text: "Even in difficult emotional times, your thoughtfulness comes through. Let's explore this further at whatever pace feels right for you." }
    ]
  },
  angry: {
    greeting: [
      { text: "I'm sensing some frustration in your message. It's completely valid to feel angry sometimes.", followUp: "Would you like to talk about what's bothering you?" },
      { text: "It sounds like something might have upset you. Those feelings are important to acknowledge.", followUp: "Do you want to share what happened?" },
      { text: "I can understand feeling frustrated or angry - these are natural responses to challenging situations.", followUp: "Is there something specific that triggered these feelings?" }
    ],
    follow_up: [
      { text: "That would be frustrating for anyone. Thank you for explaining the situation." },
      { text: "I can see why you'd feel that way. It's completely understandable given what happened." },
      { text: "Your reaction makes perfect sense given the circumstances. Anyone would feel similarly." }
    ],
    self_reflection: [
      { text: "Sometimes when we're angry, there are other emotions underneath like hurt or fear. Does that resonate with what you're experiencing?" },
      { text: "When we can name exactly what's bothering us, it often helps us process the emotion. What aspect of this situation is most upsetting?" },
      { text: "Anger often arises when our boundaries or values are crossed. Does that feel true in this case?" }
    ],
    emotion_support: [
      { text: "It's okay to feel angry - it's your mind's way of alerting you that something isn't right. The key is finding healthy ways to express it." },
      { text: "Your feelings are valid. Taking a few deep breaths might help give you space to decide how you want to respond to this situation." },
      { text: "Anger is a powerful emotion that deserves to be acknowledged. Would it help to try a quick grounding exercise to center yourself?" }
    ],
    general: [
      { text: "Would it be helpful to brainstorm some constructive ways to address this situation, or do you just need space to express how you feel?" },
      { text: "Sometimes writing out our thoughts can help process angry feelings. We could also talk through some calming techniques if you'd like." },
      { text: "What do you think would be most helpful right now - talking more about the situation, focusing on coping strategies, or something else entirely?" }
    ],
    problem_solving: [
      { text: "I understand you're frustrated. Sometimes channeling that energy into actionable steps can help. Would you like to explore some potential approaches?", priority: 2 },
      { text: "Your frustration is completely valid. When you're ready, we could look at some ways to address this situation that might help resolve some of these feelings." },
      { text: "I hear your anger about this situation. Would it be helpful to look at some options for how to move forward?" }
    ],
    clarification: [
      { text: "I want to make sure I'm being clear, as miscommunication can sometimes add to frustration. Let me explain this differently:", priority: 2 },
      { text: "Let me clarify this point, as I want to make sure we're on the same page:" },
      { text: "Thank you for asking for clarification. Let me try to explain this more clearly:" }
    ],
    deeper_exploration: [
      { text: "I appreciate your willingness to explore this topic more deeply, even when it's stirring up strong feelings. That shows real commitment.", priority: 2 },
      { text: "Thank you for wanting to delve further into this, despite your frustration. Your engagement helps us get to the heart of the matter." },
      { text: "Even though this topic brings up some anger, your desire to understand it more deeply shows tremendous self-awareness." }
    ]
  },
  anxious: {
    greeting: [
      { text: "I notice you might be feeling a bit anxious or worried. That's completely understandable.", followUp: "Would you like to talk about what's on your mind?" },
      { text: "It sounds like you might be experiencing some anxiety. Remember that you're not alone in this.", followUp: "Can you share what's causing you worry right now?" },
      { text: "I'm picking up that you might be feeling stressed or overwhelmed. I'm here to listen.", followUp: "Would it help to talk through what's making you feel this way?" }
    ],
    follow_up: [
      { text: "That's a lot to carry. Anxiety is often our mind's way of trying to protect us, even if it doesn't feel helpful." },
      { text: "I can understand why that would trigger anxiety. Uncertainty can be really challenging to navigate." },
      { text: "Thank you for sharing that. Anxiety can be such an overwhelming feeling, especially when it's tied to important matters in our lives." }
    ],
    self_reflection: [
      { text: "When you notice these anxious feelings, where do you feel them in your body? Sometimes becoming aware of physical sensations can help us manage anxiety." },
      { text: "Our minds can sometimes fixate on worst-case scenarios when we're anxious. Have you noticed if your thoughts tend to catastrophize?" },
      { text: "Sometimes anxiety stems from feeling like we don't have control. Are there any small aspects of this situation where you do have some agency?" }
    ],
    emotion_support: [
      { text: "Anxiety can feel overwhelming, but remember that you've moved through difficult feelings before, and you will again." },
      { text: "In moments of anxiety, it can help to bring yourself back to the present. What's one thing you can see, hear, and feel right now?" },
      { text: "Your feelings are valid, and at the same time, anxiety often magnifies our fears. Is it possible that your worry brain might be overestimating the threat?" }
    ],
    general: [
      { text: "Would you like to try a quick breathing exercise together, or would you prefer to continue talking about what's causing your anxiety?" },
      { text: "Sometimes breaking down big worries into smaller, manageable pieces can help. Would you like to try that approach?" },
      { text: "What has helped you manage anxious feelings in the past? We all develop different coping strategies over time." }
    ],
    problem_solving: [
      { text: "When anxiety is in the picture, problem-solving can feel overwhelming. We can take small steps. What feels like the most manageable piece to start with?", priority: 2 },
      { text: "Let's approach this gently, keeping your anxiety in mind. Sometimes breaking things down into very small steps can make difficult situations more manageable." },
      { text: "I understand you might be feeling anxious about this situation. We can explore solutions at a pace that feels comfortable for you." }
    ],
    clarification: [
      { text: "When we're anxious, clear information can sometimes help. Let me try to explain this more precisely:", priority: 2 },
      { text: "I want to make sure I'm being clear, as uncertainty can sometimes increase anxiety. Here's another way to look at it:" },
      { text: "Thank you for asking for clarification. Let me try to make this as clear as possible:" }
    ],
    deeper_exploration: [
      { text: "I appreciate your willingness to explore this topic more deeply, even while managing anxiety. That takes courage.", priority: 2 },
      { text: "Thank you for wanting to delve further into this conversation, despite any worry you might be feeling. Your engagement is really valuable." },
      { text: "Even when feeling anxious, your curiosity and desire to understand more deeply shows tremendous strength." }
    ]
  },
  confused: {
    greeting: [
      { text: "Hello! I notice you might be feeling a bit uncertain or confused. That's perfectly okay.", followUp: "Would you like me to help clarify something?" },
      { text: "Hi there! It sounds like you might be trying to make sense of something. I'm here to help if I can.", followUp: "What's on your mind?" },
      { text: "Welcome! I'm picking up that you might be feeling a little confused. Sometimes talking things through can help bring clarity.", followUp: "What's puzzling you?" }
    ],
    follow_up: [
      { text: "Thank you for sharing that. It's completely normal to feel confused sometimes - our minds process so much information." },
      { text: "I appreciate you explaining. Confusion is often a sign that we're encountering something new or complex." },
      { text: "That makes sense why you'd feel uncertain. Confusion is actually an important part of learning and growth." }
    ],
    self_reflection: [
      { text: "When we're confused, it can help to step back and identify exactly what part is unclear. Is there a specific aspect that feels most puzzling?" },
      { text: "Confusion often points us toward important insights. What thoughts or feelings come up alongside the confusion?" },
      { text: "Sometimes writing out what we know for sure versus what feels unclear can help organize our thoughts. Would that approach be helpful?" }
    ],
    emotion_support: [
      { text: "Feeling confused can be uncomfortable, but it's actually a sign that your brain is working hard to understand something new. Be patient with yourself." },
      { text: "It's okay to sit with confusion for a while. Sometimes clarity comes after we've given our minds time to process." },
      { text: "Confusion can feel frustrating, but it's actually the beginning of new understanding. Your brain is actively working on making new connections." }
    ],
    general: [
      { text: "Would it help to break this down into smaller pieces? Sometimes confusion comes from trying to process too many elements at once." },
      { text: "Sometimes approaching a confusing topic from a different angle can help. Would you like to try looking at this another way?" },
      { text: "What might help bring some clarity to this situation? Would more information be useful, or perhaps simplifying what we already know?" }
    ],
    problem_solving: [
      { text: "When things feel confusing, starting with what we know for sure can help. What aspects of this situation are clear to you?", priority: 2 },
      { text: "Let's tackle this confusion by breaking things down. Would it help to list out the specific points that feel unclear?" },
      { text: "Sometimes drawing connections or creating a visual map can help with confusion. Would that approach be helpful for this situation?" }
    ],
    clarification: [
      { text: "I understand this feels confusing. Let me try to explain this differently:", priority: 2 },
      { text: "Confusion is completely natural when dealing with complex topics. Here's another way to look at it:" },
      { text: "Let me try to clarify this in a more straightforward way:" }
    ],
    deeper_exploration: [
      { text: "Your confusion might actually be pointing to something important. Would you like to explore what's beneath that feeling?", priority: 2 },
      { text: "Sometimes confusion arises when our existing understanding is being challenged in productive ways. Would you like to explore this tension more deeply?" },
      { text: "Confusion can be a doorway to deeper insights. Let's explore what might be at the root of this uncertainty." }
    ]
  },
  tired: {
    greeting: [
      { text: "Hello there. I'm sensing you might be feeling a bit tired or low on energy. That's completely understandable.", followUp: "How can I support you today?" },
      { text: "Hi. It sounds like you might be experiencing some fatigue. Sometimes just having someone to talk to can help.", followUp: "What's on your mind right now?" },
      { text: "Welcome. I'm picking up that you might be feeling drained. I'm here for whatever kind of conversation would be most helpful.", followUp: "How are you managing?" }
    ],
    follow_up: [
      { text: "Thank you for sharing that, especially when your energy might be limited. Taking time to check in with yourself is important." },
      { text: "I appreciate you explaining, particularly when you're feeling tired. Sometimes putting experiences into words can help us process them." },
      { text: "That makes sense. Fatigue can color our whole experience, and it's important to acknowledge how it's affecting you." }
    ],
    self_reflection: [
      { text: "When we're tired, it can be helpful to consider what our body and mind might be trying to tell us. Have you noticed any patterns with your energy levels?" },
      { text: "Sometimes fatigue is physical, sometimes emotional, and often both. Does one of those feel more relevant to what you're experiencing?" },
      { text: "Even in tiredness, you're taking time for self-reflection, which is valuable. What do you think your body or mind needs most right now?" }
    ],
    emotion_support: [
      { text: "It's really hard to function when you're feeling depleted. Be gentle with yourself - you're doing the best you can with the energy you have." },
      { text: "Tiredness can make everything feel more difficult, including managing emotions. It's okay to scale back expectations of yourself during these times." },
      { text: "Your feelings are valid, and even more so when you're tired and your resources are low. Rest is not a luxury - it's essential maintenance." }
    ],
    general: [
      { text: "When energy is low, how would you prefer to use our conversation? We could keep it light, focus on practical support, or something else entirely." },
      { text: "Would it be helpful to talk about strategies for managing when you're tired, or would you prefer to focus on something else right now?" },
      { text: "Sometimes when we're tired, just having someone to listen can help. I'm here for whatever kind of conversation would feel supportive." }
    ],
    problem_solving: [
      { text: "When we're tired, even small problems can feel bigger. Let's approach this gently. What's the most pressing aspect we could address?", priority: 2 },
      { text: "Problem-solving takes energy, so let's keep things simple. What's one small step that might help with this situation?" },
      { text: "Given your energy levels, let's focus on what's most essential. What would make the biggest positive difference with the least effort?" }
    ],
    clarification: [
      { text: "I'll try to keep this clear and simple, as I understand processing information can be harder when you're tired:", priority: 2 },
      { text: "Let me break this down as straightforwardly as possible:" },
      { text: "Here's the simplest way I can explain this:" }
    ],
    deeper_exploration: [
      { text: "I appreciate your willingness to explore this topic more deeply, even when your energy is low. We can take it slowly.", priority: 2 },
      { text: "Thank you for engaging with this topic, especially when you're feeling tired. Would you like to continue, or would a break be helpful?" },
      { text: "Even when tired, your thoughtfulness comes through. Let's explore this at a pace that respects your current energy levels." }
    ]
  },
  neutral: {
    greeting: [
      { text: "Hello! How are you feeling today?", followUp: "Is there anything specific on your mind?" },
      { text: "Hi there! It's good to see you. How have things been going?", followUp: "What would you like to talk about today?" },
      { text: "Welcome! How are you doing right now?", followUp: "I'm here to chat about whatever you'd like." }
    ],
    follow_up: [
      { text: "Thank you for sharing that with me. What else has been on your mind lately?" },
      { text: "I appreciate you telling me. Is there anything else you'd like to talk about?" },
      { text: "That's interesting to hear. Would you like to explore that topic more?" }
    ],
    self_reflection: [
      { text: "Taking time to check in with yourself is a valuable practice. Have you noticed any patterns in your thoughts or feelings lately?" },
      { text: "Self-reflection can be really insightful. What have you been learning about yourself recently?" },
      { text: "It's good to take a moment to check in. What's been bringing you moments of peace lately, even small ones?" }
    ],
    emotion_support: [
      { text: "However you're feeling is completely valid. We all go through different emotional states throughout our days and weeks." },
      { text: "It's important to acknowledge all of our emotions, even when they're not particularly intense or dramatic." },
      { text: "Your emotional well-being matters, whether you're experiencing strong feelings or more neutral states." }
    ],
    general: [
      { text: "I'm here to support you in whatever way would be most helpful today. What's on your mind?" },
      { text: "What would you like to focus on in our conversation today?" },
      { text: "I'm here to listen, offer support, or just chat - whatever would be most helpful for you right now." }
    ],
    problem_solving: [
      { text: "Let's think about this systematically. What would be a good first step to address this situation?", priority: 2 },
      { text: "We can approach this from different angles. Would you prefer to start with the most urgent aspect or the easiest to address?" },
      { text: "Let's explore some potential solutions. What approaches have you considered so far?" }
    ],
    clarification: [
      { text: "Let me clarify that point:", priority: 2 },
      { text: "To put it another way:" },
      { text: "Here's a different way to look at it:" }
    ],
    deeper_exploration: [
      { text: "That's an interesting aspect to explore further. Let's dig deeper into this.", priority: 2 },
      { text: "I appreciate you wanting to explore this topic more thoroughly. Let's examine some of the nuances." },
      { text: "That's a thoughtful direction for our conversation. Let's explore those deeper aspects." }
    ]
  }
};

// Advanced context determination based on message content, history, and patterns
function determineContext(
  message: string, 
  messageCount: number, 
  conversationState: Partial<ConversationState>,
  previousEmotion?: string
): ConversationalContext {
  message = message.toLowerCase();
  
  // First message is likely a greeting
  if (messageCount <= 1) {
    return 'greeting';
  }
  
  // Check for explicit questions or confusion indicators
  if (message.includes('?') || 
      message.includes('explain') || 
      message.includes('what is') || 
      message.includes('how do') ||
      message.includes('don\'t understand') ||
      message.includes('confused') ||
      message.includes('clarify')) {
    
    // Check if this is a follow-up clarification
    if (message.length < 30 || 
        message.startsWith('but ') ||
        message.startsWith('so ') ||
        message.startsWith('and ') ||
        message.includes('still confused') ||
        message.includes('still don\'t understand')) {
      return 'clarification';
    }
  }
  
  // Check for problem-solving cues
  if (message.includes('how can i') || 
      message.includes('what should i') || 
      message.includes('need help with') || 
      message.includes('trying to') ||
      message.includes('struggling with') ||
      message.includes('help me') ||
      message.includes('solution') ||
      message.includes('solve') ||
      message.includes('strategy') ||
      message.includes('approach')) {
    return 'problem_solving';
  }
  
  // Check for deeper exploration cues
  if (message.includes('tell me more') || 
      message.includes('more about') || 
      message.includes('deeper') || 
      message.includes('furthermore') ||
      message.includes('additionally') ||
      message.includes('elaborate') ||
      message.includes('explain further') ||
      message.length > 80) {
    return 'deeper_exploration';
  }
  
  // Check for self-reflection cues
  if (message.includes('feel like') || 
      message.includes('notice') || 
      message.includes('realize') || 
      message.includes('thinking about') ||
      message.includes('reflecting') ||
      message.includes('understand why') ||
      message.includes('trying to figure out') ||
      message.includes('insight') ||
      message.includes('awareness') ||
      message.includes('recognized') ||
      message.includes('discovery')) {
    return 'self_reflection';
  }
  
  // Check if this is a follow-up to a previous message
  if (message.length < 20 || 
      message.includes('yes') || 
      message.includes('no') || 
      message.startsWith('i ') ||
      message.startsWith('it\'s') ||
      message.startsWith('that\'s') ||
      message.startsWith('ok') ||
      message.startsWith('yeah')) {
    return 'follow_up';
  }
  
  // Check for emotional content
  if (previousEmotion && 
      (previousEmotion === 'sad' || 
       previousEmotion === 'anxious' || 
       previousEmotion === 'angry' ||
       previousEmotion === 'confused' ||
       previousEmotion === 'tired')) {
    return 'emotion_support';
  }
  
  // Default context
  return 'general';
}

// More sophisticated response template selection with priority weighting
function selectResponseTemplate(
  emotion: string, 
  context: ConversationalContext,
  conversationState: Partial<ConversationState>
): ResponseTemplate {
  // Default to neutral if emotion not found
  const emotionTemplates = responseTemplates[emotion] || responseTemplates.neutral;
  
  // Default to general if context not found
  const contextTemplates = emotionTemplates[context] || emotionTemplates.general;
  
  // Filter for high priority templates if available
  const highPriorityTemplates = contextTemplates.filter(template => template.priority && template.priority > 1);
  
  if (highPriorityTemplates.length > 0) {
    // Use high priority templates when available (20% of the time)
    if (Math.random() < 0.8) {
      return highPriorityTemplates[Math.floor(Math.random() * highPriorityTemplates.length)];
    }
  }
  
  // Randomly select a template from all available ones
  return contextTemplates[Math.floor(Math.random() * contextTemplates.length)];
}

// Enhanced detection for self-care needs
function needsSelfCare(message: string, emotion: string, conversationState: Partial<ConversationState>): boolean {
  // If we've already recommended self-care recently, avoid repeating too soon
  if (conversationState.selfCareRecommended) {
    return false;
  }
  
  const selfCareKeywords = [
    'overwhelmed', 'stressed', 'tired', 'exhausted', 'can\'t cope', 
    'struggling', 'difficult', 'help me', 'need help', 'advice',
    'what should i do', 'how can i', 'suggestions', 'recommend',
    'feeling bad', 'feeling awful', 'can\'t handle', 'too much',
    'burned out', 'depleted', 'drained', 'worn out', 'no energy',
    'depressed', 'hopeless', 'lost', 'stuck', 'trapped', 'anxious',
    'panic', 'worried', 'scared', 'afraid', 'fearful', 'nervous'
  ];
  
  message = message.toLowerCase();
  
  // Check for explicit keywords
  const hasKeywords = selfCareKeywords.some(keyword => message.includes(keyword));
  
  // Also recommend self-care if emotion is consistently negative
  const isNegativeEmotion = ['sad', 'angry', 'anxious', 'tired'].includes(emotion);
  
  // Be more likely to suggest self-care for longer, emotionally-charged messages
  const isLongEmotionalMessage = message.length > 100 && isNegativeEmotion;
  
  return hasKeywords || isLongEmotionalMessage;
}

// Global conversation state (in a real implementation, this would be per-user)
let globalConversationState: Partial<ConversationState> = {
  topicsDiscussed: [],
  questionCount: 0,
  userEmotionalState: 'neutral',
  userEmotionIntensity: 0,
  selfCareRecommended: false,
  conversationDepth: 0
};

// Generate a response based on the user's message and context
export function generateResponse(
  message: string, 
  emotion: string, 
  messageCount: number,
  previousEmotion?: string
): string {
  // Update conversation state
  if (message.includes('?')) {
    globalConversationState.questionCount = (globalConversationState.questionCount || 0) + 1;
  }
  
  // Track emotional state
  globalConversationState.userEmotionalState = emotion;
  
  // Simplistic tracking of conversation depth
  globalConversationState.conversationDepth = messageCount;
  
  const context = determineContext(message, messageCount, globalConversationState, previousEmotion);
  const template = selectResponseTemplate(emotion, context, globalConversationState);
  
  let response = template.text;
  
  // Add follow-up question if available
  if (template.followUp) {
    response += " " + template.followUp;
  }
  
  // Add self-care suggestion if needed
  if (needsSelfCare(message, emotion, globalConversationState)) {
    const suggestion = getSelfCareSuggestion(emotion);
    response += " " + suggestion;
    globalConversationState.selfCareRecommended = true;
  } else {
    // Reset self-care flag occasionally to allow future suggestions
    if (messageCount % 5 === 0) {
      globalConversationState.selfCareRecommended = false;
    }
  }
  
  return response;
}
