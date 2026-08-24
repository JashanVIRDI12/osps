import {
  Ambulance,
  Award,
  BadgeCheck,
  Bandage,
  Building2,
  ClipboardCheck,
  Clock,
  Droplets,
  Globe,
  Handshake,
  HeartPulse,
  Instagram,
  Mail,
  MapPin,
  Microscope,
  PackageCheck,
  Phone,
  PiggyBank,
  ShieldCheck,
  Stethoscope,
  Store,
  Syringe,
  Users,
  Warehouse,
  type LucideIcon,
} from 'lucide-react';
import { PRODUCT_INTERESTS } from './schema';

/**
 * Single source of truth for every piece of copy on the page.
 *
 * Contact details and social URLs are the live brand details used across the
 * site. Product photographs in `/public/images` are unbranded; the OSPS mark
 * lives on the site chrome and in the operations footage.
 */

export const site = {
  name: 'Om Sai Pharma & Surgicals',
  shortName: 'OSPS',
  wordmark: 'OSPS+',
  founded: 2015,
  tagline: 'Quality You Can Trust, Care You Deserve',
  description:
    'Om Sai Pharma & Surgicals manufactures and supplies a complete range of surgical products (syringes, I.V. cannulas, infusion sets, dressings, tapes and theatre essentials) to hospitals in India and 20+ countries worldwide.',
  url: 'https://ospsmed.com',
};

/** The four claims that lead the page. */
export const highlights = [
  { label: 'Premium Quality', icon: Award },
  { label: 'WHO-GMP Certified', icon: ShieldCheck },
  { label: 'Trusted by 150+ Hospitals', icon: Building2 },
  { label: 'Exporting to 20+ Countries', icon: Globe },
];

export const navLinks = [
  { label: 'About', href: '#about' },
  { label: 'Products', href: '#products' },
  { label: 'Services', href: '#services' },
  { label: 'Process', href: '#process' },
  { label: 'Contact', href: '#contact' },
];

/* ------------------------------------------------------------------ hero */

export const hero = {
  eyebrow: 'WHO-GMP Certified Surgical Manufacturer & Supplier',
  headline: 'Quality you can trust, care you deserve.',
  tagline: site.tagline,
  body: 'A complete range of surgical products (syringes, I.V. cannulas, infusion sets, dressings, tapes and theatre essentials) made to WHO-GMP standards, trusted by 150+ hospitals and exported to more than 20 countries.',
  primaryCta: { label: 'Request a Quote', href: '#contact' },
  secondaryCta: { label: 'Explore products', href: '#products' },
  stats: [
    { value: 15, suffix: '', label: 'Product categories' },
    { value: 150, suffix: '+', label: 'Hospitals supplied' },
    { value: 20, suffix: '+', label: 'Export markets' },
  ],
  tags: ['Premium Quality', 'WHO-GMP Certified', 'Export Grade'],
  image: {
    src: '/images/hero-warehouse.webp',
    alt: 'OSPS warehouse loading bay with a refrigerated dispatch truck',
  },
  /**
   * Backdrop for the sticky panel that expands from a framed rectangle to
   * full-bleed as the visitor scrolls.
   *
   * `src` is the still: it is painted as a CSS background, doubles as the
   * video's poster, and is the page's LCP element — it is preloaded in the root
   * layout. `video` is the warehouse dispatch footage that fades in over it
   * once the page has finished loading, and is skipped entirely under reduced
   * motion or on a metered connection, in which case the still is the whole
   * composition.
   */
  backdrop: {
    src: '/images/hero-warehouse.webp',
    video: '/videos/warehouse.mp4',
    alt: 'OSPS warehouse loading bay with a refrigerated dispatch truck',
    videoLabel: 'OSPS warehouse dispatch and loading operations',
  },
};

/** Continuous strip under the hero — the promise, repeated. */
export const marquee = [
  'Premium Quality',
  'WHO-GMP Certified',
  'Trusted by 150+ hospitals',
  'Exporting to 20+ countries',
  'Sterile & X-ray detectable options',
  'Same-day quotes',
];

/* ----------------------------------------------------------------- about */

export const about = {
  eyebrow: 'About OSPS',
  statement: 'Delivering Healthcare with Trust Since 2015',
  lead: 'For over a decade we have kept hospitals, nursing homes and clinics supplied with the surgical consumables their theatres and wards run on, made to WHO-GMP standards and delivered on schedule.',
  body: 'What began as a small regional supplier now serves healthcare institutions in more than twenty countries. Our strength lies in disciplined quality control on every batch, a complete surgical range available under one purchase order, and a team that treats each order as a commitment rather than a transaction.',
  cta: { label: 'Learn more about us', href: '#services' },
  video: {
    src: '/videos/dispatch.mp4',
    poster: '/images/dispatch-poster.webp',
    alt: 'OSPS refrigerated truck being loaded at the Greater Noida warehouse',
    videoLabel: 'OSPS dispatch from the Greater Noida warehouse',
    caption: `Supplying healthcare institutions since ${site.founded}.`,
  },
};

/* -------------------------------------------------------------- products */

export type ProductCategory = {
  number: string;
  title: string;
  description: string;
  icon: LucideIcon;
  items: string[];
  /** Surface colour for the stacking card — a step of the royal ramp. */
  tone: string;
  image: {
    src: string;
    alt: string;
    /**
     * Optional looping clip for the card. The still above is its poster, so a
     * category with no footage yet — or a visitor on a phone, on a metered
     * connection, or asking for less motion — simply keeps the photograph.
     */
    video?: string;
  };
};

export const productCategories: ProductCategory[] = [
  {
    number: '01',
    title: 'Injection & Infusion',
    description:
      'The disposables that carry fluid and medication to the patient, supplied sterile, single-use, and in the needle, safety and air-vent configurations each ward specifies.',
    icon: Syringe,
    items: ['Surgical Syringes', 'I.V. Cannulas', 'Infusion Sets'],
    tone: '#102463',
    image: {
      src: '/images/category-injection.webp',
      alt: 'Injection and infusion products: syringes, I.V. cannulas and infusion sets',
    },
  },
  {
    number: '02',
    title: 'Drainage & Collection',
    description:
      'Closed-system drainage and collection for post-operative and bedside care, available with or without T-valve and trocar to suit the procedure.',
    icon: Droplets,
    items: ['Urine Bags', 'Wound Drainage Sets'],
    tone: '#18318c',
    image: {
      src: '/images/category-drainage.webp',
      alt: 'Drainage and collection sets with sterile tubing components',
    },
  },
  {
    number: '03',
    title: 'Dressings & Bandages',
    description:
      'Wound care from first dressing to final wrap, including plain and X-ray detectable swabs and sponges for theatre counts, plus the full tape and plaster range.',
    icon: Bandage,
    items: [
      'Gauze Swabs',
      'Surgical Sponges',
      'Crepe Bandage',
      'Elastic Bandage',
      'Adhesive Tapes',
      'Plasters',
    ],
    tone: '#1d3fbf',
    image: {
      src: '/images/category-dressings.webp',
      alt: 'Dressings, gauze swabs, tapes and plasters in sterile packaging',
    },
  },
  {
    number: '04',
    title: 'Theatre & Protection',
    description:
      'Barrier protection and theatre consumables: sterile carbon-steel blades, latex, nitrile and vinyl gloves, 3-ply masks, and ready-assembled sterile kits.',
    icon: ShieldCheck,
    items: [
      'Surgical Blades',
      'Examination Gloves',
      'Face Masks',
      'Sterile Surgical Kits',
    ],
    tone: '#3a5ce8',
    image: {
      src: '/images/category-theatre.webp',
      alt: 'Theatre protection kit with gloves, masks, blades and sterile packs',
    },
  },
];

export type Product = {
  /** Continuous 01–15 numbering, in the order the range is quoted. */
  number: string;
  name: string;
  /** The configurations each product is supplied in. */
  variants: string[];
  image: {
    src: string;
    alt: string;
  };
};

export type ProductGroup = {
  title: string;
  products: Product[];
};

export const productGroups: ProductGroup[] = [
  {
    title: 'Injection & Infusion',
    products: [
      {
        number: '01',
        name: 'Surgical Syringes',
        variants: ['With Needle', 'Without Needle'],
        image: {
          src: '/images/hero-syringes.webp',
          alt: 'Sterile surgical syringes',
        },
      },
      {
        number: '02',
        name: 'I.V. Cannulas',
        variants: ['With Safety', 'Without Safety'],
        image: {
          src: '/images/product-cannulas.webp',
          alt: 'Sterile I.V. cannulas with safety options',
        },
      },
      {
        number: '03',
        name: 'Infusion Sets',
        variants: ['With Air Vent', 'Without Air Vent'],
        image: {
          src: '/images/product-infusion.webp',
          alt: 'Sterile infusion sets with drip chamber',
        },
      },
    ],
  },
  {
    title: 'Drainage & Collection',
    products: [
      {
        number: '04',
        name: 'Urine Bag',
        variants: ['With T Valve', 'Without T Valve'],
        image: {
          src: '/images/product-urine-bag.webp',
          alt: 'Sterile urine drainage collection bag',
        },
      },
      {
        number: '05',
        name: 'Wound Drainage Set',
        variants: ['With Trocar', 'Without Trocar'],
        image: {
          src: '/images/product-drainage-set.webp',
          alt: 'Wound drainage set with trocar',
        },
      },
    ],
  },
  {
    title: 'Dressings, Bandages & Tapes',
    products: [
      {
        number: '06',
        name: 'Gauze Swabs',
        variants: ['Plain', 'X-Ray Detectable'],
        image: {
          src: '/images/hero-gauze.webp',
          alt: 'Sterile gauze swabs',
        },
      },
      {
        number: '07',
        name: 'Surgical Sponges',
        variants: ['Plain', 'X-Ray Detectable'],
        image: {
          src: '/images/product-sponges.webp',
          alt: 'Sterile surgical sponges',
        },
      },
      {
        number: '08',
        name: 'Crepe Bandage',
        variants: ['With Elastic', 'Without Elastic'],
        image: {
          src: '/images/hero-bandage.webp',
          alt: 'Crepe bandage rolls',
        },
      },
      {
        number: '09',
        name: 'Elastic Bandage',
        variants: ['Premium Quality'],
        image: {
          src: '/images/product-elastic.webp',
          alt: 'Premium elastic compression bandage',
        },
      },
      {
        number: '10',
        name: 'Adhesive Tapes',
        variants: ['Micropore', 'Paper', 'Silk', 'PE'],
        image: {
          src: '/images/product-tapes.webp',
          alt: 'Medical adhesive tapes',
        },
      },
      {
        number: '11',
        name: 'Plasters',
        variants: ['Zig-Zag', 'Elastic', 'Regular'],
        image: {
          src: '/images/product-plasters.webp',
          alt: 'Medical plasters and adhesive bandages',
        },
      },
    ],
  },
  {
    title: 'Theatre & Protection',
    products: [
      {
        number: '12',
        name: 'Surgical Blades',
        variants: ['Sterile', 'Carbon Steel'],
        image: {
          src: '/images/product-blades.webp',
          alt: 'Sterile carbon steel surgical blades',
        },
      },
      {
        number: '13',
        name: 'Examination Gloves',
        variants: ['Latex', 'Nitrile', 'Vinyl'],
        image: {
          src: '/images/product-gloves.webp',
          alt: 'Powder-free examination gloves in latex and nitrile',
        },
      },
      {
        number: '14',
        name: 'Face Mask',
        variants: ['3 Ply', 'With Tie', 'Without Tie'],
        image: {
          src: '/images/product-masks.webp',
          alt: '3-ply surgical face masks',
        },
      },
      {
        number: '15',
        name: 'Sterile Surgical Kit',
        variants: ['Premium Quality'],
        image: {
          src: '/images/product-kit.webp',
          alt: 'Sealed sterile surgical procedure kit',
        },
      },
    ],
  },
];

export const productAccent = {
  title: 'Fifteen product categories, one accountable supplier.',
  body: 'One purchase order, one point of contact, one accountable partner for your entire facility.',
  cta: { label: 'Request the full catalogue', href: '#contact' },
};

export const productImageCard = {
  src: '/images/accent-quality.webp',
  alt: 'OSPS quality team inspecting and packaging sterile surgical batches for WHO-GMP dispatch',
  caption: 'Every batch quality-checked and packaged to WHO-GMP standards before dispatch.',
};

/* ------------------------------------------------------------- downloads */

/**
 * The full SKU list, offered as a file. Counts come from the workbook itself —
 * update them alongside the spreadsheet in `public/downloads/`.
 */
export const priceList = {
  eyebrow: 'Full product list',
  heading: 'Download the complete SKU list.',
  lead: 'Every line we stock, in one spreadsheet: surgical and medical devices plus pharmaceuticals, with product codes and pack sizes. Send it back with your quantities marked and we will quote against it directly.',
  file: {
    href: '/downloads/osps-product-list.xlsx',
    name: 'osps-product-list.xlsx',
    format: 'XLSX',
    size: '48 KB',
  },
  sheets: [
    { label: 'Surgical & Medical Devices', count: 1209 },
    { label: 'Pharmaceuticals', count: 370 },
  ],
  total: 1579,
  cta: { label: 'Download product list', href: '/downloads/osps-product-list.xlsx' },
  secondaryCta: { label: 'Or send us your requirement list', href: '#contact' },
};

/* -------------------------------------------------------------- services */

export const services = {
  eyebrow: 'Our strengths',
  heading: 'Why Healthcare Professionals Choose OSPS',
  lead: 'Procurement teams stay with us because the fundamentals are handled: stock is available, orders move quickly, and what arrives is exactly what was promised.',
  items: [
    {
      icon: PackageCheck,
      title: 'Reliable Product Availability',
      description:
        'Deep, actively managed inventory across fast-moving lines so critical items are in stock when you need them.',
    },
    {
      icon: Clock,
      title: 'Fast Order Processing',
      description:
        'Enquiries quoted the same working day and confirmed orders picked, packed and moving without delay.',
    },
    {
      icon: ShieldCheck,
      title: 'Trusted Quality',
      description:
        'WHO-GMP certified manufacturing, with batch, expiry and packaging integrity verified before anything ships.',
    },
    {
      icon: PiggyBank,
      title: 'Competitive Pricing',
      description:
        'Manufacturing at scale passed on as transparent pricing, with no hidden loading on export or bulk orders.',
    },
    {
      icon: Users,
      title: 'Dedicated Customer Support',
      description:
        'A named contact who knows your account, your usage patterns and your reorder cycles.',
    },
    {
      icon: Handshake,
      title: 'Long-Term Partnerships',
      description:
        'Most of our business comes from institutions we have supplied for years, not one-off transactions.',
    },
  ],
};

/**
 * Operations footage: warehouse loading is the hero backdrop (`hero.backdrop`);
 * the refrigerated-truck dispatch clip sits on the About block (`about.video`).
 */

/* --------------------------------------------------------------- process */

export const process = {
  eyebrow: 'How we work',
  heading: 'Our Process',
  lead: 'A straightforward, transparent path from first enquiry to delivered consignment.',
  /**
   * Sits in the sticky column beside the steps. Its subject is step one — a
   * requirement list being written down — so it introduces the sequence rather
   * than decorating it, and stays in view while the rest scrolls past.
   */
  graphic: {
    src: '/images/clinician.webp',
    poster: '/images/clinician-still.webp',
    alt: 'A clinician noting a ward order on a clipboard',
  },
  steps: [
    {
      title: 'Order Enquiry',
      description: 'Share your requirement list by phone, email or the quote form.',
    },
    {
      title: 'Quotation & Confirmation',
      description: 'Itemised pricing and availability returned the same working day.',
    },
    {
      title: 'Procurement & Quality Check',
      description: 'Sourced from certified vendors and checked for batch and expiry.',
    },
    {
      title: 'Packaging',
      description: 'Packed to protect integrity, with temperature-sensitive items handled separately.',
    },
    {
      title: 'Dispatch',
      description: 'Consignment released with documentation and tracking details shared.',
    },
    {
      title: 'On-Time Delivery',
      description: 'Delivered to your facility within the committed window, every time.',
    },
  ],
};

/* ----------------------------------------------------------------- stats */

export type Stat = {
  value: number;
  suffix?: string;
  label: string;
};

export const headlineStats: Stat[] = [
  { value: 15, suffix: '', label: 'Product categories' },
  { value: 150, suffix: '+', label: 'Hospitals supplied' },
  { value: 20, suffix: '+', label: 'Export markets' },
  { value: 10, suffix: '+', label: 'Years of manufacturing' },
];

export const whyChooseUs = {
  label: 'Provided by OSPS',
  heading: 'A surgical range measured by what actually reaches the ward.',
  body: 'Certification, consistency and dispatch speed are what procurement teams judge a surgical supplier on. They are the three things we build our operation around.',
  image: {
    src: '/images/metrics-stock.webp',
    alt: 'OSPS supply specialist checking branded surgical stock on storeroom shelves',
  },
  pointers: ['Premium Quality', 'WHO-GMP Certified', 'Export Grade'],
};

/* ------------------------------------------------------------ industries */

export const industries = {
  eyebrow: 'Who we supply',
  heading: 'Industries We Serve',
  lead: 'From single-doctor clinics to multi-speciality hospital groups, our supply model scales to the institution.',
  slides: [
    {
      image: '/images/industries/industry-hospital.webp',
      title: 'Multi-speciality Hospitals',
      description:
        'Full surgical ranges for multi-department hospitals that need one accountable supplier across wards.',
      badge: 'Hospitals',
    },
    {
      image: '/images/industries/industry-gov-hospital.webp',
      title: 'Government Hospitals',
      description:
        'Tender-ready supply with documentation, batch traceability and reliable dispatch windows.',
      badge: 'Public',
    },
    {
      image: '/images/industries/industry-private-hospital.webp',
      title: 'Private Hospitals',
      description:
        'Premium consumables matched to private-care standards, quoted line by line the same day.',
      badge: 'Private',
    },
    {
      image: '/images/industries/industry-clinic.webp',
      title: 'Clinics',
      description:
        'Right-sized packs for OPDs and day clinics: syringes, dressings, gloves and essentials.',
      badge: 'Clinic',
    },
    {
      image: '/images/industries/industry-nursing.webp',
      title: 'Nursing Homes',
      description:
        'Steady reorder cycles for residential care, wound care and routine clinical consumables.',
      badge: 'Care',
    },
    {
      image: '/images/industries/industry-diagnostic.webp',
      title: 'Diagnostic Centres',
      description:
        'Procedure and sample-handling essentials for labs and imaging centres that cannot wait.',
      badge: 'Labs',
    },
    {
      image: '/images/industries/industry-pharmacy.webp',
      title: 'Pharmacies',
      description:
        'Retail-ready surgical lines with clear configurations for counter and institutional orders.',
      badge: 'Retail',
    },
    {
      image: '/images/industries/industry-institution.webp',
      title: 'Healthcare Institutions',
      description:
        'Campus and group buying covered with one catalogue, one quality standard, one contact.',
      badge: 'Campus',
    },
    {
      image: '/images/industries/industry-corporate.webp',
      title: 'Corporate Healthcare Buyers',
      description:
        'Procurement teams get itemised pricing, export-ready packs and a named account contact.',
      badge: 'Corporate',
    },
  ],
  /** @deprecated Prefer slides — kept for any legacy icon-grid references. */
  items: [
    { label: 'Multi-speciality Hospitals', icon: Building2 },
    { label: 'Government Hospitals', icon: Ambulance },
    { label: 'Private Hospitals', icon: HeartPulse },
    { label: 'Clinics', icon: Stethoscope },
    { label: 'Nursing Homes', icon: BadgeCheck },
    { label: 'Diagnostic Centres', icon: Microscope },
    { label: 'Pharmacies', icon: Store },
    { label: 'Healthcare Institutions', icon: Warehouse },
    { label: 'Corporate Healthcare Buyers', icon: Users },
  ],
};

/* ----------------------------------------------------------- core values */

export const coreValues = {
  eyebrow: 'What we stand for',
  heading: 'Core Values',
  items: [
    {
      icon: ShieldCheck,
      title: 'Integrity',
      description: 'Honest pricing and honest answers, including when the answer is no.',
    },
    {
      icon: PackageCheck,
      title: 'Reliability',
      description: 'Commitments on stock and timelines that we hold ourselves to.',
    },
    {
      icon: ClipboardCheck,
      title: 'Quality',
      description: 'Certified sources and verified batches on every single consignment.',
    },
    {
      icon: Users,
      title: 'Customer First',
      description: 'Your clinical schedule sets our priority, not our convenience.',
    },
    {
      icon: Award,
      title: 'Excellence',
      description: 'Continuous improvement across sourcing, packing and delivery.',
    },
  ],
};

/* ------------------------------------------------------------- checklist */

export const checklist = {
  eyebrow: 'The short version',
  heading: 'Why OSPS',
  items: [
    'WHO-GMP Certified Manufacturing',
    'Complete Surgical Range',
    'Sterile & X-Ray Detectable Options',
    'Reliable Supply Chain',
    'Competitive Pricing',
    'Timely Deliveries',
    'Export to 20+ Countries',
    'Long-Term Business Relationships',
  ],
};

/* --------------------------------------------------------------- contact */

export const contact = {
  heading: "Let's Build a Strong Healthcare Partnership",
  lead: 'Send us your requirement list and we will come back with itemised pricing and availability, usually the same working day.',
  productInterests: PRODUCT_INTERESTS,
  details: {
    address: [
      'Om Sai Pharma & Surgicals',
      'Plot No. 39, Lakhnawali Rd, Surajpur',
      'Greater Noida, Uttar Pradesh 201306',
    ],
    phone: '+91 98180 00621',
    phoneHref: 'tel:+919818000621',
    email: 'contact@ospsmed.com',
    emailHref: 'mailto:contact@ospsmed.com',
    hours: ['Monday - Saturday', '9:30 AM - 7:00 PM IST'],
  },
};

export const contactIcons = { MapPin, Phone, Mail, Clock };

/* -------------------------------------------------------- export gateway */

/** OSPS is the domestic site; international buyers are pointed to CHW. */
export const exportGateway = {
  eyebrow: 'Export & overseas supply',
  heading: 'OSPS serves India.',
  body: 'For export catalogues, overseas logistics and international hospital supply, visit our global brand CHW, built for buyers outside India.',
  cta: {
    label: 'Visit chw.co.in',
    href: 'https://chw.co.in',
  },
  secondaryLabel: 'chw.co.in',
  secondaryHref: 'https://chw.co.in',
};

/* ---------------------------------------------------------------- footer */

export const footer = {
  blurb:
    'Manufacturing and supplying a complete range of surgical products (syringes, cannulas, infusion sets, dressings, tapes and theatre essentials) since 2015.',
  socials: [
    { label: 'Instagram', href: 'https://www.instagram.com/ospsmed', icon: Instagram },
  ],
  legal: [{ label: 'Privacy Policy', href: '/privacy' }],
};

/* --------------------------------------------------------- privacy policy */

export const privacyPolicy = {
  title: 'Privacy Policy',
  lastUpdated: 'Aug 03, 2026',
  intro:
    'Om Sai Pharma & Surgicals ("OSPS", "we", "us", "our") is committed to protecting the privacy of our customers, partners, and website visitors. This Privacy Policy explains how we collect, use, and protect your information, including when you communicate with us via WhatsApp.',
  sections: [
    {
      heading: '1. Information We Collect',
      body: 'When you interact with us — through our website, WhatsApp, phone, email, or in person — we may collect:',
      bullets: [
        'Your name, phone number, and email address',
        'Business/company name and shipping or billing address',
        'Order details, product inquiries, and communication history',
        'Payment-related information necessary to process orders (processed securely through our payment partners)',
      ],
    },
    {
      heading: '2. How We Use Your Information',
      body: 'We use the information we collect to:',
      bullets: [
        'Respond to inquiries and provide customer support',
        'Process and fulfill orders, including order confirmations, invoices, and shipment tracking',
        "Send you updates related to your orders, account, or services you've requested",
        'Improve our products and services',
        'Comply with legal and regulatory requirements',
      ],
    },
    {
      heading: '3. WhatsApp Communication',
      paragraphs: [
        'If you contact us via WhatsApp or opt in to receive messages from us, we may use the WhatsApp Business Platform to:',
      ],
      bullets: [
        'Send order confirmations, invoices, shipping updates, and payment reminders',
        'Respond to your questions and support requests',
        'Share relevant product or service information, where you have consented to receive such messages',
      ],
      after: [
        "Your phone number and message content shared via WhatsApp are processed in accordance with Meta's WhatsApp Business Platform policies, in addition to this Privacy Policy. You may opt out of promotional messages at any time by replying \"STOP\" or contacting us directly.",
      ],
    },
    {
      heading: '4. Data Sharing',
      body: 'We do not sell your personal information. We may share information with:',
      bullets: [
        'Trusted service providers who help us operate our business (e.g., logistics partners, payment processors, IT service providers), solely to perform services on our behalf',
        'Regulatory or government authorities where required by law',
      ],
    },
    {
      heading: '5. Data Security',
      paragraphs: [
        'We implement reasonable technical and organizational measures to protect your information from unauthorized access, alteration, disclosure, or destruction.',
      ],
    },
    {
      heading: '6. Data Retention',
      paragraphs: [
        'We retain your information only as long as necessary to fulfill the purposes described in this policy, or as required by applicable law.',
      ],
    },
    {
      heading: '7. Your Rights',
      body: 'You may contact us to:',
      bullets: [
        'Request access to the personal information we hold about you',
        'Request correction or deletion of your information',
        'Withdraw consent to receive marketing communications',
      ],
    },
    {
      heading: '8. Contact Us',
      paragraphs: [
        'If you have any questions about this Privacy Policy or how we handle your information, please contact us at:',
      ],
      contactBlock: true,
    },
    {
      heading: '9. Changes to This Policy',
      paragraphs: [
        'We may update this Privacy Policy from time to time. Any changes will be posted on this page with an updated date.',
      ],
    },
  ],
};

/* ------------------------------------------------------- deck: vision */

/**
 * Content lifted from the 2026 sales deck, kept in deck order so the page and
 * the presentation stay in step when either is revised.
 */
export const visionMission = {
  /**
   * An editorial spread rather than two matching panels. The vision is the
   * destination and the mission is the method, so they are set at two different
   * scales down one column, against a single tall image — and the three methods
   * the mission names close the section as a footer rank.
   */
  eyebrow: 'Our purpose',
  heading: 'Why we do this',
  media: {
    src: '/images/category-theatre.webp',
    alt: 'Sterile theatre consumables prepared for a hospital order',
  },
  vision: {
    label: 'Vision',
    /** The destination. Deliberately the largest type in the section. */
    body: 'To become a trusted and preferred healthcare supply partner, delivering pharmaceutical and surgical products that enhance patient care and strengthen healthcare systems.',
  },
  mission: {
    label: 'Mission',
    body: 'To consistently provide reliable, compliant and cost-effective pharma and surgical solutions, while building long-term partnerships with healthcare providers.',
    /**
     * The three methods the mission statement itself names. Pulled out as
     * fields because they are the operative half of the sentence — the part a
     * procurement lead is actually being asked to believe.
     */
    methodsLabel: 'By means of',
    methods: [
      'A strong supply chain',
      'Ethical business practices',
      'A customer-first approach',
    ],
  },
};

/* ---------------------------------------------- deck: problem/solution */

/**
 * Paired rows. Index `n` of `problems` is answered by index `n` of `solutions`,
 * which is what the interleaved reveal in ProblemSolution depends on — keep the
 * two arrays the same length and in the same order.
 */
export const problemSolution = {
  eyebrow: 'Why we exist',
  heading: 'The procurement problem, and what we do about it',
  problems: {
    label: 'Problem Statement',
    items: [
      'Delay in medicine supply',
      'Multiple vendors for different products',
      'Emergency medicine shortages',
      'Price inconsistency',
    ],
  },
  solutions: {
    label: 'Our Solution',
    items: [
      'Fast delivery, within 4 hours',
      'Medicines and surgical items under one roof',
      'Reliable stock availability',
      'Competitive, transparent pricing',
    ],
  },
};

/* ------------------------------------------------ deck: differentiators */

export const differentiators = {
  eyebrow: 'Why we are different',
  heading: 'Seven things procurement teams notice first',
  /**
   * Transcoded from the supplied GIF to animated WebP: 6.8MB to 679KB for the
   * same 68 frames. `poster` is frame one at 22KB, which is what actually loads
   * until the graphic is near the viewport.
   */
  graphic: {
    src: '/images/patient-care.webp',
    poster: '/images/patient-care-still.webp',
    alt: 'A clinician reviewing a patient chart at the bedside',
    caption: 'Every item on this list exists so this happens on time.',
  },
  items: [
    'You can track your order anytime.',
    'Fast delivery for urgent hospital needs.',
    'All medicines and surgical items under one roof.',
    'Reliable stock availability.',
    'Transparent and competitive pricing.',
    'Dedicated support for hospital purchases.',
    'Quick response and smooth order processing.',
  ],
};

/* ------------------------------------------------------- deck: clients */

/**
 * Institutions supplied. `logo` is optional and unset until the artwork is in
 * `public/images/clients/` — the section renders a wordmark plate until then,
 * so the grid is never a row of broken images.
 */
export type Client = {
  name: string;
  logo?: string;
  /**
   * Optical size correction, applied on top of `object-contain`.
   *
   * `object-contain` fits a mark by its bounding box, which is not the same as
   * making a row of marks look the same size: a square seal like Nivok's fits to
   * the box height and lands at a fraction of the width a wide lockup like Max's
   * gets, and several of these files carry generous whitespace baked into the
   * artwork. These multipliers are eyeballed per logo against the rendered wall.
   * Default is 1.
   */
  scale?: number;
};

export const clients = {
  eyebrow: 'Who we supply',
  heading: 'Our Clients',
  lead: 'Hospitals and healthcare groups that reorder from us, month after month.',
  /**
   * Annotated rather than `satisfies`: `satisfies` would narrow each entry to
   * exactly the keys written here, and every row currently omits `logo` — so
   * the optional field would vanish from the inferred type and the section
   * could not read it.
   */
  items: [
    { name: 'Kailash Hospital', logo: '/images/clients/kailash.png', scale: 1.1 },
    { name: 'Ivory Hospital', logo: '/images/clients/ivory.png', scale: 1 },
    { name: 'Felix Healthcare', logo: '/images/clients/felix.png', scale: 1 },
    {
      name: 'Yatharth Super Speciality Hospitals',
      logo: '/images/clients/yatharth.avif',
      scale: 1,
    },
    { name: 'Fortis Hospitals', logo: '/images/clients/fortis.png', scale: 1.15 },
    { name: 'Max Healthcare', logo: '/images/clients/max.png', scale: 0.85 },
    {
      name: 'Paliwal Hospital & Heart Centre',
      logo: '/images/clients/paliwal.jpg',
      scale: 1.5,
    },
    {
      name: 'NIMS Multispeciality Hospital',
      logo: '/images/clients/nims.png',
      scale: 1.4,
    },
    {
      // The deck prints this as "Nitok"; the mark itself reads NIVOK.
      name: 'Nivok Superspeciality Hospital',
      logo: '/images/clients/nivok.png',
      scale: 1.25,
    },
    { name: 'Sharda Hospital', logo: '/images/clients/sharda.png', scale: 0.95 },
  ] as Client[],
};

/* ------------------------------------------------ deck: brand partners */

/**
 * Manufacturer brands carried. Split across three rows that scroll in
 * alternating directions, so the wall reads as depth rather than one long list.
 */
export type Brand = {
  name: string;
  /**
   * Artwork. Without it the brand is not rendered at all — the roster below is
   * deliberately longer than the wall, and each entry joins it when a logo
   * lands. See BrandPartners.
   */
  logo?: string;
  /**
   * Optical size correction, as on the client wall. `object-contain` fits by
   * bounding box, so a stacked mark like Sanofi's — symbol above wordmark —
   * lands far smaller than a pure wordmark like Cipla's at the same box height.
   * Eyeballed against the rendered grid. Default 1.
   */
  scale?: number;
};

export const brandPartners = {
  eyebrow: 'What we carry',
  heading: 'Our Company',
  lead: 'Over two hundred manufacturer lines held under one purchase order, from disposables to specialty pharma.',
  /** Closes the wall: the marks shown are a sample, not the roster. */
  moreLabel: '+ many more multinational brands',
  /**
   * The shape of the catalogue, which is the part a purchase manager is
   * actually buying. Six logos prove the names are real; these three say what
   * having them under one supplier is worth.
   */
  figures: [
    { value: '40+', label: 'Manufacturer brands' },
    { value: '200+', label: 'Product lines' },
    { value: 'One', label: 'Purchase order' },
  ],
  /**
   * A flat list, split into rows by the section itself.
   *
   * Length matters here and is not padding: each row is rendered twice to loop
   * seamlessly, so if one copy is narrower than the viewport both copies are on
   * screen at once and the repetition reads as a rendering bug. Roughly fifteen
   * names per row is what keeps a single pass wider than a desktop viewport.
   */
  brands: [
    { name: 'Romsons' },
    { name: 'Polymed' },
    { name: 'MGRM' },
    { name: 'Intas' },
    { name: 'Luv Lap' },
    { name: 'Themis Medicare' },
    { name: 'Lotus' },
    { name: 'Fresenius' },
    { name: 'Microgen' },
    { name: 'Alkem', logo: '/images/brands/alkem.webp', scale: 1.05 },
    { name: 'Neon' },
    { name: 'Rüsch' },
    { name: 'Mediplus' },
    { name: 'Dr. Odin' },
    { name: 'Windlas' },
    { name: 'Hetero Healthcare', logo: '/images/brands/hetero.webp', scale: 1.05 },
    { name: 'B. Braun' },
    { name: 'BD', logo: '/images/brands/bd.webp', scale: 0.9 },
    { name: 'Cipla', logo: '/images/brands/cipla.webp', scale: 0.85 },
    { name: 'J&J' },
    { name: 'Sanofi', logo: '/images/brands/sanofi.webp', scale: 1.3 },
    { name: 'Mankind', logo: '/images/brands/mankind.webp', scale: 1.25 },
    { name: 'Bard' },
    { name: 'Hansaplast' },
    { name: 'Morepen' },
    { name: 'Tynor' },
    { name: 'Portex' },
    { name: 'Sutures India' },
    { name: 'Accu Sure' },
    { name: 'Ace Cathtech' },
    { name: 'Primocare' },
    { name: 'Respimeds' },
    { name: 'Surgicare' },
    { name: 'Karemed' },
    { name: 'Intersurgical' },
    { name: 'Medtech Device' },
    { name: 'Kidney Care' },
    { name: 'Baxim Lifescience' },
    { name: 'Bharat Serums' },
    { name: 'Biocure' },
    { name: 'Cytobiologics' },
    { name: 'Rajdhani' },
    { name: 'Samarth' },
    { name: 'Syrijan' },
  ] as Brand[],
};

/* ----------------------------------------------- deck: core strengths */

export const coreStrengths = {
  eyebrow: 'Our strengths',
  heading: 'Four things we are built around',
  lead: 'We combine rapid local delivery, optimised pricing and quality-assured sourcing to eliminate supply delays and high procurement costs for healthcare providers.',
  items: [
    {
      icon: Clock,
      title: 'Fast Delivery Promise',
      description: 'Urgent hospital orders dispatched and delivered within four hours.',
    },
    {
      icon: PiggyBank,
      title: 'Cost Optimization',
      description: 'Direct sourcing and volume-based discounts, passed on as transparent pricing.',
    },
    {
      icon: Warehouse,
      title: 'Reliable Supply Chain',
      description: 'Actively managed stock depth so critical lines are available on demand.',
    },
    {
      icon: ShieldCheck,
      title: 'Quality & Compliance',
      description: 'WHO-GMP sourcing with batch, expiry and packaging verified before dispatch.',
    },
  ],
};
