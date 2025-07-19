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
  Trash2
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
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Button variant="ghost" onClick={onBack} className="flex items-center gap-2">
          <ArrowLeft className="h-4 w-4" />
          Back to Contacts
        </Button>
        <Button variant="destructive" size="sm" onClick={() => onDelete(contact.id)}>
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>

      <Card>
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="text-3xl">{contact.name}</CardTitle>
              <CardDescription className="flex items-center gap-4 mt-2">
                <span className="flex items-center gap-1">
                  <User className="h-4 w-4" />
                  {contact.relationship}
                </span>
                <span className="flex items-center gap-1">
                  <MapPin className="h-4 w-4" />
                  Met at {contact.whereWeMet}
                </span>
                <span className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  {format(new Date(contact.firstMetDate), 'MMM d, yyyy')}
                </span>
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div>
              <h3 className="font-semibold mb-2">How we met</h3>
              <p className="text-muted-foreground">{contact.howWeMet}</p>
            </div>
            
            {contact.notes && (
              <div>
                <h3 className="font-semibold mb-2">Notes</h3>
                <p className="text-muted-foreground whitespace-pre-wrap">{contact.notes}</p>
              </div>
            )}

            <div>
              <h3 className="font-semibold mb-2">Tags</h3>
              <div className="flex flex-wrap gap-2">
                {contact.tags.map((tag, index) => (
                  <Badge key={index} variant="secondary">
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* AI Insights */}
      {aiInsights && aiInsights.length > 0 && (
        <Card className="border-blue-200 bg-blue-50/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Brain className="h-5 w-5 text-blue-600" />
              AI Insights
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {aiInsights.map((insight, index) => (
                <li key={index} className="flex items-start gap-2">
                  <span className="text-blue-600 mt-1">•</span>
                  <span className="text-sm">{insight}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}

      {/* Conversations */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle className="flex items-center gap-2">
              <MessageSquare className="h-5 w-5" />
              Conversations
            </CardTitle>
            <Button 
              size="sm" 
              onClick={() => setIsAddingConversation(true)}
              disabled={isAddingConversation}
            >
              <Plus className="h-4 w-4 mr-1" />
              Add
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {isAddingConversation && (
            <div className="mb-4 space-y-3 p-4 border rounded-lg">
              <Textarea
                placeholder="What did you talk about?"
                value={conversationNotes}
                onChange={(e) => setConversationNotes(e.target.value)}
                rows={3}
              />
              <div className="flex gap-2">
                <Button size="sm" onClick={handleAddConversation}>
                  Save
                </Button>
                <Button 
                  size="sm" 
                  variant="outline" 
                  onClick={() => {
                    setIsAddingConversation(false);
                    setConversationNotes('');
                  }}
                >
                  Cancel
                </Button>
              </div>
            </div>
          )}
          
          <div className="space-y-3">
            {contact.conversations.length === 0 ? (
              <p className="text-muted-foreground text-sm">No conversations recorded yet.</p>
            ) : (
              contact.conversations.map((conversation) => (
                <div key={conversation.id} className="p-3 border rounded-lg">
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-sm text-muted-foreground">
                      {formatDistanceToNow(new Date(conversation.date), { addSuffix: true })}
                    </span>
                    <Badge variant="outline" className="text-xs">
                      {conversation.mood}
                    </Badge>
                  </div>
                  <p className="text-sm">{conversation.summary}</p>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>

      {/* Reminders */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Reminders
            </CardTitle>
            <Button 
              size="sm" 
              onClick={() => setIsAddingReminder(true)}
              disabled={isAddingReminder}
            >
              <Plus className="h-4 w-4 mr-1" />
              Add
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {isAddingReminder && (
            <div className="mb-4 space-y-3 p-4 border rounded-lg">
              <div>
                <Label htmlFor="reminder-title">Title</Label>
                <Input
                  id="reminder-title"
                  placeholder="Follow up about job opportunity"
                  value={reminderTitle}
                  onChange={(e) => setReminderTitle(e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="reminder-date">Date</Label>
                <Input
                  id="reminder-date"
                  type="date"
                  value={reminderDate}
                  onChange={(e) => setReminderDate(e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="reminder-description">Description (optional)</Label>
                <Textarea
                  id="reminder-description"
                  placeholder="Additional details..."
                  value={reminderDescription}
                  onChange={(e) => setReminderDescription(e.target.value)}
                  rows={2}
                />
              </div>
              <div className="flex gap-2">
                <Button size="sm" onClick={handleAddReminder}>
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
                >
                  Cancel
                </Button>
              </div>
            </div>
          )}
          
          <div className="space-y-3">
            {contact.reminders.length === 0 ? (
              <p className="text-muted-foreground text-sm">No reminders set.</p>
            ) : (
              contact.reminders.map((reminder) => (
                <div key={reminder.id} className="p-3 border rounded-lg">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-medium">{reminder.title}</h4>
                      {reminder.description && (
                        <p className="text-sm text-muted-foreground mt-1">{reminder.description}</p>
                      )}
                    </div>
                    <Badge 
                      variant={reminder.completed ? "secondary" : "default"}
                      className="text-xs"
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