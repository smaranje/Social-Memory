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
  Circle,
  Star,
  Zap,
  Activity,
  AlertCircle
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

const relationshipBgColors = {
  friend: 'from-pink-900/30 to-rose-900/30 border-pink-500/20',
  colleague: 'from-blue-900/30 to-indigo-900/30 border-blue-500/20',
  family: 'from-purple-900/30 to-violet-900/30 border-purple-500/20',
  networking: 'from-green-900/30 to-emerald-900/30 border-green-500/20',
  acquaintance: 'from-gray-900/30 to-slate-900/30 border-gray-500/20',
  romantic: 'from-red-900/30 to-pink-900/30 border-red-500/20',
  other: 'from-amber-900/30 to-orange-900/30 border-amber-500/20'
};

export function ContactCard({ contact, onClick }: ContactCardProps) {
  const lastConversation = contact.conversations[contact.conversations.length - 1];
  const upcomingReminders = contact.reminders.filter(r => !r.completed && new Date(r.date) > new Date());
  const RelationshipIcon = relationshipIcons[contact.relationship] || User;
  const gradientColor = relationshipColors[contact.relationship] || 'from-gray-500 to-slate-500';
  const bgGradient = relationshipBgColors[contact.relationship] || 'from-gray-900/30 to-slate-900/30 border-gray-500/20';
  
  // Calculate days since last contact
  const daysSinceContact = contact.lastContactDate 
    ? Math.floor((new Date().getTime() - new Date(contact.lastContactDate).getTime()) / (1000 * 60 * 60 * 24))
    : null;
  
  const needsAttention = daysSinceContact && daysSinceContact > 30;
  const hasRecentActivity = daysSinceContact && daysSinceContact <= 7;
  
  return (
    <Card 
      className={`group relative backdrop-blur-xl bg-gradient-to-br ${bgGradient} border hover:border-purple-400/40 transition-all duration-300 cursor-pointer overflow-hidden hover:scale-105 hover:shadow-2xl hover:shadow-purple-500/25 rounded-2xl`}
      onClick={onClick}
    >
      {/* Status bar at top */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gray-800/50 rounded-t-2xl overflow-hidden">
        {needsAttention && (
          <div className="h-full bg-gradient-to-r from-orange-500 to-red-500 animate-pulse" />
        )}
        {hasRecentActivity && !needsAttention && (
          <div className="h-full bg-gradient-to-r from-green-500 to-emerald-500" />
        )}
        {upcomingReminders.length > 0 && !needsAttention && !hasRecentActivity && (
          <div className="h-full bg-gradient-to-r from-purple-500 to-pink-500" />
        )}
      </div>
      
      <CardHeader className="pb-4 pt-6">
        <div className="flex justify-between items-start">
          <div className="flex items-start gap-4 flex-1">
            <div className="relative">
              <div className={`p-3 rounded-xl bg-gradient-to-r ${gradientColor} shadow-lg`}>
                <RelationshipIcon className="h-6 w-6 text-white" />
              </div>
              {hasRecentActivity && (
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white animate-pulse"></div>
              )}
              {needsAttention && (
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-orange-500 rounded-full border-2 border-white">
                  <AlertCircle className="h-2.5 w-2.5 text-white ml-0.5 mt-0.5" />
                </div>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <CardTitle className="text-xl font-bold text-white group-hover:text-purple-300 transition-colors truncate">
                {contact.name}
              </CardTitle>
              <CardDescription className="flex items-center gap-2 mt-2 text-gray-300 text-sm">
                <MapPin className="h-3 w-3 flex-shrink-0" />
                <span className="truncate">{contact.whereWeMet}</span>
              </CardDescription>
              {contact.company && (
                <CardDescription className="flex items-center gap-2 mt-1 text-gray-400 text-xs">
                  <Briefcase className="h-3 w-3 flex-shrink-0" />
                  <span className="truncate">{contact.company}</span>
                </CardDescription>
              )}
            </div>
          </div>
          <Button 
            variant="ghost" 
            size="icon"
            className="h-9 w-9 text-gray-400 hover:text-white hover:bg-white/10 opacity-0 group-hover:opacity-100 transition-all duration-200 rounded-xl"
            onClick={(e) => {
              e.stopPropagation();
              // Handle more options
            }}
          >
            <MoreVertical className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Activity Status */}
        <div className="grid grid-cols-2 gap-3">
          {lastConversation && (
            <div className="bg-black/20 backdrop-blur-sm rounded-xl p-3 border border-white/10">
              <div className="flex items-center gap-2 mb-1">
                <Activity className="h-3 w-3 text-green-400" />
                <span className="text-xs text-gray-400 font-medium">Last Contact</span>
              </div>
              <span className="text-sm font-semibold text-white">
                {formatDistanceToNow(new Date(lastConversation.date), { addSuffix: true })}
              </span>
            </div>
          )}
          
          <div className="bg-black/20 backdrop-blur-sm rounded-xl p-3 border border-white/10">
            <div className="flex items-center gap-2 mb-1">
              <MessageSquare className="h-3 w-3 text-blue-400" />
              <span className="text-xs text-gray-400 font-medium">Conversations</span>
            </div>
            <span className="text-sm font-semibold text-white">
              {contact.conversations.length}
            </span>
          </div>
        </div>
        
        {/* Reminders */}
        {upcomingReminders.length > 0 && (
          <div className="bg-gradient-to-r from-purple-900/20 to-pink-900/20 border border-purple-500/30 rounded-xl p-3 backdrop-blur-sm">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="p-1 bg-purple-500/20 rounded-lg">
                  <Clock className="h-4 w-4 text-purple-300" />
                </div>
                <div>
                  <span className="text-sm font-semibold text-purple-200">
                    {upcomingReminders.length} Active Reminder{upcomingReminders.length > 1 ? 's' : ''}
                  </span>
                  <p className="text-xs text-purple-300/70">
                    Next: {format(new Date(upcomingReminders[0].date), 'MMM d')}
                  </p>
                </div>
              </div>
              <Badge className="bg-purple-500/20 text-purple-200 border-purple-400/30 px-2 py-1">
                Active
              </Badge>
            </div>
          </div>
        )}
        
        {/* Tags */}
        {contact.tags.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {contact.tags.slice(0, 4).map((tag, index) => (
              <Badge 
                key={index} 
                variant="outline" 
                className="text-xs bg-white/5 text-gray-300 border-white/20 hover:bg-white/10 hover:text-white transition-all duration-200 px-3 py-1 rounded-full"
              >
                {tag}
              </Badge>
            ))}
            {contact.tags.length > 4 && (
              <Badge 
                variant="outline" 
                className="text-xs bg-transparent text-gray-400 border-gray-500/30 px-3 py-1 rounded-full"
              >
                +{contact.tags.length - 4}
              </Badge>
            )}
          </div>
        )}
        
        {/* AI Insights footer */}
        <div className="flex items-center justify-between pt-3 border-t border-white/10">
          <div className="flex items-center gap-2">
            {(needsAttention || upcomingReminders.length > 0) ? (
              <>
                <div className="p-1 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg">
                  <Zap className="h-3 w-3 text-white" />
                </div>
                <span className="text-xs text-purple-300 font-medium">AI insights available</span>
              </>
            ) : (
              <>
                <Star className="h-3 w-3 text-gray-400" />
                <span className="text-xs text-gray-400">
                  {contact.relationship.charAt(0).toUpperCase() + contact.relationship.slice(1)}
                </span>
              </>
            )}
          </div>
          <ArrowRight className="h-4 w-4 text-gray-400 group-hover:text-purple-300 group-hover:translate-x-1 transition-all duration-200" />
        </div>
      </CardContent>
      
      {/* Hover glow effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-purple-600/10 to-pink-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none rounded-2xl" />
      
      {/* Shimmer effect on hover */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none rounded-2xl overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent transform -skew-x-12 group-hover:animate-shimmer" />
      </div>
    </Card>
  );
}