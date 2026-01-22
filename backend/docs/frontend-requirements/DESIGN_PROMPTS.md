# Prompt Thiết Kế Giao Diện Frontend - AudioTaiLoc

Bộ prompt này dùng để tạo mockup/design cho từng trang giao diện website bán âm thanh chuyên nghiệp.

---

## 1. Trang Chủ (Home Page)

```
Design a premium e-commerce homepage for "AudioTaiLoc" - a professional audio equipment store in Vietnam.

**Brand Style:**
- Color palette: Deep navy blue (#1a365d), Gold accent (#d4af37), Clean white backgrounds
- Typography: Modern sans-serif (Inter/Poppins), elegant and professional
- Overall feel: Premium, trustworthy, high-tech audio specialist

**Required Sections (top to bottom):**
1. **Header**: Logo left, Search bar center, Icons right (Cart, Wishlist, Account, Phone hotline)
2. **Hero Banner**: Full-width slider showcasing featured products/promotions with CTA buttons
3. **Category Grid**: 6 main categories with icons (Speakers, Amplifiers, Microphones, Mixers, Accessories, Installation Services)
4. **New Arrivals**: Product carousel (8 items) - each card shows: image, brand, name, price, rating stars, "Add to Cart" button
5. **Featured Services**: 3-column layout highlighting installation/consultation services with icons
6. **Best Sellers**: Grid of top 8 products with "Hot" badges
7. **Why Choose Us**: 4 trust badges (Genuine Products, Free Shipping, Expert Support, Warranty)
8. **Latest Blog Posts**: 3 article cards with thumbnails
9. **Footer**: Contact info, Quick links, Social media, Newsletter signup

**Design Notes:**
- Use subtle animations on hover
- Dark mode compatible design
- Mobile-responsive layout
- Include Vietnamese text placeholders
```

---

## 2. Trang Danh Sách Sản Phẩm (Product Listing)

```
Design a product listing/category page for an audio equipment e-commerce website.

**Layout Structure:**
- **Breadcrumb**: Home > Category Name
- **Category Header**: Banner image + Category title + Product count
- **Left Sidebar (25% width)**: Filters
  - Price range slider
  - Brand checkboxes (JBL, Bose, Harman, Yamaha...)
  - Power output range
  - Product type sub-categories
  - Clear filters button
- **Main Content (75% width)**:
  - Sort dropdown (Newest, Price Low-High, Price High-Low, Best Selling)
  - View toggle (Grid 3-col / List view)
  - Product grid with pagination

**Product Card Design:**
- Product image (hover to show second image)
- Brand name (small, muted)
- Product name (bold)
- Star rating + review count
- Original price (strikethrough if on sale)
- Sale price (highlighted in red/gold)
- "Add to Cart" and "Quick View" buttons
- Wishlist heart icon (top-right corner)
- "Sale" or "New" badge if applicable

**Style**: Clean, modern, easy to scan, with subtle shadows and rounded corners
```

---

## 3. Trang Chi Tiết Sản Phẩm (Product Detail)

```
Design a product detail page for a premium audio speaker.

**Layout:**
- **Left Column (50%)**: Product image gallery
  - Main large image with zoom on hover
  - Thumbnail strip below (5-6 images)
  - Video thumbnail if available
  
- **Right Column (50%)**: Product info
  - Breadcrumb
  - Brand logo/name
  - Product title (H1)
  - Rating stars + "X reviews" link
  - SKU number
  - Price block: Original price, Sale price, "Save X%" badge
  - Stock status: "In Stock" (green) or "Out of Stock" (red)
  - Variant selector (Color swatches, Size options if applicable)
  - Quantity selector (+/-)
  - "Add to Cart" button (large, primary color)
  - "Buy Now" button (secondary)
  - Wishlist + Compare buttons
  - Quick specs list (Power, Impedance, Frequency...)
  - Shipping info snippet

**Below Fold Tabs:**
1. Description (Rich HTML content)
2. Specifications (Table format)
3. Reviews (Star breakdown chart + individual reviews)
4. Q&A (Questions and answers)

**Additional Sections:**
- "Related Products" carousel
- "Recently Viewed" carousel

**Style**: Professional, detailed, trust-building with clear CTAs
```

---

## 4. Trang Giỏ Hàng (Shopping Cart)

```
Design a shopping cart page for an e-commerce website.

**Layout:**
- **Left Section (70%)**: Cart Items Table
  - Columns: Checkbox, Product (image + name + variant), Unit Price, Quantity (editable), Subtotal, Remove (X)
  - Each row is a cart item
  - Quantity has +/- buttons
  - Subtotal updates dynamically
  
- **Right Section (30%)**: Order Summary Card (sticky)
  - Subtotal
  - Coupon code input + Apply button
  - Discount amount (if coupon applied)
  - Estimated shipping (or "Calculated at checkout")
  - Total amount (large, bold)
  - "Proceed to Checkout" button (full width, prominent)
  - "Continue Shopping" link
  - Accepted payment method icons

**Empty Cart State:**
- Illustration of empty cart
- "Your cart is empty" message
- "Start Shopping" button

**Style**: Clean, easy to modify items, prominent checkout CTA
```

---

## 5. Trang Thanh Toán (Checkout)

```
Design a multi-step checkout page with clean, modern UX.

**Progress Indicator:** Steps 1-2-3 (Shipping > Payment > Confirm)

**Step 1 - Shipping Information:**
- If logged in: Select from saved addresses (radio cards) + "Add new address"
- Address form: Full name, Phone, Province dropdown, District dropdown, Ward dropdown, Street address, Notes
- Shipping method selection (radio cards with price and estimated delivery)

**Step 2 - Payment Method:**
- Radio options with icons:
  - Cash on Delivery (COD)
  - Bank Transfer (show bank details when selected)
  - VNPay / Momo (redirect info)
- Each option expands to show relevant details

**Right Sidebar (sticky):**
- Order summary
- List of items (thumbnail, name, qty, price)
- Subtotal, Shipping, Discount, Total
- "Place Order" button

**Style**: Trust badges, clean form inputs, progress visibility, mobile-optimized
```

---

## 6. Trang Đăng Nhập / Đăng Ký (Auth)

```
Design login and registration pages for an e-commerce website.

**Login Page:**
- Centered card layout
- Logo at top
- "Welcome Back" heading
- Email/Phone input
- Password input (with show/hide toggle)
- "Remember me" checkbox
- "Forgot Password?" link
- "Login" button (full width)
- Divider: "Or continue with"
- Social login buttons (Google, Facebook)
- "Don't have an account? Register" link

**Register Page:**
- Similar card layout
- "Create Account" heading
- Full name input
- Email input
- Phone number input
- Password + Confirm password
- Terms & conditions checkbox
- "Register" button
- Social signup options
- "Already have an account? Login" link

**Style**: Minimal, focused, trust-building, quick to complete
```

---

## 7. Trang Tài Khoản (My Account Dashboard)

```
Design a customer account dashboard page.

**Layout:**
- **Left Sidebar Menu:**
  - User avatar + name
  - Dashboard (overview)
  - My Orders
  - Wishlist
  - Addresses
  - Account Settings
  - Logout

- **Main Content Area:**
  - Welcome message with user name
  - Quick stats cards: Total Orders, Wishlist Items, Reward Points
  - Recent Orders table (last 5)
  - Quick actions: Track Order, Start Shopping

**My Orders Page:**
- Filter tabs: All, Processing, Shipped, Completed, Cancelled
- Order cards showing: Order #, Date, Total, Status badge, "View Details" button

**Order Detail Page:**
- Order info header
- Status timeline (visual progress)
- Items list
- Shipping address
- Payment method used
- Actions: Cancel (if pending), Reorder, Write Review

**Style**: Clean dashboard aesthetic, easy navigation, clear status indicators
```

---

## 8. Trang Dịch Vụ & Đặt Lịch (Services & Booking)

```
Design service listing and booking flow pages for audio installation services.

**Services List Page:**
- Hero section with tagline "Professional Audio Installation Services"
- Service cards grid (3 columns):
  - Service image/icon
  - Service name
  - Short description
  - "Starting from X VND"
  - "Book Now" button

**Service Detail Page:**
- Hero with service image
- Service name + price range
- Detailed description (what's included)
- Process steps (1-2-3 visual)
- Gallery of completed projects
- Customer testimonials
- "Book This Service" CTA button

**Booking Page (Multi-step):**
- Step 1: Select service (if not pre-selected)
- Step 2: Choose date from calendar + available time slots
- Step 3: Enter contact info (Name, Phone, Address, Notes)
- Step 4: Confirmation summary
- "Confirm Booking" button

**Style**: Professional, trustworthy, clear process visualization
```

---

## 9. Trang Tin Tức / Blog (Blog)

```
Design a blog/news section for an audio equipment website.

**Blog Listing Page:**
- Featured post (large card at top)
- Category filter tabs
- Blog grid (2-3 columns)
- Each card: Featured image, Category tag, Title, Excerpt, Author avatar + name, Date, Read time
- Sidebar: Search, Categories, Popular Posts, Tags cloud

**Blog Detail Page:**
- Featured image (full width)
- Category + Date + Read time
- Title (H1)
- Author info row
- Article content (rich text with images, embeds)
- Tags
- Share buttons (Facebook, Twitter, Copy link)
- Author bio box
- Related posts
- Comment section

**Style**: Clean reading experience, good typography, engaging visuals
```

---

## 10. Trang Dự Án / Portfolio (Projects)

```
Design a portfolio/projects showcase page for completed audio installations.

**Projects List:**
- Filter by category (Home Theater, Karaoke, Conference Room, Event)
- Masonry grid layout
- Each card: Cover image, Project title, Location, "View Project" overlay on hover

**Project Detail Page:**
- Image gallery/slider (before & after photos)
- Project title + Location + Date
- Client requirements section
- Our solution section
- Equipment used (linked product cards)
- Results/testimonials
- "Get Similar Setup" CTA

**Style**: Portfolio aesthetic, image-focused, inspirational
```

---

## 11. Trang Liên Hệ (Contact)

```
Design a contact page for a professional audio store.

**Layout:**
- **Left side**: Contact form
  - Heading: "Get in Touch"
  - Name, Email, Phone, Subject dropdown, Message textarea
  - "Send Message" button
  
- **Right side**: Contact information
  - Store name + logo
  - Address with map pin icon
  - Phone numbers (Sales, Support)
  - Email addresses
  - Business hours
  - Social media links

- **Below**: Full-width Google Maps embed showing store location(s)

- **Additional**: FAQ accordion section for common questions

**Style**: Professional, accessible, multiple contact options
```

---

## Ghi Chú Chung Cho Designer

- **Responsive**: Tất cả trang phải responsive (Desktop, Tablet, Mobile)
- **Dark Mode**: Cân nhắc thiết kế thêm phiên bản Dark Mode
- **Micro-interactions**: Thêm hover states, loading states, transitions
- **Accessibility**: Đảm bảo contrast ratio, focus states cho keyboard navigation
- **Vietnamese Content**: Sử dụng placeholder text tiếng Việt thực tế
