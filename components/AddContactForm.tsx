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
  Save,
  ChevronLeft,
  Building2,
  Star,
  UserPlus
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

const relationshipColors = {
  friend: 'from-pink-500 to-rose-500',
  colleague: 'from-blue-500 to-indigo-500',
  family: 'from-purple-500 to-violet-500',
  networking: 'from-green-500 to-emerald-500',
  acquaintance: 'from-gray-500 to-slate-500',
  romantic: 'from-red-500 to-pink-500',
  other: 'from-amber-500 to-orange-500'
};

export function AddContactForm({ onSubmit, onCancel }: AddContactFormProps) {
  const [name, setName] = useState('');
  const [relationship, setRelationship] = useState<Contact['relationship']>('acquaintance');
  const [howWeMet, setHowWeMet] = useState('');
  const [whereWeMet, setWhereWeMet] = useState('');
  const [company, setCompany] = useState('');
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
      company: company || undefined,
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

  const handleTagKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addTag();
    }
  };

  const RelationshipIcon = relationshipIcons[relationship] || User;
  const gradientColor = relationshipColors[relationship] || 'from-gray-500 to-slate-500';

  return (
    <div className="w-full max-w-3xl mx-auto relative">
      {/* Background overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 to-pink-900/20 rounded-3xl blur-3xl transform scale-110"></div>
      
      {/* Mobile header */}
      <div className="md:hidden sticky top-0 z-20 backdrop-blur-xl bg-black/20 border-b border-white/10 -mx-4 px-6 py-4 mb-6">
        <div className="flex items-center justify-between">
          <Button 
            type="button"
            variant="ghost" 
            onClick={onCancel} 
            className="text-gray-300 hover:text-white hover:bg-white/10 rounded-xl -ml-2"
          >
            <ChevronLeft className="h-5 w-5 mr-1" />
            Cancel
          </Button>
          <h1 className="text-xl font-bold text-white">New Contact</h1>
          <div className="w-20"></div>
        </div>
      </div>

      <Card className="relative bg-black/20 backdrop-blur-xl border border-white/10 shadow-2xl rounded-3xl overflow-hidden">
        {/* Desktop header */}
        <CardHeader className="hidden md:block bg-gradient-to-r from-purple-600 to-pink-600 text-white relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-purple-600/90 to-pink-600/90 backdrop-blur-sm"></div>
          <div className="relative flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="bg-white/20 p-3 rounded-2xl backdrop-blur-sm">
                <UserPlus className="h-7 w-7 animate-pulse" />
              </div>
              <div>
                <CardTitle className="text-3xl font-bold">Add New Contact</CardTitle>
                <CardDescription className="text-white/80 text-lg">
                  Transform connections into lasting relationships
                </CardDescription>
              </div>
            </div>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={onCancel}
              className="text-white hover:bg-white/20 rounded-xl"
            >
              <X className="h-6 w-6" />
            </Button>
          </div>
        </CardHeader>
        
        <CardContent className="p-8 relative">
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Basic Info Section */}
            <div className="space-y-6">
              <div className="flex items-center gap-3 mb-6">
                <div className={`p-2 rounded-xl bg-gradient-to-r ${gradientColor}`}>
                  <RelationshipIcon className="h-5 w-5 text-white" />
                </div>
                <h3 className="text-xl font-bold text-white">Basic Information</h3>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Name */}
                <div className="space-y-3">
                  <Label htmlFor="name" className="flex items-center gap-2 text-gray-300 font-medium">
                    <User className="h-4 w-4 text-purple-400" />
                    Full Name *
                  </Label>
                  <Input
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter their full name"
                    required
                    className="bg-black/20 backdrop-blur-xl border border-white/10 text-white placeholder:text-gray-400 focus:border-purple-400/50 rounded-xl h-12 text-lg focus-modern"
                  />
                </div>

                {/* Relationship */}
                <div className="space-y-3">
                  <Label className="flex items-center gap-2 text-gray-300 font-medium">
                    <Star className="h-4 w-4 text-purple-400" />
                    Relationship *
                  </Label>
                  <Select value={relationship} onValueChange={(value: Contact['relationship']) => setRelationship(value)}>
                    <SelectTrigger className="bg-black/20 backdrop-blur-xl border border-white/10 text-white focus:border-purple-400/50 rounded-xl h-12">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-black/90 backdrop-blur-xl border border-white/20 text-white">
                      <SelectItem value="friend">👋 Friend</SelectItem>
                      <SelectItem value="colleague">💼 Colleague</SelectItem>
                      <SelectItem value="family">👨‍👩‍👧‍👦 Family</SelectItem>
                      <SelectItem value="networking">🤝 Professional Network</SelectItem>
                      <SelectItem value="acquaintance">👤 Acquaintance</SelectItem>
                      <SelectItem value="romantic">❤️ Romantic</SelectItem>
                      <SelectItem value="other">🔗 Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Where We Met */}
                <div className="space-y-3">
                  <Label htmlFor="whereWeMet" className="flex items-center gap-2 text-gray-300 font-medium">
                    <MapPin className="h-4 w-4 text-purple-400" />
                    Where We Met
                  </Label>
                  <Input
                    id="whereWeMet"
                    value={whereWeMet}
                    onChange={(e) => setWhereWeMet(e.target.value)}
                    placeholder="e.g., Coffee shop, Conference, Gym"
                    className="bg-black/20 backdrop-blur-xl border border-white/10 text-white placeholder:text-gray-400 focus:border-purple-400/50 rounded-xl h-12 focus-modern"
                  />
                </div>

                {/* Company */}
                <div className="space-y-3">
                  <Label htmlFor="company" className="flex items-center gap-2 text-gray-300 font-medium">
                    <Building2 className="h-4 w-4 text-purple-400" />
                    Company
                  </Label>
                  <Input
                    id="company"
                    value={company}
                    onChange={(e) => setCompany(e.target.value)}
                    placeholder="Where do they work?"
                    className="bg-black/20 backdrop-blur-xl border border-white/10 text-white placeholder:text-gray-400 focus:border-purple-400/50 rounded-xl h-12 focus-modern"
                  />
                </div>
              </div>

              {/* How We Met */}
              <div className="space-y-3">
                <Label htmlFor="howWeMet" className="flex items-center gap-2 text-gray-300 font-medium">
                  <Sparkles className="h-4 w-4 text-purple-400" />
                  How We Met
                </Label>
                <Textarea
                  id="howWeMet"
                  value={howWeMet}
                  onChange={(e) => setHowWeMet(e.target.value)}
                  placeholder="Tell the story of how you met..."
                  className="bg-black/20 backdrop-blur-xl border border-white/10 text-white placeholder:text-gray-400 focus:border-purple-400/50 rounded-xl min-h-[100px] resize-none focus-modern"
                />
              </div>
            </div>

            {/* Tags Section */}
            <div className="space-y-6">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-gradient-to-r from-blue-500 to-cyan-500">
                  <Tag className="h-5 w-5 text-white" />
                </div>
                <h3 className="text-xl font-bold text-white">Tags & Interests</h3>
              </div>
              
              <div className="space-y-4">
                <div className="flex gap-3">
                  <Input
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyPress={handleTagKeyPress}
                    placeholder="Add tags (hobbies, interests, work...)"
                    className="bg-black/20 backdrop-blur-xl border border-white/10 text-white placeholder:text-gray-400 focus:border-purple-400/50 rounded-xl h-12 focus-modern"
                  />
                  <Button
                    type="button"
                    onClick={addTag}
                    className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white px-6 rounded-xl h-12 font-semibold"
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                
                {tags.length > 0 && (
                  <div className="flex flex-wrap gap-3">
                    {tags.map((tag, index) => (
                      <Badge
                        key={index}
                        className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 text-purple-200 border-purple-400/30 px-4 py-2 rounded-full flex items-center gap-2 hover:bg-purple-500/30 transition-all"
                      >
                        {tag}
                        <button
                          type="button"
                          onClick={() => removeTag(tag)}
                          className="hover:text-red-300 transition-colors"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </Badge>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Notes Section */}
            <div className="space-y-6">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-gradient-to-r from-green-500 to-emerald-500">
                  <FileText className="h-5 w-5 text-white" />
                </div>
                <h3 className="text-xl font-bold text-white">Additional Notes</h3>
              </div>
              
              <Textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Any additional information, shared interests, or things to remember..."
                className="bg-black/20 backdrop-blur-xl border border-white/10 text-white placeholder:text-gray-400 focus:border-purple-400/50 rounded-xl min-h-[120px] resize-none focus-modern"
              />
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col-reverse md:flex-row gap-4 pt-6 border-t border-white/10">
              <Button
                type="button"
                variant="ghost"
                onClick={onCancel}
                className="flex-1 md:flex-none bg-black/20 text-gray-300 hover:text-white hover:bg-white/10 border border-white/10 rounded-xl h-12 px-8 font-semibold"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={!name.trim()}
                className="flex-1 md:flex-none bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-xl h-12 px-8 font-semibold shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Save className="h-5 w-5 mr-2" />
                Save Contact
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}