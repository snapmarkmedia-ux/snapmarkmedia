# Supabase RBAC & Schema Maintenance Guide

This document explains the security architecture of the SnapMark Media backend and provides instructions for managing, maintaining, and scaling the system for future modules.

---

## 1. Role-Based Access Control (RBAC) Architecture

Security is built directly into the database engine using Supabase Row Level Security (RLS) policies. Instead of relying purely on frontend checks, permissions are validated at the SQL layer.

### System Workflow

```
[auth.users] (Supabase Auth Signup)
       │
       ▼ (Automatically triggered)
[public.profiles] (Role assigned: Default is 'user')
       │
       ▼ (RLS Check via get_user_role() function)
[RLS Policies] (Grants ALL privileges only if profile role is 'admin')
```

### The Role Resolution Helper
We use a Postgres function `get_user_role()` defined with `SECURITY DEFINER`. This runs with the privileges of the script executor, securely reading the `role` field from the `public.profiles` table for the user making the query (`auth.uid()`). This prevents infinite recursion issues when running RLS checks.

---

## 2. Table Schemas

### `profiles` Table
Stores user role data linked directly to their Authentication credentials.
* **id**: `uuid` (References `auth.users(id)` ON DELETE CASCADE)
* **email**: `text`
* **role**: `text` (Only allows `'admin'` or `'user'`. Defaults to `'user'`)

### `reviews` Table
Stores client testimonials and ratings.
* **id**: `uuid` (Primary Key)
* **full_name**: `text` (Max 100 characters)
* **profession**: `text` (Max 100 characters)
* **company**: `text` (Max 150 characters, optional)
* **service**: `text` (Required)
* **project_name**: `text` (Optional)
* **rating**: `integer` (Constraint: 1 to 5)
* **review**: `text` (Constraint: 20 to 1000 characters)
* **photo_url**: `text` (Public image link)
* **approved**: `boolean` (Default: `false`)

---

## 3. Storage Architecture

* **Bucket**: `review-images`
* **Visibility**: Public (anyone can retrieve files via public URLs)
* **Access Rules**:
  * **SELECT**: Open to public.
  * **INSERT / DELETE**: Restricted to users with the `admin` role in their profile.

---

## 4. How to Scale for Future Features

To add future modules (e.g. Blog CMS, Contact Form, Booking System), follow this standard blueprint:

### Step 1: Create the Table & Enable RLS
Always enable RLS immediately upon table creation to secure it.
```sql
CREATE TABLE public.blog_posts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    author_id UUID REFERENCES public.profiles(id) DEFAULT auth.uid()
);

ALTER TABLE public.blog_posts ENABLE ROW LEVEL SECURITY;
```

### Step 2: Define Role-Based RLS Policies
Map out standard policies utilizing the `public.get_user_role()` function.
```sql
-- 1. Read Policy: Everyone can read blog posts
CREATE POLICY "Anyone can read blog posts" ON public.blog_posts
    FOR SELECT USING (true);

-- 2. Modifying Policy: Only admins can manage posts
CREATE POLICY "Only admins can manage blog posts" ON public.blog_posts
    FOR ALL USING (public.get_user_role() = 'admin');
```

---

## 5. Standard Moderation Operations (SQL Console Cheat Sheet)

### How to Grant Admin Access to a User
To make a user an administrator, change their role in their profile row:
```sql
UPDATE public.profiles
SET role = 'admin'
WHERE email = 'admin@snapmarkmedia.com';
```

### How to Manually Moderate (Approve/Reject) Reviews
```sql
-- Approve
UPDATE public.reviews SET approved = true WHERE id = 'REVIEW_UUID_HERE';

-- Reject (Delete)
DELETE FROM public.reviews WHERE id = 'REVIEW_UUID_HERE';
```
