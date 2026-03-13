# Azzurri - Rooftop Restaurant, Club & Lounge

A premium, dynamic web application for Azzurri, featuring a modern design, dynamic content management, and high-performance optimization.


## 🚀 Built With

- **Framework**: [Next.js 15+](https://nextjs.org/) (App Router)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Database & Auth**: [Supabase](https://supabase.com/)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **State Management**: React Hooks & Server Components

## 📂 Project Structure

- `src/app/(site)` - Contains all public-facing pages (Home, About, Menu, Events, etc.).
- `src/components` - Reusable UI components (Navbar, Footer, Blog, etc.).
- `src/lib` - Utility functions and data fetching logic (Supabase integration).
- `public/` - Static assets like the logo and uploaded images.

## 🛠️ Customization Guide

### Changing Global Colors
Main colors are defined as variables in:
`src/app/globals.css`
Modify `--accent-gold` to change the primary brand color throughout the site.

### Updating Text & Sections
- **Home Page**: `src/app/(site)/page.tsx`
- **Other Pages**: Check the folder named after the page in `src/app/(site)/`.
- **Global Parts**: Edit `src/components/Navbar.tsx` or `src/components/SiteFooter.tsx`.

### Managing Dynamic Content (Events, Blog, Menu)
The site is connected to a Supabase backend. All menu items, blog posts, and upcoming events should be managed through the **Admin Dashboard**.

## ⚡ Performance Optimizations
- **LCP Optimization**: The hero image uses `next/image` with `priority` for instant loading.
- **Accessibility**: All interactive elements have descriptive `aria-labels` and high-contrast color schemes (`zinc-400` on black).
- **SEO**: Dynamic metadata is exported for every route to ensure high search engine visibility.

## 👨– Getting Started

First, install the dependencies:
```bash
npm install
```

Then, run the development server:
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.
