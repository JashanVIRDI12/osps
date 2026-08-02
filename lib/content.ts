import {
  Ambulance,
  Award,
  BadgeCheck,
  Bandage,
  Building2,
  ClipboardCheck,
  Clock,
  Droplets,
  Facebook,
  Globe,
  Handshake,
  HeartPulse,
  Instagram,
  Linkedin,
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
 * Contact details and social URLs below are placeholders and should be
 * swapped for real brand details before launch. Imagery lives in
 * `/public/images` and includes the OSPS heart mark where packaging is shown.
 */

export const site = {
  name: 'Om Sai Pharma & Surgicals',
  shortName: 'OSPS',
  wordmark: 'OSPS+',
  founded: 2015,
  tagline: 'Quality You Can Trust, Care You Deserve',
  description:
    'Om Sai Pharma & Surgicals manufactures and supplies a complete range of surgical products (syringes, I.V. cannulas, infusion sets, dressings, tapes and theatre essentials) to hospitals in India and 20+ countries worldwide.',
  url: 'https://omsaipharma.example.com',
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
    src: '/images/hero-warehouse.jpg',
    alt: 'OSPS surgical products warehouse with branded cartons ready for dispatch',
  },
  /**
   * Backdrop for the sticky panel that expands from a framed rectangle to
   * full-bleed as the visitor scrolls.
   *
   * `src` is the still: it is painted as a CSS background, doubles as the
   * video's poster, and is the page's LCP element — it is preloaded in the root
   * layout. `video` is the facility footage that fades in over it once the page
   * has finished loading, and is skipped entirely under reduced motion or on a
   * metered connection, in which case the still is the whole composition.
   */
  backdrop: {
    src: '/images/hero-warehouse.jpg',
    video: '/videos/facility.mp4',
    alt: 'OSPS surgical products warehouse with branded cartons ready for dispatch',
    videoLabel: 'WHO-GMP certified manufacturing and supply operations',
  },
  /**
   * The four figures that used to drift past the hero's sticky panel. The
   * parallax column went with the scroll choreography, so nothing renders these
   * today — kept here because the shots and their captions are still good, and
   * they are the obvious source if a supporting strip is ever wanted between the
   * hero and the marquee. `/public/images/hero-*.jpg` are otherwise unreferenced.
   */
  retiredParallax: [
    {
      src: '/images/hero-syringes.jpg',
      alt: 'OSPS-branded sterile surgical syringes for clinical administration',
      caption: 'Syringes & I.V. cannulas',
    },
    {
      src: '/images/hero-gauze.jpg',
      alt: 'OSPS-branded sterile gauze swabs stacked for wound dressing',
      caption: 'Gauze swabs & sponges',
    },
    {
      src: '/images/hero-bandage.jpg',
      alt: 'OSPS-branded elastic and crepe bandages for support and compression',
      caption: 'Bandages, tapes & plasters',
    },
    {
      src: '/images/hero-gloves.jpg',
      alt: 'OSPS-branded examination gloves and surgical face masks',
      caption: 'Gloves, masks & sterile kits',
    },
  ],
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
      src: '/images/category-injection.jpg',
      alt: 'OSPS injection and infusion products: syringes, I.V. cannulas and infusion sets',
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
      src: '/images/category-drainage.jpg',
      alt: 'OSPS drainage and collection sets with sterile tubing components',
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
      src: '/images/category-dressings.jpg',
      alt: 'OSPS dressings, gauze swabs, tapes and plasters in sterile packaging',
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
      src: '/images/category-theatre.jpg',
      alt: 'OSPS theatre protection kit with gloves, masks, blades and sterile packs',
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
          src: '/images/hero-syringes.jpg',
          alt: 'OSPS sterile surgical syringes',
        },
      },
      {
        number: '02',
        name: 'I.V. Cannulas',
        variants: ['With Safety', 'Without Safety'],
        image: {
          src: '/images/product-cannulas.jpg',
          alt: 'OSPS sterile I.V. cannulas with safety options',
        },
      },
      {
        number: '03',
        name: 'Infusion Sets',
        variants: ['With Air Vent', 'Without Air Vent'],
        image: {
          src: '/images/product-infusion.jpg',
          alt: 'OSPS sterile infusion sets with drip chamber',
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
          src: '/images/product-urine-bag.jpg',
          alt: 'OSPS sterile urine drainage collection bag',
        },
      },
      {
        number: '05',
        name: 'Wound Drainage Set',
        variants: ['With Trocar', 'Without Trocar'],
        image: {
          src: '/images/product-drainage-set.jpg',
          alt: 'OSPS wound drainage set with trocar',
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
          src: '/images/hero-gauze.jpg',
          alt: 'OSPS sterile gauze swabs',
        },
      },
      {
        number: '07',
        name: 'Surgical Sponges',
        variants: ['Plain', 'X-Ray Detectable'],
        image: {
          src: '/images/product-sponges.jpg',
          alt: 'OSPS sterile surgical sponges',
        },
      },
      {
        number: '08',
        name: 'Crepe Bandage',
        variants: ['With Elastic', 'Without Elastic'],
        image: {
          src: '/images/hero-bandage.jpg',
          alt: 'OSPS crepe bandage rolls',
        },
      },
      {
        number: '09',
        name: 'Elastic Bandage',
        variants: ['Premium Quality'],
        image: {
          src: '/images/product-elastic.jpg',
          alt: 'OSPS premium elastic compression bandage',
        },
      },
      {
        number: '10',
        name: 'Adhesive Tapes',
        variants: ['Micropore', 'Paper', 'Silk', 'PE'],
        image: {
          src: '/images/product-tapes.jpg',
          alt: 'OSPS medical adhesive tapes',
        },
      },
      {
        number: '11',
        name: 'Plasters',
        variants: ['Zig-Zag', 'Elastic', 'Regular'],
        image: {
          src: '/images/product-plasters.jpg',
          alt: 'OSPS medical plasters and adhesive bandages',
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
          src: '/images/product-blades.jpg',
          alt: 'OSPS sterile carbon steel surgical blades',
        },
      },
      {
        number: '13',
        name: 'Examination Gloves',
        variants: ['Latex', 'Nitrile', 'Vinyl'],
        image: {
          src: '/images/product-gloves.jpg',
          alt: 'OSPS powder-free examination gloves in latex and nitrile',
        },
      },
      {
        number: '14',
        name: 'Face Mask',
        variants: ['3 Ply', 'With Tie', 'Without Tie'],
        image: {
          src: '/images/product-masks.jpg',
          alt: 'OSPS 3-ply surgical face masks',
        },
      },
      {
        number: '15',
        name: 'Sterile Surgical Kit',
        variants: ['Premium Quality'],
        image: {
          src: '/images/product-kit.jpg',
          alt: 'OSPS sealed sterile surgical procedure kit',
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
  src: '/images/accent-quality.jpg',
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
 * The standalone "Inside OSPS" facility-video section was removed — the footage
 * now runs as the hero backdrop instead. Its source and poster live on
 * `hero.backdrop` above.
 */

/* --------------------------------------------------------------- process */

export const process = {
  eyebrow: 'How we work',
  heading: 'Our Process',
  lead: 'A straightforward, transparent path from first enquiry to delivered consignment.',
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
    src: '/images/metrics-stock.jpg',
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
    address: ['Om Sai Pharma & Surgicals', 'Plot 14, MIDC Industrial Area', 'Pune, Maharashtra 411019'],
    phone: '+91 98765 43210',
    phoneHref: 'tel:+919876543210',
    email: 'sales@omsaipharma.in',
    emailHref: 'mailto:sales@omsaipharma.in',
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
    { label: 'LinkedIn', href: 'https://www.linkedin.com', icon: Linkedin },
    { label: 'Facebook', href: 'https://www.facebook.com', icon: Facebook },
    { label: 'Instagram', href: 'https://www.instagram.com', icon: Instagram },
  ],
};
