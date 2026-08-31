"use client";

import { useEffect, useMemo, useState, type ReactNode } from "react";
import Image from "next/image";
import type { SiteContent } from "../../lib/content-storage";

type ProjectStat = { label: string; value: string };

type Project = {
  id: string;
  title: string;
  description: string;
  stack: string[];
  category: string;
  slug: string;
  image: string;
  liveUrl: string;
  featured?: boolean;
  createdAt: string;
  client?: string;
  year?: string;
  industry?: string;
  overview?: string;
  videoUrl?: string;
  keyFeatures?: string[];
  gallery?: string[];
  stats?: ProjectStat[];
};

const initialForm = {
  title: "",
  description: "",
  stack: "",
  category: "Web App",
  slug: "",
  image: "",
  liveUrl: "",
  featured: false,
  client: "",
  year: "",
  industry: "",
  overview: "",
  videoUrl: "",
  keyFeatures: "",
  gallery: "",
  stats: "",
};

function linesToList(value: string) {
  return value
    .split("\n")
    .map((item) => item.trim())
    .filter(Boolean);
}

function parseStats(value: string): ProjectStat[] {
  return linesToList(value)
    .map((line) => {
      const [label, ...rest] = line.split(":");
      return { label: (label ?? "").trim(), value: rest.join(":").trim() };
    })
    .filter((item) => item.label && item.value);
}

// --- Content (CMS) field helpers: simple "|" delimited lines for list-of-object fields ---

function parseValueLabel(text: string): { value: string; label: string }[] {
  return linesToList(text)
    .map((line) => {
      const [value, ...rest] = line.split("|");
      return { value: (value ?? "").trim(), label: rest.join("|").trim() };
    })
    .filter((item) => item.value && item.label);
}

function stringifyValueLabel(items: { value: string; label: string }[]): string {
  return items.map((item) => `${item.value} | ${item.label}`).join("\n");
}

function parseCards(text: string): { label: string; title: string; description: string }[] {
  return linesToList(text)
    .map((line) => {
      const [label, title, description] = line.split("|").map((part) => (part ?? "").trim());
      return { label: label ?? "", title: title ?? "", description: description ?? "" };
    })
    .filter((item) => item.label && item.title);
}

function stringifyCards(items: { label: string; title: string; description: string }[]): string {
  return items.map((item) => `${item.label} | ${item.title} | ${item.description}`).join("\n");
}

function parseFeatures(text: string): { highlight: string; rest: string; description: string }[] {
  return linesToList(text)
    .map((line) => {
      const [highlight, rest, description] = line.split("|").map((part) => (part ?? "").trim());
      return { highlight: highlight ?? "", rest: rest ?? "", description: description ?? "" };
    })
    .filter((item) => item.highlight && item.rest);
}

function stringifyFeatures(items: { highlight: string; rest: string; description: string }[]): string {
  return items.map((item) => `${item.highlight} | ${item.rest} | ${item.description}`).join("\n");
}

function parseMethods(text: string): { label: string; value: string; href: string }[] {
  return linesToList(text)
    .map((line) => {
      const [label, value, href] = line.split("|").map((part) => (part ?? "").trim());
      return { label: label ?? "", value: value ?? "", href: href ?? "" };
    })
    .filter((item) => item.label && item.href);
}

function stringifyMethods(items: { label: string; value: string; href: string }[]): string {
  return items.map((item) => `${item.label} | ${item.value} | ${item.href}`).join("\n");
}

type ContentForm = {
  siteTitle: string;
  siteDescription: string;
  ownerName: string;
  footerTagline: string;

  heroEyebrow: string;
  heroGreeting: string;
  heroFirstName: string;
  heroLastName: string;
  heroTagline: string;
  heroDescription: string;
  heroAvailableBadge: string;
  heroPrimaryCtaLabel: string;
  heroPrimaryCtaHref: string;
  heroSecondaryCtaLabel: string;
  heroSecondaryCtaHref: string;
  heroMetrics: string;

  expertiseEyebrow: string;
  expertiseHeading: string;
  expertiseDescription: string;
  expertiseCards: string;

  aboutTeaserEyebrow: string;
  aboutTeaserHeading: string;
  aboutTeaserDescription: string;
  aboutTeaserStrengthsHeading: string;
  aboutTeaserStrengths: string;

  homeProjectsEyebrow: string;
  homeProjectsHeading: string;
  homeProjectsLinkLabel: string;

  connectEyebrow: string;
  connectHeading: string;
  connectHeadingHighlight: string;
  connectDescription: string;
  connectFeatures: string;
  connectCardHeading: string;
  connectCardHeadingHighlight: string;
  connectCardSubheading: string;
  connectEmail: string;
  connectPhone: string;
  connectWhatsappUrl: string;
  connectWhatsappLabel: string;
  connectStatusOnlineLabel: string;
  connectStatusResponseLabel: string;

  aboutMetaTitle: string;
  aboutMetaDescription: string;
  aboutHeroTitle: string;
  aboutHeroIntro: string;
  aboutApproachHeading: string;
  aboutApproachParagraphs: string;
  aboutStrengthsHeading: string;
  aboutStrengths: string;
  aboutHighlights: string;

  contactMetaTitle: string;
  contactMetaDescription: string;
  contactHeroTitle: string;
  contactHeroIntro: string;
  contactHeading: string;
  contactDescription: string;
  contactCtaLabel: string;
  contactEmail: string;
  contactReachOutHeading: string;
  contactMethods: string;
};

const emptyContentForm: ContentForm = {
  siteTitle: "",
  siteDescription: "",
  ownerName: "",
  footerTagline: "",
  heroEyebrow: "",
  heroGreeting: "",
  heroFirstName: "",
  heroLastName: "",
  heroTagline: "",
  heroDescription: "",
  heroAvailableBadge: "",
  heroPrimaryCtaLabel: "",
  heroPrimaryCtaHref: "",
  heroSecondaryCtaLabel: "",
  heroSecondaryCtaHref: "",
  heroMetrics: "",
  expertiseEyebrow: "",
  expertiseHeading: "",
  expertiseDescription: "",
  expertiseCards: "",
  aboutTeaserEyebrow: "",
  aboutTeaserHeading: "",
  aboutTeaserDescription: "",
  aboutTeaserStrengthsHeading: "",
  aboutTeaserStrengths: "",
  homeProjectsEyebrow: "",
  homeProjectsHeading: "",
  homeProjectsLinkLabel: "",
  connectEyebrow: "",
  connectHeading: "",
  connectHeadingHighlight: "",
  connectDescription: "",
  connectFeatures: "",
  connectCardHeading: "",
  connectCardHeadingHighlight: "",
  connectCardSubheading: "",
  connectEmail: "",
  connectPhone: "",
  connectWhatsappUrl: "",
  connectWhatsappLabel: "",
  connectStatusOnlineLabel: "",
  connectStatusResponseLabel: "",
  aboutMetaTitle: "",
  aboutMetaDescription: "",
  aboutHeroTitle: "",
  aboutHeroIntro: "",
  aboutApproachHeading: "",
  aboutApproachParagraphs: "",
  aboutStrengthsHeading: "",
  aboutStrengths: "",
  aboutHighlights: "",
  contactMetaTitle: "",
  contactMetaDescription: "",
  contactHeroTitle: "",
  contactHeroIntro: "",
  contactHeading: "",
  contactDescription: "",
  contactCtaLabel: "",
  contactEmail: "",
  contactReachOutHeading: "",
  contactMethods: "",
};

function toContentForm(content: SiteContent): ContentForm {
  return {
    siteTitle: content.siteSettings.siteTitle,
    siteDescription: content.siteSettings.siteDescription,
    ownerName: content.siteSettings.ownerName,
    footerTagline: content.siteSettings.footerTagline,

    heroEyebrow: content.hero.eyebrow,
    heroGreeting: content.hero.greeting,
    heroFirstName: content.hero.firstName,
    heroLastName: content.hero.lastName,
    heroTagline: content.hero.tagline,
    heroDescription: content.hero.description,
    heroAvailableBadge: content.hero.availableBadge,
    heroPrimaryCtaLabel: content.hero.primaryCtaLabel,
    heroPrimaryCtaHref: content.hero.primaryCtaHref,
    heroSecondaryCtaLabel: content.hero.secondaryCtaLabel,
    heroSecondaryCtaHref: content.hero.secondaryCtaHref,
    heroMetrics: stringifyValueLabel(content.hero.metrics),

    expertiseEyebrow: content.expertise.eyebrow,
    expertiseHeading: content.expertise.heading,
    expertiseDescription: content.expertise.description,
    expertiseCards: stringifyCards(content.expertise.cards),

    aboutTeaserEyebrow: content.aboutTeaser.eyebrow,
    aboutTeaserHeading: content.aboutTeaser.heading,
    aboutTeaserDescription: content.aboutTeaser.description,
    aboutTeaserStrengthsHeading: content.aboutTeaser.strengthsHeading,
    aboutTeaserStrengths: content.aboutTeaser.strengths.join("\n"),

    homeProjectsEyebrow: content.homeProjects.eyebrow,
    homeProjectsHeading: content.homeProjects.heading,
    homeProjectsLinkLabel: content.homeProjects.linkLabel,

    connectEyebrow: content.connect.eyebrow,
    connectHeading: content.connect.heading,
    connectHeadingHighlight: content.connect.headingHighlight,
    connectDescription: content.connect.description,
    connectFeatures: stringifyFeatures(content.connect.features),
    connectCardHeading: content.connect.cardHeading,
    connectCardHeadingHighlight: content.connect.cardHeadingHighlight,
    connectCardSubheading: content.connect.cardSubheading,
    connectEmail: content.connect.email,
    connectPhone: content.connect.phone,
    connectWhatsappUrl: content.connect.whatsappUrl,
    connectWhatsappLabel: content.connect.whatsappLabel,
    connectStatusOnlineLabel: content.connect.statusOnlineLabel,
    connectStatusResponseLabel: content.connect.statusResponseLabel,

    aboutMetaTitle: content.aboutPage.metaTitle,
    aboutMetaDescription: content.aboutPage.metaDescription,
    aboutHeroTitle: content.aboutPage.heroTitle,
    aboutHeroIntro: content.aboutPage.heroIntro,
    aboutApproachHeading: content.aboutPage.approachHeading,
    aboutApproachParagraphs: content.aboutPage.approachParagraphs.join("\n"),
    aboutStrengthsHeading: content.aboutPage.strengthsHeading,
    aboutStrengths: content.aboutPage.strengths.join("\n"),
    aboutHighlights: stringifyValueLabel(content.aboutPage.highlights),

    contactMetaTitle: content.contactPage.metaTitle,
    contactMetaDescription: content.contactPage.metaDescription,
    contactHeroTitle: content.contactPage.heroTitle,
    contactHeroIntro: content.contactPage.heroIntro,
    contactHeading: content.contactPage.heading,
    contactDescription: content.contactPage.description,
    contactCtaLabel: content.contactPage.ctaLabel,
    contactEmail: content.contactPage.email,
    contactReachOutHeading: content.contactPage.reachOutHeading,
    contactMethods: stringifyMethods(content.contactPage.methods),
  };
}

const fieldInputClass =
  "mt-2 w-full rounded-3xl border border-(--border) bg-(--panel-strong) px-4 py-3 text-sm text-(--text-strong) outline-none transition focus:border-cyan-400";

function TextField({
  label,
  value,
  onChange,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}) {
  return (
    <div>
      <label className="text-sm font-semibold text-(--text-strong)">{label}</label>
      <input
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        className={fieldInputClass}
      />
    </div>
  );
}

function TextAreaField({
  label,
  value,
  onChange,
  placeholder,
  height = "h-24",
  hint,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  height?: string;
  hint?: string;
}) {
  return (
    <div>
      <label className="text-sm font-semibold text-(--text-strong)">{label}</label>
      {hint ? <p className="mt-1 text-xs text-(--muted)">{hint}</p> : null}
      <textarea
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        className={`mt-2 ${height} w-full rounded-3xl border border-(--border) bg-(--panel-strong) px-4 py-3 text-sm text-(--text-strong) outline-none transition focus:border-cyan-400`}
      />
    </div>
  );
}

function Panel({ eyebrow, title, children, onSave, saveLabel = "Save" }: {
  eyebrow: string;
  title: string;
  children: ReactNode;
  onSave: () => void;
  saveLabel?: string;
}) {
  return (
    <section className="rounded-3xl border border-(--border) bg-(--panel) p-8 shadow-lg shadow-slate-950/10">
      <p className="text-sm font-semibold uppercase tracking-[0.28em] text-cyan-400">{eyebrow}</p>
      <h2 className="mt-3 text-2xl font-semibold text-(--text-strong)">{title}</h2>
      <div className="mt-6 space-y-5">{children}</div>
      <button
        type="button"
        onClick={onSave}
        className="btn-primary mt-8 inline-flex rounded-full px-6 py-3 text-sm font-semibold text-slate-950"
      >
        {saveLabel}
      </button>
    </section>
  );
}

const TABS = [
  { id: "hero", label: "Hero & Home", icon: "🏠", description: "Hero, services, teasers" },
  { id: "about", label: "About Page", icon: "👤", description: "Approach, strengths, stats" },
  { id: "contact", label: "Contact Page", icon: "✉️", description: "Copy & reach-out links" },
  { id: "projects", label: "Projects", icon: "🗂️", description: "Case studies & portfolio" },
  { id: "settings", label: "Site Settings", icon: "⚙️", description: "Hero image, footer, SEO" },
] as const;

type TabId = (typeof TABS)[number]["id"];

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState<TabId>("hero");
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [status, setStatus] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [projectFormOpen, setProjectFormOpen] = useState(false);
  const [form, setForm] = useState({ ...initialForm });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState("");
  const [siteProfileImage, setSiteProfileImage] = useState("/profile-illustration.svg");
  const [siteImageFile, setSiteImageFile] = useState<File | null>(null);
  const [siteImagePreview, setSiteImagePreview] = useState("");
  const [contentForm, setContentForm] = useState<ContentForm>(emptyContentForm);
  const [authenticated, setAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const [token, setToken] = useState<string | null>(null);

  const openNewProjectForm = () => {
    resetForm();
    setProjectFormOpen(true);
  };

  const closeProjectForm = () => {
    resetForm();
    setProjectFormOpen(false);
  };

  useEffect(() => {
    const savedToken = window.localStorage.getItem("portfolio-admin-token");
    if (savedToken) {
      setToken(savedToken);
      setAuthenticated(true);
      Promise.all([fetchProjects(savedToken), fetchSiteConfig(), fetchContent()]);
    } else {
      setLoading(false);
      fetchSiteConfig();
      fetchContent();
    }
  }, []);

  useEffect(() => {
    if (!status) return;
    const timer = setTimeout(() => setStatus(null), 2500);
    return () => clearTimeout(timer);
  }, [status]);

  const fetchProjects = async (authToken?: string) => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/projects", { cache: "no-store" });
      if (!response.ok) {
        throw new Error("Unable to load projects.");
      }
      const data = await response.json();
      setProjects(data.projects || []);
    } catch {
      setError("Unable to load projects.");
    } finally {
      setLoading(false);
    }
  };

  const fetchContent = async () => {
    try {
      const response = await fetch("/api/content");
      if (!response.ok) {
        throw new Error("Unable to load content.");
      }
      const data = await response.json();
      if (data?.content) {
        setContentForm(toContentForm(data.content));
      }
    } catch {
      setError("Unable to load site content.");
    }
  };

  const resetForm = () => {
    setEditingId(null);
    setForm({ ...initialForm });
    setImageFile(null);
    setImagePreview("");
  };

  const uploadImageFile = async (file: File) => {
    const formData = new FormData();
    formData.append("image", file);

    const response = await fetch("/api/upload/image", {
      method: "POST",
      body: formData,
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.error || "Image upload failed.");
    }

    return data.path as string;
  };

  const fetchSiteConfig = async () => {
    try {
      const response = await fetch("/api/site-config");
      if (!response.ok) {
        throw new Error("Unable to load site config.");
      }
      const data = await response.json();
      setSiteProfileImage(data.site?.profileImage ?? "/profile-illustration.svg");
      setSiteImagePreview(data.site?.profileImage ?? "");
    } catch {
      setError("Unable to load site settings.");
    }
  };

  const saveSiteImage = async (path: string) => {
    const response = await fetch("/api/site-config", {
      method: "PUT",
      headers: authHeaders(),
      body: JSON.stringify({ profileImage: path }),
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.error || "Unable to save site image.");
    }

    return data.site;
  };

  const handleSiteImageSave = async () => {
    setError(null);

    try {
      const imagePath = siteImageFile ? await uploadImageFile(siteImageFile) : siteProfileImage;
      const site = await saveSiteImage(imagePath);
      setSiteProfileImage(site.profileImage ?? imagePath);
      setSiteImageFile(null);
      setSiteImagePreview("");
      setStatus("Hero image saved.");
    } catch {
      setError("Unable to update hero image.");
    }
  };

  const handleLogin = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      const data = await response.json();
      if (!response.ok) {
        setError(data.error || "Unable to sign in.");
        return;
      }

      window.localStorage.setItem("portfolio-admin-token", data.token);
      setToken(data.token);
      setAuthenticated(true);
      setPassword("");
      await Promise.all([fetchProjects(data.token), fetchContent()]);
    } catch {
      setError("Unable to sign in.");
    } finally {
      setLoading(false);
    }
  };

  const authHeaders = () => {
    return {
      "Content-Type": "application/json",
      Authorization: token ? `Bearer ${token}` : "",
    };
  };

  const handleLogout = () => {
    window.localStorage.removeItem("portfolio-admin-token");
    setToken(null);
    setAuthenticated(false);
    setProjects([]);
    resetForm();
  };

  const saveContent = async (patch: Partial<SiteContent>) => {
    setError(null);
    try {
      const response = await fetch("/api/content", {
        method: "PUT",
        headers: authHeaders(),
        body: JSON.stringify(patch),
      });
      const data = await response.json();
      if (!response.ok) {
        if (response.status === 401) {
          window.localStorage.removeItem("portfolio-admin-token");
          setToken(null);
          setAuthenticated(false);
          setError("Session expired. Please sign in again.");
          return;
        }
        setError(data.error || "Unable to save content.");
        return;
      }
      setContentForm(toContentForm(data.content));
      setStatus("Saved.");
    } catch {
      setError("Unable to save content.");
    }
  };

  const saveHeroAndHome = () =>
    saveContent({
      hero: {
        eyebrow: contentForm.heroEyebrow,
        greeting: contentForm.heroGreeting,
        firstName: contentForm.heroFirstName,
        lastName: contentForm.heroLastName,
        tagline: contentForm.heroTagline,
        description: contentForm.heroDescription,
        availableBadge: contentForm.heroAvailableBadge,
        primaryCtaLabel: contentForm.heroPrimaryCtaLabel,
        primaryCtaHref: contentForm.heroPrimaryCtaHref,
        secondaryCtaLabel: contentForm.heroSecondaryCtaLabel,
        secondaryCtaHref: contentForm.heroSecondaryCtaHref,
        metrics: parseValueLabel(contentForm.heroMetrics),
      },
      expertise: {
        eyebrow: contentForm.expertiseEyebrow,
        heading: contentForm.expertiseHeading,
        description: contentForm.expertiseDescription,
        cards: parseCards(contentForm.expertiseCards),
      },
      aboutTeaser: {
        eyebrow: contentForm.aboutTeaserEyebrow,
        heading: contentForm.aboutTeaserHeading,
        description: contentForm.aboutTeaserDescription,
        strengthsHeading: contentForm.aboutTeaserStrengthsHeading,
        strengths: linesToList(contentForm.aboutTeaserStrengths),
      },
      homeProjects: {
        eyebrow: contentForm.homeProjectsEyebrow,
        heading: contentForm.homeProjectsHeading,
        linkLabel: contentForm.homeProjectsLinkLabel,
      },
    });

  const saveConnect = () =>
    saveContent({
      connect: {
        eyebrow: contentForm.connectEyebrow,
        heading: contentForm.connectHeading,
        headingHighlight: contentForm.connectHeadingHighlight,
        description: contentForm.connectDescription,
        features: parseFeatures(contentForm.connectFeatures),
        cardHeading: contentForm.connectCardHeading,
        cardHeadingHighlight: contentForm.connectCardHeadingHighlight,
        cardSubheading: contentForm.connectCardSubheading,
        email: contentForm.connectEmail,
        phone: contentForm.connectPhone,
        whatsappUrl: contentForm.connectWhatsappUrl,
        whatsappLabel: contentForm.connectWhatsappLabel,
        statusOnlineLabel: contentForm.connectStatusOnlineLabel,
        statusResponseLabel: contentForm.connectStatusResponseLabel,
      },
    });

  const saveAboutPage = () =>
    saveContent({
      aboutPage: {
        metaTitle: contentForm.aboutMetaTitle,
        metaDescription: contentForm.aboutMetaDescription,
        heroTitle: contentForm.aboutHeroTitle,
        heroIntro: contentForm.aboutHeroIntro,
        approachHeading: contentForm.aboutApproachHeading,
        approachParagraphs: linesToList(contentForm.aboutApproachParagraphs),
        strengthsHeading: contentForm.aboutStrengthsHeading,
        strengths: linesToList(contentForm.aboutStrengths),
        highlights: parseValueLabel(contentForm.aboutHighlights),
      },
    });

  const saveContactPage = () =>
    saveContent({
      contactPage: {
        metaTitle: contentForm.contactMetaTitle,
        metaDescription: contentForm.contactMetaDescription,
        heroTitle: contentForm.contactHeroTitle,
        heroIntro: contentForm.contactHeroIntro,
        heading: contentForm.contactHeading,
        description: contentForm.contactDescription,
        ctaLabel: contentForm.contactCtaLabel,
        email: contentForm.contactEmail,
        reachOutHeading: contentForm.contactReachOutHeading,
        methods: parseMethods(contentForm.contactMethods),
      },
    });

  const saveSiteSettings = () =>
    saveContent({
      siteSettings: {
        siteTitle: contentForm.siteTitle,
        siteDescription: contentForm.siteDescription,
        ownerName: contentForm.ownerName,
        footerTagline: contentForm.footerTagline,
      },
    });

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);

    const imagePath = imageFile ? await uploadImageFile(imageFile) : form.image;

    const payload = {
      title: form.title,
      description: form.description,
      stack: form.stack.split(",").map((item) => item.trim()).filter(Boolean),
      category: form.category,
      slug: form.slug || form.title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)+/g, ""),
      image: imagePath,
      liveUrl: form.liveUrl,
      featured: form.featured,
      client: form.client,
      year: form.year,
      industry: form.industry,
      overview: form.overview,
      videoUrl: form.videoUrl,
      keyFeatures: linesToList(form.keyFeatures),
      gallery: linesToList(form.gallery),
      stats: parseStats(form.stats),
    };

    try {
      const endpoint = "/api/projects";
      const method = editingId ? "PUT" : "POST";
      const body = editingId ? { id: editingId, ...payload } : payload;
      const response = await fetch(endpoint, {
        method,
        headers: authHeaders(),
        body: JSON.stringify(body),
      });

      const data = await response.json();
      if (!response.ok) {
        if (response.status === 401) {
          window.localStorage.removeItem("portfolio-admin-token");
          setToken(null);
          setAuthenticated(false);
          setError("Session expired. Please sign in again.");
          return;
        }
        setError(data.error || "Unable to save project.");
        return;
      }

      await fetchProjects(token ?? undefined);
      resetForm();
      setProjectFormOpen(false);
      setStatus("Project saved.");
    } catch {
      setError("Unable to save project.");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this project?")) return;
    setError(null);

    try {
      const response = await fetch("/api/projects", {
        method: "DELETE",
        headers: authHeaders(),
        body: JSON.stringify({ id }),
      });
      const data = await response.json();
      if (!response.ok) {
        if (response.status === 401) {
          window.localStorage.removeItem("portfolio-admin-token");
          setToken(null);
          setAuthenticated(false);
          setError("Session expired. Please sign in again.");
          return;
        }
        setError(data.error || "Unable to delete project.");
        return;
      }
      await fetchProjects(token ?? undefined);
    } catch {
      setError("Unable to delete project.");
    }
  };

  const startEdit = (project: Project) => {
    setProjectFormOpen(true);
    setEditingId(project.id);
    setForm({
      title: project.title ?? "",
      description: project.description ?? "",
      stack: Array.isArray(project.stack) ? project.stack.join(", ") : "",
      category: project.category ?? "Web App",
      slug: project.slug ?? "",
      image: project.image ?? "",
      liveUrl: project.liveUrl ?? "",
      featured: Boolean(project.featured),
      client: project.client ?? "",
      year: project.year ?? "",
      industry: project.industry ?? "",
      overview: project.overview ?? "",
      videoUrl: project.videoUrl ?? "",
      keyFeatures: Array.isArray(project.keyFeatures) ? project.keyFeatures.join("\n") : "",
      gallery: Array.isArray(project.gallery) ? project.gallery.join("\n") : "",
      stats: Array.isArray(project.stats) ? project.stats.map((s) => `${s.label}: ${s.value}`).join("\n") : "",
    });
    setImageFile(null);
    setImagePreview(project.image ?? "");
  };

  const featuredCount = useMemo(() => projects.filter((project) => project.featured).length, [projects]);

  if (!authenticated) {
    return (
      <div className="flex min-h-screen items-center justify-center px-6 py-12">
        <div className="w-full max-w-xl rounded-3xl border border-(--border) bg-(--panel) p-8 shadow-2xl shadow-slate-950/30 backdrop-blur-xl">
          <p className="text-sm font-semibold uppercase tracking-[0.28em] text-cyan-400">Administrator access</p>
          <h2 className="mt-3 text-2xl font-semibold text-(--text-strong)">Portfolio CMS</h2>
          <p className="mt-4 text-sm leading-7 text-(--muted)">Enter the admin password to manage your entire portfolio safely.</p>

          {error ? (
            <div className="mt-6 rounded-2xl border border-red-400/20 bg-red-500/10 p-4 text-sm text-red-200">
              {error}
            </div>
          ) : null}

          <form onSubmit={handleLogin} className="mt-8 space-y-5">
            <div>
              <label className="text-sm font-semibold text-(--text-strong)">Password</label>
              <input
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                className={fieldInputClass}
                placeholder="Enter admin password"
              />
            </div>
            <button
              type="submit"
              className="btn-primary inline-flex rounded-full px-6 py-3 text-sm font-semibold text-slate-950"
            >
              Sign in
            </button>
          </form>
        </div>
      </div>
    );
  }

  const activeTabMeta = TABS.find((tab) => tab.id === activeTab)!;

  return (
    <div className="flex min-h-screen">
      <aside className="sticky top-0 flex h-screen w-72 shrink-0 flex-col border-r border-(--border) bg-(--panel-strong) p-6 backdrop-blur-xl max-lg:hidden">
        <div className="flex items-center gap-2.5">
          <span className="h-2 w-2 rounded-full bg-cyan-400 shadow-[0_0_12px_theme(colors.cyan.400)]" />
          <div>
            <p className="text-sm font-semibold tracking-[0.2em] text-(--text-strong)">PORTFOLIO CMS</p>
            <p className="text-xs text-(--muted)">Admin dashboard</p>
          </div>
        </div>

        <nav className="mt-8 flex-1 space-y-1.5">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => {
                setActiveTab(tab.id);
                if (tab.id === "projects") {
                  resetForm();
                  setProjectFormOpen(false);
                }
              }}
              className={`flex w-full items-start gap-3 rounded-2xl px-4 py-3 text-left transition duration-300 ${
                activeTab === tab.id
                  ? "bg-cyan-500/15 text-cyan-300"
                  : "text-(--muted) hover:bg-(--panel) hover:text-(--text-strong)"
              }`}
            >
              <span className="text-lg leading-none">{tab.icon}</span>
              <span>
                <span className="block text-sm font-semibold">{tab.label}</span>
                <span className="block text-xs opacity-70">{tab.description}</span>
              </span>
            </button>
          ))}
        </nav>

        <div className="space-y-2 border-t border-(--border) pt-4">
          <a
            href="/"
            target="_blank"
            rel="noreferrer"
            className="flex items-center justify-center gap-2 rounded-full border border-(--border) px-4 py-2.5 text-sm font-medium text-(--muted) transition duration-300 hover:border-cyan-400/40 hover:text-cyan-300"
          >
            View live site ↗
          </a>
          <button
            type="button"
            onClick={handleLogout}
            className="flex w-full items-center justify-center gap-2 rounded-full border border-red-400/30 bg-red-500/10 px-4 py-2.5 text-sm font-semibold text-red-200 transition hover:bg-red-500/20"
          >
            Logout
          </button>
        </div>
      </aside>

      <main className="flex-1 overflow-y-auto p-6 lg:p-10">
        <div className="mb-8 flex flex-wrap items-center justify-between gap-4 lg:hidden">
           <select
             value={activeTab}
             onChange={(event) => {
               const nextTab = event.target.value as TabId;
               setActiveTab(nextTab);
               if (nextTab === "projects") {
                 closeProjectForm();
               }
             }}
            className="rounded-full border border-(--border) bg-(--panel-strong) px-4 py-2.5 text-sm font-medium text-(--text-strong) outline-none"
          >
            {TABS.map((tab) => (
              <option key={tab.id} value={tab.id}>
                {tab.icon} {tab.label}
              </option>
            ))}
          </select>
          <button
            type="button"
            onClick={handleLogout}
            className="rounded-full border border-red-400/30 bg-red-500/10 px-4 py-2 text-sm font-semibold text-red-200 transition hover:bg-red-500/20"
          >
            Logout
          </button>
        </div>

        <div className="mb-8">
          <p className="text-sm font-semibold uppercase tracking-[0.28em] text-cyan-400">{activeTabMeta.label}</p>
          <h1 className="mt-2 text-3xl font-semibold text-(--text-strong)">
            {activeTab === "projects" && projectFormOpen ? "Add or update a project" : activeTabMeta.description}
          </h1>
        </div>

      {status ? (
        <div className="mb-6 rounded-2xl border border-emerald-400/20 bg-emerald-500/10 p-4 text-sm text-emerald-200">
          {status}
        </div>
      ) : null}
      {error ? (
        <div className="mb-6 rounded-2xl border border-red-400/20 bg-red-500/10 p-4 text-sm text-red-200">
          {error}
        </div>
      ) : null}

      {activeTab === "hero" ? (
        <div className="space-y-8">
          <Panel eyebrow="Homepage" title="Hero section" onSave={saveHeroAndHome} saveLabel="Save Hero & Home">
            <div className="grid gap-5 sm:grid-cols-2">
              <TextField label="Eyebrow badge" value={contentForm.heroEyebrow} onChange={(v) => setContentForm((p) => ({ ...p, heroEyebrow: v }))} />
              <TextField label="Greeting" value={contentForm.heroGreeting} onChange={(v) => setContentForm((p) => ({ ...p, heroGreeting: v }))} placeholder="Hi, I'm" />
              <TextField label="First name" value={contentForm.heroFirstName} onChange={(v) => setContentForm((p) => ({ ...p, heroFirstName: v }))} />
              <TextField label="Last name" value={contentForm.heroLastName} onChange={(v) => setContentForm((p) => ({ ...p, heroLastName: v }))} />
            </div>
            <TextAreaField label="Tagline" value={contentForm.heroTagline} onChange={(v) => setContentForm((p) => ({ ...p, heroTagline: v }))} height="h-20" />
            <TextAreaField label="Description" value={contentForm.heroDescription} onChange={(v) => setContentForm((p) => ({ ...p, heroDescription: v }))} height="h-24" />
            <TextField label={'"Available for hire" badge'} value={contentForm.heroAvailableBadge} onChange={(v) => setContentForm((p) => ({ ...p, heroAvailableBadge: v }))} />
            <div className="grid gap-5 sm:grid-cols-2">
              <TextField label="Primary button label" value={contentForm.heroPrimaryCtaLabel} onChange={(v) => setContentForm((p) => ({ ...p, heroPrimaryCtaLabel: v }))} />
              <TextField label="Primary button link" value={contentForm.heroPrimaryCtaHref} onChange={(v) => setContentForm((p) => ({ ...p, heroPrimaryCtaHref: v }))} />
              <TextField label="Secondary button label" value={contentForm.heroSecondaryCtaLabel} onChange={(v) => setContentForm((p) => ({ ...p, heroSecondaryCtaLabel: v }))} />
              <TextField label="Secondary button link" value={contentForm.heroSecondaryCtaHref} onChange={(v) => setContentForm((p) => ({ ...p, heroSecondaryCtaHref: v }))} />
            </div>
            <TextAreaField
              label="Stat tiles"
              value={contentForm.heroMetrics}
              onChange={(v) => setContentForm((p) => ({ ...p, heroMetrics: v }))}
              height="h-24"
              hint={'One per line: "value | label" — e.g. "4+ | Years building digital products"'}
            />
          </Panel>

          <Panel eyebrow="Homepage" title="Expertise / services section" onSave={saveHeroAndHome} saveLabel="Save Hero & Home">
            <div className="grid gap-5 sm:grid-cols-2">
              <TextField label="Eyebrow" value={contentForm.expertiseEyebrow} onChange={(v) => setContentForm((p) => ({ ...p, expertiseEyebrow: v }))} />
              <TextField label="Heading" value={contentForm.expertiseHeading} onChange={(v) => setContentForm((p) => ({ ...p, expertiseHeading: v }))} />
            </div>
            <TextAreaField label="Description" value={contentForm.expertiseDescription} onChange={(v) => setContentForm((p) => ({ ...p, expertiseDescription: v }))} height="h-20" />
            <TextAreaField
              label="Service cards"
              value={contentForm.expertiseCards}
              onChange={(v) => setContentForm((p) => ({ ...p, expertiseCards: v }))}
              height="h-32"
              hint={'One per line: "label | title | description"'}
            />
          </Panel>

          <Panel eyebrow="Homepage" title="About teaser section" onSave={saveHeroAndHome} saveLabel="Save Hero & Home">
            <div className="grid gap-5 sm:grid-cols-2">
              <TextField label="Eyebrow" value={contentForm.aboutTeaserEyebrow} onChange={(v) => setContentForm((p) => ({ ...p, aboutTeaserEyebrow: v }))} />
              <TextField label="Heading" value={contentForm.aboutTeaserHeading} onChange={(v) => setContentForm((p) => ({ ...p, aboutTeaserHeading: v }))} />
            </div>
            <TextAreaField label="Description" value={contentForm.aboutTeaserDescription} onChange={(v) => setContentForm((p) => ({ ...p, aboutTeaserDescription: v }))} height="h-20" />
            <TextField label="Strengths list heading" value={contentForm.aboutTeaserStrengthsHeading} onChange={(v) => setContentForm((p) => ({ ...p, aboutTeaserStrengthsHeading: v }))} />
            <TextAreaField
              label="Strengths"
              value={contentForm.aboutTeaserStrengths}
              onChange={(v) => setContentForm((p) => ({ ...p, aboutTeaserStrengths: v }))}
              height="h-24"
              hint="One item per line"
            />
          </Panel>

          <Panel eyebrow="Homepage" title="Selected work section" onSave={saveHeroAndHome} saveLabel="Save Hero & Home">
            <div className="grid gap-5 sm:grid-cols-3">
              <TextField label="Eyebrow" value={contentForm.homeProjectsEyebrow} onChange={(v) => setContentForm((p) => ({ ...p, homeProjectsEyebrow: v }))} />
              <TextField label="Heading" value={contentForm.homeProjectsHeading} onChange={(v) => setContentForm((p) => ({ ...p, homeProjectsHeading: v }))} />
              <TextField label={'"See all" link label'} value={contentForm.homeProjectsLinkLabel} onChange={(v) => setContentForm((p) => ({ ...p, homeProjectsLinkLabel: v }))} />
            </div>
            <p className="text-xs text-(--muted)">
              This section automatically shows your featured projects from the Projects tab — nothing else to configure here.
            </p>
          </Panel>

          <div className="rounded-3xl border border-dashed border-(--border) p-6 text-sm text-(--muted)">
            The closing "Connect" section (shown at the bottom of the homepage and on the Contact page) is now
            configured under the <strong className="text-(--text-strong)">Contact Page</strong> tab.
          </div>
        </div>
      ) : null}

      {activeTab === "about" ? (
        <div className="space-y-8">
          <Panel eyebrow="About Page" title="Page header & SEO" onSave={saveAboutPage}>
            <div className="grid gap-5 sm:grid-cols-2">
              <TextField label="Browser tab title" value={contentForm.aboutMetaTitle} onChange={(v) => setContentForm((p) => ({ ...p, aboutMetaTitle: v }))} />
              <TextField label="Meta description" value={contentForm.aboutMetaDescription} onChange={(v) => setContentForm((p) => ({ ...p, aboutMetaDescription: v }))} />
              <TextField label="Page title" value={contentForm.aboutHeroTitle} onChange={(v) => setContentForm((p) => ({ ...p, aboutHeroTitle: v }))} />
            </div>
            <TextAreaField label="Intro paragraph" value={contentForm.aboutHeroIntro} onChange={(v) => setContentForm((p) => ({ ...p, aboutHeroIntro: v }))} height="h-20" />
          </Panel>

          <Panel eyebrow="About Page" title="Approach & strengths" onSave={saveAboutPage}>
            <TextField label={'"My approach" heading'} value={contentForm.aboutApproachHeading} onChange={(v) => setContentForm((p) => ({ ...p, aboutApproachHeading: v }))} />
            <TextAreaField
              label="Approach paragraphs"
              value={contentForm.aboutApproachParagraphs}
              onChange={(v) => setContentForm((p) => ({ ...p, aboutApproachParagraphs: v }))}
              height="h-28"
              hint="One paragraph per line"
            />
            <TextField label="Strengths list heading" value={contentForm.aboutStrengthsHeading} onChange={(v) => setContentForm((p) => ({ ...p, aboutStrengthsHeading: v }))} />
            <TextAreaField
              label="Strengths"
              value={contentForm.aboutStrengths}
              onChange={(v) => setContentForm((p) => ({ ...p, aboutStrengths: v }))}
              height="h-24"
              hint="One item per line"
            />
          </Panel>

          <Panel eyebrow="About Page" title="Highlight stats" onSave={saveAboutPage}>
            <TextAreaField
              label="Stat tiles"
              value={contentForm.aboutHighlights}
              onChange={(v) => setContentForm((p) => ({ ...p, aboutHighlights: v }))}
              height="h-24"
              hint={'One per line: "value | label" — e.g. "4+ | Years building products"'}
            />
          </Panel>
        </div>
      ) : null}

      {activeTab === "contact" ? (
        <div className="space-y-8">
          <Panel eyebrow="Contact Page" title="Page header & SEO" onSave={saveContactPage}>
            <div className="grid gap-5 sm:grid-cols-2">
              <TextField label="Browser tab title" value={contentForm.contactMetaTitle} onChange={(v) => setContentForm((p) => ({ ...p, contactMetaTitle: v }))} />
              <TextField label="Meta description" value={contentForm.contactMetaDescription} onChange={(v) => setContentForm((p) => ({ ...p, contactMetaDescription: v }))} />
              <TextField label="Page title" value={contentForm.contactHeroTitle} onChange={(v) => setContentForm((p) => ({ ...p, contactHeroTitle: v }))} />
            </div>
            <TextAreaField label="Intro paragraph" value={contentForm.contactHeroIntro} onChange={(v) => setContentForm((p) => ({ ...p, contactHeroIntro: v }))} height="h-20" />
          </Panel>

          <Panel eyebrow="Contact Page" title="Main panel" onSave={saveContactPage}>
            <TextField label="Heading" value={contentForm.contactHeading} onChange={(v) => setContentForm((p) => ({ ...p, contactHeading: v }))} />
            <TextAreaField label="Description" value={contentForm.contactDescription} onChange={(v) => setContentForm((p) => ({ ...p, contactDescription: v }))} height="h-24" />
            <div className="grid gap-5 sm:grid-cols-2">
              <TextField label="Button label" value={contentForm.contactCtaLabel} onChange={(v) => setContentForm((p) => ({ ...p, contactCtaLabel: v }))} />
              <TextField label="Contact email (used by the button)" value={contentForm.contactEmail} onChange={(v) => setContentForm((p) => ({ ...p, contactEmail: v }))} />
            </div>
          </Panel>

          <Panel eyebrow="Contact Page" title="Reach-out list" onSave={saveContactPage}>
            <TextField label="Heading" value={contentForm.contactReachOutHeading} onChange={(v) => setContentForm((p) => ({ ...p, contactReachOutHeading: v }))} />
            <TextAreaField
              label="Contact methods"
              value={contentForm.contactMethods}
              onChange={(v) => setContentForm((p) => ({ ...p, contactMethods: v }))}
              height="h-28"
              hint={'One per line: "label | value | href" — e.g. "Email | hello@you.com | mailto:hello@you.com"'}
            />
          </Panel>

          <Panel eyebrow="Homepage" title={'Closing "Connect" section'} onSave={saveConnect} saveLabel="Save Connect Section">
            <p className="text-xs text-(--muted)">
              The heading and description shown at the bottom of the homepage. The description is also reused as
              the intro line above the feature blocks on this Contact page.
            </p>
            <div className="grid gap-5 sm:grid-cols-3">
              <TextField label="Eyebrow" value={contentForm.connectEyebrow} onChange={(v) => setContentForm((p) => ({ ...p, connectEyebrow: v }))} />
              <TextField label="Heading" value={contentForm.connectHeading} onChange={(v) => setContentForm((p) => ({ ...p, connectHeading: v }))} />
              <TextField label="Heading highlight (colored)" value={contentForm.connectHeadingHighlight} onChange={(v) => setContentForm((p) => ({ ...p, connectHeadingHighlight: v }))} />
            </div>
            <TextAreaField label="Description" value={contentForm.connectDescription} onChange={(v) => setContentForm((p) => ({ ...p, connectDescription: v }))} height="h-20" />
          </Panel>

          <Panel eyebrow="Contact Page" title="Feature blocks" onSave={saveConnect} saveLabel="Save Connect Section">
            <p className="text-xs text-(--muted)">
              Shown only on this Contact page, below the description — not on the homepage.
            </p>
            <TextAreaField
              label="Feature blocks"
              value={contentForm.connectFeatures}
              onChange={(v) => setContentForm((p) => ({ ...p, connectFeatures: v }))}
              height="h-24"
              hint={'One per line: "highlight | rest of title | description" — e.g. "Single Project | Engagement | From a marketing site to a full web app..."'}
            />
          </Panel>

          <Panel eyebrow="Home + Contact" title="Connect card" onSave={saveConnect} saveLabel="Save Connect Section">
            <div className="grid gap-5 sm:grid-cols-2">
              <TextField label="Card heading" value={contentForm.connectCardHeading} onChange={(v) => setContentForm((p) => ({ ...p, connectCardHeading: v }))} />
              <TextField label="Card heading highlight" value={contentForm.connectCardHeadingHighlight} onChange={(v) => setContentForm((p) => ({ ...p, connectCardHeadingHighlight: v }))} />
            </div>
            <TextField label="Card subheading" value={contentForm.connectCardSubheading} onChange={(v) => setContentForm((p) => ({ ...p, connectCardSubheading: v }))} />
            <div className="grid gap-5 sm:grid-cols-2">
              <TextField
                label="Email (optional — falls back to Contact Page email)"
                value={contentForm.connectEmail}
                onChange={(v) => setContentForm((p) => ({ ...p, connectEmail: v }))}
              />
              <TextField label="Phone number" value={contentForm.connectPhone} onChange={(v) => setContentForm((p) => ({ ...p, connectPhone: v }))} placeholder="+1 555 000 0000" />
            </div>
            <div className="grid gap-5 sm:grid-cols-2">
              <TextField label="WhatsApp URL" value={contentForm.connectWhatsappUrl} onChange={(v) => setContentForm((p) => ({ ...p, connectWhatsappUrl: v }))} placeholder="https://wa.me/15550000000" />
              <TextField label="WhatsApp button label" value={contentForm.connectWhatsappLabel} onChange={(v) => setContentForm((p) => ({ ...p, connectWhatsappLabel: v }))} />
            </div>
            <div className="grid gap-5 sm:grid-cols-2">
              <TextField label="Status: availability label" value={contentForm.connectStatusOnlineLabel} onChange={(v) => setContentForm((p) => ({ ...p, connectStatusOnlineLabel: v }))} />
              <TextField label="Status: response time label" value={contentForm.connectStatusResponseLabel} onChange={(v) => setContentForm((p) => ({ ...p, connectStatusResponseLabel: v }))} />
            </div>
          </Panel>
        </div>
      ) : null}

      {activeTab === "settings" ? (
        <div className="space-y-8">
          <section className="rounded-3xl border border-(--border) bg-(--panel) p-8 shadow-lg shadow-slate-950/10">
            <p className="text-sm font-semibold uppercase tracking-[0.28em] text-cyan-400">Hero Image</p>
            <h2 className="mt-3 text-2xl font-semibold text-(--text-strong)">Update homepage hero image</h2>

            <div className="mt-6 grid gap-6 lg:grid-cols-[0.95fr_0.45fr]">
              <div>
                <label className="text-sm font-semibold text-(--text-strong)">Upload hero image</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(event) => {
                    const file = event.target.files?.[0] ?? null;
                    setSiteImageFile(file);
                    if (file) {
                      setSiteImagePreview(URL.createObjectURL(file));
                    } else {
                      setSiteImagePreview(siteProfileImage);
                    }
                  }}
                  className={fieldInputClass}
                />
                <button
                  type="button"
                  onClick={handleSiteImageSave}
                  className="btn-primary mt-4 inline-flex rounded-full px-6 py-3 text-sm font-semibold text-slate-950"
                >
                  Save Hero Image
                </button>
              </div>
              <div className="rounded-3xl border border-(--border) bg-(--panel-strong) p-4">
                <p className="text-sm font-semibold text-(--muted)">Preview</p>
                <div className="mt-4 overflow-hidden rounded-3xl bg-slate-950/5">
                  <img
                    src={siteImagePreview || siteProfileImage}
                    alt="Hero image preview"
                    className="h-56 w-full object-cover"
                  />
                </div>
              </div>
            </div>
          </section>

          <Panel eyebrow="Site Settings" title="Global site details" onSave={saveSiteSettings} saveLabel="Save Site Settings">
            <div className="grid gap-5 sm:grid-cols-2">
              <TextField label="Site title (browser tab)" value={contentForm.siteTitle} onChange={(v) => setContentForm((p) => ({ ...p, siteTitle: v }))} />
              <TextField label="Owner name (footer copyright)" value={contentForm.ownerName} onChange={(v) => setContentForm((p) => ({ ...p, ownerName: v }))} />
            </div>
            <TextAreaField label="Site meta description" value={contentForm.siteDescription} onChange={(v) => setContentForm((p) => ({ ...p, siteDescription: v }))} height="h-20" />
            <TextAreaField label="Footer tagline" value={contentForm.footerTagline} onChange={(v) => setContentForm((p) => ({ ...p, footerTagline: v }))} height="h-20" />
          </Panel>
        </div>
      ) : null}

      {activeTab === "projects" ? (
        <div className="w-full">
          {!projectFormOpen ? <section className="rounded-3xl border border-(--border) bg-(--panel) p-8 shadow-lg shadow-slate-950/10">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.28em] text-cyan-400">Projects</p>
                <h2 className="mt-3 text-2xl font-semibold text-(--text-strong)">Manage your portfolio content</h2>
              </div>
              <div className="flex items-center gap-3">
                <div className="rounded-3xl bg-cyan-500/10 px-4 py-2 text-sm text-cyan-200">
                  {projects.length} projects, {featuredCount} featured
                </div>
                <button
                  type="button"
                  onClick={openNewProjectForm}
                  className="btn-primary inline-flex items-center gap-2 rounded-full px-4 py-2.5 text-sm font-semibold text-slate-950 transition hover:-translate-y-0.5"
                >
                  <span className="text-lg leading-none">+</span>
                  Add new Project
                </button>
              </div>
            </div>

            <div className="mt-8 space-y-4">
              {loading ? (
                <div className="rounded-3xl border border-(--border) bg-(--panel-strong) p-6 text-center text-(--muted)">
                  Loading projects...
                </div>
              ) : projects.length === 0 ? (
                <div className="rounded-3xl border border-(--border) bg-(--panel-strong) p-6 text-(--muted)">
                  No projects found. Click &quot;Add new Project&quot; to create your first one.
                </div>
              ) : (
                <div className="overflow-hidden rounded-2xl border border-(--border) bg-(--panel-strong)">
                  <div className="grid grid-cols-[28px_minmax(0,1fr)_auto] items-center gap-3 border-b border-(--border) px-4 py-3 text-[10px] font-semibold uppercase tracking-[0.16em] text-(--muted) md:grid-cols-[34px_minmax(140px,1fr)_minmax(180px,1.5fr)_minmax(140px,1fr)_90px_150px]">
                    <span><input type="checkbox" aria-label="Select all projects" className="h-4 w-4 rounded border-(--border) bg-(--panel) accent-cyan-400" /></span>
                    <span>Title</span><span className="hidden md:block">Short description</span><span className="hidden md:block">Slug</span><span className="hidden md:block">State</span><span className="text-right">Actions</span>
                  </div>
                  <div>
                  {projects.map((project) => (
                    <div key={project.id} className="grid grid-cols-[28px_minmax(0,1fr)_auto] items-center gap-3 border-b border-(--border) px-4 py-4 transition last:border-b-0 hover:bg-(--panel) md:grid-cols-[34px_minmax(140px,1fr)_minmax(180px,1.5fr)_minmax(140px,1fr)_90px_150px]">
                      {project.image ? (
                        <div className="hidden">
                          <Image
                            src={project.image}
                            alt={`${project.title} preview`}
                            width={1200}
                            height={600}
                            className="h-44 w-full object-cover"
                            unoptimized
                          />
                        </div>
                      ) : null}
                      <div className="contents">
                        <div className="contents">
                          <input type="checkbox" aria-label={`Select ${project.title}`} className="h-4 w-4 rounded border-(--border) bg-(--panel) accent-cyan-400" />
                          <p className="text-sm font-semibold text-cyan-300">{project.title}</p>
                          <p className="hidden truncate text-sm text-(--muted) md:block" title={project.description}>{project.description || "No short description added."}</p>
                          <div className="hidden truncate text-sm text-cyan-300 md:block" title={project.slug}>
                            <span>{project.category}</span>
                            <span>•</span>
                            <span>{project.slug}</span>
                          </div>
                          <span className="hidden w-fit rounded-md border border-emerald-400/30 bg-emerald-500/10 px-3 py-1.5 text-xs font-semibold text-emerald-300 md:inline-flex">Published</span>
                        </div>
                        <div className="flex flex-wrap justify-end gap-2">
                          <button
                            type="button"
                            onClick={() => startEdit(project)}
                            className="rounded-full border border-cyan-400/30 bg-cyan-500/10 px-3 py-2 text-sm text-cyan-200 transition hover:bg-cyan-500/20 md:px-4"
                          >
                            Edit
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDelete(project.id)}
                            className="rounded-full border border-red-400/30 bg-red-500/10 px-3 py-2 text-sm text-red-200 transition hover:bg-red-500/20 md:px-4"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                </div>
              )}
            </div>
          </section> : null}

          {projectFormOpen ? <section className="w-full max-w-none rounded-3xl border border-(--border) bg-(--panel) p-8 shadow-lg shadow-slate-950/10">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.28em] text-cyan-400">Project Editor</p>
                <h2 className="mt-3 text-2xl font-semibold text-(--text-strong)">Add or update a project</h2>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={resetForm}
                  className="rounded-full border border-slate-700/50 px-4 py-2 text-sm text-(--muted) transition hover:border-cyan-400 hover:text-cyan-200"
                >
                  Reset form
                </button>
                <button
                  type="button"
                  onClick={closeProjectForm}
                  className="rounded-full border border-(--border) px-4 py-2 text-sm text-(--muted) transition hover:border-cyan-400 hover:text-cyan-200"
                >
                  Close
                </button>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="mt-8 space-y-5">
              <TextField label="Title" value={form.title} onChange={(v) => setForm((prev) => ({ ...prev, title: v }))} placeholder="Project title" />
              <TextAreaField label="Description" value={form.description} onChange={(v) => setForm((prev) => ({ ...prev, description: v }))} height="h-24" placeholder="Short project description" />
              <TextField label="Tech stack" value={form.stack} onChange={(v) => setForm((prev) => ({ ...prev, stack: v }))} placeholder="Next.js, Node.js, TypeScript" />
              <TextField label="Category" value={form.category} onChange={(v) => setForm((prev) => ({ ...prev, category: v }))} placeholder="Web App, Mobile App, Tooling" />
              <TextField label="Slug" value={form.slug} onChange={(v) => setForm((prev) => ({ ...prev, slug: v }))} placeholder="project-slug" />
              <div>
                <label className="text-sm font-semibold text-(--text-strong)">Upload project image</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(event) => {
                    const file = event.target.files?.[0] ?? null;
                    setImageFile(file);
                    if (file) {
                      setImagePreview(URL.createObjectURL(file));
                    } else {
                      setImagePreview(form.image);
                    }
                  }}
                  className={fieldInputClass}
                />
                {imagePreview ? (
                  <img
                    src={imagePreview}
                    alt="Selected project preview"
                    className="mt-4 max-h-40 w-full rounded-3xl object-cover"
                  />
                ) : null}
              </div>
              <TextField label="Live site URL" value={form.liveUrl} onChange={(v) => setForm((prev) => ({ ...prev, liveUrl: v }))} placeholder="https://example.com" />
              <div className="flex items-center gap-3">
                <label className="inline-flex items-center gap-2 text-sm text-(--text-strong)">
                  <input
                    type="checkbox"
                    checked={form.featured}
                    onChange={(event) => setForm((prev) => ({ ...prev, featured: event.target.checked }))}
                    className="h-4 w-4 rounded border-(--border) bg-(--panel-strong) text-cyan-400 focus:ring-cyan-400"
                  />
                  Mark as featured
                </label>
              </div>

              <div className="border-t border-(--border) pt-6">
                <p className="text-sm font-semibold uppercase tracking-[0.28em] text-cyan-400">Case Study Details</p>
                <p className="mt-2 text-xs text-(--muted)">
                  Optional — fills out the dedicated project page opened from &quot;View case study&quot;. Leave blank to hide a section.
                </p>
              </div>

              <div className="grid gap-5 sm:grid-cols-3">
                <TextField label="Client" value={form.client} onChange={(v) => setForm((prev) => ({ ...prev, client: v }))} placeholder="Client name" />
                <TextField label="Industry" value={form.industry} onChange={(v) => setForm((prev) => ({ ...prev, industry: v }))} placeholder="e.g. Automotive Electronics" />
                <TextField label="Year" value={form.year} onChange={(v) => setForm((prev) => ({ ...prev, year: v }))} placeholder="2026" />
              </div>

              <TextAreaField
                label="Overview (long description)"
                value={form.overview}
                onChange={(v) => setForm((prev) => ({ ...prev, overview: v }))}
                height="h-28"
                placeholder="Longer write-up shown on the project page. Falls back to the short description above if left blank."
              />
              <TextField label="Video URL (optional, replaces hero image)" value={form.videoUrl} onChange={(v) => setForm((prev) => ({ ...prev, videoUrl: v }))} placeholder="https://example.com/demo.mp4" />
              <TextAreaField
                label='Key metrics (one per line, "label: value")'
                value={form.stats}
                onChange={(v) => setForm((prev) => ({ ...prev, stats: v }))}
                height="h-28"
                placeholder={"Established: 2009\nTechnical Staff: 20+\nExport Market: Worldwide"}
              />
              <TextAreaField
                label="Key features (one per line)"
                value={form.keyFeatures}
                onChange={(v) => setForm((prev) => ({ ...prev, keyFeatures: v }))}
                height="h-28"
                placeholder={"Responsive design\nSecure checkout\nAdmin dashboard"}
              />
              <TextAreaField
                label="Gallery image URLs (one per line)"
                value={form.gallery}
                onChange={(v) => setForm((prev) => ({ ...prev, gallery: v }))}
                height="h-24"
                placeholder={"/uploads/screen-1.jpg\n/uploads/screen-2.jpg"}
              />

              <button type="submit" className="btn-primary inline-flex rounded-full px-6 py-3 text-sm font-semibold text-slate-950">
                {editingId ? "Update project" : "Create project"}
              </button>
            </form>
          </section> : null}
        </div>
      ) : null}
      </main>
    </div>
  );
}
