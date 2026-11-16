<<<<<<< HEAD
# Cook-Book---Your-Virtual-KItchen-Assistant
Cookbook is a smart virtual kitchen assistant that helps users discover recipes, understand ingredients, and follow step-by-step cooking instructions. It offers personalized suggestions and tips, making cooking easier, faster, and more enjoyable for both beginners and experienced users.
=======
# Kitchen Companion

You are an expert full-stack engineer and UI/UX designer specializing in Loveable and Supabase.

Build a production-ready web application called **CookBook – Your Virtual Kitchen Assistant**.

Do NOT create a basic CRUD project. Build a premium, startup-quality application with polished UI, smooth animations, responsive design, and clean architecture.

## Tech Stack

Frontend

- React

- TypeScript

- Vite

- Tailwind CSS

- shadcn/ui

- Framer Motion

- React Router

- TanStack Query

- React Hook Form

- Zod

- Lucide Icons

Backend

- Supabase

- PostgreSQL

- Supabase Auth

- Supabase Storage

- Row Level Security (RLS)

- Supabase Edge Functions only if required

Deploy using Loveable.

------------------------------------------------

## Design Style

Create a modern premium interface inspired by:

• Apple

• Airbnb

• Spotify

• Notion

Use

- Glassmorphism

- Soft shadows

- Rounded cards

- Beautiful gradients

- Micro interactions

- Animated page transitions

- Skeleton loading

- Dark mode

- Light mode

- Responsive layout

- Accessibility best practices

Color Palette

Primary

#FF6B35

Secondary

#F7B801

Accent

#2EC4B6

Dark

#111827

Light

#F9FAFB

Typography

Inter

------------------------------------------------

## Authentication

Use Supabase Authentication.

Features

✔ Email signup

✔ Email login

✔ Google Login

✔ Forgot Password

✔ Update Profile

✔ Secure Sessions

✔ Protected Routes

------------------------------------------------

## Database

Create normalized Supabase tables.

profiles

id

name

avatar

bio

created_at

recipes

id

title

description

image

ingredients (jsonb)

steps (jsonb)

cook_time

prep_time

servings

difficulty

cuisine

category

created_by

created_at

favorites

id

user_id

recipe_id

reviews

id

user_id

recipe_id

rating

review

created_at

search_history

id

user_id

query

created_at

meal_plans

id

user_id

date

recipe_id

shopping_lists

id

user_id

item

quantity

completed

------------------------------------------------

Enable Row Level Security.

Users can

• Read public recipes

• Create their own recipes

• Update only their recipes

• Delete only their recipes

• Manage only their favorites

------------------------------------------------

## Pages

Landing Page

Authentication

Dashboard

Recipe Explorer

Recipe Details

Favorites

My Recipes

Create Recipe

Edit Recipe

Meal Planner

Shopping List

Profile

Settings

404 Page

------------------------------------------------

## Home Page

Large animated hero

Beautiful search bar

Featured Recipes

Trending Recipes

Popular Categories

Recommended Recipes

Testimonials

FAQ

Newsletter

Footer

------------------------------------------------

## Recipe Search

Search by

Recipe Name

Ingredient

Cuisine

Category

Cooking Time

Difficulty

Include instant filtering and debounced search.

------------------------------------------------

## Recipe Details

Large hero image

Ingredients checklist

Cooking steps

Preparation time

Cooking time

Difficulty

Cuisine

Servings

Nutrition section

Ratings

Reviews

Related recipes

Bookmark button

Share button

Print button

------------------------------------------------

## Favorites

Save recipe

Remove recipe

Favorite collection

------------------------------------------------

## My Recipes

Create recipe

Edit recipe

Delete recipe

Upload images using Supabase Storage

Preview recipe before publishing

------------------------------------------------

## Meal Planner

Weekly calendar

Drag and drop recipes

Daily meal schedule

------------------------------------------------

## Shopping List

Generate shopping list automatically from selected recipes.

Allow checking off purchased items.

------------------------------------------------

## Dashboard

Statistics

Saved Recipes

Recent Searches

Favorite Cuisine

Recently Viewed

------------------------------------------------

## AI Features

Add an AI Assistant section.

Users can

• Enter available ingredients

• Receive recipe suggestions

• Ask cooking questions

Design the UI so an OpenAI API can be connected later.

------------------------------------------------

## Animations

Use Framer Motion.

Animated Cards

Animated Hero

Hover Effects

Smooth Navigation

Loading Skeletons

Page Transitions

------------------------------------------------

## Performance

Lazy loading

Optimized images

Code splitting

Pagination or infinite scrolling

------------------------------------------------

## Components

Navbar

Sidebar

Footer

Recipe Card

Search Bar

Filter Panel

Review Card

Rating Stars

Meal Calendar

Shopping List Card

Profile Card

Loading Skeletons

------------------------------------------------

## Loveable Requirements

Generate a complete working Loveable project.

Create all Supabase tables.

Generate SQL migrations.

Configure Authentication.

Configure Storage buckets.

Enable Row Level Security.

Generate reusable React components.

Use TypeScript everywhere.

Use best practices.

Avoid placeholder code.

Ensure every page is connected and functional.

The final application should look like a premium SaaS product rather than a college assignment.

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/79d99964-b63f-4ed0-875b-78d6655124ee).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
>>>>>>> ba4f9a5 (Initial commit)
