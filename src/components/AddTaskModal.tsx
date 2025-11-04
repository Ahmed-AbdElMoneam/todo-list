import React, { useState } from "react";
// import { createTask } from "../api/tasksApi";
// import { createTask } from "../api/tasksApi";
import { useTasks } from "../hooks/useTasks";

interface Props {
  show: boolean;
  onClose: () => void;
}

export default function AddTaskModal({ show, onClose }: Props) {
  const { createMutation } = useTasks();
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [column, setColumn] = useState("backlog");

  if (!show) return null;

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      alert("Title required");
      return;
    }
    createMutation.mutate({
      title: title.trim(),
      description: desc.trim(),
      column,
    });
    setTitle("");
    setDesc("");
    setColumn("backlog");
    onClose();
  };

  return (
    <div className="modal-backdrop">
      <div className="modal-dialog" role="document">
        <div className="modal-content p-3">
          <div className="modal-header">
            <h5 className="modal-title">Add Task</h5>
            <button className="btn-close" onClick={onClose}></button>
          </div>
          <form onSubmit={submit}>
            <div className="mb-2">
              <input
                className="form-control"
                placeholder="Title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>
            <div className="mb-2">
              <textarea
                className="form-control"
                placeholder="Description"
                value={desc}
                onChange={(e) => setDesc(e.target.value)}
              />
            </div>
            <div className="mb-3">
              <select
                className="form-select"
                value={column}
                onChange={(e) => setColumn(e.target.value)}
              >
                <option value="backlog">Backlog</option>
                <option value="in-progress">In Progress</option>
                <option value="review">Review</option>
                <option value="done">Done</option>
              </select>
            </div>
            <div className="d-flex justify-content-end gap-2">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={onClose}
              >
                Cancel
              </button>
              <button type="submit" className="btn btn-primary">
                Add
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
