export interface Contact {
  id: string;
  name: string;
  relationship: 'friend' | 'colleague' | 'family' | 'romantic' | 'acquaintance' | 'networking' | 'other';
  howWeMet: string;
  whereWeMet: string;
  company?: string;
  firstMetDate: string;
  lastContactDate: string;
  tags: string[];
  notes: string;
  reminders: Reminder[];
  conversations: Conversation[];
  personalDetails: PersonalDetail[];
  createdAt: string;
  updatedAt: string;
}

export interface Conversation {
  id: string;
  contactId: string;
  date: string;
  summary: string;
  topics: string[];
  promises: string[];
  mood: 'positive' | 'neutral' | 'negative';
  nextSteps?: string;
}

export interface Reminder {
  id: string;
  contactId: string;
  date: string;
  title: string;
  description: string;
  type: 'follow-up' | 'birthday' | 'event' | 'promise' | 'check-in' | 'other';
  completed: boolean;
}

export interface PersonalDetail {
  id: string;
  contactId: string;
  category: 'work' | 'family' | 'hobbies' | 'preferences' | 'goals' | 'other';
  detail: string;
  importance: 'high' | 'medium' | 'low';
}

export interface AIInsight {
  suggestion: string;
  reason: string;
  priority: 'high' | 'medium' | 'low';
  type: 'follow-up' | 'conversation-starter' | 'reminder' | 'relationship-insight';
}