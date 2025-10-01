
import React, { useState, useEffect } from 'react';
import { BrainIcon, CheckCircleIcon, LightbulbIcon, ShieldExclamationIcon, XCircleIcon } from './icons.js';

export const GhostList = ({ ghosts, selectedEvidence }) => {
  const [activeGhost, setActiveGhost] = useState(null);

  useEffect(() => {
    if (ghosts.length === 1) {
      setActiveGhost(ghosts[0]);
    } else {
      // If the currently active ghost is no longer in the filtered list, deselect it.
      if (activeGhost && !ghosts.some(g => g.name === activeGhost.name)) {
        setActiveGhost(null);
      }
    }
  }, [ghosts]);

  const renderGhostItem = (ghost) => {
    const isEliminated = selectedEvidence.size > 0 && !ghost.evidence.some(e => selectedEvidence.has(e)) && !ghosts.includes(ghost);

    return React.createElement('li', {
        key: ghost.name,
        onClick: () => setActiveGhost(ghost),
        className: `px-4 py-3 rounded-md cursor-pointer transition-all duration-200 flex justify-between items-center ${
          activeGhost?.name === ghost.name
            ? 'bg-cyan-600/30 border-cyan-500'
            : 'bg-gray-800/40 border-transparent hover:bg-cyan-900/30'
        } ${isEliminated ? 'opacity-30' : ''}`
      },
      React.createElement('span', { className: "font-semibold tracking-wider" }, ghost.name),
      React.createElement('div', { className: "flex items-center gap-2" },
        ghost.evidence.map(ev => (
          selectedEvidence.has(ev) 
            ? React.createElement(CheckCircleIcon, { key: ev, className: "w-5 h-5 text-green-400" })
            : React.createElement('div', { key: ev, className: "w-2 h-2 rounded-full bg-cyan-700" })
        ))
      )
    );
  };

  return React.createElement('div', { className: "grid grid-cols-1 md:grid-cols-2 gap-6 h-full" },
    React.createElement('div', { className: "flex flex-col" },
      React.createElement('div', { className: "flex justify-between items-baseline mb-2" },
        React.createElement('p', { className: "text-sm text-cyan-400" }, `${ghosts.length} possible entities found`),
        selectedEvidence.size > 0 && ghosts.length > 1 && React.createElement('p', { className: "text-sm text-yellow-400" }, `Evidence missing: ${3 - selectedEvidence.size}`)
      ),
      React.createElement('ul', { className: "space-y-2 overflow-y-auto pr-2", style: { maxHeight: 'calc(100vh - 300px)' } },
        ghosts.length > 0 ? (
          ghosts.map(renderGhostItem)
        ) : (
          React.createElement('div', { className: "text-center py-10 px-4 bg-gray-800/40 rounded-lg" },
            React.createElement(XCircleIcon, { className: "w-12 h-12 mx-auto text-red-500/70" }),
            React.createElement('p', { className: "mt-4 text-lg text-red-400" }, "No Matching Ghost"),
            React.createElement('p', { className: "text-sm text-cyan-500" }, "The selected evidence does not match any known entity. Re-evaluate your findings.")
          )
        )
      )
    ),
    React.createElement('div', { className: "bg-gray-900/50 rounded-lg p-4 border border-cyan-800/40 flex flex-col" },
      activeGhost ? (
        React.createElement(React.Fragment, null,
            React.createElement('h3', { className: "text-2xl font-bold text-cyan-200 mb-2" }, activeGhost.name),
            React.createElement('p', { className: "text-cyan-400 text-sm mb-4 italic" }, activeGhost.description),
            React.createElement('div', { className: "mb-4" },
              React.createElement('h4', { className: "font-semibold text-cyan-300 mb-2 border-b border-cyan-800/50 pb-1" }, "Required Evidence:"),
              React.createElement('ul', { className: "space-y-1 text-sm" },
                activeGhost.evidence.map(ev => React.createElement('li', { key: ev, className: `flex items-center gap-2 ${selectedEvidence.has(ev) ? 'text-green-400' : 'text-cyan-500'}` },
                  selectedEvidence.has(ev) ? React.createElement(CheckCircleIcon, { className: "w-4 h-4" }) : React.createElement('div', { className: "w-1.5 h-1.5 rounded-full bg-cyan-700" }),
                  ev
                ))
              )
            ),
            React.createElement('div', { className: "space-y-3 text-sm" },
              React.createElement('div', { className: "flex items-start gap-3" },
                React.createElement(ShieldExclamationIcon, { className: "w-5 h-5 text-red-400 mt-0.5 flex-shrink-0" }),
                React.createElement('div', null,
                  React.createElement('h4', { className: "font-semibold text-red-400" }, "Strength"),
                  React.createElement('p', { className: "text-cyan-400" }, activeGhost.strength)
                )
              ),
              React.createElement('div', { className: "flex items-start gap-3" },
                React.createElement(LightbulbIcon, { className: "w-5 h-5 text-yellow-400 mt-0.5 flex-shrink-0" }),
                React.createElement('div', null,
                  React.createElement('h4', { className: "font-semibold text-yellow-400" }, "Weakness"),
                  React.createElement('p', { className: "text-cyan-400" }, activeGhost.weakness)
                )
              )
          )
        )
      ) : (
        React.createElement('div', { className: "flex flex-col items-center justify-center text-center h-full text-cyan-600" },
          React.createElement(BrainIcon, { className: "w-16 h-16 opacity-30" }),
          React.createElement('p', { className: "mt-4 font-semibold" }, "Select a ghost to view details"),
          React.createElement('p', { className: "text-sm opacity-70" },
            ghosts.length === 0 ? "No entity matches current evidence." : "Or narrow down the list to one."
          )
        )
      )
    )
  );
};
