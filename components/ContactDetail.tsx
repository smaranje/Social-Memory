'use client';

import { useState } from 'react';
import { Contact, Conversation, Reminder, PersonalDetail } from '@/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  ArrowLeft, 
  Calendar, 
  MessageSquare, 
  User, 
  MapPin, 
  Clock, 
  Brain,
  Plus,
  Edit,
  Trash2,
  ChevronLeft,
  MoreVertical,
  Bell,
  Sparkles,
  Circle,
  Building2,
  Heart,
  Briefcase,
  Users,
  Network,
  UserCircle,
  Save,
  X,
} from 'lucide-react';
import { format, formatDistanceToNow } from 'date-fns';

interface ContactDetailProps {
  contact: Contact;
  onBack: () => void;
  onUpdate: (contact: Contact) => void;
  onDelete: (id: string) => void;
  aiInsights?: string[];
}

const relationshipIcons = {
  friend: Heart,
  colleague: Briefcase,
  family: Users,
  networking: Network,
  acquaintance: UserCircle,
  romantic: Heart,
  other: User
};

const relationshipColors = {
  friend: 'from-pink-500 to-rose-500',
  colleague: 'from-blue-500 to-indigo-500',
  family: 'from-purple-500 to-violet-500',
  networking: 'from-green-500 to-emerald-500',
  acquaintance: 'from-gray-500 to-slate-500',
  romantic: 'from-red-500 to-pink-500',
  other: 'from-amber-500 to-orange-500'
};

export function ContactDetail({ contact, onBack, onUpdate, onDelete, aiInsights }: ContactDetailProps) {
  const [isAddingConversation, setIsAddingConversation] = useState(false);
  const [conversationNotes, setConversationNotes] = useState('');
  const [isAddingReminder, setIsAddingReminder] = useState(false);
  const [reminderTitle, setReminderTitle] = useState('');
  const [reminderDate, setReminderDate] = useState('');
  const [reminderDescription, setReminderDescription] = useState('');

  const RelationshipIcon = relationshipIcons[contact.relationship] || User;
  const gradientColor = relationshipColors[contact.relationship] || 'from-gray-500 to-slate-500';

  const handleAddConversation = () => {
    if (!conversationNotes.trim()) return;
    
    const newConversation: Conversation = {
      id: Date.now().toString(),
      contactId: contact.id,
      date: new Date().toISOString(),
      summary: conversationNotes,
      topics: [],
      promises: [],
      mood: 'neutral',
    };
    
    const updatedContact = {
      ...contact,
      conversations: [...contact.conversations, newConversation],
      lastContactDate: newConversation.date,
      updatedAt: new Date().toISOString(),
    };
    
    onUpdate(updatedContact);
    setConversationNotes('');
    setIsAddingConversation(false);
  };

  const handleAddReminder = () => {
    if (!reminderTitle.trim() || !reminderDate) return;
    
    const newReminder: Reminder = {
      id: Date.now().toString(),
      contactId: contact.id,
      date: reminderDate,
      title: reminderTitle,
      description: reminderDescription,
      type: 'follow-up',
      completed: false,
    };
    
    const updatedContact = {
      ...contact,
      reminders: [...contact.reminders, newReminder],
      updatedAt: new Date().toISOString(),
    };
    
    onUpdate(updatedContact);
    setReminderTitle('');
    setReminderDate('');
    setReminderDescription('');
    setIsAddingReminder(false);
  };

  const upcomingReminders = contact.reminders.filter(r => !r.completed);

  return (
    <div className="space-y-6 pb-8">
      {/* Header */}
      <div className="flex items-center justify-between bg-white/80 backdrop-blur-sm -mx-4 px-4 py-4 sticky top-0 z-10 border-b border-white/20 shadow-sm">
        <Button 
          variant="ghost" 
          onClick={onBack} 
          className="text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-xl"
        >
          <ChevronLeft className="h-5 w-5 mr-1" />
          Back to Contacts
        </Button>
        <Button 
          variant="ghost" 
          size="icon"
          className="text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-xl"
          onClick={() => {
            if (confirm('Are you sure you want to delete this contact?')) {
              onDelete(contact.id);
            }
          }}
        >
          <Trash2 className="h-5 w-5" />
        </Button>
      </div>

      {/* Contact Header Card */}
      <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl overflow-hidden">
        <CardHeader className={`bg-gradient-to-r ${gradientColor} text-white relative overflow-hidden`}>
          <div className="absolute inset-0 bg-black/10"></div>
          <div className="relative">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-4">
                <div className="bg-white/20 p-4 rounded-2xl backdrop-blur-sm">
                  <RelationshipIcon className="h-8 w-8" />
                </div>
                <div>
                  <CardTitle className="text-3xl font-bold mb-2">{contact.name}</CardTitle>
                  <div className="flex flex-wrap gap-4 text-sm text-white/90">
                    <span className="flex items-center gap-2">
                      <RelationshipIcon className="h-4 w-4" />
                      {contact.relationship}
                    </span>
                    {contact.company && (
                      <span className="flex items-center gap-2">
                        <Building2 className="h-4 w-4" />
                        {contact.company}
                      </span>
                    )}
                    <span className="flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      Met {format(new Date(contact.firstMetDate), 'MMM d, yyyy')}
                    </span>
                  </div>
                </div>
              </div>
              <Badge className="bg-white/20 text-white border-0 text-sm px-3 py-2">
                {contact.conversations.length} conversations
              </Badge>
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="p-6 space-y-6">
          {/* Where We Met */}
          <div className="bg-blue-50 p-4 rounded-xl">
            <div className="flex items-center gap-2 mb-2">
              <MapPin className="h-5 w-5 text-blue-600" />
              <h3 className="font-semibold text-gray-900">Where We Met</h3>
            </div>
            <p className="text-gray-700">{contact.whereWeMet}</p>
          </div>

          {/* How We Met */}
          {contact.howWeMet && (
            <div className="bg-purple-50 p-4 rounded-xl">
              <div className="flex items-center gap-2 mb-2">
                <Sparkles className="h-5 w-5 text-purple-600" />
                <h3 className="font-semibold text-gray-900">How We Met</h3>
              </div>
              <p className="text-gray-700">{contact.howWeMet}</p>
            </div>
          )}
          
          {/* Notes */}
          {contact.notes && (
            <div className="bg-green-50 p-4 rounded-xl">
              <div className="flex items-center gap-2 mb-2">
                <User className="h-5 w-5 text-green-600" />
                <h3 className="font-semibold text-gray-900">Notes</h3>
              </div>
              <p className="text-gray-700 whitespace-pre-wrap">{contact.notes}</p>
            </div>
          )}

          {/* Tags */}
          {contact.tags.length > 0 && (
            <div>
                             <div className="flex items-center gap-2 mb-3">
                 <div className="bg-orange-100 p-2 rounded-lg">
                   <User className="h-4 w-4 text-orange-600" />
                 </div>
                 <h3 className="font-semibold text-gray-900">Tags</h3>
               </div>
              <div className="flex flex-wrap gap-2">
                {contact.tags.map((tag, index) => (
                  <Badge 
                    key={index} 
                    className="bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-800 border-0 px-3 py-1 hover:from-blue-200 hover:to-indigo-200 transition-colors"
                  >
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* AI Insights */}
      {aiInsights && aiInsights.length > 0 && (
        <Card className="bg-gradient-to-r from-purple-500 to-pink-500 border-0 shadow-xl text-white overflow-hidden">
          <CardHeader>
            <CardTitle className="flex items-center gap-3">
              <div className="bg-white/20 p-2 rounded-lg">
                <Brain className="h-6 w-6" />
              </div>
              AI Insights
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3">
              {aiInsights.map((insight, index) => (
                <li key={index} className="flex items-start gap-3">
                  <Sparkles className="h-4 w-4 mt-0.5 flex-shrink-0" />
                  <span className="text-white/95">{insight}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}

      {/* Conversations */}
      <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl">
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle className="flex items-center gap-3">
              <div className="bg-gradient-to-r from-green-500 to-emerald-500 p-2 rounded-lg">
                <MessageSquare className="h-6 w-6 text-white" />
              </div>
              Conversations
            </CardTitle>
            <Button 
              type="button"
              variant="secondary"
              size="sm" 
              onClick={() => setIsAddingConversation(true)}
              disabled={isAddingConversation}
              className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-200"
            >
              <Plus className="h-4 w-4 mr-1" />
              Add
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {isAddingConversation && (
            <div className="mb-6 space-y-4 p-4 bg-gray-50 rounded-xl border border-gray-200">
              <Textarea
                placeholder="What did you talk about? Any important details or follow-ups?"
                value={conversationNotes}
                onChange={(e) => setConversationNotes(e.target.value)}
                rows={4}
                className="bg-white border-0 shadow-inner text-gray-900 placeholder:text-gray-500 focus:ring-2 focus:ring-green-500/20 rounded-xl"
              />
              <div className="flex gap-3">
                <Button 
                  type="button"
                  variant="secondary"
                  size="sm" 
                  onClick={handleAddConversation}
                  className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white rounded-xl px-6"
                >
                  <Save className="h-4 w-4 mr-2" />
                  Save
                </Button>
                <Button 
                  type="button"
                  size="sm" 
                  variant="outline" 
                  onClick={() => {
                    setIsAddingConversation(false);
                    setConversationNotes('');
                  }}
                  className="bg-gray-100 hover:bg-gray-200 border-0 rounded-xl px-6"
                >
                  <X className="h-4 w-4 mr-2" />
                  Cancel
                </Button>
              </div>
            </div>
          )}
          
          <div className="space-y-4">
            {contact.conversations.length === 0 ? (
              <div className="text-center py-12">
                <div className="bg-gradient-to-br from-gray-100 to-gray-200 p-4 rounded-xl w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                  <MessageSquare className="h-8 w-8 text-gray-500" />
                </div>
                <p className="text-gray-500 text-lg">No conversations recorded yet</p>
                <p className="text-gray-400 text-sm mt-1">Start tracking your interactions to build deeper relationships</p>
              </div>
            ) : (
              contact.conversations.map((conversation) => (
                <div key={conversation.id} className="bg-gray-50 p-4 rounded-xl border border-gray-200 hover:shadow-md transition-shadow">
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-sm text-gray-500 flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {formatDistanceToNow(new Date(conversation.date), { addSuffix: true })}
                    </span>
                  </div>
                  <p className="text-gray-700 whitespace-pre-wrap">{conversation.summary}</p>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>

      {/* Reminders */}
      <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl">
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle className="flex items-center gap-3">
              <div className="bg-gradient-to-r from-orange-500 to-red-500 p-2 rounded-lg">
                <Bell className="h-6 w-6 text-white" />
              </div>
              Reminders
            </CardTitle>
            <Button 
              type="button"
              variant="secondary"
              size="sm" 
              onClick={() => setIsAddingReminder(true)}
              disabled={isAddingReminder}
              className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-200"
            >
              <Plus className="h-4 w-4 mr-1" />
              Add
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {isAddingReminder && (
            <div className="mb-6 space-y-6 p-6 bg-white/80 backdrop-blur-sm rounded-2xl border-0 shadow-lg">
              <div className="space-y-4">
                <div className="space-y-3">
                  <Label htmlFor="reminderTitle" className="text-gray-900 font-semibold text-base">Title</Label>
                  <Input
                    id="reminderTitle"
                    placeholder="e.g., Follow up on project"
                    value={reminderTitle}
                    onChange={(e) => setReminderTitle(e.target.value)}
                    className="bg-white border shadow-sm text-gray-900 placeholder:text-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 rounded-xl h-12 text-base"
                  />
                </div>
                <div className="space-y-3">
                  <Label htmlFor="reminderDate" className="text-gray-900 font-semibold text-base">Date</Label>
                  <div className="relative">
                    <Input
                      id="reminderDate"
                      type="date"
                      value={reminderDate}
                      onChange={(e) => setReminderDate(e.target.value)}
                      className="bg-white border shadow-sm text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 rounded-xl h-12 text-base [&::-webkit-calendar-picker-indicator]:opacity-0 [&::-webkit-calendar-picker-indicator]:absolute [&::-webkit-calendar-picker-indicator]:right-3 [&::-webkit-calendar-picker-indicator]:w-5 [&::-webkit-calendar-picker-indicator]:h-5 [&::-webkit-calendar-picker-indicator]:cursor-pointer"
                      min={new Date().toISOString().split('T')[0]}
                    />
                    <Calendar className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none" />
                  </div>
                </div>
              </div>
              <div className="space-y-3">
                <Label htmlFor="reminderDescription" className="text-gray-900 font-semibold text-base">Description (optional)</Label>
                <Textarea
                  id="reminderDescription"
                  placeholder="Additional details..."
                  value={reminderDescription}
                  onChange={(e) => setReminderDescription(e.target.value)}
                  rows={4}
                  className="bg-white border shadow-sm text-gray-900 placeholder:text-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 rounded-xl resize-none"
                />
              </div>
              <div className="flex flex-col-reverse sm:flex-row gap-3 pt-4 border-t border-gray-200">
                <Button 
                  type="button"
                  variant="outline" 
                  onClick={() => {
                    setIsAddingReminder(false);
                    setReminderTitle('');
                    setReminderDate('');
                    setReminderDescription('');
                  }}
                  className="flex-1 sm:flex-none bg-gray-100 text-gray-700 hover:bg-gray-200 border-0 rounded-xl h-12 px-6 font-semibold transition-all duration-200"
                >
                  <X className="h-4 w-4 mr-2" />
                  Cancel
                </Button>
                <Button 
                  type="button"
                  onClick={handleAddReminder}
                  disabled={!reminderTitle.trim() || !reminderDate}
                  className="flex-1 sm:flex-none bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white rounded-xl h-12 px-6 font-semibold shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Save className="h-4 w-4 mr-2" />
                  Save
                </Button>
              </div>
            </div>
          )}
          
          <div className="space-y-4">
            {upcomingReminders.length === 0 ? (
              <div className="text-center py-12">
                <div className="bg-gradient-to-br from-orange-100 to-red-100 p-4 rounded-xl w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                  <Bell className="h-8 w-8 text-orange-600" />
                </div>
                <p className="text-gray-500 text-lg">No upcoming reminders</p>
                <p className="text-gray-400 text-sm mt-1">Set reminders to stay connected with your contacts</p>
              </div>
            ) : (
              upcomingReminders.map((reminder) => (
                <div key={reminder.id} className="bg-orange-50 p-4 rounded-xl border border-orange-200 hover:shadow-md transition-shadow">
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-semibold text-gray-900">{reminder.title}</h4>
                    <span className="text-sm text-orange-600 flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      {format(new Date(reminder.date), 'MMM d, yyyy')}
                    </span>
                  </div>
                  {reminder.description && (
                    <p className="text-gray-700 text-sm">{reminder.description}</p>
                  )}
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}