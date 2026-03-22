# MindBridge — Complete Setup Guide

## Project Structure

```
mindbridge/
├── web/                    # React web app (Vite)
├── app/                    # React Native + Expo (iOS & Android)
├── backend/                # Express.js API (AI routes)
└── supabase_schema.sql     # Database schema
```

---

## Step 1 — Set Up Supabase Database

1. Go to **supabase.com** → your project → **SQL Editor**
2. Click **New Query**
3. Copy and paste the entire contents of `supabase_schema.sql`
4. Click **Run**

This creates all tables, indexes, and security policies.

### Enable Authentication Providers

Go to **Authentication → Providers** in Supabase:

- **Email**: Already enabled by default ✅
- **Google**: Enable → paste your Google OAuth Client ID + Secret
- **Apple**: Enable → paste your Apple Service ID + Key

---

## Step 2 — Run the Backend (AI Server)

```bash
cd backend
npm install
npm run dev
```

Backend runs on **http://localhost:3001**

### Environment variables (backend/.env) ✅ Already configured:
- `ANTHROPIC_API_KEY` — your Claude API key
- `SUPABASE_URL` — your Supabase project URL
- `SUPABASE_ANON_KEY` — your Supabase anon key

---

## Step 3 — Run the Web App

```bash
cd web
npm install
npm run dev
```

Web app runs on **http://localhost:3000**

### Environment variables (web/.env) ✅ Already configured

---

## Step 4 — Run the Mobile App

```bash
cd app
npm install
npx expo start
```

- Press **i** for iOS Simulator
- Press **a** for Android Emulator
- Scan QR code with **Expo Go** app on your phone

### Environment variables (app/.env) ✅ Already configured

---

## Features

| Feature | Web | Mobile |
|---------|-----|--------|
| Email/Password Auth | ✅ | ✅ |
| Google Sign In | ✅ | ✅ |
| Apple Sign In | ✅ | ✅ |
| Daily Mood Check-in | ✅ | ✅ |
| Mood History Chart | ✅ | — |
| AI Journal (CBT) | ✅ | ✅ |
| AI Companion Chat | ✅ | ✅ |
| Streaming AI responses | ✅ | ✅ |
| Crisis Detection | ✅ | ✅ |
| Crisis Resources | ✅ | ✅ |
| Burnout Assessment | ✅ | ✅ |
| Breathing Exercise | ✅ | ✅ |
| 5-4-3-2-1 Grounding | ✅ | ✅ |
| Safety Plan Builder | ✅ | ✅ |
| Turkish + English | ✅ | ✅ |
| Streak Tracking | ✅ | ✅ |
| Dark Mode | — | ✅ (system) |

---

## Deploying to Production

### Backend → Railway or Render
1. Push `backend/` to GitHub
2. Connect to Railway.app or Render.com
3. Set environment variables from `backend/.env`
4. Deploy — get your production URL (e.g. `https://mindbridge-api.railway.app`)

### Web → Vercel
1. Push `web/` to GitHub
2. Connect to Vercel
3. Set `VITE_API_URL` to your production backend URL
4. Deploy

### Mobile → App Store + Google Play
1. Update `EXPO_PUBLIC_API_URL` in `app/.env` to production backend URL
2. `npx expo build:ios` for App Store
3. `npx expo build:android` for Google Play
4. You need Apple Developer ($99/yr) and Google Play Developer ($25 one-time) accounts

---

## Architecture

```
User → Web/Mobile App
         ↓
    Supabase Auth (login)
    Supabase DB (data storage)
         ↓
    Backend API (Express)
         ↓
    Anthropic Claude API (AI)
```

All user mental health data is stored in your own Supabase instance.
The backend never stores conversation content — it streams directly to the client.

---

## Ethics & Compliance Reminders

- The app includes disclaimers that MindBridge is NOT a therapist
- Crisis resources (182 TR / 988 US) are always free and visible
- All data is protected by Supabase Row Level Security
- For KVKK (Turkey) compliance: add a privacy policy page before going live
- For HIPAA (US): upgrade Supabase to a HIPAA-eligible plan if serving US users

---

## Support

Crisis resources hardcoded in the app:
- 🇹🇷 **ALO 182** — T.C. Sağlık Bakanlığı Psikolojik Destek
- 🇺🇸 **988** — Suicide & Crisis Lifeline
- 🌍 **112** — Emergency Services (Turkey)
