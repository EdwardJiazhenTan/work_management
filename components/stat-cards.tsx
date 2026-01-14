import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ProjectStats } from "@/lib/types";
import { CheckCircle2, Circle, Clock, FolderKanban } from "lucide-react";

interface StatCardsProps {
  stats: ProjectStats;
}

export function StatCards({ stats }: StatCardsProps) {
  const cards = [
    {
      title: "总任务数",
      value: stats.total,
      icon: FolderKanban,
    },
    {
      title: "已完成",
      value: stats.completed,
      icon: CheckCircle2,
    },
    {
      title: "进行中",
      value: stats.inProgress,
      icon: Clock,
    },
    {
      title: "待处理",
      value: stats.pending,
      icon: Circle,
    },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {cards.map((card) => {
        const Icon = card.icon;
        return (
          <Card key={card.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {card.title}
              </CardTitle>
              <Icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{card.value}</div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
