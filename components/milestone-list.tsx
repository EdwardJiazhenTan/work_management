"use client";

import * as React from "react";
import { format } from "date-fns";
import { zhCN } from "date-fns/locale";
import { Milestone, MilestoneStatus } from "@/lib/types";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Badge } from "@/components/ui/badge";
import {
  CheckCircle2,
  Circle,
  Clock,
  Plus,
  Pencil,
  Trash2,
  CalendarIcon,
} from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

interface MilestoneListProps {
  projectId: string;
  milestones: Milestone[];
  onMilestoneAdded: (milestone: Milestone) => void;
  onMilestoneUpdated: (milestone: Milestone) => void;
  onMilestoneDeleted: (milestoneId: string) => void;
}

export function MilestoneList({
  projectId,
  milestones,
  onMilestoneAdded,
  onMilestoneUpdated,
  onMilestoneDeleted,
}: MilestoneListProps) {
  const [open, setOpen] = React.useState(false);
  const [editOpen, setEditOpen] = React.useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = React.useState(false);
  const [editingMilestone, setEditingMilestone] =
    React.useState<Milestone | null>(null);
  const [milestoneToDelete, setMilestoneToDelete] = React.useState<
    string | null
  >(null);
  const [date, setDate] = React.useState<Date>();
  const [editDate, setEditDate] = React.useState<Date>();
  const [formData, setFormData] = React.useState({
    title: "",
    description: "",
    status: "未开始" as MilestoneStatus,
  });
  const [editFormData, setEditFormData] = React.useState({
    title: "",
    description: "",
    status: "未开始" as MilestoneStatus,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const newMilestone: Milestone = {
      id: Date.now().toString(),
      projectId,
      title: formData.title,
      description: formData.description,
      status: formData.status,
      dueDate: date,
      order: milestones.length + 1,
    };

    onMilestoneAdded(newMilestone);
    setFormData({
      title: "",
      description: "",
      status: "未开始",
    });
    setDate(undefined);
    setOpen(false);
  };

  const handleEditClick = (milestone: Milestone) => {
    setEditingMilestone(milestone);
    setEditFormData({
      title: milestone.title,
      description: milestone.description,
      status: milestone.status,
    });
    setEditDate(milestone.dueDate ? new Date(milestone.dueDate) : undefined);
    setEditOpen(true);
  };

  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (editingMilestone) {
      const updatedMilestone: Milestone = {
        ...editingMilestone,
        title: editFormData.title,
        description: editFormData.description,
        status: editFormData.status,
        dueDate: editDate,
        completedDate:
          editFormData.status === "已完成" &&
          editingMilestone.status !== "已完成"
            ? new Date()
            : editingMilestone.completedDate,
      };

      onMilestoneUpdated(updatedMilestone);
      setEditOpen(false);
      setEditingMilestone(null);
      setEditDate(undefined);
    }
  };

  const handleDeleteClick = (milestoneId: string) => {
    setMilestoneToDelete(milestoneId);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (milestoneToDelete) {
      onMilestoneDeleted(milestoneToDelete);
      setMilestoneToDelete(null);
      setDeleteDialogOpen(false);
    }
  };

  const getStatusIcon = (status: MilestoneStatus) => {
    switch (status) {
      case "已完成":
        return (
          <CheckCircle2 className="h-5 w-5 text-slate-600 dark:text-slate-400" />
        );
      case "进行中":
        return <Clock className="h-5 w-5 text-blue-500" />;
      case "未开始":
        return (
          <Circle className="h-5 w-5 text-slate-300 dark:text-slate-600" />
        );
    }
  };

  const getStatusBadge = (status: MilestoneStatus) => {
    const styles: Record<MilestoneStatus, string> = {
      未开始:
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

  const completedCount = milestones.filter((m) => m.status === "已完成").length;
  const progress =
    milestones.length > 0 ? (completedCount / milestones.length) * 100 : 0;

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>项目里程碑</CardTitle>
            <CardDescription>
              {completedCount} / {milestones.length} 已完成
            </CardDescription>
          </div>
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button size="sm">
                <Plus className="mr-2 h-4 w-4" />
                添加里程碑
              </Button>
            </DialogTrigger>
            <DialogContent>
              <form onSubmit={handleSubmit}>
                <DialogHeader>
                  <DialogTitle>添加里程碑</DialogTitle>
                  <DialogDescription>创建项目里程碑节点</DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid gap-2">
                    <Label htmlFor="title">标题</Label>
                    <Input
                      id="title"
                      value={formData.title}
                      onChange={(e) =>
                        setFormData({ ...formData, title: e.target.value })
                      }
                      required
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="description">描述</Label>
                    <Textarea
                      id="description"
                      value={formData.description}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          description: e.target.value,
                        })
                      }
                      required
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="grid gap-2">
                      <Label htmlFor="status">状态</Label>
                      <Select
                        value={formData.status}
                        onValueChange={(value) =>
                          setFormData({
                            ...formData,
                            status: value as MilestoneStatus,
                          })
                        }
                      >
                        <SelectTrigger id="status">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="未开始">未开始</SelectItem>
                          <SelectItem value="进行中">进行中</SelectItem>
                          <SelectItem value="已完成">已完成</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="grid gap-2">
                      <Label>截止日期</Label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            className={cn(
                              "justify-start text-left font-normal",
                              !date && "text-muted-foreground",
                            )}
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {date
                              ? format(date, "PPP", { locale: zhCN })
                              : "选择日期"}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                          <Calendar
                            mode="single"
                            selected={date}
                            onSelect={setDate}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                    </div>
                  </div>
                </div>
                <DialogFooter>
                  <Button type="submit">添加</Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>
        {milestones.length > 0 && (
          <div className="mt-4">
            <Progress value={progress} className="h-2" />
            <p className="mt-2 text-xs text-muted-foreground">
              完成进度 {progress.toFixed(0)}%
            </p>
          </div>
        )}
      </CardHeader>
      <CardContent>
        {milestones.length === 0 ? (
          <p className="text-sm text-muted-foreground">暂无里程碑</p>
        ) : (
          <div className="space-y-4">
            {milestones.map((milestone, index) => (
              <div key={milestone.id} className="flex gap-4">
                <div className="flex flex-col items-center">
                  {getStatusIcon(milestone.status)}
                  {index < milestones.length - 1 && (
                    <div className="w-0.5 flex-1 bg-slate-200 dark:bg-slate-700 mt-2" />
                  )}
                </div>
                <div className="flex-1 pb-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h4 className="font-medium">{milestone.title}</h4>
                      <p className="text-sm text-muted-foreground mt-1">
                        {milestone.description}
                      </p>
                      {milestone.dueDate && (
                        <p className="text-xs text-muted-foreground mt-2">
                          截止:{" "}
                          {new Date(milestone.dueDate).toLocaleDateString(
                            "zh-CN",
                          )}
                        </p>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      {getStatusBadge(milestone.status)}
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => handleEditClick(milestone)}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10"
                        onClick={() => handleDeleteClick(milestone.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>

      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent>
          <form onSubmit={handleEditSubmit}>
            <DialogHeader>
              <DialogTitle>编辑里程碑</DialogTitle>
              <DialogDescription>修改里程碑信息</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="edit-title">标题</Label>
                <Input
                  id="edit-title"
                  value={editFormData.title}
                  onChange={(e) =>
                    setEditFormData({ ...editFormData, title: e.target.value })
                  }
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-description">描述</Label>
                <Textarea
                  id="edit-description"
                  value={editFormData.description}
                  onChange={(e) =>
                    setEditFormData({
                      ...editFormData,
                      description: e.target.value,
                    })
                  }
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="edit-status">状态</Label>
                  <Select
                    value={editFormData.status}
                    onValueChange={(value) =>
                      setEditFormData({
                        ...editFormData,
                        status: value as MilestoneStatus,
                      })
                    }
                  >
                    <SelectTrigger id="edit-status">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="未开始">未开始</SelectItem>
                      <SelectItem value="进行中">进行中</SelectItem>
                      <SelectItem value="已完成">已完成</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label>截止日期</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "justify-start text-left font-normal",
                          !editDate && "text-muted-foreground",
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {editDate
                          ? format(editDate, "PPP", { locale: zhCN })
                          : "选择日期"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={editDate}
                        onSelect={setEditDate}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button type="submit">保存</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>确认删除</AlertDialogTitle>
            <AlertDialogDescription>
              确定要删除此里程碑吗？此操作无法撤销。
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>取消</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteConfirm}>
              删除
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Card>
  );
}
