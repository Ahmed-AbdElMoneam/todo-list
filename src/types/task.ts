export interface ITask {
  id: number;
  title: string;
  description: string;
  column: "backlog" | "in-progress" | "review" | "done";
}
