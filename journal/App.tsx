import React, { useState, useMemo, useEffect } from 'react';
import { Ghost } from './types';
import { EvidenceSelector } from './components/EvidenceSelector';
import { GhostList } from './components/GhostList';
import { Header } from './components/Header';
import { ResetIcon } from './components/icons';

// Data is loaded into the global scope by bootstrap.js
const GHOST_DATA_MAP: { [key: string]: any } = (window.PP?.GHOST_DATA || {});
const GHOST_DATA: Ghost[] = Object.values(GHOST_DATA_MAP).map(g => ({
  name: g.name,
  evidence: g.evidence,
  description: g.notes || "No detailed description available.", // Use notes as description
  strength: g.notes || "No specific strength listed.",
  weakness: g.notes || "No specific weakness listed.",
}));

const ALL_EVIDENCE: string[] = (window.PP?.ALL_EVIDENCE || []);

// Add TypeScript declaration for the global function we'll call
declare global {
  interface Window {
    closeNotebook?: () => void;
  }
}

const App: React.FC = () => {
  const [selectedEvidence, setSelectedEvidence] = useState<Set<string>>(new Set());

  const handleEvidenceToggle = (evidence: string) => {
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


  const filteredGhosts = useMemo<Ghost[]>(() => {
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
  
  const impossibleEvidence = useMemo<Set<string>>(() => {
        if (selectedEvidence.size === 0) {
            return new Set();
        }

        const possibleFutureEvidence = new Set<string>();
        filteredGhosts.forEach(ghost => {
            ghost.evidence.forEach(ev => {
                if (!selectedEvidence.has(ev)) {
                    possibleFutureEvidence.add(ev);
                }
            });
        });

        const impossible = new Set<string>();
        ALL_EVIDENCE.forEach(ev => {
            if (!selectedEvidence.has(ev) && !possibleFutureEvidence.has(ev)) {
                impossible.add(ev);
            }
        });

        return impossible;
  }, [filteredGhosts, selectedEvidence]);


  return (
    <div 
        className="min-h-screen bg-gray-900 text-cyan-300 p-4 sm:p-6 lg:p-8"
        style={{
            backgroundImage: 'radial-gradient(rgba(0, 100, 120, 0.1) 1px, transparent 1px)',
            backgroundSize: '15px 15px'
        }}
    >
      <div className="max-w-7xl mx-auto relative">
        <button
            onClick={handleCloseJournal}
            className="absolute top-4 right-4 sm:right-6 lg:right-8 text-cyan-400 hover:text-white transition-colors z-20 p-2 rounded-full bg-black/30 hover:bg-red-500/50"
            title="Close Journal (N)"
            aria-label="Close Journal"
        >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
        </button>

        <Header />

        <main className="mt-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1 bg-black/30 border border-cyan-800/50 rounded-lg p-4 shadow-lg shadow-cyan-900/10">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-cyan-200 tracking-wider">EVIDENCE LOG</h2>
              <button
                onClick={handleReset}
                className="flex items-center gap-2 px-3 py-1.5 text-sm bg-cyan-900/50 hover:bg-cyan-800/70 border border-cyan-700 rounded-md transition-colors duration-200"
                title="Reset Evidence"
              >
                <ResetIcon className="w-4 h-4" />
                Reset
              </button>
            </div>
            <EvidenceSelector
              allEvidence={ALL_EVIDENCE}
              selectedEvidence={selectedEvidence}
              impossibleEvidence={impossibleEvidence}
              onToggle={handleEvidenceToggle}
            />
          </div>

          <div className="lg:col-span-2 bg-black/30 border border-cyan-800/50 rounded-lg p-4 shadow-lg shadow-cyan-900/10">
            <h2 className="text-xl font-bold text-cyan-200 tracking-wider mb-4">ENTITY IDENTIFICATION</h2>
            <GhostList ghosts={filteredGhosts} selectedEvidence={selectedEvidence} />
          </div>
        </main>
      </div>
    </div>
  );
};

export default App;