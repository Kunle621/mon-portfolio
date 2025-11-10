# Portfolio - Freelance Web Developer

## Overview

A modern, bilingual (French/English) freelance portfolio web application showcasing projects, services, testimonials, and blog content. The application features a public-facing portfolio site with dark/light theme support and an admin dashboard for content management.

**Tech Stack:**
- Frontend: React, TypeScript, TailwindCSS, shadcn/ui components
- Backend: Node.js, Express
- Database: PostgreSQL with Drizzle ORM
- Authentication: JWT-based auth with bcrypt password hashing
- File Uploads: Multer for handling image uploads
- State Management: TanStack Query for server state

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

**Component Structure:**
- Page-based routing using Wouter (lightweight React router)
- Component library based on shadcn/ui (Radix UI primitives with TailwindCSS)
- Context providers for cross-cutting concerns:
  - `LanguageContext`: Manages FR/EN language switching
  - `ThemeContext`: Handles light/dark theme toggling
  - `AuthContext`: Manages admin authentication state and JWT token storage

**Styling Approach:**
- TailwindCSS with custom design system defined in `tailwind.config.ts`
- Custom CSS variables for theme colors in `client/src/index.css`
- Design guidelines documented in `design_guidelines.md` emphasizing:
  - Typography: Inter/Poppins fonts with defined scale
  - Spacing: Consistent Tailwind spacing units
  - Container strategy: Max-width containers with responsive padding
  - Professional minimalism with visual hierarchy

**State Management:**
- TanStack Query for server state caching and synchronization
- Local storage for persisting language preference, theme selection, and auth token
- React Context for global UI state (language, theme, auth)

### Backend Architecture

**API Structure:**
- RESTful API endpoints organized in `server/routes.ts`
- Express.js with middleware for JSON parsing and logging
- Route categories:
  - `/api/auth/*`: Authentication endpoints
  - `/api/projects/*`: Project CRUD operations
  - `/api/blog/*`: Blog post management
  - `/api/testimonials/*`: Client testimonials
  - `/api/services/*`: Service listings
  - `/api/contact`: Contact form submissions
  - `/api/newsletter`: Newsletter subscriptions

**Authentication Flow:**
- JWT tokens generated on login with 7-day expiration
- Passwords hashed using bcrypt with 10 salt rounds
- `authMiddleware` protects admin-only routes
- Token stored in localStorage on client, sent via Authorization header

**File Upload Handling:**
- Multer configured for local file storage in `uploads/` directory
- 5MB file size limit enforced
- Unique filenames generated using timestamps and random numbers
- Static file serving for uploaded assets

### Data Layer

**Database Schema (PostgreSQL with Drizzle):**

Primary tables:
- `admins`: Admin user accounts with bilingual bio/skills
- `projects`: Portfolio projects with FR/EN content, categories, images, and links
- `blogPosts`: Blog articles with slug-based routing and bilingual content
- `testimonials`: Client testimonials with ratings and photos
- `services`: Service offerings with icons and bilingual descriptions
- `contactMessages`: Contact form submissions (read status tracking)
- `newsletterSubscribers`: Email newsletter subscriptions

**ORM Pattern:**
- Drizzle ORM for type-safe database queries
- Schema defined in `shared/schema.ts` with Zod validation schemas
- Storage abstraction layer in `server/storage.ts` providing clean interface for CRUD operations
- Database connection using Neon serverless PostgreSQL driver

**Migration Strategy:**
- Drizzle Kit for schema migrations
- Migration files output to `./migrations` directory
- `npm run db:push` command for applying schema changes

### Key Design Decisions

**Bilingual Content Strategy:**
- All user-facing content stored in dual language fields (titleFr/titleEn, etc.)
- Language preference persisted to localStorage
- Translation helper function `t(fr, en)` in LanguageContext for inline translations
- SEO optimization with lang attribute on HTML element

**Theme System:**
- CSS custom properties for all theme colors
- Dark mode toggle with class-based switching (`dark` class on html element)
- Theme preference persisted to localStorage
- Comprehensive color system supporting semantic tokens (primary, secondary, muted, accent, destructive)

**Content Management:**
- Admin dashboard with sidebar navigation (using shadcn/ui Sidebar component)
- Protected admin routes requiring JWT authentication
- Separate admin login page at `/admin/login`
- Demo/fallback content shown when database is empty (graceful degradation)

**Development vs Production:**
- Vite dev server with HMR in development
- Middleware mode for Vite integration with Express
- Production build outputs to `dist/` directory
- Environment-based configuration for Replit-specific features (cartographer, dev banner)

## External Dependencies

**UI Component Library:**
- Radix UI primitives for accessible component behavior
- shadcn/ui configuration in `components.json`
- Icons from Lucide React and React Icons (SiUpwork, SiFiverr)

**Database & Hosting:**
- Neon serverless PostgreSQL (via `@neondatabase/serverless`)
- WebSocket support required for Neon connection
- Database URL provided via `DATABASE_URL` environment variable

**Development Tools:**
- TypeScript for type safety across full stack
- tsx for running TypeScript in development
- esbuild for production server bundling
- Replit-specific plugins for development experience

**Key Environment Variables:**
- `DATABASE_URL`: PostgreSQL connection string (required)
- `JWT_SECRET`: Secret key for JWT signing (defaults to placeholder in code)
- `NODE_ENV`: Environment indicator (development/production)

**File Storage:**
- Local filesystem storage for uploaded images
- `/uploads` directory served as static files
- Future consideration: May need cloud storage (S3, Cloudinary) for production scalability

**Default Credentials:**
- Admin username: `admin`
- Admin password: `admin123`
- Set via seed script in `server/seed.ts`