import { NextResponse } from "next/server";

export interface Task {
  id: number;
  title: string;
  category: string;
  priority: string;
  status: string;
  deadline: string;
  assignee: string;
  description: string;
}

// Mock data
const mockTasks: Task[] = [
  {
    id: 1,
    title: "年度经营计划编制",
    category: "经营管理",
    priority: "高",
    status: "进行中",
    deadline: "2026-02-15",
    assignee: "张三",
    description: "完成2026年度经营计划的编制和审核工作",
  },
  {
    id: 2,
    title: "固定资产盘点",
    category: "资产管理",
    priority: "中",
    status: "待处理",
    deadline: "2026-03-01",
    assignee: "李四",
    description: "对公司固定资产进行全面盘点",
  },
  {
    id: 3,
    title: "董事会议案准备",
    category: "议案管理",
    priority: "高",
    status: "进行中",
    deadline: "2026-01-25",
    assignee: "王五",
    description: "准备下次董事会的相关议案材料",
  },
  {
    id: 4,
    title: "营业执照年检",
    category: "工商管理",
    priority: "高",
    status: "待处理",
    deadline: "2026-06-30",
    assignee: "赵六",
    description: "完成公司营业执照的年度检验",
  },
  {
    id: 5,
    title: "办公用品采购",
    category: "非工程类采购管理",
    priority: "低",
    status: "已完成",
    deadline: "2026-01-10",
    assignee: "孙七",
    description: "采购本季度办公用品",
  },
  {
    id: 6,
    title: "财产保险续保",
    category: "保险采购管理",
    priority: "中",
    status: "进行中",
    deadline: "2026-02-28",
    assignee: "周八",
    description: "办理公司财产保险续保手续",
  },
  {
    id: 7,
    title: "合同审核",
    category: "法务管理",
    priority: "高",
    status: "待处理",
    deadline: "2026-01-20",
    assignee: "吴九",
    description: "审核供应商合同条款",
  },
  {
    id: 8,
    title: "季度财务报表",
    category: "经营管理",
    priority: "高",
    status: "已完成",
    deadline: "2026-01-15",
    assignee: "郑十",
    description: "完成第四季度财务报表编制",
  },
  {
    id: 9,
    title: "设备维护保养",
    category: "资产管理",
    priority: "中",
    status: "进行中",
    deadline: "2026-02-10",
    assignee: "钱一",
    description: "进行生产设备的例行维护保养",
  },
  {
    id: 10,
    title: "员工培训计划",
    category: "其他",
    priority: "中",
    status: "待处理",
    deadline: "2026-03-15",
    assignee: "陈二",
    description: "制定第一季度员工培训计划",
  },
];

export async function GET() {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 100));

  return NextResponse.json(mockTasks);
}
