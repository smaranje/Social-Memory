'use client';

import { Contact } from '@/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Calendar, 
  MessageSquare, 
  User, 
  MapPin, 
  Clock, 
  Sparkles,
  ArrowRight,
  Heart,
  Briefcase,
  Users,
  Network,
  UserCircle,
  MoreVertical,
  Circle
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
  friend: 'text-pink-500',
  colleague: 'text-blue-500',
  family: 'text-purple-500',
  networking: 'text-green-500',
  acquaintance: 'text-gray-500',
  romantic: 'text-red-500',
  other: 'text-amber-500'
};

export function ContactCard({ contact, onClick }: ContactCardProps) {
  const lastConversation = contact.conversations[contact.conversations.length - 1];
  const upcomingReminders = contact.reminders.filter(r => !r.completed && new Date(r.date) > new Date());
  const RelationshipIcon = relationshipIcons[contact.relationship] || User;
  const iconColor = relationshipColors[contact.relationship] || 'text-gray-500';
  
  // Calculate days since last contact
  const daysSinceContact = contact.lastContactDate 
    ? Math.floor((new Date().getTime() - new Date(contact.lastContactDate).getTime()) / (1000 * 60 * 60 * 24))
    : null;
  
  const needsAttention = daysSinceContact && daysSinceContact > 30;
  
  return (
    <Card 
      className="group relative bg-[hsl(var(--twitch-bg-secondary))] border-[hsl(var(--twitch-border))] hover:border-[hsl(var(--twitch-purple))] transition-all duration-200 cursor-pointer overflow-hidden hover:translate-y-[-2px] hover:shadow-lg"
      onClick={onClick}
    >
      {/* Live indicator style status */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-[hsl(var(--twitch-bg-tertiary))]">
        {needsAttention && (
          <div className="h-full bg-orange-500 animate-pulse" />
        )}
        {!needsAttention && upcomingReminders.length > 0 && (
          <div className="h-full bg-[hsl(var(--twitch-purple))]" />
        )}
      </div>
      
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start">
          <div className="flex items-start gap-3">
            <div className={`p-2 rounded ${iconColor}`}>
              <RelationshipIcon className="h-5 w-5" />
            </div>
            <div className="flex-1">
              <CardTitle className="text-lg font-semibold text-white group-hover:text-[hsl(var(--twitch-purple))] transition-colors line-clamp-1">
                {contact.name}
              </CardTitle>
              <CardDescription className="flex items-center gap-2 mt-1 text-[hsl(var(--twitch-text-muted))] text-sm">
                <MapPin className="h-3 w-3" />
                <span className="line-clamp-1">{contact.whereWeMet}</span>
              </CardDescription>
            </div>
          </div>
          <Button 
            variant="ghost" 
            size="icon"
            className="h-8 w-8 text-[hsl(var(--twitch-text-muted))] hover:text-white hover:bg-[hsl(var(--twitch-bg-tertiary))] opacity-0 group-hover:opacity-100 transition-opacity"
            onClick={(e) => {
              e.stopPropagation();
              // Handle more options
            }}
          >
            <MoreVertical className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-3">
        {/* Last conversation - Twitch style */}
        {lastConversation && (
          <div className="flex items-center justify-between bg-[hsl(var(--twitch-bg))] rounded p-2">
            <div className="flex items-center gap-2 text-sm">
              <Circle className="h-2 w-2 fill-current text-green-500" />
              <span className="text-[hsl(var(--twitch-text-secondary))]">Last talked</span>
            </div>
            <span className="text-sm font-medium text-[hsl(var(--twitch-text-secondary))]">
              {formatDistanceToNow(new Date(lastConversation.date), { addSuffix: true })}
            </span>
          </div>
        )}
        
        {/* Reminders - Twitch notification style */}
        {upcomingReminders.length > 0 && (
          <div className="bg-[hsl(var(--twitch-purple))] bg-opacity-20 border border-[hsl(var(--twitch-purple))] border-opacity-50 rounded p-2 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-[hsl(var(--twitch-purple))]" />
              <span className="text-sm font-medium text-[hsl(var(--twitch-purple))]">
                {upcomingReminders.length} reminder{upcomingReminders.length > 1 ? 's' : ''}
              </span>
            </div>
            <Badge variant="secondary" className="bg-[hsl(var(--twitch-purple))] text-white border-0 text-xs px-2 py-0">
              Active
            </Badge>
          </div>
        )}
        
        {/* Tags - Twitch style */}
        <div className="flex flex-wrap gap-1.5">
          {contact.tags.slice(0, 3).map((tag, index) => (
            <Badge 
              key={index} 
              variant="outline" 
              className="text-xs bg-[hsl(var(--twitch-bg-tertiary))] text-[hsl(var(--twitch-text-secondary))] border-[hsl(var(--twitch-border))] hover:bg-[hsl(var(--twitch-bg))] hover:text-white transition-colors px-2 py-0.5"
            >
              {tag}
            </Badge>
          ))}
          {contact.tags.length > 3 && (
            <Badge 
              variant="outline" 
              className="text-xs bg-transparent text-[hsl(var(--twitch-text-muted))] border-[hsl(var(--twitch-border))] px-2 py-0.5"
            >
              +{contact.tags.length - 3}
            </Badge>
          )}
        </div>
        
        {/* AI Insight indicator - Twitch style */}
        {(needsAttention || upcomingReminders.length > 0) && (
          <div className="flex items-center gap-2 pt-2 border-t border-[hsl(var(--twitch-border))]">
            <Sparkles className="h-4 w-4 text-[hsl(var(--twitch-purple))] twitch-pulse" />
            <span className="text-xs text-[hsl(var(--twitch-text-muted))]">AI insights available</span>
          </div>
        )}
      </CardContent>
      
      {/* Hover effect overlay */}
      <div className="absolute inset-0 bg-[hsl(var(--twitch-purple))] opacity-0 group-hover:opacity-5 transition-opacity duration-200 pointer-events-none" />
    </Card>
  );
}