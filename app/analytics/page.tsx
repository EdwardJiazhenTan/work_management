"use client";

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
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { Bar, BarChart, CartesianGrid, Legend, Line, LineChart, Pie, PieChart, XAxis, YAxis } from "recharts";

const projectStatusData = [
  { name: "待处理", value: 3, fill: "hsl(var(--chart-1))" },
  { name: "进行中", value: 3, fill: "hsl(var(--chart-2))" },
  { name: "已完成", value: 2, fill: "hsl(var(--chart-3))" },
];

const projectPriorityData = [
  { name: "高", value: 4, fill: "hsl(var(--chart-1))" },
  { name: "中", value: 3, fill: "hsl(var(--chart-2))" },
  { name: "低", value: 1, fill: "hsl(var(--chart-3))" },
];

const monthlyData = [
  { month: "1月", 新增: 12, 完成: 8 },
  { month: "2月", 新增: 15, 完成: 10 },
  { month: "3月", 新增: 10, 完成: 12 },
  { month: "4月", 新增: 18, 完成: 15 },
  { month: "5月", 新增: 14, 完成: 16 },
  { month: "6月", 新增: 16, 完成: 14 },
];

const weeklyProgressData = [
  { week: "第1周", 进度: 20 },
  { week: "第2周", 进度: 35 },
  { week: "第3周", 进度: 45 },
  { week: "第4周", 进度: 60 },
  { week: "第5周", 进度: 75 },
  { week: "第6周", 进度: 85 },
];

const chartConfig = {
  新增: {
    label: "新增项目",
    color: "hsl(var(--chart-1))",
  },
  完成: {
    label: "完成项目",
    color: "hsl(var(--chart-2))",
  },
  进度: {
    label: "完成进度",
    color: "hsl(var(--chart-3))",
  },
} satisfies ChartConfig;

export default function AnalyticsPage() {
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
                <BreadcrumbPage>数据分析</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
        <ThemeToggle />
      </header>
      <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
        <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>项目状态分布</CardTitle>
              <CardDescription>各状态项目数量统计</CardDescription>
            </CardHeader>
            <CardContent>
              <ChartContainer config={chartConfig} className="h-[300px]">
                <PieChart>
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Pie
                    data={projectStatusData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    label
                  />
                </PieChart>
              </ChartContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>优先级分布</CardTitle>
              <CardDescription>项目优先级统计</CardDescription>
            </CardHeader>
            <CardContent>
              <ChartContainer config={chartConfig} className="h-[300px]">
                <BarChart data={projectPriorityData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Bar dataKey="value" fill="hsl(var(--chart-1))" />
                </BarChart>
              </ChartContainer>
            </CardContent>
          </Card>

          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle>项目月度趋势</CardTitle>
              <CardDescription>新增与完成项目数量对比</CardDescription>
            </CardHeader>
            <CardContent>
              <ChartContainer config={chartConfig} className="h-[300px]">
                <BarChart data={monthlyData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Legend />
                  <Bar dataKey="新增" fill="var(--color-新增)" />
                  <Bar dataKey="完成" fill="var(--color-完成)" />
                </BarChart>
              </ChartContainer>
            </CardContent>
          </Card>

          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle>周进度趋势</CardTitle>
              <CardDescription>项目完成进度变化</CardDescription>
            </CardHeader>
            <CardContent>
              <ChartContainer config={chartConfig} className="h-[300px]">
                <LineChart data={weeklyProgressData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="week" />
                  <YAxis />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="进度"
                    stroke="var(--color-进度)"
                    strokeWidth={2}
                  />
                </LineChart>
              </ChartContainer>
            </CardContent>
          </Card>
        </div>
      </div>
    </SidebarInset>
  );
}
