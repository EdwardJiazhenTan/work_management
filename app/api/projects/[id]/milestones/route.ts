import { NextResponse } from "next/server";
import { mockMilestones } from "@/lib/mock-data";
import { Milestone } from "@/lib/types";

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const milestones = mockMilestones
    .filter((m) => m.projectId === params.id)
    .sort((a, b) => a.order - b.order);
  return NextResponse.json(milestones);
}

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  const body = await request.json();

  const projectMilestones = mockMilestones.filter(
    (m) => m.projectId === params.id
  );
  const maxOrder = projectMilestones.length > 0
    ? Math.max(...projectMilestones.map((m) => m.order))
    : 0;

  const newMilestone: Milestone = {
    id: Date.now().toString(),
    projectId: params.id,
    title: body.title,
    description: body.description,
    status: body.status || "未开始",
    dueDate: body.dueDate ? new Date(body.dueDate) : undefined,
    order: maxOrder + 1,
  };

  mockMilestones.push(newMilestone);

  return NextResponse.json(newMilestone, { status: 201 });
}
