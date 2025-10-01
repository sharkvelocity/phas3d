import React from 'react';
import { EMF5Icon, FingerprintsIcon, DotsIcon, FreezingIcon, GhostOrbIcon, GhostWritingIcon, SpiritBoxIcon } from './icons.js';

const evidenceIconMap = {
  'EMF Level 5': EMF5Icon,
  'Spirit Box': SpiritBoxIcon,
  'Ultraviolet': FingerprintsIcon,
  'Ghost Orbs': GhostOrbIcon,
  'Ghost Writing': GhostWritingIcon,
  'Freezing': FreezingIcon,
  'DOTS Projector': DotsIcon,
};


export const EvidenceSelector = ({ allEvidence, selectedEvidence, impossibleEvidence, onToggle }) => {
  return React.createElement('div', { className: "grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-2 gap-3" },
    allEvidence.map(evidence => {
      const isSelected = selectedEvidence.has(evidence);
      const isImpossible = impossibleEvidence.has(evidence);
      const Icon = evidenceIconMap[evidence] || (() => React.createElement('span', null, '?'));

      let buttonClasses = "p-3 flex flex-col items-center justify-center gap-2 text-center rounded-lg border transition-all duration-200 cursor-pointer ";
      if (isSelected) {
        buttonClasses += "bg-cyan-500/20 border-cyan-400 text-cyan-200 shadow-lg shadow-cyan-500/20";
      } else if (isImpossible) {
        buttonClasses += "bg-gray-800/50 border-gray-700 text-gray-500 opacity-60 cursor-not-allowed line-through";
      } else {
          buttonClasses += "bg-gray-800/30 border-cyan-800/70 hover:bg-cyan-900/40 hover:border-cyan-700 text-cyan-400";
      }

      return React.createElement('button', {
          key: evidence,
          onClick: () => !isImpossible && onToggle(evidence),
          disabled: isImpossible,
          className: buttonClasses
        },
        React.createElement(Icon, { className: "w-8 h-8" }),
        React.createElement('span', { className: "text-xs font-semibold tracking-wide" }, evidence)
      );
    })
  );
};
