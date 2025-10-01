import React from 'react';
import { GhostIcon } from './icons.js';

export const Header = () => {
  return React.createElement(
    'header',
    { className: "flex items-center gap-4 pb-4 border-b-2 border-cyan-800/50" },
    React.createElement(GhostIcon, { className: "w-12 h-12 text-cyan-400" }),
    React.createElement(
      'div',
      null,
      React.createElement(
        'h1',
        { className: "text-3xl font-bold text-cyan-200 tracking-widest" },
        'PhasmaPhoney'
      ),
      React.createElement(
        'p',
        { className: "text-cyan-500 text-sm" },
        'Digital Ghost-Hunting Journal'
      )
    )
  );
};
