import React from "react";
import { useDraggable, useDroppable } from "@dnd-kit/core";
import { useTasks } from "../hooks/useTasks";

interface Props {
  task: { id: number; title: string; description: string; column: string };
}

export default function TaskCard({ task }: Props) {
  const { deleteMutation, updateMutation } = useTasks();

  // Make draggable
  const { attributes, listeners, setNodeRef, transform, isDragging } =
    useDraggable({
      id: `task-${task.id}`,
      data: { taskId: task.id, fromColumn: task.column },
    });

  // Also make each card droppable so dropping onto a card resolves to that card's container
  useDroppable({ id: `task-${task.id}` });

  const style: React.CSSProperties = {
    transform: transform
      ? `translate(${transform.x}px, ${transform.y}px)`
      : undefined,
    zIndex: isDragging ? 999 : undefined,
    cursor: "grab",
  };

  return (
    <div
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      style={style}
      className={`card task-card ${isDragging ? "dragging" : ""}`}
    >
      <div className="card-body p-2">
        <div className="d-flex justify-content-between align-items-start">
          <div>
            <h6 className="card-title mb-1">{task.title}</h6>
            <p className="card-text small text-muted mb-0">
              {task.description}
            </p>
          </div>
          <div className="ms-2 text-end">
            <button
              className="btn btn-sm btn-outline-secondary me-1"
              onClick={() => {
                const newTitle = prompt("Edit title", task.title);
                if (newTitle !== null)
                  updateMutation.mutate({
                    id: task.id,
                    data: { title: newTitle },
                  });
              }}
            >
              Edit
            </button>
            <button
              className="btn btn-sm btn-danger"
              onClick={() => {
                if (confirm("Delete task?")) deleteMutation.mutate(task.id);
              }}
            >
              Del
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
