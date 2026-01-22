import { useReduxSelector } from "./hooks";
import { selectFromStore } from "./store";

export function useReduxAuthor() {
    return useReduxSelector(selectFromStore("author"));
}