# Database Setup Guide

This guide will help you set up Supabase as the backend for your Social Memory application with user authentication and data persistence.

## 1. Create a Supabase Project

1. Go to [https://app.supabase.com](https://app.supabase.com)
2. Sign in or create an account
3. Click "New Project"
4. Choose your organization
5. Enter project details:
   - **Name**: `social-memory` (or your preferred name)
   - **Database Password**: Choose a secure password
   - **Region**: Choose the region closest to your users
6. Click "Create new project"
7. Wait for the project to be provisioned (this takes 1-2 minutes)

## 2. Get Your Project Credentials

Once your project is ready:

1. Go to **Settings** → **API** in your Supabase dashboard
2. Copy the following values:
   - **Project URL** (under "Project Configuration")
   - **Anon key** (under "Project API keys")

## 3. Configure Environment Variables

1. In your project root, copy the example environment file:
   ```bash
   cp .env.local.example .env.local
   ```

2. Edit `.env.local` and replace the placeholder values:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   ```

## 4. Set Up the Database Schema

1. In your Supabase dashboard, go to **SQL Editor**
2. Click "New query"
3. Copy the entire contents of `database/schema.sql` and paste it into the editor
4. Click "Run" to execute the schema creation
5. You should see a success message indicating all tables and policies were created

## 5. Configure Authentication

1. In your Supabase dashboard, go to **Authentication** → **Settings**
2. Under **Site URL**, add your local development URL:
   ```
   http://localhost:3000
   ```
3. Under **Redirect URLs**, add:
   ```
   http://localhost:3000/auth/callback
   ```

### Optional: Enable Google OAuth (Recommended)

1. Go to **Authentication** → **Providers**
2. Enable **Google** provider
3. You'll need to:
   - Create a Google Cloud Console project
   - Enable Google+ API
   - Create OAuth 2.0 credentials
   - Add the authorized redirect URI: `https://your-project-id.supabase.co/auth/v1/callback`
   - Copy the Client ID and Client Secret to Supabase

## 6. Test the Setup

1. Start your development server:
   ```bash
   npm run dev
   ```

2. Navigate to `http://localhost:3000`
3. You should be redirected to the login page
4. Try creating an account and logging in
5. After successful authentication, you should see the main dashboard

## 7. Database Structure

The application uses the following tables:

### `profiles`
- User profile information (automatically created when users sign up)
- Fields: `id`, `email`, `full_name`, `avatar_url`, `created_at`, `updated_at`

### `contacts`
- Main contact information
- Fields: `id`, `user_id`, `name`, `relationship`, `how_we_met`, `where_we_met`, `company`, `first_met_date`, `last_contact_date`, `tags`, `notes`

### `conversations`
- Records of conversations with contacts
- Fields: `id`, `contact_id`, `user_id`, `date`, `summary`, `topics`, `promises`, `mood`, `next_steps`

### `reminders`
- Reminders related to contacts
- Fields: `id`, `contact_id`, `user_id`, `date`, `title`, `description`, `type`, `completed`

### `personal_details`
- Personal details about contacts
- Fields: `id`, `contact_id`, `user_id`, `category`, `detail`, `importance`

## 8. Security Features

- **Row Level Security (RLS)**: Enabled on all tables
- **User Isolation**: Users can only access their own data
- **Secure Authentication**: Handled by Supabase Auth
- **Data Validation**: Database constraints ensure data integrity

## 9. Troubleshooting

### Common Issues

1. **"Invalid API key" error**:
   - Check that your environment variables are correctly set
   - Ensure you're using the anon key, not the service role key

2. **Database connection issues**:
   - Verify your project URL is correct
   - Check that your Supabase project is active

3. **Authentication redirects not working**:
   - Verify your redirect URLs are configured in Supabase
   - Check that the callback page exists at `/auth/callback`

4. **RLS policy errors**:
   - Ensure the schema was applied correctly
   - Check that all policies are created in the Supabase dashboard

### Getting Help

- Check the [Supabase Documentation](https://supabase.com/docs)
- Visit the [Supabase Discord](https://discord.supabase.com)
- Review the application logs in your browser's developer console

## 10. Production Deployment

When deploying to production:

1. Update your environment variables with production values
2. Add your production domain to Supabase's allowed origins
3. Configure proper redirect URLs for your production domain
4. Consider enabling additional security features like email confirmation
5. Set up database backups in your Supabase project settings

## Features Enabled

✅ **User Authentication**: Secure login/signup with email and password  
✅ **OAuth Integration**: Google sign-in support  
✅ **User Profiles**: Editable user profile management  
✅ **Data Persistence**: All contacts, conversations, and reminders saved to database  
✅ **Data Privacy**: Each user can only access their own data  
✅ **Real-time Ready**: Database structure supports real-time features  
✅ **Scalable**: Built on PostgreSQL for production scalability  

Your Social Memory application now has a robust, secure, and scalable backend! 🎉