/* Animaciones tipo «Manim» de Control por Computador.
   Cada <div class="manim" data-anim="..."> se convierte en un reproductor con lienzo, controles y subtítulo. */
(function(){
'use strict';
if(window.__manimCxC) return; window.__manimCxC=true;

/* ---------- paleta y utilidades ---------- */
var C={bg:'#0c0d12',ax:'#a7a2c8',grid:'rgba(255,255,255,.07)',f:'#5fd3f3',g:'#ff5c8a',m:'#b07cff',mf:'rgba(176,124,255,.42)',
       y:'#f5e663',w:'#ece9f7',mut:'#8f8ca8',ok:'#7ee08a',bad:'#ff6b6b'};
var SERIF='"STIX Two Text","Cambria Math",Cambria,"Latin Modern Roman",Georgia,serif';
var W=640,FS=1;
function RG(c,a){c=String(c).trim();var r,g,b,m;
  if(c[0]==='#'){if(c.length===4)c='#'+c[1]+c[1]+c[2]+c[2]+c[3]+c[3];r=parseInt(c.substr(1,2),16);g=parseInt(c.substr(3,2),16);b=parseInt(c.substr(5,2),16);}
  else if((m=c.match(/rgba?\(([^)]*)\)/))){var v=m[1].split(/[ ,\/]+/).map(parseFloat);r=v[0];g=v[1];b=v[2];}else return c;
  return 'rgba('+r+','+g+','+b+','+a+')';}
function rgb(c){c=String(c).trim();if(c[0]==='#'){if(c.length===4)c='#'+c[1]+c[1]+c[2]+c[2]+c[3]+c[3];return [parseInt(c.substr(1,2),16),parseInt(c.substr(3,2),16),parseInt(c.substr(5,2),16)];}
  var m=c.match(/rgba?\(([^)]*)\)/);if(m){var v=m[1].split(/[ ,\/]+/).map(parseFloat);return [v[0],v[1],v[2]];}return null;}
function mix(a,b,t){var A=rgb(a),B=rgb(b);if(!A||!B)return a;return 'rgb('+A.map(function(x,i){return Math.round(x*(1-t)+B[i]*t);}).join(',')+')';}
function theme(el){try{var cs=getComputedStyle(el),v=function(n,d){var x=cs.getPropertyValue(n).trim();return x||d;};
  C.bg=v('--surface','#ffffff');C.w=v('--fg','#16211d');C.mut=v('--muted','#56635e');C.ax=C.mut;C.grid=RG(v('--line','#d5dcd9'),.9);
  C.f=v('--c2','#0b7f93');C.g=v('--c5','#c43d63');C.m=v('--c3','#7d45c9');C.y=v('--tc',v('--accent','#0d6e5a'));C.hl=v('--c4','#b8730c');
  C.ok=v('--c6','#2c8a52');C.bad=v('--warn','#b2482a');C.w=mix(C.w,C.y,.6);C.ax=mix(C.mut,C.y,.45);C.mut=mix(C.mut,C.y,.3);
  var ff=getComputedStyle(document.body).fontFamily;if(ff)SERIF=ff;}catch(e){}}
function clamp(v,a,b){return v<a?a:v>b?b:v;}
function seg(t,a,b){return clamp((t-a)/(b-a),0,1);}
function ease(u){return u<.5?4*u*u*u:1-Math.pow(-2*u+2,3)/2;}
function lerp(a,b,u){return a+(b-a)*u;}
function nf(v,d){if(d===undefined)d=2;var s=(Math.abs(v)<5e-13?0:v).toFixed(d);return s.replace('-','−').replace('.',',');}


/* ---------- estilos del reproductor ---------- */
(function(){if(document.getElementById('manim-css'))return;var s=document.createElement('style');s.id='manim-css';s.textContent=
'.manim{background:transparent;border:0;padding:0;margin:4px 0 2px;color:var(--fg,#16211d)}'+
'.manim canvas{display:block;width:100%;height:auto;border-radius:8px}'+
'.manim-bar{display:flex;align-items:center;gap:8px;margin-top:8px;flex-wrap:wrap}'+
'.manim-bar button,.manim-bar select{font:600 15px/1 var(--body,inherit);color:var(--fg,#16211d);background:var(--bg,#f4f6f5);border:1px solid var(--line,#d5dcd9);border-radius:8px;padding:8px 12px;cursor:pointer;min-height:40px}'+
'.manim-bar button:hover{border-color:var(--tc,var(--accent))}.manim-bar button:focus-visible,.manim-bar input:focus-visible,.manim-bar select:focus-visible{outline:2px solid var(--tc,var(--accent));outline-offset:2px}'+
'.manim-bar input[type=range]{flex:1 1 140px;accent-color:var(--tc,var(--accent));min-width:120px}'+
'.manim-t{font:13px/1 var(--mono,ui-monospace,monospace);color:var(--muted);min-width:62px;text-align:right}'+
'.manim-cap{font:inherit;color:var(--fg,#16211d);margin:8px 4px 2px;min-height:2.9em}'+
'@media (max-width:560px){figure.fig.manim-fig{padding-left:6px!important;padding-right:6px!important}.manim-fig .manim{padding:0;margin-left:-2px;margin-right:-2px}}';
document.head.appendChild(s);})();

/* ---------- primitivas de dibujo ---------- */
function mk(ctx){
  var o={ctx:ctx};
  o.text=function(s,x,y,op){op=op||{};ctx.save();ctx.fillStyle=op.c||C.w;ctx.textBaseline=op.b||'alphabetic';ctx.globalAlpha*=op.al===undefined?1:op.al;
    var sz=op.s||18;sz=sz*Math.min(FS,sz<=16?1.45:(sz<=20?1.3:1.2));var fam=(op.mono?'ui-monospace,monospace':SERIF),st=(op.it?'italic ':'')+(op.bold?'600 ':'');
    var parts=[],re=/([\^_])\{([^}]*)\}/g,m,i=0;while((m=re.exec(s))){if(m.index>i)parts.push([s.slice(i,m.index),0]);parts.push([m[2],m[1]==='^'?1:-1]);i=re.lastIndex;}if(i<s.length)parts.push([s.slice(i),0]);
    var wsum=0;parts.forEach(function(q){ctx.font=st+(q[1]?Math.round(sz*.68):sz)+'px '+fam;q.push(ctx.measureText(q[0]).width);wsum+=q[2];});
    if(wsum>W-16){var k=(W-16)/wsum;sz*=k;wsum=0;parts.forEach(function(q){ctx.font=st+(q[1]?Math.round(sz*.68):sz)+'px '+fam;q[2]=ctx.measureText(q[0]).width;wsum+=q[2];});}
    var a=op.a||'left',xx=a==='center'?x-wsum/2:(a==='right'?x-wsum:x);ctx.textAlign='left';
    parts.forEach(function(q){ctx.font=st+(q[1]?Math.round(sz*.68):sz)+'px '+fam;ctx.fillText(q[0],xx,y+(q[1]===1?-sz*.42:(q[1]===-1?sz*.22:0)));xx+=q[2];});
    ctx.restore();};
  o.line=function(x1,y1,x2,y2,c,w,d,al){ctx.save();ctx.strokeStyle=c||C.ax;ctx.lineWidth=w||1.5;if(d)ctx.setLineDash(d);ctx.globalAlpha*=al===undefined?1:al;ctx.beginPath();ctx.moveTo(x1,y1);ctx.lineTo(x2,y2);ctx.stroke();ctx.restore();};
  o.dot=function(x,y,r,c,al){ctx.save();ctx.fillStyle=c;ctx.globalAlpha*=al===undefined?1:al;ctx.beginPath();ctx.arc(x,y,r,0,6.2832);ctx.fill();ctx.restore();};
  o.ring=function(x,y,r,c,w){ctx.save();ctx.strokeStyle=c;ctx.lineWidth=w||2;ctx.beginPath();ctx.arc(x,y,r,0,6.2832);ctx.stroke();ctx.restore();};
  o.cross=function(x,y,r,c){o.line(x-r,y-r,x+r,y+r,c,2.4);o.line(x-r,y+r,x+r,y-r,c,2.4);};
  o.head=function(x,y,ang,c,sz){sz=sz||10;ctx.save();ctx.fillStyle=c;ctx.translate(x,y);ctx.rotate(ang);ctx.beginPath();ctx.moveTo(0,0);ctx.lineTo(-sz,-sz*.5);ctx.lineTo(-sz,sz*.5);ctx.closePath();ctx.fill();ctx.restore();};
  o.arrow=function(x1,y1,x2,y2,c,w){o.line(x1,y1,x2,y2,c,w||2);o.head(x2,y2,Math.atan2(y2-y1,x2-x1),c,9);};
  o.path=function(pts,c,w,fill,al){if(pts.length<2)return;ctx.save();ctx.globalAlpha*=al===undefined?1:al;ctx.beginPath();ctx.moveTo(pts[0][0],pts[0][1]);for(var i=1;i<pts.length;i++)ctx.lineTo(pts[i][0],pts[i][1]);
    if(fill){ctx.closePath();ctx.fillStyle=fill;ctx.fill();}if(c){ctx.strokeStyle=c;ctx.lineWidth=w||2;ctx.lineJoin='round';ctx.stroke();}ctx.restore();};
  o.rect=function(x,y,w,h,stroke,fill,lw){ctx.save();if(fill){ctx.fillStyle=fill;ctx.fillRect(x,y,w,h);}if(stroke){ctx.strokeStyle=stroke;ctx.lineWidth=lw||2.4;ctx.strokeRect(x,y,w,h);}ctx.restore();};
  /* ejes estilo Manim: devuelve X(v), Y(v) */
  o.axes=function(r){var X=function(v){return r.x+(v-r.xr[0])/(r.xr[1]-r.xr[0])*r.w;},Y=function(v){return r.y+r.h-(v-r.yr[0])/(r.yr[1]-r.yr[0])*r.h;};
    var y0=Y(clamp(0,r.yr[0],r.yr[1])),x0=X(clamp(0,r.xr[0],r.xr[1]));
    if(r.grid){(r.yt||[]).forEach(function(v){o.line(r.x,Y(v),r.x+r.w,Y(v),C.grid,1);});}
    o.line(r.x,y0,r.x+r.w+12,y0,C.ax,1.6);o.head(r.x+r.w+16,y0,0,C.ax,11);
    if(!r.noY){o.line(x0,r.y+r.h,x0,r.y-12,C.ax,1.6);o.head(x0,r.y-16,-Math.PI/2,C.ax,11);}
    (r.xt||[]).forEach(function(v){var xx=X(v);o.line(xx,y0-4,xx,y0+4,C.ax,1.4);o.text(r.xf?r.xf(v):nf(v,r.xd===undefined?1:r.xd),xx,y0+19,{s:13,a:'center',c:C.mut});});
    (r.yt||[]).forEach(function(v){if(Math.abs(v)<1e-9)return;var yy=Y(v);o.line(x0-4,yy,x0+4,yy,C.ax,1.4);o.text(r.yf?r.yf(v):nf(v,r.yd===undefined?1:r.yd),x0-9,yy+4,{s:13,a:'right',c:C.mut});});
    if(r.xl)o.text(r.xl,r.x+r.w+18,y0-12,{it:true,s:19,c:C.w,a:'right'});
    if(r.yl&&!r.noY)o.text(r.yl,x0,r.y-24,{it:true,s:19,c:C.w,a:'center'});
    return {X:X,Y:Y,y0:y0,x0:x0};};
  o.stem=function(A,n,v,c,al,r){var x=A.X(n),y=A.Y(v);o.line(x,A.y0,x,y,c,2.6,null,al);o.dot(x,y,r||5.5,c,al);};
  return o;
}

/* ---------- reproductor ---------- */
function Player(el,spec){
  var dpr=Math.min(window.devicePixelRatio||1,2),H=spec.H;
  el.innerHTML='';el.setAttribute('role','group');el.setAttribute('aria-label','Animación: '+spec.title);
  var cv=document.createElement('canvas');cv.width=W*dpr;cv.height=H*dpr;cv.setAttribute('role','img');cv.setAttribute('aria-label',spec.alt||spec.title);el.appendChild(cv);
  var cap=document.createElement('p');cap.className='manim-cap';cap.setAttribute('aria-live','polite');el.appendChild(cap);
  var bar=document.createElement('div');bar.className='manim-bar';
  bar.innerHTML='<button type="button" class="mp" aria-label="Reproducir">▶ Reproducir</button><button type="button" class="mr" aria-label="Volver a empezar">↺</button>'+
    '<input type="range" min="0" max="1000" value="0" aria-label="Posición de la animación"><span class="manim-t">0,0 s</span>'+
    '<select aria-label="Velocidad"><option value="0.5">0,5×</option><option value="1" selected>1×</option><option value="1.5">1,5×</option><option value="2">2×</option></select><button type="button" class="mv" aria-label="Descargar la animación como vídeo vertical">⬇ Vídeo</button>';
  el.appendChild(bar);
  var bp=bar.querySelector('.mp'),br=bar.querySelector('.mr'),rg=bar.querySelector('input'),tl=bar.querySelector('.manim-t'),sp=bar.querySelector('select');
  var ctx=cv.getContext('2d'),D=mk(ctx),t=0,playing=false,last=0,speed=1,lastCap='';
  var snap=null,cw0=0;function retheme(){theme(el);snap={};for(var k in C)snap[k]=C[k];snap.__s=SERIF;cw0=cv.clientWidth||W;}
  function render(){if(!snap)retheme();else{for(var k in snap)if(k!=='__s')C[k]=snap[k];SERIF=snap.__s;}FS=clamp(560/(cw0||W),1,2);ctx.setTransform(dpr,0,0,dpr,0,0);ctx.clearRect(0,0,W,H);
    if(spec.title)D.text(spec.title,W/2,40,{s:32,a:'center',c:C.y,bold:true});
    spec.draw(D,t);var c=spec.cap(t).replace(/\^\{([^}]*)\}/g,'<sup>$1</sup>');if(c!==lastCap){cap.innerHTML=c;lastCap=c;}
    rg.value=Math.round(t/spec.dur*1000);tl.textContent=nf(t,1)+' s';}
  function frame(ts){if(!playing)return;var dt=last?Math.min(.05,(ts-last)/1000):0;last=ts;t+=dt*speed;
    if(t>=spec.dur){t=spec.loop===false?spec.dur:0;if(spec.loop===false){pause();render();return;}}render();requestAnimationFrame(frame);}
  function play(){if(playing)return;if(t>=spec.dur)t=0;playing=true;last=0;bp.textContent='⏸ Pausa';bp.setAttribute('aria-label','Pausa');requestAnimationFrame(frame);}
  function pause(){playing=false;bp.textContent='▶ Reproducir';bp.setAttribute('aria-label','Reproducir');}
  bp.addEventListener('click',function(){playing?pause():play();});
  br.addEventListener('click',function(){t=0;render();play();});
  rg.addEventListener('input',function(){t=rg.value/1000*spec.dur;render();});
  sp.addEventListener('change',function(){speed=+sp.value;});
  var bv=bar.querySelector('.mv');if(!(window.MediaRecorder&&cv.captureStream))bv.style.display='none';
  bv.addEventListener('click',function(){if(bv.disabled)return;pause();var VW=1080,VH=1920,off=document.createElement('canvas');off.width=VW;off.height=VH;var o=off.getContext('2d');
    var types=['video/mp4;codecs=avc1','video/mp4','video/webm;codecs=vp9','video/webm'],mt='';for(var i=0;i<types.length;i++){if(MediaRecorder.isTypeSupported&&MediaRecorder.isTypeSupported(types[i])){mt=types[i];break;}}
    var rec;try{rec=new MediaRecorder(off.captureStream(30),mt?{mimeType:mt,videoBitsPerSecond:6e6}:undefined);}catch(e){cap.textContent='Este navegador no permite grabar vídeo.';return;}
    var chunks=[];rec.ondataavailable=function(e){if(e.data&&e.data.size)chunks.push(e.data);};
    var guide=(document.title.split('·')[1]||document.title).trim(),lab=bv.textContent;bv.disabled=true;
    function wrap(txt,x,y,maxw,lh){var words=txt.split(' '),line='';for(var i=0;i<words.length;i++){var tst=line?line+' '+words[i]:words[i];if(o.measureText(tst).width>maxw&&line){o.fillText(line,x,y);line=words[i];y+=lh;}else line=tst;}if(line)o.fillText(line,x,y);}
    function comp(){o.fillStyle=mix(C.bg,C.y,.07);o.fillRect(0,0,VW,VH);o.fillStyle=C.bg;o.fillRect(20,240,VW-40,H*(VW-60)/W+40);o.fillStyle=C.y;o.fillRect(0,0,VW,14);o.font='600 40px '+SERIF;o.fillStyle=C.mut;o.textAlign='center';o.fillText(guide,VW/2,140);
      var sc=(VW-60)/W,hh=H*sc;o.drawImage(cv,30,260,VW-60,hh);o.font='44px '+SERIF;o.fillStyle=C.w;o.textAlign='left';var txt=(cap.textContent||'').replace(/\s+/g,' ');wrap(txt,70,260+hh+110,VW-140,62);}
    var t0=null;t=0;rec.start(250);
    function step(ts){if(t0===null)t0=ts;t=Math.min(spec.dur,(ts-t0)/1000);render();comp();bv.textContent='Grabando… '+Math.ceil(spec.dur-t)+' s';if(t<spec.dur)requestAnimationFrame(step);else setTimeout(function(){rec.stop();},300);}
    rec.onstop=function(){var ext=/mp4/.test(rec.mimeType||mt)?'mp4':'webm',blob=new Blob(chunks,{type:rec.mimeType||mt||'video/webm'}),a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download=(el.getAttribute('data-anim')||'animacion')+'.'+ext;document.body.appendChild(a);a.click();setTimeout(function(){URL.revokeObjectURL(a.href);a.remove();},4000);bv.disabled=false;bv.textContent=lab;};
    requestAnimationFrame(step);});

  var reduce=window.matchMedia&&window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if('IntersectionObserver' in window){var io=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting&&e.intersectionRatio>.55){if(!reduce&&!el.__auto){el.__auto=true;play();}}else if(!e.isIntersecting&&playing)pause();});},{threshold:[0,.55]});io.observe(el);}
  window.addEventListener('resize',function(){var c=cv.clientWidth||W;if(c!==cw0){cw0=c;if(!playing)render();}});
  try{new MutationObserver(function(){snap=null;if(!playing)render();}).observe(document.documentElement,{attributes:true,attributeFilter:['data-theme','class']});
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change',function(){snap=null;if(!playing)render();});}catch(e){}
  /* estado inicial: un fotograma representativo */
  t=spec.poster||0;render();t=spec.poster||0;
  if(document.fonts&&document.fonts.load){document.fonts.ready.then(function(){snap=null;if(!playing)render();}).catch(function(){});}
}

/* =====================================================================
   1. CONVOLUCIÓN: continua (dos rectángulos → triángulo) y discreta
   ===================================================================== */
var CX=[1,2,3],CH=[1,-1,2],CY=[1,1,3,1,6];
function tri(t){return t<=0||t>=2?0:(t<=1?t:2-t);}
var conv={title:'Convolución',H:620,dur:30,poster:4.2,alt:'Un rectángulo volteado se desliza sobre otro; el área común dibuja un triángulo. Después, la versión discreta con secuencias.',
 draw:function(D,t){
  if(t<11){ /* ---- parte continua ---- */
    var tt=lerp(-0.7,2.6,ease(seg(t,0.8,10)));
    var A=D.axes({x:110,y:90,w:470,h:170,xr:[-1,2.6],yr:[0,1.25],xt:[-0.5,0.5,1,1.5,2],yt:[0.5,1],xl:'τ',yl:'',xd:1});
    /* f(τ)=rect[0,1] */
    D.rect(A.X(0),A.Y(1),A.X(1)-A.X(0),A.Y(0)-A.Y(1),C.f,RG(C.f,.08));
    /* g(t−τ)=rect[t−1,t] */
    var a=Math.max(-1,tt-1),b=Math.min(2.6,tt);
    if(b>a)D.rect(A.X(a),A.Y(1),A.X(b)-A.X(a),A.Y(0)-A.Y(1),C.g,RG(C.g,.08));
    var oa=Math.max(0,tt-1),ob=Math.min(1,tt);if(ob>oa)D.rect(A.X(oa),A.Y(1),A.X(ob)-A.X(oa),A.Y(0)-A.Y(1),null,RG(C.m,.35));
    D.text('f(τ)',A.X(1)+8,A.Y(1)+22,{it:true,s:20,c:C.f});D.text('g(t − τ)',A.X(Math.max(-0.9,tt-1))+6,A.Y(1)-10,{it:true,s:20,c:C.g});
    var val=tri(tt);
    D.text('t = '+nf(tt),W/2,318,{it:true,s:26,a:'center'});D.text('(f ∗ g)(t) = '+nf(val),W/2,354,{it:true,s:26,a:'center',c:C.m});
    var B=D.axes({x:110,y:405,w:470,h:170,xr:[-1,2.6],yr:[0,1.15],xt:[-0.5,0.5,1,1.5,2],yt:[0.25,0.5,0.75,1],yd:2,xl:'t',yl:'',grid:true});D.text('(f ∗ g)(t)',B.X(1.55),B.Y(1.02),{it:true,s:20,c:C.m});
    var pts=[],fill=[[B.X(-1),B.Y(0)]];for(var s=-1;s<=tt+1e-9;s+=0.01){pts.push([B.X(s),B.Y(tri(s))]);fill.push([B.X(s),B.Y(tri(s))]);}
    fill.push([B.X(tt),B.Y(0)]);D.path(fill,null,0,RG(C.m,.22));D.path(pts,C.m,3);
    if(tt>-0.9){D.line(B.X(tt),B.Y(0),B.X(tt),B.Y(val),C.m,1.2,[4,4]);D.dot(B.X(tt),B.Y(val),6,C.m);}
  } else { /* ---- parte discreta ---- */
    var u=t-11,step=1.9,idx=Math.floor(u/step),fr=u/step-idx,nn=-1+idx,mv=ease(seg(fr,0,.38)),hold=fr>.42;
    if(nn>5){nn=5;mv=1;hold=true;}
    var nc=nn-1+mv;
    var A=D.axes({x:95,y:92,w:490,h:180,xr:[-3,6],yr:[-1.6,3.6],xt:[-2,-1,0,1,2,3,4,5],yt:[-1,1,2,3],xf:function(v){return String(v).replace('-','−');},yf:function(v){return String(v).replace('-','−');},xl:'k',yl:''});
    CX.forEach(function(v,i){D.stem(A,i-0.08,v,C.g,1);});
    /* h[n−k]: h volteado y desplazado nc */
    var off=0.08;CH.forEach(function(v,j){var kk=nc-j;if(kk>-3.4&&kk<6.4)D.stem(A,kk+off,v,C.f,0.95,5);});
    D.text('x[k]',A.X(-1.2),A.Y(2.4),{it:true,s:20,c:C.g,a:'center'});D.text('h[n − k]',clamp(A.X(nc-1),A.X(-2.2),A.X(5)),A.Y(3.6)-4,{it:true,s:20,c:C.f,a:'center'});
    /* productos en la zona común */
    var terms=[],sum=0;
    if(hold){CX.forEach(function(v,i){var j=nn-i;if(j>=0&&j<CH.length){terms.push(v+' × '+(CH[j]<0?'('+nf(CH[j],0)+')':CH[j]));sum+=v*CH[j];
        D.rect(A.X(i)-13,Math.min(A.Y(v),A.Y(CH[j]))-12,26,Math.abs(A.Y(Math.min(0,v,CH[j]))-Math.min(A.Y(v),A.Y(CH[j])))+24,C.m,RG(C.m,.16),1.6);}});}
    D.text('n = '+String(nn).replace('-','−'),W/2,318,{it:true,s:26,a:'center'});
    var line=(hold?('y['+String(nn).replace('-','−')+'] = '+(terms.length?terms.join(' + ')+' = '+nf(sum,0):'0 (no se solapan)')):'desliza h …');
    D.text(line,W/2,354,{it:true,s:24,a:'center',c:C.m});
    var B=D.axes({x:95,y:405,w:490,h:170,xr:[-3,6],yr:[0,6.6],xt:[-2,-1,0,1,2,3,4,5],yt:[2,4,6],xf:function(v){return String(v).replace('-','−');},yd:0,xl:'n',yl:'',grid:true});
    var upto=hold?nn:nn-1; for(var n=-1;n<=Math.min(5,upto);n++){var yv=(n>=0&&n<CY.length)?CY[n]:0;D.stem(B,n,yv,C.m,1,6);}
  }
 },
 cap:function(t){
  if(t<1)return 'Dos rectángulos de altura 1: <i>f</i> en azul y <i>g</i> en rosa.';
  if(t<5.5)return 'Para calcular <i>(f ∗ g)(t)</i> se <b>voltea</b> g, se <b>desliza</b> hasta t y se mide el <b>área que se solapa</b> (morado).';
  if(t<11)return 'Para dos rectángulos unidad, la convolución es un <b>triángulo</b>: el solape crece, llega a 1 en t = 1 y vuelve a 0 en t = 2.';
  if(t<17)return 'En discreto es igual, cambiando áreas por <b>sumas</b>: <i>y[n] = Σ x[k]·h[n − k]</i>. Volteamos h = [1, −1, 2] y la desplazamos n muestras.';
  if(t<24)return 'En cada n se multiplican las muestras que coinciden y se suman: ese número es <i>y[n]</i>.';
  return 'Resultado: y = [1, 1, 3, 1, 6] para n = 0…4. Longitud 3 + 3 − 1 = 5, y empieza en 0 + 0 = 0. Compruébalo con <code>conv([1 2 3],[1 -1 2])</code>.';
 }};

/* =====================================================================
   2. MUESTREO Y ALIASING
   ===================================================================== */
var FSAMP=10;
function alias(f){var k=Math.round(f/FSAMP);return Math.abs(f-k*FSAMP);}
var alia={title:'Muestreo y aliasing',H:600,dur:20,poster:9.5,alt:'Una senoide aumenta de frecuencia mientras se muestrea a 10 Hz; por encima de 5 Hz las muestras dibujan otra senoide más lenta.',
 draw:function(D,t){
  var f=lerp(1,15,ease(seg(t,1,17))),fa=alias(f);
  var A=D.axes({x:80,y:90,w:510,h:200,xr:[0,1],yr:[-1.3,1.3],xt:[0.2,0.4,0.6,0.8,1],yt:[-1,1],yd:0,xl:'t (s)',yl:''});
  var p1=[],p2=[];for(var i=0;i<=600;i++){var s=i/600;p1.push([A.X(s),A.Y(Math.cos(2*Math.PI*f*s))]);p2.push([A.X(s),A.Y(Math.cos(2*Math.PI*fa*s))]);}
  D.path(p1,C.f,1.6,null,0.85);
  if(f>FSAMP/2+0.05)D.path(p2,C.m,3.2,null,ease(seg(f,5,6.2)));
  for(var n=0;n<=10;n++){var s=n/FSAMP;var v=Math.cos(2*Math.PI*f*s);D.line(A.X(s),A.y0,A.X(s),A.Y(v),C.g,1.2,[3,3],0.7);D.dot(A.X(s),A.Y(v),6,C.g);}
  D.text('f = '+nf(f,1)+' Hz',80,326,{it:true,s:26,c:C.f});
  D.text(f>FSAMP/2?'se ve como '+nf(fa,1)+' Hz':'se ve bien',W-40,326,{it:true,s:24,c:f>FSAMP/2?C.m:C.ok,a:'right'});
  /* espectro con plegado */
  var B=D.axes({x:80,y:400,w:510,h:120,xr:[0,16],yr:[0,1.2],xt:[0,5,10,15],xd:0,noY:true,xl:'f (Hz)'});
  D.rect(B.X(0),B.Y(1.15),B.X(5)-B.X(0),B.Y(0)-B.Y(1.15),null,RG(C.ok,.1));
  D.line(B.X(5),B.Y(1.15),B.X(5),B.y0,C.hl,1.6,[6,5]);D.text('fs/2',B.X(5),B.Y(1.15)-8,{it:true,s:18,c:C.hl,a:'center'});
  D.line(B.X(10),B.Y(1.15),B.X(10),B.y0,C.g,1.2,[3,5]);D.text('fs',B.X(10),B.Y(1.15)-8,{it:true,s:18,c:C.g,a:'center'});
  D.line(B.X(f),B.y0,B.X(f),B.Y(1),C.f,3);D.dot(B.X(f),B.Y(1),6,C.f);
  if(f>FSAMP/2){D.line(B.X(fa),B.y0,B.X(fa),B.Y(0.8),C.m,3);D.dot(B.X(fa),B.Y(0.8),6,C.m);
    var ctx=D.ctx,x1=B.X(f),x2=B.X(fa),yb=B.Y(1)-6;ctx.save();ctx.strokeStyle=C.m;ctx.lineWidth=1.8;ctx.setLineDash([5,4]);ctx.beginPath();ctx.moveTo(x1,yb);
    ctx.quadraticCurveTo((x1+x2)/2,yb-26,x2,B.Y(0.8)-6);ctx.stroke();ctx.restore();D.head(x2,B.Y(0.8)-6,Math.PI/2+0.5,C.m,9);}
  D.text('zona sin aliasing',B.X(2.5),B.y0+42,{s:14,c:C.ok,a:'center'});
 },
 cap:function(t){var f=lerp(1,15,ease(seg(t,1,17)));
  if(f<4.6)return 'Muestreamos a <i>fs = 10 Hz</i> (puntos rosas). Mientras <i>f &lt; fs/2</i>, las muestras siguen la forma de la senoide.';
  if(f<5.4)return 'En <i>f = fs/2 = 5 Hz</i> (frecuencia de Nyquist) queda solo una muestra por semiperiodo: es el límite del teorema de Shannon.';
  if(f<10)return 'Por encima de fs/2 las muestras son <b>idénticas</b> a las de una senoide más lenta (morada): la frecuencia se <b>pliega</b> alrededor de fs/2 y aparece en <i>fs − f</i>.';
  if(f<11)return 'En <i>f = fs</i> todas las muestras valen lo mismo: parece una constante (0 Hz).';
  return 'Regla: la frecuencia aparente es la distancia de <i>f</i> al múltiplo de <i>fs</i> más cercano. Para evitarlo: <i>fs &gt; 2·fmáx</i> y filtro antialiasing antes del A/D.';
 }};

/* =====================================================================
   3. DEL PLANO s AL PLANO z  (z = e^{sT})
   ===================================================================== */
var TS=0.3;
function spath(t){ /* devuelve [σ, ω] */
  var a=seg(t,1,6),b=seg(t,7,12),c=seg(t,13,17);
  var sg=-1.5,w=0;
  w=lerp(0,6,ease(a));
  if(t>=7)sg=lerp(-1.5,0,ease(b));
  if(t>=13)sg=lerp(0,0.6,ease(c));
  if(t<1)sg=lerp(-4,-1.5,ease(seg(t,0,1)));
  return [sg,w];}
var smap={title:'Del plano s al plano z',H:640,dur:20,poster:9,alt:'Un par de polos se mueve en el plano s y su imagen z = e^{sT} se mueve en el plano z; abajo cambia la respuesta impulsional.',
 draw:function(D,t){
  var p=spath(t),sg=p[0],w=p[1],r=Math.exp(sg*TS),th=w*TS;
  /* plano s */
  var S=D.axes({x:40,y:90,w:250,h:220,xr:[-4.5,1.5],yr:[-8,8],xt:[-4,-2],yt:[-6,6],xd:0,yd:0,xl:'σ',yl:'jω'});
  D.rect(S.X(-4.5),S.Y(8),S.X(0)-S.X(-4.5),S.Y(-8)-S.Y(8),null,RG(C.ok,.09));
  var tr=[];for(var q=0;q<=t;q+=0.05){var pq=spath(q);tr.push([S.X(pq[0]),S.Y(pq[1])]);}D.path(tr,C.hl,1.4,null,0.5);
  D.cross(S.X(sg),S.Y(w),7,C.g);D.cross(S.X(sg),S.Y(-w),7,C.g);
  D.text('estable',S.X(-3.2),S.Y(7)+4,{s:14,c:C.ok,a:'center'});
  /* plano z */
  var cx=470,cy=200,R=95;
  D.line(cx-R-30,cy,cx+R+38,cy,C.ax,1.6);D.head(cx+R+42,cy,0,C.ax,11);D.line(cx,cy+R+20,cx,cy-R-26,C.ax,1.6);D.head(cx,cy-R-30,-Math.PI/2,C.ax,11);
  var ctx=D.ctx;ctx.save();ctx.fillStyle=RG(C.ok,.09);ctx.beginPath();ctx.arc(cx,cy,R,0,6.2832);ctx.fill();ctx.restore();
  D.ring(cx,cy,R,C.ax,1.4);D.text('Re',cx+R+38,cy+22,{it:true,s:17});D.text('Im',cx+12,cy-R-20,{it:true,s:17});D.text('1',cx+R+4,cy+18,{s:13,c:C.mut});
  var tz=[];for(var q=0;q<=t;q+=0.05){var pq=spath(q),rq=Math.exp(pq[0]*TS),tq=pq[1]*TS;tz.push([cx+R*rq*Math.cos(tq),cy-R*rq*Math.sin(tq)]);}D.path(tz,C.hl,1.4,null,0.5);
  var zx=cx+R*r*Math.cos(th),zy=cy-R*r*Math.sin(th);D.cross(zx,zy,7,C.m);D.cross(zx,cy+R*r*Math.sin(th),7,C.m);
  D.line(cx,cy,zx,zy,C.m,1.2,[4,4]);
  D.text('s = '+nf(sg,1)+' ± j'+nf(w,1),165,350,{it:true,s:22,c:C.g,a:'center'});
  D.text('z = e^{sT} = '+nf(r,2)+' ∠ ±'+nf(th,2)+' rad',470,350,{it:true,s:22,c:C.m,a:'center'});
  D.text('T = 0,3 s',W/2,320,{it:true,s:15,c:C.mut,a:'center'});
  /* respuesta impulsional */
  var B=D.axes({x:70,y:410,w:520,h:180,xr:[-0.5,24],yr:[-2.2,2.2],xt:[0,5,10,15,20],yt:[-2,-1,1,2],xd:0,yd:0,xl:'n',yl:'',grid:true});D.text('h[n] = r^{n} cos(θn)',72,392,{it:true,s:20,c:C.m});
  for(var n=0;n<=23;n++){var v=Math.pow(r,n)*Math.cos(th*n);var vc=clamp(v,-2.15,2.15);D.stem(B,n,vc,r>1.0001?C.bad:C.m,1,4.5);}
 },
 cap:function(t){
  if(t<1.2)return 'Cada polo en <i>s</i> va a <i>z = e^{sT}</i>. Un polo real negativo cae en el eje real, entre 0 y 1: la respuesta <b>decae sin oscilar</b>.';
  if(t<6.5)return 'Al subir <i>ω</i>, el polo en z gira un ángulo <i>θ = ωT</i>: la respuesta <b>oscila</b>, más rápido cuanto mayor es el ángulo.';
  if(t<12.5)return 'Al acercar <i>σ</i> a 0, el módulo <i>r = e^{σT}</i> se acerca a 1: la oscilación tarda cada vez más en apagarse.';
  if(t<14)return 'En <i>σ = 0</i> el polo está <b>sobre el círculo unidad</b>: oscilación mantenida (límite de estabilidad).';
  return 'Con <i>σ &gt; 0</i> el polo sale del círculo (r &gt; 1) y la respuesta <b>crece</b>: inestable. Semiplano izquierdo en s ⇔ interior del círculo en z.';
 }};

/* =====================================================================
   4. MUESTREO + RETENEDOR DE ORDEN CERO
   ===================================================================== */
function sig(t){return 0.55+0.45*Math.sin(1.1*t)+0.2*Math.sin(2.7*t+0.6);}
var TZ=0.8;
var zoh={title:'El retenedor de orden cero',H:540,dur:18,poster:12,alt:'Una señal continua se muestrea cada T y el retenedor mantiene cada muestra, formando una escalera que va T/2 por detrás.',
 draw:function(D,t){
  var tm=lerp(0,10,seg(t,0.6,10.5));
  var A=D.axes({x:70,y:80,w:520,h:280,xr:[0,10],yr:[-0.3,1.4],xt:[0,2,4,6,8,10],yt:[0.5,1],xd:0,xl:'t (s)',yl:'',grid:true});
  var pts=[];for(var s=0;s<=tm;s+=0.02)pts.push([A.X(s),A.Y(sig(s))]);D.path(pts,C.f,2.4);
  var st=[];for(var k=0;k*TZ<=tm;k++){var v=sig(k*TZ),a=k*TZ,b=Math.min((k+1)*TZ,tm);st.push([A.X(a),A.Y(v)]);st.push([A.X(b),A.Y(v)]);
    D.line(A.X(a),A.y0,A.X(a),A.Y(v),C.g,1,[3,4],0.6);D.dot(A.X(a),A.Y(v),5,C.g);}
  D.path(st,C.m,3.2);
  var dl=seg(t,11.5,13.5);
  if(dl>0){var pd=[];for(var s=TZ/2;s<=10;s+=0.02)pd.push([A.X(s),A.Y(sig(s-TZ/2))]);D.path(pd,C.hl,2,null,dl);
    var x0=A.X(4),x1=A.X(4+TZ/2),yy=A.Y(1.32);D.arrow(x0,yy,x1,yy,C.hl,2);D.text('T/2',(x0+x1)/2,yy-8,{it:true,s:17,c:C.hl,a:'center',al:dl});}
  D.text('T = 0,8 s',A.X(0.2),A.Y(1.32)+4,{it:true,s:16,c:C.mut});
  D.text('G_{ZOH}(s) = (1 − e^{−sT}) / s',W/2,420,{it:true,s:24,c:C.m,a:'center'});
  D.text('G(z) = (1 − z^{−1}) Z{ G(s)/s }',W/2,458,{it:true,s:24,c:C.w,a:'center',al:seg(t,14,15)});
 },
 cap:function(t){
  if(t<3)return 'El A/D toma una muestra cada <i>T</i> (puntos rosas) y el ordenador calcula con esos números.';
  if(t<11)return 'El D/A con <b>retenedor de orden cero</b> mantiene cada valor hasta la muestra siguiente: la salida es una <b>escalera</b> (morada).';
  if(t<14)return 'De media, la escalera va <b>T/2 por detrás</b> de la señal (amarillo): el ZOH es casi un retardo de T/2 y resta fase ≈ ωT/2. Por eso hay que muestrear rápido.';
  return 'Al discretizar una planta con ZOH: <i>G(z) = (1 − z⁻¹)·Z{G(s)/s}</i>. El factor (1 − z⁻¹) es lo que queda del (1 − e^{−sT}).';
 }};

/* =====================================================================
   5. LUGAR DE LAS RAÍCES EN z Y ESTABILIDAD  G(z)=K(0,3679z+0,2642)/((z−1)(z−0,3679))
   ===================================================================== */
var NB=[0.3679,0.2642],DA=[1,-1.3679,0.3679],KC=(1-0.3679)/0.2642;
function clp(K){var b=0.3679*K-1.3679,c=0.3679+0.2642*K,d=b*b-4*c;if(d>=0){var s=Math.sqrt(d);return [[(-b+s)/2,0],[(-b-s)/2,0]];}var s2=Math.sqrt(-d);return [[-b/2,s2/2],[-b/2,-s2/2]];}
function stepCL(K,N){var a1=0.3679*K-1.3679,a2=0.3679+0.2642*K,b1=0.3679*K,b2=0.2642*K;var y=[0,0],u=1,out=[];for(var n=0;n<N;n++){var yn=(n>=1?b1:0)+(n>=2?b2:0)-a1*(n>=1?out[n-1]:0)-a2*(n>=2?out[n-2]:0);out.push(yn);}return out;}
function Kof(t){return lerp(0.05,3.2,ease(seg(t,1,15)));}
var rloc={title:'Lugar de las raíces en z',H:600,dur:19,poster:8,alt:'Al aumentar K, los polos en lazo cerrado se mueven por el plano z y salen del círculo unidad en K ≈ 2,39; a la derecha cambia la respuesta al escalón.',
 draw:function(D,t){
  var K=Kof(t),pl=clp(K),m=Math.max(Math.hypot(pl[0][0],pl[0][1]),Math.hypot(pl[1][0],pl[1][1]));
  var cx=170,cy=230,R=110;
  var ctx=D.ctx;ctx.save();ctx.fillStyle=RG(C.ok,.09);ctx.beginPath();ctx.arc(cx,cy,R,0,6.2832);ctx.fill();ctx.restore();
  D.line(cx-R-40,cy,cx+R+30,cy,C.ax,1.6);D.head(cx+R+34,cy,0,C.ax,11);D.line(cx,cy+R+26,cx,cy-R-26,C.ax,1.6);D.head(cx,cy-R-30,-Math.PI/2,C.ax,11);
  D.ring(cx,cy,R,C.ax,1.4);D.text('1',cx+R+4,cy+18,{s:13,c:C.mut});D.text('−1',cx-R-6,cy+18,{s:13,c:C.mut,a:'right'});
  function Z(p){return [cx+R*p[0],cy-R*p[1]];}
  /* lugar completo, tenue */
  var l1=[],l2=[];for(var k=0;k<=3.2;k+=0.01){var q=clp(k);l1.push(Z(q[0]));l2.push(Z(q[1]));}D.path(l1,C.hl,1.3,null,0.35);D.path(l2,C.hl,1.3,null,0.35);
  /* lazo abierto */
  D.cross(Z([1,0])[0],cy,7,C.f);D.cross(Z([0.3679,0])[0],cy,7,C.f);D.ring(Z([-0.7181,0])[0],cy,7,C.f,2.2);
  /* polos actuales */
  var col=K<KC-0.02?C.m:(K<KC+0.02?C.hl:C.bad);pl.forEach(function(p){var z=Z(p);D.dot(z[0],z[1],8,col);});
  D.text('K = '+nf(K),cx,40+50,{it:true,s:24,a:'center'});
  D.text('máx |z| = '+nf(m,3),cx,400,{it:true,s:20,a:'center',c:col});
  D.text(K<KC-0.02?'estable':(K<KC+0.02?'límite: K ≈ 2,39':'inestable'),cx,430,{s:20,a:'center',c:col,bold:true});
  /* respuesta al escalón */
  var y=stepCL(K,26);
  var B=D.axes({x:350,y:110,w:250,h:260,xr:[-0.5,25],yr:[-0.5,2.5],xt:[0,10,20],yt:[1,2],xd:0,yd:0,xl:'n',yl:'y[n]',grid:true});
  D.line(B.X(0),B.Y(1),B.X(25),B.Y(1),C.hl,1.2,[5,5],0.6);
  for(var n=0;n<26;n++)D.stem(B,n,clamp(y[n],-0.5,2.48),col,1,3.8);
  D.text('G(z) = K (0,368 z + 0,264) / ((z − 1)(z − 0,368))',W/2,500,{it:true,s:19,a:'center',c:C.mut});
  D.text('ec. característica: z² + (0,368K − 1,368) z + (0,368 + 0,264K) = 0',W/2,532,{it:true,s:17,a:'center',c:C.mut});
 },
 cap:function(t){var K=Kof(t);
  if(K<0.2)return 'Planta 1/(s(s+1)) con ZOH y T = 1 s, controlador proporcional K. Los polos en lazo cerrado salen de los polos en lazo abierto (×).';
  if(K<0.8)return 'Al subir K los dos polos se juntan en el eje real y se separan como <b>par complejo</b>: aparece el sobreimpulso.';
  if(K<KC-0.05)return 'Más K ⇒ polos más cerca del círculo ⇒ más oscilación y más lenta en apagarse. Con K = 1: polos 0,5 ± 0,618j, |z| = 0,795 y 40 % de sobreimpulso.';
  if(K<KC+0.08)return '<b>K crítica</b>: el término independiente vale 1, así que |z| = 1. <i>0,368 + 0,264K = 1 ⇒ K ≈ 2,39</i>.';
  return 'Con K &gt; 2,39 los polos salen del círculo unidad: la respuesta <b>diverge</b>. En continua este lazo sería estable para todo K: el muestreo resta estabilidad.';
 }};

/* =====================================================================
   6. TUSTIN: deformación de frecuencias (warping)
   ===================================================================== */
function wof(t){return lerp(0,14,ease(seg(t,1,14)));}
var tust={title:'Tustin y el warping',H:620,dur:18,poster:7,alt:'Un punto sube por el eje jω; con muestreo exacto su imagen da vueltas al círculo y con Tustin se acerca a −1 sin llegar.',
 draw:function(D,t){
  var w=wof(t),T=1,We=w*T,Wt=2*Math.atan(w*T/2);
  var S=D.axes({x:50,y:90,w:200,h:230,xr:[-2,2],yr:[0,15],xt:[],yt:[5,10],yd:0,xl:'σ',yl:'jω'});
  D.line(S.X(0),S.Y(0),S.X(0),S.Y(w),C.f,4);D.dot(S.X(0),S.Y(w),7,C.f);D.text('ω = '+nf(w,1),S.X(0)+14,S.Y(w)+6,{it:true,s:19,c:C.f});
  var cx=440,cy=210,R=100,ctx=D.ctx;
  D.line(cx-R-30,cy,cx+R+30,cy,C.ax,1.6);D.head(cx+R+34,cy,0,C.ax,11);D.line(cx,cy+R+22,cx,cy-R-24,C.ax,1.6);D.head(cx,cy-R-28,-Math.PI/2,C.ax,11);
  D.ring(cx,cy,R,C.ax,1.3);D.text('−1',cx-R-6,cy+18,{s:13,c:C.mut,a:'right'});D.text('1',cx+R+4,cy+18,{s:13,c:C.mut});
  /* arco exacto (puede dar vueltas) y Tustin */
  ctx.save();ctx.strokeStyle=C.hl;ctx.lineWidth=2;ctx.globalAlpha=.75;ctx.beginPath();ctx.arc(cx,cy,R+8,-Math.min(We,6.283),0);ctx.stroke();ctx.restore();
  ctx.save();ctx.strokeStyle=C.m;ctx.lineWidth=4;ctx.beginPath();ctx.arc(cx,cy,R,-Wt,0);ctx.stroke();ctx.restore();
  D.dot(cx+(R+8)*Math.cos(We),cy-(R+8)*Math.sin(We),6.5,C.hl);D.dot(cx+R*Math.cos(Wt),cy-R*Math.sin(Wt),7.5,C.m);
  D.text('exacto e^{jωT}',W-8,cy+R+26,{it:true,s:17,c:C.hl,a:'right'});D.text('Tustin',W-8,cy+R+48,{it:true,s:17,c:C.m,a:'right'});
  /* gráfica Ω(ω) */
  var B=D.axes({x:80,y:390,w:500,h:170,xr:[0,14],yr:[0,4.3],xt:[2,4,6,8,10,12,14],yt:[Math.PI/2,Math.PI],xd:0,yf:function(v){return v>3?'π':'π/2';},xl:'ω',yl:'Ω',grid:true});
  D.line(B.X(0),B.Y(Math.PI),B.X(14),B.Y(Math.PI),C.mut,1,[5,5]);
  var pe=[],pt=[];for(var s=0;s<=w;s+=0.02){pe.push([B.X(s),B.Y(Math.acos(Math.cos(s*T)))]);pt.push([B.X(s),B.Y(2*Math.atan(s*T/2))]);}
  D.path(pe,C.hl,2,null,0.85);D.path(pt,C.m,3.2);
  D.dot(B.X(w),B.Y(Wt),6,C.m);D.dot(B.X(w),B.Y(Math.acos(Math.cos(We))),5,C.hl);
  D.text('exacto: Ω = ωT (plegada a [0, π])',B.X(3.3),B.Y(3.95),{it:true,s:17,c:C.hl});D.text('Tustin: Ω = 2 atan(ωT/2)',B.X(5.6),B.Y(2.05),{it:true,s:17,c:C.m});
  D.text('s = (2/T) (z − 1)/(z + 1)',W/2,355,{it:true,s:22,a:'center'});
 },
 cap:function(t){var w=wof(t);
  if(w<1.2)return 'Con T = 1 s. Con muestreo exacto, <i>s = jω</i> va a <i>z = e^{jωT}</i>: el punto gira con ángulo Ω = ωT. Con Tustin, el ángulo es <i>2·atan(ωT/2)</i>.';
  if(w<3.5)return 'A frecuencias bajas los dos coinciden (2·atan(x/2) ≈ x): Tustin respeta el comportamiento en baja frecuencia y la ganancia en continua.';
  if(w<7)return 'La imagen exacta pasa de π y da la vuelta: frecuencias distintas caen en el mismo punto (aliasing). Tustin <b>comprime</b> todo el eje jω en media vuelta.';
  return 'Tustin no tiene aliasing y conserva la estabilidad, pero <b>deforma</b> las frecuencias altas (warping). Si importa una frecuencia concreta ω₁, se corrige con prewarping: <i>s = (ω₁/tan(ω₁T/2))·(z − 1)/(z + 1)</i>.';
 }};


/* =====================================================================
   7. SERIE DE FOURIER DE LA ONDA CUADRADA CON EPICICLOS
   ===================================================================== */
var FN=[1,3,10,40];
function fN(N,th){var v=0;for(var k=0;k<N;k++)v+=Math.sin((2*k+1)*th)/(2*k+1);return 4/Math.PI*v;}
var four={title:'Serie de Fourier: la onda cuadrada',H:640,dur:26,poster:6,alt:'Cuatro filas de círculos que giran (epiciclos) con 1, 3, 10 y 40 armónicos impares; la punta dibuja una onda cada vez más cuadrada.',
 draw:function(D,t){
  var th=t*1.7,cols=[C.hl,C.f,C.g,C.ok],ctx=D.ctx,S=34,x0=150,span=470,rowH=128;
  var nShow=t<2?1:(t<6?2:(t<10?3:4));
  FN.forEach(function(N,i){
    var cy=120+i*rowH,cx=62,col=cols[i],al=i<nShow?1:0.18;
    ctx.save();ctx.globalAlpha=al;
    /* epiciclos */
    var x=cx,y=cy;
    for(var k=0;k<N;k++){var n=2*k+1,r=S*4/(Math.PI*n),a=n*th;
      if(r>1.2){ctx.strokeStyle=col;ctx.lineWidth=k===0?1.8:1.1;ctx.globalAlpha=al*(k===0?0.9:0.55);ctx.beginPath();ctx.arc(x,y,r,0,6.2832);ctx.stroke();}
      var nx=x+r*Math.cos(a),ny=y-r*Math.sin(a);ctx.globalAlpha=al*0.8;D.line(x,y,nx,ny,col,1.2);x=nx;y=ny;}
    ctx.globalAlpha=al;D.dot(x,y,3.6,col);
    /* eje y unión con la onda */
    D.line(x0,cy,x0+span,cy,C.grid,1.2,[4,4]);
    D.line(x,y,x0,y,col,1,[3,3]);
    /* onda: lo más reciente a la izquierda */
    var pts=[];for(var u=0;u<=span;u+=2){var tt=th-u/52;pts.push([x0+u,cy-S*fN(N,tt)]);}
    D.path(pts,col,2.2);
    ctx.restore();
    D.text('N = '+N,x0+span-4,cy-S*1.32,{it:true,s:19,c:col,a:'right',al:i<nShow?1:0.35});
  });
  D.text('f_{N}(t) = (4/π) Σ_{k=0}^{N−1} sin((2k+1)t) / (2k+1)',W/2,606,{it:true,s:22,a:'center',c:C.w});
 },
 cap:function(t){
  if(t<2)return 'Con un solo círculo que gira, la punta sube y baja como un seno: <i>(4/π)·sin t</i>, el primer armónico de la onda cuadrada.';
  if(t<6)return 'Encima de cada círculo se monta otro más pequeño que gira más rápido: armónicos <b>impares</b> 3, 5, 7… con amplitud <i>4/(πk)</i>. La suma ya se parece a un escalón.';
  if(t<10)return 'Con 10 términos los tramos son casi planos. Cada armónico nuevo corrige un poco la forma: eso es una serie de Fourier.';
  if(t<17)return 'Con 40 términos la onda es casi cuadrada, pero junto a cada salto queda un <b>pico de ≈ 9 %</b> que no desaparece por muchos términos que sumes: el <b>fenómeno de Gibbs</b>.';
  return 'Idea para el tema: una señal con saltos necesita <b>infinitos armónicos</b> (espectro no limitado). Al muestrearla siempre habrá algo de aliasing; por eso hace falta el filtro antialiasing.';
 }};

var SPECS={fourier:four,conv:conv,alias:alia,smap:smap,zoh:zoh,rloc:rloc,tustin:tust};
var LIO=!window.MANIM_EAGER&&'IntersectionObserver' in window?new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){LIO.unobserve(e.target);var el=e.target,s=SPECS[el.getAttribute('data-anim')];el.style.aspectRatio='';el.style.minHeight='';if(s)Player(el,s);}});},{rootMargin:'400px 0px'}):null;
function init(){document.querySelectorAll('.manim[data-anim]').forEach(function(el){if(el.__p)return;var s=SPECS[el.getAttribute('data-anim')];if(!s)return;el.__p=true;
  if(LIO){el.style.aspectRatio=W+' / '+(s.H+150);LIO.observe(el);}else Player(el,s);});}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);else init();
})();
