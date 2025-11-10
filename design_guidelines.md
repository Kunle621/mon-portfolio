# Design Guidelines: Bilingual Freelance Portfolio

## Design Approach

**Reference-Based Approach** - Drawing inspiration from modern professional portfolios (Dribbble top portfolios, Awwwards winners, and contemporary agency sites) while maintaining clarity and professionalism suitable for a freelancer.

**Core Principles:**
- Visual storytelling with strong hierarchy
- Professional minimalism with personality
- Content-first design that showcases work beautifully
- Seamless bilingual experience
- Consistent dark/light theme implementation

---

## Typography

**Font Families:**
- Headings: Inter or Poppins (700, 600 weights)
- Body: Inter or System UI (400, 500 weights)
- Accents/CTAs: Same as headings (600 weight)

**Scale:**
- Hero headline: text-5xl md:text-6xl lg:text-7xl
- Section titles: text-3xl md:text-4xl lg:text-5xl
- Subsection headers: text-xl md:text-2xl
- Body text: text-base md:text-lg
- Small text/captions: text-sm

---

## Layout System

**Spacing Primitives:** Use Tailwind units of 2, 4, 6, 8, 12, 16, 20, 24
- Component spacing: p-4, p-6, p-8
- Section padding: py-16 md:py-20 lg:py-24
- Element gaps: gap-4, gap-6, gap-8

**Container Strategy:**
- Full-width sections with max-w-7xl inner containers
- Content sections: max-w-6xl
- Text-heavy content: max-w-4xl
- Consistent horizontal padding: px-4 md:px-8 lg:px-12

---

## Public Interface Components

### Hero Section
- Full viewport height (min-h-screen) with centered content
- Professional headshot: rounded-full, w-32 h-32 md:w-40 md:h-40
- Name in large display typography
- Bilingual tagline beneath
- Primary CTA button with strong contrast
- Language toggle (FR/EN flag icons) - top right
- Theme toggle (sun/moon icons) - top right near language toggle
- Subtle background: gradient or geometric pattern

### About Section
- Two-column layout on desktop (lg:grid-cols-2)
- Left: Extended biography text
- Right: Skills grid (3 columns on desktop) with icons and labels
- CV download button with download icon
- Tool logos in a horizontal scrollable row

### Projects Showcase
- Masonry-style grid or 3-column grid (grid-cols-1 md:grid-cols-2 lg:grid-cols-3)
- Project cards with:
  - Featured image (16:9 ratio)
  - Title overlay on hover
  - Category badge
  - Link icons (GitHub, Live Demo)
- Category filter pills at top
- Each card: rounded-lg with subtle shadow

### Services Section
- 3-column grid on desktop (grid-cols-1 md:grid-cols-2 lg:grid-cols-3)
- Icon above title for each service
- Short description beneath
- Consistent card heights with padding p-6

### Testimonials
- Horizontal carousel or 3-column grid
- Client photo: rounded-full, w-16 h-16
- Quote in italic text-lg
- Client name and role below
- Star rating visualization
- Navigation dots/arrows for carousel

### Contact Form
- Single column layout, max-w-2xl centered
- Input fields with clear labels
- Textarea for message (rows 6)
- Submit button full-width on mobile
- Success message appears inline after submission

### Newsletter Section
- Centered layout with compelling headline
- Email input with inline subscribe button
- Visual confirmation message after signup
- Decorative icon or illustration

### Footer
- Three-column layout on desktop
- Left: Quick links
- Center: Social media icons (large, interactive)
- Right: Contact information
- Full-width copyright bar at bottom
- All social icons same size, even spacing

---

## Admin Dashboard Components

### Login Page
- Centered card (max-w-md) on minimal background
- Logo/site name at top
- Email and password fields
- "Remember me" checkbox
- Submit button full-width
- Subtle error messages

### Dashboard Layout
- Fixed sidebar (w-64) on desktop, collapsible on mobile
- Top navigation bar with:
  - Notification bell icon with badge count
  - Theme toggle
  - Language selector
  - Admin profile dropdown
- Main content area with breadcrumbs
- Dashboard cards in grid (grid-cols-1 md:grid-cols-2 lg:grid-cols-4)

### Content Management
- Table layouts for lists (projects, messages, subscribers)
- Action buttons (edit, delete) with icons
- Modal overlays for add/edit forms
- WYSIWYG editor for blog posts
- Image upload with preview
- Toggle switches for publish/unpublish

### Notification Center
- Dropdown panel from bell icon
- List of notifications with timestamps
- Unread indicator (colored dot)
- "Mark all as read" option
- Link to full message/subscriber

---

## Theme Implementation

**Light Theme:**
- Background: White to light gray gradient
- Text: Charcoal gray
- Cards: White with subtle shadow
- Borders: Light gray

**Dark Theme:**
- Background: Dark navy to black gradient
- Text: Off-white
- Cards: Dark gray with subtle glow
- Borders: Medium gray

**Consistent Elements:**
- Primary CTA maintains same color in both themes
- Icons adapt opacity/color for visibility
- Smooth transition between themes (transition-colors duration-300)

---

## Images & Visual Assets

**Hero Section:**
- Professional headshot (circular crop)
- Optional: Subtle background pattern or blurred gradient

**Projects:**
- Project thumbnails: 16:9 ratio, high-quality screenshots
- Consistent image treatment across all projects

**Testimonials:**
- Client photos: square crop, consistent size

**About Section:**
- Optional: Workspace or candid professional photo

**Icons:**
- Use Heroicons for all UI icons
- Technology logos for skills section (official brand logos)

---

## Responsive Behavior

**Breakpoints:**
- Mobile: base (< 768px) - single column layouts
- Tablet: md (768px) - two-column layouts where appropriate
- Desktop: lg (1024px) - full multi-column layouts

**Mobile Optimizations:**
- Hamburger menu for navigation
- Stacked sections
- Full-width CTAs
- Collapsible admin sidebar
- Touch-friendly tap targets (min h-12)

---

## Interaction Patterns

- Smooth page scrolling
- Hover states on all interactive elements (scale, opacity, or background changes)
- Loading states for form submissions
- Toast notifications for success/error messages
- Skeleton loaders for async content
- Modal transitions with backdrop blur

This design system creates a professional, modern portfolio that showcases work beautifully while maintaining usability and accessibility across both public and admin interfaces.