# Social Memory - AI-Powered Personal CRM

<img width="1421" height="627" alt="Screenshot 2025-07-19 at 8 39 15 PM" src="https://github.com/user-attachments/assets/99d8c45d-5af9-435b-a0d5-21558cccf490" />


> Never forget what matters to the people who matter.

Social Memory is a personal, private AI "CRM for your life" that helps you remember, manage, and deepen all your human connections effortlessly.

## 🚀 Features

### Core Features
- **Memory Bank**: Keep track of everyone you meet with detailed profiles
- **Conversation Timeline**: Record and review past conversations
- **Smart Reminders**: Set follow-ups, birthdays, and important dates
- **AI Insights**: Get suggestions on when and how to reconnect
- **Powerful Search**: Find contacts by name, tags, location, or any detail
- **Relationship Tracking**: Categorize connections (friends, colleagues, family, etc.)

### What Makes It Unique
- **Personal Focus**: Unlike business CRMs, this is designed for personal relationships
- **Privacy First**: All data stored locally in your browser
- **AI-Powered**: Smart suggestions based on conversation patterns and timing
- **Natural Interface**: Quick notes like "Met Priya at Dan's party. UX designer. Loves dogs."

## 🛠️ Tech Stack

- **Frontend**: Next.js 14 with TypeScript
- **Styling**: Tailwind CSS with custom components
- **UI Components**: Radix UI primitives
- **Icons**: Lucide React
- **Date Handling**: date-fns
- **Storage**: Browser localStorage (privacy-focused)

## 📦 Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/social-memory.git
cd social-memory
```

2. Install dependencies:
```bash
npm install
```

3. Run the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

## 🔧 Configuration

### Environment Variables (Optional)
Create a `.env.local` file for AI integration:
```env
OPENAI_API_KEY=your_api_key_here  # For enhanced AI features
```

## 📱 Usage

### Adding a Contact
1. Click "Add Contact" button
2. Fill in basic information:
   - Name
   - How you met
   - Where you met
   - Relationship type
   - Initial notes and tags

### Recording Conversations
1. Open a contact's profile
2. Click "Add" under Conversations
3. Write a quick summary of what you discussed
4. The app automatically timestamps and saves it

### Setting Reminders
1. In a contact's profile, go to Reminders
2. Add title, date, and optional description
3. Get notified when it's time to follow up

### AI Insights
- The app analyzes your interaction patterns
- Suggests when to reconnect if it's been too long
- Provides conversation starters based on past discussions
- Reminds you of promises made or important dates mentioned

## 🏗️ Project Structure

```
social-memory/
├── app/                    # Next.js app directory
│   ├── page.tsx           # Main application page
│   ├── layout.tsx         # Root layout
│   └── globals.css        # Global styles
├── components/            # React components
│   ├── ContactCard.tsx    # Contact list item
│   ├── ContactDetail.tsx  # Detailed contact view
│   ├── AddContactForm.tsx # New contact form
│   └── ui/               # Reusable UI components
├── lib/                   # Utility functions
│   ├── storage.ts        # localStorage helpers
│   └── utils.ts          # General utilities
├── types/                # TypeScript type definitions
└── public/              # Static assets
```

## 🔐 Privacy & Security

- **Local Storage**: All data stored in browser localStorage
- **No Cloud Sync**: Your data never leaves your device
- **Export/Import**: Backup your data anytime (coming soon)
- **Encryption**: Optional encryption for sensitive data (coming soon)

## 🚀 Future Enhancements

- [ ] WhatsApp/Email integration for auto-suggestions
- [ ] Voice notes for quick memory capture
- [ ] Photo attachments for visual memories
- [ ] Calendar integration for automatic reminders
- [ ] Export to CSV/JSON for data portability
- [ ] Mobile app with offline support
- [ ] End-to-end encryption option
- [ ] Multi-device sync with privacy

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- Inspired by the need to maintain meaningful connections in our busy lives
- Built with modern web technologies for the best user experience
- Designed with privacy and user control as core principles

---

**Remember**: The best relationships are built on remembering what matters to the people who matter to you. Social Memory is here to help you do just that.

## Authentication Fixes Applied

The authentication system has been completely overhauled to fix the login loop issues:

### Issues Fixed:

1. **Login Loop Issue**: Users would sign in successfully but get redirected back to the auth page
2. **Profile Creation Errors**: Database profile creation was failing silently
3. **Missing Environment Variables**: The `.env.local` file was missing
4. **Callback Redirect Problems**: Auth callback was redirecting to wrong routes
5. **Loading State Issues**: Authentication loading states were not properly managed

### Key Changes Made:

1. **Fixed Auth Callback (`/app/auth/callback/page.tsx`)**:
   - Now properly redirects to main app (`/`) after successful authentication
   - Added better error handling and logging
   - Improved session validation

2. **Improved AuthContext (`/contexts/AuthContext.tsx`)**:
   - Better loading state management
   - Graceful profile creation error handling
   - Prevents infinite loading states
   - Added proper authentication state transitions

3. **Enhanced Auth Page (`/app/auth/page.tsx`)**:
   - Prevents access when user is already authenticated
   - Better error message handling from URL parameters
   - Improved redirect logic after successful auth

4. **Database Profile Creation (`/lib/database.ts`)**:
   - Handles duplicate profile creation gracefully
   - Better error handling for database constraints
   - Fallback profile creation for edge cases

5. **Environment Setup**:
   - Created `.env.local` with proper Supabase credentials
   - Validated Supabase configuration

### Testing the Authentication Flow:

1. **Sign Up Test**:
   - Go to `/auth`
   - Switch to "Sign Up" tab
   - Enter email, password, and full name
   - Click "Create Account"
   - Check email for verification link (if email confirmation is enabled)
   - Should redirect to main app upon successful signup

2. **Sign In Test**:
   - Go to `/auth`
   - Enter valid email and password
   - Click "Sign In"
   - Should redirect to main app immediately

3. **Google OAuth Test**:
   - Go to `/auth`
   - Click "Google" button
   - Complete Google OAuth flow
   - Should redirect back to app via `/auth/callback` then to main app

4. **Session Persistence Test**:
   - Sign in successfully
   - Refresh the page
   - Should remain logged in and stay on main app
   - Should not redirect to auth page

### Debug Information:

- Check browser console for authentication logs
- All auth state changes are logged with `console.log`
- Error messages are displayed via toast notifications
- Loading states are properly indicated in the UI
