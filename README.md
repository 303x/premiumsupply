
# PREMIUM PEPTIDES V2

Deployable Next.js + Supabase version of the Lux Ocean member site.

## Included
- Referral-only sign-up
- Manual member approval
- Protected member store
- Admin product manager
- Direct image upload to Supabase Storage
- Product information + dosing fields
- Supabase database and Row Level Security policies
- Lux Ocean visual design

## 1. Create Supabase project
Create a new Supabase project, then open SQL Editor and run:

`supabase/schema.sql`

## 2. Create your admin account
Sign up through the website once. Then in Supabase SQL Editor run:

```sql
update public.profiles
set role='admin', status='approved'
where email='YOUR_EMAIL_HERE';
```

## 3. Environment variables
Copy `.env.example` to `.env.local` and enter:
- NEXT_PUBLIC_SUPABASE_URL
- NEXT_PUBLIC_SUPABASE_ANON_KEY

These values are available in Supabase Project Settings > API.

## 4. Run locally
```bash
npm install
npm run dev
```

Open http://localhost:3000

## 5. Deploy to Vercel
1. Put this project in a GitHub repository.
2. Import the repository into Vercel.
3. Add the two Supabase environment variables in Vercel.
4. Deploy.
5. Connect your custom domain in Vercel > Settings > Domains.

## Editing after launch
Products, product images and member approvals are handled in `/admin` and do not require redeploying.
Design, layout or functionality changes are made in the code and redeployed through Vercel.
