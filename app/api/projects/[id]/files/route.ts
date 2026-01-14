import { NextResponse } from "next/server";
import { mockFiles } from "@/lib/mock-data";
import { ProjectFile } from "@/lib/types";

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const files = mockFiles.filter((f) => f.projectId === params.id);
  return NextResponse.json(files);
}

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  const body = await request.json();

  const newFile: ProjectFile = {
    id: Date.now().toString(),
    projectId: params.id,
    fileName: body.fileName,
    fileSize: body.fileSize,
    fileType: body.fileType,
    uploadedAt: new Date(),
    url: body.url || `/uploads/${body.fileName}`,
  };

  mockFiles.push(newFile);

  return NextResponse.json(newFile, { status: 201 });
}
