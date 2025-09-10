-- Create user profiles table
CREATE TABLE public.profiles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT,
  email TEXT,
  eco_points INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create waste records table
CREATE TABLE public.waste_records (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  waste_type TEXT NOT NULL CHECK (waste_type IN ('Dry', 'Wet', 'Metal', 'E-Waste')),
  weight_kg DECIMAL(5,2) NOT NULL,
  points_earned INTEGER NOT NULL,
  image_url TEXT,
  confidence_score DECIMAL(3,2),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create collection schedules table
CREATE TABLE public.collection_schedules (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  waste_type TEXT NOT NULL CHECK (waste_type IN ('Dry', 'Wet', 'Metal', 'E-Waste')),
  scheduled_date DATE NOT NULL,
  scheduled_time TIME NOT NULL,
  area TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'completed', 'missed')),
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create collection history table
CREATE TABLE public.collection_history (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  waste_type TEXT NOT NULL CHECK (waste_type IN ('Dry', 'Wet', 'Metal', 'E-Waste')),
  collected_date DATE NOT NULL,
  collected_time TIME,
  weight_collected_kg DECIMAL(5,2),
  collection_area TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.waste_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.collection_schedules ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.collection_history ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for profiles
CREATE POLICY "Users can view their own profile" 
ON public.profiles 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own profile" 
ON public.profiles 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own profile" 
ON public.profiles 
FOR UPDATE 
USING (auth.uid() = user_id);

-- Create RLS policies for waste_records
CREATE POLICY "Users can view their own waste records" 
ON public.waste_records 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own waste records" 
ON public.waste_records 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

-- Create RLS policies for collection_schedules
CREATE POLICY "Users can view their own collection schedules" 
ON public.collection_schedules 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own collection schedules" 
ON public.collection_schedules 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own collection schedules" 
ON public.collection_schedules 
FOR UPDATE 
USING (auth.uid() = user_id);

-- Create RLS policies for collection_history
CREATE POLICY "Users can view their own collection history" 
ON public.collection_history 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own collection history" 
ON public.collection_history 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create triggers for automatic timestamp updates
CREATE TRIGGER update_profiles_updated_at
BEFORE UPDATE ON public.profiles
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_collection_schedules_updated_at
BEFORE UPDATE ON public.collection_schedules
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create function to handle new user registration
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (user_id, name, email)
  VALUES (
    NEW.id, 
    COALESCE(NEW.raw_user_meta_data ->> 'name', NEW.raw_user_meta_data ->> 'full_name'),
    NEW.email
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Create trigger to automatically create profile on user signup
CREATE TRIGGER on_auth_user_created
AFTER INSERT ON auth.users
FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();