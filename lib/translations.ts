export const translations = {
  fr: {
    // Header
    title: 'PromptSmith',
    subtitle: 'Générateur de prompts pour IA de code',
    settings: 'Paramètres',
    version: 'v0.1',

    // Vibe Selector
    vibeLabel: 'Choisir une vibe',

    // Templates
    templatesLabel: 'Templates',
    appBuilder: 'Créer une application',
    refactor: 'Refactor',
    debug: 'Debug',

    // Form Labels & Descriptions
    appType: 'Type d\'application',
    appTypeDesc: 'Web, mobile, desktop, API, etc.',
    stack: 'Stack technologique',
    stackDesc: 'React, Node.js, Python, etc.',
    complexity: 'Complexité',
    complexityDesc: 'Simple, moyen, complexe',
    constraints: 'Contraintes',
    constraintsDesc: 'Limitations, exigences spéciales',

    language: 'Langage de programmation',
    languageDesc: 'Python, JavaScript, Java, etc.',
    style: 'Style de code',
    styleDesc: 'Clean code, performance, lisibilité',
    objectives: 'Objectifs',
    objectivesDesc: 'Qu\'allez-vous refactor?',

    errorDescription: 'Description de l\'erreur',
    errorDescriptionDesc: 'Décrivez le bug ou l\'erreur',
    codeSnippet: 'Snippet de code',
    codeSnippetDesc: 'Collez le code problématique',

    // Buttons
    generateLocal: 'Générer (local)',
    generateIA: 'Générer (IA)',
    copy: 'Copier',
    exportMD: 'Export .md',
    exportJSON: 'Export .json',
    home: '← Accueil',

    // Settings
    settingsTitle: 'Paramètres',
    apiKeyLabel: 'Clé OpenAI API',
    apiKeyDesc: 'Collez votre clé API OpenAI pour utiliser le mode IA côté client. La clé est stockée localement dans votre navigateur.',
    save: 'Enregistrer',
    clear: 'Effacer',
    keySaved: 'Clé enregistrée localement dans votre navigateur.',

    // Prompt Output
    promptLabel: 'Prompt',

    // Guide
    guideTitle: 'Guide d\'utilisation',
    guideStep1: 'Choisir une vibe',
    guideStep1Desc: 'Sélectionnez le ton/style de votre prompt : minimal, cyberpunk, cozy ou hacker.',
    guideStep2: 'Choisir un template',
    guideStep2Desc: 'Cliquez sur un template pré-défini (Créer une application, Refactor, Debug) qui correspond à votre besoin.',
    guideStep3: 'Remplir le formulaire',
    guideStep3Desc: 'Un formulaire dynamique s\'affichera avec des champs spécifiques au template choisi. Remplissez chaque champ avec vos informations.',
    guideStep4: 'Générer le prompt',
    guideStep4Desc: 'Cliquez sur Générer (local) pour générer un prompt structuré, ou Générer (IA) si vous avez une clé OpenAI pour un prompt amélioré par IA.',
    guideStep5: 'Configurer votre clé API',
    guideStep5Desc: 'Allez dans Paramètres (bouton en haut à droite) et collez votre clé OpenAI pour utiliser le mode IA côté client.',
    guideStep6: 'Exporter votre prompt',
    guideStep6Desc: 'Une fois généré, vous pouvez copier le prompt, l\'exporter en .md (Markdown) ou en .json.',
    guideStart: 'Compris, commencer ! 🚀',

    // Language
    languageLabel: 'Langue',
  },
  en: {
    // Header
    title: 'PromptSmith',
    subtitle: 'Code AI Prompt Generator',
    settings: 'Settings',
    version: 'v0.1',

    // Vibe Selector
    vibeLabel: 'Choose a vibe',

    // Templates
    templatesLabel: 'Templates',
    appBuilder: 'Build an App',
    refactor: 'Refactor',
    debug: 'Debug',

    // Form Labels & Descriptions
    appType: 'Application Type',
    appTypeDesc: 'Web, mobile, desktop, API, etc.',
    stack: 'Technology Stack',
    stackDesc: 'React, Node.js, Python, etc.',
    complexity: 'Complexity Level',
    complexityDesc: 'Simple, medium, complex',
    constraints: 'Constraints',
    constraintsDesc: 'Limitations, special requirements',

    language: 'Programming Language',
    languageDesc: 'Python, JavaScript, Java, etc.',
    style: 'Code Style',
    styleDesc: 'Clean code, performance, readability',
    objectives: 'Objectives',
    objectivesDesc: 'What will you refactor?',

    errorDescription: 'Error Description',
    errorDescriptionDesc: 'Describe the bug or error',
    codeSnippet: 'Code Snippet',
    codeSnippetDesc: 'Paste the problematic code',

    // Buttons
    generateLocal: 'Generate (local)',
    generateIA: 'Generate (AI)',
    copy: 'Copy',
    exportMD: 'Export .md',
    exportJSON: 'Export .json',
    home: '← Home',

    // Settings
    settingsTitle: 'Settings',
    apiKeyLabel: 'OpenAI API Key',
    apiKeyDesc: 'Paste your OpenAI API key to use AI mode client-side. The key is stored locally in your browser.',
    save: 'Save',
    clear: 'Clear',
    keySaved: 'Key saved locally in your browser.',

    // Prompt Output
    promptLabel: 'Prompt',

    // Guide
    guideTitle: 'User Guide',
    guideStep1: 'Choose a vibe',
    guideStep1Desc: 'Select the tone/style of your prompt: minimal, cyberpunk, cozy, or hacker.',
    guideStep2: 'Choose a template',
    guideStep2Desc: 'Click on a pre-defined template (Build an App, Refactor, Debug) that matches your need.',
    guideStep3: 'Fill the form',
    guideStep3Desc: 'A dynamic form will appear with fields specific to the chosen template. Fill in each field with your information.',
    guideStep4: 'Generate the prompt',
    guideStep4Desc: 'Click Generate (local) for a structured prompt, or Generate (AI) if you have an OpenAI key for an AI-enhanced prompt.',
    guideStep5: 'Configure your API key',
    guideStep5Desc: 'Go to Settings (button in the top right) and paste your OpenAI key to use AI mode client-side.',
    guideStep6: 'Export your prompt',
    guideStep6Desc: 'Once generated, you can copy the prompt, export it as .md (Markdown) or .json.',
    guideStart: 'Got it, let\'s go! 🚀',

    // Language
    languageLabel: 'Language',
  }
}

export type Language = keyof typeof translations
export type TranslationKey = keyof typeof translations['fr']
export type Translations = typeof translations[Language]
