# MyActionList - Time Management Tool

A Flutter-based time management app combining the Eisenhower Matrix for prioritization with the Pomodoro Technique for focused work sessions.

## Features

- **Task Management**: Create, edit, delete, and organize tasks
- **Eisenhower Matrix**: Prioritize tasks into 4 quadrants (Urgent/Important)
- **Pomodoro Timer**: 25-min focus sessions with configurable breaks
- **Local-First Sync**: Data stored locally with cloud sync via Supabase
- **Cross-Device**: Access your tasks from any device
- **Focus Stats**: Track completed Pomodoro sessions per task

## Tech Stack

- **Frontend**: Flutter (iOS & Android)
- **Backend**: Supabase (PostgreSQL + Auth)
- **Local Storage**: SQLite via Supabase Flutter SDK
- **Authentication**: Hardcoded credentials (single user)

## Setup Instructions

### Prerequisites

1. Flutter SDK (3.0+)
   - [Install Flutter](https://flutter.dev/docs/get-started/install)
   - Verify: `flutter --version` and `flutter doctor`

2. Supabase Account (Free)
   - [Create Account](https://supabase.com)
   - Create a new project

### Installation

1. **Clone & Navigate**
   ```bash
   cd myactionlist
   ```

2. **Add Dependencies**
   ```bash
   flutter pub get
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

   -- Pomodoro Sessions Table
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
   
   Create/update `.env` in project root:
   ```
   SUPABASE_URL=https://your-project.supabase.co
   SUPABASE_ANON_KEY=your-anon-key
   ```
   
   Find these in Supabase Dashboard → Settings → API

5. **Run the App**
   
   ```bash
   # iOS
   flutter run -d ios
   
   # Android
   flutter run -d android
   
   # All devices
   flutter run
   ```

## Project Structure

```
lib/
├── main.dart              # App entry & theme setup
├── models/
│   ├── task.dart          # Task data model
│   └── pomodoro_session.dart
├── screens/
│   ├── home_screen.dart        # Task list
│   ├── eisenhower_screen.dart  # 2x2 matrix
│   ├── pomodoro_screen.dart    # Timer UI
│   └── add_task_screen.dart    # Create/edit tasks
└── services/
    └── supabase_service.dart   # API calls
```

## Usage

### Adding a Task
1. Tap **+** button on home screen
2. Enter title (required), notes, due date, tags
3. Tap "Create Task"

### Organizing (Eisenhower Matrix)
1. Switch to **Matrix** tab
2. **Drag tasks** into quadrants or click task to toggle completion
3. Color-coded guidance:
   - **Red**: Do Now (Urgent & Important)
   - **Green**: Schedule (Not Urgent & Important)
   - **Yellow**: Delegate (Urgent & Not Important)
   - **Gray**: Delete (Not Urgent & Not Important)

### Running Pomodoro
1. Tap **Timer icon** on task
2. Tap **Start** to begin 25-min focus session
3. On completion, choose Break or Done
4. Sessions auto-count on task

## Data Persistence

- **Local**: Tasks sync to device storage on load
- **Cloud**: Changes pushed to Supabase in real-time
- **Conflict Resolution**: Last-write-wins (timestamp-based)

## Credentials

Single-user setup (no login screen). Credentials are hardcoded in Flutter config to keep it simple.

## Future Enhancements

- [ ] Multiple users + authentication UI
- [ ] Calendar sync
- [ ] Habit tracking & streaks
- [ ] AI task suggestions
- [ ] Dark mode polish
- [ ] Notifications & reminders
- [ ] Task templates

## Troubleshooting

**"flutter: command not found"**
- Ensure Flutter SDK is in PATH
- Run `flutter doctor` for diagnostic info

**Supabase connection fails**
- Check `.env` credentials
- Verify network connection
- Check Supabase project is active

**Data not syncing**
- Verify `.env` SUPABASE_URL and SUPABASE_ANON_KEY
- Check Supabase RLS policies allow anon read/write
- Try **Sync Now** in settings

## License

MIT
