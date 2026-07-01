# Expo HAS CHANGED

Read the exact versioned docs at https://docs.expo.dev/versions/v57.0.0/ before writing any code.

# Brand colors live in Palette — never use raw hex

`src/constants/theme.ts` exports a `Palette` constant (`primary`, `primaryText`, `danger`, `dangerText`). Always reference these instead of writing `#3c87f7` or `#e53935` directly. Colors that don't vary between light and dark mode belong in `Palette`; colors that do belong in `Colors`.

# Food utilities belong in src/utils/food.ts

`localDateStr` (timestamp → `YYYY-MM-DD`) and `calcNetCarbs` (carbs per 100g × serving size × quantity → rounded grams) live there. Add new food-math or date helpers to this file before creating new ones elsewhere.

# Tab structure is intentionally 4 tabs

Home · Tracker · Scan · Search. There is no fifth "Explore" tab — that route (`(tabs)/explore.tsx`) was repurposed as a Profile screen and is only reachable from the Home header. Do not add it back to the tab bar without a dedicated icon asset; the current set (home, explore, scan, search) is fully allocated.
