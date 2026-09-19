# mONSEY Official

A responsive profile page with authentic styling, glassmorphism, media controls, and canvas shaders.

## Features

- **Click to Enter Overlay**: Autoplay policy compliant landing overlay with sleek blur backdrop and spring transition.
- **Canvas Fuzzy Text**: Authentic jitter / horizontal scanline shader effect for the `@thecosmic` username rendered in Satoshi font.
- **Glassmorphic 3D Card**: Smooth 3D tilt interaction reacting to cursor position with custom blur gradients and glowing borders.
- **Audio Player Widget**: Embedded track player with cover art, track progress scrubbing, elapsed/total timestamps, and playback controls.
- **Top-Left Volume Widget**: Sleek expandable volume pill (expands from `34px` to `160px` on hover) with slider and mute toggle.
- **Interactive Socials & Addresses**:
  - Globe portfolio link: [cosmic-port-folio.lovable.app](https://cosmic-port-folio.lovable.app)
  - One-click copy with dynamic tooltip feedback for LTC, Discord, Spotify, and Bitcoin addresses.
- **Custom Cursor & Particle Effects**: Custom crosshair cursor (`assets/cursor.png`) and radiating click sparkle particles.
- **Animated Browser Title**: Dynamic typewriter cycling tab title.
- **Profile Views Counter**: Floating bottom-left view badge with tooltip.
- **Customizable (`config.js`)**: Easily modify username, bio, song, links, crypto addresses, and view counter without modifying HTML.

## Getting Started

### 1. Install Dependencies
```bash
npm install
```

### 2. Start Local Development Server
```bash
npm run dev
```

### 3. Build for Production (Static Output)
```bash
npm run build
```
Or directly host the directory with any static server (GitHub Pages, Vercel, Netlify, Cloudflare Pages).
