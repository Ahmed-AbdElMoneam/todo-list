import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createTask, deleteTask, getTasks, updateTask } from "../api/tasksApi";
import type { ITask } from "../types/task";

export const useTasks = () => {
  const queryClient = useQueryClient();

  const tasksQuery = useQuery({
    queryKey: ["tasks"],
    queryFn: getTasks,
    staleTime: 1000 * 60 * 2,
  });

  const createMutation = useMutation({
    mutationFn: createTask,
    onSuccess: () => queryClient.invalidateQueries(["tasks"]),
  });
  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: ITask }) =>
      updateTask(id, data),
    onSuccess: () => queryClient.invalidateQueries(["tasks"]),
  });
  const deleteMutation = useMutation({
    mutationFn: deleteTask,
    onSuccess: () => queryClient.invalidateQueries(["tasks"]),
  });

  return { tasksQuery, createMutation, updateMutation, deleteMutation };
};
