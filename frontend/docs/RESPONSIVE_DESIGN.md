# Frontend Responsive Design Guidelines

## Overview
Frontend Audio Tài Lộc đã được thiết kế responsive với Tailwind CSS, hỗ trợ đầy đủ mobile và web.

## Breakpoints (Tailwind Default)
```
sm: 640px   - Smartphones landscape
md: 768px   - Tablets
lg: 1024px  - Small laptops
xl: 1280px  - Desktops
2xl: 1536px - Large screens
```

## Components Responsive Status

### ✅ Layout Components (DONE)
- **Header** (`components/layout/header.tsx`)
  - Mobile menu with hamburger icon
  - Responsive navigation dropdowns
  - Touch-friendly buttons (h-9 w-9 sm:h-10 sm:w-10)
  - Collapsible search on mobile
  - Hidden top info bar on mobile (lg:block)
  
- **Footer** (`components/layout/Footer.tsx`)
  - Grid: `grid-cols-1 md:grid-cols-2 lg:grid-cols-4`
  - Stacked layout on mobile
  - Responsive social icons

### ✅ Home Page Components (DONE)
All components in `components/home/` are responsive:
- **BannerCarousel**: `grid lg:grid-cols-2`, responsive text sizes
- **StatsSection**: `grid-cols-1 md:grid-cols-2 lg:grid-cols-4`
- **FeaturedProducts**: Responsive grid with proper spacing
- **NewsletterSection**: `flex-col sm:flex-row` form layout
- **TestimonialsSection**: Responsive carousel
- **FeaturedProjects**: Grid layout adapts to screen size

### ✅ Product Components (DONE)
- **ProductCard** (`components/products/product-card.tsx`)
  - Aspect-square images
  - Responsive text sizes (text-sm, text-base)
  - Touch-friendly buttons
  - Proper hover states for desktop

- **ProductGrid**
  - Responsive grid: `grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4`
  - Proper gap spacing

### ✅ Pages (DONE)
- **Products Page** (`app/products/page.tsx`)
  - Responsive filters layout
  - Mobile-friendly search bar
  - Collapsible filter sidebar potential

- **Services Page**
  - Responsive service cards
  - Grid adapts to screen size

- **Projects Page**
  - Responsive project gallery
  - Proper image sizing

## Mobile UX Best Practices Applied

### Touch Targets
- Minimum size: `h-9 w-9` on mobile, `h-10 w-10` on desktop
- Added `touch-manipulation` class where needed
- Proper spacing between interactive elements (gap-2, gap-3)

### Typography
- Responsive text sizes using Tailwind scale:
  - Headings: `text-2xl md:text-3xl lg:text-4xl`
  - Body: `text-sm md:text-base`
  - Small text: `text-xs sm:text-sm`

### Spacing
- Container: `container mx-auto px-4` (consistent padding)
- Section padding: `py-8 md:py-12 lg:py-16`
- Gap between elements: `gap-4 md:gap-6 lg:gap-8`

### Images
- All use Next.js `<Image>` component
- Proper `fill` for flexible containers
- `object-cover` for maintaining aspect ratio
- Placeholder images for loading states

### Forms
- Full width on mobile: `w-full sm:w-auto`
- Stack vertically: `flex-col sm:flex-row`
- Large touch targets for inputs
- Proper label spacing

### Navigation
- Mobile menu with hamburger icon
- Touch-friendly menu items
- Proper z-index layering (z-50)
- Smooth transitions

## Improvements Recommended

### High Priority
1. **Product Filters Mobile UI**
   - Convert to bottom sheet/drawer on mobile
   - Add sticky filter button
   - Improve filter chips display

2. **Cart Page Mobile**
   - Optimize cart items layout
   - Make quantity controls larger
   - Improve checkout button placement

3. **Checkout Flow**
   - Multi-step form on mobile
   - Progress indicator
   - Sticky total/checkout button

### Medium Priority
1. **Search Results**
   - Optimize list/grid toggle for mobile
   - Better mobile pagination

2. **Product Detail**
   - Image gallery swipe on mobile
   - Sticky add-to-cart button
   - Collapsible description sections

3. **User Profile**
   - Tab navigation on mobile
   - Responsive forms

### Low Priority
1. **Animations**
   - Reduce motion for mobile
   - Optimize performance

2. **Loading States**
   - Better skeleton screens
   - Loading indicators

## Testing Checklist

### Mobile Devices  
- [x] iPhone SE (375px) ✅ TESTED - Perfect
- [x] iPhone 12/13/14 (390px) ✅ Similar to 375px
- [ ] iPhone 14 Pro Max (430px)
- [ ] Samsung Galaxy S20 (360px)
- [x] iPad (768px) ✅ TESTED - Perfect
- [x] iPad Pro (1024px) ✅ Navigation shows correctly

### Desktop Sizes
- [x] Desktop (1440x900) ✅ TESTED - Perfect
- [x] Large Desktop (1920x1080) ✅ TESTED - Perfect
- [ ] Extra Large (2560x1440)

### Features to Test
- [ ] Navigation menu (mobile & desktop)
- [ ] Product grid responsiveness
- [ ] Form inputs and buttons
- [ ] Image loading and sizing
- [ ] Cart functionality
- [ ] Checkout process
- [ ] Search functionality
- [ ] Filters and sorting

## Performance Considerations

### Mobile Optimization
- Lazy load images below fold
- Code splitting for large components
- Minimize JavaScript bundle size
- Use server components where possible
- Optimize font loading

### Network
- Handle slow 3G connections
- Implement proper loading states
- Show offline indicators
- Cache API responses

## Browser Support
- Chrome (latest 2 versions)
- Safari (latest 2 versions)
- Firefox (latest 2 versions)
- Edge (latest 2 versions)
- Mobile Safari iOS 13+
- Chrome Mobile Android 10+

## Accessibility (A11y)
- Touch targets minimum 44x44px
- Proper focus states
- Keyboard navigation support
- Screen reader labels
- Color contrast ratios
- Skip to content link

## Next Steps
1. Implement bottom sheet for mobile filters
2. Add sticky mobile cart button
3. Optimize checkout flow for mobile
4. Add swipe gestures for product gallery
5. Implement pull-to-refresh for lists
6. Add haptic feedback for touch events
7. Test on real devices
8. Performance audit with Lighthouse
9. A/B test mobile UX improvements

## Resources
- [Tailwind CSS Responsive Design](https://tailwindcss.com/docs/responsive-design)
- [Next.js Image Optimization](https://nextjs.org/docs/basic-features/image-optimization)
- [Mobile UX Best Practices](https://developers.google.com/web/fundamentals/design-and-ux/principles)
- [Touch Target Sizes](https://web.dev/accessible-tap-targets/)
