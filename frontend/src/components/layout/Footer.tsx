import React from 'react';

export function Footer() {
  return (
    <footer className="border-t bg-white">
      <div className="mx-auto max-w-6xl px-6 py-4 text-xs text-gray-500 flex items-center justify-between">
        <span>TempShare</span>
        <span>© {new Date().getFullYear()}</span>
      </div>
    </footer>
  );
}





