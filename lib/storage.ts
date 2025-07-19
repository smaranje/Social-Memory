import { Contact, Conversation, Reminder, PersonalDetail } from '@/types';

const STORAGE_KEY = 'social-memory-contacts';

export const storage = {
  getContacts: (): Contact[] => {
    if (typeof window === 'undefined') return [];
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  },

  getContact: (id: string): Contact | null => {
    const contacts = storage.getContacts();
    return contacts.find(c => c.id === id) || null;
  },

  saveContact: (contact: Contact): void => {
    const contacts = storage.getContacts();
    const index = contacts.findIndex(c => c.id === contact.id);
    
    if (index >= 0) {
      contacts[index] = contact;
    } else {
      contacts.push(contact);
    }
    
    localStorage.setItem(STORAGE_KEY, JSON.stringify(contacts));
  },

  deleteContact: (id: string): void => {
    const contacts = storage.getContacts();
    const filtered = contacts.filter(c => c.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
  },

  searchContacts: (query: string): Contact[] => {
    const contacts = storage.getContacts();
    const lowercaseQuery = query.toLowerCase();
    
    return contacts.filter(contact => 
      contact.name.toLowerCase().includes(lowercaseQuery) ||
      contact.tags.some(tag => tag.toLowerCase().includes(lowercaseQuery)) ||
      contact.notes.toLowerCase().includes(lowercaseQuery) ||
      contact.whereWeMet.toLowerCase().includes(lowercaseQuery) ||
      contact.howWeMet.toLowerCase().includes(lowercaseQuery)
    );
  },

  addConversation: (contactId: string, conversation: Conversation): void => {
    const contact = storage.getContact(contactId);
    if (contact) {
      contact.conversations.push(conversation);
      contact.lastContactDate = conversation.date;
      contact.updatedAt = new Date().toISOString();
      storage.saveContact(contact);
    }
  },

  addReminder: (contactId: string, reminder: Reminder): void => {
    const contact = storage.getContact(contactId);
    if (contact) {
      contact.reminders.push(reminder);
      contact.updatedAt = new Date().toISOString();
      storage.saveContact(contact);
    }
  },

  addPersonalDetail: (contactId: string, detail: PersonalDetail): void => {
    const contact = storage.getContact(contactId);
    if (contact) {
      contact.personalDetails.push(detail);
      contact.updatedAt = new Date().toISOString();
      storage.saveContact(contact);
    }
  },

  getUpcomingReminders: (days: number = 7): Reminder[] => {
    const contacts = storage.getContacts();
    const now = new Date();
    const futureDate = new Date();
    futureDate.setDate(futureDate.getDate() + days);
    
    const reminders: Reminder[] = [];
    
    contacts.forEach(contact => {
      contact.reminders.forEach(reminder => {
        const reminderDate = new Date(reminder.date);
        if (reminderDate >= now && reminderDate <= futureDate && !reminder.completed) {
          reminders.push(reminder);
        }
      });
    });
    
    return reminders.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  }
};