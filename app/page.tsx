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
  TrendingUp,
  Sparkles,
  Heart,
  Calendar
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
    storage.saveContact(contact);
    loadContacts();
    setIsAddingContact(false);
  };

  const handleUpdateContact = (contact: Contact) => {
    storage.saveContact(contact);
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
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
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
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center p-4">
        <AddContactForm
          onSubmit={handleAddContact}
          onCancel={() => setIsAddingContact(false)}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm shadow-sm border-b border-white/20 sticky top-0 z-10">
        <div className="container mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="bg-gradient-to-br from-blue-600 to-indigo-700 p-3 rounded-2xl shadow-lg">
                <Brain className="h-7 w-7 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                  Social Memory
                </h1>
                <p className="text-sm text-gray-600 flex items-center gap-1">
                  <Sparkles className="h-3 w-3" />
                  AI-Powered Relationship Manager
                </p>
              </div>
            </div>
            
            <Button 
              onClick={() => setIsAddingContact(true)} 
              className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg hover:shadow-xl transition-all duration-200 rounded-xl px-6 py-3"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Contact
            </Button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-8 max-w-7xl">
        {/* Welcome Section */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            Welcome back! 👋
          </h2>
          <p className="text-gray-600">
            Manage your relationships and never forget the important details.
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-200 group">
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="bg-gradient-to-br from-blue-500 to-blue-600 p-3 rounded-xl group-hover:scale-110 transition-transform duration-200">
                  <Users className="h-6 w-6 text-white" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total Contacts</p>
                  <p className="text-3xl font-bold text-gray-900">{contacts.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-200 group">
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="bg-gradient-to-br from-orange-500 to-red-500 p-3 rounded-xl group-hover:scale-110 transition-transform duration-200">
                  <Calendar className="h-6 w-6 text-white" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Reminders</p>
                  <p className="text-3xl font-bold text-gray-900">{upcomingReminders.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-200 group">
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="bg-gradient-to-br from-green-500 to-emerald-600 p-3 rounded-xl group-hover:scale-110 transition-transform duration-200">
                  <MessageSquare className="h-6 w-6 text-white" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Conversations</p>
                  <p className="text-3xl font-bold text-gray-900">{totalConversations}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-200 group">
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="bg-gradient-to-br from-purple-500 to-pink-500 p-3 rounded-xl group-hover:scale-110 transition-transform duration-200">
                  <Heart className="h-6 w-6 text-white" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Engagement</p>
                  <p className="text-3xl font-bold text-gray-900">92%</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Search */}
        <div className="mb-8">
          <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-lg">
            <CardContent className="p-6">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <Input
                  type="text"
                  placeholder="Search contacts by name, company, or tags..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-12 h-12 bg-white/50 backdrop-blur-sm border-0 shadow-inner rounded-xl text-base focus:ring-2 focus:ring-blue-500/20 focus:bg-white/80 transition-all duration-200"
                />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Contacts */}
        {filteredContacts.length === 0 ? (
          <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-lg text-center py-16">
            <CardContent>
              <div className="bg-gradient-to-br from-blue-100 to-indigo-100 p-6 rounded-2xl w-24 h-24 mx-auto mb-6 flex items-center justify-center">
                <Users className="h-12 w-12 text-blue-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">
                {searchQuery ? 'No contacts found' : 'Your network awaits'}
              </h3>
              <p className="text-gray-600 mb-8 max-w-md mx-auto">
                {searchQuery 
                  ? 'Try adjusting your search terms to find the contact you\'re looking for' 
                  : 'Start building your personal CRM by adding your first contact. Keep track of everyone important in your life.'
                }
              </p>
              {!searchQuery && (
                <Button 
                  onClick={() => setIsAddingContact(true)}
                  className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg hover:shadow-xl transition-all duration-200 rounded-xl px-8 py-3 text-base"
                >
                  <Plus className="h-5 w-5 mr-2" />
                  Add Your First Contact
                </Button>
              )}
            </CardContent>
          </Card>
        ) : (
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900">
                Your Contacts ({filteredContacts.length})
              </h2>
              <div className="text-sm text-gray-500">
                {searchQuery && `Filtered by "${searchQuery}"`}
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredContacts.map((contact) => (
                <ContactCard
                  key={contact.id}
                  contact={contact}
                  onClick={() => setSelectedContact(contact)}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}