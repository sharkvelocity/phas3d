
import React, { useState, useEffect } from 'react';
import { Ghost, Evidence } from '../types';
import { BrainIcon, CheckCircleIcon, LightbulbIcon, ShieldExclamationIcon, XCircleIcon } from './icons';

interface GhostListProps {
  ghosts: Ghost[];
  selectedEvidence: Set<Evidence>;
}

export const GhostList: React.FC<GhostListProps> = ({ ghosts, selectedEvidence }) => {
  const [activeGhost, setActiveGhost] = useState<Ghost | null>(null);

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

  const renderGhostItem = (ghost: Ghost) => {
    const isEliminated = selectedEvidence.size > 0 && !ghost.evidence.some(e => selectedEvidence.has(e)) && !ghosts.includes(ghost);

    return (
        <li
          key={ghost.name}
          onClick={() => setActiveGhost(ghost)}
          className={`px-4 py-3 rounded-md cursor-pointer transition-all duration-200 flex justify-between items-center ${
            activeGhost?.name === ghost.name
              ? 'bg-cyan-600/30 border-cyan-500'
              : 'bg-gray-800/40 border-transparent hover:bg-cyan-900/30'
          } ${isEliminated ? 'opacity-30' : ''}`}
        >
          <span className="font-semibold tracking-wider">{ghost.name}</span>
           <div className="flex items-center gap-2">
            {ghost.evidence.map(ev => (
              selectedEvidence.has(ev) 
                ? <CheckCircleIcon key={ev} className="w-5 h-5 text-green-400" />
                : <div key={ev} className="w-2 h-2 rounded-full bg-cyan-700"></div>
            ))}
          </div>
        </li>
    )
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 h-full">
      <div className="flex flex-col">
        <div className="flex justify-between items-baseline mb-2">
            <p className="text-sm text-cyan-400">{ghosts.length} possible entities found</p>
            {selectedEvidence.size > 0 && ghosts.length > 1 && (
                <p className="text-sm text-yellow-400">Evidence missing: {3 - selectedEvidence.size}</p>
            )}
        </div>
        <ul className="space-y-2 overflow-y-auto pr-2" style={{maxHeight: 'calc(100vh - 300px)'}}>
           {ghosts.length > 0 ? (
            ghosts.map(renderGhostItem)
          ) : (
            <div className="text-center py-10 px-4 bg-gray-800/40 rounded-lg">
                <XCircleIcon className="w-12 h-12 mx-auto text-red-500/70" />
                <p className="mt-4 text-lg text-red-400">No Matching Ghost</p>
                <p className="text-sm text-cyan-500">The selected evidence does not match any known entity. Re-evaluate your findings.</p>
            </div>
          )}
        </ul>
      </div>

      <div className="bg-gray-900/50 rounded-lg p-4 border border-cyan-800/40 flex flex-col">
        {activeGhost ? (
          <>
            <h3 className="text-2xl font-bold text-cyan-200 mb-2">{activeGhost.name}</h3>
            <p className="text-cyan-400 text-sm mb-4 italic">{activeGhost.description}</p>
            
            <div className="mb-4">
              <h4 className="font-semibold text-cyan-300 mb-2 border-b border-cyan-800/50 pb-1">Required Evidence:</h4>
              <ul className="space-y-1 text-sm">
                {activeGhost.evidence.map(ev => (
                  <li key={ev} className={`flex items-center gap-2 ${selectedEvidence.has(ev) ? 'text-green-400' : 'text-cyan-500'}`}>
                    {selectedEvidence.has(ev) ? <CheckCircleIcon className="w-4 h-4" /> : <div className="w-1.5 h-1.5 rounded-full bg-cyan-700"></div>}
                    {ev}
                  </li>
                ))}
              </ul>
            </div>

            <div className="space-y-3 text-sm">
               <div className="flex items-start gap-3">
                  <ShieldExclamationIcon className="w-5 h-5 text-red-400 mt-0.5 flex-shrink-0" />
                  <div>
                      <h4 className="font-semibold text-red-400">Strength</h4>
                      <p className="text-cyan-400">{activeGhost.strength}</p>
                  </div>
              </div>
               <div className="flex items-start gap-3">
                  <LightbulbIcon className="w-5 h-5 text-yellow-400 mt-0.5 flex-shrink-0" />
                  <div>
                      <h4 className="font-semibold text-yellow-400">Weakness</h4>
                      <p className="text-cyan-400">{activeGhost.weakness}</p>
                  </div>
              </div>
            </div>
          </>
        ) : (
          <div className="flex flex-col items-center justify-center text-center h-full text-cyan-600">
            <BrainIcon className="w-16 h-16 opacity-30" />
            <p className="mt-4 font-semibold">Select a ghost to view details</p>
            <p className="text-sm opacity-70">
              {ghosts.length === 0 ? "No entity matches current evidence." : "Or narrow down the list to one."}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
