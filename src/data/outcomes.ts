export interface TeamProfile {
  id: string
  name: string
  description: string
  color: string
  ticketResolutionChange: string
  sprintCompletionChange: string
  attritionRisk: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL'
  ideasPerQuarter: string
  summary: string
}

export const profiles: TeamProfile[] = [
  {
    id: 'psychologically-safe',
    name: 'Psychologically Safe Team',
    description: 'You consistently modeled high-safety behaviors — curiosity over blame, naming over avoiding, inclusion over efficiency.',
    color: '#10B981',
    ticketResolutionChange: '-22%',
    sprintCompletionChange: '+18%',
    attritionRisk: 'LOW',
    ideasPerQuarter: '4.1',
    summary: 'Your team is on a compounding improvement trajectory. People speak up before problems escalate.',
  },
  {
    id: 'capable-but-guarded',
    name: 'Capable But Guarded',
    description: 'You optimized for execution over belonging. The team delivers, but people edit themselves before speaking.',
    color: '#F59E0B',
    ticketResolutionChange: '-8%',
    sprintCompletionChange: '+6%',
    attritionRisk: 'MEDIUM',
    ideasPerQuarter: '1.8',
    summary: 'Common in engineering orgs. Things run smoothly — until they don\'t, and nobody said anything.',
  },
  {
    id: 'burned-out-loyal',
    name: 'Burned Out and Loyal',
    description: 'People stay but don\'t speak up. They care about the mission but have learned to suppress concerns.',
    color: '#EF4444',
    ticketResolutionChange: '+14%',
    sprintCompletionChange: '-9%',
    attritionRisk: 'HIGH',
    ideasPerQuarter: '0.9',
    summary: 'Silent flight risk. Retention looks stable until it isn\'t — then multiple people leave in the same quarter.',
  },
  {
    id: 'high-churn-high-ideas',
    name: 'High Churn, High Ideas',
    description: 'You created safety for ideation but not stability. People contribute freely but don\'t feel secure.',
    color: '#8B5CF6',
    ticketResolutionChange: '-5%',
    sprintCompletionChange: '-4%',
    attritionRisk: 'HIGH',
    ideasPerQuarter: '3.8',
    summary: 'The startup trap. Great energy, inconsistent follow-through, and a revolving door.',
  },
  {
    id: 'managed-decline',
    name: 'Managed Decline',
    description: 'Accumulated avoidance. Individual moments of dismissal or deflection have compounded into a low-trust environment.',
    color: '#6B7280',
    ticketResolutionChange: '+31%',
    sprintCompletionChange: '-24%',
    attritionRisk: 'CRITICAL',
    ideasPerQuarter: '0.3',
    summary: 'Most orgs don\'t notice this until attrition spikes. The behaviors that drive it look like politeness.',
  },
]

export function classifyProfile(
  trust: number,
  velocity: number,
  retention: number,
  innovation: number
): TeamProfile {
  if (trust > 75 && velocity > 65 && retention > 65 && innovation > 65) {
    return profiles[0]
  }
  if (trust >= 55 && velocity >= 65 && innovation < 55) {
    return profiles[1]
  }
  if (retention >= 60 && trust < 50) {
    return profiles[2]
  }
  if (innovation >= 65 && retention < 50) {
    return profiles[3]
  }
  return profiles[4]
}

export const toneLabels: Record<string, string> = {
  dismissive: 'Dismissive',
  deflecting: 'Deflecting',
  engaging: 'Engaging',
  modeling: 'Modeling Safety',
}

export const toneDescriptions: Record<string, string> = {
  dismissive: 'Shuts down the conversation — often unintentionally. The speaker feels judged or ignored.',
  deflecting: 'Avoids the discomfort without addressing it. Feels polite but creates ambiguity and unresolved tension.',
  engaging: 'Names the issue and invites dialogue. Creates the conditions for honest conversation.',
  modeling: 'Demonstrates vulnerability or systemic thinking. Shows others what psychological safety looks like in practice.',
}
