// Post-build step (runs after the client + SSR builds — see `npm run build`).
//
//  dist/index.html   landing page pre-rendered to HTML + JSON-LD structured data
//  dist/app.html     plain app shell (no pre-render, noindex) for /auth and /community
//  dist/404.html     simple not-found page
//  dist/robots.txt   crawler rules (search engines + AI assistants welcome)
//  dist/sitemap.xml  with image entries
//  dist/llms.txt     + llms-full.txt — plain-language summaries for AI assistants
//
// The public URL comes from VITE_SITE_URL (set it in Render / .env).
import { readFile, writeFile, rm } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const DIST = path.join(ROOT, 'dist')

// Locally, pick up .env (Render provides variables through its dashboard instead)
try {
  for (const line of (await readFile(path.join(ROOT, '.env'), 'utf8')).split('\n')) {
    const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*?)\s*$/)
    if (m && process.env[m[1]] === undefined) process.env[m[1]] = m[2].replace(/^['"]|['"]$/g, '')
  }
} catch {
  /* no .env — fine */
}
const SITE = (process.env.VITE_SITE_URL || 'https://funasiacommunity.com').replace(/\/+$/, '')
const today = new Date().toISOString().slice(0, 10)

const ssr = await import(pathToFileURL(path.join(ROOT, 'dist-ssr/entry-server.js')).href)
const {
  site, activeSocials, mission, pillars, stats, ceo, outreachLead,
  featuredStory, testimonials, gallery, heroSlides, faqs, allPartners,
} = ssr

const template = await readFile(path.join(DIST, 'index.html'), 'utf8')
const abs = (p) => (p.startsWith('http') ? p : `${SITE}${p.startsWith('/') ? '' : '/'}${p}`)
const ld = (obj) =>
  `<script type="application/ld+json">${JSON.stringify(obj).replace(/</g, '\\u003c')}</script>`

// ------------------------------------------------------- structured data ---
const [street, city, stateZip] = site.address.split(',').map((s) => s.trim())
const [region, postalCode] = stateZip.split(/\s+/)
const ORG = `${SITE}/#organization`
const NETWORK = `${SITE}/#funasia-network`

const graph = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'NGO',
      '@id': ORG,
      name: site.name,
      alternateName: 'FunAsia Outreach',
      url: `${SITE}/`,
      logo: { '@type': 'ImageObject', url: `${SITE}/icon-512.png`, width: 512, height: 512 },
      image: `${SITE}/og-image.jpg`,
      description: mission.text,
      slogan: site.tagline.join(' '),
      address: {
        '@type': 'PostalAddress',
        streetAddress: street,
        addressLocality: city,
        addressRegion: region,
        postalCode,
        addressCountry: 'US',
      },
      telephone: '+1-469-424-3188',
      contactPoint: {
        '@type': 'ContactPoint',
        telephone: '+1-469-424-3188',
        contactType: 'community outreach',
        areaServed: 'US-TX',
        availableLanguage: 'English',
      },
      areaServed: [
        { '@type': 'Place', name: 'Dallas–Fort Worth metroplex, Texas' },
        { '@type': 'State', name: 'Texas' },
      ],
      knowsAbout: [
        ...pillars.map((p) => p.title),
        'Nonprofit partnerships',
        'South Asian community in Dallas–Fort Worth',
        'Community radio',
      ],
      parentOrganization: { '@id': NETWORK },
      employee: [{ '@id': `${SITE}/#neelam-dave` }],
      ...(activeSocials.length ? { sameAs: activeSocials.map((s) => s.url) } : {}),
    },
    {
      '@type': 'Organization',
      '@id': NETWORK,
      name: 'FunAsia Network',
      description: 'A South Asian media platform based in Dallas–Fort Worth, Texas.',
      subOrganization: { '@id': ORG },
    },
    {
      '@type': 'Person',
      '@id': `${SITE}/#vaishali-thakkar`,
      name: ceo.name,
      jobTitle: 'CEO',
      worksFor: { '@id': NETWORK },
      description: ceo.bio[0],
      image: abs(ceo.photo),
      sameAs: Object.values(ceo.socials),
    },
    {
      '@type': 'Person',
      '@id': `${SITE}/#neelam-dave`,
      name: outreachLead.name,
      jobTitle: 'Community Outreach Lead',
      worksFor: { '@id': ORG },
      description: outreachLead.bio[0],
      image: abs(outreachLead.photo),
    },
    {
      '@type': 'WebSite',
      '@id': `${SITE}/#website`,
      url: `${SITE}/`,
      name: site.name,
      inLanguage: 'en-US',
      publisher: { '@id': ORG },
    },
    {
      '@type': 'WebPage',
      '@id': `${SITE}/#webpage`,
      url: `${SITE}/`,
      name: 'FunAsia Community Outreach | Connecting DFW Communities',
      description:
        'FunAsia Community Outreach supports nonprofits, champions women leaders and hosts culturally vibrant community events across Dallas–Fort Worth.',
      isPartOf: { '@id': `${SITE}/#website` },
      about: { '@id': ORG },
      primaryImageOfPage: { '@type': 'ImageObject', url: `${SITE}/og-image.jpg`, width: 1200, height: 630 },
      inLanguage: 'en-US',
      dateModified: today,
    },
    {
      '@type': 'FAQPage',
      '@id': `${SITE}/#faq`,
      mainEntity: faqs.map((f) => ({
        '@type': 'Question',
        name: f.q,
        acceptedAnswer: { '@type': 'Answer', text: f.a },
      })),
    },
    {
      '@type': 'ItemList',
      '@id': `${SITE}/#partners`,
      name: 'Community partners of FunAsia Community Outreach',
      numberOfItems: allPartners.length,
      itemListElement: allPartners.map((p, i) => ({
        '@type': 'ListItem',
        position: i + 1,
        item: {
          '@type': 'Organization',
          name: p.name,
          ...(p.website ? { url: p.website } : {}),
          ...(p.city || p.region !== 'Nationwide'
            ? { areaServed: p.city ?? `${p.region}, Texas` }
            : {}),
        },
      })),
    },
  ],
}

// Content stays readable without JavaScript (animations start from opacity 0)
const noJs = `<noscript><style>#root [style*="opacity:0"]{opacity:1!important;transform:none!important}#root [style*="clip-path"]{clip-path:none!important}</style></noscript>`

// ---------------------------------------------------------- index.html ---
const appHtml = ssr.render()
const indexHtml = template
  .replaceAll('__SITE_URL__', SITE)
  .replace('<!--structured-data-->', `${ld(graph)}\n    ${noJs}`)
  .replace('<!--app-html-->', appHtml)
await writeFile(path.join(DIST, 'index.html'), indexHtml)

// ------------------------------------------------------------ app.html ---
const appShell = template
  .replaceAll('__SITE_URL__', SITE)
  .replace(/<title>[^<]*<\/title>/, '<title>FunAsia Community</title>')
  .replace(/<meta name="robots"[^>]*>/, '<meta name="robots" content="noindex, nofollow" />')
  .replace(/\s*<link rel="canonical"[^>]*>/, '')
  .replace('<!--structured-data-->', '')
  .replace('<!--app-html-->', '')
await writeFile(path.join(DIST, 'app.html'), appShell)

// ------------------------------------------------------------ 404.html ---
await writeFile(
  path.join(DIST, '404.html'),
  `<!doctype html>
<html lang="en-US">
<head>
<meta charset="UTF-8" /><meta name="viewport" content="width=device-width, initial-scale=1" />
<title>Page not found | FunAsia Community Outreach</title>
<meta name="robots" content="noindex" />
<link rel="icon" href="/favicon.ico" sizes="any" />
<style>
  body{margin:0;min-height:100vh;display:grid;place-items:center;background:#faf6ec;color:#1b2724;
       font-family:Inter,system-ui,-apple-system,Segoe UI,Roboto,sans-serif;text-align:center;padding:24px}
  img{width:72px;height:72px;border-radius:18px;background:#fdfbf5;padding:8px;box-shadow:0 12px 40px -16px rgb(10 51 43/.25)}
  h1{font-family:Georgia,serif;font-size:2rem;color:#0a332b;margin:24px 0 8px}
  p{color:#46554f;margin:0 0 28px}
  a{display:inline-block;background:#d6294d;color:#fdfbf5;text-decoration:none;font-weight:600;padding:14px 28px;border-radius:999px}
</style>
</head>
<body><main>
<img src="/apple-touch-icon.png" alt="FunAsia Community Outreach logo" />
<h1>We couldn't find that page</h1>
<p>It may have moved — everything lives on our home page.</p>
<a href="/">Go to the home page</a>
</main></body>
</html>
`,
)

// ---------------------------------------------------------- robots.txt ---
const AI_AGENTS = [
  'GPTBot', 'OAI-SearchBot', 'ChatGPT-User',
  'ClaudeBot', 'Claude-User', 'Claude-SearchBot', 'anthropic-ai',
  'PerplexityBot', 'Perplexity-User',
  'Google-Extended', 'Applebot-Extended', 'meta-externalagent', 'CCBot', 'Amazonbot',
]
await writeFile(
  path.join(DIST, 'robots.txt'),
  `# FunAsia Community Outreach — ${SITE}
User-agent: *
Allow: /
Disallow: /auth
Disallow: /community

# AI assistants and answer engines are welcome to read and cite this site.
# A plain-language summary lives at ${SITE}/llms.txt
${AI_AGENTS.map((a) => `User-agent: ${a}`).join('\n')}
Allow: /
Disallow: /auth
Disallow: /community

Sitemap: ${SITE}/sitemap.xml
`,
)

// --------------------------------------------------------- sitemap.xml ---
const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')
const images = [
  { loc: '/og-image.jpg', title: 'FunAsia Community Outreach' },
  ...heroSlides.map((s) => ({ loc: s.src, title: s.alt })),
  ...gallery.map((g) => ({ loc: g.src, title: g.alt })),
  { loc: ceo.photo, title: `${ceo.name}, ${ceo.role}` },
  { loc: outreachLead.photo, title: `${outreachLead.name}, Community Outreach Lead` },
  { loc: featuredStory.image, title: featuredStory.title },
].filter((v, i, a) => a.findIndex((x) => x.loc === v.loc) === i)

await writeFile(
  path.join(DIST, 'sitemap.xml'),
  `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
  <url>
    <loc>${SITE}/</loc>
    <lastmod>${today}</lastmod>
${images.map((im) => `    <image:image><image:loc>${esc(abs(im.loc))}</image:loc><image:title>${esc(im.title)}</image:title></image:image>`).join('\n')}
  </url>
</urlset>
`,
)

// ------------------------------------------------------------ llms.txt ---
const statLine = stats.map((s) => `${s.value}${s.suffix ?? ''} ${s.label.toLowerCase()}`).join(', ')
await writeFile(
  path.join(DIST, 'llms.txt'),
  `# ${site.name}

> ${faqs[0].a}

Key facts:
- Tagline: "${site.tagline.join(' ')}"
- Address: ${site.address}, USA
- Phone: ${site.phone}
- Service area: Dallas–Fort Worth metroplex, with partner organizations across Texas (Austin, San Antonio, Houston)
- Pillars: ${pillars.map((p) => p.title).join(', ')}
- Leadership: ${ceo.name} (CEO, FunAsia Network); ${outreachLead.name} (Community Outreach Lead and host of FunAsia's "Community Hour" radio show, Saturdays 2–3 PM)
- By the numbers: ${statLine}
- Partners: ${allPartners.length} nonprofits, temples, cultural associations and civic organizations

## Pages
- [Home](${SITE}/): mission, leadership, partners, photo gallery, testimonials, FAQ and contact form
- [Partners](${SITE}/#partners): ${allPartners.length} partner organizations
- [FAQ](${SITE}/#faq): common questions answered
- [Contact](${SITE}/#contact): message form and phone number

## Details
- [Full profile](${SITE}/llms-full.txt): mission, leadership bios, partner directory, testimonials and FAQ in plain text

## Optional
- [Sitemap](${SITE}/sitemap.xml)
`,
)

// ------------------------------------------------------- llms-full.txt ---
const byRegion = {}
for (const p of allPartners) (byRegion[p.region] ??= []).push(p)
const partnerSection = Object.entries(byRegion)
  .map(([reg, list]) =>
    `### ${reg}\n` +
    list
      .map((p) =>
        // Entries flagged `verify` were described from their logo only — publish just the basics.
        p.verify
          ? `- ${p.name} — ${p.category}${p.city ? ` (${p.city})` : ''}`
          : `- ${p.name} — ${p.category}${p.city ? ` (${p.city})` : ''}: ${p.description}`,
      )
      .join('\n'),
  )
  .join('\n\n')

await writeFile(
  path.join(DIST, 'llms-full.txt'),
  `# ${site.name} — full profile

Website: ${SITE}/
Address: ${site.address}, USA
Phone: ${site.phone}

## About
${faqs[0].a}

${site.heroIntro}

## Mission
${mission.text}

## Core pillars
${pillars.map((p) => `- **${p.title}:** ${p.blurb}`).join('\n')}

## By the numbers
${stats.map((s) => `- ${s.value}${s.suffix ?? ''} ${s.label}`).join('\n')}

## Leadership
### ${ceo.name} — ${ceo.role}
${ceo.headline}

${ceo.bio.join('\n\n')}

> "${ceo.quote}" — ${ceo.name}

### ${outreachLead.name} — Community Outreach Lead
${outreachLead.bio.join('\n\n')}

${outreachLead.name} hosts FunAsia's ${outreachLead.show.name.replace(/[“”]/g, '"')}, which airs ${outreachLead.show.schedule.replace('·', '—')}.

## Community spotlight: ${featuredStory.title}
${featuredStory.paragraphs.join('\n\n')}

## Frequently asked questions
${faqs.map((f) => `### ${f.q}\n${f.a}`).join('\n\n')}

## What partners say
${testimonials.map((t) => `### ${t.name} — ${t.org}\n"${t.text}"`).join('\n\n')}

## Partner organizations (${allPartners.length})
${partnerSection}
`,
)

await rm(path.join(ROOT, 'dist-ssr'), { recursive: true, force: true })
console.log(`prerender: index.html (${(indexHtml.length / 1024).toFixed(0)} KB), app.html, 404.html, robots.txt, sitemap.xml, llms.txt, llms-full.txt → ${SITE}`)
