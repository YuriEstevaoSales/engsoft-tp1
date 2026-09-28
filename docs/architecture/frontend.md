# Frontend styling

The frontend uses **Tailwind CSS v4** for styling. Components and pages use Tailwind utility classes; do not add separate component stylesheets for new UI.

## Configuration

- `tailwindcss` and `@tailwindcss/vite` are development dependencies.
- `frontend/vite.config.ts` registers the Tailwind Vite plugin.
- `frontend/src/styles.css` imports Tailwind with `@import "tailwindcss";` and defines the shared theme tokens in `@theme`.
- `frontend/src/main.tsx` imports `styles.css`, which makes the utilities available throughout the app.

Use Tailwind classes in JSX for layout, responsive behavior, colors, typography, and interaction states. Put reusable class strings shared between forms in `frontend/src/styles/form-classes.ts`; reserve `styles.css` for the Tailwind import, theme tokens, and genuinely global base styles.

Build the frontend and type-check the project with `npm run build`.
