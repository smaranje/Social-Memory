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
  Calendar,
  Sparkles,
  Heart,
  Filter,
  LayoutGrid,
  List,
  ChevronRight,
  Activity,
  Target,
  Zap
} from 'lucide-react';

export default function Home() {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
  const [isAddingContact, setIsAddingContact] = useState(false);
  const [upcomingReminders, setUpcomingReminders] = useState<any[]>([]);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [filterBy, setFilterBy] = useState<string>('all');

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
    : filterBy === 'all' 
      ? contacts 
      : contacts.filter(c => c.relationship === filterBy);

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
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50">
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
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 flex items-center justify-center p-4">
        <AddContactForm
          onSubmit={handleAddContact}
          onCancel={() => setIsAddingContact(false)}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50">
      {/* Animated Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-blue-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
      </div>

      {/* Header */}
      <header className="bg-white/80 backdrop-blur-lg border-b border-white/20 sticky top-0 z-10 shadow-lg">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl blur-lg opacity-75"></div>
                <div className="relative bg-gradient-to-r from-purple-600 to-pink-600 p-3 rounded-xl">
                  <Brain className="h-8 w-8 text-white" />
                </div>
              </div>
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                  Social Memory
                </h1>
                <p className="text-sm text-gray-600 flex items-center gap-1">
                  <Sparkles className="h-3 w-3" />
                  Never forget what matters to the people who matter
                </p>
              </div>
            </div>
            <Button 
              onClick={() => setIsAddingContact(true)} 
              size="lg"
              className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Contact
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 relative z-0">
        {/* Stats Cards with Glassmorphism */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card className="bg-white/60 backdrop-blur-md border-white/20 shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300">
            <CardHeader className="pb-3">
              <CardDescription className="text-gray-600">Total Contacts</CardDescription>
              <CardTitle className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                {contacts.length}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <Users className="h-5 w-5 text-purple-600" />
                <span className="text-xs text-green-600 font-semibold">+12% this month</span>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-white/60 backdrop-blur-md border-white/20 shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300">
            <CardHeader className="pb-3">
              <CardDescription className="text-gray-600">Upcoming Reminders</CardDescription>
              <CardTitle className="text-3xl font-bold text-orange-600">
                {upcomingReminders.length}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <Clock className="h-5 w-5 text-orange-500 animate-pulse" />
                <span className="text-xs text-orange-600 font-semibold">Due this week</span>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-white/60 backdrop-blur-md border-white/20 shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300">
            <CardHeader className="pb-3">
              <CardDescription className="text-gray-600">Conversations</CardDescription>
              <CardTitle className="text-3xl font-bold text-green-600">
                {contacts.reduce((sum, c) => sum + c.conversations.length, 0)}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <Activity className="h-5 w-5 text-green-500" />
                <span className="text-xs text-green-600 font-semibold">Active connections</span>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-white/60 backdrop-blur-md border-white/20 shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300">
            <CardHeader className="pb-3">
              <CardDescription className="text-gray-600">Engagement Score</CardDescription>
              <CardTitle className="text-3xl font-bold text-blue-600">
                92%
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <Target className="h-5 w-5 text-blue-500" />
                <span className="text-xs text-blue-600 font-semibold">Great job!</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* AI Insights Section */}
        <Card className="bg-gradient-to-r from-purple-600 to-pink-600 text-white mb-8 shadow-xl">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="bg-white/20 backdrop-blur-md p-3 rounded-lg">
                  <Zap className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="text-xl font-bold">AI Insights</h3>
                  <p className="text-white/80">
                    You have 3 contacts you haven't reached out to in over 30 days
                  </p>
                </div>
              </div>
              <Button variant="secondary" className="bg-white/20 hover:bg-white/30 text-white border-0">
                View Suggestions
                <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Search and Filter Bar */}
        <div className="mb-6 space-y-4">
          <div className="flex gap-4 items-center">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <Input
                type="text"
                placeholder="Search contacts by name, tags, location..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-12 pr-4 py-6 bg-white/80 backdrop-blur-md border-white/20 shadow-lg rounded-xl text-lg placeholder:text-gray-400 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>
            <div className="flex gap-2">
              <Button
                variant={viewMode === 'grid' ? 'default' : 'outline'}
                size="icon"
                onClick={() => setViewMode('grid')}
                className="h-12 w-12 rounded-xl"
              >
                <LayoutGrid className="h-5 w-5" />
              </Button>
              <Button
                variant={viewMode === 'list' ? 'default' : 'outline'}
                size="icon"
                onClick={() => setViewMode('list')}
                className="h-12 w-12 rounded-xl"
              >
                <List className="h-5 w-5" />
              </Button>
            </div>
          </div>
          
          {/* Filter Pills */}
          <div className="flex gap-2 flex-wrap">
            <Button
              variant={filterBy === 'all' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setFilterBy('all')}
              className="rounded-full"
            >
              All Contacts
            </Button>
            <Button
              variant={filterBy === 'friend' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setFilterBy('friend')}
              className="rounded-full"
            >
              <Heart className="h-3 w-3 mr-1" />
              Friends
            </Button>
            <Button
              variant={filterBy === 'colleague' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setFilterBy('colleague')}
              className="rounded-full"
            >
              Colleagues
            </Button>
            <Button
              variant={filterBy === 'family' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setFilterBy('family')}
              className="rounded-full"
            >
              Family
            </Button>
            <Button
              variant={filterBy === 'networking' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setFilterBy('networking')}
              className="rounded-full"
            >
              Networking
            </Button>
          </div>
        </div>

        {/* Contacts Grid/List */}
        {filteredContacts.length === 0 ? (
          <Card className="text-center py-16 bg-white/60 backdrop-blur-md border-white/20 shadow-xl">
            <CardContent>
              <div className="bg-gradient-to-r from-purple-100 to-pink-100 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6">
                <Users className="h-12 w-12 text-purple-600" />
              </div>
              <h3 className="text-2xl font-bold mb-2 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                {searchQuery ? 'No contacts found' : 'Start Your Social Journey'}
              </h3>
              <p className="text-gray-600 mb-6 max-w-md mx-auto">
                {searchQuery 
                  ? 'Try adjusting your search terms or filters' 
                  : 'Build meaningful connections by adding your first contact. Every great network starts with a single connection!'
                }
              </p>
              {!searchQuery && (
                <Button 
                  onClick={() => setIsAddingContact(true)}
                  size="lg"
                  className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
                >
                  <Plus className="h-5 w-5 mr-2" />
                  Add Your First Contact
                </Button>
              )}
            </CardContent>
          </Card>
        ) : (
          <div className={viewMode === 'grid' 
            ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" 
            : "space-y-4"
          }>
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