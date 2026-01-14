export type ProjectStatus = "待处理" | "进行中" | "已完成";
export type ProjectPriority = "高" | "中" | "低";

export interface Project {
  id: string;
  name: string;
  description: string;
  status: ProjectStatus;
  priority: ProjectPriority;
  createdAt: Date;
  updatedAt: Date;
  dueDate?: Date;
}

export interface ProjectStats {
  total: number;
  completed: number;
  inProgress: number;
  pending: number;
}
