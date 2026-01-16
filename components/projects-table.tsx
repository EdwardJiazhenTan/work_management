"use client";

import * as React from "react";
import Link from "next/link";
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  type ColumnDef,
  type ColumnFiltersState,
  type SortingState,
  type VisibilityState,
} from "@tanstack/react-table";
import { ArrowUpDown, ChevronDown } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
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

interface ProjectsTableProps {
  projects: Project[];
}

export function ProjectsTable({ projects }: ProjectsTableProps) {
  const [sorting, setSorting] = React.useState<SortingState>([
    { id: "createdAt", desc: true },
  ]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    [],
  );
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});

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

  const getCategoryBadge = (category: Project["category"]) => {
    const styles: Record<Project["category"], string> = {
      经营管理: "bg-purple-500 text-white dark:bg-purple-600",
      资产管理: "bg-green-500 text-white dark:bg-green-600",
      议案管理: "bg-orange-500 text-white dark:bg-orange-600",
      工商管理: "bg-pink-500 text-white dark:bg-pink-600",
      非工程类采购管理: "bg-indigo-500 text-white dark:bg-indigo-600",
      保险采购管理: "bg-teal-500 text-white dark:bg-teal-600",
      法务管理: "bg-red-500 text-white dark:bg-red-600",
      其他: "bg-gray-500 text-white dark:bg-gray-600",
    };
    return (
      <Badge variant="secondary" className={styles[category]}>
        {category}
      </Badge>
    );
  };

  const formatDate = (date?: Date) => {
    if (!date) return "-";
    return new Date(date).toLocaleDateString("zh-CN");
  };

  const columns: ColumnDef<Project>[] = [
    {
      id: "select",
      header: ({ table }) => (
        <Checkbox
          checked={
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() && "indeterminate")
          }
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="选择全部"
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="选择行"
        />
      ),
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: "name",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            项目名称
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ row }) => (
        <Link
          href={`/projects/${row.original.id}`}
          className="font-medium hover:underline"
        >
          {row.getValue("name")}
        </Link>
      ),
    },
    {
      accessorKey: "category",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            任务类别
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ row }) => getCategoryBadge(row.getValue("category")),
      filterFn: (row, id, value) => {
        return value.includes(row.getValue(id));
      },
    },
    {
      accessorKey: "status",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            状态
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ row }) => getStatusBadge(row.getValue("status")),
    },
    {
      accessorKey: "priority",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            优先级
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ row }) => getPriorityBadge(row.getValue("priority")),
      sortingFn: (rowA, rowB) => {
        const priorityOrder: Record<Project["priority"], number> = {
          高: 1,
          中: 2,
          低: 3,
        };
        const aValue =
          priorityOrder[rowA.getValue("priority") as Project["priority"]];
        const bValue =
          priorityOrder[rowB.getValue("priority") as Project["priority"]];
        return aValue - bValue;
      },
    },
    {
      accessorKey: "createdAt",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            创建时间
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ row }) => formatDate(row.getValue("createdAt")),
      sortingFn: (rowA, rowB) => {
        const aDate = rowA.getValue("createdAt") as Date | undefined;
        const bDate = rowB.getValue("createdAt") as Date | undefined;
        const aTime = aDate ? new Date(aDate).getTime() : 0;
        const bTime = bDate ? new Date(bDate).getTime() : 0;
        return aTime - bTime;
      },
    },
    {
      accessorKey: "dueDate",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            截止日期
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ row }) => formatDate(row.getValue("dueDate")),
      sortingFn: (rowA, rowB) => {
        const aDate = rowA.getValue("dueDate") as Date | undefined;
        const bDate = rowB.getValue("dueDate") as Date | undefined;
        const aTime = aDate ? new Date(aDate).getTime() : 0;
        const bTime = bDate ? new Date(bDate).getTime() : 0;
        return aTime - bTime;
      },
    },
  ];

  const table = useReactTable({
    data: projects,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  });

  return (
    <div className="w-full">
      <div className="flex items-center gap-4 py-4">
        <Input
          placeholder="筛选任务类别..."
          value={
            (table.getColumn("category")?.getFilterValue() as string) ?? ""
          }
          onChange={(event) =>
            table.getColumn("category")?.setFilterValue(event.target.value)
          }
          className="max-w-sm"
        />
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="ml-auto">
              显示列 <ChevronDown className="ml-2 h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {table
              .getAllColumns()
              .filter((column) => column.getCanHide())
              .map((column) => {
                const columnNames: Record<string, string> = {
                  name: "项目名称",
                  category: "任务类别",
                  status: "状态",
                  priority: "优先级",
                  createdAt: "创建时间",
                  dueDate: "截止日期",
                };
                return (
                  <DropdownMenuCheckboxItem
                    key={column.id}
                    className="capitalize"
                    checked={column.getIsVisible()}
                    onCheckedChange={(value) =>
                      column.toggleVisibility(!!value)
                    }
                  >
                    {columnNames[column.id] || column.id}
                  </DropdownMenuCheckboxItem>
                );
              })}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <div className="overflow-hidden rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext(),
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  没有结果。
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-end space-x-2 py-4">
        <div className="text-muted-foreground flex-1 text-sm">
          已选择 {table.getFilteredSelectedRowModel().rows.length} /{" "}
          {table.getFilteredRowModel().rows.length} 行
        </div>
        <div className="space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            上一页
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            下一页
          </Button>
        </div>
      </div>
    </div>
  );
}
