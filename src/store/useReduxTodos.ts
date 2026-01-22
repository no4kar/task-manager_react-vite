import { useReduxSelector } from "./hooks";
import { selectFromStore } from "./store";

export function useReduxTodos() {
    return useReduxSelector(selectFromStore("todos"));
}