'use client';

import { Contact } from '@/types';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Calendar, 
  MessageSquare, 
  User, 
  MapPin, 
  Clock,
  Heart,
  Briefcase,
  Users,
  Network,
  UserCircle
} from 'lucide-react';
import { format, formatDistanceToNow } from 'date-fns';

interface ContactCardProps {
  contact: Contact;
  onClick: () => void;
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
  friend: 'bg-pink-100 text-pink-800',
  colleague: 'bg-blue-100 text-blue-800',
  family: 'bg-purple-100 text-purple-800',
  networking: 'bg-green-100 text-green-800',
  acquaintance: 'bg-gray-100 text-gray-800',
  romantic: 'bg-red-100 text-red-800',
  other: 'bg-slate-100 text-slate-800'
};

export function ContactCard({ contact, onClick }: ContactCardProps) {
  const IconComponent = relationshipIcons[contact.relationship] || User;
  const relationshipColor = relationshipColors[contact.relationship] || relationshipColors.other;
  
  const daysSinceLastContact = contact.lastContactDate 
    ? Math.floor((new Date().getTime() - new Date(contact.lastContactDate).getTime()) / (1000 * 60 * 60 * 24))
    : null;

  const upcomingReminders = contact.reminders.filter(r => !r.completed);
  const recentConversations = contact.conversations.length;

  return (
    <Card 
      className="cursor-pointer hover:shadow-md transition-shadow duration-200 border-l-4 border-l-blue-500"
      onClick={onClick}
    >
      <CardContent className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="bg-blue-100 p-2 rounded-lg">
              <IconComponent className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">{contact.name}</h3>
              {contact.company && (
                <p className="text-sm text-gray-500">{contact.company}</p>
              )}
            </div>
          </div>
          <Badge className={relationshipColor}>
            {contact.relationship}
          </Badge>
        </div>

        <div className="space-y-2 mb-4">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <MapPin className="h-4 w-4" />
            <span>{contact.whereWeMet}</span>
          </div>
          
          {contact.lastContactDate && (
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Clock className="h-4 w-4" />
              <span>
                Last contact: {formatDistanceToNow(new Date(contact.lastContactDate), { addSuffix: true })}
              </span>
            </div>
          )}
        </div>

        <div className="flex items-center justify-between">
          <div className="flex gap-4">
            {recentConversations > 0 && (
              <div className="flex items-center gap-1 text-sm text-gray-500">
                <MessageSquare className="h-4 w-4" />
                <span>{recentConversations}</span>
              </div>
            )}
            
            {upcomingReminders.length > 0 && (
              <div className="flex items-center gap-1 text-sm text-orange-600">
                <Calendar className="h-4 w-4" />
                <span>{upcomingReminders.length}</span>
              </div>
            )}
          </div>
          
          {daysSinceLastContact !== null && daysSinceLastContact > 30 && (
            <Badge variant="outline" className="text-xs">
              Follow up needed
            </Badge>
          )}
        </div>

        {contact.tags.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-1">
            {contact.tags.slice(0, 3).map((tag) => (
              <Badge key={tag} variant="secondary" className="text-xs">
                {tag}
              </Badge>
            ))}
            {contact.tags.length > 3 && (
              <Badge variant="secondary" className="text-xs">
                +{contact.tags.length - 3} more
              </Badge>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}