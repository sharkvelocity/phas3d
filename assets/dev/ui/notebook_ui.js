// assets/dev/ui/notebook_ui.js

(function(){
  'use strict';
  // This script replaces the React-based journal with a vanilla JS implementation.
  if (window.PP_Notebook_Vanilla) return;
  window.PP_Notebook_Vanilla = true;

  const NOTEBOOK_ID = 'notebook-modal';
  
  const state = {
    isOpen: false,
    selectedEvidence: new Set(),
    activeGhostName: null,
  };

  // --- SVG Icons ---
  const ICONS = {
    ghost: `<svg class="w-12 h-12 text-cyan-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z" /></svg>`,
    reset: `<svg class="w-4 h-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 11.667 0l3.181-3.183m-4.991-2.691v4.99" /></svg>`,
    close: `<svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>`,
    'EMF Level 5': `<svg class="w-8 h-8" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M3.75 12h16.5m-16.5 3.75h16.5M3.75 19.5h16.5M5.625 4.5h12.75a1.875 1.875 0 0 1 0 3.75H5.625a1.875 1.875 0 0 1 0-3.75Z" /></svg>`,
    'Spirit Box': `<svg class="w-8 h-8" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M12 18.75a6 6 0 0 0 6-6v-1.5m-6 7.5a6 6 0 0 1-6-6v-1.5m6 7.5v3.75m-3.75 0h7.5M12 15.75a3 3 0 0 1-3-3V4.5a3 3 0 1 1 6 0v8.25a3 3 0 0 1-3 3Z" /></svg>`,
    'Ultraviolet': `<svg class="w-8 h-8" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M7.864 4.243A7.5 7.5 0 0 1 19.5 10.5c0 2.92-.556 5.709-1.588 8.188a15.048 15.048 0 0 1-3.478 2.555c-1.994.88-4.223.96-6.147.234a15.086 15.086 0 0 1-4.76-1.688A7.5 7.5 0 0 1 7.864 4.243Z" /></svg>`,
    'Ghost Writing': `<svg class="w-8 h-8" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" /></svg>`,
    'Freezing': `<svg class="w-8 h-8" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="m10.5 6.75 1.5-1.5-1.5-1.5m1.5 3-1.5-1.5 1.5-1.5m-3.75 9.75 1.5-1.5-1.5-1.5m1.5 3-1.5-1.5 1.5-1.5M15 21a2.25 2.25 0 0 0 2.25-2.25V5.25A2.25 2.25 0 0 0 15 3H9a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 9 21h6Z" /></svg>`,
    'Ghost Orbs': `<svg class="w-8 h-8" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M12 9.75v.008H12V9.75Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0ZM12 12.75v.008H12V12.75Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm-.75 2.25v.008H12V15Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" /><path stroke-linecap="round" stroke-linejoin="round" d="M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" /></svg>`,
    'DOTS Projector': `<svg class="w-8 h-8" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M6.75 12a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0ZM12.75 12a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0ZM18.75 12a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z" /></svg>`,
    checkCircle: `<svg class="w-5 h-5 text-green-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" /></svg>`,
    checkCircleSmall: `<svg class="w-4 h-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" /></svg>`,
    xCircle: `<svg class="w-12 h-12 mx-auto text-red-500/70" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="m9.75 9.75 4.5 4.5m0-4.5-4.5 4.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" /></svg>`,
    brain: `<svg class="w-16 h-16 opacity-30" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09ZM18.259 8.715 18 9.75l-.259-1.035a3.375 3.375 0 0 0-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 0 0 2.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 0 0 2.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 0 0-2.456 2.456Z" /></svg>`,
    strength: `<svg class="w-5 h-5 text-red-400 mt-0.5 flex-shrink-0" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z" /></svg>`,
    weakness: `<svg class="w-5 h-5 text-yellow-400 mt-0.5 flex-shrink-0" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M12 18v-5.25m0 0a6.01 6.01 0 0 0 1.5-.189m-1.5.189a6.01 6.01 0 0 1-1.5-.189m3.75 7.478a12.06 12.06 0 0 1-4.5 0m3.75 2.311a7.5 7.5 0 0 1-7.5 0c.411.02.824.037 1.25.052m6.25-.052c.426-.015.839-.032 1.25-.052M12 9a6.75 6.75 0 0 0-6.75 6.75v1.5a6.75 6.75 0 0 0 6.75 6.75h.036a6.75 6.75 0 0 0 6.75-6.75v-1.5a6.75 6.75 0 0 0-6.75-6.75H12Z" /></svg>`,
  };

  // --- Data Access ---
  const GHOST_DATA = Object.values(window.PP?.GHOST_DATA || {}).map(g => ({
      name: g.name,
      evidence: g.evidence,
      description: g.notes || "No detailed description available.",
      strength: g.notes || "No specific strength listed.",
      weakness: g.notes || "No specific weakness listed.",
  }));
  const ALL_EVIDENCE = window.PP?.ALL_EVIDENCE || [];
  
  // --- DOM Elements (cached) ---
  const elements = {};

  function init() {
    const modal = document.getElementById(NOTEBOOK_ID);
    if (!modal) {
        console.warn("[NotebookUI] Modal element not found:", NOTEBOOK_ID);
        return;
    }
    buildInitialDOM(modal);
    cacheDOMElements();
    attachEventListeners();
    console.log('[NotebookUI] Vanilla journal initialized.');
  }

  function buildInitialDOM(modal) {
    modal.innerHTML = `
      <div class="min-h-screen bg-gray-900 text-cyan-300 p-4 sm:p-6 lg:p-8" style="background-image: radial-gradient(rgba(0, 100, 120, 0.1) 1px, transparent 1px); background-size: 15px 15px;">
        <div class="max-w-7xl mx-auto relative">
          <button id="notebook-close-btn" class="absolute top-4 right-4 sm:right-6 lg:right-8 text-cyan-400 hover:text-white transition-colors z-20 p-2 rounded-full bg-black/30 hover:bg-red-500/50" title="Close Journal (N)" aria-label="Close Journal">
            ${ICONS.close}
          </button>
          
          <header class="flex items-center gap-4 pb-4 border-b-2 border-cyan-800/50">
            ${ICONS.ghost}
            <div>
              <h1 class="text-3xl font-bold text-cyan-200 tracking-widest">PhasmaPhoney</h1>
              <p class="text-cyan-500 text-sm">Digital Ghost-Hunting Journal</p>
            </div>
          </header>

          <main class="mt-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div class="lg:col-span-1 bg-black/30 border border-cyan-800/50 rounded-lg p-4 shadow-lg shadow-cyan-900/10">
              <div class="flex justify-between items-center mb-4">
                <h2 class="text-xl font-bold text-cyan-200 tracking-wider">EVIDENCE LOG</h2>
                <button id="evidence-reset-btn" class="flex items-center gap-2 px-3 py-1.5 text-sm bg-cyan-900/50 hover:bg-cyan-800/70 border border-cyan-700 rounded-md transition-colors duration-200" title="Reset Evidence">
                  ${ICONS.reset} Reset
                </button>
              </div>
              <div id="evidence-selector-container" class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-2 gap-3"></div>
            </div>

            <div class="lg:col-span-2 bg-black/30 border border-cyan-800/50 rounded-lg p-4 shadow-lg shadow-cyan-900/10">
              <h2 class="text-xl font-bold text-cyan-200 tracking-wider mb-4">ENTITY IDENTIFICATION</h2>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6 h-full">
                <div>
                  <div id="ghost-list-header" class="flex justify-between items-baseline mb-2"></div>
                  <ul id="ghost-list-container" class="space-y-2 overflow-y-auto pr-2" style="max-height: calc(100vh - 300px);"></ul>
                </div>
                <div id="ghost-details-container" class="bg-gray-900/50 rounded-lg p-4 border border-cyan-800/40 flex flex-col"></div>
              </div>
            </div>
          </main>
        </div>
      </div>`;
  }

  function cacheDOMElements() {
    const ids = ['notebook-close-btn', 'evidence-reset-btn', 'evidence-selector-container', 'ghost-list-header', 'ghost-list-container', 'ghost-details-container'];
    ids.forEach(id => elements[id] = document.getElementById(id));
  }

  function attachEventListeners() {
    elements['notebook-close-btn'].addEventListener('click', closeNotebook);
    elements['evidence-reset-btn'].addEventListener('click', handleReset);
  }
  
  function render() {
    const GHOST_DATA = Object.values(window.PP?.GHOST_DATA || {});
    if (GHOST_DATA.length === 0) return; // Don't render if data isn't loaded yet

    const filteredGhosts = GHOST_DATA.filter(ghost => {
        for (const evidence of state.selectedEvidence) {
            if (!ghost.evidence.includes(evidence)) return false;
        }
        return true;
    });

    const possibleFutureEvidence = new Set(filteredGhosts.flatMap(ghost => ghost.evidence));
    const impossibleEvidence = new Set(ALL_EVIDENCE.filter(ev => !state.selectedEvidence.has(ev) && !possibleFutureEvidence.has(ev)));
    
    if (filteredGhosts.length === 1 && state.activeGhostName !== filteredGhosts[0].name) {
        state.activeGhostName = filteredGhosts[0].name;
    } else if (filteredGhosts.length > 1 && state.activeGhostName && !filteredGhosts.some(g => g.name === state.activeGhostName)) {
        state.activeGhostName = null;
    } else if (filteredGhosts.length === 0) {
        state.activeGhostName = null;
    }
    
    renderEvidenceSelector(impossibleEvidence);
    renderGhostList(filteredGhosts);
    renderGhostDetails(filteredGhosts);
  }

  function renderEvidenceSelector(impossibleEvidence) {
    elements['evidence-selector-container'].innerHTML = ALL_EVIDENCE.map(evidence => {
      const isSelected = state.selectedEvidence.has(evidence);
      const isImpossible = impossibleEvidence.has(evidence);
      let buttonClasses = "p-3 flex flex-col items-center justify-center gap-2 text-center rounded-lg border transition-all duration-200 cursor-pointer ";
      if (isSelected) {
        buttonClasses += "bg-cyan-500/20 border-cyan-400 text-cyan-200 shadow-lg shadow-cyan-500/20";
      } else if (isImpossible) {
        buttonClasses += "bg-gray-800/50 border-gray-700 text-gray-500 opacity-60 cursor-not-allowed line-through";
      } else {
        buttonClasses += "bg-gray-800/30 border-cyan-800/70 hover:bg-cyan-900/40 hover:border-cyan-700 text-cyan-400";
      }
      return `<button data-evidence="${evidence}" ${isImpossible ? 'disabled' : ''} class="${buttonClasses}">
          ${ICONS[evidence] || '?'}
          <span class="text-xs font-semibold tracking-wide">${evidence}</span>
        </button>`;
    }).join('');

    elements['evidence-selector-container'].querySelectorAll('button').forEach(btn => {
      btn.addEventListener('click', () => handleEvidenceToggle(btn.dataset.evidence));
    });
  }

  function renderGhostList(filteredGhosts) {
    elements['ghost-list-header'].innerHTML = `
        <p class="text-sm text-cyan-400">${filteredGhosts.length} possible entities found</p>
        ${state.selectedEvidence.size > 0 && filteredGhosts.length > 1 ? `<p class="text-sm text-yellow-400">Evidence missing: ${3 - state.selectedEvidence.size}</p>` : ''}
    `;

    if (filteredGhosts.length > 0) {
      elements['ghost-list-container'].innerHTML = filteredGhosts.map(ghost => {
        const isActive = state.activeGhostName === ghost.name;
        return `<li data-ghost-name="${ghost.name}" class="px-4 py-3 rounded-md cursor-pointer transition-all duration-200 flex justify-between items-center ${isActive ? 'bg-cyan-600/30 border-cyan-500' : 'bg-gray-800/40 border-transparent hover:bg-cyan-900/30'}">
            <span class="font-semibold tracking-wider">${ghost.name}</span>
            <div class="flex items-center gap-2">
              ${ghost.evidence.map(ev => state.selectedEvidence.has(ev) ? ICONS.checkCircle : `<div class="w-2 h-2 rounded-full bg-cyan-700"></div>`).join('')}
            </div>
          </li>`;
      }).join('');
      elements['ghost-list-container'].querySelectorAll('li').forEach(item => {
        item.addEventListener('click', () => handleGhostSelect(item.dataset.ghostName));
      });
    } else {
      elements['ghost-list-container'].innerHTML = `<div class="text-center py-10 px-4 bg-gray-800/40 rounded-lg">
          ${ICONS.xCircle}
          <p class="mt-4 text-lg text-red-400">No Matching Ghost</p>
          <p class="text-sm text-cyan-500">The selected evidence does not match any known entity. Re-evaluate your findings.</p>
        </div>`;
    }
  }

  function renderGhostDetails(filteredGhosts) {
      const activeGhost = GHOST_DATA.find(g => g.name === state.activeGhostName);
      if (activeGhost) {
          elements['ghost-details-container'].innerHTML = `
            <h3 class="text-2xl font-bold text-cyan-200 mb-2">${activeGhost.name}</h3>
            <p class="text-cyan-400 text-sm mb-4 italic">${activeGhost.description}</p>
            <div class="mb-4">
              <h4 class="font-semibold text-cyan-300 mb-2 border-b border-cyan-800/50 pb-1">Required Evidence:</h4>
              <ul class="space-y-1 text-sm">
                ${activeGhost.evidence.map(ev => `
                  <li class="flex items-center gap-2 ${state.selectedEvidence.has(ev) ? 'text-green-400' : 'text-cyan-500'}">
                    ${state.selectedEvidence.has(ev) ? ICONS.checkCircleSmall : '<div class="w-1.5 h-1.5 rounded-full bg-cyan-700"></div>'}
                    ${ev}
                  </li>`).join('')}
              </ul>
            </div>
            <div class="space-y-3 text-sm">
              <div class="flex items-start gap-3">
                ${ICONS.strength}
                <div>
                  <h4 class="font-semibold text-red-400">Strength</h4>
                  <p class="text-cyan-400">${activeGhost.strength}</p>
                </div>
              </div>
              <div class="flex items-start gap-3">
                ${ICONS.weakness}
                <div>
                  <h4 class="font-semibold text-yellow-400">Weakness</h4>
                  <p class="text-cyan-400">${activeGhost.weakness}</p>
                </div>
              </div>
            </div>
          `;
      } else {
          elements['ghost-details-container'].innerHTML = `
            <div class="flex flex-col items-center justify-center text-center h-full text-cyan-600">
              ${ICONS.brain}
              <p class="mt-4 font-semibold">Select a ghost to view details</p>
              <p class="text-sm opacity-70">${filteredGhosts.length === 0 ? "No entity matches current evidence." : "Or narrow down the list to one."}</p>
            </div>
          `;
      }
  }

  // --- Event Handlers ---
  function handleEvidenceToggle(evidence) {
    if (state.selectedEvidence.has(evidence)) {
      state.selectedEvidence.delete(evidence);
    } else if (state.selectedEvidence.size < 3) {
      state.selectedEvidence.add(evidence);
    }
    render();
  }

  function handleReset() {
    state.selectedEvidence.clear();
    state.activeGhostName = null;
    render();
  }
  
  function handleGhostSelect(ghostName) {
      state.activeGhostName = ghostName;
      render();
  }

  // --- Global API ---
  function setOpen(shouldBeOpen) {
    const modal = document.getElementById(NOTEBOOK_ID);
    if (!modal || state.isOpen === shouldBeOpen) return;
    
    state.isOpen = shouldBeOpen;
    modal.style.display = state.isOpen ? 'block' : 'none';
    
    if (state.isOpen) {
      window.PP?.pointerLock?.hold('notebook');
      render(); // Initial render on open
    } else {
      window.PP?.pointerLock?.release('notebook');
    }
    window.dispatchEvent(new CustomEvent(state.isOpen ? 'pp:notebook:open' : 'pp:notebook:close'));
  }

  window.openNotebook = function() { setOpen(!state.isOpen); };
  window.closeNotebook = function() { setOpen(false); };
  
  // Wait for DOM content to be loaded before initializing
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();