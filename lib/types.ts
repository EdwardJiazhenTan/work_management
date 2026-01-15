export type ProjectStatus = "待处理" | "进行中" | "已完成";
export type ProjectPriority = "高" | "中" | "低";
export type MilestoneStatus = "未开始" | "进行中" | "已完成";
export type ProjectCategory =
  | "经营管理"
  | "资产管理"
  | "议案管理"
  | "工商管理"
  | "非工程类采购管理"
  | "保险采购管理"
  | "法务管理"
  | "其他";

export interface ProjectFile {
  id: string;
  projectId: string;
  fileName: string;
  fileSize: number;
  fileType: string;
  uploadedAt: Date;
  url: string;
}

export interface Milestone {
  id: string;
  projectId: string;
  title: string;
  description: string;
  status: MilestoneStatus;
  dueDate?: Date;
  completedDate?: Date;
  order: number;
}

export interface Project {
  id: string;
  name: string;
  description: string;
  status: ProjectStatus;
  priority: ProjectPriority;
  category: ProjectCategory;
  createdAt: Date;
  updatedAt: Date;
  dueDate?: Date;
  files?: ProjectFile[];
  milestones?: Milestone[];
}

export interface ProjectStats {
  total: number;
  completed: number;
  inProgress: number;
  pending: number;
}
