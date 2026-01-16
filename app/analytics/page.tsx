"use client";

import * as React from "react";
import { format } from "date-fns";
import { zhCN } from "date-fns/locale";
import { CalendarIcon, X } from "lucide-react";
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
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  XAxis,
  YAxis,
  Sector,
} from "recharts";
import { mockProjects } from "@/lib/mock-data";
import { cn } from "@/lib/utils";
import type { DateRange } from "react-day-picker";

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
    color: "#60a5fa",
  },
  完成: {
    label: "完成项目",
    color: "#64748b",
  },
  进度: {
    label: "完成进度",
    color: "#3b82f6",
  },
} satisfies ChartConfig;

const renderActiveShape = (props: unknown) => {
  const { cx, cy, innerRadius, outerRadius, startAngle, endAngle, fill } =
    props as {
      cx: number;
      cy: number;
      innerRadius: number;
      outerRadius: number;
      startAngle: number;
      endAngle: number;
      fill: string;
    };

  return (
    <g>
      <Sector
        cx={cx}
        cy={cy}
        innerRadius={innerRadius}
        outerRadius={outerRadius + 10}
        startAngle={startAngle}
        endAngle={endAngle}
        fill={fill}
      />
    </g>
  );
};

export default function AnalyticsPage() {
  const [activeIndex, setActiveIndex] = React.useState<number | undefined>(0);
  const [dateRange, setDateRange] = React.useState<DateRange | undefined>();

  // Filter projects based on date range
  const filteredProjects = React.useMemo(() => {
    if (!dateRange?.from) {
      return mockProjects;
    }

    return mockProjects.filter((project) => {
      const projectDate = new Date(project.createdAt);
      const fromDate = new Date(dateRange.from!);
      const toDate = dateRange.to
        ? new Date(dateRange.to)
        : new Date(dateRange.from!);

      // Set time to start of day for comparison
      projectDate.setHours(0, 0, 0, 0);
      fromDate.setHours(0, 0, 0, 0);
      toDate.setHours(23, 59, 59, 999);

      return projectDate >= fromDate && projectDate <= toDate;
    });
  }, [dateRange]);

  // Calculate status distribution based on filtered projects
  const projectStatusData = React.useMemo(() => {
    const statusCounts = {
      待处理: 0,
      进行中: 0,
      已完成: 0,
    };

    filteredProjects.forEach((project) => {
      statusCounts[project.status]++;
    });

    return [
      { name: "待处理", value: statusCounts.待处理, fill: "#94a3b8" },
      { name: "进行中", value: statusCounts.进行中, fill: "#60a5fa" },
      { name: "已完成", value: statusCounts.已完成, fill: "#475569" },
    ];
  }, [filteredProjects]);

  // Calculate priority distribution based on filtered projects
  const projectPriorityData = React.useMemo(() => {
    const priorityCounts = {
      高: 0,
      中: 0,
      低: 0,
    };

    filteredProjects.forEach((project) => {
      priorityCounts[project.priority]++;
    });

    return [
      { name: "高", value: priorityCounts.高, fill: "#64748b" },
      { name: "中", value: priorityCounts.中, fill: "#3b82f6" },
      { name: "低", value: priorityCounts.低, fill: "#cbd5e1" },
    ];
  }, [filteredProjects]);

  const total = React.useMemo(() => {
    return projectStatusData.reduce((acc, curr) => acc + curr.value, 0);
  }, [projectStatusData]);

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
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-semibold">数据分析</h2>
            <p className="text-sm text-muted-foreground mt-1">
              项目数据统计与趋势分析
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-[300px] justify-start text-left font-normal",
                    !dateRange && "text-muted-foreground",
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {dateRange?.from ? (
                    dateRange.to ? (
                      <>
                        {format(dateRange.from, "PPP", { locale: zhCN })} -{" "}
                        {format(dateRange.to, "PPP", { locale: zhCN })}
                      </>
                    ) : (
                      format(dateRange.from, "PPP", { locale: zhCN })
                    )
                  ) : (
                    <span>选择日期范围</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="end">
                <Calendar
                  initialFocus
                  mode="range"
                  defaultMonth={dateRange?.from}
                  selected={dateRange}
                  onSelect={setDateRange}
                  numberOfMonths={2}
                  locale={zhCN}
                />
              </PopoverContent>
            </Popover>
            {dateRange && (
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setDateRange(undefined)}
                className="h-10 w-10"
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>项目状态分布</CardTitle>
              <CardDescription>
                各状态项目数量统计
                {dateRange?.from && (
                  <span className="ml-1">
                    (
                    {dateRange.to
                      ? `${format(dateRange.from, "yyyy/MM/dd")} - ${format(dateRange.to, "yyyy/MM/dd")}`
                      : format(dateRange.from, "yyyy/MM/dd")}
                    )
                  </span>
                )}
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col">
              {total === 0 ? (
                <div className="flex h-[300px] items-center justify-center text-muted-foreground">
                  <p>所选日期范围内暂无项目数据</p>
                </div>
              ) : (
                <>
                  <ChartContainer
                    config={chartConfig}
                    className="mx-auto aspect-square max-h-62.5"
                  >
                    <PieChart>
                      <ChartTooltip
                        cursor={false}
                        content={<ChartTooltipContent hideLabel />}
                      />
                      <Pie
                        data={projectStatusData}
                        cx="50%"
                        cy="50%"
                        dataKey="value"
                        nameKey="name"
                        innerRadius={60}
                        outerRadius={80}
                        paddingAngle={5}
                        activeIndex={activeIndex}
                        activeShape={renderActiveShape}
                        onMouseEnter={(_, index) => setActiveIndex(index)}
                        onMouseLeave={() => setActiveIndex(0)}
                      />
                    </PieChart>
                  </ChartContainer>
                  <div className="mt-4 flex flex-col gap-2">
                    {projectStatusData.map((item) => (
                      <div
                        key={item.name}
                        className="flex items-center justify-between text-sm"
                      >
                        <div className="flex items-center gap-2">
                          <div
                            className="h-3 w-3 rounded-sm"
                            style={{ backgroundColor: item.fill }}
                          />
                          <span>{item.name}</span>
                        </div>
                        <span className="font-medium">
                          {item.value} (
                          {total > 0
                            ? ((item.value / total) * 100).toFixed(0)
                            : 0}
                          %)
                        </span>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>优先级分布</CardTitle>
              <CardDescription>
                项目优先级统计
                {dateRange?.from && (
                  <span className="ml-1">
                    (
                    {dateRange.to
                      ? `${format(dateRange.from, "yyyy/MM/dd")} - ${format(dateRange.to, "yyyy/MM/dd")}`
                      : format(dateRange.from, "yyyy/MM/dd")}
                    )
                  </span>
                )}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {filteredProjects.length === 0 ? (
                <div className="flex h-[300px] items-center justify-center text-muted-foreground">
                  <p>所选日期范围内暂无项目数据</p>
                </div>
              ) : (
                <ChartContainer config={chartConfig} className="h-[300px]">
                  <BarChart data={projectPriorityData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Bar dataKey="value" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ChartContainer>
              )}
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
                  <Bar
                    dataKey="新增"
                    fill="var(--color-新增)"
                    radius={[4, 4, 0, 0]}
                  />
                  <Bar
                    dataKey="完成"
                    fill="var(--color-完成)"
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ChartContainer>
            </CardContent>
          </Card>
        </div>
      </div>
    </SidebarInset>
  );
}
