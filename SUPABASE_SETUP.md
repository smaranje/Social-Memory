# Supabase Setup Guide

## Quick Fix for Current Error

I've created a `.env.local` file with the required environment variables. To fix the current error, you need to replace the placeholder values with your actual Supabase credentials.

## Step-by-Step Setup

### 1. Create a Supabase Project (if you haven't already)

1. Go to [https://supabase.com](https://supabase.com)
2. Sign in or create an account
3. Click "New Project"
4. Choose your organization
5. Fill in project details:
   - **Name**: Choose a name for your project
   - **Database Password**: Create a secure password (save this!)
   - **Region**: Choose the closest region to your users
6. Click "Create new project"
7. Wait for the project to be set up (usually takes 2-3 minutes)

### 2. Get Your Supabase Credentials

1. In your Supabase dashboard, go to **Settings** → **API**
2. You'll find two important values:
   - **Project URL**: Looks like `https://abcdefghijklmnop.supabase.co`
   - **Project API Keys** → **anon public**: A long JWT token starting with `eyJ...`

### 3. Update Your Environment Variables

1. Open the `.env.local` file in your project root
2. Replace the placeholder values:

```env
# Replace with your actual Supabase project URL
NEXT_PUBLIC_SUPABASE_URL=https://your-actual-project-id.supabase.co

# Replace with your actual anon key
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.your-actual-anon-key
```

### 4. Set Up the Database Schema

Follow the instructions in `DATABASE_SETUP.md` to set up your database tables and policies.

### 5. Test the Configuration

1. Save the `.env.local` file
2. Restart your development server:
   ```bash
   npm run dev
   ```
3. The error should now be resolved!

## Security Notes

- ✅ The `.env.local` file is already added to `.gitignore` - your credentials won't be committed to git
- ✅ `NEXT_PUBLIC_*` variables are safe to expose in the browser (they're public keys)
- ⚠️ Never commit actual credentials to your repository
- ⚠️ If you need server-side only keys, use environment variables without the `NEXT_PUBLIC_` prefix

## Troubleshooting

### Error: "Supabase configuration missing"
- Check that `.env.local` exists in your project root
- Verify both environment variables are set with actual values (not placeholders)
- Restart your development server after making changes

### Error: "Invalid API key"
- Double-check you copied the **anon public** key, not the service role key
- Make sure there are no extra spaces or characters
- Verify the key starts with `eyJ`

### Error: "Invalid project URL"
- Ensure the URL includes `https://`
- Verify the project ID in the URL matches your Supabase project
- Check for typos in the URL

## Need Help?

- Check the [Supabase Documentation](https://supabase.com/docs)
- Review `DATABASE_SETUP.md` for database configuration
- Review `README.md` for general project setup