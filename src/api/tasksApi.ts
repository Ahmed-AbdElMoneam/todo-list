import axios from "axios";
import type { ITask } from "../types/task";

export const API_URL = "http://localhost:4000/tasks";

export const getTasks = async () => (await axios.get(API_URL)).data;
export const createTask = async (task: ITask) =>
  (await axios.post(API_URL, task)).data;
export const updateTask = async (id: number, task: ITask) =>
  (await axios.patch(`${API_URL}/${id}`, task)).data;
export const deleteTask = async (id: number) =>
  (await axios.delete(`${API_URL}/${id}`)).data;
