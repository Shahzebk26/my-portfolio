import fs from "fs/promises";
import path from "path";

export type ProjectStat = {
  label: string;
  value: string;
};

type ProjectData = {
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
  // Case-study detail page fields (all optional for backward compatibility).
  client?: string;
  year?: string;
  industry?: string;
  overview?: string;
  videoUrl?: string;
  keyFeatures?: string[];
  gallery?: string[];
  stats?: ProjectStat[];
};

const dataDirectory = path.join(process.cwd(), "data");
const projectFile = path.join(dataDirectory, "projects.json");
const uploadDirectory = path.join(process.cwd(), "public", "uploads");

async function ensureProjectFile() {
  try {
    await fs.access(projectFile);
  } catch {
    await fs.mkdir(dataDirectory, { recursive: true });
    await fs.writeFile(projectFile, JSON.stringify([], null, 2), "utf8");
  }
}

export async function readProjects(): Promise<ProjectData[]> {
  try {
    await ensureProjectFile();
    const file = await fs.readFile(projectFile, "utf8");
    const projects = JSON.parse(file) as ProjectData[];

    // Uploaded files are local runtime assets. If one was removed or the app
    // was redeployed without it, do not send a broken URL to the browser.
    return Promise.all(
      projects.map(async (project) => {
        if (!project.image?.startsWith("/uploads/")) return project;

        const filename = project.image.slice("/uploads/".length);
        const imagePath = path.join(uploadDirectory, filename);
        try {
          await fs.access(imagePath);
          return project;
        } catch {
          return { ...project, image: "" };
        }
      }),
    );
  } catch {
    // Public pages should still load if Railway storage is unavailable or
    // the file is temporarily invalid during an admin update.
    return [];
  }
}

export async function writeProjects(projects: ProjectData[]) {
  await ensureProjectFile();
  await fs.writeFile(projectFile, JSON.stringify(projects, null, 2), "utf8");
}

function createId() {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

function createSlug(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "")
    .slice(0, 100);
}

export async function addProject(project: Omit<ProjectData, "id" | "createdAt" | "slug"> & { slug?: string }): Promise<ProjectData> {
  const existing = await readProjects();
  const next: ProjectData = {
    id: createId(),
    createdAt: new Date().toISOString(),
    slug: project.slug || createSlug(project.title),
    ...project,
  } as ProjectData;
  existing.push(next);
  await writeProjects(existing);
  return next;
}

export async function updateProject(id: string, project: Partial<Omit<ProjectData, "id" | "createdAt">>): Promise<ProjectData | null> {
  const existing = await readProjects();
  const index = existing.findIndex((item) => item.id === id);
  if (index === -1) return null;
  const updated = { ...existing[index], ...project };
  if (project.title && !project.slug) {
    updated.slug = createSlug(project.title);
  }
  existing[index] = updated;
  await writeProjects(existing);
  return existing[index];
}

export async function deleteProject(id: string): Promise<boolean> {
  const existing = await readProjects();
  const next = existing.filter((item) => item.id !== id);
  if (next.length === existing.length) return false;
  await writeProjects(next);
  return true;
}

export type Project = ProjectData;
