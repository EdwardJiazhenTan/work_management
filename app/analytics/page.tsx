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
  ChartLegend,
  ChartLegendContent,
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
  Cell,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  PolarAngleAxis,
  RadialBar,
  RadialBarChart,
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
  { month: "7月", 新增: 13, 完成: 15 },
  { month: "8月", 新增: 17, 完成: 13 },
  { month: "9月", 新增: 19, 完成: 16 },
  { month: "10月", 新增: 14, 完成: 18 },
  { month: "11月", 新增: 16, 完成: 15 },
  { month: "12月", 新增: 15, 完成: 17 },
];

const weeklyProgressData = [
  { week: "第1周", 进度: 15 },
  { week: "第2周", 进度: 22 },
  { week: "第3周", 进度: 28 },
  { week: "第4周", 进度: 35 },
  { week: "第5周", 进度: 42 },
  { week: "第6周", 进度: 48 },
  { week: "第7周", 进度: 55 },
  { week: "第8周", 进度: 60 },
  { week: "第9周", 进度: 65 },
  { week: "第10周", 进度: 70 },
  { week: "第11周", 进度: 75 },
  { week: "第12周", 进度: 80 },
  { week: "第13周", 进度: 83 },
  { week: "第14周", 进度: 86 },
  { week: "第15周", 进度: 89 },
  { week: "第16周", 进度: 92 },
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
  经营管理: {
    label: "经营管理",
    color: "hsl(var(--chart-1))",
  },
  资产管理: {
    label: "资产管理",
    color: "hsl(var(--chart-2))",
  },
  议案管理: {
    label: "议案管理",
    color: "hsl(var(--chart-3))",
  },
  工商管理: {
    label: "工商管理",
    color: "hsl(var(--chart-4))",
  },
  非工程类采购管理: {
    label: "非工程类采购管理",
    color: "hsl(var(--chart-5))",
  },
  保险采购管理: {
    label: "保险采购管理",
    color: "hsl(var(--chart-1))",
  },
  法务管理: {
    label: "法务管理",
    color: "hsl(var(--chart-2))",
  },
  其他: {
    label: "其他",
    color: "hsl(var(--chart-3))",
  },
  待处理: {
    label: "待处理",
    color: "hsl(220 13% 69%)",
  },
  进行中: {
    label: "进行中",
    color: "hsl(217 91% 60%)",
  },
  已完成: {
    label: "已完成",
    color: "hsl(215 20% 47%)",
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
      {
        name: "待处理",
        value: statusCounts.待处理,
        fill: "var(--color-待处理)",
      },
      {
        name: "进行中",
        value: statusCounts.进行中,
        fill: "var(--color-进行中)",
      },
      {
        name: "已完成",
        value: statusCounts.已完成,
        fill: "var(--color-已完成)",
      },
    ];
  }, [filteredProjects]);

  type StatusData = {
    name: string;
    value: number;
    fill: string;
  };

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

  // Calculate category distribution for radial chart
  const projectCategoryData = React.useMemo(() => {
    const categoryCounts: Record<string, number> = {
      经营管理: 0,
      资产管理: 0,
      议案管理: 0,
      工商管理: 0,
      非工程类采购管理: 0,
      保险采购管理: 0,
      法务管理: 0,
      其他: 0,
    };

    filteredProjects.forEach((project) => {
      categoryCounts[project.category]++;
    });

    const categoryColors: Record<string, string> = {
      经营管理: "#3b82f6",
      资产管理: "#60a5fa",
      议案管理: "#1d4ed8",
      工商管理: "#06b6d4",
      非工程类采购管理: "#0ea5e9",
      保险采购管理: "#6366f1",
      法务管理: "#1e40af",
      其他: "#94a3b8",
    };

    const totalCategories = Object.values(categoryCounts).reduce(
      (a, b) => a + b,
      0,
    );

    // Find max value for proper scaling
    const maxValue = Math.max(...Object.values(categoryCounts));

    return Object.entries(categoryCounts)
      .map(([name, value]) => ({
        name,
        value,
        fill: categoryColors[name],
        percentage:
          totalCategories > 0
            ? ((value / totalCategories) * 100).toFixed(1)
            : 0,
      }))
      .filter((item) => item.value > 0);
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
              <CardTitle>项目类别分布</CardTitle>
              <CardDescription>
                各类别项目数量统计
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
                <div className="flex h-[350px] items-center justify-center text-muted-foreground">
                  <p>所选日期范围内暂无项目数据</p>
                </div>
              ) : (
                <ChartContainer config={chartConfig} className="h-[350px]">
                  <RadialBarChart
                    data={projectCategoryData}
                    innerRadius="20%"
                    outerRadius="90%"
                    startAngle={90}
                    endAngle={-270}
                  >
                    <PolarAngleAxis
                      type="number"
                      domain={[
                        0,
                        Math.max(...projectCategoryData.map((d) => d.value)),
                      ]}
                      angleAxisId={0}
                      tick={false}
                    />
                    <ChartTooltip
                      content={({ active, payload }) => {
                        if (active && payload && payload.length) {
                          return (
                            <div className="rounded-lg border bg-background p-2 shadow-sm">
                              <div className="flex flex-col gap-1">
                                <span className="text-sm font-medium">
                                  {payload[0].payload.name}
                                </span>
                                <span className="text-sm text-muted-foreground">
                                  数量: {payload[0].payload.value}
                                </span>
                                <span className="text-sm text-muted-foreground">
                                  占比: {payload[0].payload.percentage}%
                                </span>
                              </div>
                            </div>
                          );
                        }
                        return null;
                      }}
                    />
                    <RadialBar
                      dataKey="value"
                      cornerRadius={4}
                      label={{
                        position: "insideStart",
                        fill: "#fff",
                        fontSize: 12,
                        formatter: (value: string, entry: { name?: string }) =>
                          entry?.name || "",
                      }}
                    />
                  </RadialBarChart>
                </ChartContainer>
              )}
            </CardContent>
          </Card>

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
            <CardContent>
              {total === 0 ? (
                <div className="flex h-[350px] items-center justify-center text-muted-foreground">
                  <p>所选日期范围内暂无项目数据</p>
                </div>
              ) : (
                <ChartContainer config={chartConfig} className="h-[350px]">
                  <BarChart data={projectStatusData} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis type="number" allowDecimals={false} />
                    <YAxis dataKey="name" type="category" width={80} />
                    <ChartTooltip
                      content={({ active, payload }) => {
                        if (active && payload && payload.length) {
                          const value = payload[0].value as number;
                          const percentage =
                            total > 0 ? ((value / total) * 100).toFixed(1) : 0;
                          return (
                            <div className="rounded-lg border bg-background p-2 shadow-sm">
                              <div className="flex flex-col gap-1">
                                <span className="text-sm font-medium">
                                  {payload[0].payload.name}
                                </span>
                                <span className="text-sm text-muted-foreground">
                                  数量: {value}
                                </span>
                                <span className="text-sm text-muted-foreground">
                                  占比: {percentage}%
                                </span>
                              </div>
                            </div>
                          );
                        }
                        return null;
                      }}
                    />
                    <ChartLegend
                      content={<ChartLegendContent nameKey="name" />}
                      className="mt-4"
                    />
                    <Bar dataKey="value" radius={[0, 4, 4, 0]}>
                      {projectStatusData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.fill} />
                      ))}
                    </Bar>
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
