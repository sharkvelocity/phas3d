
// ./assets/dev/tools/devtools.js — Dev Tools v4 (adds Doors authoring)
(function(){
  "use strict";

  // ------------------ tiny DOM + UI helpers ------------------
  const $ = (sel, root=document)=> root.querySelector(sel);
  const el = (tag, attrs={}, kids=[])=>{
    const n=document.createElement(tag);
    for (const k in attrs){
      if (k==="style") Object.assign(n.style, attrs[k]);
      else if (k in n) n[k]=attrs[k];
      else n.setAttribute(k, attrs[k]);
    }
    for (const k of kids) n.appendChild(typeof k==="string"?document.createTextNode(k):k);
    return n;
  };
  const btn = (label, onclick, title='')=>{ const b=el('button',{className:'hud-btn', title},[label]); if(onclick) b.onclick=onclick; Object.assign(b.style, { border:'1px solid #244',background:'#0b0b0b',color:'#9ff',padding:'6px 10px',borderRadius:'8px',cursor:'pointer'}); return b; };
  const lab = (t)=> el('span',{style:{color:'#9ff',minWidth:'56px',display:'inline-block'}},[t]);
  const input = (type,id,val,attrs={})=>{
    return el('input',Object.assign({type,id,value:val,style:{padding:'4px',background:'#000',color:'#0ff',
      border:'1px solid #066',borderRadius:'4px'}},attrs),[]);
  };
  const check = (label,id,onChange,checked=false)=>{
    const w=el('label',{style:{display:'inline-flex',gap:'6px',alignItems:'center',cursor:'pointer'}},
      [el('input',{id,type:'checkbox',checked}), el('span',{style:{color:'#cff'}},[label])]);
    if(onChange) setTimeout(()=> $('#'+id).addEventListener('change', onChange),0);
    return w;
  };
  const sel = (id, opts)=>{ const s=el('select',{id,style:{padding:'4px',background:'#000',color:'#0ff',border:'1px solid #066',borderRadius:'4px'}},[]);
    (opts||[]).forEach(([v,t])=> s.appendChild(el('option',{value:v},[t]))); return s; };

  // ------------------ state + utils ------------------
  const STATE = {
    ready:false, fpsEl:null, lastPick:null, clickTeleport:false,
    loggerLines:[], loggerMax:120,
    doors: [] // authoring buffer
  };
  const SCENE = ()=> window.scene || BABYLON.Engine?.LastCreatedScene;
  const ENGINE= ()=> window.engine || SCENE()?.getEngine?.();
  const toast = (msg,ms=1200)=> (window.toast? window.toast(msg,ms): console.log('[toast]',msg));

  function logLine(msg){
    STATE.loggerLines.push(`[${new Date().toLocaleTimeString()}] ${msg}`);
    if (STATE.loggerLines.length > STATE.loggerMax) STATE.loggerLines.shift();
    const out = $('#dev-log'); if (out) out.textContent = STATE.loggerLines.join('\n');
    try{ console.log('[Dev]', msg);}catch{}
  }
  function exportJSON(name,obj){
    const blob=new Blob([JSON.stringify(obj,null,2)],{type:'application/json'});
    const a=el('a',{download:name}); a.href=URL.createObjectURL(blob); a.click(); setTimeout(()=>URL.revokeObjectURL(a.href),0);
  }
  function exportText(name, text){
    const blob=new Blob([text],{type:'text/plain'});
    const a=el('a',{download:name}); a.href=URL.createObjectURL(blob); a.click(); setTimeout(()=>URL.revokeObjectURL(a.href),0);
  }

  // ------------------ selection + picking ------------------
  function pickUnderCursor(){
    const s=SCENE(); if(!s) return;
    const ray=s.createPickingRay(s.pointerX, s.pointerY, BABYLON.Matrix.Identity(), window.camera);
    const hit=s.pickWithRay(ray, m=>m && m.isPickable!==false);
    if(hit?.hit && hit.pickedMesh){ selectMesh(hit.pickedMesh); }
  }
  function selectMesh(mesh){
    STATE.lastPick = mesh;
    const name = $('#mesh-name'); if (name) name.textContent = mesh?.name || '(unnamed)';
    try{
      if (!STATE.gizmo){
        const gm = new BABYLON.GizmoManager(SCENE());
        gm.usePointerToAttachGizmos=false;
        gm.positionGizmoEnabled=true; gm.rotationGizmoEnabled=true; gm.scaleGizmoEnabled=false;
        STATE.gizmo = gm;
      }
      STATE.gizmo.attachToMesh(mesh);
    }catch(e){}
    // Doors tab live update
    if ($('#door-selected')) $('#door-selected').textContent = mesh?.name || '(none)';
    if ($('#door-preview-name')) $('#door-preview-name').textContent = mesh?.name || '(none)';
  }

  // ------------------ Nodes scanner (reused in Doors list) ------------------
  function scanSceneNodes(filterEmpty=true){
    const s=SCENE(); if(!s) return {count:0,items:[],summary:{}};
    const items=[];
    for (const m of s.meshes){ items.push({type:'Mesh',name:m.name||'',ref:m}); }
    const out = filterEmpty ? items.filter(x=>x.name && x.name.trim().length) : items;
    return {count: out.length, items: out, summary:{}};
  }

  // ------------------ Panels framework ------------------
  const PANEL = { root:null, tabs:null, body:null };

  function ensurePanel(){
    const root = $('#devtools-panel');
    if (!root) return false;
    root.innerHTML = "";
    root.style.display = 'block';
    const hdr = el('div',{style:{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:'6px'}},[
      el('div',{style:{color:'#9ff',fontWeight:'bold'}},['Developer Tools (v4)']),
      (STATE.fpsEl = el('div',{style:{color:'#8ff',fontSize:'12px'}},['FPS: --']))
    ]);
    const tabs = el('div',{style:{display:'flex',gap:'8px',flexWrap:'wrap',marginBottom:'8px'}},[]);
    const body = el('div',{style:{border:'1px solid #033',padding:'8px',borderRadius:'8px',background:'#0a0a0a'}},[]);
    PANEL.root=root; PANEL.tabs=tabs; PANEL.body=body;
    root.appendChild(hdr); root.appendChild(tabs); root.appendChild(body);
    return true;
  }
  function addTab(name, builder, active=false){
    const b = btn(name, ()=>{ PANEL.body.innerHTML=""; builder(); });
    if (active) setTimeout(()=> b.click(), 0);
    PANEL.tabs.appendChild(b);
  }

  // ============== TABS ==============
  // Map
  function buildMapUI() {
    const row = el('div', { style: { display: 'flex', gap: '8px' } }, [
        btn('Generate New Map', async () => {
            const scene = SCENE();
            if (window.ProHouseGenerator && scene) {
                logLine('Generating new procedural map...');
                // Attempt to find and dispose of the old map root
                const oldMap = scene.getTransformNodeByName("ProceduralMapRoot");
                if (oldMap) {
                    oldMap.dispose(false, true); // Dispose node and all children
                    logLine('Cleared previous map.');
                }
                await window.ProHouseGenerator.generateMap(scene);
                logLine('New map generated.');
            } else {
                logLine('ProHouseGenerator not found or scene not ready.');
            }
        }),
        btn('Clear Log', () => {
            const o = $('#dev-log');
            if (o) o.textContent = '';
            STATE.loggerLines.length = 0;
        })
    ]);
    const log = el('pre', { id: 'dev-log', style: { background: '#000', border: '1px solid #033', padding: '8px', minHeight: '120px', maxHeight: '220px', overflow: 'auto', color: '#8ff', whiteSpace: 'pre-wrap' } }, []);
    PANEL.body.appendChild(row);
    PANEL.body.appendChild(el('div', { style: { marginTop: '8px', color: '#8ff' } }, ["Log:"]));
    PANEL.body.appendChild(log);
    log.textContent = STATE.loggerLines.join('\n');
}

  // Nodes
  function buildNodesUI(){
    const filter = input('text','nodes-filter','', {placeholder:'filter by name (regex OK)',style:{width:'60%'}});
    const row = el('div',{style:{display:'flex',gap:'8px',flexWrap:'wrap'}},[
      filter,
      btn('Scan',()=>{
        const res = scanSceneNodes(true);
        renderNodes(res.items, filter.value);
      }),
      btn('Export JSON',()=>{
        const res = scanSceneNodes(true);
        exportJSON('nodes_scan.json', res);
        toast('Exported nodes_scan.json',900);
      })
    ]);
    const list = el('div',{id:'nodes-list',style:{marginTop:'8px',maxHeight:'320px',overflow:'auto',border:'1px solid #033',padding:'6px'}},[]);
    PANEL.body.appendChild(row);
    PANEL.body.appendChild(list);
    const res = scanSceneNodes(true); renderNodes(res.items,'');
    function renderNodes(items, q){
      const host = $('#nodes-list'); if (!host) return;
      host.innerHTML='';
      let rx=null;
      if (q && q.trim()){
        try{ rx = new RegExp(q.trim(), 'i'); }catch{ rx = null; }
      }
      (items||[]).filter(n=> !rx || rx.test(n.name)).slice(0,500).forEach(n=>{
        const row = el('div',{style:{display:'grid',gridTemplateColumns:'84px 1fr 84px',gap:'6px',alignItems:'center',borderBottom:'1px solid #022',padding:'3px 0'}},[
          el('div',{style:{color:'#0ff'}},[n.type]),
          el('div',{style:{color:'#cff',overflow:'hidden',textOverflow:'ellipsis'}},[n.name||'(unnamed)']),
          btn('Select', ()=>{ const m = n.ref || SCENE()?.getNodeByName(n.name); if (m) selectMesh(m); })
        ]);
        host.appendChild(row);
      });
    }
  }

  // Mesh+
  function buildMeshPlusUI(){
    const q = input('text','meshq','door', {placeholder:'name contains…',style:{width:'220px'}});
    const isolate = check('Isolate results','mesh-isolate', refresh);
    const list = el('div',{id:'mesh-list',style:{marginTop:'6px',maxHeight:'300px',overflow:'auto',border:'1px solid #033',padding:'6px'}},[]);
    const bar = el('div',{style:{display:'flex',gap:'6px',flexWrap:'wrap',marginTop:'6px'}},[
      btn('Toggle Collisions', ()=> batch('collisions')),
      btn('Toggle Pickable',   ()=> batch('pickable')),
      btn('Toggle Visible',    ()=> batch('visible')),
    ]);
    const pickNow = btn('Pick Under Cursor', pickUnderCursor);
    const name = el('div',{id:'mesh-name',style:{color:'#9ff',marginTop:'6px'}},['(none)']);
    const top = el('div',{style:{display:'flex',gap:'6px',alignItems:'center'}},[ lab('Find'), q, isolate, pickNow ]);
    PANEL.body.appendChild(top);
    PANEL.body.appendChild(list);
    PANEL.body.appendChild(bar);
    PANEL.body.appendChild(el('div',{style:{marginTop:'6px'}},[ lab('Selected'), name ]));
    refresh(); q.addEventListener('input', refresh);
    function current(){ const s=SCENE(); if(!s) return []; const v=q.value.trim().toLowerCase(); return s.meshes.filter(m=> (m.name||'').toLowerCase().includes(v)); }
    function refresh(){
      const s=SCENE(); if(!s) return;
      const items = current();
      const host=$('#mesh-list'); host.innerHTML='';
      if ($('#mesh-isolate input')?.checked){ s.meshes.forEach(m=> m.isVisible = items.includes(m)); }
      items.slice(0,400).forEach(m=>{
        const row=el('div',{style:{display:'grid',gridTemplateColumns:'1fr auto auto auto',gap:'6px',borderBottom:'1px solid #022',padding:'3px 0'}},[
          el('div',{style:{color:'#cff'}},[m.name||'(unnamed)']),
          btn('Sel', ()=> selectMesh(m)),
          btn(m.checkCollisions?'Coll✓':'Coll×', ()=>{ m.checkCollisions=!m.checkCollisions; refresh(); }),
          btn(m.isPickable?'Pick✓':'Pick×', ()=>{ m.isPickable=!m.isPickable; refresh(); })
        ]);
        host.appendChild(row);
      });
    }
    function batch(kind){
      const items=current(); if (!items.length){ toast('No matches'); return; }
      if (kind==='collisions') items.forEach(m=> m.checkCollisions=!m.checkCollisions);
      if (kind==='pickable')   items.forEach(m=> m.isPickable=!m.isPickable);
      if (kind==='visible')    items.forEach(m=> m.isVisible = !(m.isVisible!==false && m.visibility!==0));
      refresh();
    }
  }

  // NEW TAB: Doors
  function buildDoorsUI(){
    const s=SCENE(); if(!s){ PANEL.body.appendChild(el('div',{style:{color:'#faa'}},['Scene not ready'])); return; }

    // Controls
    const axisSel   = sel('door-axis',  [['Y','Axis: Y (typical)'],['X','Axis: X'],['Z','Axis: Z']]); axisSel.value='Y';
    const sideSel   = sel('door-side',  [['minX','Hinge: minX'],['maxX','Hinge: maxX'],['minZ','Hinge: minZ'],['maxZ','Hinge: maxZ']]);
    const angleIn   = input('number','door-angle','110',{step:'1',min:'-180',max:'180',title:'Open angle in degrees'});
    const durIn     = input('number','door-dur','700',{step:'10',min:'50',title:'Duration ms'});
    const easSel    = sel('door-ease',  [['CubicInOut','CubicInOut'],['SineInOut','SineInOut'],['BackOut','BackOut'],['Linear','Linear']]);

    const pickBtn   = btn('Pick Under Cursor', pickUnderCursor);
    const byNameIn  = input('text','door-name','',{placeholder:'mesh name…',style:{width:'220px'}});
    const selBtn    = btn('Select', ()=>{ const m=s.getMeshByName(byNameIn.value)||s.getNodeByName(byNameIn.value); if(m) selectMesh(m); else toast('Not found'); });

    const selected  = el('div',{style:{color:'#9ff'}},['Selected: ', el('b',{id:'door-selected'},[STATE.lastPick?.name||'(none)'])]);
    const pvTxt     = el('div',{id:'door-pivot-txt',style:{color:'#8ff'}},['Pivot: (—, —, —)']);
    const computeBtn= btn('Compute Hinge Pivot', ()=> { const mesh=STATE.lastPick; if(!mesh) return toast('Pick a mesh first'); const p = computeHingePivot(mesh, sideSel.value); pvTxt.textContent=`Pivot: (${p.x.toFixed(3)}, ${p.y.toFixed(3)}, ${p.z.toFixed(3)})`; });
    const applyPivotBtn = btn('Apply Pivot', ()=>{ const mesh=STATE.lastPick; if(!mesh) return toast('Pick a mesh first'); const p = computeHingePivot(mesh, sideSel.value); mesh.setPivotPoint(p, BABYLON.Space.WORLD); toast('Pivot applied'); });

    const openBtn  = btn('Preview Open', ()=> playDoor(meshSel(), +angleIn.value||110, +durIn.value||700, axisSel.value, easSel.value));
    const closeBtn = btn('Preview Close',()=> playDoor(meshSel(), 0, +durIn.value||700, axisSel.value, easSel.value));

    const saveBtn  = btn('Save Door', ()=>{
      const mesh = meshSel(); if(!mesh) return;
      const pivot = computeHingePivot(mesh, sideSel.value);
      const rec = {
        name: mesh.name,
        axis: axisSel.value,
        hinge: sideSel.value,
        pivotWorld: { x:+pivot.x.toFixed(6), y:+pivot.y.toFixed(6), z:+pivot.z.toFixed(6) },
        openAngleDeg: +angleIn.value||110,
        durationMs: +durIn.value||700,
        easing: easSel.value
      };
      const i = STATE.doors.findIndex(d=>d.name===rec.name);
      if (i>=0) STATE.doors[i]=rec; else STATE.doors.push(rec);
      renderDoorList();
      toast('Door saved to buffer');
    });

    const exportJsonBtn = btn('Export doors.json', ()=> exportJSON('doors.json', STATE.doors));
    const exportJsBtn   = btn('Export doors.js',   ()=> exportText('doors.js', renderDoorsJS(STATE.doors)));
    
    const rowPick = el('div',{style:{display:'flex',gap:'6px',flexWrap:'wrap',alignItems:'center'}},[ pickBtn, byNameIn, selBtn, selected ]);
    const rowHinge= el('div',{style:{display:'flex',gap:'8px',flexWrap:'wrap',marginTop:'6px'}},[ axisSel, sideSel, angleIn, lab('deg'), durIn, lab('ms'), easSel ]);
    const rowPivot = el('div',{style:{display:'flex',gap:'8px',flexWrap:'wrap',marginTop:'6px'}}, [computeBtn, applyPivotBtn, pvTxt]);
    const rowPrev = el('div',{style:{display:'flex',gap:'8px',alignItems:'center',marginTop:'6px'}},[ lab('Preview:'), openBtn, closeBtn ]);

    const listHost = el('div',{id:'doors-list',style:{marginTop:'8px',maxHeight:'240px',overflow:'auto',border:'1px solid #033',padding:'6px'}},[]);
    const rowExport= el('div',{style:{display:'flex',gap:'8px',marginTop:'8px'}},[ saveBtn, exportJsonBtn, exportJsBtn ]);

    PANEL.body.appendChild(rowPick);
    PANEL.body.appendChild(rowHinge);
    PANEL.body.appendChild(rowPivot);
    PANEL.body.appendChild(rowPrev);
    PANEL.body.appendChild(listHost);
    PANEL.body.appendChild(rowExport);

    renderDoorList();

    function meshSel(){ return STATE.lastPick || null; }
    function renderDoorList(){
      const host = $('#doors-list'); host.innerHTML='';
      STATE.doors.forEach((d,idx)=>{
        const row = el('div',{style:{display:'grid',gridTemplateColumns:'1fr auto auto',gap:'6px',borderBottom:'1px solid #022',padding:'3px 0'}},[
          el('div',{style:{color:'#cff'}},[`#${idx} ${d.name} — ${d.axis}/${d.hinge} ${d.openAngleDeg}° ${d.durationMs}ms`]),
          btn('Select', ()=> { const m=SCENE().getMeshByName(d.name)||SCENE().getNodeByName(d.name); if(m) selectMesh(m); }),
          btn('Remove', ()=> { STATE.doors.splice(idx,1); renderDoorList(); })
        ]);
        host.appendChild(row);
      });
    }
  }

  // ---- math for Doors ----
  function computeHingePivot(mesh, side='minX'){
    const bb = mesh.getBoundingInfo().boundingBox;
    const min = bb.minimumWorld, max = bb.maximumWorld;
    let x = (min.x+max.x)/2, y = (min.y+max.y)/2, z = (min.z+max.z)/2;
    if (side==='minX') x = min.x;
    if (side==='maxX') x = max.x;
    if (side==='minZ') z = min.z;
    if (side==='maxZ') z = max.z;
    return new BABYLON.Vector3(x,y,z);
  }

  function easingFromName(name){
    let e;
    switch(name){
      case 'CubicInOut': e = new BABYLON.CubicEase(); e.setEasingMode(BABYLON.EasingFunction.EASINGMODE_EASEINOUT); break;
      case 'SineInOut':  e = new BABYLON.SineEase();  e.setEasingMode(BABYLON.EasingFunction.EASINGMODE_EASEINOUT); break;
      case 'BackOut':    e = new BABYLON.BackEase();  e.setEasingMode(BABYLON.EasingFunction.EASINGMODE_EASEOUT); break;
      default:           e = null;
    }
    return e;
  }

  function playDoor(mesh, targetAngleDeg, durationMs, axis='Y', easeName='CubicInOut'){
    if (!mesh) return toast('Pick a door mesh first');
    const s=SCENE(); if(!s) return;
    const fps = 60, frames=Math.round(durationMs/1000 * fps);
    const startAngle = mesh.rotation[axis.toLowerCase()] || 0;
    const endAngle = BABYLON.Tools.ToRadians(targetAngleDeg);

    const anim = new BABYLON.Animation('doorRot', `rotation.${axis.toLowerCase()}`, fps, BABYLON.Animation.ANIMATIONTYPE_FLOAT, BABYLON.Animation.ANIMATIONLOOPMODE_CONSTANT);
    anim.setKeys([{frame:0, value:startAngle}, {frame:frames, value:endAngle}]);
    const easing = easingFromName(easeName); if (easing) anim.setEasingFunction(easing);
    return s.beginDirectAnimation(mesh, [anim], 0, frames, false);
  }

  // ---- export JS (runtime helper + config) ----
  function renderDoorsJS(doors){
    const cfg = JSON.stringify(doors, null, 2);
    return `// Auto-generated by DevTools Doors tab
(function(){
  if (window.DOORS_RUNTIME) return;
  const DOORS_CONFIG = ${cfg};

  function easingFromName(name){
    let e;
    switch(name){
      case 'CubicInOut': e = new BABYLON.CubicEase(); e.setEasingMode(BABYLON.EasingFunction.EASINGMODE_EASEINOUT); break;
      case 'SineInOut':  e = new BABYLON.SineEase();  e.setEasingMode(BABYLON.EasingFunction.EASINGMODE_EASEINOUT); break;
      case 'BackOut':    e = new BABYLON.BackEase();  e.setEasingMode(BABYLON.EasingFunction.EASINGMODE_EASEOUT); break;
      default:           e = null;
    }
    return e;
  }
  function setPivotWorld(mesh, p){
    if(!mesh.isPivotSet) {
        mesh.setPivotPoint(new BABYLON.Vector3(p.x,p.y,p.z), BABYLON.Space.WORLD);
    }
  }

  const DoorRuntime = { byName:{} };
  window.DOORS_RUNTIME = DoorRuntime;

  window.applyDoorsConfig = function(scene, doors){
    (doors||DOORS_CONFIG||[]).forEach(d=>{
      const mesh = scene.getMeshByName(d.name);
      if (!mesh) return;
      setPivotWorld(mesh, d.pivotWorld);
      DoorRuntime.byName[d.name] = { open:false, mesh, cfg:d };
    });
  };

  window.toggleDoor = function(name){
    const ent = DoorRuntime.byName[name]; if (!ent) return;
    const { mesh, cfg } = ent;
    const isOpen = ent.open;
    const targetAngleDeg = isOpen ? 0 : cfg.openAngleDeg;
    const axis = cfg.axis.toLowerCase();
    
    const s = mesh.getScene();
    const fps = 60;
    const frames = Math.round(cfg.durationMs/1000 * fps);
    const startAngle = mesh.rotation[axis] || 0;
    const endAngle = BABYLON.Tools.ToRadians(targetAngleDeg);

    const anim = new BABYLON.Animation('doorToggle', \`rotation.\${axis}\`, fps, BABYLON.Animation.ANIMATIONTYPE_FLOAT, BABYLON.Animation.ANIMATIONLOOPMODE_CONSTANT);
    anim.setKeys([{frame:0, value:startAngle}, {frame:frames, value:endAngle}]);
    const easing = easingFromName(cfg.easing); if (easing) anim.setEasingFunction(easing);
    
    const a = s.beginDirectAnimation(mesh,[anim],0,frames,false);
    a.onAnimationEndObservable.add(()=>{ ent.open = !isOpen; });
  };

  window.toggleNearestDoor = function(maxDist=2.5){
    const cam = window.camera;
    if (!cam) return;
    let best=null, bestD=Infinity;
    for (const name in DoorRuntime.byName){
      const ent = DoorRuntime.byName[name];
      const pos = ent.mesh.getAbsolutePosition();
      const d = BABYLON.Vector3.Distance(cam.globalPosition || cam.position, pos);
      if (d < bestD && d <= maxDist){ best=ent; bestD=d; }
    }
    if (best){ toggleDoor(best.mesh.name); }
  };
})();`;
  }

  // ------------ Add tabs to panel ------------
  function buildPanel(){
    if (!ensurePanel()) return;
    const tabs = {
      Map: buildMapUI,
      Nodes: buildNodesUI,
      "Mesh+": buildMeshPlusUI,
      Doors: buildDoorsUI,
    };
    Object.entries(tabs).forEach(([name,fn],i)=> addTab(name, fn, i===0));
  }

  // ------------------ init + loops ------------------
  function pointerObserver(){
    const s=SCENE(); if(!s) return;
    s.onPointerObservable.add((pi)=>{
      if (pi.type===BABYLON.PointerEventTypes.POINTERDOWN && STATE.clickTeleport){
          const p = s.createPickingRay(s.pointerX, s.pointerY, BABYLON.Matrix.Identity(), window.camera);
          const hit = s.pickWithRay(p, m=>m && m.isPickable!==false);
          if (hit?.hit){ 
              const rig = window.PlayerRig?.getRigRoot();
              if (rig) {
                const t = hit.pickedPoint.clone();
                t.y += 1.0; // height offset
                rig.position.copyFrom(t);
                toast('Teleported'); 
              }
          }
      }
    });
  }
  function fpsLoop(){
    const eng=ENGINE(); if(!eng || !STATE.fpsEl) return;
    STATE.fpsEl.textContent = `FPS: ${eng.getFps().toFixed(0)}`;
  }
  function init(){
    if (STATE.ready) return;
    const toggle = $('#devtools-toggle'), panel = $('#devtools-panel');
    if (!toggle || !panel || !SCENE() || !window.camera) return;
    
    toggle.style.display='block';
    toggle.onclick = ()=>{ 
        const isHidden = panel.style.display ==='none' || !panel.style.display;
        panel.style.display = isHidden ? 'block' : 'none';
        if(isHidden) {
            PP.pointerLock?.hold('devtools');
        } else {
            PP.pointerLock?.release('devtools');
        }
    };
    
    buildPanel();
    pointerObserver();
    SCENE().onBeforeRenderObservable.add(fpsLoop);
    STATE.ready=true;
    toast('Dev Tools v4 ready', 900);
  }
  
  const id = setInterval(()=>{ try{ if ($('#devtools-panel') && SCENE() && window.camera){ clearInterval(id); init(); } }catch{} }, 200);

})();
