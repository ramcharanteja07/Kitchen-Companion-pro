CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL DEFAULT 'Chef',
  avatar TEXT,
  bio TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.profiles TO authenticated;
GRANT SELECT ON public.profiles TO anon;
GRANT ALL ON public.profiles TO service_role;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "profiles_public_read" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "profiles_insert_own" ON public.profiles FOR INSERT TO authenticated WITH CHECK (auth.uid() = id);
CREATE POLICY "profiles_update_own" ON public.profiles FOR UPDATE TO authenticated USING (auth.uid() = id) WITH CHECK (auth.uid() = id);

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  INSERT INTO public.profiles (id, name, avatar)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'name', NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1), 'Chef'),
    NEW.raw_user_meta_data->>'avatar_url'
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END; $$;

CREATE TRIGGER on_auth_user_created
AFTER INSERT ON auth.users
FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

CREATE TABLE public.recipes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT NOT NULL DEFAULT '',
  image TEXT,
  ingredients JSONB NOT NULL DEFAULT '[]'::jsonb,
  steps JSONB NOT NULL DEFAULT '[]'::jsonb,
  nutrition JSONB NOT NULL DEFAULT '{}'::jsonb,
  cook_time INT NOT NULL DEFAULT 0,
  prep_time INT NOT NULL DEFAULT 0,
  servings INT NOT NULL DEFAULT 2,
  difficulty TEXT NOT NULL DEFAULT 'Easy',
  cuisine TEXT NOT NULL DEFAULT 'International',
  category TEXT NOT NULL DEFAULT 'Dinner',
  published BOOLEAN NOT NULL DEFAULT true,
  created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX recipes_created_by_idx ON public.recipes(created_by);
CREATE INDEX recipes_cuisine_idx ON public.recipes(cuisine);
CREATE INDEX recipes_category_idx ON public.recipes(category);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.recipes TO authenticated;
GRANT SELECT ON public.recipes TO anon;
GRANT ALL ON public.recipes TO service_role;
ALTER TABLE public.recipes ENABLE ROW LEVEL SECURITY;
CREATE POLICY "recipes_public_read" ON public.recipes FOR SELECT USING (published = true);
CREATE POLICY "recipes_owner_read" ON public.recipes FOR SELECT TO authenticated USING (auth.uid() = created_by);
CREATE POLICY "recipes_owner_insert" ON public.recipes FOR INSERT TO authenticated WITH CHECK (auth.uid() = created_by);
CREATE POLICY "recipes_owner_update" ON public.recipes FOR UPDATE TO authenticated USING (auth.uid() = created_by) WITH CHECK (auth.uid() = created_by);
CREATE POLICY "recipes_owner_delete" ON public.recipes FOR DELETE TO authenticated USING (auth.uid() = created_by);

CREATE TABLE public.favorites (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  recipe_id UUID NOT NULL REFERENCES public.recipes(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (user_id, recipe_id)
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.favorites TO authenticated;
GRANT ALL ON public.favorites TO service_role;
ALTER TABLE public.favorites ENABLE ROW LEVEL SECURITY;
CREATE POLICY "favorites_own" ON public.favorites FOR ALL TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

CREATE TABLE public.reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  recipe_id UUID NOT NULL REFERENCES public.recipes(id) ON DELETE CASCADE,
  rating INT NOT NULL CHECK (rating BETWEEN 1 AND 5),
  review TEXT NOT NULL DEFAULT '',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (user_id, recipe_id)
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.reviews TO authenticated;
GRANT SELECT ON public.reviews TO anon;
GRANT ALL ON public.reviews TO service_role;
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;
CREATE POLICY "reviews_public_read" ON public.reviews FOR SELECT USING (true);
CREATE POLICY "reviews_insert_own" ON public.reviews FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "reviews_update_own" ON public.reviews FOR UPDATE TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "reviews_delete_own" ON public.reviews FOR DELETE TO authenticated USING (auth.uid() = user_id);

CREATE TABLE public.search_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  query TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.search_history TO authenticated;
GRANT ALL ON public.search_history TO service_role;
ALTER TABLE public.search_history ENABLE ROW LEVEL SECURITY;
CREATE POLICY "search_history_own" ON public.search_history FOR ALL TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

CREATE TABLE public.meal_plans (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  slot TEXT NOT NULL DEFAULT 'Dinner',
  recipe_id UUID NOT NULL REFERENCES public.recipes(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.meal_plans TO authenticated;
GRANT ALL ON public.meal_plans TO service_role;
ALTER TABLE public.meal_plans ENABLE ROW LEVEL SECURITY;
CREATE POLICY "meal_plans_own" ON public.meal_plans FOR ALL TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

CREATE TABLE public.shopping_lists (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  item TEXT NOT NULL,
  quantity TEXT NOT NULL DEFAULT '',
  completed BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.shopping_lists TO authenticated;
GRANT ALL ON public.shopping_lists TO service_role;
ALTER TABLE public.shopping_lists ENABLE ROW LEVEL SECURITY;
CREATE POLICY "shopping_lists_own" ON public.shopping_lists FOR ALL TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

CREATE POLICY "recipe_images_read" ON storage.objects FOR SELECT TO authenticated USING (bucket_id = 'recipe-images');
CREATE POLICY "recipe_images_insert" ON storage.objects FOR INSERT TO authenticated WITH CHECK (bucket_id = 'recipe-images' AND (storage.foldername(name))[1] = auth.uid()::text);
CREATE POLICY "recipe_images_update" ON storage.objects FOR UPDATE TO authenticated USING (bucket_id = 'recipe-images' AND (storage.foldername(name))[1] = auth.uid()::text);
CREATE POLICY "recipe_images_delete" ON storage.objects FOR DELETE TO authenticated USING (bucket_id = 'recipe-images' AND (storage.foldername(name))[1] = auth.uid()::text);

INSERT INTO public.recipes (title, description, image, ingredients, steps, nutrition, cook_time, prep_time, servings, difficulty, cuisine, category) VALUES
('Creamy Tuscan Garlic Chicken', 'Golden seared chicken in a sun-dried tomato and spinach cream sauce.', 'https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?w=1200&q=80', '["4 chicken breasts","1 cup heavy cream","1/2 cup sun-dried tomatoes","2 cups spinach","4 cloves garlic","1/2 cup parmesan","2 tbsp olive oil","Salt and pepper"]', '["Season the chicken generously on both sides.","Sear in olive oil over medium-high heat, 5 minutes per side.","Remove chicken, soften garlic and sun-dried tomatoes in the pan.","Pour in cream and parmesan, simmer until thickened.","Fold in spinach, return chicken and simmer 5 minutes."]', '{"calories":540,"protein":42,"carbs":9,"fat":37}', 25, 15, 4, 'Medium', 'Italian', 'Dinner'),
('Silky Miso Ramen', 'Deeply savoury broth, chewy noodles and a jammy egg.', 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=1200&q=80', '["4 cups chicken stock","3 tbsp white miso","2 portions ramen noodles","2 soft boiled eggs","1 cup sliced pork belly","2 spring onions","1 sheet nori","1 tsp sesame oil"]', '["Warm the stock and whisk in the miso until dissolved.","Boil noodles until just tender, then drain.","Sear pork belly slices until crisp at the edges.","Divide noodles into bowls and ladle over the broth.","Top with egg, pork, spring onion and nori."]', '{"calories":610,"protein":34,"carbs":58,"fat":26}', 30, 20, 2, 'Medium', 'Japanese', 'Dinner'),
('Smashed Avocado Toast', 'Sourdough, lemony avocado, chilli flakes and a soft egg.', 'https://images.unsplash.com/photo-1541519227354-08fa5d50c44d?w=1200&q=80', '["2 slices sourdough","1 ripe avocado","1 lemon","Chilli flakes","2 eggs","Olive oil","Flaky salt"]', '["Toast the sourdough until deeply golden.","Mash avocado with lemon juice, salt and olive oil.","Poach or fry the eggs to your liking.","Spread avocado on toast, top with egg and chilli flakes."]', '{"calories":420,"protein":16,"carbs":32,"fat":26}', 5, 10, 2, 'Easy', 'International', 'Breakfast'),
('Butter Chicken', 'Tandoori-spiced chicken folded into a velvet tomato butter sauce.', 'https://images.unsplash.com/photo-1588166524941-3bf61a9c41db?w=1200&q=80', '["600g chicken thighs","1 cup yoghurt","2 tbsp garam masala","400g tomato passata","100g butter","1/2 cup cream","1 tbsp ginger garlic paste","1 tsp kashmiri chilli"]', '["Marinate chicken in yoghurt and spices for an hour.","Grill or pan-char the chicken until edges blacken.","Simmer passata with butter, ginger garlic and chilli for 20 minutes.","Blend the sauce smooth and stir in cream.","Add chicken and simmer 10 more minutes."]', '{"calories":680,"protein":45,"carbs":14,"fat":48}', 40, 60, 4, 'Medium', 'Indian', 'Dinner'),
('Lemon Ricotta Pancakes', 'Impossibly fluffy pancakes with bright lemon zest.', 'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=1200&q=80', '["1 cup ricotta","3 eggs, separated","3/4 cup flour","1 lemon, zested","2 tbsp sugar","1 tsp baking powder","Butter for frying"]', '["Whisk ricotta, yolks, zest and sugar together.","Fold in flour and baking powder.","Beat whites to soft peaks and fold through gently.","Cook in buttered pan, 2 minutes per side."]', '{"calories":390,"protein":18,"carbs":38,"fat":18}', 15, 15, 3, 'Easy', 'American', 'Breakfast'),
('Charred Street Corn Salad', 'Elote flavours in a bowl: lime, cotija and smoky chilli.', 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=1200&q=80', '["4 ears of corn","1/4 cup mayonnaise","1/2 cup cotija","1 lime","1 tsp smoked paprika","Coriander","Salt"]', '["Char the corn over a high flame until blistered.","Slice kernels off the cob into a bowl.","Fold through mayo, lime juice, paprika and cotija.","Finish with coriander and extra lime."]', '{"calories":280,"protein":9,"carbs":31,"fat":15}', 12, 10, 4, 'Easy', 'Mexican', 'Salad'),
('Dark Chocolate Lava Cakes', 'Crisp shell, molten centre, ready in twenty minutes.', 'https://images.unsplash.com/photo-1624353365286-3f8d62daad51?w=1200&q=80', '["120g dark chocolate","100g butter","2 eggs","2 egg yolks","60g sugar","30g flour","Cocoa for dusting"]', '["Melt chocolate and butter together until glossy.","Whisk eggs, yolks and sugar until pale.","Fold chocolate into eggs, then sift in flour.","Pour into buttered ramekins and bake at 200C for 10 minutes."]', '{"calories":510,"protein":8,"carbs":44,"fat":34}', 10, 15, 4, 'Medium', 'French', 'Dessert'),
('Green Goddess Grain Bowl', 'Herby dressing over quinoa, roast veg and crisp chickpeas.', 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=1200&q=80', '["1 cup quinoa","1 can chickpeas","1 avocado","1 cup basil and parsley","1/4 cup tahini","1 lemon","Olive oil","Cumin"]', '["Cook quinoa and let it cool slightly.","Roast chickpeas with cumin and oil until crunchy.","Blend herbs, tahini, lemon and water into a dressing.","Assemble bowls and pour over the green goddess dressing."]', '{"calories":520,"protein":19,"carbs":56,"fat":24}', 25, 15, 2, 'Easy', 'Mediterranean', 'Lunch'),
('Pad Thai', 'Tamarind-sweet noodles with prawns, peanuts and lime.', 'https://images.unsplash.com/photo-1559314809-0d155014e29e?w=1200&q=80', '["200g rice noodles","200g prawns","2 eggs","3 tbsp tamarind paste","2 tbsp fish sauce","2 tbsp palm sugar","Bean sprouts","Crushed peanuts","Lime"]', '["Soak the noodles until pliable.","Stir-fry prawns in a screaming hot wok, then set aside.","Scramble eggs, add noodles and sauce, toss quickly.","Return prawns, add sprouts, finish with peanuts and lime."]', '{"calories":580,"protein":30,"carbs":72,"fat":18}', 15, 20, 2, 'Medium', 'Thai', 'Dinner'),
('Slow Braised Short Ribs', 'Four hours in red wine until the meat gives way to a spoon.', 'https://images.unsplash.com/photo-1544025162-d76694265947?w=1200&q=80', '["1.5kg beef short ribs","1 bottle red wine","2 carrots","2 onions","4 cloves garlic","2 tbsp tomato paste","Beef stock","Thyme"]', '["Brown the ribs hard on every side.","Soften the vegetables, add tomato paste and cook out.","Deglaze with wine and reduce by half.","Return ribs, cover with stock and braise at 150C for 4 hours."]', '{"calories":820,"protein":58,"carbs":16,"fat":54}', 240, 30, 6, 'Hard', 'French', 'Dinner'),
('Cold Brew Tiramisu', 'No-bake, coffee-soaked and dangerously easy.', 'https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=1200&q=80', '["250g mascarpone","3 eggs, separated","70g sugar","200ml cold brew coffee","20 savoiardi biscuits","Cocoa powder"]', '["Whisk yolks and sugar until thick and pale.","Fold in mascarpone until smooth.","Beat whites to peaks and fold through.","Dip biscuits in coffee and layer with cream, chill 4 hours."]', '{"calories":460,"protein":10,"carbs":38,"fat":30}', 0, 25, 6, 'Easy', 'Italian', 'Dessert'),
('Shakshuka', 'Eggs poached in a smoky pepper and tomato stew.', 'https://images.unsplash.com/photo-1590412200988-a436970781fa?w=1200&q=80', '["6 eggs","2 red peppers","400g chopped tomatoes","1 onion","2 tsp cumin","1 tsp smoked paprika","Feta","Coriander"]', '["Soften onion and peppers in olive oil.","Add spices and cook until fragrant.","Pour in tomatoes and simmer 15 minutes.","Make wells, crack in the eggs, cover and cook 6 minutes.","Scatter feta and coriander."]', '{"calories":340,"protein":21,"carbs":18,"fat":21}', 25, 10, 3, 'Easy', 'Mediterranean', 'Breakfast');