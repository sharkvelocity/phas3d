import React, { useState, useMemo, useEffect } from 'react';
import { EvidenceSelector } from './components/EvidenceSelector.js';
import { GhostList } from './components/GhostList.js';
import { Header } from './components/Header.js';
import { ResetIcon } from './components/icons.js';

// Data is loaded into the global scope by bootstrap.js
const GHOST_DATA_MAP = (window.PP?.GHOST_DATA || {});
const GHOST_DATA = Object.values(GHOST_DATA_MAP).map(g => ({
  name: g.name,
  evidence: g.evidence,
  description: g.notes || "No detailed description available.", // Use notes as description
  strength: g.notes || "No specific strength listed.",
  weakness: g.notes || "No specific weakness listed.",
}));

const ALL_EVIDENCE = (window.PP?.ALL_EVIDENCE || []);

const App = () => {
  const [selectedEvidence, setSelectedEvidence] = useState(new Set());

  const handleEvidenceToggle = (evidence) => {
    setSelectedEvidence(prev => {
      const newSet = new Set(prev);
      if (newSet.has(evidence)) {
        newSet.delete(evidence);
      } else {
        if (newSet.size < 3) {
          newSet.add(evidence);
        }
      }
      return newSet;
    });
  };

  const handleReset = () => {
    setSelectedEvidence(new Set());
  };
  
  const handleCloseJournal = () => {
    if (window.closeNotebook) {
      window.closeNotebook();
    }
  };


  const filteredGhosts = useMemo(() => {
    if (selectedEvidence.size === 0) {
      return GHOST_DATA;
    }
    return GHOST_DATA.filter(ghost => {
      for (const evidence of selectedEvidence) {
        if (!ghost.evidence.includes(evidence)) {
          return false;
        }
      }
      return true;
    });
  }, [selectedEvidence]);
  
  const impossibleEvidence = useMemo(() => {
        if (selectedEvidence.size === 0) {
            return new Set();
        }

        const possibleFutureEvidence = new Set();
        filteredGhosts.forEach(ghost => {
            ghost.evidence.forEach(ev => {
                if (!selectedEvidence.has(ev)) {
                    possibleFutureEvidence.add(ev);
                }
            });
        });

        const impossible = new Set();
        ALL_EVIDENCE.forEach(ev => {
            if (!selectedEvidence.has(ev) && !possibleFutureEvidence.has(ev)) {
                impossible.add(ev);
            }
        });

        return impossible;
  }, [filteredGhosts, selectedEvidence]);


  return React.createElement('div', {
        className: "min-h-screen bg-gray-900 text-cyan-300 p-4 sm:p-6 lg:p-8",
        style: {
            backgroundImage: 'radial-gradient(rgba(0, 100, 120, 0.1) 1px, transparent 1px)',
            backgroundSize: '15px 15px'
        }
    },
    React.createElement('div', { className: "max-w-7xl mx-auto relative" },
      React.createElement('button', {
            onClick: handleCloseJournal,
            className: "absolute top-4 right-4 sm:right-6 lg:right-8 text-cyan-400 hover:text-white transition-colors z-20 p-2 rounded-full bg-black/30 hover:bg-red-500/50",
            title: "Close Journal (N)",
            "aria-label": "Close Journal"
        },
        React.createElement('svg', { xmlns: "http://www.w3.org/2000/svg", className: "h-6 w-6", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor", strokeWidth: 2 },
          React.createElement('path', { strokeLinecap: "round", strokeLinejoin: "round", d: "M6 18L18 6M6 6l12 12" })
        )
      ),
      React.createElement(Header, null),
      React.createElement('main', { className: "mt-6 grid grid-cols-1 lg:grid-cols-3 gap-6" },
        React.createElement('div', { className: "lg:col-span-1 bg-black/30 border border-cyan-800/50 rounded-lg p-4 shadow-lg shadow-cyan-900/10" },
          React.createElement('div', { className: "flex justify-between items-center mb-4" },
            React.createElement('h2', { className: "text-xl font-bold text-cyan-200 tracking-wider" }, "EVIDENCE LOG"),
            React.createElement('button', {
                onClick: handleReset,
                className: "flex items-center gap-2 px-3 py-1.5 text-sm bg-cyan-900/50 hover:bg-cyan-800/70 border border-cyan-700 rounded-md transition-colors duration-200",
                title: "Reset Evidence"
              },
              React.createElement(ResetIcon, { className: "w-4 h-4" }),
              "Reset"
            )
          ),
          React.createElement(EvidenceSelector, {
            allEvidence: ALL_EVIDENCE,
            selectedEvidence: selectedEvidence,
            impossibleEvidence: impossibleEvidence,
            onToggle: handleEvidenceToggle
          })
        ),
        React.createElement('div', { className: "lg:col-span-2 bg-black/30 border border-cyan-800/50 rounded-lg p-4 shadow-lg shadow-cyan-900/10" },
          React.createElement('h2', { className: "text-xl font-bold text-cyan-200 tracking-wider mb-4" }, "ENTITY IDENTIFICATION"),
          React.createElement(GhostList, { ghosts: filteredGhosts, selectedEvidence: selectedEvidence })
        )
      )
    )
  );
};

export default App;
