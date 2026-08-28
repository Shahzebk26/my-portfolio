import { NextResponse } from "next/server";
import { addProject, deleteProject, readProjects, updateProject } from "../../../lib/project-storage";
import { verifyAdminToken } from "../../../lib/auth";

export async function GET() {
  const projects = await readProjects();
  return NextResponse.json({ projects });
}

export async function POST(request: Request) {
  const auth = request.headers.get("authorization") ?? "";
  if (!verifyAdminToken(auth.replace("Bearer ", ""))) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  const body = await request.json();
  const requiredFields = ["title", "description", "stack", "category", "image", "liveUrl"];
  if (!requiredFields.every((field) => field in body)) {
    return NextResponse.json({ error: "Missing required project fields." }, { status: 400 });
  }

  const project = await addProject({
    title: String(body.title),
    description: String(body.description),
    stack: Array.isArray(body.stack) ? body.stack.map(String) : String(body.stack).split(",").map((item) => item.trim()),
    category: String(body.category),
    slug: body.slug ? String(body.slug) : undefined,
    image: String(body.image),
    liveUrl: String(body.liveUrl),
    featured: Boolean(body.featured),
    client: body.client ? String(body.client) : undefined,
    year: body.year ? String(body.year) : undefined,
    industry: body.industry ? String(body.industry) : undefined,
    overview: body.overview ? String(body.overview) : undefined,
    videoUrl: body.videoUrl ? String(body.videoUrl) : undefined,
    keyFeatures: Array.isArray(body.keyFeatures) ? body.keyFeatures.map(String).filter(Boolean) : undefined,
    gallery: Array.isArray(body.gallery) ? body.gallery.map(String).filter(Boolean) : undefined,
    stats: Array.isArray(body.stats)
      ? body.stats
          .map((item: { label?: unknown; value?: unknown }) => ({ label: String(item.label ?? ""), value: String(item.value ?? "") }))
          .filter((item: { label: string; value: string }) => item.label && item.value)
      : undefined,
  });

  return NextResponse.json({ project }, { status: 201 });
}

export async function PUT(request: Request) {
  const auth = request.headers.get("authorization") ?? "";
  if (!verifyAdminToken(auth.replace("Bearer ", ""))) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  const body = await request.json();
  if (!body.id) {
    return NextResponse.json({ error: "Project id is required." }, { status: 400 });
  }

  const project = await updateProject(body.id, {
    title: body.title ? String(body.title) : undefined,
    description: body.description ? String(body.description) : undefined,
    stack: body.stack
      ? Array.isArray(body.stack)
        ? body.stack.map(String)
        : String(body.stack).split(",").map((item) => item.trim())
      : undefined,
    category: body.category ? String(body.category) : undefined,
    slug: body.slug ? String(body.slug) : undefined,
    image: body.image ? String(body.image) : undefined,
    liveUrl: body.liveUrl ? String(body.liveUrl) : undefined,
    featured: body.featured === undefined ? undefined : Boolean(body.featured),
    client: body.client !== undefined ? String(body.client) : undefined,
    year: body.year !== undefined ? String(body.year) : undefined,
    industry: body.industry !== undefined ? String(body.industry) : undefined,
    overview: body.overview !== undefined ? String(body.overview) : undefined,
    videoUrl: body.videoUrl !== undefined ? String(body.videoUrl) : undefined,
    keyFeatures: Array.isArray(body.keyFeatures) ? body.keyFeatures.map(String).filter(Boolean) : undefined,
    gallery: Array.isArray(body.gallery) ? body.gallery.map(String).filter(Boolean) : undefined,
    stats: Array.isArray(body.stats)
      ? body.stats
          .map((item: { label?: unknown; value?: unknown }) => ({ label: String(item.label ?? ""), value: String(item.value ?? "") }))
          .filter((item: { label: string; value: string }) => item.label && item.value)
      : undefined,
  });

  if (!project) {
    return NextResponse.json({ error: "Project not found." }, { status: 404 });
  }

  return NextResponse.json({ project });
}

export async function DELETE(request: Request) {
  const auth = request.headers.get("authorization") ?? "";
  if (!verifyAdminToken(auth.replace("Bearer ", ""))) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  const body = await request.json();
  if (!body.id) {
    return NextResponse.json({ error: "Project id is required." }, { status: 400 });
  }

  const deleted = await deleteProject(String(body.id));
  if (!deleted) {
    return NextResponse.json({ error: "Project not found." }, { status: 404 });
  }

  return NextResponse.json({ success: true });
}
