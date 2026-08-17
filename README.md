# Branchwise

A cross-platform desktop app built with **React Native (web) + Electron**, a **FastAPI** backend, and **Supabase** for auth/database/storage.

## Structure

```
branchwise_app1/
├── frontend/          React Native (react-native-web) app running inside Electron
├── backend/           FastAPI application (schema migrations live in backend/alembic)
└── README.md
```

Each top-level folder is an independent project with its own package manager and lifecycle (no shared workspace tooling).

## Getting started

### 1. Supabase

This project targets a hosted Supabase project — create one at [supabase.com](https://supabase.com), then grab its URL, anon key, service-role key, and Postgres connection string (Project Settings > API and Project Settings > Database) for the `.env` files below.

### 2. Backend (FastAPI)

Uses [uv](https://docs.astral.sh/uv/) for dependency management and [Alembic](https://alembic.sqlalchemy.org/) for schema migrations, applied directly against the hosted Supabase Postgres instance.

```bash
cd backend
uv sync                    # creates .venv and installs dependencies from uv.lock
cp .env.example .env       # fill in Supabase URL/keys + DATABASE_URL (hosted connection string)
uv run alembic upgrade head   # applies migrations (alembic/versions/) to DATABASE_URL
uv run uvicorn app.main:app --reload
```

API docs available at `http://localhost:8000/docs`.

To add a schema change: edit/add a model in `backend/app/db/models.py`, then create a revision with:

```bash
uv run alembic revision --autogenerate -m "describe the change"   # review the generated upgrade()/downgrade()
uv run alembic upgrade head
```

### 3. Frontend (React Native + Electron)

```bash
cd frontend
npm install
cp .env.example .env      # fill in Supabase URL/anon key + API base URL
npm run dev                # webpack-dev-server + Electron, with hot reload
```

## Building the desktop app

```bash
cd frontend
npm run build
npm run package            # produces installers via electron-builder
```

## Tech stack

- **Frontend**: React Native + `react-native-web`, TypeScript, Electron, Zustand, React Navigation
- **Backend**: FastAPI, Pydantic v2, Supabase Python client, SQLAlchemy + Alembic (migrations), Uvicorn, [uv](https://docs.astral.sh/uv/)
- **Database/Auth/Storage**: Supabase, hosted (Postgres, GoTrue auth, Storage)
