"use client";

import * as React from "react";
import { ProjectFile } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { File, Plus, Trash2 } from "lucide-react";

interface FileListProps {
  projectId: string;
  files: ProjectFile[];
  onFileAdded: (file: ProjectFile) => void;
}

export function FileList({ projectId, files, onFileAdded }: FileListProps) {
  const [open, setOpen] = React.useState(false);
  const [fileName, setFileName] = React.useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const newFile: ProjectFile = {
      id: Date.now().toString(),
      projectId,
      fileName,
      fileSize: Math.floor(Math.random() * 5000000) + 100000,
      fileType: fileName.split(".").pop() || "file",
      uploadedAt: new Date(),
      url: `/uploads/${fileName}`,
    };

    onFileAdded(newFile);
    setFileName("");
    setOpen(false);
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + " B";
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
    return (bytes / (1024 * 1024)).toFixed(1) + " MB";
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>项目文件</CardTitle>
            <CardDescription>管理项目相关文件</CardDescription>
          </div>
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button size="sm">
                <Plus className="mr-2 h-4 w-4" />
                添加文件
              </Button>
            </DialogTrigger>
            <DialogContent>
              <form onSubmit={handleSubmit}>
                <DialogHeader>
                  <DialogTitle>添加文件</DialogTitle>
                  <DialogDescription>
                    上传项目相关文件（模拟上传）
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid gap-2">
                    <Label htmlFor="fileName">文件名</Label>
                    <Input
                      id="fileName"
                      placeholder="example.pdf"
                      value={fileName}
                      onChange={(e) => setFileName(e.target.value)}
                      required
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button type="submit">添加</Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent>
        {files.length === 0 ? (
          <p className="text-sm text-muted-foreground">暂无文件</p>
        ) : (
          <div className="space-y-2">
            {files.map((file) => (
              <div
                key={file.id}
                className="flex items-center justify-between rounded-lg border p-3"
              >
                <div className="flex items-center gap-3">
                  <File className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">{file.fileName}</p>
                    <p className="text-xs text-muted-foreground">
                      {formatFileSize(file.fileSize)} • {new Date(file.uploadedAt).toLocaleDateString("zh-CN")}
                    </p>
                  </div>
                </div>
                <Button variant="ghost" size="icon">
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
