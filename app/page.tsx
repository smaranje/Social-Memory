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
  Zap,
  Menu,
  X,
  Bell,
  Settings
} from 'lucide-react';

export default function Home() {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
  const [isAddingContact, setIsAddingContact] = useState(false);
  const [upcomingReminders, setUpcomingReminders] = useState<any[]>([]);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [filterBy, setFilterBy] = useState<string>('all');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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
      <div className="min-h-screen bg-[hsl(var(--twitch-bg))] scrollbar-twitch">
        <div className="container mx-auto py-4 px-4 max-w-4xl">
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
      <div className="min-h-screen bg-[hsl(var(--twitch-bg))] flex items-center justify-center p-4">
        <AddContactForm
          onSubmit={handleAddContact}
          onCancel={() => setIsAddingContact(false)}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[hsl(var(--twitch-bg))] scrollbar-twitch">
      {/* Mobile-optimized Header */}
      <header className="bg-[hsl(var(--twitch-bg-secondary))] border-b border-[hsl(var(--twitch-border))] sticky top-0 z-50">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button 
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden tap-target flex items-center justify-center"
              >
                {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
              <div className="flex items-center gap-2">
                <div className="bg-[hsl(var(--twitch-purple))] p-2 rounded twitch-glow">
                  <Brain className="h-6 w-6 text-white" />
                </div>
                <h1 className="text-xl md:text-2xl font-bold text-white hidden sm:block">
                  Social Memory
                </h1>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button 
                size="icon"
                variant="ghost"
                className="tap-target text-[hsl(var(--twitch-text-secondary))] hover:text-white hover:bg-[hsl(var(--twitch-bg-tertiary))]"
              >
                <Bell className="h-5 w-5" />
              </Button>
              <Button 
                onClick={() => setIsAddingContact(true)} 
                size="sm"
                className="btn-twitch tap-target flex items-center gap-2"
              >
                <Plus className="h-4 w-4" />
                <span className="hidden sm:inline">Add</span>
              </Button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-[hsl(var(--twitch-bg-secondary))] border-t border-[hsl(var(--twitch-border))] slide-up">
            <div className="p-4 space-y-2">
              <Button variant="ghost" className="w-full justify-start text-left">
                <Settings className="h-4 w-4 mr-2" />
                Settings
              </Button>
              <Button variant="ghost" className="w-full justify-start text-left">
                <Activity className="h-4 w-4 mr-2" />
                Activity
              </Button>
            </div>
          </div>
        )}
      </header>

      <div className="container mx-auto px-4 py-4 max-w-7xl">
        {/* Stats Cards - Mobile Optimized */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
          <Card className="bg-[hsl(var(--twitch-bg-secondary))] border-[hsl(var(--twitch-border))] hover:border-[hsl(var(--twitch-purple))] transition-all duration-200 scale-in">
            <CardHeader className="p-4">
              <CardDescription className="text-[hsl(var(--twitch-text-muted))] text-xs">Total Contacts</CardDescription>
              <CardTitle className="text-2xl font-bold text-[hsl(var(--twitch-purple))]">
                {contacts.length}
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 pt-0">
              <div className="flex items-center justify-between">
                <Users className="h-4 w-4 text-[hsl(var(--twitch-purple))]" />
                <span className="text-xs text-green-500 font-semibold">+12%</span>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-[hsl(var(--twitch-bg-secondary))] border-[hsl(var(--twitch-border))] hover:border-[hsl(var(--twitch-purple))] transition-all duration-200 scale-in">
            <CardHeader className="p-4">
              <CardDescription className="text-[hsl(var(--twitch-text-muted))] text-xs">Reminders</CardDescription>
              <CardTitle className="text-2xl font-bold text-orange-500">
                {upcomingReminders.length}
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 pt-0">
              <div className="flex items-center justify-between">
                <Clock className="h-4 w-4 text-orange-500 twitch-pulse" />
                <span className="text-xs text-orange-500 font-semibold">This week</span>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-[hsl(var(--twitch-bg-secondary))] border-[hsl(var(--twitch-border))] hover:border-[hsl(var(--twitch-purple))] transition-all duration-200 scale-in hidden md:block">
            <CardHeader className="p-4">
              <CardDescription className="text-[hsl(var(--twitch-text-muted))] text-xs">Conversations</CardDescription>
              <CardTitle className="text-2xl font-bold text-green-500">
                {contacts.reduce((sum, c) => sum + c.conversations.length, 0)}
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 pt-0">
              <div className="flex items-center justify-between">
                <Activity className="h-4 w-4 text-green-500" />
                <span className="text-xs text-green-500 font-semibold">Active</span>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-[hsl(var(--twitch-bg-secondary))] border-[hsl(var(--twitch-border))] hover:border-[hsl(var(--twitch-purple))] transition-all duration-200 scale-in hidden md:block">
            <CardHeader className="p-4">
              <CardDescription className="text-[hsl(var(--twitch-text-muted))] text-xs">Engagement</CardDescription>
              <CardTitle className="text-2xl font-bold text-blue-500">
                92%
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 pt-0">
              <div className="flex items-center justify-between">
                <Target className="h-4 w-4 text-blue-500" />
                <span className="text-xs text-blue-500 font-semibold">Great!</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* AI Insights Section - Twitch Style */}
        <Card className="bg-[hsl(var(--twitch-purple))] text-white mb-6 border-0 twitch-glow">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="bg-white/20 p-2 rounded">
                  <Zap className="h-5 w-5 twitch-bounce" />
                </div>
                <div>
                  <h3 className="text-lg font-bold">AI Insights</h3>
                  <p className="text-sm text-white/80">
                    3 contacts need attention
                  </p>
                </div>
              </div>
              <Button variant="ghost" size="sm" className="text-white hover:bg-white/20">
                View
                <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Search and Filter Bar - Mobile Optimized */}
        <div className="mb-6 space-y-3">
          <div className="flex gap-2 items-center">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-[hsl(var(--twitch-text-muted))]" />
              <Input
                type="text"
                placeholder="Search contacts..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 py-3 bg-[hsl(var(--twitch-bg-secondary))] border-[hsl(var(--twitch-border))] text-white placeholder:text-[hsl(var(--twitch-text-muted))] focus:border-[hsl(var(--twitch-purple))] rounded"
              />
            </div>
            <div className="flex gap-1">
              <Button
                variant={viewMode === 'grid' ? 'default' : 'ghost'}
                size="icon"
                onClick={() => setViewMode('grid')}
                className={viewMode === 'grid' ? 'btn-twitch' : 'text-[hsl(var(--twitch-text-secondary))] hover:bg-[hsl(var(--twitch-bg-tertiary))]'}
              >
                <LayoutGrid className="h-5 w-5" />
              </Button>
              <Button
                variant={viewMode === 'list' ? 'default' : 'ghost'}
                size="icon"
                onClick={() => setViewMode('list')}
                className={viewMode === 'list' ? 'btn-twitch' : 'text-[hsl(var(--twitch-text-secondary))] hover:bg-[hsl(var(--twitch-bg-tertiary))]'}
              >
                <List className="h-5 w-5" />
              </Button>
            </div>
          </div>
          
          {/* Filter Pills - Horizontal Scroll on Mobile */}
          <div className="flex gap-2 overflow-x-auto pb-2 -mx-4 px-4 no-scrollbar">
            <Button
              variant={filterBy === 'all' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setFilterBy('all')}
              className={filterBy === 'all' ? 'btn-twitch rounded-full whitespace-nowrap' : 'btn-twitch-secondary rounded-full whitespace-nowrap'}
            >
              All
            </Button>
            <Button
              variant={filterBy === 'friend' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setFilterBy('friend')}
              className={filterBy === 'friend' ? 'btn-twitch rounded-full whitespace-nowrap' : 'btn-twitch-secondary rounded-full whitespace-nowrap'}
            >
              <Heart className="h-3 w-3 mr-1" />
              Friends
            </Button>
            <Button
              variant={filterBy === 'colleague' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setFilterBy('colleague')}
              className={filterBy === 'colleague' ? 'btn-twitch rounded-full whitespace-nowrap' : 'btn-twitch-secondary rounded-full whitespace-nowrap'}
            >
              Colleagues
            </Button>
            <Button
              variant={filterBy === 'family' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setFilterBy('family')}
              className={filterBy === 'family' ? 'btn-twitch rounded-full whitespace-nowrap' : 'btn-twitch-secondary rounded-full whitespace-nowrap'}
            >
              Family
            </Button>
            <Button
              variant={filterBy === 'networking' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setFilterBy('networking')}
              className={filterBy === 'networking' ? 'btn-twitch rounded-full whitespace-nowrap' : 'btn-twitch-secondary rounded-full whitespace-nowrap'}
            >
              Network
            </Button>
          </div>
        </div>

        {/* Contacts Grid/List */}
        {filteredContacts.length === 0 ? (
          <Card className="text-center py-12 bg-[hsl(var(--twitch-bg-secondary))] border-[hsl(var(--twitch-border))]">
            <CardContent>
              <div className="bg-[hsl(var(--twitch-purple))] w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 twitch-glow">
                <Users className="h-10 w-10 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-2 text-white">
                {searchQuery ? 'No contacts found' : 'Start Your Journey'}
              </h3>
              <p className="text-[hsl(var(--twitch-text-secondary))] mb-6 max-w-md mx-auto text-sm">
                {searchQuery 
                  ? 'Try adjusting your search' 
                  : 'Build meaningful connections by adding your first contact!'
                }
              </p>
              {!searchQuery && (
                <Button 
                  onClick={() => setIsAddingContact(true)}
                  size="lg"
                  className="btn-twitch"
                >
                  <Plus className="h-5 w-5 mr-2" />
                  Add First Contact
                </Button>
              )}
            </CardContent>
          </Card>
        ) : (
          <div className={viewMode === 'grid' 
            ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4" 
            : "space-y-3"
          }>
            {filteredContacts.map((contact, index) => (
              <div key={contact.id} className="fade-in" style={{ animationDelay: `${index * 50}ms` }}>
                <ContactCard
                  contact={contact}
                  onClick={() => setSelectedContact(contact)}
                />
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Add custom styles for no-scrollbar */}
      <style jsx>{`
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .no-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
}