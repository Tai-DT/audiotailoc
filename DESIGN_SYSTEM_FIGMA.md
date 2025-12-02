# Audio Tài Lộc - Design System for Figma

## Brand Identity

**Brand Name:** Audio Tài Lộc  
**Industry:** Professional Audio Equipment  
**Theme:** Red & Orange - Passionate, Energetic, Professional

---

## Color Palette

### Primary Colors (OKLCH Format)

#### Light Mode
- **Primary (Ruby Red)**: `oklch(0.58 0.28 20)` - #DC2626
  - Use for: Main CTAs, brand elements, primary buttons
  - Foreground: `oklch(0.99 0.005 45)` - White

- **Accent (Fiery Orange)**: `oklch(0.70 0.22 40)` - #F97316
  - Use for: Highlights, secondary CTAs, hover states
  - Foreground: `oklch(0.99 0.005 45)` - White

- **Tertiary (Golden Yellow)**: `oklch(0.75 0.18 65)` - #FBBF24
  - Use for: Secondary highlights, badges
  - Foreground: `oklch(0.12 0.02 45)` - Dark

#### Semantic Colors
- **Success (Green)**: `oklch(0.65 0.20 150)` - #10B981
- **Warning (Yellow)**: `oklch(0.85 0.15 70)` - #FCD34D
- **Error/Destructive (Red)**: `oklch(0.60 0.25 18)` - #EF4444
- **Info (Blue)**: `oklch(0.65 0.15 220)` - #3B82F6

#### Neutral Colors
- **Background**: `oklch(0.99 0.005 45)` - Almost White
- **Foreground**: `oklch(0.15 0.02 45)` - Dark Gray
- **Card**: `oklch(0.99 0.005 45)` - White
- **Muted**: `oklch(0.97 0.008 45)` - Light Gray
- **Border**: `oklch(0.90 0.005 45)` - Light Border
- **Input**: `oklch(0.95 0.005 45)` - Input Background

#### Dark Mode
- **Background**: `oklch(0.12 0.03 15)` - Deep Dark
- **Foreground**: `oklch(0.95 0.01 45)` - Light Text
- **Primary**: `oklch(0.68 0.30 20)` - Bright Red
- **Accent**: `oklch(0.72 0.24 40)` - Bright Orange

---

## Typography

### Font Families
- **Primary Font**: Geist Sans (Variable)
  - CSS Variable: `--font-geist-sans`
  - Use for: Body text, headings, UI elements

- **Monospace Font**: Geist Mono (Variable)
  - CSS Variable: `--font-geist-mono`
  - Use for: Code, technical specifications

### Type Scale
- **H1**: 3xl (1.875rem) / md:4xl (2.25rem) - 36px/40px
- **H2**: 2xl (1.5rem) / md:3xl (1.875rem) - 30px/36px
- **H3**: xl (1.25rem) / md:2xl (1.5rem) - 24px/30px
- **H4**: lg (1.125rem) / md:xl (1.25rem) - 20px/24px
- **Body**: base (1rem) - 16px
- **Small**: sm (0.875rem) - 14px
- **XSmall**: xs (0.75rem) - 12px

### Font Weights
- **Regular**: 400
- **Medium**: 500
- **Semibold**: 600
- **Bold**: 700

---

## Spacing System

Based on Tailwind's spacing scale (4px base unit):

- **xs**: 4px (0.25rem)
- **sm**: 8px (0.5rem)
- **md**: 16px (1rem)
- **lg**: 24px (1.5rem)
- **xl**: 32px (2rem)
- **2xl**: 48px (3rem)
- **3xl**: 64px (4rem)
- **4xl**: 96px (6rem)

---

## Border Radius

- **sm**: `calc(var(--radius) - 4px)` - 6px
- **md**: `calc(var(--radius) - 2px)` - 8px
- **lg**: `var(--radius)` - 10px (default)
- **xl**: `calc(var(--radius) + 4px)` - 14px
- **full**: 9999px (for pills/circles)

---

## Shadows

- **sm**: `0 1px 2px 0 rgb(0 0 0 / 0.05)`
- **md**: `0 4px 6px -1px rgb(0 0 0 / 0.1)`
- **lg**: `0 10px 15px -3px rgb(0 0 0 / 0.1)`
- **xl**: `0 20px 25px -5px rgb(0 0 0 / 0.1)`

---

## Components Specifications

### Buttons

#### Primary Button
- **Background**: Primary color
- **Text**: Primary foreground (white)
- **Padding**: 12px 24px (py-3 px-6)
- **Border Radius**: lg (10px)
- **Font Weight**: Semibold (600)
- **Hover**: Slightly darker primary, lift effect (translateY -2px)

#### Secondary Button
- **Background**: Secondary color
- **Text**: Secondary foreground
- **Border**: 1px solid border color
- **Hover**: Accent background

#### Outline Button
- **Background**: Transparent
- **Border**: 1px solid primary
- **Text**: Primary color
- **Hover**: Primary background with white text

### Cards

- **Background**: Card color (white in light mode)
- **Border**: 1px solid border color
- **Border Radius**: lg (10px)
- **Padding**: 24px (p-6)
- **Shadow**: md on hover
- **Spacing**: 16px gap between cards

### Input Fields

- **Background**: Input color
- **Border**: 1px solid border color
- **Border Radius**: md (8px)
- **Padding**: 12px 16px (py-3 px-4)
- **Focus**: Ring color with 2px outline
- **Height**: 40px (h-10)

### Badges

- **Padding**: 4px 12px (px-3 py-1)
- **Border Radius**: full (pill shape)
- **Font Size**: sm (14px)
- **Font Weight**: Medium (500)

---

## Layout Grid

### Container
- **Max Width**: 1280px (container mx-auto)
- **Padding**: 16px mobile, 24px desktop (px-4 md:px-6)

### Grid System
- **Mobile**: 1 column
- **Tablet**: 2 columns (md:grid-cols-2)
- **Desktop**: 3-4 columns (lg:grid-cols-3, xl:grid-cols-4)
- **Gap**: 24px (gap-6)

---

## Animations & Transitions

### Transitions
- **Default**: `all 0.3s ease`
- **Fast**: `0.2s ease`
- **Slow**: `0.5s ease`

### Hover Effects
- **Lift**: `translateY(-2px)` with shadow increase
- **Scale**: `scale(1.05)` for images
- **Brightness**: `brightness(110%)` for images

### Keyframe Animations
- **Fade In Up**: From opacity 0, translateY(20px) to visible
- **Slide In Left**: From opacity 0, translateX(-20px) to visible
- **Slide In Right**: From opacity 0, translateX(20px) to visible
- **Audio Wave**: ScaleY animation for audio visualizers

---

## Component Library Structure

### Layout Components
- Header/Navbar
- Footer
- Sidebar (if applicable)

### UI Components
- Button (Primary, Secondary, Outline, Ghost, Destructive)
- Card
- Input
- Textarea
- Select/Dropdown
- Checkbox
- Radio
- Switch
- Badge
- Alert
- Toast/Notification
- Modal/Dialog
- Tabs
- Accordion
- Tooltip
- Popover

### Product Components
- Product Card
- Product Grid
- Product Detail View
- Product Image Gallery
- Price Display
- Stock Badge
- Promotion Badge

### Form Components
- Form Field
- Form Label
- Form Error Message
- Form Group

### Navigation Components
- Breadcrumbs
- Pagination
- Menu/Navigation
- Mobile Menu

---

## Figma Setup Instructions

### 1. Create Color Styles

Create color styles in Figma with these names:
- `Primary` - Ruby Red
- `Primary Foreground` - White
- `Accent` - Fiery Orange
- `Accent Foreground` - White
- `Tertiary` - Golden Yellow
- `Success` - Green
- `Warning` - Yellow
- `Error` - Red
- `Info` - Blue
- `Background` - Almost White
- `Foreground` - Dark Gray
- `Muted` - Light Gray
- `Border` - Light Border

### 2. Create Text Styles

Create text styles for:
- H1, H2, H3, H4, H5, H6
- Body Large, Body, Body Small
- Caption
- Button Text
- Label

### 3. Create Component Library

Build reusable components:
- Buttons (all variants)
- Cards
- Inputs
- Badges
- Icons (if using custom icons)

### 4. Set Up Auto Layout

Use Figma's Auto Layout for:
- Button groups
- Form fields
- Card layouts
- Navigation menus

### 5. Create Responsive Frames

Create frames for:
- Mobile (375px width)
- Tablet (768px width)
- Desktop (1280px width)

---

## Design Tokens Export

You can export these tokens to JSON format for use with design-to-code tools:

```json
{
  "colors": {
    "primary": "oklch(0.58 0.28 20)",
    "accent": "oklch(0.70 0.22 40)",
    "success": "oklch(0.65 0.20 150)",
    "warning": "oklch(0.85 0.15 70)",
    "error": "oklch(0.60 0.25 18)",
    "info": "oklch(0.65 0.15 220)"
  },
  "spacing": {
    "xs": "4px",
    "sm": "8px",
    "md": "16px",
    "lg": "24px",
    "xl": "32px"
  },
  "typography": {
    "fontFamily": {
      "sans": "Geist Sans",
      "mono": "Geist Mono"
    },
    "fontSize": {
      "xs": "12px",
      "sm": "14px",
      "base": "16px",
      "lg": "18px",
      "xl": "20px",
      "2xl": "24px",
      "3xl": "30px",
      "4xl": "36px"
    }
  },
  "borderRadius": {
    "sm": "6px",
    "md": "8px",
    "lg": "10px",
    "xl": "14px",
    "full": "9999px"
  }
}
```

---

## Best Practices

1. **Consistency**: Always use design tokens, never hardcode values
2. **Accessibility**: Ensure sufficient color contrast (WCAG AA minimum)
3. **Responsive**: Design mobile-first, then scale up
4. **Spacing**: Use consistent spacing scale throughout
5. **Typography**: Maintain clear hierarchy
6. **Colors**: Use semantic colors for states (success, error, etc.)
7. **Components**: Build reusable components, not one-off designs

---

## Resources

- **Figma Plugin**: Use "Design Tokens" plugin to sync tokens
- **Code Sync**: Use Figma Dev Mode to inspect and copy CSS
- **Component Library**: Reference shadcn/ui components for implementation details

---

## Next Steps

1. Open Figma Desktop App
2. Create a new file: "Audio Tài Lộc Design System"
3. Set up color styles using the palette above
4. Create text styles
5. Build component library
6. Design key pages (Home, Products, Product Detail, Cart, Checkout)
7. Use Figma's Dev Mode to export CSS/Tailwind classes

---

## Support

For questions or updates to this design system, refer to:
- `frontend/app/globals.css` - Main CSS variables
- `frontend/components/ui/` - Component implementations
- `frontend/app/layout.tsx` - Root layout and theme setup
