# Tailwind Configuration Fix

## Issue
The CSS at `http://localhost:3000/website` was not rendering properly because:
1. Slidexy (frontend) uses Tailwind 4 with `@tailwindcss/postcss` (no config needed)
2. Frontend2 (website builder) uses Tailwind 3 with extensive custom configuration
3. These two systems were conflicting

## Solution Applied

### 1. Created tailwind.config.ts
- Created a comprehensive Tailwind 3 config that includes all custom utilities from frontend2
- Custom utilities: `cw-*` (centered width), `ch-*` (centered height), `cs-*` (centered square)
- Custom font sizes: title-h1 through title-h5, body-*, label-*, mono-*
- Custom colors from colors.json loaded as CSS variables
- Custom screens: xs, sm, md, lg, xl with -max variants
- Content paths include both Slidexy and website builder folders

### 2. Fixed PostCSS Configuration
**Changed from:**
```javascript
plugins: {
  "postcss-import": {},
  "postcss-nesting": {},
  "@tailwindcss/postcss": {},  // Tailwind 4
  "autoprefixer": {},
}
```

**Changed to:**
```javascript
plugins: {
  "postcss-import": {},
  "tailwindcss/nesting": {},  // Tailwind 3 nesting
  "tailwindcss": {},          // Tailwind 3 (uses tailwind.config.ts)
  "autoprefixer": {},
}
```

### 3. Removed Duplicate @tailwind Directives
- Removed `@tailwind` directives from `fire.css` (they were duplicated)
- Kept them only in `main.css` which is the main entry point

### 4. Installed Required Plugins
```bash
npm install -D tailwind-gradient-mask-image @tailwindcss/typography
```

## What This Means

- **Slidexy routes** (`/`, `/presentation/*`): Still work with existing Tailwind setup
- **Website route** (`/website`): Now has access to all custom Tailwind utilities and colors
- Both Tailwind 3 (`tailwindcss@3.4.17`) and Tailwind 4 (`@tailwindcss/postcss@4.1.11`) are installed
- PostCSS now uses Tailwind 3 which reads the tailwind.config.ts file

## Next Steps

**IMPORTANT:** You must restart the development server for these changes to take effect:

1. Stop the current dev server (Ctrl+C)
2. Run `npm run dev` again
3. Visit `http://localhost:3000/website` - CSS should now be properly applied

## Verification

After restart, check that:
- ✅ Custom classes like `cw-[1314px]`, `ch-506` work
- ✅ Custom font sizes like `text-title-h1` work  
- ✅ Custom colors like `bg-heat-100`, `text-accent-black` work
- ✅ Slidexy routes still work without issues
- ✅ No console errors about Tailwind

## Files Modified

1. `frontend/tailwind.config.ts` - Created with full config from frontend2
2. `frontend/postcss.config.mjs` - Changed from Tailwind 4 to Tailwind 3
3. `frontend/src/website-styles/fire.css` - Removed duplicate @tailwind directives
4. `frontend/src/colors.json` - Already existed (copied from frontend2)

## Technical Notes

- Tailwind 3 requires a config file and traditional PostCSS plugin
- Tailwind 4 uses `@tailwindcss/postcss` and CSS-based configuration
- We're now using Tailwind 3 system to support the website builder's custom utilities
- The config file includes 0-999px sizing utilities, custom opacity scale, and much more
- All custom utilities use CSS variables for colors (e.g., `var(--heat-100)`)
