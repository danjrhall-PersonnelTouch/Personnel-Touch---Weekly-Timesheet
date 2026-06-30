# Personnel Touch Timesheet — Setup Guide (v2: live supervisor links + payroll PDF links)

## What changed from the drag-and-drop version

This version needs a small piece of "backend" so a supervisor's link and a
payroll download link actually work. The backend is a single Netlify
Function using Netlify Blobs (built-in storage). Still 100% free, but it
means **drag-and-drop won't work anymore** — Netlify needs to "build" the
project so it can run that function. The fix is to connect it via GitHub
instead, which is still simple and still free.

## One-time setup (about 10–15 minutes)

### 1. Create a GitHub account (if you don't have one)
Go to github.com and sign up — free.

### 2. Create a new repository
- Click "New repository"
- Name it something like `pt-timesheet`
- Keep it Private (recommended) or Public — either works
- Click "Create repository"

### 3. Upload the files
- On the new repo page, click "uploading an existing file"
- Drag in everything from the `pt-timesheet` folder I've given you
  (index.html, netlify.toml, package.json, and the netlify folder with
  timesheet.js inside it — keep the folder structure intact)
- Click "Commit changes"

### 4. Connect Netlify to that GitHub repo
- Go to netlify.com → sign up (free) → "Add new site" → "Import an existing project"
- Choose GitHub, then select the `pt-timesheet` repo
- Build settings: leave everything as default (Netlify will detect the
  netlify.toml automatically)
- Click "Deploy"

### 5. Done
Netlify will give you a live URL like `https://your-site-name.netlify.app`.
That's the link to share with employees, or to point your Resources page
icon to.

## How the new flow works

1. **Employee** fills in hours, signs, enters supervisor's email, taps "Send
   for sign-off." The app saves their data to free Netlify storage and
   emails the supervisor a unique link like `yoursite.netlify.app/?id=ab12cd34`
2. **Supervisor** opens that link on their own phone/computer — their data
   loads automatically, they review, add their details, and sign
3. The app generates the final PDF, saves it, and emails payroll a link like
   `yoursite.netlify.app/?download=ab12cd34` — clicking it downloads the PDF
   straight away
4. Both the employee and supervisor can also download a copy for their own
   records at any point after signing

## Re-deploying after future changes

Any time I update the code, you just need to re-upload the changed files to
the same GitHub repo (or I can show you how to do it via git so it's a
single click). Netlify automatically redeploys within about a minute of any
GitHub change.

## Cost

Still completely free — Netlify Blobs storage and Netlify Functions are
both included in the free tier, and a small internal tool like this will
never come close to the limits.
