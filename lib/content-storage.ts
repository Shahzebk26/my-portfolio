import fs from "fs/promises";
import path from "path";
import { assertDatabaseConfigured, databaseEnabled, dbQuery } from "./database";

export type SiteContent = {
  siteSettings: {
    siteTitle: string;
    siteDescription: string;
    ownerName: string;
    footerTagline: string;
  };
  hero: {
    eyebrow: string;
    greeting: string;
    firstName: string;
    lastName: string;
    tagline: string;
    description: string;
    availableBadge: string;
    primaryCtaLabel: string;
    primaryCtaHref: string;
    secondaryCtaLabel: string;
    secondaryCtaHref: string;
    metrics: { value: string; label: string }[];
  };
  expertise: {
    eyebrow: string;
    heading: string;
    description: string;
    cards: { label: string; title: string; description: string }[];
  };
  aboutTeaser: {
    eyebrow: string;
    heading: string;
    description: string;
    strengthsHeading: string;
    strengths: string[];
  };
  homeProjects: {
    eyebrow: string;
    heading: string;
    linkLabel: string;
  };
  connect: {
    eyebrow: string;
    heading: string;
    headingHighlight: string;
    description: string;
    features: { highlight: string; rest: string; description: string }[];
    cardHeading: string;
    cardHeadingHighlight: string;
    cardSubheading: string;
    email: string;
    phone: string;
    whatsappUrl: string;
    whatsappLabel: string;
    statusOnlineLabel: string;
    statusResponseLabel: string;
  };
  aboutPage: {
    metaTitle: string;
    metaDescription: string;
    heroTitle: string;
    heroIntro: string;
    approachHeading: string;
    approachParagraphs: string[];
    strengthsHeading: string;
    strengths: string[];
    highlights: { label: string; value: string }[];
  };
  contactPage: {
    metaTitle: string;
    metaDescription: string;
    heroTitle: string;
    heroIntro: string;
    heading: string;
    description: string;
    ctaLabel: string;
    email: string;
    reachOutHeading: string;
    methods: { label: string; value: string; href: string }[];
  };
};

export const DEFAULT_CONTENT: SiteContent = {
  siteSettings: {
    siteTitle: "Shahzeb | Full-Stack Developer",
    siteDescription:
      "Professional portfolio website for a full-stack web developer showcasing modern projects and technical expertise.",
    ownerName: "Shahzeb Khan",
    footerTagline: "Designed and developed with care for modern brands, startups, and ambitious teams.",
  },
  hero: {
    eyebrow: "Full-Stack Web Developer",
    greeting: "Hi, I’m",
    firstName: "Shahzeb",
    lastName: "Khan",
    tagline: "Building thoughtful digital products that feel premium and perform beautifully.",
    description:
      "I create fast, modern web experiences for startups, founders, and growing businesses that need both visual polish and technical reliability.",
    availableBadge: "Available for hire",
    primaryCtaLabel: "View Projects",
    primaryCtaHref: "/projects",
    secondaryCtaLabel: "Let's Talk",
    secondaryCtaHref: "/contact",
    metrics: [
      { value: "4+", label: "Years building digital products" },
      { value: "25+", label: "Projects shipped with impact" },
      { value: "10+", label: "Clients and teams supported" },
    ],
  },
  expertise: {
    eyebrow: "Expertise",
    heading: "Services that make products stronger.",
    description:
      "The work I deliver is focused on meaningful outcomes — from thoughtful UI systems to secure, scalable web apps.",
    cards: [
      {
        label: "Product Design",
        title: "Design systems that feel polished and modern.",
        description: "Professional motion, clear hierarchy, and a refined presentation for every project.",
      },
      {
        label: "Enterprise Apps",
        title: "Scalable dashboards and admin workflows.",
        description: "Professional motion, clear hierarchy, and a refined presentation for every project.",
      },
      {
        label: "E-commerce",
        title: "High-converting stores with fast checkout paths.",
        description: "Professional motion, clear hierarchy, and a refined presentation for every project.",
      },
      {
        label: "SaaS Growth",
        title: "Subscription flows and customer success tools.",
        description: "Professional motion, clear hierarchy, and a refined presentation for every project.",
      },
    ],
  },
  aboutTeaser: {
    eyebrow: "About Me",
    heading: "A calm, detail-driven developer focused on meaningful results.",
    description:
      "I'm a full-stack developer who enjoys turning ideas into polished digital products. From front-end interfaces to scalable back-end systems, I focus on clean architecture, strong user experience, and dependable delivery.",
    strengthsHeading: "Core Strengths",
    strengths: [
      "End-to-end product development",
      "Performance-driven UI engineering",
      "API and database integration",
      "Clear communication and client collaboration",
    ],
  },
  homeProjects: {
    eyebrow: "Selected Work",
    heading: "Projects I've Built",
    linkLabel: "See all projects →",
  },
  connect: {
    eyebrow: "Ready to build",
    heading: "Let's turn your next idea into a",
    headingHighlight: "polished digital experience.",
    description:
      "Whether it's a single project or an ongoing partnership, I'm ready to help — from first concept to a fully shipped, dependable product.",
    features: [
      {
        highlight: "Single Project",
        rest: "Engagement",
        description:
          "From a marketing site to a full web app, I deliver focused, polished solutions built around your specific goals.",
      },
      {
        highlight: "Ongoing",
        rest: "Partnership",
        description:
          "Dedicated support with fast turnaround, clear communication, and reliable long-term collaboration.",
      },
    ],
    cardHeading: "Connect",
    cardHeadingHighlight: "With Me",
    cardSubheading: "Skip the waiting. Let's move forward today.",
    email: "",
    phone: "",
    whatsappUrl: "",
    whatsappLabel: "Connect on WhatsApp",
    statusOnlineLabel: "Available for new projects",
    statusResponseLabel: "Quick response time",
  },
  aboutPage: {
    metaTitle: "About | Shahzeb",
    metaDescription: "Learn more about Shahzeb, a full-stack developer focused on modern product delivery.",
    heroTitle: "About Me",
    heroIntro:
      "I bring together product thinking, thoughtful design, and engineering discipline to create digital experiences that feel modern and dependable.",
    approachHeading: "My approach",
    approachParagraphs: [
      "I enjoy taking ideas from concept to deployment, whether that means crafting a compelling front-end experience, building efficient back-end workflows, or improving an existing product for better scale and maintainability.",
      "The result is web products that are not only visually polished, but also practical, secure, and ready for real-world growth.",
    ],
    strengthsHeading: "Core strengths",
    strengths: [
      "Full-stack product development",
      "UI/UX-oriented web applications",
      "API design and system integration",
      "Performance optimization and reliability",
    ],
    highlights: [
      { label: "Years building products", value: "4+" },
      { label: "Projects delivered", value: "25+" },
      { label: "Clients supported", value: "10+" },
    ],
  },
  contactPage: {
    metaTitle: "Contact | Shahzeb",
    metaDescription: "Get in touch for freelance work, collaborations, or full-time opportunities.",
    heroTitle: "Contact",
    heroIntro: "Available for freelance projects, product partnerships, and full-time opportunities.",
    heading: "Let's build something meaningful",
    description:
      "Whether you need a modern website, a web app, or a thoughtful product upgrade, I'm ready to help turn your idea into a polished digital experience.",
    ctaLabel: "Start a conversation",
    email: "hello@yourdomain.com",
    reachOutHeading: "Reach out",
    methods: [
      { label: "Email", value: "hello@yourdomain.com", href: "mailto:hello@yourdomain.com" },
      { label: "LinkedIn", value: "linkedin.com/in/yourname", href: "https://www.linkedin.com" },
      { label: "GitHub", value: "github.com/yourname", href: "https://github.com" },
    ],
  },
};

const dataDirectory = path.join(process.cwd(), "data");
const contentFile = path.join(dataDirectory, "content.json");

function deepMerge<T>(base: T, patch: unknown): T {
  if (Array.isArray(base)) {
    return (Array.isArray(patch) ? patch : base) as T;
  }
  if (base && typeof base === "object" && patch && typeof patch === "object") {
    const result: Record<string, unknown> = { ...(base as Record<string, unknown>) };
    for (const key of Object.keys(base as Record<string, unknown>)) {
      if (key in (patch as Record<string, unknown>)) {
        result[key] = deepMerge((base as Record<string, unknown>)[key], (patch as Record<string, unknown>)[key]);
      }
    }
    return result as T;
  }
  return (patch === undefined ? base : patch) as T;
}

async function ensureContentFile() {
  try {
    await fs.access(contentFile);
  } catch {
    await fs.mkdir(dataDirectory, { recursive: true });
    await fs.writeFile(contentFile, JSON.stringify(DEFAULT_CONTENT, null, 2), "utf8");
  }
}

export async function readContent(): Promise<SiteContent> {
  assertDatabaseConfigured();
  if (databaseEnabled) {
    try {
      const result = await dbQuery<{ value: Partial<SiteContent> }>("SELECT value FROM portfolio_documents WHERE key = $1", ["content"]);
      if (result.rows[0]?.value) return deepMerge(DEFAULT_CONTENT, result.rows[0].value);

      await dbQuery(
        "INSERT INTO portfolio_documents (key, value) VALUES ($1, $2::jsonb) ON CONFLICT (key) DO NOTHING",
        ["content", JSON.stringify(DEFAULT_CONTENT)],
      );
      return DEFAULT_CONTENT;
    } catch (error) {
      throw new Error("Unable to read content from PostgreSQL.", { cause: error });
    }
  }

  return readFileContent();
}

async function readFileContent(): Promise<SiteContent> {
  try {
    await ensureContentFile();
    const raw = await fs.readFile(contentFile, "utf8");
    const parsed = JSON.parse(raw);
    return deepMerge(DEFAULT_CONTENT, parsed);
  } catch {
    // Keep public pages renderable if runtime storage is unavailable or the
    // JSON file was interrupted while being updated.
    return DEFAULT_CONTENT;
  }
}

export async function updateContent(patch: Partial<SiteContent>): Promise<SiteContent> {
  assertDatabaseConfigured();
  const existing = await readContent();
  const next = deepMerge(existing, patch);

  if (databaseEnabled) {
    await dbQuery(
      `INSERT INTO portfolio_documents (key, value, updated_at)
       VALUES ($1, $2::jsonb, NOW())
       ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value, updated_at = NOW()`,
      ["content", JSON.stringify(next)],
    );
    return next;
  }

  await fs.writeFile(contentFile, JSON.stringify(next, null, 2), "utf8");
  return next;
}
