import { Project, ProjectStats, ProjectFile, Milestone } from "./types";

export const mockFiles: ProjectFile[] = [
  {
    id: "f1",
    projectId: "1",
    fileName: "项目需求文档.pdf",
    fileSize: 1024000,
    fileType: "application/pdf",
    uploadedAt: new Date("2024-01-16"),
    url: "/uploads/requirement.pdf",
  },
  {
    id: "f2",
    projectId: "1",
    fileName: "设计稿.fig",
    fileSize: 2048000,
    fileType: "application/figma",
    uploadedAt: new Date("2024-01-18"),
    url: "/uploads/design.fig",
  },
  {
    id: "f3",
    projectId: "3",
    fileName: "性能测试报告.xlsx",
    fileSize: 512000,
    fileType: "application/vnd.ms-excel",
    uploadedAt: new Date("2024-01-24"),
    url: "/uploads/performance.xlsx",
  },
];

export const mockMilestones: Milestone[] = [
  {
    id: "m1",
    projectId: "1",
    title: "需求分析",
    description: "完成需求调研和分析文档",
    status: "已完成",
    dueDate: new Date("2024-01-20"),
    completedDate: new Date("2024-01-19"),
    order: 1,
  },
  {
    id: "m2",
    projectId: "1",
    title: "UI设计",
    description: "完成界面设计和交互原型",
    status: "已完成",
    dueDate: new Date("2024-02-01"),
    completedDate: new Date("2024-01-31"),
    order: 2,
  },
  {
    id: "m3",
    projectId: "1",
    title: "前端开发",
    description: "完成前端页面开发",
    status: "进行中",
    dueDate: new Date("2024-02-15"),
    order: 3,
  },
  {
    id: "m4",
    projectId: "1",
    title: "后端开发",
    description: "完成API接口开发",
    status: "进行中",
    dueDate: new Date("2024-02-20"),
    order: 4,
  },
  {
    id: "m5",
    projectId: "1",
    title: "测试上线",
    description: "完成测试并部署上线",
    status: "未开始",
    dueDate: new Date("2024-03-01"),
    order: 5,
  },
  {
    id: "m6",
    projectId: "3",
    title: "性能分析",
    description: "分析当前系统性能瓶颈",
    status: "已完成",
    dueDate: new Date("2024-01-12"),
    completedDate: new Date("2024-01-11"),
    order: 1,
  },
  {
    id: "m7",
    projectId: "3",
    title: "优化实施",
    description: "执行优化方案",
    status: "已完成",
    dueDate: new Date("2024-01-20"),
    completedDate: new Date("2024-01-19"),
    order: 2,
  },
  {
    id: "m8",
    projectId: "3",
    title: "性能验证",
    description: "验证优化效果",
    status: "已完成",
    dueDate: new Date("2024-01-25"),
    completedDate: new Date("2024-01-24"),
    order: 3,
  },
];

export const mockProjects: Project[] = [
  {
    id: "1",
    name: "网站重构项目",
    description: "对公司官网进行全面重构，采用最新技术栈",
    status: "进行中",
    priority: "高",
    createdAt: new Date("2024-01-15"),
    updatedAt: new Date("2024-01-20"),
    dueDate: new Date("2024-03-01"),
    files: mockFiles.filter((f) => f.projectId === "1"),
    milestones: mockMilestones.filter((m) => m.projectId === "1"),
  },
  {
    id: "2",
    name: "移动应用开发",
    description: "开发iOS和Android移动应用",
    status: "待处理",
    priority: "中",
    createdAt: new Date("2024-01-18"),
    updatedAt: new Date("2024-01-18"),
    dueDate: new Date("2024-04-15"),
    files: [],
    milestones: [],
  },
  {
    id: "3",
    name: "数据库优化",
    description: "优化数据库查询性能，减少响应时间",
    status: "已完成",
    priority: "高",
    createdAt: new Date("2024-01-10"),
    updatedAt: new Date("2024-01-25"),
    dueDate: new Date("2024-01-25"),
    files: mockFiles.filter((f) => f.projectId === "3"),
    milestones: mockMilestones.filter((m) => m.projectId === "3"),
  },
  {
    id: "4",
    name: "API文档编写",
    description: "编写完整的API接口文档",
    status: "进行中",
    priority: "中",
    createdAt: new Date("2024-01-12"),
    updatedAt: new Date("2024-01-22"),
    dueDate: new Date("2024-02-10"),
    files: [],
    milestones: [],
  },
  {
    id: "5",
    name: "用户反馈系统",
    description: "开发用户反馈收集和处理系统",
    status: "待处理",
    priority: "低",
    createdAt: new Date("2024-01-20"),
    updatedAt: new Date("2024-01-20"),
    dueDate: new Date("2024-05-01"),
    files: [],
    milestones: [],
  },
  {
    id: "6",
    name: "安全审计",
    description: "进行全面的安全漏洞审计",
    status: "已完成",
    priority: "高",
    createdAt: new Date("2024-01-05"),
    updatedAt: new Date("2024-01-15"),
    dueDate: new Date("2024-01-15"),
    files: [],
    milestones: [],
  },
  {
    id: "7",
    name: "性能监控系统",
    description: "搭建应用性能监控和告警系统",
    status: "进行中",
    priority: "高",
    createdAt: new Date("2024-01-08"),
    updatedAt: new Date("2024-01-23"),
    dueDate: new Date("2024-02-28"),
    files: [],
    milestones: [],
  },
  {
    id: "8",
    name: "UI/UX改进",
    description: "优化用户界面和用户体验",
    status: "待处理",
    priority: "中",
    createdAt: new Date("2024-01-22"),
    updatedAt: new Date("2024-01-22"),
    dueDate: new Date("2024-03-15"),
    files: [],
    milestones: [],
  },
];

export function getProjectStats(projects: Project[]): ProjectStats {
  return {
    total: projects.length,
    completed: projects.filter((p) => p.status === "已完成").length,
    inProgress: projects.filter((p) => p.status === "进行中").length,
    pending: projects.filter((p) => p.status === "待处理").length,
  };
}

export function getProjectById(id: string): Project | undefined {
  return mockProjects.find((p) => p.id === id);
}

export function getProjectFiles(projectId: string): ProjectFile[] {
  return mockFiles.filter((f) => f.projectId === projectId);
}

export function getProjectMilestones(projectId: string): Milestone[] {
  return mockMilestones.filter((m) => m.projectId === projectId);
}
