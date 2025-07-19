'use client';

import { useState, useEffect } from 'react';
import { Contact } from '@/types';
import { storage } from '@/lib/storage';
import { ContactCard } from '@/components/ContactCard';
import { ContactDetail } from '@/components/ContactDetail';
import { AddContactForm } from '@/components/AddContactForm';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Brain, 
  Search, 
  Plus, 
  Users, 
  Clock,
  TrendingUp,
  Calendar
} from 'lucide-react';

export default function Home() {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
  const [isAddingContact, setIsAddingContact] = useState(false);
  const [upcomingReminders, setUpcomingReminders] = useState<any[]>([]);

  useEffect(() => {
    // Load contacts from localStorage
    const loadedContacts = storage.getContacts();
    setContacts(loadedContacts);
    
    // Load upcoming reminders
    const reminders = storage.getUpcomingReminders(7);
    setUpcomingReminders(reminders);
  }, []);

  const handleAddContact = (newContact: Contact) => {
    storage.saveContact(newContact);
    setContacts([...contacts, newContact]);
    setIsAddingContact(false);
  };

  const handleUpdateContact = (updatedContact: Contact) => {
    storage.saveContact(updatedContact);
    setContacts(contacts.map(c => c.id === updatedContact.id ? updatedContact : c));
    setSelectedContact(updatedContact);
  };

  const handleDeleteContact = (id: string) => {
    storage.deleteContact(id);
    setContacts(contacts.filter(c => c.id !== id));
    setSelectedContact(null);
  };

  const filteredContacts = searchQuery
    ? storage.searchContacts(searchQuery)
    : contacts;

  const getAIInsights = (contact: Contact): string[] => {
    const insights: string[] = [];
    
    // Check last contact date
    if (contact.lastContactDate) {
      const daysSinceContact = Math.floor(
        (new Date().getTime() - new Date(contact.lastContactDate).getTime()) / (1000 * 60 * 60 * 24)
      );
      
      if (daysSinceContact > 30) {
        insights.push(`It's been ${daysSinceContact} days since you last talked. Consider reaching out!`);
      }
    }
    
    // Check for upcoming reminders
    const contactReminders = contact.reminders.filter(r => !r.completed);
    if (contactReminders.length > 0) {
      insights.push(`You have ${contactReminders.length} active reminder${contactReminders.length > 1 ? 's' : ''} for this person.`);
    }
    
    // Relationship-specific insights
    if (contact.relationship === 'networking') {
      insights.push('Professional connection - consider discussing career updates or industry trends.');
    } else if (contact.relationship === 'friend' && contact.personalDetails.length > 0) {
      insights.push('Ask about their recent interests or hobbies you discussed before.');
    }
    
    return insights;
  };

  if (selectedContact) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto py-8 px-4 max-w-4xl">
          <ContactDetail
            contact={selectedContact}
            onBack={() => setSelectedContact(null)}
            onUpdate={handleUpdateContact}
            onDelete={handleDeleteContact}
            aiInsights={getAIInsights(selectedContact)}
          />
        </div>
      </div>
    );
  }

  if (isAddingContact) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <AddContactForm
          onSubmit={handleAddContact}
          onCancel={() => setIsAddingContact(false)}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Brain className="h-8 w-8 text-blue-600" />
              <div>
                <h1 className="text-2xl font-bold">Social Memory</h1>
                <p className="text-sm text-muted-foreground">Never forget what matters to the people who matter</p>
              </div>
            </div>
            <Button onClick={() => setIsAddingContact(true)} size="lg">
              <Plus className="h-4 w-4 mr-2" />
              Add Contact
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardHeader className="pb-3">
              <CardDescription>Total Contacts</CardDescription>
              <CardTitle className="text-2xl">{contacts.length}</CardTitle>
            </CardHeader>
            <CardContent>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-3">
              <CardDescription>Upcoming Reminders</CardDescription>
              <CardTitle className="text-2xl">{upcomingReminders.length}</CardTitle>
            </CardHeader>
            <CardContent>
              <Clock className="h-4 w-4 text-orange-500" />
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-3">
              <CardDescription>Conversations</CardDescription>
              <CardTitle className="text-2xl">
                {contacts.reduce((sum, c) => sum + c.conversations.length, 0)}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <TrendingUp className="h-4 w-4 text-green-500" />
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-3">
              <CardDescription>Last Added</CardDescription>
              <CardTitle className="text-2xl">
                {contacts.length > 0 
                  ? new Date(Math.max(...contacts.map(c => new Date(c.createdAt).getTime()))).toLocaleDateString()
                  : 'N/A'
                }
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Calendar className="h-4 w-4 text-blue-500" />
            </CardContent>
          </Card>
        </div>

        {/* Search Bar */}
        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search contacts by name, tags, location..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* Contacts Grid */}
        {filteredContacts.length === 0 ? (
          <Card className="text-center py-12">
            <CardContent>
              <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">
                {searchQuery ? 'No contacts found' : 'No contacts yet'}
              </h3>
              <p className="text-muted-foreground mb-4">
                {searchQuery 
                  ? 'Try adjusting your search terms' 
                  : 'Start building your social memory by adding your first contact'
                }
              </p>
              {!searchQuery && (
                <Button onClick={() => setIsAddingContact(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Your First Contact
                </Button>
              )}
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredContacts.map((contact) => (
              <ContactCard
                key={contact.id}
                contact={contact}
                onClick={() => setSelectedContact(contact)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}