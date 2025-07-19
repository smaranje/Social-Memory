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
  friend: 'from-pink-500 to-rose-500',
  colleague: 'from-blue-500 to-indigo-500',
  family: 'from-purple-500 to-violet-500',
  networking: 'from-green-500 to-emerald-500',
  acquaintance: 'from-gray-500 to-slate-500',
  romantic: 'from-red-500 to-pink-500',
  other: 'from-amber-500 to-orange-500'
};

export function ContactCard({ contact, onClick }: ContactCardProps) {
  const lastConversation = contact.conversations[contact.conversations.length - 1];
  const upcomingReminders = contact.reminders.filter(r => !r.completed && new Date(r.date) > new Date());
  const RelationshipIcon = relationshipIcons[contact.relationship] || User;
  const gradientColor = relationshipColors[contact.relationship] || 'from-gray-500 to-slate-500';
  
  // Calculate days since last contact
  const daysSinceContact = contact.lastContactDate 
    ? Math.floor((new Date().getTime() - new Date(contact.lastContactDate).getTime()) / (1000 * 60 * 60 * 24))
    : null;
  
  const needsAttention = daysSinceContact && daysSinceContact > 30;
  
  return (
    <Card 
      className="group relative bg-white/60 backdrop-blur-md border-white/20 shadow-lg hover:shadow-2xl transform hover:scale-105 transition-all duration-300 cursor-pointer overflow-hidden"
      onClick={onClick}
    >
      {/* Gradient accent bar */}
      <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${gradientColor}`} />
      
      {/* Attention indicator */}
      {needsAttention && (
        <div className="absolute top-4 right-4 bg-orange-500 text-white text-xs px-2 py-1 rounded-full flex items-center gap-1 animate-pulse">
          <Clock className="h-3 w-3" />
          Needs attention
        </div>
      )}
      
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start">
          <div className="flex items-start gap-3">
            <div className={`bg-gradient-to-r ${gradientColor} p-2 rounded-lg text-white shadow-lg`}>
              <RelationshipIcon className="h-5 w-5" />
            </div>
            <div>
              <CardTitle className="text-xl font-bold text-gray-800 group-hover:text-purple-600 transition-colors">
                {contact.name}
              </CardTitle>
              <CardDescription className="flex items-center gap-2 mt-1 text-gray-600">
                <MapPin className="h-3 w-3" />
                {contact.whereWeMet}
              </CardDescription>
            </div>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Last conversation with visual indicator */}
        {lastConversation && (
          <div className="flex items-center justify-between bg-gray-50 rounded-lg p-3">
            <div className="flex items-center gap-2 text-sm">
              <MessageSquare className="h-4 w-4 text-gray-500" />
              <span className="text-gray-600">Last talked</span>
            </div>
            <span className="text-sm font-medium text-gray-800">
              {formatDistanceToNow(new Date(lastConversation.date), { addSuffix: true })}
            </span>
          </div>
        )}
        
        {/* Reminders with better styling */}
        {upcomingReminders.length > 0 && (
          <div className="bg-orange-50 border border-orange-200 rounded-lg p-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-orange-600" />
              <span className="text-sm font-medium text-orange-800">
                {upcomingReminders.length} reminder{upcomingReminders.length > 1 ? 's' : ''}
              </span>
            </div>
            <Badge variant="secondary" className="bg-orange-100 text-orange-700 border-0">
              Upcoming
            </Badge>
          </div>
        )}
        
        {/* Tags with better design */}
        <div className="flex flex-wrap gap-2">
          {contact.tags.slice(0, 3).map((tag, index) => (
            <Badge 
              key={index} 
              variant="outline" 
              className="text-xs bg-purple-50 text-purple-700 border-purple-200 hover:bg-purple-100 transition-colors"
            >
              {tag}
            </Badge>
          ))}
          {contact.tags.length > 3 && (
            <Badge 
              variant="outline" 
              className="text-xs bg-gray-50 text-gray-600 border-gray-200"
            >
              +{contact.tags.length - 3} more
            </Badge>
          )}
        </div>
        
        {/* AI Insight hint */}
        {(needsAttention || upcomingReminders.length > 0) && (
          <div className="flex items-center gap-2 pt-2 border-t border-gray-100">
            <Sparkles className="h-4 w-4 text-purple-500" />
            <span className="text-xs text-gray-600">AI insights available</span>
          </div>
        )}
      </CardContent>
      
      {/* Hover effect overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-purple-600/0 to-pink-600/0 group-hover:from-purple-600/5 group-hover:to-pink-600/5 transition-all duration-300 pointer-events-none" />
      
      {/* Arrow indicator on hover */}
      <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <ArrowRight className="h-5 w-5 text-purple-600" />
      </div>
    </Card>
  );
}