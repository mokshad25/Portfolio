# Portfolio Edit Guide
### Work / Projects Section — Beginner-Friendly Reference

---

## Where is everything?

| What you want to change | File to open |
|---|---|
| Project content (title, description, tech, links) | `src/components/WorkSection.jsx` |
| Card layout, hover effect, button style | `src/components/ProjectCard.jsx` |
| Animation speed / scroll sensitivity | `src/components/WorkSection.jsx` (top of file) |

---

## 1. How to Add a New Project

Open `src/components/WorkSection.jsx`.

Find the `PROJECTS` array near the top of the file (it starts with `const PROJECTS = [`).

Copy one of the existing objects and paste it **before** the closing `]` of the array.
Then fill in your values:

```js
{
  title: 'Your Project Name',
  description: 'One or two sentences describing the project and its impact.',
  tech: 'Python, React, Docker',   // comma-separated — shown as chips on the card
  link: 'https://your-live-url.com',   // primary CTA link (or null)
  github: 'https://github.com/you/repo',  // GitHub link (or null)
  figma: null,   // Figma link (or null)
},
```

**Link priority:** if `link` is set, that opens when the card is clicked.
If `link` is `null`, it falls back to `github`, then `figma`.
Set anything you don't have to `null`.

---

## 2. How to Update Project Links

In `WorkSection.jsx`, find the project object you want to change.
Update any of these three fields:

```js
link:   'https://new-url.com',       // main CTA link
github: 'https://github.com/you/x',  // GitHub repo
figma:  'https://figma.com/...',      // Figma share URL
```

To **remove** a button entirely, set the value to `null`:
```js
github: null,  // GitHub button disappears
```

---

## 3. How to Change Project Text

Find your project object in the `PROJECTS` array and edit:

```js
title: 'New Title',          // large bold text on the card
description: 'New text.',    // shown below the divider line
tech: 'New, Stack, Here',    // shown as small chips
```

Save the file — the browser hot-reloads instantly.

---

## 4. How to Add Images to a Card

Images are not in the default card layout, but you can add one in two ways.

**Option A — Background image on the card**

Open `src/components/ProjectCard.jsx`.
On the `<motion.article>` element, add an inline style:

```jsx
style={{ backgroundImage: 'url(/images/my-project.png)', backgroundSize: 'cover' }}
```

Put your image in the `public/images/` folder (create it if it doesn't exist).
Access it as `/images/my-project.png`.

**Option B — Image inside the card content**

Inside `ProjectCard.jsx`, add an `<img>` tag between the number and the title:

```jsx
<img
  src="/images/my-project.png"
  alt="Project screenshot"
  className="w-full h-32 object-cover mb-4"
/>
```

---

## 5. How to Adjust Animation Speed

All tuning constants are at the top of `WorkSection.jsx`:

```js
const WHEEL_MULTIPLIER = 2.8   // how far one mouse-wheel tick scrolls
const DRAG_MULTIPLIER  = 1.6   // how sensitive pointer drag feels
```

The progress bar spring is configured in the `useSpring` call:

```js
const springPct = useSpring(rawPct, { stiffness: 85, damping: 20 })
//                                    ^ higher = snappier   ^ higher = less bounce
```

Card hover scale is in `ProjectCard.jsx` on the `whileHover` prop:

```jsx
whileHover={{ scale: 1.013, transition: { duration: 0.22 } }}
// Raise scale (e.g. 1.03) for a bigger lift effect
// Lower duration for a snappier hover
```

The animated arrow hint speed is in `WorkSection.jsx`:

```jsx
transition={{ duration: 1.5, repeat: Infinity }}
// Lower duration = faster arrow pulse
```

---

## 6. Where the Data Array Lives

```
portfolio/
└── src/
    └── components/
        └── WorkSection.jsx   ← PROJECTS array is at the top of this file
```

Open the file and look for:

```js
// PROJECT DATA  ←  EDIT HERE
const PROJECTS = [
  { ... },
  { ... },
]
```

Everything between `[` and `]` is your project list.
Each `{ ... }` block is one card on the site.

---

## Quick Cheat-Sheet

```
Add project    → paste a new { } block into PROJECTS in WorkSection.jsx
Remove project → delete its { } block from PROJECTS
Change text    → edit title / description / tech in its { } block
Change links   → edit link / github / figma in its { } block
Hide a button  → set the link field to null
Add image      → add <img src="/images/x.png"> inside ProjectCard.jsx
Speed up wheel → raise WHEEL_MULTIPLIER in WorkSection.jsx
Speed up drag  → raise DRAG_MULTIPLIER in WorkSection.jsx
```
