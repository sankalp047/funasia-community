# FunAsia Community Outreach — Website

React + Vite + Tailwind CSS v4 + Framer Motion, pre-rendered to static HTML at
build time, hosted on Render. Firebase (Firestore + Auth) powers the contact
form and the upcoming community area.

## Run it

```bash
npm install
npm run dev        # http://localhost:5173
npm run build      # production build → dist/ (client + pre-render + SEO files)
npm run preview    # serve the production build locally
npm run images     # regenerate responsive WebP images after adding/replacing photos
```

Node 22 (pinned in `.node-version`).

### Environment variables (keys stay out of Git)

`.env` is git-ignored. To run locally, copy the template and fill in the
Firebase web config (Firebase console → Project settings → Your apps):

```bash
cp .env.example .env
```

On Render the same `VITE_FIREBASE_*` values go in **your service → Environment**
(`render.yaml` declares them with `sync: false`, so Render asks for them when the
Blueprint is created). A Render build stops with a clear error if they're missing.

## Where things live

```
src/data/content.js        All page copy: hero, mission, leaders, gallery, testimonials, FAQ, socials
src/data/partners.js       Partner directory (84 orgs) — `verify: true` = please confirm details
src/components/            One component per section
src/pages/Landing.jsx      The public home page
src/pages/MemberArea.jsx   Sign-in + community (lazy-loaded; only place Firebase Auth loads)
public/images/             Original photos → optimized copies in public/img/ (npm run images)
public/partners/           Partner logos (extracted from the presentation)
scripts/prerender.mjs      Build step: pre-rendered HTML, structured data, robots, sitemap, llms.txt
render.yaml                Render deployment config
firestore.rules            Database security rules (deploy: npx firebase deploy --only firestore:rules)
```

## Contact form

Submissions are saved to Firestore → **Firebase console → Firestore Database →
`inquiries`**. Firebase loads only when someone presses Send. The security rules
allow anyone to create a well-formed inquiry and nobody to read or edit them
from the website. (Email notifications can be added later with the Firebase
"Trigger Email" extension.)

## SEO & AI search

- The landing page is **pre-rendered** into `dist/index.html`, so Google, Bing
  and AI crawlers (GPTBot, ClaudeBot, PerplexityBot…) — most of which don't run
  JavaScript — read the full content.
- **Structured data** (JSON-LD): NGO, parent organization, leadership, website,
  web page, FAQ and the partner list — generated from the data files.
- `robots.txt` welcomes search and AI crawlers; `/auth` and `/community` are excluded.
- `sitemap.xml` (with images), `llms.txt` and `llms-full.txt` (plain-language
  summaries for AI assistants) are generated on every build.
- The public URL comes from `VITE_SITE_URL` (in `.env` and `render.yaml`).

## Turning things back on later

- **Sign-in button** — see the comment in `src/components/Navbar.jsx`.
- **"Trusted by" logo band** — uncomment the two marked lines in `src/components/Partners.jsx`.
- **Social icons** — fill in `site.socials` in `src/data/content.js`; icons appear automatically.
- **Google sign-in** — enable the Google provider in Firebase → Authentication →
  Sign-in method, and add your domain under Authentication → Settings → Authorized domains.

## Content to confirm

- Partner entries marked `verify: true` in `src/data/partners.js` (names/descriptions inferred from logos).
- Maratha Mandal's exact name (old site mislabeled it as ISKCON).
- Sejal Parikh's testimonial duplicates Gitesh Desai's text on the old site.
