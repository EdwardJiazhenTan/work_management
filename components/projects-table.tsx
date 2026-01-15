"use client";

import * as React from "react";
import Link from "next/link";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Project } from "@/lib/types";
import { ArrowUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";

type SortField = "name" | "status" | "priority" | "createdAt" | "dueDate";
type SortOrder = "asc" | "desc";

interface ProjectsTableProps {
  projects: Project[];
}

export function ProjectsTable({ projects }: ProjectsTableProps) {
  const [sortField, setSortField] = React.useState<SortField>("createdAt");
  const [sortOrder, setSortOrder] = React.useState<SortOrder>("desc");

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortOrder("asc");
    }
  };

  const sortedProjects = React.useMemo(() => {
    return [...projects].sort((a, b) => {
      const aValue = a[sortField];
      const bValue = b[sortField];

      // Handle date fields
      if (sortField === "createdAt" || sortField === "dueDate") {
        const aTime = aValue ? new Date(aValue).getTime() : 0;
        const bTime = bValue ? new Date(bValue).getTime() : 0;
        if (aTime < bTime) return sortOrder === "asc" ? -1 : 1;
        if (aTime > bTime) return sortOrder === "asc" ? 1 : -1;
        return 0;
      }

      // Handle priority field with custom order
      if (sortField === "priority") {
        const priorityOrder: Record<Project["priority"], number> = {
          高: 1,
          中: 2,
          低: 3,
        };
        const aOrder = priorityOrder[aValue as Project["priority"]];
        const bOrder = priorityOrder[bValue as Project["priority"]];
        if (aOrder < bOrder) return sortOrder === "asc" ? -1 : 1;
        if (aOrder > bOrder) return sortOrder === "asc" ? 1 : -1;
        return 0;
      }

      // Handle string fields
      if (typeof aValue === "string" && typeof bValue === "string") {
        const comparison = aValue.localeCompare(bValue);
        return sortOrder === "asc" ? comparison : -comparison;
      }

      return 0;
    });
  }, [projects, sortField, sortOrder]);

  const getStatusBadge = (status: Project["status"]) => {
    const styles: Record<Project["status"], string> = {
      待处理:
        "bg-slate-200 text-slate-700 dark:bg-slate-800 dark:text-slate-300",
      进行中: "bg-blue-400 text-white dark:bg-blue-500",
      已完成: "bg-slate-600 text-white dark:bg-slate-500",
    };
    return (
      <Badge variant="secondary" className={styles[status]}>
        {status}
      </Badge>
    );
  };

  const getPriorityBadge = (priority: Project["priority"]) => {
    const styles: Record<Project["priority"], string> = {
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

  const formatDate = (date?: Date) => {
    if (!date) return "-";
    return new Date(date).toLocaleDateString("zh-CN");
  };

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>
              <Button
                variant="ghost"
                onClick={() => handleSort("name")}
                className="flex items-center gap-1"
              >
                项目名称
                <ArrowUpDown className="h-4 w-4" />
              </Button>
            </TableHead>
            <TableHead>描述</TableHead>
            <TableHead>
              <Button
                variant="ghost"
                onClick={() => handleSort("status")}
                className="flex items-center gap-1"
              >
                状态
                <ArrowUpDown className="h-4 w-4" />
              </Button>
            </TableHead>
            <TableHead>
              <Button
                variant="ghost"
                onClick={() => handleSort("priority")}
                className="flex items-center gap-1"
              >
                优先级
                <ArrowUpDown className="h-4 w-4" />
              </Button>
            </TableHead>
            <TableHead>
              <Button
                variant="ghost"
                onClick={() => handleSort("createdAt")}
                className="flex items-center gap-1"
              >
                创建时间
                <ArrowUpDown className="h-4 w-4" />
              </Button>
            </TableHead>
            <TableHead>
              <Button
                variant="ghost"
                onClick={() => handleSort("dueDate")}
                className="flex items-center gap-1"
              >
                截止日期
                <ArrowUpDown className="h-4 w-4" />
              </Button>
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sortedProjects.map((project) => (
            <TableRow key={project.id}>
              <TableCell className="font-medium">
                <Link
                  href={`/projects/${project.id}`}
                  className="hover:underline"
                >
                  {project.name}
                </Link>
              </TableCell>
              <TableCell className="max-w-md truncate">
                {project.description}
              </TableCell>
              <TableCell>{getStatusBadge(project.status)}</TableCell>
              <TableCell>{getPriorityBadge(project.priority)}</TableCell>
              <TableCell>{formatDate(project.createdAt)}</TableCell>
              <TableCell>{formatDate(project.dueDate)}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
