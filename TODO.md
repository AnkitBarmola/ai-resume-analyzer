# Fix Frontend Button Errors (Missing PUT Endpoints & puter.ts)

## Plan Summary
- Missing `lib/puter.ts` (real API store using Django backend)
- Backend lacks PUT/PATCH/DELETE for resumes & analyze endpoint
- Steps below fix API integration for fs.upload, kv.set/get, ai.feedback used in upload/resume/wipe routes

## TODO Steps
- [x] Step 1: Create `lib/puter.ts` - Real Zustand store calling Django API (fs/kv/ai/auth mirroring mockStore.ts)
- [x] Step 2: Edit `backend/resumes/views.py` - Add `ResumeRetrieveUpdateDestroyView` & `AnalyzeView` (OpenAI integration)
- [x] Step 3: Edit `backend/resumes/urls.py` - Add `/resumes/<str:pk>/` & `/analyze/`
- [x] Step 4: Edit `backend/settings.py` - Add MEDIA_URL/ROOT for file uploads
- [ ] Step 5 MANUAL: cd backend && pip install openai python-dotenv && python manage.py makemigrations resumes && python manage.py migrate && python manage.py runserver (run in VSCode terminal)

- [ ] Step 6: Update frontend routes if needed (kv/fs to use new API paths)
- [ ] Step 7: Test frontend buttons (upload, wipe, resume load) - no more errors

**Next: Step 1**
