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
  Circle
} from 'lucide-react';
import { format, formatDistanceToNow } from 'date-fns';

interface ContactDetailProps {
  contact: Contact;
  onBack: () => void;
  onUpdate: (contact: Contact) => void;
  onDelete: (id: string) => void;
  aiInsights?: string[];
}

export function ContactDetail({ contact, onBack, onUpdate, onDelete, aiInsights }: ContactDetailProps) {
  const [isAddingConversation, setIsAddingConversation] = useState(false);
  const [conversationNotes, setConversationNotes] = useState('');
  const [isAddingReminder, setIsAddingReminder] = useState(false);
  const [reminderTitle, setReminderTitle] = useState('');
  const [reminderDate, setReminderDate] = useState('');
  const [reminderDescription, setReminderDescription] = useState('');

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

  return (
    <div className="space-y-4 pb-20">
      {/* Mobile-optimized header */}
      <div className="flex items-center justify-between bg-[hsl(var(--twitch-bg-secondary))] -mx-4 px-4 py-3 sticky top-0 z-10 border-b border-[hsl(var(--twitch-border))]">
        <Button 
          variant="ghost" 
          onClick={onBack} 
          className="text-[hsl(var(--twitch-text-secondary))] hover:text-white hover:bg-[hsl(var(--twitch-bg-tertiary))] -ml-2"
        >
          <ChevronLeft className="h-5 w-5 mr-1" />
          Back
        </Button>
        <Button 
          variant="ghost" 
          size="icon"
          className="text-[hsl(var(--twitch-text-secondary))] hover:text-red-500 hover:bg-[hsl(var(--twitch-bg-tertiary))]"
          onClick={() => {
            if (confirm('Are you sure you want to delete this contact?')) {
              onDelete(contact.id);
            }
          }}
        >
          <Trash2 className="h-5 w-5" />
        </Button>
      </div>

      {/* Contact header card */}
      <Card className="bg-[hsl(var(--twitch-bg-secondary))] border-[hsl(var(--twitch-border))]">
        <CardHeader>
          <div className="space-y-3">
            <div>
              <CardTitle className="text-2xl text-white mb-2">{contact.name}</CardTitle>
              <div className="flex flex-wrap gap-3 text-sm">
                <span className="flex items-center gap-1 text-[hsl(var(--twitch-text-secondary))]">
                  <User className="h-4 w-4 text-[hsl(var(--twitch-purple))]" />
                  {contact.relationship}
                </span>
                <span className="flex items-center gap-1 text-[hsl(var(--twitch-text-secondary))]">
                  <MapPin className="h-4 w-4 text-[hsl(var(--twitch-purple))]" />
                  {contact.whereWeMet}
                </span>
                <span className="flex items-center gap-1 text-[hsl(var(--twitch-text-secondary))]">
                  <Calendar className="h-4 w-4 text-[hsl(var(--twitch-purple))]" />
                  {format(new Date(contact.firstMetDate), 'MMM d, yyyy')}
                </span>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h3 className="font-semibold mb-2 text-white text-sm uppercase tracking-wide">How we met</h3>
            <p className="text-[hsl(var(--twitch-text-secondary))] text-sm">{contact.howWeMet}</p>
          </div>
          
          {contact.notes && (
            <div>
              <h3 className="font-semibold mb-2 text-white text-sm uppercase tracking-wide">Notes</h3>
              <p className="text-[hsl(var(--twitch-text-secondary))] whitespace-pre-wrap text-sm">{contact.notes}</p>
            </div>
          )}

          <div>
            <h3 className="font-semibold mb-2 text-white text-sm uppercase tracking-wide">Tags</h3>
            <div className="flex flex-wrap gap-2">
              {contact.tags.map((tag, index) => (
                <Badge 
                  key={index} 
                  variant="secondary"
                  className="bg-[hsl(var(--twitch-bg-tertiary))] text-[hsl(var(--twitch-text-secondary))] border-[hsl(var(--twitch-border))]"
                >
                  {tag}
                </Badge>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* AI Insights - Twitch style */}
      {aiInsights && aiInsights.length > 0 && (
        <Card className="bg-[hsl(var(--twitch-purple))] border-0 twitch-glow">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-white">
              <Sparkles className="h-5 w-5 twitch-bounce" />
              AI Insights
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {aiInsights.map((insight, index) => (
                <li key={index} className="flex items-start gap-2">
                  <Circle className="h-2 w-2 fill-current text-white mt-1.5 flex-shrink-0" />
                  <span className="text-sm text-white/90">{insight}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}

      {/* Conversations */}
      <Card className="bg-[hsl(var(--twitch-bg-secondary))] border-[hsl(var(--twitch-border))]">
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle className="flex items-center gap-2 text-white">
              <MessageSquare className="h-5 w-5 text-[hsl(var(--twitch-purple))]" />
              Conversations
            </CardTitle>
            <Button 
              size="sm" 
              onClick={() => setIsAddingConversation(true)}
              disabled={isAddingConversation}
              className="btn-twitch"
            >
              <Plus className="h-4 w-4 mr-1" />
              Add
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {isAddingConversation && (
            <div className="mb-4 space-y-3 p-4 bg-[hsl(var(--twitch-bg))] border border-[hsl(var(--twitch-border))] rounded">
              <Textarea
                placeholder="What did you talk about?"
                value={conversationNotes}
                onChange={(e) => setConversationNotes(e.target.value)}
                rows={3}
                className="bg-[hsl(var(--twitch-bg-tertiary))] border-[hsl(var(--twitch-border))] text-white placeholder:text-[hsl(var(--twitch-text-muted))]"
              />
              <div className="flex gap-2">
                <Button size="sm" onClick={handleAddConversation} className="btn-twitch">
                  Save
                </Button>
                <Button 
                  size="sm" 
                  variant="outline" 
                  onClick={() => {
                    setIsAddingConversation(false);
                    setConversationNotes('');
                  }}
                  className="btn-twitch-secondary"
                >
                  Cancel
                </Button>
              </div>
            </div>
          )}
          
          <div className="space-y-3">
            {contact.conversations.length === 0 ? (
              <p className="text-[hsl(var(--twitch-text-muted))] text-sm text-center py-8">No conversations recorded yet.</p>
            ) : (
              contact.conversations.map((conversation) => (
                <div key={conversation.id} className="p-3 bg-[hsl(var(--twitch-bg))] border border-[hsl(var(--twitch-border))] rounded hover:border-[hsl(var(--twitch-purple))] transition-colors">
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-sm text-[hsl(var(--twitch-text-secondary))]">
                      {formatDistanceToNow(new Date(conversation.date), { addSuffix: true })}
                    </span>
                    <Badge variant="outline" className="text-xs bg-[hsl(var(--twitch-bg-tertiary))] text-[hsl(var(--twitch-text-secondary))] border-[hsl(var(--twitch-border))]">
                      {conversation.mood}
                    </Badge>
                  </div>
                  <p className="text-sm text-white">{conversation.summary}</p>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>

      {/* Reminders */}
      <Card className="bg-[hsl(var(--twitch-bg-secondary))] border-[hsl(var(--twitch-border))]">
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle className="flex items-center gap-2 text-white">
              <Bell className="h-5 w-5 text-[hsl(var(--twitch-purple))]" />
              Reminders
            </CardTitle>
            <Button 
              size="sm" 
              onClick={() => setIsAddingReminder(true)}
              disabled={isAddingReminder}
              className="btn-twitch"
            >
              <Plus className="h-4 w-4 mr-1" />
              Add
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {isAddingReminder && (
            <div className="mb-4 space-y-3 p-4 bg-[hsl(var(--twitch-bg))] border border-[hsl(var(--twitch-border))] rounded">
              <div>
                <Label htmlFor="reminder-title" className="text-[hsl(var(--twitch-text-secondary))]">Title</Label>
                <Input
                  id="reminder-title"
                  placeholder="Follow up about job opportunity"
                  value={reminderTitle}
                  onChange={(e) => setReminderTitle(e.target.value)}
                  className="bg-[hsl(var(--twitch-bg-tertiary))] border-[hsl(var(--twitch-border))] text-white placeholder:text-[hsl(var(--twitch-text-muted))]"
                />
              </div>
              <div>
                <Label htmlFor="reminder-date" className="text-[hsl(var(--twitch-text-secondary))]">Date</Label>
                <Input
                  id="reminder-date"
                  type="date"
                  value={reminderDate}
                  onChange={(e) => setReminderDate(e.target.value)}
                  className="bg-[hsl(var(--twitch-bg-tertiary))] border-[hsl(var(--twitch-border))] text-white"
                />
              </div>
              <div>
                <Label htmlFor="reminder-description" className="text-[hsl(var(--twitch-text-secondary))]">Description (optional)</Label>
                <Textarea
                  id="reminder-description"
                  placeholder="Additional details..."
                  value={reminderDescription}
                  onChange={(e) => setReminderDescription(e.target.value)}
                  rows={2}
                  className="bg-[hsl(var(--twitch-bg-tertiary))] border-[hsl(var(--twitch-border))] text-white placeholder:text-[hsl(var(--twitch-text-muted))]"
                />
              </div>
              <div className="flex gap-2">
                <Button size="sm" onClick={handleAddReminder} className="btn-twitch">
                  Save
                </Button>
                <Button 
                  size="sm" 
                  variant="outline" 
                  onClick={() => {
                    setIsAddingReminder(false);
                    setReminderTitle('');
                    setReminderDate('');
                    setReminderDescription('');
                  }}
                  className="btn-twitch-secondary"
                >
                  Cancel
                </Button>
              </div>
            </div>
          )}
          
          <div className="space-y-3">
            {contact.reminders.length === 0 ? (
              <p className="text-[hsl(var(--twitch-text-muted))] text-sm text-center py-8">No reminders set.</p>
            ) : (
              contact.reminders.map((reminder) => (
                <div key={reminder.id} className="p-3 bg-[hsl(var(--twitch-bg))] border border-[hsl(var(--twitch-border))] rounded hover:border-[hsl(var(--twitch-purple))] transition-colors">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h4 className="font-medium text-white">{reminder.title}</h4>
                      {reminder.description && (
                        <p className="text-sm text-[hsl(var(--twitch-text-secondary))] mt-1">{reminder.description}</p>
                      )}
                    </div>
                    <Badge 
                      variant={reminder.completed ? "secondary" : "default"}
                      className={reminder.completed 
                        ? "text-xs bg-[hsl(var(--twitch-bg-tertiary))] text-[hsl(var(--twitch-text-muted))] border-[hsl(var(--twitch-border))]" 
                        : "text-xs bg-[hsl(var(--twitch-purple))] text-white border-0"
                      }
                    >
                      {format(new Date(reminder.date), 'MMM d')}
                    </Badge>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}