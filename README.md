# AstraCreative
A professional creative builder tool designed for advertisers, aligned with Tesco brand compliance standards.

Demo Video = https://youtu.be/QfsvnssVDT8
## Resume
Aryaman Mohindru CV = https://github.com/aa-ray-man/AstraCreative-tesco/blob/d834083a23c92c66f6767f2bee9aae79eeb15a42/resume/aryaman_SDE_cv.pdf

## Features

### Canvas Editor
- **Multi-Format Support**: Create designs in various formats (Social Post, Story, Banner, etc.)
- **Fabric.js Integration**: Powerful canvas manipulation with layers, drag-and-drop, and real-time editing
- **Text Tools**: Add headlines and subheadlines with custom fonts, colors, and styles
- **Image Upload**: Add and manipulate images on the canvas
- **Custom Fonts**: Upload and use custom fonts for headlines and subheadlines
- **Safe Zones**: Visual guides for content placement

### Compliance Checking
- **OCR Text Extraction**: Automatically extracts text from canvas using Tesseract.js
- **Multi-Rule Validation**: 
  - Font size compliance
  - Color contrast (WCAG AA/AAA)
  - Tesco tag placement
  - DrinkAware logo requirements
  - Sustainability claims
  - Price claims
  - Charity messaging
  - Competition rules
  - Text overlap detection
- **Visual Feedback**: Highlights compliance issues directly on the canvas

### Color Palette Generator
- **Questionnaire-Driven**: Generate palettes based on product category, mood, and style
- **8 Product Categories**: Food & Beverage, Fashion & Apparel, Technology, Health & Wellness, Home & Garden, Finance, Education, Entertainment
- **7 Moods**: Professional, Playful, Luxurious, Natural, Bold, Minimal, Energetic
- **7 Palette Styles**: Monochromatic, Analogous, Complementary, Triadic, Split Complementary, Tetradic, Warm/Cool
- **Accessibility**: Automatic WCAG compliance checking
- **Palette Management**: Save, apply, and manage color palettes
- **One-Click Copy**: Click any color to copy its hex code

### Export Options
- **Single Export**: Download current design as PNG/JPG
- **Batch Export**: Export designs in multiple formats simultaneously
- **Format Switching**: Switch between formats while preserving your design

## Tech Stack

- **Framework**: Next.js 16 (App Router)
- **UI**: React 19, Tailwind CSS v4
- **Canvas**: Fabric.js
- **State Management**: Zustand
- **Forms**: React Hook Form + Zod
- **Colors**: Chroma.js
- **OCR**: Tesseract.js
- **Components**: Radix UI + shadcn/ui

## Getting Started

### Prerequisites
- Node.js 18+
- npm or yarn

### Installation

1. Install dependencies:
```bash
npm install
```

2. Run the development server:
```bash
npm run dev
```

3. Open [http://localhost:3000](http://localhost:3000) in your browser

### Build for Production

```bash
npm run build
npm start
```

## Project Structure

```
├── app/
│   ├── api/
│   │   ├── check-compliance/    # Compliance checking endpoint
│   │   └── ocr/                 # OCR text extraction endpoint
│   ├── editor/                  # Main editor page
│   └── page.tsx                 # Landing page
├── components/
│   ├── canvas-editor/           # Canvas editor components
│   └── ui/                      # Reusable UI components
├── hooks/                       # Custom React hooks
├── lib/                         # Utility functions
├── store/                       # Zustand state management
├── types/                       # TypeScript type definitions
└── utils/                       # Helper utilities
    ├── compliance/              # Compliance checking logic
    │   └── rules/               # Individual compliance rules
    └── safe-zones.ts            # Safe zone calculations
```

## Features in Detail

### Canvas Editor
The editor provides a full-featured design workspace with:
- Layer management (reorder, delete, duplicate)
- Alignment guides
- Object selection and manipulation
- Text and image addition
- Background color customization
- Format-specific safe zones

### Compliance System
The compliance system validates designs against Tesco's brand guidelines:
- Runs OCR to extract text from the canvas
- Checks multiple compliance rules
- Provides detailed feedback for each issue
- Highlights problematic areas visually

### Color Palette Generator
Generate brand-appropriate color palettes:
- Answer a brief questionnaire about your project
- Get 5-color palettes with primary, secondary, accent, neutral, and background colors
- Check WCAG contrast compliance
- Save palettes for later use
- Apply palettes directly to canvas elements

## Support

For issues or questions, please contact the development team.
```bash
mohindruaryaman@gmail.com
```
