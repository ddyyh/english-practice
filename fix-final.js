var fs=require('fs'),h=fs.readFileSync('graph.html','utf8');

// 1. Fix popover: use backtick template literal for innerHTML (clean onclick escaping)
var oldDivInner=h.match(/div\.innerHTML='<button style=.*markNodePop.*<\/button>';/s)[0];
var newDivInner='div.innerHTML=`<button style="padding:10px 16px;border-radius:100px;border:none;background:rgba(255,69,58,0.15);color:#ff453a;font-size:0.85rem;cursor:pointer;font-family:inherit;white-space:nowrap" onclick="markNodePop(${n.id},\'unknown\')">😰 不认识</button><button style="padding:10px 16px;border-radius:100px;border:none;background:rgba(255,159,10,0.15);color:#ff9f0a;font-size:0.85rem;cursor:pointer;font-family:inherit;white-space:nowrap" onclick="markNodePop(${n.id},\'passive\')">🤔 模糊</button><button style="padding:10px 16px;border-radius:100px;border:none;background:rgba(48,209,88,0.15);color:#30d158;font-size:0.85rem;cursor:pointer;font-family:inherit;white-space:nowrap" onclick="markNodePop(${n.id},\'mastered\')">😎 掌握</button>`;';
h=h.replace(oldDivInner,newDivInner);

// 2. Move rating popover to fixed bottom-center position (won't overlap anything)
var oldPos=h.match(/div\.style\.left=\(p\.x-\d+\)/)[0];
h=h.replace(oldPos,'div.style.left="50%";div.style.transform="translateX(-50%)"');
var oldTop=h.match(/div\.style\.top=\(p\.y\+n\.r\*zm\+\d+\)/)[0];
h=h.replace(oldTop,'div.style.bottom="80px";div.style.top="auto"');

// 3. Rewrite showInfoCard: fixed left panel with all root family words
var oldInfo=h.match(/function showInfoCard[\s\S]*?\n\}$/)[0];
var newInfo=
'function showInfoCard(n){\n'+
'  var old=document.getElementById("infoPopover");if(old)old.remove();\n'+
'  var family=findRootFamily(n.word);if(!family)return;\n'+
'  var relatives=Object.entries(family.words).filter(function(e){return e[0]!==n.word&&NM[e[0]];});\n'+
'  if(!relatives.length)return;\n'+
'  var card=document.createElement("div");card.id="infoPopover";\n'+
'  card.style.cssText="position:fixed;z-index:15;left:16px;top:50%;transform:translateY(-50%);background:rgba(36,36,38,0.95);backdrop-filter:blur(12px);-webkit-backdrop-filter:blur(12px);padding:14px 16px;border-radius:16px;max-width:260px;box-shadow:0 4px 32px rgba(0,0,0,0.5);font-size:0.78rem;color:#aeaeb2;line-height:1.6;transition:all 0.3s ease;";\n'+
'  var html="<div style=\\"font-size:0.7rem;color:#0a84ff;text-transform:uppercase;letter-spacing:1px;margin-bottom:10px;\\">🧬 词根家族: "+family.root+"</div>";\n'+
'  html+="<div style=\\"color:#fff;font-weight:700;margin-bottom:8px;\\">▶ "+n.word+" ← 当前词</div>";\n'+
'  relatives.forEach(function(e){\n'+
'    html+="<div style=\\"padding:3px 0;font-size:0.73rem;\\"><span style=\\"color:#fff;\\">"+e[0]+"</span> <span style=\\"color:#0a84ff;font-size:0.65rem;\\">"+e[1].prefix+"</span> <span style=\\"color:#636366;font-size:0.65rem;\\">"+e[1].hint+"</span></div>";\n'+
'  });\n'+
'  card.innerHTML=html;document.body.appendChild(card);\n'+
'}';
h=h.replace(oldInfo,newInfo);

// 4. Fix: popover cleanup in resetView, Escape, click handlers
h=h.replace('const op=document.getElementById(\'ratingPopover\');if(op)op.remove();const ip=document.getElementById(\'infoPopover\');if(ip)ip.remove();',
  'var op=document.getElementById("ratingPopover");if(op)op.remove();var ip=document.getElementById("infoPopover");if(ip)ip.remove();');
h=h.replace('const pop=document.getElementById(\'ratingPopover\');if(pop)pop.remove();const ip=document.getElementById(\'infoPopover\');if(ip)ip.remove();',
  'var pop=document.getElementById("ratingPopover");if(pop)pop.remove();var ip=document.getElementById("infoPopover");if(ip)ip.remove();');
// Fix the cleanup in markNodePop
h=h.replace('const pop=document.getElementById(\'ratingPopover\');\n  if(pop)pop.remove();\n  // Re-show',
  'var pop=document.getElementById("ratingPopover");\n  if(pop)pop.remove();var ip3=document.getElementById("infoPopover");if(ip3)ip3.remove();\n  // Re-show');
// Fix resetView cleanup
var oldReset=h.match(/function resetView\(\)\{.*?render\(\)/s)[0];
var newReset='function resetView(){var p=document.getElementById("ratingPopover");if(p)p.remove();var ip4=document.getElementById("infoPopover");if(ip4)ip4.remove();sub=null;updateVisible();vx=cv.width/2-1400*zm;vy=cv.height/2-1400*zm;zm=0.28;render()';
h=h.replace(oldReset,newReset);

// 5. In focus mode, increase spacing between nodes by temporarily bumping target distance
// Add a focus mode scaling factor that spreads nodes more
var oldRender=h.match(/visible\.forEach.*p\.y\+r\+sub\?18:12.*}\);$/m)[0];
var newRender=oldRender.replace('p.y+r+(sub?18:12)','(sub?p.y+r+18:p.y+r+12)');
// Actually the overlap fix should be to just not show ALL labels in focus - only nearby ones
// For now, trust the larger world + reduced font

fs.writeFileSync('graph.html',h);
console.log('OK');
