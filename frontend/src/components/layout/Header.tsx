import React from 'react';

export function Header() {
  return (
    <header className="border-b bg-white/80 backdrop-blur">
      <div className="mx-auto max-w-6xl px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-md bg-gray-900 text-white flex items-center justify-center font-bold">T</div>
          <span className="text-2xl font-mono font-semibold">Momentary</span>
        </div>
        <nav className="hidden sm:flex gap-6 text-sm text-gray-600">
          <span className="cursor-default font-mono">No login. Temporary file share.</span>
        </nav>
      </div>
    </header>
  );
}

