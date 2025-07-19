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
    <div className="w-full max-w-4xl mx-auto">
      <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-2xl overflow-hidden">
        {/* Header */}
        <CardHeader className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600/90 to-indigo-600/90"></div>
          <div className="relative flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="bg-white/20 p-3 rounded-2xl backdrop-blur-sm">
                <UserPlus className="h-7 w-7" />
              </div>
              <div>
                <CardTitle className="text-3xl font-bold">Add New Contact</CardTitle>
                <CardDescription className="text-blue-100 text-lg">
                  Build meaningful connections that last
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
        
        <CardContent className="p-8">
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Basic Info Section */}
            <div className="space-y-6">
              <div className="flex items-center gap-3 mb-6">
                <div className={`p-3 rounded-xl bg-gradient-to-r ${gradientColor} shadow-lg`}>
                  <RelationshipIcon className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900">Basic Information</h3>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Name */}
                <div className="space-y-3">
                  <Label htmlFor="name" className="flex items-center gap-2 text-gray-700 font-semibold">
                    <User className="h-4 w-4 text-blue-600" />
                    Full Name *
                  </Label>
                  <Input
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter their full name"
                    required
                    className="bg-white/70 backdrop-blur-sm border-0 shadow-inner text-gray-900 placeholder:text-gray-500 focus:ring-2 focus:ring-blue-500/20 rounded-xl h-12 text-base"
                  />
                </div>

                {/* Relationship */}
                <div className="space-y-3">
                  <Label className="flex items-center gap-2 text-gray-700 font-semibold">
                    <Star className="h-4 w-4 text-blue-600" />
                    Relationship *
                  </Label>
                  <Select value={relationship} onValueChange={(value: Contact['relationship']) => setRelationship(value)}>
                    <SelectTrigger className="bg-white/70 backdrop-blur-sm border-0 shadow-inner text-gray-900 focus:ring-2 focus:ring-blue-500/20 rounded-xl h-12">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-white/95 backdrop-blur-sm border-0 shadow-xl text-gray-900">
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
                  <Label htmlFor="whereWeMet" className="flex items-center gap-2 text-gray-700 font-semibold">
                    <MapPin className="h-4 w-4 text-blue-600" />
                    Where We Met
                  </Label>
                  <Input
                    id="whereWeMet"
                    value={whereWeMet}
                    onChange={(e) => setWhereWeMet(e.target.value)}
                    placeholder="e.g., Coffee shop, Conference, Gym"
                    className="bg-white/70 backdrop-blur-sm border-0 shadow-inner text-gray-900 placeholder:text-gray-500 focus:ring-2 focus:ring-blue-500/20 rounded-xl h-12"
                  />
                </div>

                {/* Company */}
                <div className="space-y-3">
                  <Label htmlFor="company" className="flex items-center gap-2 text-gray-700 font-semibold">
                    <Building2 className="h-4 w-4 text-blue-600" />
                    Company
                  </Label>
                  <Input
                    id="company"
                    value={company}
                    onChange={(e) => setCompany(e.target.value)}
                    placeholder="Where do they work?"
                    className="bg-white/70 backdrop-blur-sm border-0 shadow-inner text-gray-900 placeholder:text-gray-500 focus:ring-2 focus:ring-blue-500/20 rounded-xl h-12"
                  />
                </div>
              </div>

              {/* How We Met */}
              <div className="space-y-3">
                <Label htmlFor="howWeMet" className="flex items-center gap-2 text-gray-700 font-semibold">
                  <Sparkles className="h-4 w-4 text-blue-600" />
                  How We Met
                </Label>
                <Textarea
                  id="howWeMet"
                  value={howWeMet}
                  onChange={(e) => setHowWeMet(e.target.value)}
                  placeholder="Tell the story of how you met..."
                  className="bg-white/70 backdrop-blur-sm border-0 shadow-inner text-gray-900 placeholder:text-gray-500 focus:ring-2 focus:ring-blue-500/20 rounded-xl min-h-[100px] resize-none"
                />
              </div>
            </div>

            {/* Tags Section */}
            <div className="space-y-6">
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-xl bg-gradient-to-r from-green-500 to-emerald-500 shadow-lg">
                  <Tag className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900">Tags & Interests</h3>
              </div>
              
              <div className="space-y-4">
                <div className="flex gap-3">
                  <Input
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyPress={handleTagKeyPress}
                    placeholder="Add tags (hobbies, interests, work...)"
                    className="bg-white/70 backdrop-blur-sm border-0 shadow-inner text-gray-900 placeholder:text-gray-500 focus:ring-2 focus:ring-blue-500/20 rounded-xl h-12"
                  />
                  <Button
                    type="button"
                    onClick={addTag}
                    className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white px-6 rounded-xl h-12 font-semibold shadow-lg hover:shadow-xl transition-all duration-200"
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                
                {tags.length > 0 && (
                  <div className="flex flex-wrap gap-3">
                    {tags.map((tag, index) => (
                      <Badge
                        key={index}
                        className="bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-800 border-0 px-4 py-2 rounded-full flex items-center gap-2 hover:from-blue-200 hover:to-indigo-200 transition-all shadow-sm"
                      >
                        {tag}
                        <button
                          type="button"
                          onClick={() => removeTag(tag)}
                          className="hover:text-red-600 transition-colors"
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
                <div className="p-3 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 shadow-lg">
                  <FileText className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900">Additional Notes</h3>
              </div>
              
              <Textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Any additional information, shared interests, or things to remember..."
                className="bg-white/70 backdrop-blur-sm border-0 shadow-inner text-gray-900 placeholder:text-gray-500 focus:ring-2 focus:ring-blue-500/20 rounded-xl min-h-[120px] resize-none"
              />
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col-reverse md:flex-row gap-4 pt-8 border-t border-gray-200">
              <Button
                type="button"
                variant="ghost"
                onClick={onCancel}
                className="flex-1 md:flex-none bg-gray-100 text-gray-700 hover:bg-gray-200 border-0 rounded-xl h-12 px-8 font-semibold transition-all duration-200"
              >
                <ChevronLeft className="h-5 w-5 mr-2" />
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={!name.trim()}
                className="flex-1 md:flex-none bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-xl h-12 px-8 font-semibold shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
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