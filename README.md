# Campus Portal

A comprehensive web application for campus news, announcements, and activity management.

## Tech Stack
- **Backend**: Node.js, Express, MongoDB (Mongoose)
- **Frontend**: React, Vite, Tailwind CSS

## Directory Structure
- `backend/`: Server-side code
- `frontend/`: Client-side code

## Local Development

### Prerequisites
- Node.js installed
- MongoDB installed and running locally

### Backend Setup
1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file based on `.env.example`:
   ```bash
   cp .env.example .env
   ```
4. Start the development server:
   ```bash
   npm run dev
   ```

### Frontend Setup
1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file based on `.env.example` (if needed):
   ```bash
   cp .env.example .env
   ```
4. Start the development server:
   ```bash
   npm run dev
   ```

## Deployment

### Backend (Render)
- **Root Directory**: `backend`
- **Build Command**: `npm install`
- **Start Command**: `npm start`
- **Environment Variables**: Set `PORT`, `MONGO_URI`, `JWT_SECRET`, etc. in the Render dashboard.

### Frontend (Vercel)
- **Root Directory**: `frontend`
- **Framework Preset**: Vite
- **Build Command**: `npm run build`
- **Output Directory**: `dist`
- **Environment Variables**: Set `VITE_API_URL` (e.g., your Render backend URL) in the Vercel dashboard.
