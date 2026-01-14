"use client";

import * as React from "react";
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
      let aValue: any = a[sortField];
      let bValue: any = b[sortField];

      if (sortField === "createdAt" || sortField === "dueDate") {
        aValue = aValue ? new Date(aValue).getTime() : 0;
        bValue = bValue ? new Date(bValue).getTime() : 0;
      }

      if (aValue < bValue) return sortOrder === "asc" ? -1 : 1;
      if (aValue > bValue) return sortOrder === "asc" ? 1 : -1;
      return 0;
    });
  }, [projects, sortField, sortOrder]);

  const getStatusBadge = (status: Project["status"]) => {
    const variants: Record<Project["status"], "default" | "secondary" | "outline"> = {
      待处理: "secondary",
      进行中: "default",
      已完成: "outline",
    };
    return <Badge variant={variants[status]}>{status}</Badge>;
  };

  const getPriorityBadge = (priority: Project["priority"]) => {
    const variants: Record<Project["priority"], "default" | "secondary" | "destructive"> = {
      高: "destructive",
      中: "default",
      低: "secondary",
    };
    return <Badge variant={variants[priority]}>{priority}</Badge>;
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
              <TableCell className="font-medium">{project.name}</TableCell>
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
