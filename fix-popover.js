var fs=require('fs'),h=fs.readFileSync('graph.html','utf8');

// 1. Fix popover buttons: use escaped single quotes (\x27) for onclick params
// The current onclick uses "unknown" which breaks because outer attr uses "
// Fix: onclick="markNodePop(42,'unknown')" where ' is \x27 in JS string
var popoverMatch=h.match(/div\.innerHTML='[^;]*markNodePop[^;]*';/)[0];
var fixed=popoverMatch
  .replace(/'\+n\.id\+',"unknown"/g,"' + n.id + ',\\x27unknown\\x27")
  .replace(/"passive"/g,"\\x27passive\\x27")
  .replace(/"mastered"/g,"\\x27mastered\\x27");
// The replacement above is tricky. Let me simplify:
// Use backtick template literal for innerHTML with proper escaping
var btnStyle='padding:9px 16px;border-radius:100px;border:none;font-size:0.85rem;cursor:pointer;font-family:inherit;white-space:nowrap';
var newInner='div.innerHTML=`<button style="'+btnStyle+';background:rgba(255,69,58,0.15);color:#ff453a" onclick="markNodePop(${n.id},\\x27unknown\\x27)">😰 不认识</button><button style="'+btnStyle+';background:rgba(255,159,10,0.15);color:#ff9f0a" onclick="markNodePop(${n.id},\\x27passive\\x27)">🤔 模糊</button><button style="'+btnStyle+';background:rgba(48,209,88,0.15);color:#30d158" onclick="markNodePop(${n.id},\\x27mastered\\x27)">😎 掌握</button>`;';
h=h.replace(popoverMatch,newInner);

// 2. Rewrite showInfoCard: left side panel, show all root family words
var oldInfoFn=h.match(/function showInfoCard[\s\S]*?^\}$/m)[0];
var newInfoFn=
'function showInfoCard(n){\n'+
'  const old=document.getElementById("infoPopover");\n'+
'  if(old)old.remove();\n'+
'  const family=findRootFamily(n.word);\n'+
'  if(!family)return;\n'+
'  const relatives=Object.entries(family.words).filter(function(e){return e[0]!==n.word&&NM[e[0]];});\n'+
'  if(!relatives.length)return;\n'+
'  const card=document.createElement("div");\n'+
'  card.id="infoPopover";\n'+
'  card.style.cssText="position:fixed;z-index:15;left:16px;top:50%;transform:translateY(-50%);background:rgba(36,36,38,0.95);backdrop-filter:blur(12px);-webkit-backdrop-filter:blur(12px);padding:14px 16px;border-radius:16px;max-width:260px;box-shadow:0 4px 32px rgba(0,0,0,0.5);font-size:0.78rem;color:var(--text2);line-height:1.6;transition:all 0.3s ease;";\n'+
'  var html="<div style=\\x27font-size:0.7rem;color:var(--accent);text-transform:uppercase;letter-spacing:1px;margin-bottom:10px;\\x27>\\u{1F9EC} \\u8bcd\\u6839\\u5bb6\\u65cf: "+family.root+"</div>";\n'+
'  html+="<div style=\\x27color:#fff;font-weight:700;margin-bottom:8px;\\x27>\\u25b6 "+n.word+" \\u2190 \\u5f53\\u524d\\u8bcd</div>";\n'+
'  relatives.forEach(function(e){\n'+
'    html+="<div style=\\x27padding:3px 0;font-size:0.73rem;\\x27><span style=\\x27color:#fff;\\x27>"+e[0]+"</span> <span style=\\x27color:var(--accent);font-size:0.65rem;\\x27>"+e[1].prefix+"</span> <span style=\\x27color:var(--text3);font-size:0.65rem;\\x27>"+e[1].hint+"</span></div>";\n'+
'  });\n'+
'  card.innerHTML=html;\n'+
'  document.body.appendChild(card);\n'+
'}';
h=h.replace(oldInfoFn,newInfoFn);

fs.writeFileSync('graph.html',h);
console.log('OK');
