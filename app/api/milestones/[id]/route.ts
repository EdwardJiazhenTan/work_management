import { NextResponse } from "next/server";
import { mockMilestones } from "@/lib/mock-data";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const body = await request.json();
  const index = mockMilestones.findIndex((m) => m.id === id);

  if (index === -1) {
    return NextResponse.json({ error: "Milestone not found" }, { status: 404 });
  }

  mockMilestones[index] = {
    ...mockMilestones[index],
    ...body,
    dueDate: body.dueDate
      ? new Date(body.dueDate)
      : mockMilestones[index].dueDate,
    completedDate: body.completedDate
      ? new Date(body.completedDate)
      : mockMilestones[index].completedDate,
  };

  return NextResponse.json(mockMilestones[index]);
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const index = mockMilestones.findIndex((m) => m.id === id);

  if (index === -1) {
    return NextResponse.json({ error: "Milestone not found" }, { status: 404 });
  }

  mockMilestones.splice(index, 1);

  return NextResponse.json({ success: true });
}
