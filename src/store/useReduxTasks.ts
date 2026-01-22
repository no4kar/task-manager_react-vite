import { useReduxSelector } from "./hooks";
import { selectFromStore } from "./store";

export function useReduxTasks() {
    return useReduxSelector(selectFromStore("tasks"));
}