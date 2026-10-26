# PrettyVision — Luxury Optical & Eyewear E-Commerce Platform

A modern full-stack web application and content management system for **PrettyVision**, a premier optical showroom and optometry clinic based in Kalina, Mumbai with 33+ years of trusted eye care.

---

## 🌟 Key Highlights & Features

### 🛍️ E-Commerce & Optical Product Catalog
- **Multi-Category Browsing**: Optical Frames, Sunglasses, Blue-Light Glasses, Sports Eyewear, Kids Eyewear, and Contact Lenses.
- **Dynamic Filtering**: Filter by Gender / Target Audience (Men, Women, Kids, Unisex), Brand, Category, Frame Shape, Material, and Price.
- **Product Details**: High-resolution image galleries, prescription options, frame dimensions, bridge/temple specifications, and live inventory status.

### 👓 Dynamic Content Management System (CMS)
- **Homepage Section Management**: Enable, disable, reorder, or edit all 11 homepage sections live from the admin panel (Hero Banner, Trust Badges, Category Grid, Brand Showcase, Store Locator, Customer Reviews, etc.).
- **About Us Dynamic Sections**: Fully admin-controlled 11-section editorial layout (Our Story, Why Choose PrettyVision, Optical Offerings, The PrettyVision Experience, Store Architecture, Interactive FAQs, and Final CTA).
- **Service Management**: Public services directory with computerized eye examinations, precision prescription eyewear, contact lens trial fittings, pediatric care, and lens consultation.

### 🛡️ Strict Validation & Data Integrity Rules
- **Taxonomy Validation**: Enforces uniqueness, slug formatting, character length limits, and case-insensitive uniqueness across Categories, Brands, Product Types, and Target Audiences.
- **Safe Deletion Guards**: Prevents accidental deletion of categories or brands with assigned products.
- **Atomic Product Reassignment**: In-modal workflow to migrate all linked products to an alternative category/brand before deletion.
- **Price Integrity**: Automatic verification ensuring sale prices never exceed standard retail prices.

### 🗺️ Dynamic SEO & Sitemap Generation
- **Automated XML Sitemap**: Dynamically rebuilds `sitemap.xml` whenever products, brands, categories, services, or pages are created, modified, or deleted.
- **Search Engine Directives**: Real-time `robots.txt` generation and AI search-ready `llms.txt`.
- **JSON-LD Structured Data**: Rich local business schema for optometry clinic, physical store coordinates, operating hours, and breadcrumbs.

---

## 🏗️ Architecture & Tech Stack

- **Frontend**:
  - React 18 with Vite
  - Tailwind CSS for responsive styling
  - Lucide React for modern iconography
  - Dynamic routing with React Router v6
- **Backend**:
  - Node.js & Express
  - MongoDB with Mongoose ODM
  - RESTful API with unified admin and public routes
  - Static asset serving for high-resolution photography
- **Asset Pipeline**:
  - Curated and AI-generated editorial photography tailored for luxury optical showrooms.

---

## 🚀 Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) (v18+)
- [MongoDB](https://www.mongodb.com/) (running locally or a remote MongoDB Atlas URI)

### Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/Saty-27/pretty-vision.git
   cd pretty-vision
   ```

2. **Backend Setup**:
   ```bash
   cd backend
   npm install
   # Configure environment variables if needed in .env
   node src/server.js
   ```
   *The API will start listening on `http://localhost:5055`.*

3. **Frontend Setup**:
   ```bash
   cd ../frontend
   npm install
   npm run dev
   ```
   *The client application will start on `http://localhost:5173`.*

---

## 📍 Store Location
**PrettyVision Kalina**  
Shop No 11, Agarwal Building, Market, opposite Nilesh Dryfruits,  
Kolivery Village, Vidya Nagari, Kalina, Santacruz East,  
Mumbai, Maharashtra 400098  
Phone: `095940 30310`

---

## 📄 License
ISC License. Built for PrettyVision.
