// src/components/AppLayout.tsx
import { ReactNode } from 'react';
import { AppSidebar } from './app-sidebar';
import { ModeToggle } from './mode-toggle';

export default function AppLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
      <AppSidebar />

      <div className="flex flex-col flex-1">
        <header className="flex items-center justify-between px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100">
            {/* You could inject current page title via context or prop */}
          </h2>
          <ModeToggle />
        </header>

        <main className="p-6 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
