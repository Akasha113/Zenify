const CRISIS_KEYWORDS = {
  critical: [
    'suicide', 'kill myself', 'ending my life', 'end it all',
    'slash my wrists', 'cut myself', 'hang myself', 'overdose',
    'jump off', 'no point living', 'better off dead', 'i want to die'
  ],
  high: [
    'suicidal', 'self harm', 'self-harm', 'hurt myself',
    'depressed', 'hopeless', 'can\'t handle', 'want to die',
    'should kill myself', 'thinking about suicide', 'consider suicide'
  ],
  medium: [
    'sad', 'anxious', 'stressed', 'struggling',
    'overwhelmed', 'helpless', 'lonely', 'desperate'
  ]
};

const analyzeSuicideRisk = (content) => {
  const lowerContent = content.toLowerCase();
  
  // Check for critical keywords
  for (const keyword of CRISIS_KEYWORDS.critical) {
    if (lowerContent.includes(keyword)) {
      return {
        riskLevel: 'critical',
        keywords: [keyword],
        recommendedAction: 'IMMEDIATE_ESCALATION_REQUIRED'
      };
    }
  }

  // Check for high-risk keywords
  for (const keyword of CRISIS_KEYWORDS.high) {
    if (lowerContent.includes(keyword)) {
      return {
        riskLevel: 'high',
        keywords: [keyword],
        recommendedAction: 'ESCALATE_TO_PROFESSIONAL'
      };
    }
  }

  // Check for medium-risk keywords
  for (const keyword of CRISIS_KEYWORDS.medium) {
    if (lowerContent.includes(keyword)) {
      return {
        riskLevel: 'medium',
        keywords: [keyword],
        recommendedAction: 'MONITOR_AND_REVIEW'
      };
    }
  }

  return {
    riskLevel: 'low',
    keywords: [],
    recommendedAction: 'NO_ACTION'
  };
};

module.exports = {
  analyzeSuicideRisk,
  CRISIS_KEYWORDS
};
