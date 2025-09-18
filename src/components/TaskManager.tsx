import { useState, useMemo } from "react";
import { Task, TaskFormData } from "@/types/Task";
import { TaskCard } from "@/components/TaskCard";
import { TaskForm } from "@/components/TaskForm";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Search } from "lucide-react";
import { toast } from "@/hooks/use-toast";

// Mock data for demonstration - in a real app, this would come from a database
const initialTasks: Task[] = [
  {
    id: "1",
    title: "Setup Project",
    description: "Initialize the new React project with TypeScript and Tailwind CSS",
    status: "completed",
    priority: "high",
    createdAt: new Date("2024-01-15"),
    updatedAt: new Date("2024-01-16")
  },
  {
    id: "2", 
    title: "Design Database Schema",
    description: "Create the database structure for user management and task tracking",
    status: "in-progress",
    priority: "medium",
    createdAt: new Date("2024-01-16"),
    updatedAt: new Date("2024-01-17")
  },
  {
    id: "3",
    title: "Implement Authentication",
    description: "Add user login and registration functionality",
    status: "pending",
    priority: "high",
    createdAt: new Date("2024-01-17"),
    updatedAt: new Date("2024-01-17")
  }
];

export const TaskManager = () => {
  // State management
  const [tasks, setTasks] = useState<Task[]>(initialTasks);
  const [showForm, setShowForm] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [priorityFilter, setPriorityFilter] = useState<string>("all");

  /**
   * CREATE - Add a new task
   */
  const createTask = (data: TaskFormData) => {
    const newTask: Task = {
      id: Date.now().toString(), // In real app, use proper UUID
      ...data,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    setTasks(prev => [newTask, ...prev]);
    setShowForm(false);
    
    toast({
      title: "Task Created",
      description: `"${data.title}" has been added successfully.`,
    });
  };

  /**
   * UPDATE - Edit an existing task  
   */
  const updateTask = (data: TaskFormData) => {
    if (!editingTask) return;

    setTasks(prev => prev.map(task => 
      task.id === editingTask.id 
        ? { ...task, ...data, updatedAt: new Date() }
        : task
    ));

    setEditingTask(null);
    setShowForm(false);
    
    toast({
      title: "Task Updated",
      description: `"${data.title}" has been updated successfully.`,
    });
  };

  /**
   * DELETE - Remove a task
   */
  const deleteTask = (id: string) => {
    const taskToDelete = tasks.find(task => task.id === id);
    
    if (!taskToDelete) return;
    
    // In a real app, you'd show a confirmation dialog
    if (!confirm(`Are you sure you want to delete "${taskToDelete.title}"?`)) {
      return;
    }

    setTasks(prev => prev.filter(task => task.id !== id));
    
    toast({
      title: "Task Deleted",
      description: `"${taskToDelete.title}" has been deleted.`,
      variant: "destructive"
    });
  };

  /**
   * FILTER & SEARCH - Filter tasks based on search and filters
   */
  const filteredTasks = useMemo(() => {
    return tasks.filter(task => {
      // Search filter
      const matchesSearch = task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          task.description.toLowerCase().includes(searchTerm.toLowerCase());
      
      // Status filter
      const matchesStatus = statusFilter === "all" || task.status === statusFilter;
      
      // Priority filter  
      const matchesPriority = priorityFilter === "all" || task.priority === priorityFilter;
      
      return matchesSearch && matchesStatus && matchesPriority;
    });
  }, [tasks, searchTerm, statusFilter, priorityFilter]);

  // Form handlers
  const handleFormSubmit = (data: TaskFormData) => {
    if (editingTask) {
      updateTask(data);
    } else {
      createTask(data);
    }
  };

  const handleEdit = (task: Task) => {
    setEditingTask(task);
    setShowForm(true);
  };

  const handleCancelForm = () => {
    setShowForm(false);
    setEditingTask(null);
  };

  return (
    <div className="container mx-auto p-6 max-w-6xl">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Task Manager</h1>
        <p className="text-muted-foreground">
          Complete CRUD operations demo - Create, Read, Update, and Delete tasks
        </p>
      </div>

      {/* Action Bar */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <Button 
          onClick={() => setShowForm(true)} 
          className="flex items-center gap-2"
        >
          <Plus className="h-4 w-4" />
          Add New Task
        </Button>
        
        {/* Search */}
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search tasks..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9"
          />
        </div>

        {/* Filters */}
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[140px]">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="in-progress">In Progress</SelectItem>
            <SelectItem value="completed">Completed</SelectItem>
          </SelectContent>
        </Select>

        <Select value={priorityFilter} onValueChange={setPriorityFilter}>
          <SelectTrigger className="w-[140px]">
            <SelectValue placeholder="Priority" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Priority</SelectItem>
            <SelectItem value="low">Low</SelectItem>
            <SelectItem value="medium">Medium</SelectItem>
            <SelectItem value="high">High</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-6">
        <div className="bg-card p-4 rounded-lg border">
          <h3 className="text-sm font-medium text-muted-foreground">Total Tasks</h3>
          <p className="text-2xl font-bold">{tasks.length}</p>
        </div>
        <div className="bg-card p-4 rounded-lg border">
          <h3 className="text-sm font-medium text-muted-foreground">Pending</h3>
          <p className="text-2xl font-bold text-warning">{tasks.filter(t => t.status === 'pending').length}</p>
        </div>
        <div className="bg-card p-4 rounded-lg border">
          <h3 className="text-sm font-medium text-muted-foreground">In Progress</h3>
          <p className="text-2xl font-bold text-primary">{tasks.filter(t => t.status === 'in-progress').length}</p>
        </div>
        <div className="bg-card p-4 rounded-lg border">
          <h3 className="text-sm font-medium text-muted-foreground">Completed</h3>
          <p className="text-2xl font-bold text-success">{tasks.filter(t => t.status === 'completed').length}</p>
        </div>
      </div>

      {/* Form Modal/Section */}
      {showForm && (
        <div className="mb-8">
          <TaskForm
            task={editingTask || undefined}
            onSubmit={handleFormSubmit}
            onCancel={handleCancelForm}
          />
        </div>
      )}

      {/* Tasks Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTasks.length > 0 ? (
          filteredTasks.map(task => (
            <TaskCard
              key={task.id}
              task={task}
              onEdit={handleEdit}
              onDelete={deleteTask}
            />
          ))
        ) : (
          <div className="col-span-full text-center py-12">
            <p className="text-muted-foreground text-lg">
              {searchTerm || statusFilter !== "all" || priorityFilter !== "all" 
                ? "No tasks match your filters" 
                : "No tasks yet. Create your first task!"
              }
            </p>
          </div>
        )}
      </div>

      {/* Help Section */}
      <div className="mt-12 p-6 bg-card rounded-lg border">
        <h2 className="text-xl font-semibold mb-3">CRUD Operations Demo</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
          <div>
            <h3 className="font-medium text-success mb-1">✅ CREATE</h3>
            <p className="text-muted-foreground">Click "Add New Task" to create tasks</p>
          </div>
          <div>
            <h3 className="font-medium text-primary mb-1">👁️ READ</h3>
            <p className="text-muted-foreground">View all tasks, search & filter</p>
          </div>
          <div>
            <h3 className="font-medium text-warning mb-1">✏️ UPDATE</h3>
            <p className="text-muted-foreground">Click edit icon to modify tasks</p>
          </div>
          <div>
            <h3 className="font-medium text-destructive mb-1">🗑️ DELETE</h3>
            <p className="text-muted-foreground">Click trash icon to remove tasks</p>
          </div>
        </div>
      </div>
    </div>
  );
};