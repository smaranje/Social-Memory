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
  Settings,
  Briefcase,
  Network,
  MessageSquare,
  ArrowUpRight,
  Star,
  Flame
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
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-950 to-slate-900 scrollbar-twitch">
        <div className="container mx-auto py-6 px-4 max-w-6xl">
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
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-950 to-slate-900 flex items-center justify-center p-4">
        <AddContactForm
          onSubmit={handleAddContact}
          onCancel={() => setIsAddingContact(false)}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-950 to-slate-900 scrollbar-twitch relative overflow-x-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/10 rounded-full mix-blend-multiply filter blur-xl animate-blob"></div>
        <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-pink-500/10 rounded-full mix-blend-multiply filter blur-xl animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-1/4 left-1/3 w-96 h-96 bg-blue-500/10 rounded-full mix-blend-multiply filter blur-xl animate-blob animation-delay-4000"></div>
      </div>

      {/* Glass morphism header */}
      <header className="sticky top-0 z-50 backdrop-blur-xl bg-white/5 border-b border-white/10 shadow-2xl">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button 
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden tap-target flex items-center justify-center rounded-xl hover:bg-white/10 transition-all duration-200"
              >
                {mobileMenuOpen ? <X className="h-6 w-6 text-white" /> : <Menu className="h-6 w-6 text-white" />}
              </button>
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="bg-gradient-to-r from-purple-600 to-pink-600 p-3 rounded-2xl shadow-lg">
                    <Brain className="h-7 w-7 text-white" />
                  </div>
                  <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full animate-pulse border-2 border-white"></div>
                </div>
                <div className="hidden sm:block">
                  <h1 className="text-2xl font-bold bg-gradient-to-r from-white to-purple-200 bg-clip-text text-transparent">
                    Social Memory
                  </h1>
                  <p className="text-sm text-gray-400 -mt-1">AI-Powered CRM</p>
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <Button 
                size="icon"
                variant="ghost"
                className="relative tap-target text-gray-300 hover:text-white hover:bg-white/10 rounded-xl transition-all duration-200"
              >
                <Bell className="h-5 w-5" />
                {upcomingReminders.length > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold">
                    {upcomingReminders.length}
                  </span>
                )}
              </Button>
              <Button 
                onClick={() => setIsAddingContact(true)} 
                className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold px-6 py-2 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 tap-target flex items-center gap-2"
              >
                <Plus className="h-4 w-4" />
                <span className="hidden sm:inline">Add Contact</span>
                <span className="sm:hidden">Add</span>
              </Button>
            </div>
          </div>
        </div>

        {/* Enhanced Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden backdrop-blur-xl bg-black/20 border-t border-white/10 slide-up">
            <div className="p-6 space-y-3">
              <Button variant="ghost" className="w-full justify-start text-left text-white hover:bg-white/10 rounded-xl py-3">
                <Settings className="h-5 w-5 mr-3" />
                Settings
              </Button>
              <Button variant="ghost" className="w-full justify-start text-left text-white hover:bg-white/10 rounded-xl py-3">
                <Activity className="h-5 w-5 mr-3" />
                Activity Feed
              </Button>
              <Button variant="ghost" className="w-full justify-start text-left text-white hover:bg-white/10 rounded-xl py-3">
                <Star className="h-5 w-5 mr-3" />
                Favorites
              </Button>
            </div>
          </div>
        )}
      </header>

      <div className="container mx-auto px-6 py-8 max-w-7xl relative z-10">
        {/* Hero Stats Section */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="bg-gradient-to-br from-purple-900/50 to-purple-800/30 backdrop-blur-xl border border-purple-500/20 hover:border-purple-400/40 transition-all duration-300 group">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="bg-purple-500/20 p-3 rounded-xl group-hover:bg-purple-500/30 transition-colors">
                  <Users className="h-6 w-6 text-purple-300" />
                </div>
                <div className="text-right">
                  <Badge className="bg-green-500/20 text-green-300 border-green-500/30">
                    +12%
                  </Badge>
                </div>
              </div>
              <div>
                <p className="text-gray-400 text-sm mb-1">Total Contacts</p>
                <p className="text-3xl font-bold text-white">{contacts.length}</p>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-br from-orange-900/50 to-orange-800/30 backdrop-blur-xl border border-orange-500/20 hover:border-orange-400/40 transition-all duration-300 group">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="bg-orange-500/20 p-3 rounded-xl group-hover:bg-orange-500/30 transition-colors">
                  <Clock className="h-6 w-6 text-orange-300" />
                </div>
                <div className="text-right">
                  <Badge className="bg-orange-500/20 text-orange-300 border-orange-500/30">
                    This week
                  </Badge>
                </div>
              </div>
              <div>
                <p className="text-gray-400 text-sm mb-1">Reminders</p>
                <p className="text-3xl font-bold text-white">{upcomingReminders.length}</p>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-br from-green-900/50 to-green-800/30 backdrop-blur-xl border border-green-500/20 hover:border-green-400/40 transition-all duration-300 group hidden lg:block">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="bg-green-500/20 p-3 rounded-xl group-hover:bg-green-500/30 transition-colors">
                  <MessageSquare className="h-6 w-6 text-green-300" />
                </div>
                <div className="text-right">
                  <Badge className="bg-green-500/20 text-green-300 border-green-500/30">
                    Active
                  </Badge>
                </div>
              </div>
              <div>
                <p className="text-gray-400 text-sm mb-1">Conversations</p>
                <p className="text-3xl font-bold text-white">
                  {contacts.reduce((sum, c) => sum + c.conversations.length, 0)}
                </p>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-br from-blue-900/50 to-blue-800/30 backdrop-blur-xl border border-blue-500/20 hover:border-blue-400/40 transition-all duration-300 group hidden lg:block">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="bg-blue-500/20 p-3 rounded-xl group-hover:bg-blue-500/30 transition-colors">
                  <TrendingUp className="h-6 w-6 text-blue-300" />
                </div>
                <div className="text-right">
                  <Badge className="bg-blue-500/20 text-blue-300 border-blue-500/30">
                    Excellent
                  </Badge>
                </div>
              </div>
              <div>
                <p className="text-gray-400 text-sm mb-1">Engagement</p>
                <p className="text-3xl font-bold text-white">92%</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* AI Insights Banner */}
        <Card className="bg-gradient-to-r from-purple-600 to-pink-600 text-white mb-8 border-0 shadow-2xl hover:shadow-purple-500/25 transition-all duration-300">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="bg-white/20 p-3 rounded-xl backdrop-blur-sm">
                  <Flame className="h-6 w-6 animate-pulse" />
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-1">AI Insights Ready</h3>
                  <p className="text-white/80">
                    {contacts.length > 0 ? `${Math.min(3, contacts.length)} contacts need attention` : 'Add contacts to get AI insights'}
                  </p>
                </div>
              </div>
              <Button 
                variant="ghost" 
                className="text-white hover:bg-white/20 rounded-xl px-4 py-2 font-semibold"
                disabled={contacts.length === 0}
              >
                View All
                <ArrowUpRight className="h-4 w-4 ml-2" />
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Enhanced Search and Filter Section */}
        <div className="mb-8 space-y-6">
          <div className="flex gap-4 items-center">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <Input
                type="text"
                placeholder="Search contacts by name, company, or notes..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-12 pr-4 py-4 bg-black/20 backdrop-blur-xl border border-white/10 text-white placeholder:text-gray-400 focus:border-purple-400/50 rounded-xl text-lg"
              />
            </div>
            <div className="flex gap-2">
              <Button
                variant={viewMode === 'grid' ? 'default' : 'ghost'}
                size="icon"
                onClick={() => setViewMode('grid')}
                className={`rounded-xl transition-all duration-200 ${
                  viewMode === 'grid' 
                    ? 'bg-purple-600 hover:bg-purple-700 text-white' 
                    : 'text-gray-300 hover:text-white hover:bg-white/10'
                }`}
              >
                <LayoutGrid className="h-5 w-5" />
              </Button>
              <Button
                variant={viewMode === 'list' ? 'default' : 'ghost'}
                size="icon"
                onClick={() => setViewMode('list')}
                className={`rounded-xl transition-all duration-200 ${
                  viewMode === 'list' 
                    ? 'bg-purple-600 hover:bg-purple-700 text-white' 
                    : 'text-gray-300 hover:text-white hover:bg-white/10'
                }`}
              >
                <List className="h-5 w-5" />
              </Button>
            </div>
          </div>
          
          {/* Enhanced Filter Pills */}
          <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-twitch">
            {[
              { key: 'all', label: 'All Contacts', icon: Users },
              { key: 'friend', label: 'Friends', icon: Heart },
              { key: 'colleague', label: 'Colleagues', icon: Briefcase },
              { key: 'family', label: 'Family', icon: Users },
              { key: 'networking', label: 'Network', icon: Network }
            ].map(({ key, label, icon: Icon }) => (
              <Button
                key={key}
                variant={filterBy === key ? 'default' : 'outline'}
                size="sm"
                onClick={() => setFilterBy(key)}
                className={`rounded-full whitespace-nowrap px-6 py-2 font-semibold transition-all duration-200 ${
                  filterBy === key
                    ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white border-0 shadow-lg'
                    : 'bg-black/20 backdrop-blur-xl text-gray-300 border-white/10 hover:border-purple-400/50 hover:text-white hover:bg-white/10'
                }`}
              >
                <Icon className="h-4 w-4 mr-2" />
                {label}
              </Button>
            ))}
          </div>
        </div>

        {/* Contacts Grid/List */}
        {filteredContacts.length === 0 ? (
          <Card className="text-center py-16 bg-black/20 backdrop-blur-xl border border-white/10 rounded-2xl">
            <CardContent>
              <div className="relative inline-block mb-6">
                <div className="bg-gradient-to-r from-purple-600 to-pink-600 w-24 h-24 rounded-2xl flex items-center justify-center mx-auto shadow-2xl">
                  <Users className="h-12 w-12 text-white" />
                </div>
                <div className="absolute -top-2 -right-2 w-8 h-8 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center">
                  <Sparkles className="h-4 w-4 text-white" />
                </div>
              </div>
              <h3 className="text-2xl font-bold mb-3 text-white">
                {searchQuery ? 'No contacts found' : 'Start Building Connections'}
              </h3>
              <p className="text-gray-400 mb-8 max-w-md mx-auto leading-relaxed">
                {searchQuery 
                  ? 'Try adjusting your search terms or browse all contacts' 
                  : 'Transform your relationships with AI-powered insights. Add your first contact to begin!'
                }
              </p>
              {!searchQuery && (
                <Button 
                  onClick={() => setIsAddingContact(true)}
                  size="lg"
                  className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold px-8 py-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200"
                >
                  <Plus className="h-5 w-5 mr-2" />
                  Add Your First Contact
                </Button>
              )}
            </CardContent>
          </Card>
        ) : (
          <div className={viewMode === 'grid' 
            ? "grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6" 
            : "space-y-4"
          }>
            {filteredContacts.map((contact, index) => (
              <div 
                key={contact.id} 
                className="fade-in transform hover:scale-[1.02] transition-all duration-200" 
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <ContactCard
                  contact={contact}
                  onClick={() => setSelectedContact(contact)}
                />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}