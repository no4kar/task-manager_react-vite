import { useReduxSelector } from "./useRedux";
import { selectFromStore } from "../store/store";

export function useReduxTodos() {
    return useReduxSelector(selectFromStore("todos"));
}