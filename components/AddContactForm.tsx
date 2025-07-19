'use client';

import { useState } from 'react';
import { Contact } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  X, 
  Plus, 
  User, 
  MapPin, 
  Calendar, 
  Tag, 
  FileText,
  Sparkles,
  Heart,
  Briefcase,
  Users,
  Network,
  UserCircle,
  ArrowLeft,
  Save
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface AddContactFormProps {
  onSubmit: (contact: Contact) => void;
  onCancel: () => void;
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

export function AddContactForm({ onSubmit, onCancel }: AddContactFormProps) {
  const [name, setName] = useState('');
  const [relationship, setRelationship] = useState<Contact['relationship']>('acquaintance');
  const [howWeMet, setHowWeMet] = useState('');
  const [whereWeMet, setWhereWeMet] = useState('');
  const [notes, setNotes] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const newContact: Contact = {
      id: Date.now().toString(),
      name,
      relationship,
      howWeMet,
      whereWeMet,
      firstMetDate: new Date().toISOString(),
      lastContactDate: new Date().toISOString(),
      tags,
      notes,
      reminders: [],
      conversations: [],
      personalDetails: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    
    onSubmit(newContact);
  };

  const addTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      setTags([...tags, tagInput.trim()]);
      setTagInput('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  const RelationshipIcon = relationshipIcons[relationship] || User;

  return (
    <Card className="w-full max-w-2xl bg-white/80 backdrop-blur-lg border-white/20 shadow-2xl">
      <CardHeader className="bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-t-lg">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-white/20 backdrop-blur-md p-2 rounded-lg">
              <Sparkles className="h-6 w-6" />
            </div>
            <div>
              <CardTitle className="text-2xl">Add New Contact</CardTitle>
              <CardDescription className="text-white/80">Build your social memory one connection at a time</CardDescription>
            </div>
          </div>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={onCancel}
            className="text-white hover:bg-white/20"
          >
            <X className="h-5 w-5" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="mt-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Name Input with Icon */}
          <div className="space-y-2">
            <Label htmlFor="name" className="flex items-center gap-2 text-gray-700">
              <User className="h-4 w-4" />
              Name *
            </Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter contact's name"
              required
              className="bg-white/60 border-gray-200 focus:border-purple-500 focus:ring-purple-500"
            />
          </div>

          {/* Relationship Type with Visual Selector */}
          <div className="space-y-2">
            <Label htmlFor="relationship" className="flex items-center gap-2 text-gray-700">
              <RelationshipIcon className="h-4 w-4" />
              Relationship Type *
            </Label>
            <Select value={relationship} onValueChange={(value) => setRelationship(value as Contact['relationship'])}>
              <SelectTrigger className="bg-white/60 border-gray-200 focus:border-purple-500 focus:ring-purple-500">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="friend">
                  <div className="flex items-center gap-2">
                    <Heart className="h-4 w-4 text-pink-500" />
                    Friend
                  </div>
                </SelectItem>
                <SelectItem value="colleague">
                  <div className="flex items-center gap-2">
                    <Briefcase className="h-4 w-4 text-blue-500" />
                    Colleague
                  </div>
                </SelectItem>
                <SelectItem value="family">
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-purple-500" />
                    Family
                  </div>
                </SelectItem>
                <SelectItem value="romantic">
                  <div className="flex items-center gap-2">
                    <Heart className="h-4 w-4 text-red-500" />
                    Romantic
                  </div>
                </SelectItem>
                <SelectItem value="acquaintance">
                  <div className="flex items-center gap-2">
                    <UserCircle className="h-4 w-4 text-gray-500" />
                    Acquaintance
                  </div>
                </SelectItem>
                <SelectItem value="networking">
                  <div className="flex items-center gap-2">
                    <Network className="h-4 w-4 text-green-500" />
                    Networking
                  </div>
                </SelectItem>
                <SelectItem value="other">
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4 text-amber-500" />
                    Other
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="howWeMet" className="flex items-center gap-2 text-gray-700">
                <Calendar className="h-4 w-4" />
                How We Met *
              </Label>
              <Input
                id="howWeMet"
                value={howWeMet}
                onChange={(e) => setHowWeMet(e.target.value)}
                placeholder="e.g., Conference, mutual friend"
                required
                className="bg-white/60 border-gray-200 focus:border-purple-500 focus:ring-purple-500"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="whereWeMet" className="flex items-center gap-2 text-gray-700">
                <MapPin className="h-4 w-4" />
                Where We Met *
              </Label>
              <Input
                id="whereWeMet"
                value={whereWeMet}
                onChange={(e) => setWhereWeMet(e.target.value)}
                placeholder="e.g., New York, Online"
                required
                className="bg-white/60 border-gray-200 focus:border-purple-500 focus:ring-purple-500"
              />
            </div>
          </div>

          {/* Tags with Better Design */}
          <div className="space-y-2">
            <Label htmlFor="tags" className="flex items-center gap-2 text-gray-700">
              <Tag className="h-4 w-4" />
              Tags
            </Label>
            <div className="flex gap-2">
              <Input
                id="tags"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                placeholder="Add tags (press Enter)"
                className="bg-white/60 border-gray-200 focus:border-purple-500 focus:ring-purple-500"
              />
              <Button 
                type="button" 
                onClick={addTag} 
                variant="outline"
                className="border-purple-200 text-purple-600 hover:bg-purple-50"
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            {tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {tags.map((tag) => (
                  <Badge 
                    key={tag} 
                    variant="secondary"
                    className="bg-purple-100 text-purple-700 border-purple-200 hover:bg-purple-200 transition-colors"
                  >
                    {tag}
                    <button
                      type="button"
                      onClick={() => removeTag(tag)}
                      className="ml-2 hover:text-purple-900"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            )}
          </div>

          {/* Notes with Enhanced Textarea */}
          <div className="space-y-2">
            <Label htmlFor="notes" className="flex items-center gap-2 text-gray-700">
              <FileText className="h-4 w-4" />
              Notes
            </Label>
            <Textarea
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Add any additional notes about this contact..."
              rows={4}
              className="bg-white/60 border-gray-200 focus:border-purple-500 focus:ring-purple-500 resize-none"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4">
            <Button 
              type="button" 
              variant="outline" 
              onClick={onCancel}
              className="flex-1 border-gray-300 hover:bg-gray-50"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Cancel
            </Button>
            <Button 
              type="submit"
              className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
            >
              <Save className="h-4 w-4 mr-2" />
              Save Contact
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}