// ---------------------------------------------------------------------------
// All page content lives here so the components stay purely presentational.
// When the Firebase backend lands, swap these exports for Firestore fetches
// without touching the UI layer.
// ---------------------------------------------------------------------------

export const site = {
  name: 'FunAsia Community Outreach',
  tagline: ['Connecting Communities.', 'Empowering Lives.'],
  heroIntro:
    'FunAsia is proud to support nonprofits, promote women leaders, and give back through impactful community events.',
  address: '6850 TPC Dr STE 108, McKinney, TX 75070',
  addressUrl:
    'https://maps.google.com/?q=6850+TPC+Dr+STE+108,+McKinney,+TX+75070',
  phone: '+1 469-424-3188',
  phoneHref: 'tel:+14694243188',
  // The organization's own social profiles. An icon only appears on the site
  // once its URL is filled in — e.g. facebook: 'https://www.facebook.com/…'
  socials: {
    facebook: '',
    instagram: '',
    youtube: '',
  },
}

/** Social profiles that actually have a URL, ready to render. */
export const activeSocials = Object.entries(site.socials)
  .filter(([, url]) => url && url.startsWith('http'))
  .map(([network, url]) => ({ network, url }))

export const heroSlides = [
  { src: '/images/banner_main1.jpg', alt: 'FunAsia honoring community leaders on stage' },
  { src: '/images/VaishaliB2.jpeg', alt: 'FunAsia community celebration' },
  { src: '/images/banner_main3.jpg', alt: 'Community event blessing ceremony' },
  { src: '/images/sewa_runninig.jpeg', alt: 'Sewa International DFW 5K run' },
]

export const mission = {
  eyebrow: 'Our Mission',
  text: "FunAsia's Community Outreach division is dedicated to uplifting communities through partnerships with nonprofits, support for women's empowerment, and culturally vibrant events.",
  image: '/images/vibha4.png',
}

export const pillars = [
  {
    title: 'Philanthropy',
    blurb:
      'Partnering with nonprofits and amplifying their causes across the DFW South Asian community.',
    icon: 'HeartHandshake',
  },
  {
    title: 'Women Empowerment',
    blurb:
      'Championing women-led initiatives, scholarship programs, and platforms that give women a voice.',
    icon: 'Sparkles',
  },
  {
    title: 'Community Engagement',
    blurb:
      'Culturally vibrant events, radio outreach, and celebrations that bring people together.',
    icon: 'Users',
  },
]

export const stats = [
  { value: 30, label: 'Interview Videos' },
  { value: 10, label: 'Years Helping the Community' },
  { value: 7, label: 'Awards' },
  { value: 20, suffix: '+', label: 'Testimonials' },
]

export const ceo = {
  name: 'Vaishali Thakkar',
  role: 'CEO, FunAsia Network',
  headline: "Leader Supporting Women's Empowerment!",
  photo: '/images/Vaishali2.jpg',
  bio: [
    'Vaishali Thakkar is the driving force behind our community outreach mission. As the CEO of FunAsia Network, she blends business acumen with a deep-rooted passion for social change. Her leadership is marked by a commitment to empowering underserved communities, supporting women-led initiatives, and creating platforms that celebrate cultural diversity.',
    'A dedicated philanthropist, Vaishali has championed numerous nonprofit partnerships, scholarship programs, and health awareness campaigns across the South Asian community in the U.S. Her belief that “true leadership uplifts others” guides every initiative we take on. Whether it’s providing a voice to the unheard, promoting education, or advocating for women empowerment, Vaishali’s vision continues to inspire change—one project at a time.',
  ],
  quote:
    'Leadership is not just about business success—it’s about building stronger communities.',
  socials: {
    facebook: 'https://www.facebook.com/vaishali.thakkar.3386',
    instagram: 'https://www.instagram.com/vaishali9450/?hl=en',
  },
}

export const outreachLead = {
  name: 'Neelam Dave',
  role: 'Community Outreach Lead · Host, Community Hour',
  photo: '/images/neelam.jpg',
  bio: [
    'Under the dynamic leadership of Vaishali Thakkar, Neelam Dave leads the Community Outreach department at FunAsia Network, a leading South Asian media platform based in Dallas–Fort Worth. In her role, she spearheads initiatives that foster cultural engagement, social awareness, and community empowerment within the South Asian diaspora.',
    "Neelam's commitment to community service extends beyond broadcasting. She actively collaborates with local organizations, supports cultural events, and engages in initiatives that promote inclusivity and representation.",
  ],
  show: {
    name: '“Community Hour” Radio Show',
    schedule: 'Every Saturday · 2–3 PM',
  },
}

export const partners = [
  {
    name: 'Vibha',
    slug: 'vibha',
    blurb: 'High-Quality Public Education for Every Child',
    image: '/images/VIBHA.png',
  },
  {
    name: 'DCICA',
    slug: 'dcica',
    blurb: 'Denton County India Cultural Association',
    image: '/images/dcica.jpg',
  },
  {
    name: 'Solace',
    slug: 'solace-charities',
    blurb: 'Solace for Kids',
    image: '/images/solace.jpg',
  },
  {
    name: 'ISKCON',
    blurb: 'International Society for Krishna Consciousness',
    image: '/images/ISKON.png',
  },
  {
    name: 'Maratha Mandal',
    slug: 'maratha-mandal',
    blurb: 'Since 1986',
    image: '/images/maratha.png',
  },
  {
    name: 'ZAKA',
    slug: 'zaka',
    blurb: 'The Angels Who Dare To Do What None Can Bear — Anytime, Anywhere.',
    image: '/images/zakira.png',
  },
]


export const gallery = [
  { src: '/images/vaishaliB1.jpeg', alt: 'Community gathering', wide: true, w: 1600, h: 1064 },
  { src: '/images/VaishaliB2.jpeg', alt: 'Cultural celebration', wide: true, w: 1600, h: 1064 },
  { src: '/images/sewa_runninig.jpeg', alt: 'Sewa 5K run in progress', wide: true, w: 1206, h: 766 },
  { src: '/images/vaishaliB3.jpeg', alt: 'Community outreach moment', w: 1600, h: 2131 },
  { src: '/images/vaishali4.jpg', alt: 'FunAsia event highlight', w: 1080, h: 864 },
  { src: '/images/banner_main1.jpg', alt: 'Honoring community leaders', wide: true, w: 1600, h: 906 },
  { src: '/images/banner_main3.jpg', alt: 'Blessing ceremony', w: 1600, h: 1261 },
  { src: '/images/Vaishali.jpg', alt: 'Vaishali Thakkar at an event', w: 1092, h: 1092 },
  { src: '/images/v1.jpg', alt: 'FunAsia community program', wide: true, w: 900, h: 600 },
  { src: '/images/vibha4.png', alt: 'Friends at a community festival', w: 482, h: 338 },
]

export const featuredStory = {
  eyebrow: 'Community Spotlight',
  title: 'DFW Chapter 5K Run',
  image: '/images/sewa_winner.jpeg',
  paragraphs: [
    'What an amazing morning at the Sewa International — DFW Chapter 5K Run/Walk! 🏃‍♂️💫💪',
    "DFW Chapter's 5K Run/Walk at George Webb Park in McKinney was a heartwarming success. Over 200 participants—families, kids, and runners of all ages—gathered at 6:30 a.m., celebrating Wellness + Sewa for the Sewa Hindu Mobile Food Pantry.",
    'Huge thanks to our dedicated volunteers and generous sponsors, Gratiture Foundation and Thrivent.',
    "Congratulations to our medal winners in the kids, women's, and men's divisions. Let's keep this energy alive—one step at a time! ✨",
  ],
  highlights: [
    { value: '200+', label: 'Participants' },
    { value: '6:30 AM', label: 'Sunrise start' },
    { value: '3', label: 'Medal divisions' },
  ],
}

export const testimonials = [
  {
    name: 'Sudha Jagannath',
    org: 'Heartfulness Institute Volunteer',
    logo: '/images/heartfulness.png',
    text: "I want to take a moment to express my appreciation and heartfelt gratitude for FunAsia and Vaishali Thakkar's team for the excellent services that have been provided to us for a long time and continue to be provided. What stood out to me was that, the Heartfulness Institute being an NPO, the FunAsia team has given us the utmost priority every time I have called in and requested a service — be it a simple announcement on Community Roundup or advertisements. They have always been available when we needed them. Our Heartfulness community is indebted to the service they offer. It is with great pleasure and pride that I recommend FunAsia services and wish the best for Vaishali and team.",
  },
  {
    name: 'Sejal Parikh',
    org: 'VYO – World',
    logo: '/images/vyo.png',
    text: 'On behalf of Sewa International – DFW Chapter, I would like to take this opportunity to express our deep appreciation and gratitude to FunAsia Radio for its invaluable support and efforts in reaching out to the Indian American community of the DFW metroplex for our endeavors. FunAsia Radio interviewed Sewa International’s representatives and made public announcements on air whenever requested as part of their community outreach. Its generosity and patronage have made a significant difference in spreading Sewa International’s message of selfless service. Together we serve better!',
  },
  {
    name: 'Gitesh Desai',
    org: 'President, Sewa USA',
    logo: '/images/sewa.png',
    text: 'On behalf of Sewa International – DFW Chapter, I would like to express our deep appreciation and gratitude to FunAsia Radio for its invaluable support in reaching out to the Indian American community of the DFW metroplex. FunAsia Radio interviewed Sewa International’s representatives and made public announcements on air whenever requested. Its generosity and patronage have made a significant difference in spreading Sewa International’s message of selfless service. We are fortunate to have community members like FunAsia Radio come together to make a positive impact. Thank you for your contribution. Together we serve better!',
  },
  {
    name: 'Susan Paul',
    org: 'President, Solace Charities',
    logo: '/images/solace2.png',
    text: 'On behalf of Solace Charities Dallas, I would like to extend our heartfelt gratitude for your invaluable media partnership in the musical concert “Solace Charities – Snehardramayi High Five 2025” on May 10th, 2025. Your support has been instrumental in raising awareness and funds for 5,600 critically ill children of Solace in Kerala, and we are truly grateful for your commitment to this cause. Together with Solace Charities, we are making a meaningful difference in the lives of these children and their families. We look forward to continuing this partnership and achieving even greater success together.',
  },
  {
    name: 'Malvika Shah',
    org: 'President, Vishnav Milan of Texas',
    logo: '/images/vishnav.png',
    text: 'With great pleasure, I would like to thank Vaishaliji, Neelam Ben, and the entire FunAsia Radio team for being a wonderful platform for the entire DFW Indian community. Your highly talented team consistently brings valuable information to connect the community on time, without ever missing a deadline. The way you do this is truly unique. Your selfless support for non-profit organizations in promoting their events is deeply appreciated. Thank you once again. With Jay Shree Krushna.',
  },
  {
    name: 'Ranna Jani',
    org: 'Hindu Temple of Greater Fort Worth',
    logo: '/images/hindu_fortworth.png',
    text: 'On behalf of the Hindu Temple of Greater Fort Worth, we would like to thank you and all of FunAsia for your wonderful support of our temple and the community in general. Through FunAsia’s announcements, the visibility for our events has been very helpful. FunAsia’s commitment to serving the community has been exemplary and a testament to the power of using a larger platform to elevate the community as a whole. The broader Indian community of the DFW area is stronger through connection, and FunAsia’s voices help foster and grow that connection.',
  },
]

export const contact = {
  heading: 'Do you have any questions?',
  copy:
    'If you have any questions or would like to work with us, fill out the form and our team will call you back during the day.',
  services: ['Women Empowerment', 'Community Engagement', 'Philanthropy'],
}

// Shown in the FAQ section and published as FAQPage structured data — written
// to be quotable by search engines and AI assistants. Keep answers factual.
export const faqs = [
  {
    q: 'What is FunAsia Community Outreach?',
    a: "FunAsia Community Outreach is the community-service division of FunAsia Network, a South Asian media platform based in Dallas–Fort Worth, Texas. It uplifts communities through partnerships with nonprofits, support for women's empowerment, and culturally vibrant events.",
  },
  {
    q: 'What does FunAsia Community Outreach do?',
    a: 'Its work rests on three pillars: philanthropy, women empowerment and community engagement. In practice that means amplifying nonprofit causes on air — through interviews, community announcements and media partnerships for fundraisers and events — and supporting community gatherings such as the Sewa International DFW 5K Run/Walk.',
  },
  {
    q: 'Who leads FunAsia Community Outreach?',
    a: 'The mission is driven by Vaishali Thakkar, CEO of FunAsia Network. The Community Outreach department is led by Neelam Dave, who also hosts FunAsia’s “Community Hour” radio show.',
  },
  {
    q: 'When does the “Community Hour” radio show air?',
    a: 'FunAsia’s “Community Hour,” hosted by Neelam Dave, airs every Saturday from 2 to 3 PM.',
  },
  {
    q: 'Which organizations has FunAsia Community Outreach supported?',
    a: 'More than 80 nonprofits, temples, cultural associations and civic groups across Texas, including Sewa International, Vibha, Pratham USA, Solace Charities, Heartfulness Institute, BAPS Swaminarayan Sanstha, Chinmaya Mission Dallas/Fort Worth, Tarrant Area Food Bank and the City of Dallas.',
  },
  {
    q: 'How can my nonprofit partner with FunAsia?',
    a: 'Send a message through the contact form on this page or call +1 469-424-3188. The team responds the same day and can talk through announcements, interviews and event partnerships for your organization.',
  },
  {
    q: 'Where is FunAsia Community Outreach located?',
    a: 'The office is at 6850 TPC Dr STE 108, McKinney, TX 75070. The team serves the Dallas–Fort Worth metroplex and partners with organizations in Austin, San Antonio, Houston and across Texas.',
  },
]
