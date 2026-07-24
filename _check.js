
// ============================================================
// DATA
// ============================================================
const ANTONYMS={accept:'refuse',refuse:'accept',increase:'decrease',decrease:'increase',temporary:'permanent',permanent:'temporary',positive:'negative',negative:'positive',generous:'selfish',selfish:'generous',external:'internal',internal:'external',majority:'minority',minority:'majority',advantage:'disadvantage',disadvantage:'advantage',guilty:'innocent',innocent:'guilty',formal:'casual',casual:'formal'};
const THEMES={Work:['schedule','deadline','budget','colleague','presentation','interview','promote','negotiate','manage','achieve','goal','strategy','perform','contribute','cooperate','feedback','compromise','responsibility','appointment','customer','policy','procedure','application','department','contract','agreement'],Emotions:['disappointed','grateful','proud','jealous','guilty','anxious','nervous','relieved','confident','confused','annoyed','embarrassed','curious','brave','patient','generous','selfish','honest','eager','reluctant','calm','sensitive','tough','desperate','enthusiastic','innocent','regret','suffer','comfort','praise'],Communication:['conversation','dialogue','argument','debate','negotiate','persuade','suggest','mention','describe','explain','express','declare','emphasize','summarize','request','complain','apologize','respond','interrupt','criticize','warn','promise','insist','advocate','acknowledge','inform','indicate','interpret'],Tech:['access','device','network','data','platform','application','install','develop','design','create','digital','software','internet','connect','efficient','transform','research','analysis','solution','capture','display','signal','generate','implement','program','automate','artificial'],Daily:['habit','routine','comfort','convenient','waste','bother','manage','handle','deal','struggle','survive','balance','afford','prefer','prepare','organize','arrange','cancel','decide','choose','option','opportunity','risk','effort','attention','progress','improve','reduce','adjust','adapt'],Learning:['research','analysis','definition','concept','principle','theory','evidence','prove','demonstrate','examine','evaluate','assess','determine','identify','recognize','realize','discover','explore','conclude','summarize','illustrate','define','describe','compare','contrast','calculate','measure','concentrate','focus','understand'],Change:['increase','decrease','improve','reduce','develop','transform','evolve','adapt','adjust','progress','decline','expand','extend','eliminate','replace','reform','convert','grow','rise','fall','emerge','disappear','create','destroy','establish','abandon'],Society:['culture','tradition','community','population','economy','government','policy','election','justice','rights','responsibility','freedom','conflict','protest','reform','education','environment','resource','majority','minority','individual','society','global','local','public','private']};
const WORD_THEMES={};Object.entries(THEMES).forEach(([t,ws])=>{ws.forEach(w=>{if(!WORD_THEMES[w])WORD_THEMES[w]=[];WORD_THEMES[w].push(t);});});

const EDGES={root:{color:'#30d158',active:true},syn:{color:'#0a84ff',active:true},ant:{color:'#ff453a',active:true},theme:{color:'#ff9f0a',active:true},coll:{color:'#aeaeb2',active:true}};

// ============================================================
// BUILD GRAPH
// ============================================================
const nodes=[],nodeMap={};
WORD_BANK_W.forEach((w,i)=>{
  const n={id:i,word:w.w,zh:WORDS_500[i]?.zh||'',phon:PH[w.w]||'',def:w.def,ex:w.ex,pos:w.pos,root:w.root||'',x:0,y:0,vx:0,vy:0,radius:0,connections:[],mastery:null};
  nodes.push(n);nodeMap[w.w]=n;
});
const N=nodes.length;

// Load screening
try{const d=JSON.parse(localStorage.getItem('vocab_screening_v3')||'{}');if(d.results)Object.entries(d.results).forEach(([k,v])=>{const i=parseInt(k);if(i<N)nodes[i].mastery=v;});}catch(e){}

// Build connections
function addEdge(a,b,type,label){
  if(a===b)return;
  if(a.connections.find(c=>c.node===b&&c.type===type))return;
  a.connections.push({node:b,type,label});
}
nodes.forEach(n=>{
  const word=n.word;
  // Root family
  const f=findRootFamily(word);
  if(f){Object.keys(f.words).forEach(w=>{if(w!==word&&nodeMap[w])addEdge(n,nodeMap[w],'root',f.root.split('=')[0].trim());});}
  // Synonyms
  const wd=WORD_BANK_W[n.id];
  if(wd&&wd.syn){wd.syn.split(/[,，]/).forEach(s=>{const sw=s.trim();if(sw&&sw!==word&&nodeMap[sw])addEdge(n,nodeMap[sw],'syn','近义');});}
  // Antonyms
  if(ANTONYMS[word]&&nodeMap[ANTONYMS[word]])addEdge(n,nodeMap[ANTONYMS[word]],'ant','反义');
  // Theme
  if(WORD_THEMES[word])WORD_THEMES[word].forEach(t=>{(THEMES[t]||[]).forEach(tw=>{if(tw!==word&&nodeMap[tw]&&n.connections.filter(c=>c.type==='theme').length<2)addEdge(n,nodeMap[tw],'theme',t);});});
  // Collocations
  if(wd&&wd.coll)wd.coll.split('/').forEach(p=>{p.trim().split(/\s+/).filter(w=>w.length>3&&!/^(the|and|or|to|in|on|at|for|of|with|by|that|not|from)$/i.test(w)).forEach(cw=>{const cl=cw.replace(/[(),….;:]/g,'');if(cl!==word&&nodeMap[cl])addEdge(n,nodeMap[cl],'coll','搭配');});});
});

// Set radii based on connection count
nodes.forEach(n=>{n.radius=6+Math.min(14,n.connections.length*1.5);});

// ============================================================
// FORCE-DIRECTED LAYOUT
// ============================================================
function runForce(iterations=200){
  const W=2000,H=2000;
  const centerX=W/2,centerY=H/2;
  // Init positions randomly around center
  nodes.forEach(n=>{n.x=centerX+(Math.random()-0.5)*800;n.y=centerY+(Math.random()-0.5)*800;n.vx=0;n.vy=0;});

  for(let iter=0;iter<iterations;iter++){
    const temp=Math.max(0.1,1-iter/iterations);
    // Repulsion
    for(let i=0;i<N;i++){
      for(let j=i+1;j<N;j++){
        const dx=nodes[j].x-nodes[i].x,dy=nodes[j].y-nodes[i].y;
        const dist=Math.max(1,Math.sqrt(dx*dx+dy*dy));
        const force=200*temp/Math.max(dist,10);
        const fx=dx/dist*force,fy=dy/dist*force;
        nodes[i].vx-=fx;nodes[i].vy-=fy;
        nodes[j].vx+=fx;nodes[j].vy+=fy;
      }
    }
    // Attraction (springs along edges)
    nodes.forEach(n=>{
      n.connections.forEach(c=>{
        const dx=c.node.x-n.x,dy=c.node.y-n.y;
        const dist=Math.sqrt(dx*dx+dy*dy);
        const targetDist=60+n.radius+c.node.radius;
        if(dist>targetDist){
          const force=(dist-targetDist)*0.01*temp;
          n.vx+=dx/dist*force;n.vy+=dy/dist*force;
          c.node.vx-=dx/dist*force;c.node.vy-=dy/dist*force;
        }
      });
    });
    // Center gravity
    nodes.forEach(n=>{
      const dx=centerX-n.x,dy=centerY-n.y;
      n.vx+=dx*0.001*temp;n.vy+=dy*0.001*temp;
    });
    // Apply + damp
    nodes.forEach(n=>{n.vx*=0.85;n.vy*=0.85;n.x+=n.vx;n.y+=n.vy;n.x=Math.max(50,Math.min(W-50,n.x));n.y=Math.max(50,Math.min(H-50,n.y));});
  }
}
runForce(200);

// ============================================================
// CANVAS SETUP
// ============================================================
const canvas=document.getElementById('c');
const ctx=canvas.getContext('2d');
let W,H;

function resize(){
  W=canvas.width=window.innerWidth;H=canvas.height=window.innerHeight;
}
resize();window.addEventListener('resize',()=>{resize();render();});

// View state
let viewX=0,viewY=0,zoom=0.35;
let hovered=null,dragged=null,dragOX=0,dragOY=0;
let panning=false,panSX=0,panSY=0,panVX=0,panVY=0;
let subGraphRoot=null; // null = global view

// Convert screen coords to world
function toWorld(sx,sy){return{x:(sx-viewX)/zoom,y:(sy-viewY)/zoom};}
function toScreen(wx,wy){return{wx*zoom+viewX,wy*zoom+viewY};}

// ============================================================
// RENDER
// ============================================================
function getNodeScreenPos(n){
  return {x:n.x*zoom+viewX,y:n.y*zoom+viewY};
}

function getNodeColor(n){
  if(n.mastery==='mastered')return 'rgba(72,72,74,0.6)';
  if(n.mastery==='unknown')return 'rgba(255,69,58,0.7)';
  if(n.mastery==='passive')return 'rgba(255,159,10,0.7)';
  return 'rgba(174,174,178,0.5)';
}

function getVisibleNodes(){
  if(!subGraphRoot)return nodes;
  const seen=new Set([subGraphRoot.id]);
  const queue=[subGraphRoot];
  while(queue.length){
    const n=queue.shift();
    n.connections.forEach(c=>{
      if(!seen.has(c.node.id)&&EDGES[c.type]&&EDGES[c.type].active){
        // Include 2 levels deep
        seen.add(c.node.id);
        c.node.connections.forEach(c2=>{
          if(!seen.has(c2.node.id)&&EDGES[c2.type]&&EDGES[c2.type].active)seen.add(c2.node.id);
        });
      }
    });
  }
  return nodes.filter(n=>seen.has(n.id));
}

function render(){
  ctx.clearRect(0,0,W,H);
  const visible=getVisibleNodes();
  const visSet=new Set(visible.map(n=>n.id));

  // Draw edges
  visible.forEach(n=>{
    n.connections.forEach(c=>{
      if(!visSet.has(c.node.id))return;
      if(c.node.id<n.id)return; // draw each edge once
      const e=EDGES[c.type];if(!e||!e.active)return;
      const p1=getNodeScreenPos(n),p2=getNodeScreenPos(c.node);
      const highlight=(hovered===n||hovered===c.node);
      ctx.strokeStyle=e.color;
      ctx.globalAlpha=highlight?0.6:0.12;
      ctx.lineWidth=highlight?1.5:0.5;
      ctx.beginPath();ctx.moveTo(p1.x,p1.y);ctx.lineTo(p2.x,p2.y);ctx.stroke();
      ctx.globalAlpha=1;
    });
  });

  // Draw nodes
  visible.forEach(n=>{
    const p=getNodeScreenPos(n);
    const r=Math.max(4,n.radius*zoom);
    const highlight=(hovered===n);
    ctx.beginPath();ctx.arc(p.x,p.y,r,0,Math.PI*2);
    const color=getNodeColor(n);
    ctx.fillStyle=color;
    if(highlight)ctx.fillStyle=n.mastery==='mastered'?'rgba(120,120,122,0.9)':n.mastery==='unknown'?'#ff453a':n.mastery==='passive'?'#ff9f0a':'#fff';
    ctx.fill();
    if(highlight||n.connections.length>5){
      ctx.strokeStyle=highlight?'#fff':'rgba(255,255,255,0.15)';
      ctx.lineWidth=highlight?2:0.5;ctx.stroke();
    }
    // Label
    if(zoom>0.25||highlight){
      ctx.fillStyle=highlight?'#fff':n.mastery==='mastered'?'rgba(255,255,255,0.25)':'rgba(255,255,255,0.55)';
      ctx.font=`${Math.max(8,r*1.2)}px -apple-system,BlinkMacSystemFont,sans-serif`;
      ctx.textAlign='center';ctx.fillText(n.word,p.x,p.y+r+12);
    }
  });

  // Hovered node: highlight connections
  if(hovered){
    const p=getNodeScreenPos(hovered);
    // Pulse ring
    ctx.beginPath();ctx.arc(p.x,p.y,hovered.radius*zoom+4,0,Math.PI*2);
    ctx.strokeStyle='rgba(255,255,255,0.3)';ctx.lineWidth=2;ctx.stroke();
  }
}

// ============================================================
// INTERACTION
// ============================================================
function findNodeAt(sx,sy){
  const{wx,wy}=toWorld(sx,sy);
  const hitRadius=20/zoom;
  for(let i=visibleNodes.length-1;i>=0;i--){
    const n=visibleNodes[i];
    const dx=n.x-wx,dy=n.y-wy;
    if(Math.sqrt(dx*dx+dy*dy)<n.radius+hitRadius)return n;
  }
  return null;
}

let visibleNodes=nodes;
canvas.addEventListener('mousemove',e=>{
  const sx=e.clientX,sy=e.clientY;
  if(dragged){
    const{wx,wy}=toWorld(sx,sy);
    dragged.x=wx-dragOX;dragged.y=wy-dragOY;
    render();return;
  }
  if(panning){
    viewX=sx-panSX+panVX;viewY=sy-panSY+panVY;
    render();return;
  }
  const was=hovered;hovered=findNodeAt(sx,sy);
  if(hovered!==was){render();updateTooltip(e.clientX,e.clientY,hovered);}
  if(!hovered){updateTooltip(0,0,null);}
});
canvas.addEventListener('mousedown',e=>{
  const n=findNodeAt(e.clientX,e.clientY);
  if(n){
    if(e.shiftKey||e.button===2){dragged=n;dragOX=n.x-e.clientX/zoom;dragOY=n.y-e.clientY/zoom;return;}
  }else{panning=true;panSX=e.clientX;panSY=e.clientY;panVX=viewX;panVY=viewY;}
});
canvas.addEventListener('mouseup',()=>{dragged=null;panning=false;});
canvas.addEventListener('mouseleave',()=>{dragged=null;panning=false;hovered=null;render();updateTooltip(0,0,null);});
canvas.addEventListener('wheel',e=>{
  e.preventDefault();
  const zf=e.deltaY<0?1.1:0.9;
  const mx=e.clientX,my=e.clientY;
  viewX=mx-(mx-viewX)*zf;viewY=my-(my-viewY)*zf;
  zoom=Math.max(0.1,Math.min(2,zoom*zf));
  visibleNodes=getVisibleNodes();render();
},{passive:false});
canvas.addEventListener('click',e=>{
  const n=findNodeAt(e.clientX,e.clientY);
  if(n&&!dragged){
    subGraphRoot=n;visibleNodes=getVisibleNodes();
    // Center on node
    viewX=W/2-n.x*zoom;viewY=H/2-n.y*zoom;
    document.getElementById('subHint').classList.add('show');
    setTimeout(()=>document.getElementById('subHint').classList.remove('show'),2500);
    render();
  }
});
canvas.addEventListener('dblclick',e=>{
  const n=findNodeAt(e.clientX,e.clientY);
  if(n){openDetail(n);}else{subGraphRoot=null;visibleNodes=getVisibleNodes();resetView();render();}
});
canvas.addEventListener('contextmenu',e=>{e.preventDefault();});

function updateTooltip(tx,ty,n){
  const t=document.getElementById('tooltip');
  if(!n){t.style.opacity='0';return;}
  t.style.opacity='1';t.style.left=(tx+16)+'px';t.style.top=(ty-16)+'px';
  t.innerHTML=`<div class="t-word">${n.word}</div><div class="t-phon">${n.phon} ${n.pos}</div><div class="t-def">${n.def.slice(0,60)}…</div>`;
}

// ============================================================
// DETAIL PANEL
// ============================================================
function openDetail(n){
  const panel=document.getElementById('detailPanel');
  const content=document.getElementById('detailContent');
  const lvl=n.mastery;
  content.innerHTML=`
    <div class="d-word">${n.word}</div>
    <div class="d-meta"><span class="d-phon">${n.phon}</span><span class="d-pos">${n.pos}</span></div>
    <div class="d-def">${n.def}</div>
    ${n.ex?`<div class="d-ex">${n.ex}</div>`:''}
    ${n.root?`<div class="d-root">🧬 ${n.root}</div>`:''}
    <div class="d-related"><h4>关联词 (${n.connections.length})</h4>
      ${n.connections.slice(0,12).map(c=>`<span class="rel-tag" onclick="jumpToNode(${c.node.id})">${c.word}</span>`).join('')}
    </div>
    <div class="rating-row">
      <button style="${lvl==='unknown'?'background:rgba(255,69,58,0.2);color:#ff453a':''}" onclick="markNode(${n.id},'unknown')">不认识</button>
      <button style="${lvl==='passive'?'background:rgba(255,159,10,0.2);color:#ff9f0a':''}" onclick="markNode(${n.id},'passive')">模糊</button>
      <button style="${lvl==='mastered'?'background:rgba(48,209,88,0.2);color:#30d158':''}" onclick="markNode(${n.id},'mastered')">掌握</button>
    </div>`;
  panel.classList.add('open');
}
function closeDetail(){document.getElementById('detailPanel').classList.remove('open');}
function jumpToNode(id){
  const n=nodes[id];if(!n)return;
  subGraphRoot=n;visibleNodes=getVisibleNodes();
  viewX=W/2-n.x*zoom;viewY=H/2-n.y*zoom;
  openDetail(n);render();
}
function markNode(id,level){
  nodes[id].mastery=level;
  try{const d=JSON.parse(localStorage.getItem('vocab_screening_v3')||'{"results":{},"answers":{},"screened":0}');if(!(id in d.results))d.screened++;d.results[id]=level;localStorage.setItem('vocab_screening_v3',JSON.stringify(d));}catch(e){}
  openDetail(nodes[id]);render();
}

// ============================================================
// CONTROLS
// ============================================================
function resetView(){subGraphRoot=null;visibleNodes=getVisibleNodes();viewX=0;viewY=0;zoom=0.35;render();}
function focusWeakest(){
  const unk=nodes.filter(n=>n.mastery==='unknown');
  const pass=nodes.filter(n=>n.mastery==='passive');
  const pool=unk.length>0?unk:pass.length>0?pass:nodes;
  const n=pool[Math.floor(Math.random()*pool.length)];
  subGraphRoot=n;visibleNodes=getVisibleNodes();
  viewX=W/2-n.x*zoom;viewY=H/2-n.y*zoom;zoom=Math.min(0.6,zoom*1.5);
  render();
}
function randomJump(){
  const pool=nodes.filter(n=>n.mastery!=='mastered');
  const n=(pool.length>0?pool:nodes)[Math.floor(Math.random()*(pool.length>0?pool:nodes).length)];
  subGraphRoot=n;visibleNodes=getVisibleNodes();
  viewX=W/2-n.x*zoom;viewY=H/2-n.y*zoom;
  render();
}
function toggleEdge(type){EDGES[type].active=!EDGES[type].active;visibleNodes=getVisibleNodes();render();}

// ============================================================
// INIT
// ============================================================
visibleNodes=getVisibleNodes();
// Start at weakest
setTimeout(focusWeakest,300);

// Animation loop (only when dragging/zooming)
function loop(){
  if(dragged||panning)render();
  requestAnimationFrame(loop);
}
loop();
render();

// Keyboard
document.addEventListener('keydown',e=>{
  if(e.key==='Escape'){subGraphRoot=null;visibleNodes=getVisibleNodes();resetView();render();closeDetail();}
  if(e.key==='f'&&!e.ctrlKey&&!e.metaKey){focusWeakest();}
  if(e.key==='r'&&!e.ctrlKey&&!e.metaKey){randomJump();}
});
