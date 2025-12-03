import templates from './templates.json'
import { vibes } from './vibes'
import { Language } from '../translations'

type BuildArgs = {
  vibe: string | null
  template: string | null
  fields: Record<string, string>
  language?: Language
}

export function buildPrompt({ vibe, template, fields, language = 'fr' }: BuildArgs) {
  const vib = (vibe && (vibes as any)[vibe]) || { tone: 'neutre' }
  const tpl = template ? (templates as any)[template] : null

  const isFr = language === 'fr'

  let prompt = ''

  // Header with tone/style
  const toneInstruction = vib.tone
  const expertText = isFr ? 'un assistant expert en code avec une approche' : 'an expert code assistant with a'
  prompt += `${isFr ? 'Vous êtes' : 'You are'} ${expertText} ${toneInstruction}.\n\n`

  if (!tpl) {
    prompt += isFr ? 'Aucun template sélectionné. Veuillez fournir une demande claire.\n' : 'No template selected. Please provide a clear request.\n'
    return prompt
  }

  // Template-specific instructions
  if (template === 'app-builder') {
    const idea = fields.idea || ''
    const appType = fields.appType || (isFr ? 'une application' : 'an application')
    const stack = fields.stack || (isFr ? 'votre stack préféré' : 'your preferred stack')
    const complexity = fields.complexity || (isFr ? 'complexité moyenne' : 'medium complexity')
    const constraints = fields.constraints || (isFr ? 'les meilleures pratiques standard' : 'standard best practices')

    if (isFr) {
      prompt += `# Créer ${appType}\n\n`
      if (idea) prompt += `**Idée de projet:** ${idea}\n\n`
      prompt += `**Stack Technologique:** ${stack}\n`
      prompt += `**Niveau de Complexité:** ${complexity}\n`
      prompt += `**Contraintes/Exigences:** ${constraints}\n\n`
      prompt += `Génère une ${appType} complète et prête pour la production en utilisant ${stack}. Respecte ${constraints}. L'application doit avoir ${complexity}.` + (idea ? ` Contexte/Idée: ${idea}.` : '')
    } else {
      prompt += `# Build a ${appType}\n\n`
      if (idea) prompt += `**Project Idea:** ${idea}\n\n`
      prompt += `**Technology Stack:** ${stack}\n`
      prompt += `**Complexity Level:** ${complexity}\n`
      prompt += `**Constraints/Requirements:** ${constraints}\n\n`
      prompt += `Generate a complete, production-ready ${appType} using ${stack}. Follow ${constraints}. The application should be ${complexity}.` + (idea ? ` Context/Idea: ${idea}.` : '')
    }
  } 
  else if (template === 'refactor') {
    const language_prog = fields.language || (isFr ? 'n\'importe quel langage' : 'any language')
    const style = fields.style || (isFr ? 'principes de clean code' : 'clean code principles')
    const objectives = fields.objectives || (isFr ? 'améliorer la maintenabilité' : 'improve maintainability')

    if (isFr) {
      prompt += `# Refactoriser du Code\n\n`
      prompt += `**Langage:** ${language_prog}\n`
      prompt += `**Style Guide:** ${style}\n`
      prompt += `**Objectifs:** ${objectives}\n\n`
      prompt += `Refactorise le code suivant en respectant ${style}. Focus sur: ${objectives}.`
    } else {
      prompt += `# Refactor Code\n\n`
      prompt += `**Language:** ${language_prog}\n`
      prompt += `**Style Guide:** ${style}\n`
      prompt += `**Objectives:** ${objectives}\n\n`
      prompt += `Refactor the following code following ${style}. Focus on: ${objectives}.`
    }
  }
  else if (template === 'debug') {
    const errorDesc = fields.errorDescription || (isFr ? 'une erreur s\'est produite' : 'an error occurred')
    const codeSnippet = fields.codeSnippet || (isFr ? 'aucun code fourni' : 'no code provided')

    if (isFr) {
      prompt += `# Aide au Débogage\n\n`
      prompt += `**Description de l'Erreur:** ${errorDesc}\n`
      prompt += `**Snippet de Code:**\n\`\`\`\n${codeSnippet}\n\`\`\`\n\n`
      prompt += `Aide-moi à déboguer ce problème: ${errorDesc}. Analyse le code et fournisse des solutions.`
    } else {
      prompt += `# Debug Help\n\n`
      prompt += `**Error Description:** ${errorDesc}\n`
      prompt += `**Code Snippet:**\n\`\`\`\n${codeSnippet}\n\`\`\`\n\n`
      prompt += `Help me debug this issue: ${errorDesc}. Analyze the code and provide solutions.`
    }
  }

  prompt += `\n\n${isFr ? 'Ton:' : 'Tone:'} ${toneInstruction}`

  return prompt
}
