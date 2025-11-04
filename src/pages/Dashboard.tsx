import { useState } from "react";
import { useTasks } from "../hooks/useTasks";
import Column from "../components/Column";
import AddTaskModal from "../components/AddTaskModal";
import { useTaskStore } from "../store/useTaskStore";
import { DndContext, type DragEndEvent } from "@dnd-kit/core";
import type { ITask } from "../types/task";

const COLUMNS = [
  { id: "backlog", title: "Backlog" },
  { id: "in-progress", title: "In Progress" },
  { id: "review", title: "Review" },
  { id: "done", title: "Done" },
];

export default function Dashboard() {
  const { tasksQuery, updateMutation } = useTasks();
  const [showAdd, setShowAdd] = useState(false);
  const search = useTaskStore((s) => s.search);
  const [pageSize] = useState(5); // per-column page size
  const [pages, setPages] = useState<Record<string, number>>({
    backlog: 1,
    "in-progress": 1,
    review: 1,
    done: 1,
  });

  if (tasksQuery.isLoading) return <div>Loading...</div>;
  const tasks: ITask[] = tasksQuery.data || [];

  const tasksByColumn = () => {
    const q = search.trim().toLowerCase();
    const filtered = !q
      ? tasks
      : tasks.filter(
          (t) =>
            t.title.toLowerCase().includes(q) ||
            t.description.toLowerCase().includes(q)
        );
    const map: Record<string, ITask[]> = {
      backlog: [],
      "in-progress": [],
      review: [],
      done: [],
    };
    filtered.forEach((t) => {
      // Ensure t.column is a string and matches one of the keys
      const col =
        typeof t.column === "string" &&
        Object.prototype.hasOwnProperty.call(map, t.column)
          ? t.column
          : "backlog";
      map[col].push(t);
    });
    return map;
  };

  const handleLoadMore = (colId: string) => {
    setPages((p) => ({ ...p, [colId]: (p[colId] || 1) + 1 }));
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over) return;
    // Accept both string and number for taskId
    const activeData = active.data.current as
      | { taskId: number | string; fromColumn: string }
      | undefined;
    if (!activeData) return;
    const fromColumn = activeData.fromColumn;
    // Always use number for id in updateMutation
    const taskId =
      typeof activeData.taskId === "string"
        ? Number(activeData.taskId)
        : activeData.taskId;

    let destColumn: string | null = null;
    const overId = over.id as string;
    if (!overId) return;

    if (overId.startsWith("task-")) {
      const targetTaskId = Number(overId.replace("task-", ""));
      const target = tasks.find((t) => t.id === targetTaskId);
      destColumn = target ? target.column : null;
    } else {
      destColumn = overId;
    }

    if (typeof taskId !== "number" || !destColumn || destColumn === fromColumn)
      return;

    updateMutation.mutate({ id: taskId, data: { column: destColumn } });
  };

  const columnsMap = tasksByColumn();

  return (
    <>
      <div className="mb-3 d-flex gap-2">
        <button className="btn btn-primary" onClick={() => setShowAdd(true)}>
          Add Task
        </button>
        <div className="flex-grow-1">
          <input
            className="form-control"
            placeholder="Search by title or description..."
            value={search}
            onChange={(e) => useTaskStore.getState().setSearch(e.target.value)}
          />
        </div>
      </div>

      <DndContext onDragEnd={handleDragEnd}>
        <div className="row gx-3">
          {COLUMNS.map((col) => {
            const all = columnsMap[col.id] || [];
            const page = pages[col.id] || 1;
            const visible = all.slice(0, page * pageSize);
            return (
              <div key={col.id} className="col-12 col-md-6 col-lg-3 mb-3">
                <Column
                  columnId={col.id}
                  title={col.title}
                  tasks={visible}
                  showLoadMore={visible.length < all.length}
                  onLoadMore={() => handleLoadMore(col.id)}
                />
              </div>
            );
          })}
        </div>
      </DndContext>

      <AddTaskModal show={showAdd} onClose={() => setShowAdd(false)} />
    </>
  );
}
