import { Task } from "@/types/Task";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Edit, Trash2, Clock, CheckCircle, AlertCircle } from "lucide-react";

interface TaskCardProps {
  task: Task;
  onEdit: (task: Task) => void;
  onDelete: (id: string) => void;
}

export const TaskCard = ({ task, onEdit, onDelete }: TaskCardProps) => {
  const statusIcons = {
    pending: <Clock className="h-4 w-4" />,
    'in-progress': <AlertCircle className="h-4 w-4" />,
    completed: <CheckCircle className="h-4 w-4" />
  };

  const statusColors = {
    pending: "secondary",
    'in-progress': "warning",
    completed: "success"
  } as const;

  const priorityColors = {
    low: "secondary",
    medium: "warning", 
    high: "destructive"
  } as const;

  return (
    <Card className="hover:shadow-lg transition-shadow duration-200">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <CardTitle className="text-lg font-semibold">{task.title}</CardTitle>
          <div className="flex gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onEdit(task)}
              className="h-8 w-8 p-0"
            >
              <Edit className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onDelete(task.id)}
              className="h-8 w-8 p-0 text-destructive hover:text-destructive"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground mb-4">{task.description}</p>
        
        <div className="flex flex-wrap gap-2 mb-3">
          <Badge variant={statusColors[task.status]} className="flex items-center gap-1">
            {statusIcons[task.status]}
            {task.status.replace('-', ' ')}
          </Badge>
          <Badge variant={priorityColors[task.priority]}>
            {task.priority} priority
          </Badge>
        </div>
        
        <div className="text-xs text-muted-foreground">
          <p>Created: {task.createdAt.toLocaleDateString()}</p>
          <p>Updated: {task.updatedAt.toLocaleDateString()}</p>
        </div>
      </CardContent>
    </Card>
  );
};