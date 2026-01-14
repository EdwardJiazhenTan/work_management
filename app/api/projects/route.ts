import { NextResponse } from "next/server";
import { mockProjects, getProjectStats } from "@/lib/mock-data";

export async function GET() {
  const stats = getProjectStats(mockProjects);

  return NextResponse.json({
    projects: mockProjects,
    stats,
  });
}

export async function POST(request: Request) {
  const body = await request.json();

  const newProject = {
    id: Date.now().toString(),
    ...body,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  mockProjects.push(newProject);

  return NextResponse.json(newProject, { status: 201 });
}
