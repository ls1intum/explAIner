import { useDispatch, useSelector } from "react-redux";
import type { RootState, AppDispatch } from "./store";

/**
 * Typed redux hooks (enable interaction between UI components and the redux store)
 */

// Used to send an action from the component to the store (typed hook <-> TypeScript knows which actions are valid)
export const useAppDispatch = useDispatch.withTypes<AppDispatch>();

// Used to re-render UI component after state in the store was updated (typed hook <-> TypeScript knows correct state shapes)
export const useAppSelector = useSelector.withTypes<RootState>();
