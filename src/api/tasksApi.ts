import axios from "axios";
import type { ITask } from "../types/task";

export const API_URL = "http://localhost:4000/tasks";

export const getTasks = async (): Promise<ITask[]> =>
  (await axios.get(API_URL)).data;

// When creating a task the `id` is provided by the server so callers pass the task without an `id`.
export const createTask = async (task: Omit<ITask, "id">) =>
  (await axios.post(API_URL, task)).data;

// Updates are partial: callers may only send the fields they want to change.
export const updateTask = async (id: number, task: Partial<ITask>) =>
  (await axios.patch(`${API_URL}/${id}`, task)).data;

export const deleteTask = async (id: number) =>
  (await axios.delete(`${API_URL}/${id}`)).data;
