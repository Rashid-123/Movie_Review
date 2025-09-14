# Movie Review Platform

A full-stack web application for Moive review .
## Deployment

### Frontend Deployment Link
(https://movie-review-i284.vercel.app/)

### Backend Deployment Link
(https://filmflix-azce.onrender.com)

##tech stack

- React.js
- Node.js
- MongoDB
- Express

## Features

- User authentication and authorization
- Browse and filter movies
- Write and read movie reviews
- Rate movies (1-5 stars)
- User profiles and watchlist 
- Responsive design for all devices

## Tech Stack

**Frontend:**
- React.js
- Telwind

**Backend:**
- Node.js
- Express.js
- MongoDB
- JWT Authentication

## Project Structure

```
movie-review-platform/
├── frontend/          # React frontend application
├── backend/           # Node.js backend API
└── README.md
```

## Prerequisites

- Node.js (v16 or higher)
- git

## Installation & Setup

### Backend Setup

1. Navigate to the backend directory:
```bash
cd server
```

2. Install dependencies:
```bash
npm install
```

3. Create environment variables file:
```bash
.env
```

4. Configure your environment variables (see Environment Variables section)

5. Start the development server:
```bash
npm run dev
```

The backend will run on `http://localhost:5000`

### Frontend Setup

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Create environment variables file:
```bash
.env
```

4. Configure your environment variables (see Environment Variables section)

5. Start the development server:
```bash
npm start
```

The frontend will run on `http://localhost:5173`

## Environment Variables

### Backend (.env)

Create a `.env` file in the backend directory with the following variables:

```env
PORT=5000

MONGODB_URI= YOUR_MONGODB_URI


JWT_SECRET=YOUR_JWT_SECRET
JWT_EXPIRES_IN=7d


CLIENT_URL=http://localhost:5173
```

### Frontend (.env)

Create a `.env` file in the frontend directory with the following variables:

```env
# API Configuration
VITE_API_URL=http://localhost:5000
```

## Available Scripts

### Backend Scripts

```bash
npm run dev          # Start development server with nodemon
npm start           # Start production server

```

### Frontend Scripts

```bash
npm run dev           # Start development server

```

