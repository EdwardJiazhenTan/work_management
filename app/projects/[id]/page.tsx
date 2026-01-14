"use client";

import * as React from "react";
import { use } from "react";
import Link from "next/link";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import { SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import { ThemeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft } from "lucide-react";
import { getProjectById } from "@/lib/mock-data";
import { FileList } from "@/components/file-list";
import { MilestoneList } from "@/components/milestone-list";
import { Milestone, ProjectFile } from "@/lib/types";

export default function ProjectDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const project = getProjectById(id);
  const [files, setFiles] = React.useState<ProjectFile[]>(project?.files || []);
  const [milestones, setMilestones] = React.useState<Milestone[]>(
    project?.milestones || []
  );

  if (!project) {
    return (
      <SidebarInset>
        <div className="flex flex-1 items-center justify-center">
          <p className="text-muted-foreground">项目不存在</p>
        </div>
      </SidebarInset>
    );
  }

  const getStatusBadge = (status: typeof project.status) => {
    const styles = {
      待处理: "bg-slate-200 text-slate-700 dark:bg-slate-800 dark:text-slate-300",
      进行中: "bg-blue-400 text-white dark:bg-blue-500",
      已完成: "bg-slate-600 text-white dark:bg-slate-500",
    };
    return (
      <Badge variant="secondary" className={styles[status]}>
        {status}
      </Badge>
    );
  };

  const getPriorityBadge = (priority: typeof project.priority) => {
    const styles = {
      高: "bg-slate-700 text-white dark:bg-slate-600",
      中: "bg-blue-500 text-white dark:bg-blue-600",
      低: "bg-slate-300 text-slate-700 dark:bg-slate-700 dark:text-slate-300",
    };
    return (
      <Badge variant="secondary" className={styles[priority]}>
        {priority}
      </Badge>
    );
  };

  return (
    <SidebarInset>
      <header className="flex h-16 shrink-0 items-center gap-2 px-4 justify-between">
        <div className="flex items-center gap-2">
          <SidebarTrigger className="-ml-1" />
          <Separator
            orientation="vertical"
            className="mr-2 data-[orientation=vertical]:h-4"
          />
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem className="hidden md:block">
                <BreadcrumbLink href="#">数据统计</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator className="hidden md:block" />
              <BreadcrumbItem>
                <BreadcrumbLink href="/projects">项目管理</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator className="hidden md:block" />
              <BreadcrumbItem>
                <BreadcrumbPage>{project.name}</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
        <ThemeToggle />
      </header>
      <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" asChild>
            <Link href="/projects">
              <ArrowLeft className="mr-2 h-4 w-4" />
              返回
            </Link>
          </Button>
        </div>

        <Card>
          <CardHeader>
            <div className="flex items-start justify-between">
              <div>
                <CardTitle className="text-2xl">{project.name}</CardTitle>
                <CardDescription className="mt-2">
                  {project.description}
                </CardDescription>
              </div>
              <div className="flex gap-2">
                {getStatusBadge(project.status)}
                {getPriorityBadge(project.priority)}
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4 text-sm md:grid-cols-4">
              <div>
                <p className="text-muted-foreground">创建时间</p>
                <p className="font-medium">
                  {new Date(project.createdAt).toLocaleDateString("zh-CN")}
                </p>
              </div>
              <div>
                <p className="text-muted-foreground">更新时间</p>
                <p className="font-medium">
                  {new Date(project.updatedAt).toLocaleDateString("zh-CN")}
                </p>
              </div>
              <div>
                <p className="text-muted-foreground">截止日期</p>
                <p className="font-medium">
                  {project.dueDate
                    ? new Date(project.dueDate).toLocaleDateString("zh-CN")
                    : "未设置"}
                </p>
              </div>
              <div>
                <p className="text-muted-foreground">文件数量</p>
                <p className="font-medium">{files.length} 个</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid gap-4 md:grid-cols-2">
          <MilestoneList
            projectId={project.id}
            milestones={milestones}
            onMilestoneAdded={(milestone) => setMilestones([...milestones, milestone])}
            onMilestoneUpdated={(milestone) => {
              setMilestones(
                milestones.map((m) => (m.id === milestone.id ? milestone : m))
              );
            }}
          />
          <FileList
            projectId={project.id}
            files={files}
            onFileAdded={(file) => setFiles([...files, file])}
          />
        </div>
      </div>
    </SidebarInset>
  );
}
