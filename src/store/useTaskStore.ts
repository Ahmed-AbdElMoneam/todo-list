import { create } from "zustand";

type State = {
  search: string;
  setSearch: (v: string) => void;
};

export const useTaskStore = create<State>((set) => ({
  search: "",
  setSearch: (v) => set({ search: v }),
}));
