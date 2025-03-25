
import { getSelfCareSuggestion } from './selfCare';

// Types of conversational contexts
type ConversationalContext = 
  | 'greeting' 
  | 'follow_up' 
  | 'self_reflection' 
  | 'emotion_support' 
  | 'general';

interface ResponseTemplate {
  text: string;
  followUp?: string;
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
    ]
  }
};

// Determines the conversational context based on the message and conversation history
function determineContext(
  message: string, 
  messageCount: number, 
  previousEmotion?: string
): ConversationalContext {
  message = message.toLowerCase();
  
  // First message is likely a greeting
  if (messageCount <= 1) {
    return 'greeting';
  }
  
  // Check for self-reflection cues
  if (message.includes('feel like') || 
      message.includes('notice') || 
      message.includes('realize') || 
      message.includes('thinking about') ||
      message.includes('reflecting') ||
      message.includes('understand why') ||
      message.includes('trying to figure out')) {
    return 'self_reflection';
  }
  
  // Check if this is a follow-up to a previous message
  if (message.length < 20 || 
      message.includes('yes') || 
      message.includes('no') || 
      message.startsWith('i ') ||
      message.startsWith('it\'s') ||
      message.startsWith('that\'s')) {
    return 'follow_up';
  }
  
  // Check for emotional content
  if (previousEmotion && 
      (previousEmotion === 'sad' || 
       previousEmotion === 'anxious' || 
       previousEmotion === 'angry')) {
    return 'emotion_support';
  }
  
  // Default context
  return 'general';
}

// Selects a response template based on emotion and context
function selectResponseTemplate(
  emotion: string, 
  context: ConversationalContext
): ResponseTemplate {
  // Default to neutral if emotion not found
  const emotionTemplates = responseTemplates[emotion] || responseTemplates.neutral;
  
  // Default to general if context not found
  const contextTemplates = emotionTemplates[context] || emotionTemplates.general;
  
  // Randomly select a template from the available ones
  return contextTemplates[Math.floor(Math.random() * contextTemplates.length)];
}

// Checks if the message contains keywords related to self-care
function needsSelfCare(message: string): boolean {
  const selfCareKeywords = [
    'overwhelmed', 'stressed', 'tired', 'exhausted', 'can\'t cope', 
    'struggling', 'difficult', 'help me', 'need help', 'advice',
    'what should i do', 'how can i', 'suggestions', 'recommend',
    'feeling bad', 'feeling awful', 'can\'t handle', 'too much'
  ];
  
  message = message.toLowerCase();
  return selfCareKeywords.some(keyword => message.includes(keyword));
}

// Generate a response based on the user's message and context
export function generateResponse(
  message: string, 
  emotion: string, 
  messageCount: number,
  previousEmotion?: string
): string {
  const context = determineContext(message, messageCount, previousEmotion);
  const template = selectResponseTemplate(emotion, context);
  
  let response = template.text;
  
  // Add follow-up question if available
  if (template.followUp) {
    response += " " + template.followUp;
  }
  
  // Add self-care suggestion if needed
  if (needsSelfCare(message)) {
    const suggestion = getSelfCareSuggestion(emotion);
    response += " " + suggestion;
  }
  
  return response;
}
