import { useReduxSelector } from "./useRedux";
import { selectFromStore } from "../store/store";

export function useReduxTasks() {
    return useReduxSelector(selectFromStore("tasks"));
}