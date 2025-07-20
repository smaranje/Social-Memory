-- Enable Row Level Security
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, created_at, updated_at)
  VALUES (
    new.id,
    new.email,
    COALESCE(new.raw_user_meta_data->>'full_name', ''),
    NOW(),
    NOW()
  );
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create profiles table
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  email TEXT NOT NULL,
  full_name TEXT,
  avatar_url TEXT
);

-- Create contacts table
CREATE TABLE IF NOT EXISTS public.contacts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  relationship TEXT NOT NULL CHECK (relationship IN ('friend', 'colleague', 'family', 'romantic', 'acquaintance', 'networking', 'other')),
  how_we_met TEXT NOT NULL,
  where_we_met TEXT NOT NULL,
  company TEXT,
  first_met_date DATE NOT NULL,
  last_contact_date DATE NOT NULL,
  tags TEXT[] DEFAULT '{}',
  notes TEXT DEFAULT '',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create conversations table
CREATE TABLE IF NOT EXISTS public.conversations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  contact_id UUID REFERENCES public.contacts(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  date TIMESTAMP WITH TIME ZONE NOT NULL,
  summary TEXT NOT NULL,
  topics TEXT[] DEFAULT '{}',
  promises TEXT[] DEFAULT '{}',
  mood TEXT NOT NULL CHECK (mood IN ('positive', 'neutral', 'negative')),
  next_steps TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create reminders table
CREATE TABLE IF NOT EXISTS public.reminders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  contact_id UUID REFERENCES public.contacts(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  date TIMESTAMP WITH TIME ZONE NOT NULL,
  title TEXT NOT NULL,
  description TEXT DEFAULT '',
  type TEXT NOT NULL CHECK (type IN ('follow-up', 'birthday', 'event', 'promise', 'check-in', 'other')),
  completed BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create personal_details table
CREATE TABLE IF NOT EXISTS public.personal_details (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  contact_id UUID REFERENCES public.contacts(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('work', 'family', 'hobbies', 'preferences', 'goals', 'other')),
  detail TEXT NOT NULL,
  importance TEXT NOT NULL CHECK (importance IN ('high', 'medium', 'low')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contacts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reminders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.personal_details ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view own profile" ON public.profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" ON public.profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can view own contacts" ON public.contacts
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create own contacts" ON public.contacts
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own contacts" ON public.contacts
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own contacts" ON public.contacts
  FOR DELETE USING (auth.uid() = user_id);

CREATE POLICY "Users can view own conversations" ON public.conversations
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create own conversations" ON public.conversations
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own conversations" ON public.conversations
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own conversations" ON public.conversations
  FOR DELETE USING (auth.uid() = user_id);

CREATE POLICY "Users can view own reminders" ON public.reminders
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create own reminders" ON public.reminders
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own reminders" ON public.reminders
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own reminders" ON public.reminders
  FOR DELETE USING (auth.uid() = user_id);

CREATE POLICY "Users can view own personal details" ON public.personal_details
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create own personal details" ON public.personal_details
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own personal details" ON public.personal_details
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own personal details" ON public.personal_details
  FOR DELETE USING (auth.uid() = user_id);

-- Create trigger for new user registration
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS contacts_user_id_idx ON public.contacts(user_id);
CREATE INDEX IF NOT EXISTS contacts_updated_at_idx ON public.contacts(updated_at DESC);
CREATE INDEX IF NOT EXISTS conversations_contact_id_idx ON public.conversations(contact_id);
CREATE INDEX IF NOT EXISTS conversations_user_id_idx ON public.conversations(user_id);
CREATE INDEX IF NOT EXISTS reminders_contact_id_idx ON public.reminders(contact_id);
CREATE INDEX IF NOT EXISTS reminders_user_id_idx ON public.reminders(user_id);
CREATE INDEX IF NOT EXISTS reminders_date_idx ON public.reminders(date);
CREATE INDEX IF NOT EXISTS personal_details_contact_id_idx ON public.personal_details(contact_id);
CREATE INDEX IF NOT EXISTS personal_details_user_id_idx ON public.personal_details(user_id);