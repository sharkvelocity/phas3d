// belt_manager.js
// Renders the 3-slot item belt at the bottom of the screen.

(function(){
  if (window.BeltManager) return;

  const state = {
    activeSlot: 1 // 1, 2, or 3
  };

  function createBeltUI() {
    const existing = document.getElementById('item-belt-container');
    if (existing) return existing;

    const container = document.createElement('div');
    container.id = 'item-belt-container';
    container.className = 'item-belt';
    document.body.appendChild(container);

    for (let i = 1; i <= 3; i++) {
      const slot = document.createElement('div');
      slot.id = `belt-slot-${i}`;
      slot.className = 'belt-slot';
      slot.dataset.slot = i;
      
      const key = document.createElement('div');
      key.className = 'slot-key';
      key.textContent = i;
      
      slot.appendChild(key);
      container.appendChild(slot);
    }
    
    return container;
  }
  
  function updateBelt(inventoryData) {
    const container = createBeltUI();
    const slots = inventoryData?.slots || [];
    
    for (let i = 1; i <= 3; i++) {
      const slotEl = document.getElementById(`belt-slot-${i}`);
      if (!slotEl) continue;

      // Clear previous item
      const img = slotEl.querySelector('img');
      if (img) img.remove();
      
      const itemId = slots[i-1];
      if (itemId) {
        const itemMeta = window.PP?.inventory?.ITEM_META?.[itemId];
        if (itemMeta) {
          const itemImg = document.createElement('img');
          itemImg.src = itemMeta.icon;
          itemImg.alt = itemMeta.name;
          itemImg.title = itemMeta.name;
          slotEl.appendChild(itemImg);
        }
      }
    }
  }
  
  function setActiveSlot(slotNumber) {
    if (slotNumber < 1 || slotNumber > 3) return;
    state.activeSlot = slotNumber;
    
    for (let i = 1; i <= 3; i++) {
      const slotEl = document.getElementById(`belt-slot-${i}`);
      if(slotEl) slotEl.classList.toggle('active', i === state.activeSlot);
    }

    // Dispatch event for other systems
    const inventory = window.PP?.inventory?.slots;
    const itemId = inventory ? inventory[slotNumber - 1] : null;
    const itemMeta = itemId ? (window.PP?.inventory?.ITEM_META?.[itemId] || null) : null;
    
    window.dispatchEvent(new CustomEvent('pp:belt:equip', {
      detail: { item: itemMeta, slot: slotNumber }
    }));
  }

  window.BeltManager = {
    update: updateBelt,
    setActive: setActiveSlot
  };
  
  // Event Listeners
  window.addEventListener('pp:inventory:changed', (e) => {
    updateBelt(e.detail);
  });
  
  window.addEventListener('pp:belt:select', (e) => {
    // Slot in event is 0-indexed, our system is 1-indexed
    setActiveSlot(e.detail.slot + 1);
  });

  document.addEventListener("DOMContentLoaded", createBeltUI);
})();