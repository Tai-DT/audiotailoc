---
name: Design Dashboard
description: Logic and guidelines for designing and fixing the Admin Dashboard.
---

# Design Dashboard Skill

This skill governs the design system and error handling for the `dashboard` application.

## 1. Design System: Red Elite (Dashboard Variant)

The dashboard should reflect the premium nature of AudioTaiLoc but with a focus on data density and usability.

### Color Palette
- **Primary**: Deep Red (Brand identity)
- **Secondary**: Gold/Yellow (Accents, Highlights)
- **Background**: Dark/Rich Black or clean White (with Glassmorphism support).
- **Cards**: Use glassmorphism or subtle borders to separate data.

### Components
- Use `shadcn/ui` components as the base.
- Customize `Card`, `Table`, and `Button` to match the "Red Elite" aesthetic.
- Charts: Use `recharts` with the brand color palette.

## 2. Fixing Dashboard Errors

### Permission Errors (.vercel)
If you see `EPERM` errors related to `.vercel` during linting:
- Ensure `.vercel` is in `.eslintignore`.
- Clean the folder via `rm -rf .vercel` if necessary (dev mode regenerate it).

### Build Issues
The dashboard uses Next.js 16.
- Run `npm run build` to check for build errors.
- If strictly necessary for immediate iteration, use `npm run build:no-lint` but prioritize fixing lint errors.

## 3. Development Workflow
1. **Analyze**: Check `layout.tsx` and `page.tsx` for consistency.
2. **Componentize**: Break down complex views into `components/dashboard/*`.
3. **Verify**: Run `npm run lint` periodically.
