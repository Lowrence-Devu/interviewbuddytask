# Deployment Guide

## Backend (Render)
- **URL**: https://task-w93b.onrender.com
- **Health Check**: https://task-w93b.onrender.com/api/health
- **Configuration**: Uses `render.yaml` for deployment
- **Database**: SQLite (file-based, persistent on Render)

## Frontend (Vercel)
- **URL**: https://interviewbuddytask-zclz.vercel.app
- **Configuration**: Uses `vercel.json` for deployment
- **Environment**: `VITE_API_URL=https://task-w93b.onrender.com`

## Local Development
```bash
# Backend
cd server && npm install && npm run init-db && npm run dev

# Frontend
cd client && npm install && npm run dev
```

## Environment Variables
- **Backend**: NODE_ENV=production, PORT=10000
- **Frontend**: VITE_API_URL=https://task-w93b.onrender.com
