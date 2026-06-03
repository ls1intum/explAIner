import type { Translations } from './types';

const en: Translations = {
  // Landing page
  'landing.speechBubble.idle': "Hi, I'm Owlbert ... Owlbert Einstein",
  'landing.speechBubble.typing': 'I can teach you anything!',
  'landing.subtitle': 'Learn at Your Own Pace',
  'landing.startButton': 'Start ExplAIner Session',
  'landing.error.generateGoals': 'Failed to generate learning goals. Please try again.',

  // Topic & prior knowledge inputs
  'topicInput.label': 'What do you want to learn?',
  'topicInput.placeholder': 'Enter your topic or question ...',
  'priorKnowledgeInput.label': 'Optional: Tell Owlbert what you already know',
  'priorKnowledgeInput.placeholder': 'Enter keywords ...',

  // Learning goal page
  'learningGoal.title': 'Learning Goal',
  'learningGoal.subtitle': 'Specify the learning goal for your ExplAIner session',
  'learningGoal.choosePredefined': 'Choose a learning goal...',
  'learningGoal.enterOwn': '... or enter your own learning goal',
  'learningGoal.startButton': "Let's Start!",
  'learningGoal.creatingSession': 'Creating session...',

  // Custom learning goal card
  'customGoal.complexityLabel': 'Choose your complexity level:',
  'customGoal.objectiveLabel': 'Enter your objective:',
  'customGoal.objectivePlaceholder': 'Enter objective...',
  'customGoal.previewLabel': 'Preview',
  'customGoal.previewPrefix': 'After this session, I can',
  'customGoal.previewObjectivePlaceholder': 'your objective',

  // Navbar
  'navbar.back': 'Back',
  'navbar.sessionStart': 'Session Start',
  'navbar.endSession': 'End Session',
  'navbar.impressum': 'Impressum',

  // End session dialog
  'endSessionDialog.title': 'End session?',
  'endSessionDialog.subtitle': "Your progress won't be saved.",
  'endSessionDialog.cancel': 'Cancel',
  'endSessionDialog.confirm': 'End Session',

  // Easier learning goal dialog
  'easierGoalDialog.title': 'Choose Your Path',
  'easierGoalDialog.subtitle': 'Would you like to adjust your learning goal to focus on the fundamentals first, or continue with the current goal?',
  'easierGoalDialog.continueCurrentGoal': 'Continue with Current Goal',
  'easierGoalDialog.adjustGoal': 'Adjust Learning Goal',

  // Block navigation
  'blockNav.ariaLabel': '{type} block {index}',

  // Inform block
  'informBlock.continue': 'Continue',
  'informBlock.inputPlaceholder': 'Ask a follow-up question...',
  'informBlock.error.sendMessage': 'Could not send message. Please try again.',

  // Quick action chips
  'quickChip.simplerExplanation': 'Try a simpler explanation',
  'quickChip.moreDetails': 'Give more details',
  'quickChip.examples': 'Use (different) examples',

  // Practice block
  'practiceBlock.selectAll': 'Select all that apply',
  'practiceBlock.checkAnswer': 'Check Answer',
  'practiceBlock.checking': 'Checking...',
  'practiceBlock.continue': 'Continue',
  'practiceBlock.error.submitAnswer': 'Could not submit answer. Please try again.',
  'practiceBlock.feedback.correct': 'Correct! Well done.',
  'practiceBlock.feedback.incorrect': 'Not quite right. Check the correct answer above.',

  // Summary block
  'summaryBlock.heading': 'SUMMARY',
  'summaryBlock.startNewSession': 'Start New Session',
  'summaryBlock.learningGoalAchieved': 'LEARNING GOAL ACHIEVED',
  'summaryBlock.blocksCompleted': 'Blocks Completed',
  'summaryBlock.sessionDuration': 'Session Duration',
  'summaryBlock.minute': 'minute',
  'summaryBlock.minutes': 'minutes',

  // Feedback rating
  'feedbackRating.question': 'Was this explanation session helpful?',
  'feedbackRating.veryUnhelpful': 'Very unhelpful',
  'feedbackRating.somewhatUnhelpful': 'Somewhat unhelpful',
  'feedbackRating.neutral': 'Neutral',
  'feedbackRating.helpful': 'Helpful',
  'feedbackRating.veryHelpful': 'Very helpful',

  // Loading screen messages
  'loading.messages': [
    "Uuu whooo, Uuu whoooooo... Oh wait, Owlbert is talking to Owlberta...",
    "Owlbert is pretending he didn't hear you... ah wait, he's coming...",
    "Owlbert is having his third coffee of the day...",
    "Owlbert is doing his best thinking pose...",
    "Owlbert is counting to three before continuing... 1... 2...",
    "Owlbert is reorganizing his thoughts (and his desk)...",
    "Owlbert is wondering if he left the stove on... no wait, focus...",
    "Owlbert is stretching his wings after sitting too long...",
    "Owlbert is reminding himself where he was... ah yes, here...",
    "Owlbert is nodding wisely to himself... very professional...",
    "Owlbert is making sure his feathers look presentable...",
    "Owlbert is taking a deep breath before the next part...",
  ],
  'loading.chatMessages': [
    "Puh, I need another coffee first...",
    "I flew into a tree. Give me a moment...",
    "Uuu whooo, Uuu whoooooo... Oh sorry, I was talking to Owlberta again...",
    "Wait, where are my glasses...",
  ],

  // Error page
  'error.title': 'Something went wrong!',
  'error.tryAgain': 'Try again',
  'error.goHome': 'Go home',

  // 404 page
  'notFound.title': '404',
  'notFound.subtitle': 'Page not found',
  'notFound.goHome': 'Go back home',

  // Session errors
  'session.error.continue': 'Failed to continue. Please try again.',
  'session.error.generateSequence': 'Failed to generate next sequence. Please try again.',
  'session.error.generateSummary': 'Failed to generate summary. Please try again.',
  'session.error.generateEasierGoals': 'Failed to generate easier learning goals. Please try again.',
  'session.error.createSession': 'Failed to create session. Please reload.',

  // Language toggle
  'lang.toggle': 'EN',
};

export default en;
