"use client";

import * as React from "react";
import { Milestone, MilestoneStatus } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, Circle, Clock, Plus } from "lucide-react";
import { Progress } from "@/components/ui/progress";

interface MilestoneListProps {
  projectId: string;
  milestones: Milestone[];
  onMilestoneAdded: (milestone: Milestone) => void;
  onMilestoneUpdated: (milestone: Milestone) => void;
}

export function MilestoneList({ projectId, milestones, onMilestoneAdded, onMilestoneUpdated }: MilestoneListProps) {
  const [open, setOpen] = React.useState(false);
  const [formData, setFormData] = React.useState({
    title: "",
    description: "",
    status: "未开始" as MilestoneStatus,
    dueDate: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const newMilestone: Milestone = {
      id: Date.now().toString(),
      projectId,
      title: formData.title,
      description: formData.description,
      status: formData.status,
      dueDate: formData.dueDate ? new Date(formData.dueDate) : undefined,
      order: milestones.length + 1,
    };

    onMilestoneAdded(newMilestone);
    setFormData({
      title: "",
      description: "",
      status: "未开始",
      dueDate: "",
    });
    setOpen(false);
  };

  const getStatusIcon = (status: MilestoneStatus) => {
    switch (status) {
      case "已完成":
        return <CheckCircle2 className="h-5 w-5 text-slate-600 dark:text-slate-400" />;
      case "进行中":
        return <Clock className="h-5 w-5 text-blue-500" />;
      case "未开始":
        return <Circle className="h-5 w-5 text-slate-300 dark:text-slate-600" />;
    }
  };

  const getStatusBadge = (status: MilestoneStatus) => {
    const styles: Record<MilestoneStatus, string> = {
      未开始: "bg-slate-200 text-slate-700 dark:bg-slate-800 dark:text-slate-300",
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
  const progress = milestones.length > 0 ? (completedCount / milestones.length) * 100 : 0;

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
                  <DialogDescription>
                    创建项目里程碑节点
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid gap-2">
                    <Label htmlFor="title">标题</Label>
                    <Input
                      id="title"
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      required
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="description">描述</Label>
                    <Textarea
                      id="description"
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      required
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="grid gap-2">
                      <Label htmlFor="status">状态</Label>
                      <Select
                        value={formData.status}
                        onValueChange={(value) =>
                          setFormData({ ...formData, status: value as MilestoneStatus })
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
                      <Label htmlFor="dueDate">截止日期</Label>
                      <Input
                        id="dueDate"
                        type="date"
                        value={formData.dueDate}
                        onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                      />
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
                    <div>
                      <h4 className="font-medium">{milestone.title}</h4>
                      <p className="text-sm text-muted-foreground mt-1">
                        {milestone.description}
                      </p>
                      {milestone.dueDate && (
                        <p className="text-xs text-muted-foreground mt-2">
                          截止: {new Date(milestone.dueDate).toLocaleDateString("zh-CN")}
                        </p>
                      )}
                    </div>
                    {getStatusBadge(milestone.status)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
