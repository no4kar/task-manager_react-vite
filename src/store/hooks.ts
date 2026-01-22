import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
import type { AppDispatch, RootState } from './store';

// Use these hooks everywhere instead of useDispatch and useSelector
export const useReduxDispatch
    = () => useDispatch<AppDispatch>();
export const useReduxSelector
    : TypedUseSelectorHook<RootState>
    = useSelector;
