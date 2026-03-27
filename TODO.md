# Django Backend Migration: Remove Puter.js

## Step 1: Project Setup (Completed)
- [x] Create TODO.md ✅

## Step 2: Django Backend Setup (Mostly Completed)
- [x] Install Django + deps (global) ✅
- [x] Create Django project (`backend/`) ✅
- [ ] Configure settings.py
- [ ] python manage.py migrate
- [ ] Create apps


## Step 3: Django Models & Serializers
- Resume model (id, user, company, job_title, job_desc, pdf_file, image_file, feedback JSONField, created_at)
- User profile if needed
- Serializers for Resume

## Step 4: Django Views/URLs (API Endpoints)
- Auth: /api/auth/login, /api/auth/register (JWT)
- Resumes: /api/resumes/ (list/create/delete for user)
- Files: /api/files/upload/ (PDF/image handling)
- AI: /api/ai/analyze/ (POST: job_desc + pdf_file → feedback JSON)

## Step 5: Frontend Changes - Remove Puter
- Delete lib/puter.ts, types/puter.d.ts
- Remove Puter script from app/root.tsx

## Step 6: New Frontend Store
- Create lib/backendStore.ts (Zustand: auth, resumes CRUD, fs read/upload, ai analyze)
- Update types/index.d.ts

## Step 7: Migrate Components/Routes (~10 files)
- Replace usePuterStore → useBackendStore
- Update upload.tsx: POST to /api/ai/analyze with FormData (pdf + job details)
- Update home.tsx/resume.tsx: fetch resumes from /api/resumes
- Navbar/ResumeCard: auth checks via token

## Step 8: Run & Test
- Backend: python manage.py runserver
- Frontend: npm run dev (proxy API or CORS)
- Test full flow: register → upload → analyze → list → view
- Error handling, loading states

## Step 9: Polish & Deploy
- Add rate limiting, validation
- Deploy: Railway/Render for Django, Vercel for frontend

**Puter.js removed, app uses mockStore. Ready for GitHub PR. Django backend parked.**
