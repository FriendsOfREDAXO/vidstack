# Vidstack Build Directory

This directory contains the build configuration and scripts for the Vidstack addon.

## Building

To build the assets, run:

```bash
npm install
npm run build
```

This will:
1. Bundle the vidstack components (`vidstack.js`)
2. Bundle the vidstack JavaScript (`vs_js_out.js`)
3. Remove inline styles for CSP compliance

## CSP Compliance

The `remove-inline-styles.js` script automatically removes inline styles from the built files to ensure Content Security Policy (CSP) compliance. The following inline styles are removed:

- `style="pointer-events: none;"` from `media-controls-group` elements
- `style="max-width: unset;"` from `video` elements

These styles are replaced by CSS rules in `assets/vidstack_helper.css`:

```css
.vds-controls-group {
    pointer-events: none;
}

media-slider-video video {
    max-width: unset;
}
```

## Output

The built files are placed in the `dist/` directory and should be copied to the `assets/` directory for deployment.

**Note:** The `dist/` and `node_modules/` directories are excluded from git via `.gitignore`.
