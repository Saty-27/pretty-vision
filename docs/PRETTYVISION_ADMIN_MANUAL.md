# 👓 PRETTYVISION OPTICAL — COMPLETE ADMINISTRATOR MASTER HANDBOOK
### *The Exhaustive, Zero-Code Operations & Content Management Manual (2026 Edition)*

---

> **WELCOME TO THE PRETTYVISION OPERATIONS MANUAL**  
> This handbook is engineered specifically for store owners, clinic managers, optometrists, and front-desk staff of **PrettyVision Optical** (Kalina, Santacruz East, Mumbai).  
> **No technical background, coding skills, or web development knowledge is required.**  
> Whether you are using an iPhone, an Android smartphone, an iPad, or a desktop computer, this guide walks you through every single screen, tab, form field, button, and setting on your website with exact step-by-step instructions.

---

## 📚 TABLE OF CONTENTS

1. [CHAPTER 1: SYSTEM OVERVIEW & ZERO-CODE PHILOSOPHY](#chapter-1-system-overview--zero-code-philosophy)
2. [CHAPTER 2: ACCESS, AUTHENTICATION & SECURITY](#chapter-2-access-authentication--security)
3. [CHAPTER 3: THE MOBILE ADMIN INTERFACE (ZERO-OVERFLOW MECHANICS)](#chapter-3-the-mobile-admin-interface-zero-overflow-mechanics)
4. [CHAPTER 4: DASHBOARD & REAL-TIME ANALYTICS COMMAND CENTER](#chapter-4-dashboard--real-time-analytics-command-center)
5. [CHAPTER 5: EYEWEAR PRODUCTS & INVENTORY MASTER SYSTEM](#chapter-5-eyewear-products--inventory-master-system)
6. [CHAPTER 6: EYEWEAR CATEGORIES & "SHOP BY TYPE"](#chapter-6-eyewear-categories--shop-by-type)
7. [CHAPTER 7: LUXURY EYEWEAR BRANDS MANAGEMENT](#chapter-7-luxury-eyewear-brands-management)
8. [CHAPTER 8: CURATED FRAME COLLECTIONS](#chapter-8-curated-frame-collections)
9. [CHAPTER 9: HOMEPAGE SECTIONS MASTER CONTROLLER](#chapter-9-homepage-sections-master-controller)
10. [CHAPTER 10: HERO BANNERS & PROMOTIONAL SLIDESHOW](#chapter-10-hero-banners--promotional-slideshow)
11. [CHAPTER 11: KALINA STORE LOCATION, CLINIC HOURS & GOOGLE MAPS](#chapter-11-kalina-store-location-clinic-hours--google-maps)
12. [CHAPTER 12: INSTAGRAM FEED & COMMUNITY LIFESTYLE GALLERY](#chapter-12-instagram-feed--community-lifestyle-gallery)
13. [CHAPTER 13: EXPERT EYE CARE CLINIC & DOCTOR CTA BANNER](#chapter-13-expert-eye-care-clinic--doctor-cta-banner)
14. [CHAPTER 14: OPTICAL CLINICAL SERVICES MANAGEMENT](#chapter-14-optical-clinical-services-management)
15. [CHAPTER 15: EYE TEST BOOKINGS & PATIENT APPOINTMENT OPERATIONS](#chapter-15-eye-test-bookings--patient-appointment-operations)
16. [CHAPTER 16: CUSTOMER INQUIRIES & CONTACT MESSAGES](#chapter-16-customer-inquiries--contact-messages)
17. [CHAPTER 17: FLOATING WHATSAPP & DIRECT PHONE CALL WIDGETS](#chapter-17-floating-whatsapp--direct-phone-call-widgets)
18. [CHAPTER 18: WEBSITE FOOTER & NAVIGATION ARCHITECTURE](#chapter-18-website-footer--navigation-architecture)
19. [CHAPTER 19: ABOUT US PAGE & CLINIC HERITAGE](#chapter-19-about-us-page--clinic-heritage)
20. [CHAPTER 20: PATIENT TESTIMONIALS & REVIEWS](#chapter-20-patient-testimonials--reviews)
21. [CHAPTER 21: OPTICAL ARTICLES & EYE HEALTH BLOG](#chapter-21-optical-articles--eye-health-blog)
22. [CHAPTER 22: GLOBAL WEBSITE SETTINGS & BRAND ASSETS](#chapter-22-global-website-settings--brand-assets)
23. [CHAPTER 23: EYEWEAR PHOTOGRAPHY & MEDIA UPLOAD STANDARDS](#chapter-23-eyewear-photography--media-upload-standards)
24. [CHAPTER 24: STAFF ROLES, PERMISSIONS & ACCOUNT MANAGEMENT](#chapter-24-staff-roles-permissions--account-management)
25. [CHAPTER 25: VPS DEPLOYMENT, SERVER ISOLATION & SAFETY (PROCESS 18)](#chapter-25-vps-deployment-server-isolation--safety-process-18)
26. [CHAPTER 26: COMPLETE TROUBLESHOOTING & FAQ ENCYCLOPEDIA](#chapter-26-complete-troubleshooting--faq-encyclopedia)

---

## CHAPTER 1: SYSTEM OVERVIEW & ZERO-CODE PHILOSOPHY

### 1.1 The Two Halves of PrettyVision
Your website consists of two distinct components:
1. **The Public Storefront (`https://prettyvision.in`)**:  
   What your customers, walk-in visitors, and patients see. It displays your luxury eyewear frames, sunglasses, clinic timings, optometrist services, customer reviews, and appointment booking forms.
2. **The Private Admin Panel (`https://prettyvision.in/admin`)**:  
   Your password-protected backoffice control center. Every single word, photograph, price, phone number, and link shown on the public storefront is controlled from here.

```
+-------------------------------------------------------------------------+
|                         PRETTYVISION PLATFORM                           |
+-------------------------------------------------------------------------+
|  PUBLIC CUSTOMER STOREFRONT             SECURE ADMIN CONTROL CENTER     |
|  - Browsing frames & sunglasses         - Adding/editing products & MRP |
|  - Booking eye test appointments        - Managing clinic bookings      |
|  - One-click WhatsApp & Calling         - Updating phone & store hours  |
|  - Reading optical health blogs         - Toggling homepage sections    |
+-------------------------------------------------------------------------+
                                     ▲
                                     │ (Instant Live Updates)
                                     ▼
+-------------------------------------------------------------------------+
|                  PRETTYVISION CLOUD DATABASE (MONGODB)                  |
+-------------------------------------------------------------------------+
```

### 1.2 Zero-Code Guarantee
You will **never** need to write HTML, CSS, JavaScript, or database commands. Everything is controlled through:
- Plain text input boxes
- Clickable switches (ON / OFF)
- One-tap photo uploaders
- Dropdown menus with pre-configured optical choices

---

## CHAPTER 2: ACCESS, AUTHENTICATION & SECURITY

### 2.1 Admin URLs & Direct Links
- **Admin Login Gateway**: `https://prettyvision.in/admin/login`
- **Main Admin Dashboard**: `https://prettyvision.in/admin/dashboard`

> [!IMPORTANT]
> Always verify that your browser address bar displays `https://prettyvision.in` with the lock icon (indicating an encrypted SSL connection).

### 2.2 Logging In Step-by-Step
1. Open Google Chrome, Apple Safari, or Mozilla Firefox on your device.
2. Navigate to `https://prettyvision.in/admin/login`.
3. In the **Email Address** field, enter your assigned administrative email.
4. In the **Password** field, enter your password.
5. Click or tap the bold **"Sign In"** button.
6. Upon successful authentication, you will be redirected to the **Admin Dashboard**.

```
+-------------------------------------------------------------------------+
|                           PRETTYVISION ADMIN                            |
|                                                                         |
|                          Sign in to your account                        |
|                                                                         |
|   Email Address                                                         |
|   [ admin@prettyvision.in                                             ] |
|                                                                         |
|   Password                                                              |
|   [ ••••••••••••••••                                                  ] |
|                                                                         |
|   [                      SIGN IN TO ADMIN PANEL                     ]   |
+-------------------------------------------------------------------------+
```

### 2.3 Transforming the Admin Panel into a Phone App (PWA)
You can place a PrettyVision Admin icon directly on your phone's home screen alongside WhatsApp and Instagram:

#### On Apple iPhone (Safari):
1. Open Safari and go to `https://prettyvision.in/admin/login`.
2. Tap the **Share icon** at the bottom center of the screen (square with an arrow pointing up).
3. Scroll down the menu and tap **"Add to Home Screen"**.
4. Name it **"PrettyVision Admin"** and tap **Add** in the top right.
5. An icon is now on your iPhone home screen. Tapping it opens the panel in full-screen app mode.

#### On Android (Google Chrome):
1. Open Chrome and go to `https://prettyvision.in/admin/login`.
2. Tap the **Three Dots menu (`⋮`)** in the top right corner.
3. Tap **"Add to Home screen"** or **"Install App"**.
4. Confirm by tapping **Add**. The app icon will now appear on your phone's home screen.

---

## CHAPTER 3: THE MOBILE ADMIN INTERFACE (ZERO-OVERFLOW MECHANICS)

### 3.1 Designed Specifically for Smartphone Use
Many admin systems break or scroll uncontrollably off-screen when opened on a smartphone. The PrettyVision Admin Panel has been engineered with strict **Zero-Overflow Responsive Architecture**:
- Text and input fields dynamically resize to fit screens from 320px (compact phones) up to 430px (Pro Max phones) and tablets.
- Tables collapse into clean vertical cards on mobile screens so you never have to scroll horizontally.
- All primary action buttons (Save, Upload, Delete) are sized for single-thumb tapping.

```
+---------------------------------------+
| [☰ Menu]  PRETTY VISION ADMIN  [User] |  <-- Fixed top header bar
+---------------------------------------+
| 📦 Products Catalog                   |
| Manage your optical frames & glasses  |
|                                       |
| [+ ADD NEW PRODUCT]                   |  <-- Full-width thumb-friendly button
|                                       |
| 🔍 [ Search frames by name...      ]  |
|                                       |
| +-----------------------------------+ |
| | [Photo]  Titanium Aviator Gold    | |  <-- Mobile card layout (No horizontal scroll)
| |          Brand: Ray-Ban           | |
| |          Price: ₹2,499 (MRP 3,200)| |
| |          Stock: In Stock (Active) | |
| |                                   | |
| | [✎ Edit]              [🗑 Delete]  | |
| +-----------------------------------+ |
+---------------------------------------+
```

### 3.2 The Mobile Drawer Menu
On mobile screens, the navigation menu is tucked safely behind the **Menu icon (`☰`)** in the upper left corner:
1. Tap **`☰` Menu**.
2. A navigation drawer slides smoothly into view.
3. Tap any section to navigate immediately.
4. To dismiss the menu, tap the **`✕`** icon or tap anywhere on the darkened backdrop.

---

## CHAPTER 4: DASHBOARD & REAL-TIME ANALYTICS COMMAND CENTER
📍 **URL:** `https://prettyvision.in/admin/dashboard`

### 4.1 Key Performance Indicator (KPI) Metric Cards
At the top of your dashboard, you will find 4 real-time business health cards:

| Metric Card | What it Tracks | Practical Business Action |
| :--- | :--- | :--- |
| **Total Active Products** | Number of frames, sunglasses, and lenses currently visible to online customers. | If this number drops below 20, add new inventory. |
| **Bookings Today** | Eye test appointments requested by customers for the current date. | Call these patients early in the morning to confirm their time slots. |
| **Customer Enquiries** | Unread questions or callback requests sent via contact forms. | Respond within 2 hours to convert browsers into buyers. |
| **Active Instagram Posts** | Photos synced to your homepage lifestyle gallery. | Add 2-3 fresh customer photos weekly to maintain social proof. |

### 4.2 The Real-Time Appointments Queue
Directly below the KPI cards is the **Recent Eye Test Appointments** widget. It shows:
- Patient Name
- Mobile Phone Number (with a one-tap direct call button)
- Requested Date and Time Slot
- Service Type (Comprehensive Eye Exam, Contact Lens Fitting, etc.)
- Status Pill (`Pending`, `Confirmed`, `Completed`)

---

## CHAPTER 5: EYEWEAR PRODUCTS & INVENTORY MASTER SYSTEM
📍 **URL:** `https://prettyvision.in/admin/products`

The heart of your optical business. This section allows you to manage every spectacle frame, pair of sunglasses, reading glass, and contact lens.

```
+-------------------------------------------------------------------------+
|                           ADD NEW EYEWEAR PRODUCT                       |
+-------------------------------------------------------------------------+
|  Product Title:        [ Titanium Rimless Aviator Gold                ] |
|  Brand:                [ Ray-Ban ▼ ]         Category: [ Men's Eyewear▼]|
|  Regular Price (MRP):  [ 3499      ]         Sale Price: [ 2799       ] |
|  Frame Material:       [ Titanium  ▼ ]       Frame Shape: [ Aviator   ▼]|
|  Frame Type:           [ Rimless   ▼ ]       Target Gender: [ Men     ▼]|
|                                                                         |
|  [UPLOAD PRIMARY IMAGE]   [UPLOAD SIDE ANGLE]   [UPLOAD LIFESTYLE PHOTO]|
|                                                                         |
|  [✓] In Stock (Ready for Dispatch)     [✓] Featured on Homepage Carousel|
|                                                                         |
|  [                               SAVE PRODUCT                         ] |
+-------------------------------------------------------------------------+
```

### 5.1 Field-by-Field Breakdown for Adding a Product

#### 1. Product Title
- **What to enter**: The full customer-facing name of the frame.
- **Example**: `Titanium Rimless Aviator Matte Gold` or `Cat-Eye Acetate Havana Tortoise`.
- *Layman Tip: Always mention the shape, material, and color in the title.*

#### 2. Brand Selection
- **What to enter**: Select from the dropdown list of brands you have created in the Brands manager (e.g., Ray-Ban, Oakley, Vogue, Titan, PrettyVision Signature).

#### 3. Category Selection
- **What to enter**: Select where the product belongs:
  - `Men's Eyewear`
  - `Women's Eyewear`
  - `Kids & Teens`
  - `Computer / Blue-Light Glasses`
  - `Reading Glasses`
  - `Sunglasses`

#### 4. Pricing & Discount Architecture
- **Regular Price (₹ MRP)**: The original maximum retail price (e.g., `3499`).
- **Sale Price (₹ Discounted)**: The actual selling price (e.g., `2799`).
- *How it works*: If you enter a Sale Price lower than the Regular Price, the website automatically computes and displays a discount badge (e.g., **"20% OFF"**) and crosses out the higher MRP with a strikethrough. If there is no discount, leave the Sale Price blank or equal to the Regular Price.

#### 5. Optical Specifications
- **Frame Material**: Select from `Titanium`, `Acetate`, `Metal / Alloy`, `TR-90 Ultra-flexible`, `Wood-finish`, `Stainless Steel`.
- **Frame Shape**: Select from `Aviator`, `Wayfarer`, `Round`, `Cat-Eye`, `Rectangle`, `Square`, `Geometric / Hexagonal`, `Clubmaster / Browline`.
- **Frame Structure**: `Full Rim`, `Semi-Rimless (Half Rim)`, `Rimless`.
- **Measurements**: Enter the standard 3 optical dimensions printed on the inside of the temple arm (e.g., Lens Width `52mm`, Bridge Width `18mm`, Temple Length `140mm`).

#### 6. Photo Gallery Uploader
- **Primary Image**: Front-facing photograph of the frame on a clean background.
- **Side Angle Image**: 45-degree angle showing temple arm details, hinges, and branding.
- **On-Model / Case Photo**: Photograph of the frame in its luxury case or on a model.

#### 7. Inventory & Visibility Toggles
- **In Stock Toggle**:  
  - `ON (Green)`: Customers can view and request this frame.  
  - `OFF (Gray)`: Displays an "Out of Stock" badge on the product page.
- **Featured on Homepage Toggle**:  
  - `ON (Green)`: Displays this frame in the homepage "Trending Frames" section.

---

## CHAPTER 6: EYEWEAR CATEGORIES & "SHOP BY TYPE"
📍 **URL:** `https://prettyvision.in/admin/categories`

Categories allow visitors to find the exact style of eyewear they need in one tap.

```
+-------------------------------------------------------------------------+
|                  MANAGE CATEGORIES ("SHOP BY TYPE")                     |
+-------------------------------------------------------------------------+
|  [+ ADD CATEGORY]                                                       |
|                                                                         |
|  1. Men's Eyewear        [Active ✓]  [Edit ✎]  [Delete 🗑]  [↑] [↓]      |
|     Subtitle: "Precision engineered masculine frames"                   |
|     Image: /uploads/category_men.jpg                                    |
|                                                                         |
|  2. Women's Eyewear      [Active ✓]  [Edit ✎]  [Delete 🗑]  [↑] [↓]      |
|     Subtitle: "Chic cat-eye, pastel & oversized silhouettes"            |
|     Image: /uploads/category_women.jpg                                  |
|                                                                         |
|  3. Kids & Teens         [Active ✓]  [Edit ✎]  [Delete 🗑]  [↑] [↓]      |
|     Subtitle: "Unbreakable TR90 flex frames for active young eyes"      |
|     Image: /uploads/category_kids.jpg                                   |
|                                                                         |
|  4. Computer / Blue Cut  [Active ✓]  [Edit ✎]  [Delete 🗑]  [↑] [↓]      |
|     Subtitle: "Advanced anti-glare screen protection"                   |
|     Image: /uploads/category_computer.jpg                               |
+-------------------------------------------------------------------------+
```

### 6.1 Creating or Updating a Category Card
1. Click **"+ Add Category"** or click **Edit (`✎`)** on an existing card.
2. Enter the **Category Name** (e.g., `Computer Glasses`).
3. Enter the **Subtitle / Description** (e.g., *"Zero-power and prescription lenses that block 98% of harmful digital screen blue light."*).
4. Upload a high-resolution **Cover Photograph** (Portrait or square photo of someone wearing that style).
5. Set the **Sort Order** number (e.g., 1 for first, 2 for second).
6. Ensure the **Active** switch is turned **ON**.
7. Click **"Save Category"**.

---

## CHAPTER 7: LUXURY EYEWEAR BRANDS MANAGEMENT
📍 **URL:** `https://prettyvision.in/admin/brands`

PrettyVision carries both world-renowned luxury designer labels and high-value signature frames. This section controls the brand logos, brand catalog pages, and homepage logo strips.

### 7.1 Adding an Eyewear Brand
1. Click **"+ Add New Brand"**.
2. **Brand Name**: Enter the exact brand name (e.g., `Ray-Ban`, `Oakley`, `Vogue Eyewear`, `Carrera`, `Titan`, `Fastrack`).
3. **Brand Logo**: Upload the official brand logo.  
   *(Pro Tip: Use a PNG image with a transparent background so it looks flawless against white or dark backgrounds).*
4. **Brand Tagline**: E.g., *"Authentic Italian Craftsmanship since 1937"*.
5. **Featured in Carousel Toggle**: Turn **ON** to include this brand in the scrolling logo ribbon on the homepage.
6. Click **Save Brand**.

---

## CHAPTER 8: CURATED FRAME COLLECTIONS
📍 **URL:** `https://prettyvision.in/admin/collections`

Collections differ from Categories: while Categories group by user (Men, Women, Kids), Collections group frames by aesthetic themes or materials (e.g., *"The Titanium Minimalist Series"*, *"Vintage Havana Tortoise"*, *"Rimless Executive Luxury"*).

### 8.1 Configuring a Collection
- **Collection Name**: The promotional title (e.g., `Featherlight Titanium`).
- **Badge Label**: A small promotional tag (e.g., `NEW ARRIVAL`, `BESTSELLER`, `LIMITED EDITION`).
- **Banner Photograph**: A lifestyle image featuring frames from this collection.
- **Display Order**: Determines whether this collection card appears 1st, 2nd, 3rd, or 4th in Section 1 of your homepage.

---

## CHAPTER 9: HOMEPAGE SECTIONS MASTER CONTROLLER
📍 **URL:** `https://prettyvision.in/admin/homepage`

This page gives you absolute control over the entire homepage flow. You can turn sections on or off with a switch, swap their positions, or customize their headlines.

```
+-------------------------------------------------------------------------+
|                     HOMEPAGE SECTION MANAGER                            |
+-------------------------------------------------------------------------+
|  Section Name                      Status      Position    Customize    |
|  ---------------------------------------------------------------------  |
|  1. Hero Banners Slideshow         [ON  👁]    [Top Fixed] [Configure] |
|  2. Frame Collections (Section 1)  [ON  👁]    [↑]  [↓]    [Edit Text]  |
|  3. Shop by Type (Section 2)       [ON  👁]    [↑]  [↓]    [Edit Text]  |
|  4. Brand Showcase Banner (Sec 3)  [ON  👁]    [↑]  [↓]    [Edit Text]  |
|  5. Store & Hours (Section 4)      [ON  👁]    [↑]  [↓]    [Edit Text]  |
|  6. Instagram Feed (Section 5)     [ON  👁]    [↑]  [↓]    [Edit Text]  |
|  7. Expert Eye Care CTA (Sec 6)    [ON  👁]    [↑]  [↓]    [Edit Text]  |
+-------------------------------------------------------------------------+
```

### 9.1 How to Temporarily Hide a Section
- If you are running an in-store renovation or holiday special, you might want to hide the Instagram Feed or Brand Banner temporarily.
- Simply click the **Eye icon (`👁`)** next to that section.
- Blue Eye = **Visible to the public**.
- Gray Eye = **Hidden from the public**.
- *Your data is never deleted—turning the switch back ON restores the section immediately.*

### 9.2 How to Change Section Order
- Want the **Store & Hours** section to appear above the **Brands** section?
- Simply tap the **Up (↑)** or **Down (↓)** arrows next to that section. The homepage rearranges instantly.

---

## CHAPTER 10: HERO BANNERS & PROMOTIONAL SLIDESHOW
📍 **URL:** `https://prettyvision.in/admin/banners`

The top rotating slider is the first thing customers see when opening your website.

### 10.1 Adding a New Slide
1. Tap **"+ Add New Banner"**.
2. **Desktop Banner Image**: Wide horizontal photograph (`1920x800px`).
3. **Mobile Banner Image**: Taller vertical or square photo (`800x1000px` or `1080x1080px`).  
   *(Why two images? Smartphone screens are tall and narrow; a wide desktop banner gets shrunk down too small on mobile. Providing a mobile photo ensures crisp, legible banners on all phones).*
4. **Headline**: E.g., *"Precision Eye Care & Luxury Eyewear in Kalina"*.
5. **Subheadline**: E.g., *"Discover 500+ designer frames, polarized sunglasses, and qualified optometrist eye testing."*
6. **Primary Button Text & Link**: E.g., `Explore Frames` linking to `/eyewear`.
7. **Secondary Button Text & Link**: E.g., `Book Eye Test` linking to `/contact`.
8. Click **Save Banner**.

---

## CHAPTER 11: KALINA STORE LOCATION, CLINIC HOURS & GOOGLE MAPS
📍 **URL:** `https://prettyvision.in/admin/store`

Ensures walk-in patients in Kalina, Santacruz East, BKC, and Kurla can easily find your clinic and know when you are open.

```
+-------------------------------------------------------------------------+
|                  STORE LOCATION & OPERATING TIMINGS                     |
+-------------------------------------------------------------------------+
|  Clinic Name:   [ PrettyVision Eyecare & Optical Clinic               ] |
|  Shop Number:   [ Shop No. 11, Agarwal Building, Market               ] |
|  Landmark:      [ Opposite Nilesh Dryfruits, Kolivery Village         ] |
|  Area / City:   [ Vidya Nagari, Kalina, Santacruz East, Mumbai 400098 ] |
|  Phone Hotline: [ 095940 30310                                        ] |
|  Doctor Mobile: [ +91 95940 30310                                     ] |
|                                                                         |
|  WEEKLY OPERATING HOURS                                                 |
|  Monday - Saturday: [ 10:30 AM – 09:30 PM                             ] |
|  Sunday:            [ 11:00 AM – 08:00 PM                             ] |
|                                                                         |
|  Google Maps Navigation Link:                                           |
|  [ https://maps.app.goo.gl/prettyvision-kalina                        ] |
|                                                                         |
|  [                         SAVE STORE SETTINGS                        ] |
+-------------------------------------------------------------------------+
```

### 11.1 Updating Opening Hours
- If store timings change for festivals (e.g., Diwali, Eid, New Year) or monsoon seasons, update the Monday–Saturday and Sunday text boxes here and tap **Save Store Settings**. The live website updates automatically.

### 11.2 Connecting Google Maps Directions
- Open Google Maps on your phone or computer, search for PrettyVision Kalina, tap **Share**, copy the link, and paste it into the **Google Maps Navigation Link** field. When patients tap **"Get Directions"** on their phones, Google Maps opens with driving and walking directions directly to your door.

---

## CHAPTER 12: INSTAGRAM FEED & COMMUNITY LIFESTYLE GALLERY
📍 **URL:** `https://prettyvision.in/admin/instagram`

Shows photos of happy patients wearing their new glasses, new store arrivals, and optical events.

### 12.1 Adding a Customer or Frame Photo
1. Click **"+ Add Post"**.
2. **Upload Photo**: Select a square photograph from your phone or PC.
3. **Caption**: Enter a descriptive caption (e.g., *"Mr. Mehta rocking his new lightweight rimless titanium glasses fitted with progressive blue-cut lenses! ✨"*).
4. **Instagram Post URL**: Paste the link to that post on Instagram (e.g., `https://www.instagram.com/p/C...`). When customers click the photo, they are taken directly to your Instagram profile.
5. Click **Save Post**.

---

## CHAPTER 13: EXPERT EYE CARE CLINIC & DOCTOR CTA BANNER
📍 **URL:** `https://prettyvision.in/admin/expert-eye-care`

Controls the high-converting clinical banner near the bottom of the homepage that encourages visitors to book an optometrist consultation.

### 13.1 Form Fields Explained
- **Eyebrow Tag**: E.g., `CLINICAL EXCELLENCE`.
- **Main Headline**: E.g., *"Book a Comprehensive Eye Examination Today"*.
- **Descriptive Body**: E.g., *"Our certified optometrists use computerized autorefractors and digital visual acuity charts to ensure pinpoint prescription accuracy for glasses and contact lenses."*
- **Doctor / Examination Photo**: Upload a photograph of the optometrist testing a patient or the examination phoropter.
- **Button Text**: E.g., `Schedule Your Eye Test`.
- Click **Save CTA Settings**.

---

## CHAPTER 14: OPTICAL CLINICAL SERVICES MANAGEMENT
📍 **URL:** `https://prettyvision.in/admin/services`

Lists the professional clinical services available at the Kalina store.

### 14.1 Managing Clinical Services
You can add, edit, or remove services:
1. **Comprehensive Eye Examination**: Autorefraction, subjective refraction, visual acuity, color vision testing.
2. **Contact Lens Consultation & Trial**: Soft lenses, toric lenses for astigmatism, multifocal contacts, colored cosmetic lenses.
3. **Kids & Pediatric Vision Screening**: Amblyopia (lazy eye) checks, school myopia screening, durable silicone flex frames.
4. **Computer Vision Syndrome (CVS) Relief**: Specialized anti-fatigue screen glasses with blue-violet filtering.
5. **Frame Alignment & Ultrasonic Cleaning**: Free walk-in nose pad replacement, screw tightening, ultrasonic frame bath.

---

## CHAPTER 15: EYE TEST BOOKINGS & PATIENT APPOINTMENT OPERATIONS
📍 **URL:** `https://prettyvision.in/admin/appointments`

Whenever a patient clicks **"Book an Eye Test"** on your website and submits the form, their appointment is recorded here in real-time.

```
+-------------------------------------------------------------------------+
|                  EYE TEST APPOINTMENT OPERATIONS                        |
+-------------------------------------------------------------------------+
|  Filter: [ All Statuses ▼ ]   [ Today ▼ ]   🔍 [ Search by patient... ] |
|                                                                         |
|  PATIENT: Rajesh Sharma                DATE: 29 Oct 2026, 04:30 PM      |
|  PHONE:   098200 98200                 SERVICE: Comprehensive Exam      |
|  EMAIL:   rajesh.sharma@gmail.com      STATUS:  [ Pending ▼ ]           |
|  NOTES:   "Experiencing headache after 4 hours on computer screen"      |
|                                                                         |
|  [ 📞 CALL PATIENT ]   [ 💬 WHATSAPP ]   [ ✓ CONFIRM ]   [ ✕ CANCEL ]   |
+-------------------------------------------------------------------------+
```

### 15.1 The 4-Stage Patient Lifecycle Pipeline
Every booking follows this workflow:

```
[ 1. PENDING ] ──────► [ 2. CONFIRMED ] ──────► [ 3. COMPLETED ]
      │                        │
      ▼                        ▼
[ CANCELLED ]            [ NO-SHOW ]
```

1. **`Pending (New Booking)`**:
   - The booking has just arrived from the website.
   - *Staff Action*: Tap **"📞 Call Patient"** or send a WhatsApp confirmation message.
2. **`Confirmed`**:
   - The patient has confirmed they will attend at the requested time. Change the status dropdown to **Confirmed**.
3. **`Completed`**:
   - The patient has visited the store, had their eyes examined, and received their prescription or glasses. Mark as **Completed**.
4. **`Cancelled`**:
   - The patient requested to reschedule or cancel.

---

## CHAPTER 16: CUSTOMER INQUIRIES & CONTACT MESSAGES
📍 **URL:** `https://prettyvision.in/admin/contact-messages`

Collects all inquiries submitted through the contact page form (`/contact`).
- **Reviewing an Inquiry**: Tap on any message to view the customer's full name, email, phone number, and message text.
- **Direct Reply**: On mobile devices, tapping the phone number dials the customer instantly; tapping the email opens your email composer.
- **Mark as Resolved**: Once you have answered the customer, change the status to **Resolved** to keep your inbox clean.

---

## CHAPTER 17: FLOATING WHATSAPP & DIRECT PHONE CALL WIDGETS
📍 **URL:** `https://prettyvision.in/admin/floating-contact`

Over 70% of optical inquiries in Mumbai start through a quick WhatsApp message or a direct phone call. This section controls the floating buttons anchored to the bottom corners of your website.

### 17.1 Settings Breakdown
- **WhatsApp Store Number**: Enter your 10-digit mobile number (e.g., `9594030310`). The system automatically prepends the India country code (`+91`).
- **Pre-filled WhatsApp Greeting**:  
  Enter the default message that opens when a customer taps WhatsApp (e.g., *"Hello PrettyVision, I am visiting your website and would like to inquire about spectacle frames and eye testing."*).
- **Direct Call Number**: Enter your clinic phone number (e.g., `09594030310`).
- **Quick Callback Form Toggle**: Enable or disable the mini callback modal.
- Click **Save Floating Contact Settings**.

---

## CHAPTER 18: WEBSITE FOOTER & NAVIGATION ARCHITECTURE
📍 **URL:** `https://prettyvision.in/admin/footer`

The footer appears across every page of your website. You can customize every aspect of it through 5 organized tabs:

```
+-------------------------------------------------------------------------+
|                  WEBSITE FOOTER & NAVIGATION MANAGER                    |
+-------------------------------------------------------------------------+
|  [Tab 1: Brand & Logo]        [Tab 2: Navigation Columns]               |
|  [Tab 3: Store Contact List]  [Tab 4: Social Media Icons]               |
|  [Tab 5: Newsletter & Copyright]                                        |
+-------------------------------------------------------------------------+
|                                                                         |
|  INTERACTIVE LIVE PREVIEW:                                              |
|  [ 🖥 Desktop Preview ]   [ 📱 Mobile Preview ]                         |
|  +-------------------------------------------------------------------+  |
|  | [PRETTY VISION LOGO]                                              |  |
|  | Kalina's premier optical store & eye care clinic.                 |  |
|  |                                                                   |  |
|  | QUICK LINKS        CLINICAL SERVICES     CUSTOMER SUPPORT         |  |
|  | • Home             • Eye Examination     • Book Appointment       |  |
|  | • Eyewear Catalog  • Prescription Lenses • Store Directions       |  |
|  | • Designer Brands  • Contact Lens Trial  • Call 095940 30310      |  |
|  | • About Clinic     • Kids Eye Care       • WhatsApp Store         |  |
|  +-------------------------------------------------------------------+  |
|                                                                         |
|  [                        SAVE FOOTER SETTINGS                       ]  |
+-------------------------------------------------------------------------+
```

### 18.1 Tab 1: Brand & Logo
- **Footer Logo**: Upload a logo formatted for dark backgrounds (white or gold lettering).
- **Brand Synopsis**: 2-3 sentences explaining your optical heritage and location.

### 18.2 Tab 2: Dynamic Navigation Link Columns
- **Add Column**: Click **"+ Add Column"** to create a new category (e.g., `Eye Care Guides`).
- **Add Link**: Click **"+ Add Link"** inside any column.
  - **Label**: What the customer sees (e.g., `Book Eye Test`).
  - **URL**: Where it goes (`/contact` or an external link like `https://wa.me/...`).
- **Reorder Links**: Use the **Up (↑)** and **Down (↓)** arrows to arrange links.

### 18.3 Tab 3: Store Contact Details
- Enter your Physical Address, Support Phone, and Support Email.
- The footer automatically turns phone numbers into clickable calling links and email into mail links.

### 18.4 Tab 4: Social Media Links
- Fill in links for **Instagram**, **WhatsApp**, **Facebook**, **YouTube**, **LinkedIn**, or **Website**.
- *Leave any unused field blank, and its icon will automatically disappear from the website.*

### 18.5 Tab 5: Newsletter & Copyright
- **Newsletter Subscription Switch**: Turn ON or OFF.
- **Copyright Year**: E.g., `2026`.
- **Copyright Legal Text**: E.g., `PrettyVision Eyecare. All Rights Reserved.`

---

## CHAPTER 19: ABOUT US PAGE & CLINIC HERITAGE
📍 **URL:** `https://prettyvision.in/admin/about`

Controls the content on `https://prettyvision.in/about`:
- **Founding Heritage**: Tell the story of how PrettyVision was founded in Kalina.
- **Optometrist Credentials**: Highlight doctor degrees (e.g., *Bachelor of Clinical Optometry, Fellowship in Pediatric Optometry*).
- **Clinic Lab Technology**: Mention computerized lens edging machinery, ultrasonic frame cleaners, and blue-cut digital lens meters.

---

## CHAPTER 20: PATIENT TESTIMONIALS & REVIEWS
📍 **URL:** `https://prettyvision.in/admin/testimonials`

Positive reviews build immediate trust with new customers.

### 20.1 Adding a Review
1. Click **"+ Add Testimonial"**.
2. **Patient Name**: E.g., `Pooja Verma (Kalina)`.
3. **Rating**: Select `5 Stars`.
4. **Review Text**: E.g., *"Got my progressive lenses made here. The doctor took 25 minutes to thoroughly check my power and the glasses are crystal clear with zero distortion!"*
5. **Frame/Product Purchased**: E.g., `Vogue Cat-Eye with Crizal Lenses`.
6. **Featured on Homepage**: Turn **ON** to show this review in the homepage carousel.
7. Click **Save Testimonial**.

---

## CHAPTER 21: OPTICAL ARTICLES & EYE HEALTH BLOG
📍 **URL:** `https://prettyvision.in/admin/blogs`

Publishing helpful vision guides boosts your Google search rankings and educates your customers.

### 21.1 Creating an Optical Article
1. Tap **"+ Create Article"**.
2. **Title**: E.g., *"How to Choose the Best Glasses for Your Face Shape"*.
3. **Cover Photo**: Upload a clean photo of glasses or a face shape diagram.
4. **Content Editor**: Use the visual editor to type your article, add bold headings, bullet points, and tips.
5. **Publish Status**: Set to **Published** to make it live immediately.

---

## CHAPTER 22: GLOBAL WEBSITE SETTINGS & BRAND ASSETS
📍 **URL:** `https://prettyvision.in/admin/site-settings`

Use this section for high-level store configuration:
- **Primary Header Logo**: The logo displayed in the top white/cream navigation bar.
- **Favicon Icon**: The miniature glasses icon displayed in browser tabs next to your website title.
- **Legal Business Name**: PrettyVision Optical Clinic.
- **Official GST Number**: Your business GST tax identification number.

---

## CHAPTER 23: EYEWEAR PHOTOGRAPHY & MEDIA UPLOAD STANDARDS

### 23.1 Image Dimension & Resolution Cheat Sheet

| Asset Type | Recommended Dimensions | Recommended File Format | Tips for Best Results |
| :--- | :--- | :--- | :--- |
| **Desktop Hero Banner** | `1920 × 800 px` | WEBP or JPG | Landscape orientation; keep key text centered. |
| **Mobile Hero Banner** | `800 × 1000 px` | WEBP or JPG | Portrait orientation; fills phone screens cleanly. |
| **Product Frame Photos** | `1000 × 1000 px` | PNG or WEBP | Square ratio; clean white or transparent backdrop. |
| **Category Cards** | `800 × 1000 px` | JPG or WEBP | Portrait lifestyle shots of models wearing frames. |
| **Brand Logos** | `600 × 300 px` | PNG | Transparent background; no colored rectangular box. |
| **Instagram Photos** | `1080 × 1080 px` | JPG | Crisp square photos taken in bright natural light. |

### 23.2 Taking Great Frame Photos with Your Phone
1. **Wipe Your Phone Lens**: Oils on phone lenses make glasses look blurry or hazy.
2. **Clean the Lenses & Frame**: Use an optical microfiber cloth to remove all dust, smudges, and fingerprints.
3. **Use Diffused Lighting**: Never shoot with direct harsh camera flash (it causes white glare spots on the lenses). Shoot near an open window or soft white store LED.
4. **Positioning**: Place the frame flat on a white marble counter or angled at 45 degrees.

---

## CHAPTER 24: STAFF ROLES, PERMISSIONS & ACCOUNT MANAGEMENT
📍 **URL:** `https://prettyvision.in/admin/roles` & `/admin/users`

You can create individual logins for your team without sharing your master owner password:

| Role Name | Access Level | What They Can Do |
| :--- | :--- | :--- |
| **Super Admin (Owner)** | Full Access (100%) | Can edit products, prices, store settings, roles, delete records, view traffic. |
| **Store Manager** | Store Operations (80%) | Can add/edit products, update inventory, manage appointments, answer inquiries. |
| **Optometrist / Assistant** | Clinical Access (40%) | Can view today's patient appointments, update appointment status, read inquiries. |

---

## CHAPTER 25: VPS DEPLOYMENT, SERVER ISOLATION & SAFETY (PROCESS 18)

> [!CAUTION]
> **MULTI-TENANT SERVER WARNING**:  
> Your VPS server (`srv1121234`) hosts **13 different business applications** (including `Prepasole`, `iskcon-juhu`, `divine-naturals`, `self-excellence-backend`).  
> **NEVER run `pm2 restart all` or restart other databases.** Doing so will crash other live services.

### 25.1 The Safe 4-Step VPS Update Protocol
Whenever the development team pushes a new feature or fix to GitHub, run **ONLY** these 4 commands on your VPS terminal:

```bash
# STEP 1: Navigate to the PrettyVision root folder
cd /var/www/pretty-vision

# STEP 2: Pull the latest tested code from GitHub
git pull origin main

# STEP 3: Rebuild the frontend bundle
cd frontend
npm run build

# STEP 4: Restart ONLY the PrettyVision process (Process 18)
pm2 restart pretty-vision --update-env
```

---

## CHAPTER 26: COMPLETE TROUBLESHOOTING & FAQ ENCYCLOPEDIA

### Q1: I changed a price or photo in the admin panel, but when I open the website on my phone, the old image is still there. Why?
> **Answer:** Your phone's browser caches (stores) images in memory to save data.  
> **How to fix on Phone:** Open Chrome or Safari, tap your tabs, open an **Incognito / Private Tab**, and go to `https://prettyvision.in`. You will see the new changes immediately.  
> **How to fix on Computer:** Press **Ctrl + Shift + R** (Windows) or **Cmd + Shift + R** (Mac) to force a hard cache refresh.

### Q2: A product photo appears sideways or upside down after uploading from my iPhone.
> **Answer:** iPhones often embed orientation data in portrait photos.  
> **How to fix:** Open the photo in your iPhone Photos app, make a slight crop or rotate it, tap **Done**, and re-upload. Alternatively, take the photo in landscape mode.

### Q3: When I type a phone number in the footer or floating button, does it need country code (+91)?
> **Answer:** You can enter `9594030310`, `09594030310`, or `+919594030310`. The PrettyVision system automatically strips spaces and hyphens, and formats it into a valid international WhatsApp link (`https://wa.me/919594030310`) and clickable phone link (`tel:09594030310`).

### Q4: Can I access the admin panel while traveling or outside the store?
> **Answer:** Yes! The admin panel is accessible 24/7/365 from anywhere in the world on any phone, tablet, or laptop with an internet connection.

### Q5: What happens if I accidentally delete a product?
> **Answer:** When you click the red Trash Can icon, the system asks for a confirmation modal (*"Are you sure you want to delete this product?"*). If confirmed, it is removed from the database. It is best practice to toggle **"In Stock: OFF"** if an item is temporarily unavailable, rather than deleting it.

### Q6: Can two staff members be logged into the admin panel at the same time?
> **Answer:** Yes. Multiple authorized staff members can be logged in simultaneously on different devices without interfering with one another.

---

### 📞 STORE SUPPORT & ENGINEERING HOTLINE
- **Store Address**: Shop No. 11, Agarwal Building, Market, Kalina, Santacruz East, Mumbai 400098
- **Primary Hotline**: `095940 30310`
- **Email**: `prettyvisionkalina@gmail.com`
- **Manual Version**: `2.0 (Complete Comprehensive Edition)`

*(End of Administrator Master Handbook)*
