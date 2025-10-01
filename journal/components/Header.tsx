import React from 'react';
import { GhostIcon } from './icons';

export const Header: React.FC = () => {
  return (
    <header className="flex items-center gap-4 pb-4 border-b-2 border-cyan-800/50">
      <GhostIcon className="w-12 h-12 text-cyan-400" />
      <div>
        <h1 className="text-3xl font-bold text-cyan-200 tracking-widest">
          PhasmaPhoney
        </h1>
        <p className="text-cyan-500 text-sm">Digital Ghost-Hunting Journal</p>
      </div>
    </header>
  );
};