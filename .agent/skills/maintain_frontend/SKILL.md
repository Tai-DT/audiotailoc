---
name: Maintain Frontend
description: Instructions for checking, fixing, and maintaining the Next.js Frontend.
---

# Maintain Frontend Skill

This skill outlines the procedures for fixing errors and ensuring coding standards in `audiotailoc-frontend`.

## 1. Diagnostics

Run these commands in the `frontend` directory:

```bash
# Check for linting errors
npm run lint

# Check for TypeScript errors (crucial for build)
npm run typecheck
```

## 2. Syntax & Rendering Logic
- **JSX Nesting**: Ensure no double curly braces `{{ }}` unless intended for objects. common error: `{ condition && ( { ... } ) }`.
- **Hooks**: Ensure hooks are only called at the top level of components.
- **Client Components**: Add `'use client'` to components using `useState`, `useEffect`, or interactive handlers.

## 3. UI/UX Standards (Red Elite Theme)
- **Colors**: Use the primary Red (#E60000/similar) and Gold accents.
- **Backgrounds**: Ensure dark mode compatibility. Use `bg-background` and `text-foreground`.
- **Responsiveness**: Always test components on mobile (`sm`), tablet (`md`), and desktop (`lg`/`xl`).

## 4. Build Verification
Always run `npm run build` to verify the production build capability before completing a task.
