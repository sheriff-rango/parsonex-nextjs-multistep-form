# Parsonex NextJS Application

## Tech Stack

This application is built with modern web technologies and follows a server-first approach:

- 🏗️ **Next.js 15** with App Router - Leveraging React Server Components for optimal performance
- 🔐 **Clerk Auth** - Secure authentication and user management
- 📊 **PostgreSQL + Drizzle ORM** - Type-safe database operations with minimal boilerplate
- 🎨 **Shadcn/ui + Tailwind** - Beautiful, accessible components with utility-first CSS

## Project Structure

```
├── app/                 # Next.js App Router pages and layouts
│   ├── dashboard/         # Protected dashboard routes
│   └── (auth)/            # Authentication routes
│   └── (admin)/           # Admin routes
├── components/          # Reusable UI components
├── server/              # Server-side code
│   ├── actions/           # Server actions (API endpoints)
│   └── db/                # Database schema and configurations
├── types/               # TypeScript type definitions
├── lib/                 # Utility functions and configurations
└── hooks/               # Custom React hooks
```

## Getting Started

1. Install dependencies:

   ```bash
   pnpm install
   ```

2. Set up environment variables:
   Create a `.env` file in the root directory:

   ```env
   POSTGRES_URL=your_postgres_connection_string
   NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
   CLERK_SECRET_KEY=your_clerk_secret_key
   ```

3. Start development:

   ```bash
   pnpm dev
   ```

4. Drizzle Studio:
   ```bash
   pnpm db:studio
   ```

## Database

This project uses AWS RDS for PostgreSQL. Drizzle ORM is used for database management. Here are the key commands:

1. Pull database schema:

   ```bash
   pnpm db:pull
   ```

2. Push schema changes to the database:

   ```bash
   pnpm db:push
   ```

3. View and manage data with Drizzle Studio:
   ```bash
   pnpm db:studio
   ```

The schema is defined in `server/db/schema.ts` using Drizzle's type-safe schema builder. Relations between tables are configured in `server/db/relations.ts`.

## Authentication

Authentication is handled by Clerk. Protected routes are configured in the middleware.ts file. The dashboard routes are protected by default and require authentication.

## UI Components

The project uses a combination of custom components and shadcn/ui. Components are styled using Tailwind CSS with a customized theme configuration. The theme can be modified in the tailwind.config.ts file.
