import React from "react";
// import TaskCard from "./TaskCard";
import TaskCard from "./TaskCard";
import { useDroppable } from "@dnd-kit/core";
import { useTasks } from "../hooks/useTasks";

interface ColumnProps {
  columnId: string;
  title: string;
  tasks: any[];
  showLoadMore?: boolean;
  onLoadMore?: () => void;
}

export default function Column({
  columnId,
  title,
  tasks,
  showLoadMore,
  onLoadMore,
}: ColumnProps) {
  // const { deleteMutation } = useTasks();
  const { setNodeRef, isOver } = useDroppable({ id: columnId });
  return (
    <div
      ref={setNodeRef}
      className={`card h-100 ${isOver ? "border-primary shadow-sm" : ""}`}
    >
      <div className="card-body d-flex flex-column" style={{ minHeight: 200 }}>
        <div className="d-flex justify-content-between align-items-center mb-2">
          <h5 className="card-title mb-0">{title}</h5>
          <span className="badge bg-secondary">{tasks.length}</span>
        </div>

        <div className="flex-grow-1 overflow-auto">
          {tasks.length === 0 ? (
            <div className="text-muted">No tasks</div>
          ) : null}
          <div className="mt-2 d-flex flex-column gap-2">
            {tasks.map((task, idx) => (
              <TaskCard key={task.id} task={task} />
            ))}
          </div>
        </div>

        {showLoadMore && onLoadMore ? (
          <div className="mt-3">
            <button
              className="btn btn-sm btn-outline-primary w-100"
              onClick={onLoadMore}
            >
              Load more
            </button>
          </div>
        ) : null}
      </div>
    </div>
  );
}
