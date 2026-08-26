# Borana Education Support Programme

A professional scholarship management portal for the Borana Education Support Programme.

Students can upload term results and fee structures, track academic performance, view announcements, and message administrators. Administrators can review submissions, manage scholars, post announcements, view analytics, and respond to messages.

## Tech Stack

- React 19 + TypeScript
- Vite
- Tailwind CSS v4
- Zustand (state management)
- React Router
- Recharts
- Lucide React (icons)
- Sonner (toasts)

## Getting Started

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

Open [http://localhost:5173](http://localhost:5173).

## Demo Accounts

| Role    | Email                  | Password    |
|---------|------------------------|-------------|
| Admin   | admin@mara.org         | admin123    |
| Student | aisha.m@email.com      | student123  |
| Student | john.okoro@email.com   | student123  |

## Features

### Student Portal
- Dashboard with key academic and fee metrics
- Upload term results and fee structures
- Academic performance curve
- Announcements feed
- Messaging with administrators

### Admin Portal
- Scholar directory with filtering and search
- Pending term upload review and approval
- Student detail view with performance history
- Analytics dashboard
- Announcement management
- Student messaging inbox

## Project Structure

```
src/
├── components/
│   ├── layout/     # Sidebar, TopBar
│   └── ui/         # ThemeToggle
├── pages/
│   ├── auth/       # Login
│   ├── student/    # Student portal pages
│   └── admin/      # Admin portal pages
├── store/          # Zustand stores
├── types/          # Shared TypeScript types
└── lib/            # Utility helpers
```

## Notes

- All currency values are displayed in Kenyan Shillings (KSh).
- Theme preference (light/dark) is persisted in localStorage.
- Authentication role is persisted across page refreshes (demo only).
- This is a frontend prototype. Data is held in memory via Zustand and resets on full page reload of non-persisted stores.

## Scripts

| Command       | Description              |
|---------------|--------------------------|
| `npm run dev` | Start development server |
| `npm run build` | Production build       |
| `npm run preview` | Preview production build |
| `npm run lint` | Run ESLint             |
