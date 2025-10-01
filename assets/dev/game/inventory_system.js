

// File: assets/dev/game/inventory_system.js
// Van inventory & loadout (3 user slots). Belt is updated via events AND direct apply.
(function(){
  "use strict";
  const PP = (window.PP = window.PP || {});
  PP.inventory = PP.inventory || {};
  const BASE_URL = "https://sharkvelocity.github.io/3d/";

  /* -------------------- Catalog (display + icons) -------------------- */
  // Icon paths are now loaded from an external URL to prevent 404 errors.
  const ITEM_META = {
    dots:           { id:'dots',           name:'DOTS',           icon: `${BASE_URL}assets/icons/dots.png` },
    smudge:         { id:'smudge',         name:'Smudge Stick',   icon: `${BASE_URL}assets/icons/smudge_sticks.png` },
    salt:           { id:'salt',           name:'Salt Shaker',    icon: `${BASE_URL}assets/icons/salt.png` },
    sanity:         { id:'sanity',         name:'Sanity Meds',    icon: `${BASE_URL}assets/icons/sanity_pills.png` },
    crucifix:       { id:'crucifix',       name:'Crucifix',       icon: `${BASE_URL}assets/icons/crucifix.png` },
    spirit:         { id:'spirit',         name:'Spirit Box',     icon: `${BASE_URL}assets/icons/spirit_box.png` },
    book:           { id:'book',           name:'Writing Book',   icon: `${BASE_URL}assets/icons/ghost_writing_book.png` },
    emf:            { id:'emf',            name:'EMF Reader',     icon: `${BASE_URL}assets/icons/emf.png` },
    uv:             { id:'uv',             name:'UV Flashlight',  icon: `${BASE_URL}assets/icons/uv_light.png` }
  };

  // This script contributes to the global item catalog.
  // Other scripts can add their items to PP.inventory.ITEM_META as well.
  PP.inventory.ITEM_META = Object.assign(PP.inventory.ITEM_META || {}, ITEM_META);

})();