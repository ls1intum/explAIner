import type { Translations } from './types';

const de: Translations = {
  // Landing page
  'landing.speechBubble.idle': 'Hallo, ich bin Owlbert ... Owlbert Einstein',
  'landing.speechBubble.typing': 'Ich kann dir alles beibringen!',
  'landing.subtitle': 'Lerne in deinem eigenen Tempo',
  'landing.startButton': 'ExplAIner Sitzung starten',
  'landing.error.generateGoals': 'Lernziele konnten nicht generiert werden. Bitte versuche es erneut.',

  // Topic & prior knowledge inputs
  'topicInput.label': 'Was möchtest du lernen?',
  'topicInput.placeholder': 'Gib dein Thema oder deine Frage ein ...',
  'priorKnowledgeInput.label': 'Optional: Sag Owlbert, was du schon weißt',
  'priorKnowledgeInput.placeholder': 'Stichwörter eingeben ...',

  // Learning goal page
  'learningGoal.title': 'Lernziel',
  'learningGoal.subtitle': 'Bestimme das Lernziel für deine ExplAIner Sitzung',
  'learningGoal.choosePredefined': 'Wähle ein Lernziel...',
  'learningGoal.enterOwn': '... oder gib dein eigenes Lernziel ein',
  'learningGoal.startButton': 'Los geht\'s!',
  'learningGoal.creatingSession': 'Sitzung wird erstellt...',

  // Custom learning goal card
  'customGoal.complexityLabel': 'Wähle dein Komplexitätsniveau:',
  'customGoal.objectiveLabel': 'Gib dein Ziel ein:',
  'customGoal.objectivePlaceholder': 'Ziel eingeben...',
  'customGoal.previewLabel': 'Vorschau',
  'customGoal.previewPrefix': 'Nach dieser Sitzung kann ich',
  'customGoal.previewObjectivePlaceholder': 'dein Ziel',

  // Navbar
  'navbar.back': 'Zurück',
  'navbar.sessionStart': 'Sitzungsstart',
  'navbar.endSession': 'Sitzung beenden',
  'navbar.impressum': 'Impressum',

  // End session dialog
  'endSessionDialog.title': 'Sitzung beenden?',
  'endSessionDialog.subtitle': 'Dein Fortschritt wird nicht gespeichert.',
  'endSessionDialog.cancel': 'Abbrechen',
  'endSessionDialog.confirm': 'Sitzung beenden',

  // Easier learning goal dialog
  'easierGoalDialog.title': 'Wähle deinen Weg',
  'easierGoalDialog.subtitle': 'Möchtest du dein Lernziel anpassen, um dich zuerst auf die Grundlagen zu konzentrieren, oder mit dem aktuellen Ziel fortfahren?',
  'easierGoalDialog.continueCurrentGoal': 'Mit aktuellem Ziel fortfahren',
  'easierGoalDialog.adjustGoal': 'Lernziel anpassen',

  // Block navigation
  'blockNav.ariaLabel': '{type} Block {index}',

  // Inform block
  'informBlock.continue': 'Weiter',
  'informBlock.inputPlaceholder': 'Stelle eine Folgefrage...',
  'informBlock.error.sendMessage': 'Nachricht konnte nicht gesendet werden. Bitte versuche es erneut.',

  // Quick action chips
  'quickChip.simplerExplanation': 'Einfachere Erklärung',
  'quickChip.moreDetails': 'Mehr Details',
  'quickChip.examples': 'Andere Beispiele',

  // Practice block
  'practiceBlock.selectAll': 'Wähle alle zutreffenden Antworten',
  'practiceBlock.checkAnswer': 'Antwort prüfen',
  'practiceBlock.checking': 'Wird geprüft...',
  'practiceBlock.continue': 'Weiter',
  'practiceBlock.error.submitAnswer': 'Antwort konnte nicht übermittelt werden. Bitte versuche es erneut.',
  'practiceBlock.feedback.correct': 'Richtig! Gut gemacht.',
  'practiceBlock.feedback.incorrect': 'Nicht ganz richtig. Schau dir die richtige Antwort oben an.',

  // Summary block
  'summaryBlock.heading': 'ZUSAMMENFASSUNG',
  'summaryBlock.startNewSession': 'Neue Sitzung starten',
  'summaryBlock.learningGoalAchieved': 'LERNZIEL ERREICHT',
  'summaryBlock.blocksCompleted': 'Blöcke abgeschlossen',
  'summaryBlock.sessionDuration': 'Sitzungsdauer',
  'summaryBlock.minute': 'Minute',
  'summaryBlock.minutes': 'Minuten',

  // Feedback rating
  'feedbackRating.question': 'War diese Erklärungssitzung hilfreich?',
  'feedbackRating.veryUnhelpful': 'Sehr wenig hilfreich',
  'feedbackRating.somewhatUnhelpful': 'Eher nicht hilfreich',
  'feedbackRating.neutral': 'Neutral',
  'feedbackRating.helpful': 'Hilfreich',
  'feedbackRating.veryHelpful': 'Sehr hilfreich',

  // Loading screen messages
  'loading.messages': [
    'Uuu whooo, Uuu whoooooo... Oh Moment, Owlbert spricht gerade mit Owlberta...',
    'Owlbert tut so, als hätte er dich nicht gehört... ah warte, er kommt...',
    'Owlbert trinkt gerade seinen dritten Kaffee...',
    'Owlbert nimmt seine beste Denkerpose ein...',
    'Owlbert zählt bis drei, bevor er weitermacht... 1... 2...',
    'Owlbert räumt seine Gedanken auf (und seinen Schreibtisch)...',
    'Owlbert fragt sich, ob er den Herd angelassen hat... nein warte, Fokus...',
    'Owlbert streckt seine Flügel nach zu langem Sitzen...',
    'Owlbert erinnert sich, wo er war... ach ja, hier...',
    'Owlbert nickt sich weise zu... sehr professionell...',
    'Owlbert stellt sicher, dass seine Federn ordentlich aussehen...',
    'Owlbert atmet tief durch vor dem nächsten Teil...',
  ],
  'loading.chatMessages': [
    'Puh, ich brauche erstmal noch einen Kaffee...',
    'Ich bin gegen einen Baum geflogen. Gib mir einen Moment...',
    'Uuu whooo, Uuu whoooooo... Oh sorry, ich hab gerade wieder mit Owlberta geredet...',
    'Moment, wo ist meine Brille...',
  ],

  // Error page
  'error.title': 'Etwas ist schiefgelaufen!',
  'error.tryAgain': 'Erneut versuchen',
  'error.goHome': 'Zur Startseite',

  // 404 page
  'notFound.title': '404',
  'notFound.subtitle': 'Seite nicht gefunden',
  'notFound.goHome': 'Zur Startseite',

  // Session errors
  'session.error.continue': 'Fortfahren fehlgeschlagen. Bitte versuche es erneut.',
  'session.error.generateSequence': 'Nächste Sequenz konnte nicht generiert werden. Bitte versuche es erneut.',
  'session.error.generateSummary': 'Zusammenfassung konnte nicht generiert werden. Bitte versuche es erneut.',
  'session.error.generateEasierGoals': 'Einfachere Lernziele konnten nicht generiert werden. Bitte versuche es erneut.',
  'session.error.createSession': 'Sitzung konnte nicht erstellt werden. Bitte lade die Seite neu.',

  // Language toggle
  'lang.toggle': 'DE',
};

export default de;
