'use client';

import { Contact } from '@/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar, MessageSquare, User, MapPin, Clock } from 'lucide-react';
import { format, formatDistanceToNow } from 'date-fns';

interface ContactCardProps {
  contact: Contact;
  onClick: () => void;
}

export function ContactCard({ contact, onClick }: ContactCardProps) {
  const lastConversation = contact.conversations[contact.conversations.length - 1];
  const upcomingReminders = contact.reminders.filter(r => !r.completed && new Date(r.date) > new Date());
  
  return (
    <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={onClick}>
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-xl">{contact.name}</CardTitle>
            <CardDescription className="flex items-center gap-2 mt-1">
              <User className="h-3 w-3" />
              {contact.relationship}
            </CardDescription>
          </div>
          <Badge variant={contact.relationship === 'friend' ? 'default' : 'secondary'}>
            {contact.relationship}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <MapPin className="h-3 w-3" />
          Met at {contact.whereWeMet}
        </div>
        
        {lastConversation && (
          <div className="flex items-center gap-2 text-sm">
            <MessageSquare className="h-3 w-3" />
            <span className="text-muted-foreground">Last talked:</span>
            <span>{formatDistanceToNow(new Date(lastConversation.date), { addSuffix: true })}</span>
          </div>
        )}
        
        {upcomingReminders.length > 0 && (
          <div className="flex items-center gap-2 text-sm">
            <Clock className="h-3 w-3 text-orange-500" />
            <span className="text-orange-600">{upcomingReminders.length} upcoming reminder{upcomingReminders.length > 1 ? 's' : ''}</span>
          </div>
        )}
        
        <div className="flex flex-wrap gap-1 mt-3">
          {contact.tags.slice(0, 3).map((tag, index) => (
            <Badge key={index} variant="outline" className="text-xs">
              {tag}
            </Badge>
          ))}
          {contact.tags.length > 3 && (
            <Badge variant="outline" className="text-xs">
              +{contact.tags.length - 3} more
            </Badge>
          )}
        </div>
      </CardContent>
    </Card>
  );
}