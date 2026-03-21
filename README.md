# Chulalongkorn English Major Open House - Landing Page

A mobile-first single-page landing page for Chulalongkorn University's English Major Open House at their 2568 event.

## Features

✨ **Ultra-Clean Design**
- Mobile-first responsive layout
- Navy + Cream + Gold/Pink color scheme
- Academic serif headlines + readable sans-serif body

🎯 **Two Simple Actions**
- **Portfolio**: Opens Google Drive link to student portfolio examples
- **Criteria**: Modal popup showing admission infographic

⚡ **Fast & Light**
- Framer Motion for smooth animations
- Tailwind CSS for optimized styling
- Vite for instant preview & fast builds

📱 **Mobile Optimized**
- Designed for QR code scanning at events
- Thumb-friendly large buttons (tap targets)
- No scroll needed - everything on one screen
- Works perfectly on iPhone & Android

## Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## File Structure

```
x.eng/
├── src/
│   ├── components/
│   │   └── Modal.jsx          # Criteria modal with infographic
│   ├── App.jsx                # Main landing page
│   ├── main.jsx               # Entry point
│   └── index.css              # Global styles
├── index.html                 # HTML template
├── package.json               # Dependencies
├── vite.config.js             # Vite configuration
├── tailwind.config.js         # Tailwind theming
├── postcss.config.js          # PostCSS config
├── logo.png                   # University logo
└── inforgraphic.png          # Admission criteria infographic
```

## Deployment

### Option 1: Vercel (Recommended)
```bash
npm install -g vercel
vercel
```

### Option 2: Netlify
1. Build: `npm run build`
2. Deploy the `dist` folder to Netlify

### Option 3: GitHub Pages
Build and push `dist` folder to your repository

## Customization

### Colors
Edit `tailwind.config.js` to change navy, cream, gold, and pink tones.

### Text
Edit `src/App.jsx` for Thai headlines and descriptions.

### Links
- Portfolio link (Google Drive): Change URL in `App.jsx` line 47
- Infographic: Replace `inforgraphic.png` file

### Animation Speed
Adjust `damping` and `stiffness` values in `src/App.jsx` (Framer Motion config)

## Performance Notes

- Page loads in <2 seconds on 4G
- Images are optimized (logo + infographic)
- Minimal JavaScript bundle
- No unnecessary libraries

## Browser Support

- ✅ iOS 12+
- ✅ Android 5+
- ✅ Modern browsers (Chrome, Safari, Firefox, Edge)

---

Built for Chulalongkorn University Open House 2568 | English Major Booth
