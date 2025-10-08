
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useMemo } from 'react';
import { EvidenceType, Ghost } from '../types';

interface JournalProps {
    ghosts: Ghost[];
    actualGhost: Ghost;
    onClose: () => void;
    onGuessMade: (message: string) => void;
}

const Journal = ({ ghosts, actualGhost, onClose, onGuessMade }: JournalProps) => {
    const [selectedEvidence, setSelectedEvidence] = useState(new Set<EvidenceType>());
    const [selectedGhostName, setSelectedGhostName] = useState<string | null>(null);
    const [resultMessage, setResultMessage] = useState("");

    const allEvidenceTypes = Object.values(EvidenceType);

    const toggleEvidence = (evidence: EvidenceType) => {
        setSelectedEvidence(prev => {
            const newSet = new Set(prev);
            if (newSet.has(evidence)) {
                newSet.delete(evidence);
            } else {
                newSet.add(evidence);
            }
            return newSet;
        });
    };

    const filteredGhosts = useMemo(() => {
        if (selectedEvidence.size === 0) {
            return ghosts;
        }
        return ghosts.filter(ghost => {
            return Array.from(selectedEvidence).every(evidence => ghost.evidence.includes(evidence));
        });
    }, [ghosts, selectedEvidence]);

    const submitGuess = () => {
        if (!selectedGhostName) return;
        let message = "";
        if (selectedGhostName === actualGhost.name) {
            message = `Correct! It was a ${actualGhost.name}. You survived... this time.`;
        } else {
            message = `Incorrect. The entity was a ${actualGhost.name}. Better luck next time.`;
        }
        setResultMessage(message);
        onGuessMade(message);
    };

    const InvestigationTab = () => (
        <div className="flex flex-grow overflow-hidden">
            <div className="w-1/4 pr-4 border-r border-gray-700 overflow-y-auto">
                <h2 className="text-2xl font-bold mb-4 text-red-500">Evidence</h2>
                <div className="space-y-2">
                    {allEvidenceTypes.map(evidence => (
                        <button
                            key={evidence}
// FIX: Cast `evidence` (string) to `EvidenceType` to match the expected type of `toggleEvidence`.
                            onClick={() => toggleEvidence(evidence as EvidenceType)}
                            className={`w-full text-left p-2 rounded transition-colors duration-200 ${selectedEvidence.has(evidence) ? 'bg-blue-800 text-white' : 'bg-gray-800 hover:bg-gray-700'}`}
                        >
                            {evidence}
                        </button>
                    ))}
                </div>
            </div>
            <div className="w-3/4 pl-4 flex flex-col">
                <h2 className="text-2xl font-bold mb-4 text-red-500">Possible Ghosts ({filteredGhosts.length})</h2>
                <div className="flex-grow overflow-y-auto pr-2">
                    <div className="space-y-4">
                        {filteredGhosts.map(ghost => (
                            <div key={ghost.name} className={`p-3 rounded-lg border-2 ${selectedGhostName === ghost.name ? 'border-green-500 bg-gray-800' : 'border-gray-700 bg-gray-800/50'}`}>
                                <div className="flex justify-between items-start">
                                    <div>
                                        <h3 className="text-xl font-bold text-white">{ghost.name}</h3>
                                        <p className="text-sm text-gray-400">Required Evidence: {ghost.evidence.join(', ')}</p>
                                        <p className="mt-2 text-gray-300">{ghost.description}</p>
                                        <p className="mt-1"><span className="font-semibold text-green-400">Strength:</span> {ghost.strength}</p>
                                        <p className="mt-1"><span className="font-semibold text-yellow-400">Weakness:</span> {ghost.weakness}</p>
                                    </div>
                                    <button
                                        onClick={() => setSelectedGhostName(ghost.name)}
                                        className="ml-4 bg-green-600 hover:bg-green-500 disabled:bg-gray-500 text-white font-bold py-2 px-4 rounded transition-colors duration-200"
                                        disabled={!!resultMessage}
                                    >
                                        Select
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
                <div className="mt-4 pt-4 border-t border-gray-700 flex items-center justify-between">
                    {resultMessage ? (
                        <p className="text-lg font-semibold text-yellow-300">{resultMessage}</p>
                    ) : (
                        <p className="text-lg">Selected Ghost: <span className="font-bold text-green-400">{selectedGhostName || "None"}</span></p>
                    )}
                    <button
                        onClick={submitGuess}
                        disabled={!selectedGhostName || !!resultMessage}
                        className="bg-red-700 hover:bg-red-600 disabled:bg-gray-600 text-white font-bold py-2 px-6 rounded transition-colors duration-200"
                    >
                        Submit Guess
                    </button>
                </div>
            </div>
        </div>
    );

    return (
        <div className="absolute inset-0 bg-black bg-opacity-70 flex justify-center items-center z-20" onClick={onClose}>
            <div className="w-full max-w-6xl h-[90vh] bg-gray-900 rounded-lg shadow-2xl p-6 flex flex-col text-gray-200 overflow-hidden" onClick={e => e.stopPropagation()}>
                <h1 className="text-3xl font-bold mb-4 text-red-600 border-b-2 border-gray-700 pb-2">Journal</h1>
                <InvestigationTab />
            </div>
        </div>
    );
};

export default Journal;