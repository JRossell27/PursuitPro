# PursuitPro - Job Application Tracker

A comprehensive job application tracking system with URL scraping capabilities and secure user authentication.

## Features

- 🔐 **Secure Authentication**: Email/password login with encrypted passwords
- 🌐 **Smart Job Scraping**: Auto-extract job details from LinkedIn, Indeed, Glassdoor, and other sites
- 📊 **Progress Analytics**: Track your application status and success metrics
- 🔒 **Private Data**: Each user has completely separate, secure data
- 📱 **Responsive Design**: Works great on desktop and mobile

## Local Development

1. Clone the repository
2. Install dependencies: `npm install`
3. Set up environment variables (see below)
4. Run database migrations: `npx prisma migrate dev`
5. Start development server: `npm run dev`

## Environment Variables

Create a `.env` file with:

```env
# Database
DATABASE_URL="your-database-url-here"

# NextAuth
NEXTAUTH_URL="https://your-app-name.onrender.com"
NEXTAUTH_SECRET="your-secret-key-here"
```

## Deploy to Render

### Quick Deploy (Recommended)

1. Fork this repository to your GitHub account
2. Go to [Render.com](https://render.com) and sign up/sign in
3. Click "New +" → "Web Service"
4. Connect your GitHub account and select this repository
5. Render will automatically detect the `render.yaml` file
6. Set these environment variables in Render:
   - `NEXTAUTH_URL`: `https://your-app-name.onrender.com`
   - `NEXTAUTH_SECRET`: Generate a random string (32+ characters)
   - `DATABASE_URL`: Will be automatically provided by Render PostgreSQL
7. Click "Deploy"

### Manual Setup

If you prefer manual setup:

1. Create a new Web Service on Render
2. Set build command: `npm install && npm run build`
3. Set start command: `npm start`
4. Add environment variables (see above)
5. Create a PostgreSQL database and link it

## How to Use

1. Visit your deployed app
2. Click "Get Started" to create an account
3. Sign up with email and password
4. Start adding job applications:
   - Paste job URLs for auto-scraping
   - Or manually enter job details
   - Track status changes and progress

## Tech Stack

- **Frontend**: Next.js 15, React, TailwindCSS
- **Backend**: Next.js API Routes
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: NextAuth.js with credentials
- **Deployment**: Render

## Security

- Passwords are hashed using bcrypt
- Each user's data is completely isolated
- Secure session management with NextAuth.js
- Environment variables for sensitive data
