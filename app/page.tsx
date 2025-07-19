'use client';

import { useState, useEffect } from 'react';
import { Contact } from '@/types';
import { storage } from '@/lib/storage';
import { ContactCard } from '@/components/ContactCard';
import { ContactDetail } from '@/components/ContactDetail';
import { AddContactForm } from '@/components/AddContactForm';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Brain, 
  Search, 
  Plus, 
  Users, 
  Clock,
  MessageSquare,
  TrendingUp
} from 'lucide-react';

export default function Home() {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
  const [isAddingContact, setIsAddingContact] = useState(false);

  useEffect(() => {
    loadContacts();
  }, []);

  const loadContacts = () => {
    const storedContacts = storage.getContacts();
    setContacts(storedContacts);
  };

  const handleAddContact = (contact: Contact) => {
    storage.addContact(contact);
    loadContacts();
    setIsAddingContact(false);
  };

  const handleUpdateContact = (contact: Contact) => {
    storage.updateContact(contact);
    loadContacts();
    setSelectedContact(contact);
  };

  const handleDeleteContact = (contactId: string) => {
    storage.deleteContact(contactId);
    loadContacts();
    setSelectedContact(null);
  };

  const filteredContacts = contacts.filter(contact =>
    contact.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    contact.company?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    contact.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const upcomingReminders = contacts.flatMap(c => 
    c.reminders.filter(r => !r.completed)
  );

  const totalConversations = contacts.reduce((sum, c) => sum + c.conversations.length, 0);

  if (selectedContact) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto py-6 px-4 max-w-6xl">
          <ContactDetail
            contact={selectedContact}
            onBack={() => setSelectedContact(null)}
            onUpdate={handleUpdateContact}
            onDelete={handleDeleteContact}
            aiInsights={[]}
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
      <div className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-blue-600 p-2 rounded-lg">
                <Brain className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Social Memory</h1>
                <p className="text-sm text-gray-500">AI-Powered CRM</p>
              </div>
            </div>
            
            <Button 
              onClick={() => setIsAddingContact(true)} 
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Contact
            </Button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-8 max-w-7xl">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Users className="h-8 w-8 text-blue-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total Contacts</p>
                  <p className="text-2xl font-bold text-gray-900">{contacts.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Clock className="h-8 w-8 text-orange-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Reminders</p>
                  <p className="text-2xl font-bold text-gray-900">{upcomingReminders.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <MessageSquare className="h-8 w-8 text-green-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Conversations</p>
                  <p className="text-2xl font-bold text-gray-900">{totalConversations}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <TrendingUp className="h-8 w-8 text-purple-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Engagement</p>
                  <p className="text-2xl font-bold text-gray-900">92%</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Search */}
        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              type="text"
              placeholder="Search contacts..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* Contacts */}
        {filteredContacts.length === 0 ? (
          <Card className="text-center py-12">
            <CardContent>
              <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                {searchQuery ? 'No contacts found' : 'No contacts yet'}
              </h3>
              <p className="text-gray-500 mb-6">
                {searchQuery 
                  ? 'Try adjusting your search terms' 
                  : 'Add your first contact to get started!'
                }
              </p>
              {!searchQuery && (
                <Button 
                  onClick={() => setIsAddingContact(true)}
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Your First Contact
                </Button>
              )}
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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