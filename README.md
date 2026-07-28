# MyActionList - Time Management Tool

A React web app combining the Eisenhower Matrix for prioritization with the Pomodoro Technique for focused work sessions. Hosted on GitHub Pages.

## Features

- **Task Management**: Create, edit, delete, and organize tasks
- **Eisenhower Matrix**: Prioritize tasks into 4 quadrants (Urgent/Important) with drag-and-drop
- **Pomodoro Timer**: 25-min focus sessions with 5/15-min breaks
- **Real-Time Sync**: Tasks synced to Supabase cloud instantly
- **Responsive Design**: Works on desktop and mobile browsers
- **Focus Stats**: Track completed Pomodoro sessions per task

## Tech Stack

- **Frontend**: React 18 + Vite
- **State Management**: Zustand
- **Backend**: Supabase (PostgreSQL)
- **Hosting**: GitHub Pages
- **Authentication**: Hardcoded credentials (single user)

## Setup Instructions

### Prerequisites

1. Node.js 16+ and npm
   - [Download Node.js](https://nodejs.org/)
   - Verify: `node --version` and `npm --version`

2. Supabase Account (Free)
   - [Create Account](https://supabase.com)
   - Create a new project

3. GitHub Account
   - For deploying to GitHub Pages

### Installation

1. **Clone Repository**
   ```bash
   git clone https://github.com/yourusername/myactionlist.git
   cd myactionlist
   ```

2. **Install Dependencies**
   ```bash
   npm install
   ```

3. **Create Supabase Tables**
   
   Go to your Supabase project → SQL Editor and run:
   
   ```sql
   -- Tasks Table
   CREATE TABLE tasks (
     id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
     title text NOT NULL,
     notes text,
     due_date timestamp,
     tags text[],
     quadrant text DEFAULT 'unassigned',
     order_index int DEFAULT 0,
     status text DEFAULT 'pending',
     pomodoro_count int DEFAULT 0,
     created_at timestamp DEFAULT now(),
     updated_at timestamp DEFAULT now()
   );

   -- Pomodoro Sessions Table (optional for future expansion)
   CREATE TABLE pomodoro_sessions (
     id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
     task_id uuid REFERENCES tasks(id) ON DELETE CASCADE,
     start_time timestamp NOT NULL,
     end_time timestamp,
     type text,
     completed boolean DEFAULT false,
     created_at timestamp DEFAULT now()
   );

   -- Indexes for faster queries
   CREATE INDEX idx_tasks_quadrant ON tasks(quadrant);
   CREATE INDEX idx_sessions_task ON pomodoro_sessions(task_id);
   ```

4. **Configure Environment**
   
   Create `.env` in project root:
   ```
   VITE_SUPABASE_URL=https://your-project.supabase.co
   VITE_SUPABASE_ANON_KEY=your-anon-key
   ```
   
   Find these in Supabase Dashboard → Settings → API

5. **Run Locally**
   
   ```bash
   npm run dev
   ```
   
   Open http://localhost:5173 in your browser

6. **Deploy to GitHub Pages**
   
   ```bash
   npm run build
   npm run deploy
   ```
   
   Your app will be live at: `https://yourusername.github.io/myactionlist/`

## Project Structure

```
src/
├── main.jsx              # React entry point
├── App.jsx               # Main app component & routing
├── index.css             # Global styles
├── components/
│   ├── TaskList.jsx      # Task list view
│   ├── TaskCard.jsx      # Individual task component
│   ├── AddTaskModal.jsx  # Create task form
│   ├── EisenhowerMatrix.jsx  # 2x2 drag-and-drop matrix
│   └── PomodoroTimer.jsx # Focus timer
└── store/
    └── taskStore.js      # Zustand store (state + Supabase calls)
```

## Usage

### Adding a Task
1. Click **+** button (bottom-right on desktop, or visible on mobile)
2. Enter title (required), notes, due date, tags
3. Click "Create Task"

### Task List View
- **Checkbox**: Mark tasks complete
- **⏱ Timer**: Start a Pomodoro session
- **🗑 Delete**: Remove task (with confirmation)
- Tasks grouped into Pending and Completed sections
- Displays due dates and Pomodoro session count

### Organizing (Eisenhower Matrix)
1. Switch to **⊞ Matrix** tab
2. **Drag tasks** between quadrants to prioritize
3. Click checkbox on any task to mark complete
4. Color-coded guidance:
   - **🔴 Red**: Do Now (Urgent & Important)
   - **🟢 Green**: Schedule (Not Urgent & Important)
   - **🟡 Yellow**: Delegate (Urgent & Not Important)
   - **⚫ Gray**: Delete (Not Urgent & Not Important)

### Running Pomodoro
1. Click **⏱** button on any task
2. Click **Start** to begin 25-min focus session
3. Timer counts down with visual feedback
4. On completion, choose:
   - **Long Break (15 min)** if 4 sessions completed
   - **Short Break (5 min)** otherwise
   - **Done** to close
5. Sessions auto-increment on task

## Data Persistence

- **Cloud-First**: All tasks sync to Supabase instantly
- **Real-Time**: Changes across tabs/devices sync automatically
- **Offline**: App works offline (syncs when reconnected)
- **Conflict Resolution**: Last-write-wins (timestamp-based)

## Credentials

Single-user setup (no login screen needed). Environment variables in `.env` control Supabase access.

## Environment Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `VITE_SUPABASE_URL` | Supabase project URL | `https://abc123.supabase.co` |
| `VITE_SUPABASE_ANON_KEY` | Public anon key (safe in frontend) | `eyJhbGc...` |

Get these from Supabase Dashboard → Settings → API.

## GitHub Pages Deployment

### First Time Setup
1. Push code to GitHub: `git push origin main`
2. Go to repo → Settings → Pages
3. Set **Source** to `Deploy from a branch`
4. Set **Branch** to `gh-pages` (will be created by deploy script)
5. Run: `npm run deploy`

### Subsequent Deployments
```bash
npm run build  # Build for production
npm run deploy # Deploy to gh-pages branch
```

Your site will update at `https://yourusername.github.io/myactionlist/` (refresh to see changes).

## Performance Tips

- Pomodoro timer uses native browser timers (minimal CPU)
- Tasks loaded once, then use Supabase real-time
- Drag-and-drop uses native DOM API
- CSS optimized with Flexbox/Grid

## Browser Support

- Chrome/Edge 90+
- Firefox 88+
- Safari 14+
- Mobile browsers (iOS Safari, Chrome Mobile)

## Future Enhancements

- [ ] Real-time collaboration (multi-user sync)
- [ ] Calendar integration
- [ ] Habit tracking & streaks
- [ ] AI task prioritization
- [ ] Dark mode toggle
- [ ] Push notifications
- [ ] Task templates
- [ ] Analytics dashboard

## Troubleshooting

**"Command not found: npm"**
- Install Node.js from https://nodejs.org/
- Verify: `npm --version`

**Blank page after `npm run dev`**
- Check console for errors (F12 → Console)
- Ensure `.env` has valid Supabase credentials
- Try: `npm run dev` again

**Supabase connection fails**
- Verify `.env` VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY
- Check Supabase project is active
- Test endpoint in browser: `https://your-project.supabase.co/rest/v1/`

**Tasks not saving**
- Check `.env` credentials are correct
- Open browser DevTools (F12) → Network tab
- Look for failed requests to Supabase
- Verify Supabase tables exist (run SQL in Setup)

**GitHub Pages shows 404**
- Verify repo name matches: `github.com/yourusername/myactionlist`
- Check vite.config.js has correct `base: '/myactionlist/'`
- Clear browser cache and refresh
- Deploy branch is set to `gh-pages` in GitHub Settings

## License

MIT
