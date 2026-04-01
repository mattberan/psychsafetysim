export type ScenarioCategory =
  | 'responding-to-failure'
  | 'speaking-up-to-leaders'
  | 'welcoming-dissent'
  | 'peer-feedback'
  | 'inclusion-signals'
  | 'postmortem-culture'

export type ChoiceTone = 'dismissive' | 'deflecting' | 'engaging' | 'modeling'

export interface MetricDelta {
  trust: number
  velocity: number
  retention: number
  innovation: number
}

export interface Choice {
  id: string
  text: string
  tone: ChoiceTone
  delta: MetricDelta
  consequence: string
  isHighSafety: boolean
}

export interface Scenario {
  id: string
  category: ScenarioCategory
  title: string
  context: string
  trigger: string
  character: string
  characterRole: string
  choices: Choice[]
  insight: string
  researchNote?: string
}

export const scenarios: Scenario[] = [
  {
    id: 'p1-blame-spiral',
    category: 'responding-to-failure',
    title: 'The P1 Blame Spiral',
    character: 'Maya',
    characterRole: 'Senior Engineer',
    context:
      'Your service was down for 47 minutes. The director has a "lessons learned" call scheduled for this afternoon. In standup, your senior engineer speaks up.',
    trigger:
      '"I pushed the config change that caused the outage. I feel terrible. I should have caught it."',
    choices: [
      {
        id: 'a',
        text: "These things happen. Let's move on and make sure the postmortem covers the process gaps.",
        tone: 'deflecting',
        delta: { trust: -3, velocity: 1, retention: -4, innovation: -2 },
        consequence:
          "Maya goes quiet for the rest of standup. Two junior engineers exchange a glance. The word 'process' hangs in the air but nobody unpacks it.",
        isHighSafety: false,
      },
      {
        id: 'b',
        text: "Honestly Maya, that's on you. We have a review checklist for a reason.",
        tone: 'dismissive',
        delta: { trust: -12, velocity: -5, retention: -10, innovation: -8 },
        consequence:
          "The room goes silent. Maya nods and looks at her laptop. In the next sprint, nobody volunteers to own risky deployments.",
        isHighSafety: false,
      },
      {
        id: 'c',
        text: "Thank you for owning that, Maya. What did the system make easy to miss? Let's figure that out together before the director call.",
        tone: 'engaging',
        delta: { trust: 10, velocity: 4, retention: 7, innovation: 6 },
        consequence:
          'Maya visibly relaxes. Two others start sharing what they\'d also missed in the config setup. You go into the director call with a systemic analysis, not a name.',
        isHighSafety: true,
      },
      {
        id: 'd',
        text: "I should have caught it too — I approved that change log without reading it carefully. What did the system set us both up to miss?",
        tone: 'modeling',
        delta: { trust: 14, velocity: 3, retention: 9, innovation: 10 },
        consequence:
          "The team is visibly surprised. Then something opens up. Three issues with your deploy pipeline surface in the next 10 minutes that nobody had mentioned before.",
        isHighSafety: true,
      },
    ],
    insight:
      'Blame locates the problem in a person. Curiosity locates it in the system.',
    researchNote:
      "Teams with high psychological safety after failures report 2-3x more process improvements within 30 days. (Edmondson, The Fearless Organization)",
  },
  {
    id: 'director-bad-news',
    category: 'speaking-up-to-leaders',
    title: "The Director Who Doesn't Want Bad News",
    character: 'VP Chen',
    characterRole: 'VP of Engineering',
    context:
      "Quarterly review. CSAT is down 12% — you know why. The VP is about to take this slide upward and just asked you a direct question.",
    trigger:
      '"Overall I think we\'re tracking well. Alex, anything to flag before I present this upward?"',
    choices: [
      {
        id: 'a',
        text: "Everything looks good. We'll watch the CSAT trend.",
        tone: 'deflecting',
        delta: { trust: -6, velocity: -2, retention: -3, innovation: -5 },
        consequence:
          "CSAT continues to decline. In six weeks, the VP is surprised in a board review. You get asked why you didn't raise this.",
        isHighSafety: false,
      },
      {
        id: 'b',
        text: "There are some headwinds worth naming before this goes upward. CSAT is down 12% and I think I know the structural reasons. Can I have 5 minutes?",
        tone: 'engaging',
        delta: { trust: 8, velocity: 5, retention: 4, innovation: 3 },
        consequence:
          "The VP pauses. Then: \"Okay. Five minutes.\" It's not comfortable, but the conversation happens. The integration bug gets prioritized in the next sprint.",
        isHighSafety: true,
      },
      {
        id: 'c',
        text: "I have concerns about the data I'd rather surface now than have come up later. Are you open to a hard conversation?",
        tone: 'modeling',
        delta: { trust: 11, velocity: 4, retention: 6, innovation: 8 },
        consequence:
          'The VP is briefly thrown. Then they lean in. "Yes. Give it to me straight." You build credibility with every honest moment like this one.',
        isHighSafety: true,
      },
      {
        id: 'd',
        text: "Happy to discuss it offline if this isn't the right time.",
        tone: 'deflecting',
        delta: { trust: -4, velocity: -1, retention: -2, innovation: -4 },
        consequence:
          'The VP says "sure, let\'s do that" and then the next three weeks fill up. The conversation never happens.',
        isHighSafety: false,
      },
    ],
    insight:
      'Leaders who signal safety for bad news receive it 40% more often — and have dramatically better forecast accuracy.',
    researchNote:
      "Research on upward communication shows that your language is the signal. If you don't model safety for hard truths, your team won't either.",
  },
  {
    id: 'louder-voice',
    category: 'welcoming-dissent',
    title: 'The Louder Voice',
    character: 'Priya',
    characterRole: 'Service Desk Analyst',
    context:
      "Sprint retro. Priya has raised a concern about the new workflow twice. Both times, Jordan — louder and more senior — redirected the conversation. Now Jordan is calling it.",
    trigger: '"I think we\'re aligned. Let\'s move forward with the new workflow."',
    choices: [
      {
        id: 'a',
        text: "Agreed, let's move forward.",
        tone: 'dismissive',
        delta: { trust: -9, velocity: -2, retention: -7, innovation: -9 },
        consequence:
          "Priya stops raising concerns in retros. Over the next quarter, three workflow problems that she would have caught get shipped.",
        isHighSafety: false,
      },
      {
        id: 'b',
        text: "Before we close, I want to make sure we've heard everyone. Priya, you mentioned the service desk steps — do you feel that's been resolved?",
        tone: 'engaging',
        delta: { trust: 12, velocity: 2, retention: 8, innovation: 7 },
        consequence:
          "Priya walks through a specific scenario that nobody had considered. Jordan actually comes around. The workflow ships with a modification.",
        isHighSafety: true,
      },
      {
        id: 'c',
        text: "I want to pause here. Priya's raised this twice and I don't think we've actually engaged with it. Priya — can you walk us through the specific scenario you're worried about?",
        tone: 'modeling',
        delta: { trust: 15, velocity: 1, retention: 11, innovation: 12 },
        consequence:
          "The team realizes the workflow has a gap. More importantly, Priya brings three more ideas to the next retro that she'd been sitting on for months.",
        isHighSafety: true,
      },
      {
        id: 'd',
        text: "Let's do a quick show of hands — does everyone feel good about this?",
        tone: 'deflecting',
        delta: { trust: -3, velocity: 1, retention: -2, innovation: -4 },
        consequence:
          "Hands go up because Jordan went first. Priya doesn't raise her hand but nobody notices. The workflow ships with the gap intact.",
        isHighSafety: false,
      },
    ],
    insight:
      'Dissent dies fastest in rooms where the loudest voice sets the close.',
    researchNote:
      "Facilitators who explicitly invite quieter voices increase the volume of ideas surfaced by 35%. (Pentland, MIT Human Dynamics Lab)",
  },
  {
    id: 'peer-feedback-avoidance',
    category: 'peer-feedback',
    title: 'The Peer Feedback Avoidance',
    character: 'Sam',
    characterRole: 'Product Manager',
    context:
      "You're co-leading a service initiative with Sam. Sam keeps missing documentation standards — it's creating real rework. Sam just opened a door.",
    trigger: '"Hey, how do you think the initiative is going? Be honest."',
    choices: [
      {
        id: 'a',
        text: "It's going great! The team is really engaged.",
        tone: 'deflecting',
        delta: { trust: -5, velocity: -4, retention: -2, innovation: -3 },
        consequence:
          "Sam keeps missing docs. In week six, a junior team member has to spend eight hours reconstructing a process because the documentation wasn't there.",
        isHighSafety: false,
      },
      {
        id: 'b',
        text: "Good overall. I think there are some process things we could tighten up.",
        tone: 'deflecting',
        delta: { trust: -3, velocity: -3, retention: -1, innovation: -2 },
        consequence:
          'Sam hears "good overall" and stops listening. Nothing changes.',
        isHighSafety: false,
      },
      {
        id: 'c',
        text: "Honestly, I've been meaning to bring something up. The documentation has been inconsistent and it's creating real rework for the team. I wanted to tell you directly rather than have it surface another way.",
        tone: 'engaging',
        delta: { trust: 9, velocity: 8, retention: 5, innovation: 4 },
        consequence:
          "Sam is quiet for a moment. Then: \"I didn't realize it was that bad. Can you show me what you're seeing?\" The documentation improves within two sprints.",
        isHighSafety: true,
      },
      {
        id: 'd',
        text: "There's something I want to share because I think it'll make the initiative better and I respect you enough to say it directly. Can I?",
        tone: 'modeling',
        delta: { trust: 13, velocity: 7, retention: 8, innovation: 6 },
        consequence:
          "Sam nods. The conversation happens with care on both sides. Sam later tells you it was the most useful feedback they'd received in two years.",
        isHighSafety: true,
      },
    ],
    insight:
      '"Ruinous empathy" — being kind at the expense of honest — is more corrosive to team performance than direct critical feedback delivered with care.',
    researchNote:
      "Kim Scott's Radical Candor framework shows that avoiding difficult feedback is the most common failure mode for managers who describe themselves as \"supportive.\"",
  },
  {
    id: 'weird-idea',
    category: 'welcoming-dissent',
    title: 'The New Idea That Sounds Weird',
    character: 'Dani',
    characterRole: 'Junior Analyst',
    context:
      "Fourth sprint of rising escalations. Morale is low. Dani — your most junior analyst — just proposed an idea and Jordan shot it down before you could hear it.",
    trigger:
      '"That sounds really complicated for what we need right now. I don\'t think that\'s realistic."',
    choices: [
      {
        id: 'a',
        text: "Yeah, it might be a bit much for this sprint. Let's focus on the process side.",
        tone: 'dismissive',
        delta: { trust: -8, velocity: 1, retention: -6, innovation: -10 },
        consequence:
          "Dani stops proposing ideas. Jordan's status in the room calcifies. The escalation problem stays unsolved for two more quarters with incremental patches.",
        isHighSafety: false,
      },
      {
        id: 'b',
        text: "I want to hear more about what Dani is thinking before we scope it. Dani — what problem specifically does the sentiment analysis solve?",
        tone: 'engaging',
        delta: { trust: 10, velocity: 2, retention: 7, innovation: 12 },
        consequence:
          "Dani explains that 40% of escalations happen because urgency is miscoded at intake. The sentiment analysis idea leads to a simpler intake form change that ships in a week.",
        isHighSafety: true,
      },
      {
        id: 'c',
        text: "Jordan, I hear the complexity concern — let's keep that on the table. And Dani, let's give the idea room to breathe. What's the smallest version of this we could try?",
        tone: 'modeling',
        delta: { trust: 12, velocity: 4, retention: 8, innovation: 11 },
        consequence:
          "The team lands on a two-hour experiment. It works. Dani becomes a trusted idea contributor. Jordan respects that their concern was heard, not dismissed.",
        isHighSafety: true,
      },
      {
        id: 'd',
        text: "Let's parking-lot it and come back after we solve the immediate sprint goals.",
        tone: 'deflecting',
        delta: { trust: -4, velocity: 2, retention: -3, innovation: -7 },
        consequence:
          "The parking lot never gets reviewed. Dani remembers. The escalation rate stays elevated.",
        isHighSafety: false,
      },
    ],
    insight:
      'Psychological safety is the #1 predictor of team innovation. Idea dismissal is most damaging when it comes from the most senior voice in the room.',
    researchNote:
      "Google's Project Aristotle (2016) found psychological safety was the single highest predictor of team effectiveness — more than individual talent, seniority, or org structure.",
  },
  {
    id: 'onboarding-silence',
    category: 'inclusion-signals',
    title: 'The Onboarding Silence',
    character: 'Tariq',
    characterRole: 'New Team Member',
    context:
      "Sprint planning. Tariq is three weeks in — came from ServiceNow, brings a different perspective. He just started to speak when Jordan talked over him.",
    trigger:
      'Tariq starts: "At my last org, we actually handled this by—" — then Jordan cuts across and finishes his own point.',
    choices: [
      {
        id: 'a',
        text: 'Let it go. Jordan is wrapping up a good point.',
        tone: 'dismissive',
        delta: { trust: -7, velocity: -2, retention: -9, innovation: -8 },
        consequence:
          "Tariq goes quiet in planning meetings. By month two, the team has missed three process improvements from his ServiceNow experience because he stopped offering them.",
        isHighSafety: false,
      },
      {
        id: 'b',
        text: "Jordan, hold on one second — Tariq, you were about to say something. Go ahead.",
        tone: 'engaging',
        delta: { trust: 13, velocity: 3, retention: 10, innovation: 9 },
        consequence:
          "Tariq shares that his previous org solved this exact problem with a lightweight triage matrix. The team adopts a version of it. The interruption pattern decreases noticeably in future meetings.",
        isHighSafety: true,
      },
      {
        id: 'c',
        text: "I want to make sure we hear from folks with different contexts. Tariq, what were you going to say about how your last org handled this?",
        tone: 'modeling',
        delta: { trust: 11, velocity: 3, retention: 9, innovation: 10 },
        consequence:
          "Tariq shares valuable institutional knowledge. The team explicitly starts asking him for cross-org comparisons. He recommends the role to two former colleagues.",
        isHighSafety: true,
      },
      {
        id: 'd',
        text: "Let's get through the planning first and circle back to Tariq's point.",
        tone: 'deflecting',
        delta: { trust: -5, velocity: 1, retention: -5, innovation: -6 },
        consequence:
          "You don't circle back. Tariq learns what meetings are for: delivering to plan, not shaping it.",
        isHighSafety: false,
      },
    ],
    insight:
      'New team members form their psychological safety model within the first 90 days, primarily through interruption patterns.',
    researchNote:
      "Inclusion research shows that retention risk for new hires is directly correlated with early inclusion signals — specifically whether their contributions are surfaced or passed over in the first month.",
  },
  {
    id: 'postmortem-trial',
    category: 'postmortem-culture',
    title: 'The Postmortem That Becomes a Trial',
    character: 'VP Chen',
    characterRole: 'VP of Engineering',
    context:
      "Postmortem. Release got rolled back. The VP is in the room and the last 20 minutes have been circling. Now it just got direct.",
    trigger:
      '"I just want to understand — who was responsible for the QA sign-off on this release?"',
    choices: [
      {
        id: 'a',
        text: 'Name the person responsible for QA sign-off.',
        tone: 'dismissive',
        delta: { trust: -11, velocity: -4, retention: -10, innovation: -9 },
        consequence:
          "The person named goes red. The room goes silent. In future postmortems, QA sign-offs are passed around quickly. Nobody wants to own them.",
        isHighSafety: false,
      },
      {
        id: 'b',
        text: "The sign-off was on me as release lead — but I want to suggest we reframe: what in our process made this bug invisible to multiple reviewers? That's where the answer is.",
        tone: 'modeling',
        delta: { trust: 14, velocity: 5, retention: 10, innovation: 8 },
        consequence:
          'The VP pauses. Then: "Okay. Walk me through that." The postmortem produces three process changes. The team leaves feeling like they built something rather than survived something.',
        isHighSafety: true,
      },
      {
        id: 'c',
        text: "We can answer that — but I'd rather we spend the time on what we're going to change. Can I redirect us there?",
        tone: 'engaging',
        delta: { trust: 8, velocity: 4, retention: 7, innovation: 6 },
        consequence:
          "The VP agrees, somewhat reluctantly. The focus shifts. It's not as powerful as naming the systemic issue directly, but the postmortem becomes constructive.",
        isHighSafety: true,
      },
      {
        id: 'd',
        text: "The QA process involves multiple touchpoints — it's hard to say one person was responsible.",
        tone: 'deflecting',
        delta: { trust: -4, velocity: -2, retention: -3, innovation: -3 },
        consequence:
          "The VP looks unsatisfied. The meeting ends without resolution. Blame diffuses but doesn't disappear — it becomes ambient.",
        isHighSafety: false,
      },
    ],
    insight:
      'Blameless postmortem culture consistently shows that teams using systems-focused retrospectives identify 3-4x more actionable improvements.',
    researchNote:
      "Google SRE pioneered blameless postmortems. Teams using them have 60% lower repeat incident rates than teams using blame-focused retrospectives. (Google SRE Book, Beyer et al.)",
  },
]
