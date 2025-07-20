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
  UserCircle,
  Building2,
  Tag
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

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
  friend: 'bg-gradient-to-r from-pink-500 to-rose-500 text-white',
  colleague: 'bg-gradient-to-r from-blue-500 to-indigo-500 text-white',
  family: 'bg-gradient-to-r from-purple-500 to-violet-500 text-white',
  networking: 'bg-gradient-to-r from-green-500 to-emerald-500 text-white',
  acquaintance: 'bg-gradient-to-r from-gray-500 to-slate-500 text-white',
  romantic: 'bg-gradient-to-r from-red-500 to-pink-500 text-white',
  other: 'bg-gradient-to-r from-slate-500 to-gray-500 text-white'
};

const relationshipBorders = {
  friend: 'border-l-pink-500',
  colleague: 'border-l-blue-500',
  family: 'border-l-purple-500',
  networking: 'border-l-green-500',
  acquaintance: 'border-l-gray-500',
  romantic: 'border-l-red-500',
  other: 'border-l-slate-500'
};

export function ContactCard({ contact, onClick }: ContactCardProps) {
  const IconComponent = relationshipIcons[contact.relationship] || User;
  const relationshipColor = relationshipColors[contact.relationship] || relationshipColors.other;
  const borderColor = relationshipBorders[contact.relationship] || relationshipBorders.other;
  
  const daysSinceLastContact = contact.lastContactDate 
    ? Math.floor((new Date().getTime() - new Date(contact.lastContactDate).getTime()) / (1000 * 60 * 60 * 24))
    : null;

  const upcomingReminders = contact.reminders.filter(r => !r.completed);
  const recentConversations = contact.conversations.length;

  return (
    <Card 
      className={`cursor-pointer hover:shadow-xl hover:scale-105 transition-all duration-300 bg-white/80 backdrop-blur-sm border-0 shadow-lg border-l-4 ${borderColor} group overflow-hidden`}
      onClick={onClick}
    >
      <CardContent className="p-0">
        {/* Header with gradient */}
        <div className="bg-gradient-to-r from-gray-50 to-blue-50 p-6 pb-4">
          <div className="flex items-start justify-between mb-3">
            <div className="flex items-center gap-3">
              <div className={`p-3 rounded-xl shadow-md group-hover:scale-110 transition-transform duration-200 ${relationshipColor.replace('text-white', 'bg-white text-gray-700')}`}>
                <IconComponent className="h-5 w-5" />
              </div>
              <div>
                <h3 className="font-bold text-gray-900 text-lg group-hover:text-blue-700 transition-colors">
                  {contact.name}
                </h3>
                {contact.company && (
                  <div className="flex items-center gap-1 mt-1">
                    <Building2 className="h-3 w-3 text-gray-400" />
                    <p className="text-sm text-gray-600">{contact.company}</p>
                  </div>
                )}
              </div>
            </div>
            <Badge className={`${relationshipColor} border-0 shadow-sm hover:shadow-md transition-shadow text-xs px-3 py-1`}>
              {contact.relationship}
            </Badge>
          </div>
        </div>

        {/* Main content */}
        <div className="p-6 pt-2">
          <div className="space-y-3 mb-4">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <div className="bg-blue-100 p-1.5 rounded-lg">
                <MapPin className="h-3.5 w-3.5 text-blue-600" />
              </div>
              <span className="flex-1 truncate">{contact.whereWeMet}</span>
            </div>
            
            {contact.lastContactDate && (
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <div className="bg-green-100 p-1.5 rounded-lg">
                  <Clock className="h-3.5 w-3.5 text-green-600" />
                </div>
                <span className="flex-1">
                  Last contact: {formatDistanceToNow(new Date(contact.lastContactDate), { addSuffix: true })}
                </span>
              </div>
            )}
          </div>

          {/* Stats row */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex gap-4">
              {recentConversations > 0 && (
                <div className="flex items-center gap-1.5 text-sm">
                  <div className="bg-emerald-100 p-1.5 rounded-lg">
                    <MessageSquare className="h-3.5 w-3.5 text-emerald-600" />
                  </div>
                  <span className="text-gray-600 font-medium">{recentConversations}</span>
                </div>
              )}
              
              {upcomingReminders.length > 0 && (
                <div className="flex items-center gap-1.5 text-sm">
                  <div className="bg-orange-100 p-1.5 rounded-lg">
                    <Calendar className="h-3.5 w-3.5 text-orange-600" />
                  </div>
                  <span className="text-orange-700 font-medium">{upcomingReminders.length}</span>
                </div>
              )}
            </div>
            
            {daysSinceLastContact !== null && daysSinceLastContact > 30 && (
              <Badge variant="outline" className="text-xs border-orange-200 bg-orange-50 text-orange-700 hover:bg-orange-100">
                Follow up needed
              </Badge>
            )}
          </div>

          {/* Tags */}
          {contact.tags.length > 0 && (
            <div className="space-y-2">
              <div className="flex items-center gap-1 text-xs text-gray-500">
                <Tag className="h-3 w-3" />
                <span>Tags</span>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {contact.tags.slice(0, 3).map((tag) => (
                  <Badge 
                    key={tag} 
                    variant="secondary" 
                    className="text-xs bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors border-0 px-2 py-1"
                  >
                    {tag}
                  </Badge>
                ))}
                {contact.tags.length > 3 && (
                  <Badge 
                    variant="secondary" 
                    className="text-xs bg-blue-100 text-blue-700 hover:bg-blue-200 transition-colors border-0 px-2 py-1"
                  >
                    +{contact.tags.length - 3} more
                  </Badge>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Hover effect overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-indigo-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
      </CardContent>
    </Card>
  );
}