/**
 * Redux Hooks
 * 
 * Type-safe hooks for Redux usage
 */

import { useDispatch, useSelector } from 'react-redux';
import type { RootState, AppDispatch } from '../../store';

/**
 * Typed useDispatch hook
 * @returns AppDispatch type
 */
export const useAppDispatch = () => useDispatch<AppDispatch>();

/**
 * Typed useSelector hook
 */
export const useAppSelector = useSelector.withTypes<RootState>();
