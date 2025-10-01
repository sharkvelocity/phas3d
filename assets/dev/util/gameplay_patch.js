// === Gameplay Patch: storage, belt safety, vanZone spawn, exterior rain ===
window.PP = window.PP || {}; PP.cfg = PP.cfg || {}; PP.state = PP.state || {};
PP.cfg.spawnWS = PP.cfg.spawnWS || new BABYLON.Vector3(47.52, 0.22, -105.28);
const BASE_URL = "https://sharkvelocity.github.io/phas3d/";

// ---------------- storage ----------------
PP.storage = PP.storage || (function(){
  const KEY_INV='pp_inventory_v1', KEY_FLAGS='pp_flags_v1';
  function get(k,d){ try{return JSON.parse(localStorage.getItem(k)) ?? d;}catch(_){return d;} }
  function set(k,v){ localStorage.setItem(k, JSON.stringify(v)); return v; }
  return {
    saveInventory: inv => set(KEY_INV, inv),
    loadInventory: () => get(KEY_INV, {slots:[], equipped:0}),
    getFlag: (k,d=false)=>{ const f=get(KEY_FLAGS,{}); return (k in f)?f[k]:d; },
    setFlag: (k,v)=>{ const f=get(KEY_FLAGS,{}); f[k]=v; set(KEY_FLAGS,f); }
  };
})();

// ---------------- belt (SAFE) ----------------
function getBelt(){ return document.getElementById('belt') || document.getElementById('item-belt'); }

function buildBelt(slots){
  const bar = getBelt(); if (!bar) return;
  bar.innerHTML='';
  
  const inv = slots ? { slots, equipped: PP.storage.loadInventory().equipped } : PP.storage.loadInventory();
  if (!inv.slots) return;

  inv.slots.forEach((id,i)=>{
    const def = PP.inventory.catalog.find(d=>d.id===id) || {name:id,icon:''};
    const el=document.createElement('div');
    el.className='belt-slot'+(i===inv.equipped?' active':'');
    el.innerHTML = (def.icon?`<img src="${def.icon}" style="max-width:48px;max-height:48px;object-fit:contain">`:`<span style="font-size:10px;color:#adf">${def.name}</span>`)
     + `<div class="slot-key">${i+1}</div>`;
    el.onclick = ()=> setEquipped(i);
    bar.appendChild(el);
  });
}
window.buildBelt = buildBelt;

function setEquipped(i){
  const inv = PP.storage.loadInventory();
  if (!inv.slots || !inv.slots.length) return;
  inv.equipped = Math.max(0, Math.min(i, inv.slots.length-1));
  PP.storage.saveInventory(inv);

  const bar = getBelt(); if (!bar) return;
  [...bar.children].forEach((el,idx)=> el.classList.toggle('active', idx===inv.equipped));
  
  const itemDef = PP.inventory.catalog.find(item => item.id === inv.slots[inv.equipped]);
  window.dispatchEvent(new CustomEvent('pp:belt:equip', { detail: { item: itemDef, slot: inv.equipped } }));
}

function cycleSlot(dir){
  const inv = PP.storage.loadInventory();
  if (!inv.slots || !inv.slots.length) return;
  inv.equipped = (inv.equipped + (dir>0?1:-1) + inv.slots.length) % inv.slots.length;
  setEquipped(inv.equipped); // this will save and update UI
}

// Attach wheel ONLY once belt exists
(function attachWheelWhenReady(){
  function onWheel(e){
    const bar = getBelt(); if (!bar) return;
    if (e.deltaY > 0) cycleSlot(+1);
    else if (e.deltaY < 0) cycleSlot(-1);
  }
  function tryAttach(){
    const belt = document.querySelector('.item-belt');
    if (belt) belt.addEventListener('wheel', onWheel, { passive:true });
    else setTimeout(tryAttach, 50);
  }
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', tryAttach, { once:true });
  } else { tryAttach(); }
})();


// ---------------- item scatter (placeholder) ----------------
function scatterItems(slots){
  const sc = BABYLON.Engine?.LastCreatedScene || window.scene;
  if (!sc) return;
  const s = computeSpawnWS();
  (slots||PP.storage.loadInventory().slots).forEach((id,idx)=>{
    const node=new BABYLON.TransformNode('item_in_van_'+id, sc);
    node.position = new BABYLON.Vector3(s.x+1.2+0.6*idx, s.y-1.6, s.z-1.5);
  });
}

// ---------------- spawn helpers (vanZone aware) ----------------
function toRad(d){ return d*Math.PI/180; }
function localToWorld(p, def){
  const s=(def?.scale ?? 1), yaw=toRad(def?.rotationY ?? 0);
  const cos=Math.cos(yaw), sin=Math.sin(yaw);
  const x=(p?.x??0)*s, y=(p?.y??0)*s, z=(p?.z??0)*s;
  const xr=x*cos - z*sin, zr=x*sin + z*cos;
  return new BABYLON.Vector3((def?.offset?.x??0)+xr, (def?.offset?.y??0)+y, (def?.offset?.z??0)+zr);
}

function computeSpawnWS(){
    if (window.PP_SPAWN_POS) {
        return window.PP_SPAWN_POS.clone();
    }
  try{
    if (window.MAP_DEF){
      if (MAP_DEF.vanZone && MAP_DEF.vanZone.center){
        const c = MAP_DEF.vanZone.center;
        const v = localToWorld({x:c.x, y:c.y||1.8, z:c.z}, MAP_DEF);
        return new BABYLON.Vector3(v.x, (c.y||1.8), v.z);
      }
      if (MAP_DEF.spawn){
        return new BABYLON.Vector3(MAP_DEF.spawn.x||0, MAP_DEF.spawn.y||1.8, MAP_DEF.spawn.z||0);
      }
    }
  }catch(_){}
  return PP.cfg.spawnWS || new BABYLON.Vector3(0,1.8,0);
}

function forceSpawn(){
  const rig = window.PlayerRig?.getRigRoot();
  const rigState = window.PlayerRig?.getState();
  
  // Exit if the player rig isn't fully initialized yet.
  if (!rig || !rigState) return;
  
  const p = computeSpawnWS();
  rig.position.copyFrom(p);

  // Set initial view direction by modifying the rig's state, NOT the camera directly.
  // This prevents conflicts between this script and the player controller.
  // A yaw of 0 radians makes the player face "north" (positive Z axis).
  rigState.yaw = 0;
  rigState.pitch = 0;
}

// ---------------- exterior rain (guards) ----------------
function exteriorRain(){
  const sc = BABYLON.Engine?.LastCreatedScene || window.scene;
  if (!sc) return;
  const ext=(window.MAP_DEF && Array.isArray(window.MAP_DEF.exterior))?MAP_DEF.exterior:null;
  if(!ext || ext.length<3) return;
  const likelyLocal = Math.max(...ext.map(p=>Math.abs(p.x))) < 100 && Math.max(...ext.map(p=>Math.abs(p.z))) < 100;
  const poly = likelyLocal ? ext.map(p=>localToWorld(p, MAP_DEF)) : ext.map(p=>new BABYLON.Vector3(p.x,0,p.z));
  let minX=Infinity,maxX=-Infinity,minZ=Infinity,maxZ=-Infinity;
  for(const v of poly){ minX=Math.min(minX,v.x); maxX=Math.max(maxX,v.x); minZ=Math.min(minZ,v.z); maxZ=Math.max(maxZ,v.z); }
  function inside(px,pz){
    let ok=false; for(let i=0,j=poly.length-1;i<poly.length;j=i){
      const A=poly[i], B=poly[j];
      const hit=((A.z>pz)!=(B.z>pz)) && (px < (B.x-A.x)*(pz-A.z)/((B.z-A.z)||1e-9)+A.x);
      if(hit) ok=!ok;
    } return ok;
  }
  const tpl = new BABYLON.ParticleSystem("rain_template", 2000, sc);
  try { tpl.particleTexture = new BABYLON.Texture(`${BASE_URL}assets/textures/rain.png`, sc, true, false); } catch(_){}
  tpl.blendMode = BABYLON.ParticleSystem.BLENDMODE_STANDARD;
  tpl.isBillboardBased = true; tpl.updateSpeed=0.02;
  tpl.minSize=0.05; tpl.maxSize=0.15; tpl.minEmitPower=4; tpl.maxEmitPower=7;
  tpl.gravity = new BABYLON.Vector3(0,-9.81,0);
  const STEP=6, YTOP=14, EMIT=5, MAXR=60;
  const centers=[];
  for(let x=minX;x<=maxX;x+=STEP){ for(let z=minZ;z<=maxZ;z+=STEP){ if(inside(x,z)) centers.push(new BABYLON.Vector3(x,YTOP,z)); } }
  const emitters=[];
  for(const c of centers){
    const node=new BABYLON.TransformNode("rain_emitter",sc); node.position.copyFrom(c);
    const ps=tpl.clone("rain_ps",node); ps.isLocal=false; ps.emitter=node;
    ps.createBoxEmitter(new BABYLON.Vector3(-EMIT,0,-EMIT),new BABYLON.Vector3(EMIT,0,EMIT),new BABYLON.Vector3(0,-1,0),0,0);
    emitters.push({node,ps});
  }
  sc.onBeforeRenderObservable.add(()=>{
    const p=sc.activeCamera?.position||BABYLON.Vector3.Zero(); const r2=MAXR*MAXR;
    for(const e of emitters){
      const d2=BABYLON.Vector3.DistanceSquared(p,e.node.position);
      const on=d2<r2; if(on && !e.ps.isStarted()) e.ps.start(); else if(!on && e.ps.isStarted()) e.ps.stop();
    }
  });
}

// ---------------- post-load hook ----------------
(function attachAfterLoad(){
  function run() {
    try{
      forceSpawn();
      exteriorRain();
      let inv = PP.storage.loadInventory();
      if (!inv || !Array.isArray(inv.slots) || !inv.slots.length) {
        inv = { slots: ['emf','spirit','uv'], equipped: 0 }; 
        PP.storage.saveInventory(inv);
      }
      buildBelt(inv.slots);
      setEquipped(inv.equipped);
      scatterItems(inv.slots);
    } catch(e){ console.warn('Gameplay patch post-load error', e); }
  }

  window.addEventListener('pp:start', () => setTimeout(run, 200), { once: true });
})();