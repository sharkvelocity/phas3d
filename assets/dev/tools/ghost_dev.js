// ./assets/dev/tools/ghost_dev.js — v1.4
// Dev panel for ghost model, teleport, scale, dev-visible,
// and barrier drawing with save/load/export.
(function(){
  "use strict";

  // ---------- Config ----------
  const BASE = 'https://sharkvelocity.github.io/3d/assets/ghosts/';
  const FILES = ['ghost.glb'];
  const STORE_KEY = 'GHOST_DEV_SAVE_V1';

  // ---------- Shortcuts ----------
  const SCENE  = ()=> window.scene || BABYLON.Engine?.LastCreatedScene;
  const CAMERA = ()=> window.camera || SCENE()?.activeCamera;
  const v3     = (x,y,z)=> new BABYLON.Vector3(x,y,z);
  const toast  = (m,ms=1200)=> (window.toast? window.toast(m,ms) : console.log('[ghost-dev]', m));

  // ---------- State ----------
  const ST = {
    ui:null,
    selector:null, scaleInput:null, visBtn:null, teleportBtn:null,
    barrierBtn:null, undoBtn:null, clearBtn:null,
    saveBtn:null, loadBtn:null, exportBtn:null, importBtn:null,

    open:false,
    devVisible:false,

    // barrier drawing
    barrierMode:false,
    barrierPts:[],
    segments:[],
    lines:[],
    pointerObs:null,

    currentFile:null,
    lastScale: 1
  };

  function setDevVisible(on){
    ST.devVisible = !!on;
    window.GHOST_DEV_FORCE_VISIBLE = ST.devVisible;
    if (ST.visBtn) ST.visBtn.textContent = ST.devVisible ? 'Visible ✓' : 'Visible';
    // You might need a function in your main ghost logic to apply this state
    window.PP?.ghost?.setVisible?.(ST.devVisible);
  }
  function toggleDevVisible(){ setDevVisible(!ST.devVisible); }

  function onScaleInput(){
    if (!ST.scaleInput) return;
    const v = parseFloat(ST.scaleInput.value)||1;
    ST.lastScale = v;
    updateScaleLabel(v);
    window.PP?.ghost?.setScale?.(v);
  }
  function updateScaleLabel(v){
    const t = ST.ui.querySelector('#gd-scalev'); if (t) t.textContent = v.toFixed(2);
  }

  function teleportToLook() {
      const rig = window.PlayerRig?.getRigRoot();
      const ghostRoot = window.PP?.ghost?.root;
      if (!rig || !ghostRoot) return toast("Player or Ghost not ready");
      const forward = rig.forward.scale(3); // 3 units in front
      const pos = rig.position.add(forward);
      ghostRoot.position.copyFrom(pos);
      toast("Ghost teleported");
  }

  async function loadGhostByFile(fileName){
    // This function should now call a central ghost manager, not load meshes directly.
    logLine(`Requesting ghost model change to: ${fileName}`);
    if(window.PP?.ghost?.setModel) {
        await window.PP.ghost.setModel(fileName);
        toast(`Loaded ${fileName}`);
        ST.currentFile = fileName;
        if (ST.selector) ST.selector.value = fileName;
    } else {
        toast("Ghost controller not available.");
        logLine("Error: window.PP.ghost.setModel not found.");
    }
  }

  function toggleBarrierMode(){
    ST.barrierMode = !ST.barrierMode;
    if (ST.barrierBtn) ST.barrierBtn.textContent = 'Barrier: ' + (ST.barrierMode ? 'On' : 'Off');
    ensurePointerHook();
    toast(ST.barrierMode ? 'Barrier mode ON' : 'Barrier mode OFF');
  }
  function ensurePointerHook(){
    const s = SCENE(); if (!s) return;
    if (!ST.pointerObs){
      ST.pointerObs = s.onPointerObservable.add((info)=>{
        if (!ST.barrierMode) return;
        if (info.type !== BABYLON.PointerEventTypes.POINTERDOWN || info.event.button !== 0) return;

        const pick = s.pick(s.pointerX, s.pointerY, m=> m && m.isPickable !== false && !m.name.startsWith('GhostBarrier'));
        if (!pick?.hit || !pick.pickedPoint) return;
        const p = pick.pickedPoint.clone();

        const last = ST.barrierPts.length ? ST.barrierPts[ST.barrierPts.length-1] : null;
        if (!last){
          ST.barrierPts.push(p);
          drawPointMarker(p);
        } else {
          addSegment(last, p);
          ST.barrierPts.push(p);
          drawPointMarker(p);
        }
      });
    }
  }
  function removePointerHook(){
    const s = SCENE(); if (!s || !ST.pointerObs) return;
    s.onPointerObservable.remove(ST.pointerObs);
    ST.pointerObs = null;
  }
  function addSegment(a, b){
    const s = SCENE(); if (!s) return;
    const seg = { a:{x:a.x,y:a.y,z:a.z}, b:{x:b.x,y:b.y,z:b.z} };
    ST.segments.push(seg);
    const line = BABYLON.MeshBuilder.CreateLines('GhostBarrierLine', { points:[a, b] }, s);
    line.color = new BABYLON.Color3(0.1, 1.0, 0.8);
    line.isPickable = false;
    ST.lines.push(line);
  }
  function drawPointMarker(p){
    const s=SCENE(); if (!s) return;
    const m = BABYLON.MeshBuilder.CreateSphere('GhostBarrierPt',{diameter:0.08}, s);
    m.position.copyFrom(p);
    const mat = new BABYLON.StandardMaterial('GBptMat', s);
    mat.emissiveColor = new BABYLON.Color3(0.1, 1.0, 0.8);
    m.material = mat; m.isPickable = false;
    ST.lines.push(m);
  }
  function undoLastSegment(){
    if (!ST.barrierPts.length) return;
    ST.barrierPts.pop();
    const m = ST.lines.pop(); try{ m.dispose(); }catch{}
    if (ST.segments.length > 0 && ST.lines.length > ST.segments.length) {
        ST.segments.pop();
        const line = ST.lines.pop(); try { line.dispose(); } catch {}
    }
  }
  function clearAllSegments(){
    ST.segments.length = 0;
    ST.barrierPts.length = 0;
    while (ST.lines.length){ try{ ST.lines.pop().dispose(); }catch{} }
  }
  
  function segSegIntersect(a, b, c, d){
    const ax=a.x, az=a.z, bx=b.x, bz=b.z, cx=c.x, cz=c.z, dx=d.x, dz=d.z;
    const abx = bx-ax, abz = bz-az, cdx = dx-cx, cdz = dz-cz;
    const denom = abx*cdz - abz*cdx;
    if (Math.abs(denom) < 1e-6) return false;
    const acx = cx-ax, acz = cz-az;
    const t = (acx*cdz - acz*cdx) / denom;
    const u = (acx*abz - acz*abx) / denom;
    return t>=0 && t<=1 && u>=0 && u<=1;
  }
  window.ghostDev_isBlockedRay = function(a, b){
    if (!ST.segments.length) return false;
    for (let i=0;i<ST.segments.length;i++){
        const s = ST.segments[i];
        if (segSegIntersect(a, b, s.a, s.b)) return true;
    }
    return false;
  };

  function captureState(){
    return {
      file: ST.currentFile || ST.selector?.value || null,
      scale: ST.lastScale || 1,
      segments: ST.segments
    };
  }
  function applyState(data){
    if (!data) return;
    clearAllSegments();
    (data.segments||[]).forEach(s=>{
        const ptA = new BABYLON.Vector3(s.a.x,s.a.y,s.a.z);
        const ptB = new BABYLON.Vector3(s.b.x,s.b.y,s.b.z);
        addSegment(ptA, ptB);
        if(ST.barrierPts.length === 0) {
            ST.barrierPts.push(ptA);
            drawPointMarker(ptA);
        }
        ST.barrierPts.push(ptB);
        drawPointMarker(ptB);
    });
    if (data.file){
      loadGhostByFile(data.file).then(()=>{
        const sc = data.scale || 1;
        if (ST.scaleInput){ ST.scaleInput.value = String(sc); onScaleInput(); }
      });
    } else if (typeof data.scale === 'number'){
      if (ST.scaleInput){ ST.scaleInput.value = String(data.scale); onScaleInput(); }
    }
  }
  function saveLocal(){
    try{ localStorage.setItem(STORE_KEY, JSON.stringify(captureState())); toast('Saved locally'); }catch(e){ toast('Save failed'); }
  }
  function loadLocal(){
    try{
      const raw = localStorage.getItem(STORE_KEY);
      if (raw) { applyState(JSON.parse(raw)); toast('Loaded from local'); }
      else toast('No local save');
    }catch(e){ toast('Load failed'); }
  }
  function exportJSON(){
    const data = JSON.stringify(captureState(), null, 2);
    const blob = new Blob([data], {type:'application/json'});
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob); a.download = 'ghost_layout.json';
    a.click(); URL.revokeObjectURL(a.href);
  }
  function importJSON(){
    const inp = document.createElement('input');
    inp.type = 'file'; inp.accept = 'application/json';
    inp.onchange = ()=>{
      const f = inp.files?.[0]; if (!f) return;
      f.text().then(text => {
          try{ applyState(JSON.parse(text)); toast('Imported'); }
          catch(e){ toast('Import failed'); }
      });
    };
    inp.click();
  }

  function buildUI(){
    if (ST.ui) return ST.ui;
    const wrap = document.getElementById('ghostdev-panel');
    wrap.innerHTML = `
      <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:6px">
        <div style="font-weight:bold;color:#9ff">Ghost Dev</div>
        <button id="gd-close" style="border:1px solid #333;background:#181818;color:#ddd;padding:4px 8px;border-radius:6px;cursor:pointer">Close</button>
      </div>
      <div style="display:flex;gap:6px;align-items:center;margin:8px 0">
        <select id="gd-files" style="padding:4px;background:#000;color:#0ff;border:1px solid #066;border-radius:4px;flex-grow:1"></select>
      </div>
      <div style="display:flex;gap:6px;align-items:center;margin:8px 0">
        <label for="gd-scale" style="color:#cff">Scale:</label>
        <input type="range" id="gd-scale" min="0.2" max="3.0" step="0.05" value="1" style="flex-grow:1">
        <span id="gd-scalev" style="color:#9ef;font-family:monospace;min-width:32px">1.00</span>
      </div>
      <div style="display:flex;gap:6px;flex-wrap:wrap;margin:8px 0">
        <button id="gd-vis">Visible</button>
        <button id="gd-teleport">Teleport Here</button>
      </div>
      <div style="margin-top:12px;padding-top:8px;border-top:1px solid #044">
        <div style="color:#9ff;font-weight:bold;margin-bottom:6px">Barriers</div>
        <div style="display:flex;gap:6px;flex-wrap:wrap">
          <button id="gd-barrier">Barrier: Off</button>
          <button id="gd-undo" title="Remove last point/segment">Undo</button>
          <button id="gd-clear">Clear</button>
        </div>
        <div style="display:flex;gap:6px;flex-wrap:wrap;margin-top:6px">
          <button id="gd-save">Save Local</button>
          <button id="gd-load">Load Local</button>
          <button id="gd-export">Export</button>
          <button id="gd-import">Import</button>
        </div>
      </div>
    `;

    // style all buttons
    wrap.querySelectorAll('button').forEach(b => Object.assign(b.style, {
      border:'1px solid #244', background:'#0b0b0b', color:'#9ff',
      padding:'6px 10px', borderRadius:'8px', cursor:'pointer'
    }));

    ST.ui = wrap;
    ST.selector   = wrap.querySelector('#gd-files');
    ST.scaleInput = wrap.querySelector('#gd-scale');
    ST.visBtn     = wrap.querySelector('#gd-vis');
    ST.teleportBtn= wrap.querySelector('#gd-teleport');
    ST.barrierBtn = wrap.querySelector('#gd-barrier');
    ST.undoBtn    = wrap.querySelector('#gd-undo');
    ST.clearBtn   = wrap.querySelector('#gd-clear');
    ST.saveBtn    = wrap.querySelector('#gd-save');
    ST.loadBtn    = wrap.querySelector('#gd-load');
    ST.exportBtn  = wrap.querySelector('#gd-export');
    ST.importBtn  = wrap.querySelector('#gd-import');

    FILES.forEach(f => {
        const opt = document.createElement('option');
        opt.value = f; opt.textContent = f;
        ST.selector.appendChild(opt);
    });

    // listeners
    wrap.querySelector('#gd-close').onclick = ()=> ST.ui.style.display = 'none';
    ST.selector.onchange   = ()=> loadGhostByFile(ST.selector.value);
    ST.scaleInput.oninput  = onScaleInput;
    ST.visBtn.onclick      = toggleDevVisible;
    ST.teleportBtn.onclick = teleportToLook;
    ST.barrierBtn.onclick  = toggleBarrierMode;
    ST.undoBtn.onclick     = undoLastSegment;
    ST.clearBtn.onclick    = clearAllSegments;
    ST.saveBtn.onclick     = saveLocal;
    ST.loadBtn.onclick     = loadLocal;
    ST.exportBtn.onclick   = exportJSON;
    ST.importBtn.onclick   = importJSON;

    return wrap;
  }

  function init(){
    const toggle = document.getElementById('ghostdev-toggle');
    const panel  = document.getElementById('ghostdev-panel');
    if (!toggle || !panel) {
        console.warn("GhostDev UI anchors not found.");
        return;
    }
    
    toggle.style.display = 'block';
    panel.style.display = 'none';

    toggle.onclick = ()=>{
      const p = buildUI();
      const on = p.style.display !== 'none';
      p.style.display = on ? 'none' : 'block';
      if (!on) {
          // If panel is opening, ensure pointer lock is held
          if(window.PP?.pointerLock?.hold) window.PP.pointerLock.hold('ghostdev');
      } else {
          // If panel is closing, release lock
          if(window.PP?.pointerLock?.release) window.PP.pointerLock.release('ghostdev');
      }
    };
  }

  // Use pp:start event to ensure scene/camera are likely ready
  window.addEventListener('pp:start', init, { once: true });
})();