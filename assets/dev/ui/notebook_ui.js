// assets/dev/ui/notebook_ui.js

(function(){
  'use strict';
  // Check if a more complex notebook system is already in place.
  // This simple version is for integrating the React journal.
  if (window.NotebookUI_React) return;
  window.NotebookUI_React = true;

  const NOTEBOOK_ID = 'notebook-modal';
  let isOpen = false;

  function setOpen(shouldBeOpen) {
    const modal = document.getElementById(NOTEBOOK_ID);
    if (!modal) {
        console.warn("[NotebookUI] Modal element not found:", NOTEBOOK_ID);
        return;
    }

    // Prevent re-entry if state is already correct
    if (isOpen === shouldBeOpen) return;
    
    isOpen = shouldBeOpen;
    modal.style.display = isOpen ? 'block' : 'none';
    
    if (isOpen) {
      window.PP?.pointerLock?.hold('notebook');
    } else {
      window.PP?.pointerLock?.release('notebook');
    }
    // Fire events for other systems that might care
    window.dispatchEvent(new CustomEvent(isOpen ? 'pp:notebook:open' : 'pp:notebook:close'));
  }

  // This function will be called by input_manager.js. We'll make it a toggle.
  window.openNotebook = function() {
    setOpen(!isOpen);
  };

  // This function can be called by a close button inside the React UI
  window.closeNotebook = function() {
    setOpen(false);
  };

  console.log('[NotebookUI] React-based notebook controller initialized.');

})();
