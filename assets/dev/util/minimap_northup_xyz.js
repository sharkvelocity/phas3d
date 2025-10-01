/* File: assets/dev/util/minimap_northup_xyz.js
   North-up minimap with toggle button. Also drives the XYZ HUD from player body.
*/
(function(){
  if (window.__PP_MINIMAP_V3__) return; window.__PP_MINIMAP_V3__ = true;

  const UI = {
    btn: null,
    wrap: null,
    canvas: null,
    open: false
  };

  function S(){ return window.scene || window.__SCENE || BABYLON.EngineStore?.LastCreatedScene || null; }
  function cfg() { return window.PP?.controls?.keys; }

  function ensureUI(){
    if (UI.wrap) return;
    const wrap = document.createElement('div');
    Object.assign(wrap.style, {
      position:'fixed', left:'10px', top:'10px', zIndex:8000,
      display:'flex', flexDirection:'column', gap:'6px'
    });

    const btn = document.createElement('button');
    btn.textContent = 'Map [M]';
    Object.assign(btn.style, {
      border:'1px solid transparent', borderRadius:'8px',
      padding:'6px 10px', background:'#0b1518', color:'#9ef',
      cursor:'pointer'
    });
    btn.addEventListener('click', toggle);

    const cv = document.createElement('canvas');
    cv.width = 220; cv.height = 220;
    Object.assign(cv.style, {
      display:'none',
      width:'220px', height:'220px',
      border:'none',
      borderRadius:'50%',           // circular look
      background:'rgba(0,0,0,0.45)',
      boxShadow:'0 0 0 1px rgba(0,255,255,0.15) inset, 0 2px 12px rgba(0,0,0,0.5)'
    });

    wrap.appendChild(btn);
    wrap.appendChild(cv);
    document.body.appendChild(wrap);

    UI.btn = btn; UI.wrap = wrap; UI.canvas = cv;
  }

  function toggle(){
    UI.open = !UI.open;
    UI.canvas.style.display = UI.open ? 'block' : 'none';
  }

  function playerPos(){
    // Use the new PlayerRig's root node for the most accurate position
    const rigRoot = window.PlayerRig?.getRigRoot();
    if (rigRoot) {
      return rigRoot.getAbsolutePosition?.() || rigRoot.position;
    }
    // Fallback for older systems
    return S()?.activeCamera?.position || null;
  }

  // XYZ HUD updater (pulls from the same source)
  function loopXYZ(){
    const el = document.getElementById('hud-xyz');
    if (!el) { requestAnimationFrame(loopXYZ); return; }
    function tick(){
      const p = playerPos();
      if (p) el.textContent = `XYZ: ${p.x.toFixed(2)}, ${p.y.toFixed(2)}, ${p.z.toFixed(2)}`;
      requestAnimationFrame(tick);
    }
    tick();
  }

  // Very lightweight map: north-up top-down with player dot + heading
  function loopMap(){
    const s = S();
    const ctx = UI.canvas?.getContext('2d');
    if (!s || !ctx){ requestAnimationFrame(loopMap); return; }

    function tick(){
      if (UI.open){
        const w = UI.canvas.width, h = UI.canvas.height;
        ctx.clearRect(0,0,w,h);

        // subtle grid
        ctx.globalAlpha = 0.35;
        ctx.beginPath();
        for (let i=10;i<w;i+=20){ ctx.moveTo(i,0); ctx.lineTo(i,h); }
        for (let j=10;j<h;j+=20){ ctx.moveTo(0,j); ctx.lineTo(w,j); }
        ctx.lineWidth = 1; ctx.strokeStyle = 'rgba(0,255,255,0.12)'; ctx.stroke();
        ctx.globalAlpha = 1;

        // player dot at center
        ctx.beginPath();
        ctx.arc(w/2, h/2, 4, 0, Math.PI*2);
        ctx.fillStyle = '#0ff'; ctx.fill();

        // heading arrow (camera forward projected onto XZ plane)
        const cam = s.activeCamera || window.camera;
        if (cam && cam.getDirection){
            const f = cam.getDirection(BABYLON.Vector3.Forward()); 
            // The forward vector in a north-up map is aligned with the Z axis.
            // We need to rotate this based on the player's yaw.
            const yaw = window.PlayerRig?.getState()?.yaw || 0;
            const headingX = Math.sin(yaw);
            const headingZ = Math.cos(yaw);

            const len = 18;
            ctx.beginPath();
            ctx.moveTo(w/2, h/2);
            // In canvas, +Y is down, so we use Z for Y. +X is right.
            ctx.lineTo(w/2 + headingX * len, h/2 - headingZ * len);
            ctx.lineWidth = 2; ctx.strokeStyle = '#8ff'; ctx.stroke();
        }


        // 'N' indicator (always at the top)
        ctx.font = '12px monospace';
        ctx.fillStyle = '#9ef';
        ctx.fillText('N', w/2 - 4, 14);
      }
      requestAnimationFrame(tick);
    }
    tick();
  }
  
  function bindKeys() {
      window.addEventListener('keydown', (e) => {
          const keyMap = cfg()?.minimap;
          if (keyMap?.includes(e.code)) {
              toggle();
          }
      });
  }

  function start(){
    ensureUI();
    loopXYZ();
    loopMap();
    bindKeys();
  }

  // mount on start
  window.addEventListener('pp:start', start, { once:true });
  if (window.__PP_ALREADY_STARTED__) start();
})();