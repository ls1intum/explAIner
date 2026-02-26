"use client";

import { Provider } from 'react-redux';
import { store } from '@/store/store';

/* Redux Provider - provides the Redux store to all child components (used in src/app/layout.tsx) */
export default function ReduxProvider({ children }: { children: React.ReactNode }) {
  return (
    <Provider store={store}>
      {children}
    </Provider>
  );
}
