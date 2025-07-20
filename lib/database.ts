import { supabase } from './supabase'
import { Contact, Conversation, Reminder, PersonalDetail } from '@/types'

export const database = {
  // Profile operations
  async getProfile(userId: string) {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single()
    
    if (error) throw error
    return data
  },

  async updateProfile(userId: string, updates: { full_name?: string; avatar_url?: string }) {
    const { data, error } = await supabase
      .from('profiles')
      .update({
        ...updates,
        updated_at: new Date().toISOString()
      })
      .eq('id', userId)
      .select()
      .single()
    
    if (error) throw error
    return data
  },

  async createProfile(profile: { id: string; email: string; full_name?: string }) {
    const { data, error } = await supabase
      .from('profiles')
      .insert([{
        id: profile.id,
        email: profile.email,
        full_name: profile.full_name || null,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }])
      .select()
      .single()
    
    if (error) throw error
    return data
  },

  // Contact operations
  async getContacts(userId: string): Promise<Contact[]> {
    const { data: contacts, error: contactsError } = await supabase
      .from('contacts')
      .select('*')
      .eq('user_id', userId)
      .order('updated_at', { ascending: false })

    if (contactsError) throw contactsError

    // Get all related data
    const contactIds = contacts.map(c => c.id)
    
    const [
      { data: conversations },
      { data: reminders },
      { data: personalDetails }
    ] = await Promise.all([
      supabase.from('conversations').select('*').in('contact_id', contactIds),
      supabase.from('reminders').select('*').in('contact_id', contactIds),
      supabase.from('personal_details').select('*').in('contact_id', contactIds)
    ])

    // Combine data
    return contacts.map(contact => ({
      id: contact.id,
      name: contact.name,
      relationship: contact.relationship as Contact['relationship'],
      howWeMet: contact.how_we_met,
      whereWeMet: contact.where_we_met,
      company: contact.company,
      firstMetDate: contact.first_met_date,
      lastContactDate: contact.last_contact_date,
      tags: contact.tags,
      notes: contact.notes,
      createdAt: contact.created_at,
      updatedAt: contact.updated_at,
      conversations: (conversations || [])
        .filter(c => c.contact_id === contact.id)
        .map(c => ({
          id: c.id,
          contactId: c.contact_id,
          date: c.date,
          summary: c.summary,
          topics: c.topics,
          promises: c.promises,
          mood: c.mood as Conversation['mood'],
          nextSteps: c.next_steps
        })),
      reminders: (reminders || [])
        .filter(r => r.contact_id === contact.id)
        .map(r => ({
          id: r.id,
          contactId: r.contact_id,
          date: r.date,
          title: r.title,
          description: r.description,
          type: r.type as Reminder['type'],
          completed: r.completed
        })),
      personalDetails: (personalDetails || [])
        .filter(p => p.contact_id === contact.id)
        .map(p => ({
          id: p.id,
          contactId: p.contact_id,
          category: p.category as PersonalDetail['category'],
          detail: p.detail,
          importance: p.importance as PersonalDetail['importance']
        }))
    }))
  },

  async getContact(contactId: string, userId: string): Promise<Contact | null> {
    const contacts = await this.getContacts(userId)
    return contacts.find(c => c.id === contactId) || null
  },

  async saveContact(contact: Contact, userId: string): Promise<Contact> {
    const contactData = {
      id: contact.id,
      user_id: userId,
      name: contact.name,
      relationship: contact.relationship,
      how_we_met: contact.howWeMet,
      where_we_met: contact.whereWeMet,
      company: contact.company,
      first_met_date: contact.firstMetDate,
      last_contact_date: contact.lastContactDate,
      tags: contact.tags,
      notes: contact.notes,
      updated_at: new Date().toISOString()
    }

    const { error } = await supabase
      .from('contacts')
      .upsert(contactData)
      .select()
      .single()

    if (error) throw error

    // Save related data
    await Promise.all([
      this.saveConversations(contact.conversations, userId),
      this.saveReminders(contact.reminders, userId),
      this.savePersonalDetails(contact.personalDetails, userId)
    ])

    return contact
  },

  async deleteContact(contactId: string, userId: string): Promise<void> {
    // Delete related data first
    await Promise.all([
      supabase.from('conversations').delete().eq('contact_id', contactId).eq('user_id', userId),
      supabase.from('reminders').delete().eq('contact_id', contactId).eq('user_id', userId),
      supabase.from('personal_details').delete().eq('contact_id', contactId).eq('user_id', userId)
    ])

    const { error } = await supabase
      .from('contacts')
      .delete()
      .eq('id', contactId)
      .eq('user_id', userId)

    if (error) throw error
  },

  // Conversation operations
  async saveConversations(conversations: Conversation[], userId: string): Promise<void> {
    if (conversations.length === 0) return

    const conversationData = conversations.map(c => ({
      id: c.id,
      contact_id: c.contactId,
      user_id: userId,
      date: c.date,
      summary: c.summary,
      topics: c.topics,
      promises: c.promises,
      mood: c.mood,
      next_steps: c.nextSteps,
      updated_at: new Date().toISOString()
    }))

    const { error } = await supabase
      .from('conversations')
      .upsert(conversationData)

    if (error) throw error
  },

  // Reminder operations
  async saveReminders(reminders: Reminder[], userId: string): Promise<void> {
    if (reminders.length === 0) return

    const reminderData = reminders.map(r => ({
      id: r.id,
      contact_id: r.contactId,
      user_id: userId,
      date: r.date,
      title: r.title,
      description: r.description,
      type: r.type,
      completed: r.completed,
      updated_at: new Date().toISOString()
    }))

    const { error } = await supabase
      .from('reminders')
      .upsert(reminderData)

    if (error) throw error
  },

  // Personal detail operations
  async savePersonalDetails(details: PersonalDetail[], userId: string): Promise<void> {
    if (details.length === 0) return

    const detailData = details.map(d => ({
      id: d.id,
      contact_id: d.contactId,
      user_id: userId,
      category: d.category,
      detail: d.detail,
      importance: d.importance,
      updated_at: new Date().toISOString()
    }))

    const { error } = await supabase
      .from('personal_details')
      .upsert(detailData)

    if (error) throw error
  },

  async getUpcomingReminders(userId: string, days: number = 7): Promise<Reminder[]> {
    const now = new Date()
    const futureDate = new Date()
    futureDate.setDate(futureDate.getDate() + days)

    const { data, error } = await supabase
      .from('reminders')
      .select('*')
      .eq('user_id', userId)
      .eq('completed', false)
      .gte('date', now.toISOString())
      .lte('date', futureDate.toISOString())
      .order('date', { ascending: true })

    if (error) throw error

    return (data || []).map(r => ({
      id: r.id,
      contactId: r.contact_id,
      date: r.date,
      title: r.title,
      description: r.description,
      type: r.type as Reminder['type'],
      completed: r.completed
    }))
  },

  async searchContacts(query: string, userId: string): Promise<Contact[]> {
    const contacts = await this.getContacts(userId)
    const lowercaseQuery = query.toLowerCase()
    
    return contacts.filter(contact => 
      contact.name.toLowerCase().includes(lowercaseQuery) ||
      contact.tags.some(tag => tag.toLowerCase().includes(lowercaseQuery)) ||
      contact.notes.toLowerCase().includes(lowercaseQuery) ||
      contact.whereWeMet.toLowerCase().includes(lowercaseQuery) ||
      contact.howWeMet.toLowerCase().includes(lowercaseQuery)
    )
  }
}