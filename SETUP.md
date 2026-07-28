# Time Management Tool - Flutter Setup

## Prerequisites
1. Install Flutter SDK from https://flutter.dev/docs/get-started/install
2. Verify installation: `flutter --version`
3. Ensure you have a code editor (VS Code with Flutter extension recommended)

## Project Setup

### 1. Create Flutter Project
```bash
cd myactionlist
flutter create --org com.myactionlist app
cd app
```

### 2. Add Dependencies
Run this command to add required packages:
```bash
flutter pub add supabase flutter_dotenv uuid intl
```

### 3. Configure Supabase
1. Create a free Supabase project at https://supabase.com
2. Create the following tables with SQL (in Supabase SQL Editor):

```sql
-- Tasks Table
create table tasks (
  id uuid primary key default uuid_generate_v4(),
  title text not null,
  notes text,
  due_date timestamp,
  tags text[],
  quadrant text default 'unassigned',
  order_index int default 0,
  status text default 'pending',
  pomodoro_count int default 0,
  created_at timestamp default now(),
  updated_at timestamp default now()
);

-- Pomodoro Sessions Table
create table pomodoro_sessions (
  id uuid primary key default uuid_generate_v4(),
  task_id uuid references tasks(id) on delete cascade,
  start_time timestamp,
  end_time timestamp,
  type text,
  completed boolean default false,
  created_at timestamp default now()
);
```

3. Create `.env` file in app directory with your Supabase credentials:
```
SUPABASE_URL=your_supabase_url
SUPABASE_ANON_KEY=your_anon_key
```

### 4. Run App
```bash
cd app
flutter run
```

## Credentials
For this single-user setup, hardcoded credentials are used in the app. No external login required.
