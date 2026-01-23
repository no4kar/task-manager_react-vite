import { useReduxSelector } from "./useRedux";
import { selectFromStore } from "../store/store";

export function useReduxAuthor() {
    return useReduxSelector(selectFromStore("author"));
}