# 工作台账管理系统

基于 Next.js 14 和 shadcn/ui 构建的现代化项目管理系统。

## 快速开始

### 安装依赖

```bash
npm install
```

### 开发模式

```bash
npm run dev
```

访问 http://localhost:3000

### 构建生产版本

```bash
npm run build
npm start
```
## Mock 后端架构

### 数据模型

```
Project (项目)
├── id: string
├── name: string
├── description: string
├── status: "待处理" | "进行中" | "已完成"
├── priority: "高" | "中" | "低"
├── createdAt: Date
├── updatedAt: Date
├── dueDate?: Date
├── files?: ProjectFile[]
└── milestones?: Milestone[]

ProjectFile (项目文件)
├── id: string
├── projectId: string
├── fileName: string
├── fileSize: number
├── fileType: string
├── uploadedAt: Date
└── url: string

Milestone (里程碑)
├── id: string
├── projectId: string
├── title: string
├── description: string
├── status: "未开始" | "进行中" | "已完成"
├── dueDate?: Date
├── completedDate?: Date
└── order: number
```

### API 端点

```
GET  /api/projects              # 获取所有项目和统计数据
POST /api/projects              # 创建新项目

GET  /api/projects/[id]/files       # 获取项目文件列表
POST /api/projects/[id]/files       # 上传项目文件

GET  /api/projects/[id]/milestones  # 获取项目里程碑
POST /api/projects/[id]/milestones  # 创建里程碑

PATCH /api/milestones/[id]          # 更新里程碑
DELETE /api/milestones/[id]         # 删除里程碑
```

### 数据存储

- 所有数据存储在内存中 (`lib/mock-data.ts`)
- 使用导出的数组模拟数据库表
- 刷新页面后数据重置为初始状态
- 生产环境需替换为真实数据库（Prisma + PostgreSQL/MySQL）


### 迁移到真实数据库

1. 安装 Prisma: `npm install prisma @prisma/client`
2. 初始化: `npx prisma init`
3. 在 `prisma/schema.prisma` 定义数据模型
4. 运行迁移: `npx prisma migrate dev`
5. 替换 `lib/mock-data.ts` 中的数据访问逻辑

## 许可证

MIT
