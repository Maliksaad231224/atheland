-- Create app role enum
CREATE TYPE public.app_role AS ENUM ('admin', 'user');

-- Create user roles table (separate from profiles for security)
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role app_role NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  UNIQUE(user_id, role)
);

-- Create profiles table for user information
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
  full_name TEXT,
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Create coaches table
CREATE TABLE public.coaches (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  specialty TEXT,
  bio TEXT,
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Create workout templates table
CREATE TABLE public.workout_templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  template_type TEXT NOT NULL, -- HIIT, Strength, Cardio, HYROX
  category TEXT, -- Hyrox Prep, Sprint Conditioning, etc.
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Create template blocks table (blocks within templates)
CREATE TABLE public.template_blocks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  template_id UUID REFERENCES public.workout_templates(id) ON DELETE CASCADE NOT NULL,
  block_order INTEGER NOT NULL,
  block_name TEXT,
  rounds INTEGER NOT NULL DEFAULT 1,
  ai_description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Create template exercises table (exercises within blocks)
CREATE TABLE public.template_exercises (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  block_id UUID REFERENCES public.template_blocks(id) ON DELETE CASCADE NOT NULL,
  exercise_order INTEGER NOT NULL,
  exercise_name TEXT NOT NULL,
  reps INTEGER,
  weight DECIMAL,
  is_bodyweight BOOLEAN DEFAULT false,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Create programs table
CREATE TABLE public.programs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  duration_weeks INTEGER NOT NULL,
  skill_level TEXT NOT NULL, -- Beginner, Intermediate, Advanced
  sessions_per_week INTEGER NOT NULL,
  created_by UUID REFERENCES auth.users(id),
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Create classes table
CREATE TABLE public.classes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  template_id UUID REFERENCES public.workout_templates(id),
  coach_id UUID REFERENCES public.coaches(id),
  program_id UUID REFERENCES public.programs(id),
  class_date DATE NOT NULL,
  class_time TIME NOT NULL,
  duration_minutes INTEGER NOT NULL,
  intensity TEXT NOT NULL, -- Low, Medium, High
  focus_area TEXT,
  max_participants INTEGER NOT NULL,
  current_enrolled INTEGER DEFAULT 0,
  ai_generated_description TEXT,
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Create class enrollments table
CREATE TABLE public.class_enrollments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  class_id UUID REFERENCES public.classes(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  enrolled_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  UNIQUE(class_id, user_id)
);

-- Create security definer function to check roles
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  )
$$;


-- Create function to handle new user profile creation
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (user_id, full_name)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email)
  );
  RETURN NEW;
END;
$$;

-- Trigger to create profile on user signup
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

-- Add update triggers to relevant tables
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_coaches_updated_at
  BEFORE UPDATE ON public.coaches
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_workout_templates_updated_at
  BEFORE UPDATE ON public.workout_templates
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_programs_updated_at
  BEFORE UPDATE ON public.programs
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_classes_updated_at
  BEFORE UPDATE ON public.classes
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Insert some sample coaches
INSERT INTO public.coaches (name, specialty, bio) VALUES
  ('Sarah Mitchell', 'HYROX Training', 'Certified HYROX coach with 5+ years experience in endurance training'),
  ('Marcus Lee', 'Sprint Conditioning', 'Former track athlete specializing in speed and power development'),
  ('Emma Rodriguez', 'Strength Training', 'Olympic weightlifting coach and strength conditioning specialist'),
  ('James Carter', 'General Fitness', 'Versatile coach with expertise in functional fitness and mobility');
