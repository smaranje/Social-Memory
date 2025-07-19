'use client';

import { useState } from 'react';
import { Contact } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { X } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface AddContactFormProps {
  onSubmit: (contact: Contact) => void;
  onCancel: () => void;
}

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

  return (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <CardTitle>Add New Contact</CardTitle>
        <CardDescription>Remember someone new you've met</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Name *</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Priya Sharma"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="relationship">Relationship Type *</Label>
            <Select value={relationship} onValueChange={(value) => setRelationship(value as Contact['relationship'])}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="friend">Friend</SelectItem>
                <SelectItem value="colleague">Colleague</SelectItem>
                <SelectItem value="family">Family</SelectItem>
                <SelectItem value="romantic">Romantic</SelectItem>
                <SelectItem value="acquaintance">Acquaintance</SelectItem>
                <SelectItem value="networking">Networking</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="how">How did you meet? *</Label>
              <Input
                id="how"
                value={howWeMet}
                onChange={(e) => setHowWeMet(e.target.value)}
                placeholder="Through mutual friend"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="where">Where did you meet? *</Label>
              <Input
                id="where"
                value={whereWeMet}
                onChange={(e) => setWhereWeMet(e.target.value)}
                placeholder="Dan's birthday party"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Initial Notes</Label>
            <Textarea
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="UX designer, loves dogs, wants to move to Berlin..."
              rows={4}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="tags">Tags</Label>
            <div className="flex gap-2">
              <Input
                id="tags"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                placeholder="Add tags (press Enter)"
              />
              <Button type="button" onClick={addTag} variant="secondary">
                Add
              </Button>
            </div>
            <div className="flex flex-wrap gap-2 mt-2">
              {tags.map((tag, index) => (
                <Badge key={index} variant="secondary" className="flex items-center gap-1">
                  {tag}
                  <X
                    className="h-3 w-3 cursor-pointer"
                    onClick={() => removeTag(tag)}
                  />
                </Badge>
              ))}
            </div>
          </div>

          <div className="flex gap-2 pt-4">
            <Button type="submit" disabled={!name || !howWeMet || !whereWeMet}>
              Save Contact
            </Button>
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancel
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}