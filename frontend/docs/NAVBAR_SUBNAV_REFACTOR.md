# Navbar & Sub Navigation Refactor

Date: 2025-10-01

## Goals

- Modularize inline sub navigation inside `header.tsx` into a reusable, accessible component.
- Improve horizontal scroll UX (visual affordances + keyboard support).
- Preserve existing visual style while enabling future extensibility (dynamic data, more items).
- Strengthen responsive behavior across small (<=380px), standard mobile (390–430px), tablet (768px), laptop (1024px), and desktop (>=1280px).

## Changes Implemented

1. Created `components/layout/sub-nav.tsx` (`SubNav` component):
   - Accepts `items: { label; href; icon?; isActive? }[]`.
   - Adds scroll state detection (left/right) with fading gradient edges and floating scroll buttons.
   - Smooth scrolling (`scrollBy({ behavior: 'smooth' })`).
   - Keyboard navigation (ArrowLeft/ArrowRight/Home/End) on container when focused (tabIndex=0).
   - Active detection heuristics:
     - Matches current pathname prefix.
     - Matches `category` query param if item href contains `category=`.
     - Manual override via `isActive` prop.
   - Focus styles + `aria-current="page"` for active link.

2. Replaced inline sub nav markup in `components/layout/header.tsx` with `<SubNav />` usage.

3. Added subtle edge fade utility class `.mask-image-linear-gradient` in `frontend/app/globals.css` to visually hint overflow; graceful if unsupported (purely decorative).

4. Accessibility:
   - `nav` element with configurable `aria-label`.
   - Links get `aria-current` when active; maintains color contrast in both themes.
   - Scroll buttons hidden (opacity/pointer-events) when not needed but remain in DOM to avoid layout shift.

## Responsive Behavior Improvements

| Breakpoint | Behavior |
|------------|----------|
| <640px (mobile) | Horizontal scroll with touch momentum; compact gap (`gap-2`), text size `text-xs`; buttons auto-hide unless overflow occurs. |
| ≥640px (sm) | Slightly larger gaps (`gap-3`), text scaling to `sm:text-sm`; scroll buttons easier to tap (36→40px). |
| ≥1024px (lg) | Centered within container (inherited parent). Usually no overflow unless many items; gradients/controls adapt dynamically. |

## Design Rationale

- Maintaining pill style ensures continuity with prior UI while improving affordances.
- Using a dedicated component isolates complexity (scroll detection, a11y, active state) and reduces cognitive load in `header.tsx`.
- Gradient + optional buttons pattern avoids always-visible arrows which can feel noisy when not required.
- Mask gradient chosen over shadows to reduce paint cost and remain subtle in dark mode.

## Extensibility Notes

- To source items dynamically (e.g., from categories API), map data to `SubNavItem[]` and pass to `<SubNav />`.
- Additional classification (e.g., Services vs Products) could be segmented by adding a prop for groups and rendering dividers.
- If future analytics needed, add optional `onItemClick(item)` callback.

## Performance Considerations

- Scroll state updates only on `scroll` + `resize` events (passive listener on scroll). Lightweight calculations (simple arithmetic).
- No heavy observers (e.g., `ResizeObserver`) to keep it minimal; can be added later if dynamic width recalculation becomes necessary.

## Keyboard Interaction Summary

- Tab: Focus enters scroll container (outline visible) → Tab again moves into first link.
- ArrowRight / ArrowLeft on container: Scroll viewport (does not change focus) for rapid navigation preview.
- Home / End: Jump to start/end of scroll area.
- Standard link keyboard behavior (Enter / Space via browser defaults).

## Testing Checklist (Pending Execution)

- [ ] 360px: Overflow, left/right gradient visibility, scroll buttons appear after initial scroll.
- [ ] 430px: Ensure no tap target overlaps; focus ring unobstructed.
- [ ] 768px: Adequate spacing; fade still subtle.
- [ ] 1024px: Center alignment; buttons hidden if no overflow.
- [ ] Dark mode: Contrast and gradient subtlety.
- [ ] Keyboard: Arrow/Home/End behavior smooth.
- [ ] Screen reader: `Quick navigation` label announced.

## Known Follow-ups / Ideas

- Add optional `autoScrollActive` prop to ensure active item is revealed on route change.
- Provide ARIA live region when new dynamic items appear.
- Animate pill background with spring for active state (Framer Motion) if design expands.

## Migration Notes

No breaking changes to external interfaces. `Header` now imports `SubNav`. Inline array can be safely removed or replaced with dynamic data later.


### Full-Width Mode (2025-10-01 Update)

- Added `fullWidth` prop to `Header` to allow full-bleed layout (edge-to-edge) instead of constrained `container`.
- Root layout now renders `<Header fullWidth />`.
- SubNav area adapts spacing (`px-0` with slight inner padding at larger breakpoints) to align item pills flush with viewport while preserving vertical rhythm.
**Use cases:**
- Marketing/landing contexts needing maximal horizontal space.
- Future mega-menu or promotional banners spanning full width.
- To revert to centered layout: switch back to `<Header />` (omit prop) in `app/layout.tsx`.

## Related Files

- `components/layout/header.tsx`
- `components/layout/sub-nav.tsx`
- `frontend/app/globals.css` (mask gradient utility)

---
Author: Automated refactor via AI assistant
