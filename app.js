(function(){
  const real=Document.prototype.getElementById;
  window.__gid=function(id){const e=real.call(document,id);if(e)return e;const d=document.createElement('input');d.value='1';d.dataset.ghost=id;return d;};
})();
try{
(function(){
  var ids=['c1','c2','c3','c4','c5','c6','c7','c8'], KEY='cxc-progreso';
  var saved={}; try{saved=JSON.parse(localStorage.getItem(KEY)||'{}')}catch(e){}
  function update(){
    var n=0; ids.forEach(function(id){ if(__gid(id).checked) n++; });
    __gid('barfill').style.width=(n/ids.length*100)+'%';
    __gid('bartxt').textContent=n+' de '+ids.length+' temas';
  }
  ids.forEach(function(id){
    var el=__gid(id); el.checked=!!saved[id];
    el.addEventListener('change',function(){ saved[id]=el.checked; try{localStorage.setItem(KEY,JSON.stringify(saved))}catch(e){} update(); });
  });
  update();

})();
}catch(e){console.warn("cxc-block:",e);}
try{
(function(){
const $=id=>__gid(id);
const fmt=v=>Number.isInteger(v)?String(v):(Math.abs(v)<10?v.toFixed(1):v.toFixed(0));
function plotSVG(o,items){
  const W=o.w||640,H=o.h||210,m={l:40,r:14,t:14,b:28};
  const X=x=>+(m.l+(x-o.x0)/(o.x1-o.x0)*(W-m.l-m.r)).toFixed(2);
  const cl=y=>Math.max(o.y0,Math.min(o.y1,y));
  const Y=y=>+(H-m.b-(cl(y)-o.y0)/(o.y1-o.y0)*(H-m.t-m.b)).toFixed(2);
  let s=`<svg viewBox="0 0 ${W} ${H}" class="plot" role="img" aria-label="${o.label||'gráfica'}">`;
  for(const v of (o.yt||[])) s+=`<line class="grid" x1="${m.l}" x2="${W-m.r}" y1="${Y(v)}" y2="${Y(v)}"/><text class="tk" x="${m.l-6}" y="${Y(v)+4}" text-anchor="end">${o.ytf?o.ytf(v):fmt(v)}</text>`;
  for(const v of (o.xt||[])) s+=`<text class="tk" x="${X(v)}" y="${H-9}" text-anchor="middle">${o.xtf?o.xtf(v):fmt(v)}</text>`;
  const base=(o.y0<=0&&o.y1>=0)?0:o.y0;
  s+=`<line class="ax" x1="${m.l}" x2="${W-m.r}" y1="${Y(base)}" y2="${Y(base)}"/>`;
  if(o.x0<=0&&o.x1>=0) s+=`<line class="ax" x1="${X(0)}" x2="${X(0)}" y1="${m.t}" y2="${H-m.b}"/>`;
  if(o.xl) s+=`<text class="lb" x="${W-m.r}" y="${Y(base)-6}" text-anchor="end">${o.xl}</text>`;
  if(o.yl) s+=`<text class="lb" x="${m.l+6}" y="${m.t+10}">${o.yl}</text>`;
  for(const it of items){
    const c=it.c||'s1';
    if(it.t==='stem'){ it.n.forEach((n,i)=>{ if(n<o.x0||n>o.x1) return; const yy=it.y[i]; s+=`<line class="st ${c}" x1="${X(n)}" x2="${X(n)}" y1="${Y(base)}" y2="${Y(yy)}"/><circle class="${c}" cx="${X(n)}" cy="${Y(yy)}" r="${it.hl===n?6:(it.r||3.5)}"/>`; }); }
    else if(it.t==='line'||it.t==='step'){ let d=''; it.x.forEach((x,i)=>{ if(it.t==='step'&&i>0) d+=`L${X(x)},${Y(it.y[i-1])}`; d+=(i?'L':'M')+X(x)+','+Y(it.y[i]); }); s+=`<path class="ln ${c}" d="${d}"${it.dash?' stroke-dasharray="5 4"':''}${it.w?` stroke-width="${it.w}"`:''}/>`; }
    else if(it.t==='area'){ let d=`M${X(it.x[0])},${Y(base)}`; it.x.forEach((x,i)=>{d+=`L${X(x)},${Y(it.y[i])}`}); d+=`L${X(it.x[it.x.length-1])},${Y(base)}Z`; s+=`<path class="ar ${c}" d="${d}"/>`; }
    else if(it.t==='poly'){ const d=it.pts.map((p,i)=>(i?'L':'M')+X(p[0])+','+Y(p[1])).join('')+'Z'; s+=`<path class="ar ${c}" d="${d}"/>`; }
    else if(it.t==='pt'){ s+=`<circle class="${c}" cx="${X(it.x)}" cy="${Y(it.y)}" r="${it.r||5}"/>`; }
    else if(it.t==='vline'){ s+=`<line class="vl ${c}" x1="${X(it.x)}" x2="${X(it.x)}" y1="${m.t}" y2="${H-m.b}" stroke-dasharray="3 4"/>`; }
    else if(it.t==='text'){ s+=`<text class="lb ${c}" x="${X(it.x)}" y="${Y(it.y)}" text-anchor="${it.a||'middle'}">${it.s}</text>`; }
  }
  return s+'</svg>';
}
function zplaneSVG(poles,zeros,ext,trail){
  ext=ext||1.4; const S=250,c=S/2,k=(S/2-16)/ext;
  const P=(re,im)=>[+(c+Math.max(-ext,Math.min(ext,re))*k).toFixed(2),+(c-Math.max(-ext,Math.min(ext,im))*k).toFixed(2)];
  let s=`<svg viewBox="0 0 ${S} ${S}" class="plot" role="img" aria-label="Plano z con disco unidad">`;
  s+=`<rect class="outz" x="0" y="0" width="${S}" height="${S}" rx="6"/><circle cx="${c}" cy="${c}" r="${k}" class="dbg"/><circle cx="${c}" cy="${c}" r="${k}" class="disk"/>`;
  s+=`<line class="ax" x1="8" x2="${S-8}" y1="${c}" y2="${c}"/><line class="ax" x1="${c}" x2="${c}" y1="8" y2="${S-8}"/>`;
  s+=`<text class="tk" x="${c+k+3}" y="${c+14}">1</text><text class="tk" x="${S-10}" y="${c-6}" text-anchor="end">Re</text><text class="tk" x="${c+6}" y="18">Im</text>`;
  for(const [re,im] of (trail||[])){const [x,y]=P(re,im); s+=`<circle class="s3" cx="${x}" cy="${y}" r="1.3" opacity=".45"/>`;}
  for(const [re,im] of zeros){const [x,y]=P(re,im); s+=`<circle class="zr" cx="${x}" cy="${y}" r="5"/>`;}
  for(const [re,im] of poles){const [x,y]=P(re,im); const bad=Math.hypot(re,im)>=0.9995; s+=`<path class="px ${bad?'s2':'s1'}" d="M${x-6},${y-6}L${x+6},${y+6}M${x+6},${y-6}L${x-6},${y+6}"/>`;}
  return s+'</svg>';
}
const rng=(a,b,st=1)=>{const r=[];for(let v=a;v<=b+1e-9;v+=st)r.push(+v.toFixed(6));return r;};
try{
window.CXC={plotSVG,zplaneSVG,rng};

}catch(e){console.warn("cxc:",e);}
/* T1 periodicidad */
const n24=rng(0,24);
try{
$('fig-per1').innerHTML=plotSVG({x0:-0.5,x1:24.5,y0:-1.25,y1:1.25,yt:[-1,0,1],xt:[0,8,16,24],h:170,xl:'n',yl:'cos(πn/4)',label:'cos(pi n/4), periodo 8'},
  [{t:'vline',x:8,c:'s2'},{t:'vline',x:16,c:'s2'},{t:'vline',x:24,c:'s2'},{t:'text',x:8,y:1.12,s:'N = 8',c:'s2',a:'start'},{t:'stem',n:n24,y:n24.map(k=>Math.cos(Math.PI*k/4))}]);
}catch(e){console.warn("cxc:",e);}
const tt=rng(0,24,0.05);
try{
$('fig-per2').innerHTML=plotSVG({x0:-0.5,x1:24.5,y0:-1.25,y1:1.25,yt:[-1,0,1],xt:[0,8,16,24],h:170,xl:'n',yl:'cos(n/2)',label:'cos(n/2), no periódica'},
  [{t:'line',x:tt,y:tt.map(t=>Math.cos(t/2)),c:'s3',dash:true,w:1.2},{t:'stem',n:n24,y:n24.map(k=>Math.cos(k/2)),c:'s2'}]);

}catch(e){console.warn("cxc:",e);}
/* T2 convolucion */
const K=rng(-8,16), xs=k=>(k>=0&&k<=4)?1:0, hs=m=>m>=0?Math.pow(0.8,m):0;
const yv=m=>{let a=0;for(let k=0;k<=4;k++)a+=xs(k)*hs(m-k);return a;};
function drawConv(){
  const n=+$('cn').value; $('cn-o').textContent='n = '+n;
  const hf=K.map(k=>hs(n-k)), pr=K.map((k,i)=>xs(k)*hf[i]);
  const o={x0:-8.5,x1:16.5,y0:-0.15,y1:1.2,yt:[0,1],xt:[-8,-4,0,4,8,12,16],h:150};
  $('fig-conv1').innerHTML=plotSVG({...o,xl:'k',yl:'x[k] (verde) y h[n−k] (rojo)',label:'x[k] y h[n-k]'},[{t:'stem',n:K,y:K.map(xs)},{t:'stem',n:K,y:hf,c:'s2',r:2.8},{t:'vline',x:n,c:'s2'},{t:'text',x:n,y:1.12,s:'k = n',c:'s2',a:'start'}]);
  $('fig-conv2').innerHTML=plotSVG({...o,xl:'k',yl:'producto x[k]·h[n−k]',label:'producto'},[{t:'stem',n:K,y:pr,c:'s3'}]);
  const M=rng(-8,16), ym=M.map(m=>m<=n?yv(m):NaN);
  const mm=M.filter(m=>m<=n);
  $('fig-conv3').innerHTML=plotSVG({x0:-8.5,x1:16.5,y0:-0.2,y1:3.6,yt:[0,1,2,3],xt:[-8,-4,0,4,8,12,16],h:170,xl:'n',yl:'y[n] = suma del producto',label:'salida y[n]'},[{t:'line',x:M,y:M.map(yv),c:'s3',dash:true,w:1},{t:'stem',n:mm,y:mm.map(yv),hl:n}]);
  const lo=Math.max(0,n-1e9), hi=Math.min(4,n);
  $('cn-cap').textContent = n<0 ? `Con n = ${n} la señal girada h[n−k] no alcanza el pulso: no hay solape y y[${n}] = 0.` :
    `Con n = ${n} se solapan en k = 0 … ${hi}: y[${n}] = suma de ${hi+1} término${hi?'s':''} = ${yv(n).toFixed(3)}. ${n>4?'El pulso ya está entero dentro: a partir de n = 4 la salida decae como 0,8^n.':'Mientras el pulso entra, la salida crece.'}`;
}
try{
$('cn').addEventListener('input',drawConv); drawConv();

}catch(e){console.warn("cxc:",e);}
/* T3 espectro */
const tri=w=>Math.max(0,1-Math.abs(w)/2);
const W=rng(-12,12,0.04);
function drawSpec(){
  const ws=+$('ws').value; $('ws-o').textContent='Ωs = '+ws.toFixed(1);
  const ok=ws>4; const p=$('ws-p'); p.textContent=ok?'sin aliasing':'¡aliasing!'; p.className='pill'+(ok?'':' bad');
  const items=[];
  for(let k=-6;k<=6;k++){const c=k*ws; if(c<-14||c>14) continue; items.push({t:'area',x:[c-2,c,c+2],y:[0,1,0],c:k===0?'area':(ok?'area':'areaw')});}
  items.push({t:'line',x:W,y:W.map(w=>{let a=0;for(let k=-8;k<=8;k++)a+=tri(w-k*ws);return a;}),c:ok?'s1':'s2',w:1.8});
  items.push({t:'vline',x:ws/2,c:'s3'},{t:'vline',x:-ws/2,c:'s3'},{t:'text',x:0,y:1.2,s:'X(Ω)',c:'s1'});
  $('fig-spec').innerHTML=plotSVG({x0:-12,x1:12,y0:0,y1:2.1,yt:[0,1,2],xt:[-12,-8,-4,0,4,8,12],h:200,xl:'Ω',label:'Espectro replicado'},items);
}
try{
$('ws').addEventListener('input',drawSpec); drawSpec();

}catch(e){console.warn("cxc:",e);}
/* T3 alias */
const ta=rng(0,1.6,0.002), ns=rng(0,16);
try{
$('fig-alias').innerHTML=plotSVG({x0:0,x1:1.62,y0:-1.2,y1:1.2,yt:[-1,0,1],xt:[0,0.4,0.8,1.2,1.6],xtf:v=>v.toFixed(1)+' s',h:200,label:'Aliasing: dos cosenos, mismas muestras'},
  [{t:'line',x:ta,y:ta.map(t=>Math.cos(2*Math.PI*9.375*t)),c:'s2',w:1},{t:'line',x:ta,y:ta.map(t=>Math.cos(2*Math.PI*0.625*t)),c:'s1',w:2.4},{t:'stem',n:ns.map(k=>k/10),y:ns.map(k=>Math.cos(Math.PI*k/8)),c:'s3',r:4}]);

}catch(e){console.warn("cxc:",e);}
/* T3 ZOH */
const tz=rng(0,4,0.01), sig=t=>Math.sin(Math.PI*t/2)+0.35*Math.sin(2.2*Math.PI*t), Ts=0.4, tk=rng(0,4,Ts);
const stx=[...tk,4], sty=[...tk.map(sig),sig(tk[tk.length-1])];
try{
$('fig-zoh').innerHTML=plotSVG({x0:0,x1:4,y0:-1.5,y1:1.5,yt:[-1,0,1],xt:[0,1,2,3,4],xtf:v=>v+' s',h:200,label:'Retenedor de orden cero'},
  [{t:'line',x:tz,y:tz.map(sig),c:'s3',dash:true,w:1.4},{t:'step',x:stx,y:sty,c:'s1',w:2.2},{t:'stem',n:tk,y:tk.map(sig),c:'s1',r:3.5},{t:'text',x:3.95,y:1.3,s:'T = 0,4 s',c:'s1',a:'end'}]);

}catch(e){console.warn("cxc:",e);}
/* T4 polos vs h[n] */
function drawZ(){
  const r=+$('zr').value, th=+$('zt').value, a=th*Math.PI/180;
  $('zr-o').textContent='r = '+r.toFixed(2); $('zt-o').textContent='θ = '+th+'°';
  const st=r<0.995?'estable':(r<=1.005?'marginal':'inestable'); const p=$('z-p'); p.textContent=st; p.className='pill'+(st==='estable'?'':' bad');
  const re=r*Math.cos(a), im=r*Math.sin(a);
  $('fig-zp').innerHTML=zplaneSVG(im>1e-9?[[re,im],[re,-im]]:[[re,0]],[],1.4);
  const nn=rng(0,30);
  $('fig-zh').innerHTML=plotSVG({x0:-0.5,x1:30.5,y0:-2,y1:2,yt:[-2,-1,0,1,2],xt:[0,5,10,15,20,25,30],h:230,xl:'n',yl:'h[n] = rⁿ cos(θn)',label:'Respuesta impulsiva'},
    [{t:'line',x:nn,y:nn.map(k=>Math.pow(r,k)),c:'s3',dash:true,w:1},{t:'line',x:nn,y:nn.map(k=>-Math.pow(r,k)),c:'s3',dash:true,w:1},{t:'stem',n:nn,y:nn.map(k=>Math.pow(r,k)*Math.cos(a*k)),c:st==='estable'?'s1':'s2'}]);
}
try{
$('zr').addEventListener('input',drawZ); $('zt').addEventListener('input',drawZ); drawZ();

}catch(e){console.warn("cxc:",e);}
/* T5 mapeo s -> z */
try{
(function(){
  const Wd=660,Hd=260;
  let s=`<svg viewBox="0 0 ${Wd} ${Hd}" class="plot" role="img" aria-label="Mapeo del plano s al plano z">
  <defs><marker id="ahm" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path class="ahd" d="M0,0L10,5L0,10Z"/></marker></defs>`;
  // plano s
  const sx0=20,sy0=20,sw=240,sh=220,scx=sx0+sw/2,scy=sy0+sh/2,ks=40;
  s+=`<rect class="ar area" x="${sx0}" y="${sy0}" width="${sw/2}" height="${sh}"/><rect class="ar areaw" x="${scx}" y="${sy0}" width="${sw/2}" height="${sh}"/>`;
  s+=`<line class="ax" x1="${sx0}" x2="${sx0+sw}" y1="${scy}" y2="${scy}"/><line class="ax" x1="${scx}" x2="${scx}" y1="${sy0}" y2="${sy0+sh}"/>`;
  s+=`<text class="lb s3" x="${sx0+6}" y="${sy0+16}">plano s</text><text class="tk" x="${sx0+sw-4}" y="${scy-6}" text-anchor="end">σ</text><text class="tk" x="${scx+6}" y="${sy0+14}">jω</text>`;
  const cross=(x,y,c)=>`<path class="px ${c}" d="M${x-6},${y-6}L${x+6},${y+6}M${x+6},${y-6}L${x-6},${y+6}"/>`;
  s+=cross(scx-ks,scy-2*ks,'s1')+cross(scx-ks,scy+2*ks,'s1')+cross(scx+0.5*ks,scy,'s2');
  s+=`<text class="lb s1" x="${scx-ks+10}" y="${scy-2*ks+4}">−1+2j</text><text class="lb s2" x="${scx+0.5*ks+8}" y="${scy-8}">0,5</text>`;
  // flecha
  s+=`<path class="wire" d="M285,130L365,130" marker-end="url(#ahm)"/><text class="bt" x="325" y="118" text-anchor="middle">z = e^(sT)</text><text class="tk" x="325" y="152" text-anchor="middle">T = 0,5 s</text>`;
  // plano z
  const zx0=390,zw=250,zcx=zx0+zw/2,zcy=130,kz=80;
  s+=`<rect class="outz" x="${zx0}" y="20" width="${zw}" height="220" rx="6"/><circle class="dbg" cx="${zcx}" cy="${zcy}" r="${kz}"/><circle class="disk" cx="${zcx}" cy="${zcy}" r="${kz}"/>`;
  s+=`<line class="ax" x1="${zx0}" x2="${zx0+zw}" y1="${zcy}" y2="${zcy}"/><line class="ax" x1="${zcx}" x2="${zcx}" y1="20" y2="240"/>`;
  s+=`<text class="lb s3" x="${zx0+6}" y="36">plano z</text><text class="tk" x="${zcx+kz+3}" y="${zcy+14}">1</text>`;
  const zr=Math.exp(-0.5), za=1, zre=zr*Math.cos(za), zim=zr*Math.sin(za);
  s+=cross(zcx+zre*kz,zcy-zim*kz,'s1')+cross(zcx+zre*kz,zcy+zim*kz,'s1')+cross(zcx+Math.exp(0.25)*kz,zcy,'s2');
  s+=`<text class="lb s1" x="${zcx+zre*kz+10}" y="${zcy-zim*kz-4}">0,61∠57°</text><text class="lb s2" x="${zcx+Math.exp(0.25)*kz-4}" y="${zcy-10}" text-anchor="middle">1,28</text>`;
  s+=`<text class="tk" x="${zcx}" y="${zcy+kz-10}" text-anchor="middle">estable</text><text class="tk" x="${zx0+zw-6}" y="232" text-anchor="end">inestable</text>`;
  $('fig-map').innerHTML=s+'</svg>';
})();

}catch(e){console.warn("cxc:",e);}
/* T5 diagrama de bloques */
try{
(function(){
  const y=60;
  let s=`<svg viewBox="0 0 680 170" class="plot" role="img" aria-label="Lazo de control digital: muestreador, controlador, ZOH, planta y realimentación">
  <defs><marker id="ahb" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path class="ahd" d="M0,0L10,5L0,10Z"/></marker></defs>`;
  const arrow=(x1,x2)=>`<path class="wire" d="M${x1},${y}L${x2},${y}" marker-end="url(#ahb)"/>`;
  s+=`<text class="bt" x="8" y="${y+5}">r(t)</text>`+arrow(36,74);
  s+=`<circle class="blk" cx="88" cy="${y}" r="13"/><text class="bt" x="88" y="${y+5}" text-anchor="middle">Σ</text><text class="bt" x="70" y="${y+30}">−</text>`;
  s+=`<path class="wire" d="M101,${y}L122,${y}"/><path class="wire" d="M122,${y}L138,${y-11}"/><path class="wire" d="M142,${y}L156,${y}" marker-end="url(#ahb)"/><text class="tk" x="132" y="${y+18}" text-anchor="middle">T</text><text class="tk" x="111" y="${y-10}" text-anchor="middle">e</text>`;
  s+=`<rect class="blk" x="158" y="${y-20}" width="84" height="40" rx="4"/><text class="bt" x="200" y="${y+5}" text-anchor="middle">Gc(z)</text>`;
  s+=arrow(242,288)+`<text class="tk" x="265" y="${y-8}" text-anchor="middle">u[k]</text>`;
  s+=`<rect class="blk" x="290" y="${y-20}" width="80" height="40" rx="4"/><text class="bt" x="330" y="${y+5}" text-anchor="middle">ZOH</text>`;
  s+=arrow(370,408);
  s+=`<rect class="blk" x="410" y="${y-20}" width="90" height="40" rx="4"/><text class="bt" x="455" y="${y+5}" text-anchor="middle">Gₚ(s)</text>`;
  s+=arrow(500,610)+`<text class="bt" x="616" y="${y+5}">y(t)</text>`;
  s+=`<path class="wire" d="M560,${y}L560,130L88,130L88,${y+13}" marker-end="url(#ahb)"/><circle class="s3" cx="560" cy="${y}" r="3"/>`;
  s+=`<path class="wire" d="M290,${y+28}L290,${y+34}L500,${y+34}L500,${y+28}" stroke-dasharray="3 3"/><text class="lb s1" x="395" y="${y+52}" text-anchor="middle">G(z) = (1 − z⁻¹)·Z{Gₚ(s)/s}</text>`;
  $('fig-blk').innerHTML=s+'</svg>';
})();

}catch(e){console.warn("cxc:",e);}
/* T6 triangulo de Jury */
function drawJ(){
  const k=+$('jk').value; $('jk-o').textContent='K = '+k.toFixed(2);
  const a1=0.3679*k-1.3679, a0=0.3679+0.2642*k;
  const d=a1*a1-4*a0; let roots;
  if(d>=0){roots=[[(-a1+Math.sqrt(d))/2,0],[(-a1-Math.sqrt(d))/2,0]];} else {roots=[[-a1/2,Math.sqrt(-d)/2],[-a1/2,-Math.sqrt(-d)/2]];}
  const mx=Math.max(...roots.map(r=>Math.hypot(r[0],r[1])));
  const ok=mx<0.9995&&k>0; const p=$('jk-p'); p.textContent=ok?('estable · |z|máx = '+mx.toFixed(3)):(k===0?'marginal (polo en z = 1)':('inestable · |z|máx = '+mx.toFixed(3))); p.className='pill'+(ok?'':' bad');
  const trail=[]; for(let q=0;q<=3.0001;q+=0.02){const b1=0.3679*q-1.3679,b0=0.3679+0.2642*q,dd=b1*b1-4*b0; if(dd>=0){trail.push([(-b1+Math.sqrt(dd))/2,0],[(-b1-Math.sqrt(dd))/2,0]);} else {trail.push([-b1/2,Math.sqrt(-dd)/2],[-b1/2,-Math.sqrt(-dd)/2]);}}
  $('fig-jz').innerHTML=zplaneSVG(roots,[[-0.2642/0.3679,0]],1.4,trail);
  const KK=rng(0,3,0.05);
  $('fig-jt').innerHTML=plotSVG({x0:-2.4,x1:2.4,y0:-1.3,y1:1.5,yt:[-1,0,1],xt:[-2,-1,0,1,2],h:250,xl:'a₁',yl:'a₀',label:'Triángulo de estabilidad'},
    [{t:'poly',pts:[[-2,1],[2,1],[0,-1]],c:'area'},{t:'line',x:KK.map(q=>0.3679*q-1.3679),y:KK.map(q=>0.3679+0.2642*q),c:'s3',w:1.4,dash:true},
     {t:'text',x:0,y:0.45,s:'estable',c:'s1'},{t:'pt',x:-0.488,y:1,c:'s2',r:3.5},{t:'text',x:-0.49,y:1.2,s:'sale en K = 2,39',c:'s2'},{t:'pt',x:a1,y:a0,c:ok?'s1':'s2',r:6}]);
}
try{
$('jk').addEventListener('input',drawJ); drawJ();

}catch(e){console.warn("cxc:",e);}
/* T7 deadbeat */
function stepResp(b,a,N){const y=[],u=n=>n>=0?1:0;for(let n=0;n<N;n++){let v=0;b.forEach((bi,i)=>v+=bi*u(n-i));a.forEach((ai,i)=>{if(i>0)v-=ai*(y[n-i]||0)});y.push(v/a[0]);}return y;}
const N9=rng(0,9), o9={x0:-0.5,x1:9.5,y0:0,y1:1.25,yt:[0,0.5,1],xt:[0,3,6,9],w:300,h:180,xl:'n'};
const y1=stepResp([0,1],[1],10), y2=stepResp([0,0.43987,0.43987*1.2734],[1],10), y3=stepResp([0,1.0641],[1,0.054024,0.010052],10);
try{
$('fig-db1').innerHTML=plotSVG({...o9,label:'Deadbeat H = 1/z'},[{t:'stem',n:N9,y:y1}]);
}catch(e){console.warn("cxc:",e);}
try{
$('fig-db2').innerHTML=plotSVG({...o9,label:'Deadbeat 2023'},[{t:'stem',n:N9,y:y2}]);
}catch(e){console.warn("cxc:",e);}
try{
$('fig-db3').innerHTML=plotSVG({...o9,label:'Ragazzini 2021'},[{t:'stem',n:N9,y:y3,c:'s3'}]);

}catch(e){console.warn("cxc:",e);}
})();
}catch(e){console.warn("cxc-block:",e);}
try{
(function(){
const $=id=>__gid(id);
const cross=(x,y,c)=>`<path class="px ${c}" d="M${x-5},${y-5}L${x+5},${y+5}M${x+5},${y-5}L${x-5},${y+5}"/>`;
function circleSVG(pts,opts){
  const S=250,c=S/2,k=(S/2-24); let s=`<svg viewBox="0 0 ${S} ${S}" class="plot" role="img" aria-label="${opts.label}">`;
  s+=`<defs><marker id="${opts.id}" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path class="ahd" d="M0,0L10,5L0,10Z"/></marker></defs>`;
  s+=`<circle class="dbg" cx="${c}" cy="${c}" r="${k}"/><circle class="disk" cx="${c}" cy="${c}" r="${k}"/>`;
  s+=`<line class="ax" x1="6" x2="${S-6}" y1="${c}" y2="${c}"/><line class="ax" x1="${c}" x2="${c}" y1="6" y2="${S-6}"/>`;
  pts.forEach((a,i)=>{const x=c+k*Math.cos(a),y=c-k*Math.sin(a); s+=`<line class="wire" x1="${c}" y1="${c}" x2="${x.toFixed(1)}" y2="${y.toFixed(1)}" marker-end="url(#${opts.id})" opacity="${opts.fade?Math.max(.35,1-i*.12):1}"/>`;
    const lx=c+(k+13)*Math.cos(a)+ (opts.dup&&opts.dup[i]?6*opts.dup[i]:0), ly=c-(k+13)*Math.sin(a)+4; s+=`<text class="tk" x="${lx.toFixed(1)}" y="${ly.toFixed(1)}" text-anchor="middle">${i}</text>`;});
  return s+'</svg>';
}
/* P1 */
function drawE1(){
  const k=+$('ek').value,N=8,M=3; $('ek-o').textContent='k = '+k;
  const g=(a,b)=>b?g(b,a%b):a, d=g(k,N)||N;
  const ang=[...Array(N).keys()].map(n=>2*Math.PI*k*M*n/N);
  let sx=0,sy=0; ang.forEach(a=>{sx+=Math.cos(a);sy+=Math.sin(a);});
  const Sv=Math.hypot(sx,sy); const p=$('ek-p'); p.textContent=(k%N===0)?'S = N = 8':('S = 0 · polígono de '+(N/d)+' lados'); p.className='pill'+(k%N===0?' bad':'');
  // izquierda: puntos sobre la circunferencia; etiquetas apiladas si coinciden
  const S=250,c=S/2,R=S/2-40; let s=`<svg viewBox="0 0 ${S} ${S}" class="plot" role="img" aria-label="Términos sobre la circunferencia unidad">`;
  s+=`<circle class="dbg" cx="${c}" cy="${c}" r="${R}"/><circle class="disk" cx="${c}" cy="${c}" r="${R}"/><line class="ax" x1="6" x2="${S-6}" y1="${c}" y2="${c}"/><line class="ax" x1="${c}" x2="${c}" y1="6" y2="${S-6}"/>`;
  const seen={};
  ang.forEach((a,n)=>{const key=((Math.round(a/(2*Math.PI)*N)%N)+N)%N; const cnt=seen[key]=(seen[key]||0)+1;
    const x=c+R*Math.cos(a),y=c-R*Math.sin(a); s+=`<line class="wire" x1="${c}" y1="${c}" x2="${x.toFixed(1)}" y2="${y.toFixed(1)}" opacity=".5"/><circle class="s1" cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="4"/>`;
    const rr=R+12+(cnt-1)*11; s+=`<text class="tk" x="${(c+rr*Math.cos(a)).toFixed(1)}" y="${(c-rr*Math.sin(a)+4).toFixed(1)}" text-anchor="middle">${n}</text>`;});
  $('fig-ep1a').innerHTML=s+'</svg>';
  // derecha: suma cabeza-cola
  let px=0,py=0; const path=[[0,0]]; ang.forEach(a=>{px+=Math.cos(a);py+=Math.sin(a);path.push([px,py]);});
  const xs=path.map(q=>q[0]),ys=path.map(q=>q[1]); const pad=0.6;
  let x0=Math.min(...xs)-pad,x1=Math.max(...xs)+pad,y0=Math.min(...ys)-pad,y1=Math.max(...ys)+pad;
  const span=Math.max(x1-x0,y1-y0); const cx=(x0+x1)/2,cy=(y0+y1)/2; x0=cx-span/2;x1=cx+span/2;y0=cy-span/2;y1=cy+span/2;
  const W=250,H=250,sc=Math.min(W,H)/span,ox=(W-span*sc)/2,oy=(H-span*sc)/2;
  const X=x=>(ox+(x-x0)*sc).toFixed(1),Y=y=>(H-oy-(y-y0)*sc).toFixed(1);
  let t=`<svg viewBox="0 0 ${W} ${H}" class="plot" role="img" aria-label="Suma vectorial cabeza con cola"><defs><marker id="ahe1" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path class="ahd" d="M0,0L10,5L0,10Z"/></marker></defs>`;
  for(let i=0;i<N;i++){const a=path[i],b=path[i+1]; t+=`<line class="wire" x1="${X(a[0])}" y1="${Y(a[1])}" x2="${X(b[0])}" y2="${Y(b[1])}" marker-end="url(#ahe1)" opacity="${Math.max(.4,1-i*.07)}"/>`;}
  t+=`<circle class="s2" cx="${X(0)}" cy="${Y(0)}" r="4.5"/><text class="lb s2" x="${(+X(0)-8)}" y="${(+Y(0)+18)}" text-anchor="end">origen</text>`;
  if(Sv>1e-6) t+=`<line class="ln s2" x1="${X(0)}" y1="${Y(0)}" x2="${X(px)}" y2="${Y(py)}" stroke-dasharray="5 4"/><text class="lb s2" x="${X(px/2)}" y="${(+Y(py/2)-8)}" text-anchor="middle">S = ${Sv.toFixed(0)}</text>`;
  else t+=`<text class="lb s1" x="${W-8}" y="${H-10}" text-anchor="end">el camino se cierra: S = 0</text>`;
  $('fig-ep1b').innerHTML=t+'</svg>';
}
try{
$('ek').addEventListener('input',drawE1); drawE1();

}catch(e){console.warn("cxc:",e);}
/* P2: |lambda| vs Omega */
function drawE2(){
  const P=+$('ep').value; $('ep-o').textContent='P = '+P;
  const W=[]; for(let w=-Math.PI;w<=Math.PI+1e-9;w+=Math.PI/300) W.push(w);
  const mag=w=>{let re=0,im=0;for(let m=0;m<P;m++){re+=Math.cos(w*m);im-=Math.sin(w*m);}return Math.hypot(re,im);};
  const zk=[]; for(let k=-P;k<=P;k++){const w=2*Math.PI*k/P; if(k!==0&&w>-Math.PI+1e-9&&w<=Math.PI+1e-9) zk.push(w);}
  // reutiliza el plotter global si existe
  const W0=640,H=200,m={l:40,r:14,t:14,b:28},x0=-Math.PI,x1=Math.PI,y0=0,y1=8.5;
  const X=x=>(m.l+(x-x0)/(x1-x0)*(W0-m.l-m.r)).toFixed(2), Y=y=>(H-m.b-(y-y0)/(y1-y0)*(H-m.t-m.b)).toFixed(2);
  let s=`<svg viewBox="0 0 ${W0} ${H}" class="plot" role="img" aria-label="Módulo de lambda">`;
  [0,2,4,6,8].forEach(v=>{s+=`<line class="grid" x1="${m.l}" x2="${W0-m.r}" y1="${Y(v)}" y2="${Y(v)}"/><text class="tk" x="${m.l-6}" y="${(+Y(v)+4)}" text-anchor="end">${v}</text>`;});
  [[-Math.PI,'−π'],[-Math.PI/2,'−π/2'],[0,'0'],[Math.PI/2,'π/2'],[Math.PI,'π']].forEach(([v,l])=>{s+=`<text class="tk" x="${X(v)}" y="${H-9}" text-anchor="middle">${l}</text>`;});
  s+=`<line class="ax" x1="${m.l}" x2="${W0-m.r}" y1="${Y(0)}" y2="${Y(0)}"/><line class="ax" x1="${X(0)}" x2="${X(0)}" y1="${m.t}" y2="${H-m.b}"/>`;
  s+=`<path class="ln s1" d="${W.map((w,i)=>(i?'L':'M')+X(w)+','+Y(mag(w))).join('')}"/>`;
  zk.forEach(w=>{s+=`<circle class="s2" cx="${X(w)}" cy="${Y(0)}" r="5"/>`;});
  s+=`<text class="lb s1" x="${(+X(0)+6)}" y="${(+Y(P)-6)}">|λ| = P = ${P}</text><text class="lb" x="${W0-m.r}" y="${(+Y(0)-8)}" text-anchor="end">Ω₀</text>`;
  $('fig-ep2').innerHTML=s+'</svg>';
}
try{
$('ep').addEventListener('input',drawE2); drawE2();

}catch(e){console.warn("cxc:",e);}
/* P3: rotación aparente */
function drawE3(){
  const f0=+$('ef').value,fs=50; $('ef-o').textContent='f₀ = '+f0+' Hz';
  const raw=2*Math.PI*f0/fs; let Om=((raw+Math.PI)%(2*Math.PI)+2*Math.PI)%(2*Math.PI)-Math.PI; if(Math.abs(Om+Math.PI)<1e-9) Om=Math.PI;
  const fa=Om/(2*Math.PI)*fs; const p=$('ef-p');
  const sense=Math.abs(Om)<1e-9?'parece quieta (0 Hz)':(Math.abs(Om-Math.PI)<1e-9?'salta media vuelta: sentido ambiguo':(Om>0?'gira antihorario a '+fa.toFixed(0)+' Hz':'¡gira al revés! '+fa.toFixed(0)+' Hz'));
  p.textContent=`Ω = ${(Om/Math.PI).toFixed(2)}π · ${sense}`; p.className='pill'+(Om<0?' bad':'');
  const pts=[0,1,2,3,4,5].map(n=>raw*n);
  const S=250,c=S/2,R=S/2-26; let s=`<svg viewBox="0 0 ${S} ${S}" class="plot" role="img" aria-label="Muestras sobre la circunferencia unidad"><defs><marker id="ahe3" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path class="ahd" d="M0,0L10,5L0,10Z"/></marker></defs>`;
  s+=`<circle class="dbg" cx="${c}" cy="${c}" r="${R}"/><circle class="disk" cx="${c}" cy="${c}" r="${R}"/><line class="ax" x1="6" x2="${S-6}" y1="${c}" y2="${c}"/><line class="ax" x1="${c}" x2="${c}" y1="6" y2="${S-6}"/>`;
  // arco de giro aparente entre n=0 y n=1
  const r2=R*0.45, steps=24; let d=''; for(let i=0;i<=steps;i++){const a=Om*i/steps; d+=(i?'L':'M')+(c+r2*Math.cos(a)).toFixed(1)+','+(c-r2*Math.sin(a)).toFixed(1);}
  if(Math.abs(Om)>1e-6) s+=`<path class="ln ${Om<0?'s2':'s1'}" d="${d}" marker-end="url(#ahe3)"/>`;
  const seen={};
  pts.forEach((a,n)=>{const key=Math.round((((a%(2*Math.PI))+2*Math.PI)%(2*Math.PI))*1000); const cnt=seen[key]=(seen[key]||0)+1;
    const x=c+R*Math.cos(a),y=c-R*Math.sin(a); s+=`<circle class="${n===0?'s3':(Om<0?'s2':'s1')}" cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="4.5"/>`;
    const rr=R+13+(cnt-1)*11; s+=`<text class="tk" x="${(c+rr*Math.cos(a)).toFixed(1)}" y="${(c-rr*Math.sin(a)+4).toFixed(1)}" text-anchor="middle">${n}</text>`;});
  $('fig-ep3a').innerHTML=s+'</svg>';
  // derecha: ángulo acumulado real vs aparente
  const N=[0,1,2,3,4,5]; const W0=420,H=230,m={l:44,r:14,t:14,b:28}; const ymax=Math.max(2*Math.PI,raw*5)*1.05, ymin=Math.min(0,Om*5)*1.1-0.3;
  const X=x=>(m.l+x/5.3*(W0-m.l-m.r)).toFixed(1), Y=y=>(H-m.b-(y-ymin)/(ymax-ymin)*(H-m.t-m.b)).toFixed(1);
  let t=`<svg viewBox="0 0 ${W0} ${H}" class="plot" role="img" aria-label="Ángulo real frente a aparente">`;
  for(let v=Math.ceil(ymin/(2*Math.PI));v*2*Math.PI<=ymax;v++){t+=`<line class="grid" x1="${m.l}" x2="${W0-m.r}" y1="${Y(v*2*Math.PI)}" y2="${Y(v*2*Math.PI)}"/><text class="tk" x="${m.l-6}" y="${(+Y(v*2*Math.PI)+4)}" text-anchor="end">${v} v</text>`;}
  N.forEach(n=>{t+=`<text class="tk" x="${X(n)}" y="${H-9}" text-anchor="middle">${n}</text>`;});
  t+=`<line class="ax" x1="${m.l}" x2="${W0-m.r}" y1="${Y(0)}" y2="${Y(0)}"/>`;
  t+=`<path class="ln s3" d="${N.map((n,i)=>(i?'L':'M')+X(n)+','+Y(raw*n)).join('')}" stroke-dasharray="5 4"/>`;
  t+=`<path class="ln ${Om<0?'s2':'s1'}" d="${N.map((n,i)=>(i?'L':'M')+X(n)+','+Y(Om*n)).join('')}"/>`;
  N.forEach(n=>{t+=`<circle class="${Om<0?'s2':'s1'}" cx="${X(n)}" cy="${Y(Om*n)}" r="3.5"/>`;});
  t+=`<text class="lb s3" x="${X(5)}" y="${(+Y(raw*5)-8)}" text-anchor="end">real: ${(raw/(2*Math.PI)).toFixed(2)} vueltas/muestra</text>`;
  t+=`<text class="lb ${Om<0?'s2':'s1'}" x="${X(5)}" y="${(+Y(Om*5)-10)}" text-anchor="end">aparente: ${(Om/(2*Math.PI)).toFixed(2)}</text><text class="lb" x="${W0-m.r}" y="${(+Y(0)+16)}" text-anchor="end">n</text>`;
  $('fig-ep3b').innerHTML=t+'</svg>';
}
try{
$('ef').addEventListener('input',drawE3); drawE3();

}catch(e){console.warn("cxc:",e);}
})();
}catch(e){console.warn("cxc-block:",e);}
try{
(function(){
const {plotSVG,zplaneSVG,rng}=window.CXC;
const $=id=>__gid(id);
const f2=v=>(Math.abs(v)<1e-12?0:v).toFixed(2), f3=v=>(Math.abs(v)<1e-12?0:v).toFixed(3), f4=v=>(Math.abs(v)<1e-12?0:v).toFixed(4);
const on=(ids,fn)=>{ids.forEach(id=>$(id).addEventListener('input',fn));fn();};
const gcd=(a,b)=>{a=Math.abs(a);b=Math.abs(b);while(b){[a,b]=[b,a%b];}return a;};
const arrowDef=id=>`<defs><marker id="${id}" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path class="ahd" d="M0,0L10,5L0,10Z"/></marker></defs>`;
const pill=(id,txt,ok)=>{const p=$(id);p.textContent=txt;p.className='pill'+(ok?'':' bad');};
const yr=(arr,pad=0.15,min=-1,max=1)=>{let lo=Math.min(min,...arr),hi=Math.max(max,...arr);const d=(hi-lo)*pad||0.5;return [lo-d,hi+d];};

/* ---------- Kit: e^{j theta} ---------- */
function drawK(){
  const th=+$('k-th').value,a=th*Math.PI/180; $('k-th-o').textContent='θ = '+th+'°';
  const S=250,c=125,R=92,x=c+R*Math.cos(a),y=c-R*Math.sin(a);
  let s=`<svg viewBox="0 0 ${S} ${S}" class="plot" role="img" aria-label="Número complejo sobre la circunferencia unidad">${arrowDef('ahk')}`;
  s+=`<circle class="dbg" cx="${c}" cy="${c}" r="${R}"/><circle class="disk" cx="${c}" cy="${c}" r="${R}"/>`;
  s+=`<line class="ax" x1="8" x2="${S-8}" y1="${c}" y2="${c}"/><line class="ax" x1="${c}" x2="${c}" y1="8" y2="${S-8}"/>`;
  s+=`<line class="ln s1" x1="${x}" y1="${y}" x2="${x}" y2="${c}" stroke-dasharray="4 3" stroke-width="1.6"/><line class="ln s2" x1="${x}" y1="${y}" x2="${c}" y2="${y}" stroke-dasharray="4 3" stroke-width="1.6"/>`;
  s+=`<line class="ln s1" x1="${c}" y1="${c}" x2="${x}" y2="${c}" stroke-width="3.5"/><line class="ln s2" x1="${c}" y1="${c}" x2="${c}" y2="${y}" stroke-width="3.5"/>`;
  s+=`<line class="wire" x1="${c}" y1="${c}" x2="${x.toFixed(1)}" y2="${y.toFixed(1)}" marker-end="url(#ahk)" stroke-width="2"/><circle class="s3" cx="${x}" cy="${y}" r="4.5"/>`;
  let d='';for(let i=0;i<=30;i++){const b=a*i/30;d+=(i?'L':'M')+(c+22*Math.cos(b)).toFixed(1)+','+(c-22*Math.sin(b)).toFixed(1);} s+=`<path class="ln s3" d="${d}" stroke-width="1.2"/>`;
  s+=`<text class="lb s1" x="${(c+x)/2}" y="${c+(Math.sin(a)>=0?16:-8)}" text-anchor="middle">cos θ</text><text class="lb s2" x="${c+(Math.cos(a)>=0?-8:8)}" y="${(c+y)/2}" text-anchor="${Math.cos(a)>=0?'end':'start'}">sin θ</text>`;
  s+=`<text class="tk" x="${S-10}" y="${c-6}" text-anchor="end">Re</text><text class="tk" x="${c+6}" y="16">Im</text>`;
  $('k-circ').innerHTML=s+'</svg>';
  const T=rng(0,360,2);
  $('k-wave').innerHTML=plotSVG({x0:0,x1:360,y0:-1.25,y1:1.25,yt:[-1,0,1],xt:[0,90,180,270,360],xtf:v=>v+'°',h:230,label:'coseno y seno'},
    [{t:'line',x:T,y:T.map(v=>Math.cos(v*Math.PI/180)),c:'s1'},{t:'line',x:T,y:T.map(v=>Math.sin(v*Math.PI/180)),c:'s2'},{t:'vline',x:th,c:'s3'},{t:'pt',x:th,y:Math.cos(a),c:'s1',r:5},{t:'pt',x:th,y:Math.sin(a),c:'s2',r:5},{t:'text',x:8,y:1.12,s:'cos',c:'s1',a:'start'},{t:'text',x:62,y:1.12,s:'sin',c:'s2',a:'start'}]);
  $('k-txt').textContent=`e^(j·${th}°) = cos(${th}°) + j·sin(${th}°) = ${f3(Math.cos(a))} ${Math.sin(a)<0?'−':'+'} j·${f3(Math.abs(Math.sin(a)))}     |e^(jθ)| = 1 siempre\nEn radianes: θ = ${f3(a)} rad = ${f3(a/Math.PI)}π`;
}
try{
on(['k-th'],drawK);

}catch(e){console.warn("cxc:",e);}
/* ---------- W1: muestreo + cuantización ---------- */
function drawW1(){
  const T=+$('w1-T').value,b=+$('w1-b').value; $('w1-T-o').textContent='T = '+T.toFixed(2)+' s'; $('w1-b-o').textContent=b+' bits';
  const xs=t=>Math.sin(2*Math.PI*0.5*t)+0.4*Math.sin(2*Math.PI*1.3*t+0.5);
  const L=Math.pow(2,b-1),D=3/Math.pow(2,b),q=v=>D*Math.max(-L,Math.min(L-1,Math.round(v/D)));
  const tc=rng(0,4,0.01),tk=rng(0,4,T),xq=tk.map(t=>q(xs(t)));
  const items=[];
  if(Math.pow(2,b)<=16) for(let k=-L;k<=L-1;k++) items.push({t:'line',x:[0,4],y:[k*D,k*D],c:'s3',w:0.35,dash:true});
  items.push({t:'line',x:tc,y:tc.map(xs),c:'s3',w:1.4,dash:true},{t:'step',x:[...tk,4],y:[...xq,xq[xq.length-1]],c:'s1',w:2},{t:'stem',n:tk,y:xq,c:'s1',r:3});
  $('w1-plot').innerHTML=plotSVG({x0:0,x1:4,y0:-1.7,y1:1.7,yt:[-1.5,0,1.5],ytf:v=>v.toFixed(1),xt:[0,1,2,3,4],xtf:v=>v+' s',h:220,label:'Señal, muestras cuantizadas y escalera'},items);
  const e=tk.map((t,i)=>xq[i]-xs(t)),m=Math.max(D/2,1e-3)*1.4;
  $('w1-err').innerHTML=plotSVG({x0:0,x1:4,y0:-m,y1:m,yt:[-D/2,0,D/2],ytf:v=>v.toFixed(3),xt:[0,1,2,3,4],xtf:v=>v+' s',h:130,yl:'error de cuantización',label:'Error de cuantización'},[{t:'line',x:[0,4],y:[D/2,D/2],c:'s2',w:1,dash:true},{t:'line',x:[0,4],y:[-D/2,-D/2],c:'s2',w:1,dash:true},{t:'stem',n:tk,y:e,c:'s2',r:2.5}]);
  $('w1-txt').textContent=`${(1/T).toFixed(1)} muestras por segundo · ${Math.pow(2,b)} niveles en ±1,5 V · Δ = 3/2^${b} = ${f4(D)} V\nError máximo ±Δ/2 = ${f4(D/2)} V · SNR ≈ 6,02·${b} + 1,76 = ${(6.02*b+1.76).toFixed(1)} dB`;
}
try{
on(['w1-T','w1-b'],drawW1);

}catch(e){console.warn("cxc:",e);}
/* ---------- W2: periodicidad ---------- */
function drawW2(){
  const M=+$('w2-M').value,N=+$('w2-N').value,irr=$('w2-irr').checked;
  $('w2-M-o').textContent='M = '+M; $('w2-N-o').textContent='N = '+N;
  const g=gcd(M,N),N0=N/g,W=irr?1:2*Math.PI*M/N;
  const n=rng(0,40),tc=rng(0,40,0.05),items=[];
  if(!irr&&N0>1) for(let k=N0;k<=40;k+=N0) items.push({t:'vline',x:k,c:'s2'});
  items.push({t:'line',x:tc,y:tc.map(t=>Math.cos(W*t)),c:'s3',w:1,dash:true},{t:'stem',n,y:n.map(k=>Math.cos(W*k)),c:irr?'s2':'s1',r:3});
  $('w2-plot').innerHTML=plotSVG({x0:-0.5,x1:40.5,y0:-1.25,y1:1.25,yt:[-1,0,1],xt:[0,10,20,30,40],h:190,xl:'n',label:'Secuencia coseno'},items);
  pill('w2-p',irr?'no periódica':(N0===1?'constante (N₀ = 1)':'periódica, N₀ = '+N0),!irr);
  $('w2-txt').textContent=irr?`Ω₀ = 1 rad → Ω₀/2π = 1/(2π), que es irracional: ningún número entero de muestras da vueltas completas.`:
   `Ω₀ = 2π·${M}/${N}  →  Ω₀/2π = ${M}/${N}${g>1?` = ${M/g}/${N/g} (simplificada)`:''}  →  N₀ = ${N}/mcd(${M},${N}) = ${N}/${g} = ${N0}`+(M/N>0.5?`\nOjo: Ω₀ > π, así que es la misma secuencia que con Ω₀ − 2π = 2π·${M-N}/${N}. Va «hacia atrás» (aliasing).`:'');
}
try{
on(['w2-M','w2-N'],drawW2); $('w2-irr').addEventListener('change',drawW2);

}catch(e){console.warn("cxc:",e);}
/* ---------- W3: probador de propiedades ---------- */
const SY={
 a:{f:x=>n=>x(n-1),P:[[0,'Usa x[n−1]: necesita recordar'],[1,'Solo usa el pasado'],[1,'Retrasar no mezcla ni escala'],[1,'El retardo es el mismo siempre'],[1,'|y| ≤ máx|x|']]},
 f:{f:x=>n=>(x(n)+x(n-1)+x(n-2))/3,P:[[0,'Usa x[n−1] y x[n−2]'],[1,'Solo presente y pasado'],[1,'Suma ponderada de muestras'],[1,'Coeficientes fijos'],[1,'Σ|h[n]| = 1 < ∞']]},
 b:{f:x=>n=>x(n)*x(n),P:[[1,'Solo usa x[n]'],[1,'Solo usa x[n]'],[0,'(2x)² = 4x² ≠ 2x²'],[1,'La regla no depende de n'],[1,'|x| ≤ B ⇒ |y| ≤ B²']]},
 e:{f:x=>n=>2*x(n)+3,P:[[1,'Solo usa x[n]'],[1,'Solo usa x[n]'],[0,'Con x = 0 sale y = 3 ≠ 0'],[1,'La regla no depende de n'],[1,'|y| ≤ 2B + 3']]},
 c:{f:x=>n=>n*x(n),P:[[1,'Solo usa x[n]'],[1,'Solo usa x[n]'],[1,'n·(ax₁+bx₂) = a·n·x₁ + b·n·x₂'],[0,'El factor n cambia con el tiempo'],[0,'Con x = 1[n] sale y = n, crece']]},
 d:{f:x=>n=>x(-n),P:[[0,'y[3] necesita x[−3]'],[0,'y[−3] necesita x[3], el futuro'],[1,'Reordenar no mezcla ni escala'],[0,'Retrasar la entrada adelanta la salida'],[1,'|y| ≤ máx|x|']]},
 g:{f:x=>n=>x(n+1),P:[[0,'Usa x[n+1]'],[0,'Usa x[n+1], el futuro'],[1,'Desplazar no mezcla ni escala'],[1,'El adelanto es el mismo siempre'],[1,'|y| ≤ máx|x|']]},
 h:{f:x=>n=>{let s=0;for(let k=-40;k<=n;k++)s+=x(k);return s;},P:[[0,'Suma todo el pasado'],[1,'Solo presente y pasado'],[1,'La suma es lineal'],[1,'h[n] = 1[n], fijo'],[0,'Escalón ⇒ rampa, crece sin límite']]}
};
const INP={imp:n=>n===0?1:0,esc:n=>n>=0?1:0,pul:n=>(n>=0&&n<4)?1:0,alt:n=>(n>=0&&n<=5)?n/5:0};
function drawW3(){
  const S=SY[$('w3-sys').value],x=INP[$('w3-in').value],T=S.f,y=T(x),N=rng(-6,14);
  const xv=N.map(x),yv=N.map(y),[lo,hi]=yr(yv,0.12,0,1);
  $('w3-x').innerHTML=plotSVG({x0:-6.5,x1:14.5,y0:-0.2,y1:1.3,yt:[0,1],xt:[-6,-3,0,3,6,9,12],h:140,xl:'n',yl:'entrada x[n]',label:'Entrada'},[{t:'stem',n:N,y:xv,c:'s3'}]);
  $('w3-y').innerHTML=plotSVG({x0:-6.5,x1:14.5,y0:lo,y1:hi,yt:[Math.round(lo),0,Math.round(hi)].filter((v,i,a)=>a.indexOf(v)===i),xt:[-6,-3,0,3,6,9,12],h:160,xl:'n',yl:'salida y[n]',label:'Salida'},[{t:'stem',n:N,y:yv,c:'s1'}]);
  const lab=['Sin memoria','Causal','Lineal','Invariante','Estable (BIBO)'];
  $('w3-props').innerHTML=S.P.map((p,i)=>`<div class="${p[0]?'y':'n'}"><b>${lab[i]}: ${p[0]?'sí':'no'}</b>${p[1]}</div>`).join('');
  const W=rng(-6,14),x2=n=>0.5*x(n-3);
  const homo=Math.max(...W.map(n=>Math.abs(T(m=>2*x(m))(n)-2*y(n))));
  const add=Math.max(...W.map(n=>Math.abs(T(m=>x(m)+x2(m))(n)-y(n)-T(x2)(n))));
  const ti=Math.max(...W.map(n=>Math.abs(T(m=>x(m-2))(n)-y(n-2))));
  $('w3-txt').textContent=`Prueba numérica con tu entrada (n de −6 a 14):\n  Homogeneidad  T{2x} = 2·T{x}?            ${homo<1e-9?'sí':'NO (diferencia máx. '+f3(homo)+')'}\n  Aditividad    T{x+x₂} = T{x}+T{x₂}?       ${add<1e-9?'sí':'NO (diferencia máx. '+f3(add)+')'}\n  Invariancia   T{x[n−2]} = y[n−2]?          ${ti<1e-9?'sí':'NO (diferencia máx. '+f3(ti)+')'}\nUn «NO» es un contraejemplo y basta para demostrar que la propiedad falla. Un «sí» con una entrada concreta no demuestra nada: en el examen hay que razonarlo en general.`;
}
try{
['w3-sys','w3-in'].forEach(id=>$(id).addEventListener('change',drawW3)); drawW3();

}catch(e){console.warn("cxc:",e);}
/* ---------- W4: serie de Fourier de una cuadrada ---------- */
function drawW4(){
  const K=+$('w4-K').value; $('w4-K-o').textContent='hasta k = '+K+' ('+((K+1)/2)+' términos)';
  const t=rng(-Math.PI,3*Math.PI,0.01),ps=v=>{let s=0;for(let k=1;k<=K;k+=2)s+=Math.sin(k*v)/k;return 4/Math.PI*s;};
  $('w4-plot').innerHTML=plotSVG({x0:-Math.PI,x1:3*Math.PI,y0:-1.45,y1:1.45,yt:[-1,0,1],xt:[-Math.PI,0,Math.PI,2*Math.PI,3*Math.PI],xtf:v=>['−π','0','π','2π','3π'][Math.round(v/Math.PI)+1],h:200,label:'Suma parcial de Fourier'},
    [{t:'line',x:t,y:t.map(v=>Math.sin(v)>=0?1:-1),c:'s3',w:1.2,dash:true},{t:'line',x:t,y:t.map(ps),c:'s1',w:2}]);
  const k=rng(1,31,2);
  $('w4-bars').innerHTML=plotSVG({x0:0,x1:32,y0:0,y1:1.4,yt:[0,0.5,1],xt:[1,5,9,13,17,21,25,29],h:130,xl:'k',yl:'amplitud 4/(πk)',label:'Amplitud de cada armónico'},
    [{t:'stem',n:k.filter(v=>v>K),y:k.filter(v=>v>K).map(v=>4/(Math.PI*v)),c:'s3',r:2},{t:'stem',n:k.filter(v=>v<=K),y:k.filter(v=>v<=K).map(v=>4/(Math.PI*v)),c:'s1'}]);
}
try{
on(['w4-K'],drawW4);

}catch(e){console.warn("cxc:",e);}
/* ---------- W5: muestrear una senoide ---------- */
function drawW5(){
  const f=+$('w5-f').value,fs=+$('w5-fs').value; $('w5-f-o').textContent=f+' Hz'; $('w5-fs-o').textContent=fs+' Hz';
  const fr=f-fs*Math.round(f/fs),fa=Math.abs(fr),t=rng(0,1,0.001),tn=rng(0,1,1/fs);
  const items=[{t:'line',x:t,y:t.map(v=>Math.cos(2*Math.PI*f*v)),c:'s3',w:1.2}];
  if(Math.abs(fa-f)>1e-9) items.push({t:'line',x:t,y:t.map(v=>Math.cos(2*Math.PI*fa*v)),c:'s2',w:2,dash:true});
  items.push({t:'stem',n:tn,y:tn.map(v=>Math.cos(2*Math.PI*f*v)),c:'s1',r:4});
  $('w5-plot').innerHTML=plotSVG({x0:0,x1:1,y0:-1.25,y1:1.25,yt:[-1,0,1],xt:[0,0.25,0.5,0.75,1],xtf:v=>v+' s',h:220,label:'Senoide muestreada'},items);
  const ok=fs>2*f+1e-9,edge=Math.abs(fs-2*f)<1e-9;
  pill('w5-p',ok?'Shannon OK: fs > 2f':(edge?'justo fs = 2f: ambiguo':'aliasing'),ok);
  $('w5-txt').textContent=`${(fs/f).toFixed(2)} muestras por cada oscilación (hacen falta más de 2).\nFrecuencia que «ve» el ordenador: |f − k·fs| más pequeña = |${f} − ${Math.round(f/fs)}·${fs}| = ${fa.toFixed(2)} Hz${ok?' = la real':' ≠ '+f+' Hz real'}`;
}
try{
on(['w5-f','w5-fs'],drawW5);

}catch(e){console.warn("cxc:",e);}
/* ---------- W6: polos, ROC y fracciones parciales ---------- */
function drawW6(){
  const p1=+$('w6-p1').value,p2=+$('w6-p2').value; $('w6-p1-o').textContent=f2(p1); $('w6-p2-o').textContent=f2(p2);
  const r=Math.max(Math.abs(p1),Math.abs(p2)),eq=Math.abs(p1-p2)<1e-9;
  const S=250,c=125,ext=1.4,k=(S/2-16)/ext,P=v=>c+v*k;
  let s=`<svg viewBox="0 0 ${S} ${S}" class="plot" role="img" aria-label="Plano z con región de convergencia">`;
  s+=`<path class="ar area" fill-rule="evenodd" d="M0,0H${S}V${S}H0Z M${c-r*k},${c}a${r*k},${r*k} 0 1,0 ${2*r*k},0a${r*k},${r*k} 0 1,0 ${-2*r*k},0Z"/>`;
  s+=`<line class="ax" x1="8" x2="${S-8}" y1="${c}" y2="${c}"/><line class="ax" x1="${c}" x2="${c}" y1="8" y2="${S-8}"/>`;
  s+=`<circle cx="${c}" cy="${c}" r="${k}" class="wire" stroke-dasharray="4 3"/><circle cx="${c}" cy="${c}" r="${r*k}" class="ln s1" stroke-width="1.4"/>`;
  [p1,p2].forEach(v=>{const x=P(v);s+=`<path class="px ${Math.abs(v)>=1?'s2':'s1'}" d="M${x-6},${c-6}L${x+6},${c+6}M${x+6},${c-6}L${x-6},${c+6}"/>`;});
  s+=`<circle class="zr" cx="${c}" cy="${c}" r="5"/><text class="lb s1" x="12" y="20">ROC: |z| > ${f2(r)}</text><text class="tk" x="${c+k+3}" y="${c+14}">1</text>`;
  $('w6-z').innerHTML=s+'</svg>';
  const A=eq?0:p1/(p1-p2),B=eq?0:p2/(p2-p1),n=rng(0,25),h=n.map(m=>eq?(m+1)*Math.pow(p1,m):A*Math.pow(p1,m)+B*Math.pow(p2,m));
  const lim=Math.max(1.5,Math.min(4,Math.max(...h.map(Math.abs))*1.1));
  $('w6-h').innerHTML=plotSVG({x0:-0.5,x1:25.5,y0:-lim,y1:lim,yt:[-Math.floor(lim),0,Math.floor(lim)],xt:[0,5,10,15,20,25],h:230,xl:'n',yl:'h[n]',label:'Respuesta impulsiva'},[{t:'stem',n,y:h,c:r<1?'s1':'s2',r:3}]);
  pill('w6-p',r<1?'estable: la ROC contiene |z| = 1':(r===1?'marginal':'inestable: la ROC no contiene |z| = 1'),r<1);
  $('w6-txt').textContent=eq?`Polo doble en ${f2(p1)}: H(z)/z = z/(z−p)²  →  h[n] = (n+1)·p^n`:
   `H(z)/z = z/((z−p₁)(z−p₂)) = A/(z−p₁) + B/(z−p₂)\nA = lím z→p₁ (z−p₁)·H(z)/z = p₁/(p₁−p₂) = ${f3(A)}\nB = lím z→p₂ (z−p₂)·H(z)/z = p₂/(p₂−p₁) = ${f3(B)}\nh[n] = ${f3(A)}·(${f2(p1)})^n ${B<0?'−':'+'} ${f3(Math.abs(B))}·(${f2(p2)})^n,  n ≥ 0`;
}
try{
on(['w6-p1','w6-p2'],drawW6);

}catch(e){console.warn("cxc:",e);}
/* ---------- W7: ZOH + planta ---------- */
function drawW7(){
  const a=+$('w7-a').value,T=+$('w7-T').value; $('w7-a-o').textContent='a = '+a.toFixed(1); $('w7-T-o').textContent='T = '+T.toFixed(2)+' s';
  const r=t=>0.5+0.5*Math.sin(0.9*t),tf=10,p=Math.exp(-a*T),bq=1-p;
  const tk=rng(0,tf,T),u=tk.map(r);let y=0;const yk=[],tc=[],yc=[];
  tk.forEach((t0,i)=>{yk.push(y);const t1=Math.min(t0+T,tf);for(let j=0;j<=20;j++){const tau=(t1-t0)*j/20;tc.push(t0+tau);yc.push(Math.exp(-a*tau)*y+(1-Math.exp(-a*tau))*u[i]);}y=p*y+bq*u[i];});
  const rc=rng(0,tf,0.02);
  $('w7-plot').innerHTML=plotSVG({x0:0,x1:tf,y0:-0.1,y1:1.25,yt:[0,0.5,1],xt:[0,2,4,6,8,10],xtf:v=>v+' s',h:230,label:'ZOH y planta'},
    [{t:'line',x:rc,y:rc.map(r),c:'s3',w:1,dash:true},{t:'step',x:[...tk,tf],y:[...u,u[u.length-1]],c:'s1',w:1.8},{t:'line',x:tc,y:yc,c:'s3',w:2},{t:'stem',n:tk,y:yk,c:'s2',r:3.5},
     {t:'text',x:9.9,y:1.15,s:'gris: referencia · verde: u(t) del ZOH · negro: y(t) real · rojo: y[k] del modelo',c:'s3',a:'end'}]);
  $('w7-txt').textContent=`G(z) = (1 − e^(−aT)) / (z − e^(−aT)) = ${f4(bq)} / (z − ${f4(p)})\nPolo continuo s = −${a.toFixed(1)}  →  polo discreto z = e^(sT) = e^(−${(a*T).toFixed(2)}) = ${f4(p)} (dentro del disco)\n${(a*T)>2?'aT grande: la planta casi alcanza cada peldaño antes de la siguiente muestra.':'aT pequeño: la planta apenas se mueve en un periodo; el polo discreto queda cerca de 1.'}`;
}
try{
on(['w7-a','w7-T'],drawW7);

}catch(e){console.warn("cxc:",e);}
/* ---------- W8: posición del muestreador ---------- */
let w8mode='a';
function drawW8(){
  $('w8-a').setAttribute('aria-pressed',w8mode==='a');$('w8-b').setAttribute('aria-pressed',w8mode==='b');
  const y=50;let s=`<svg viewBox="0 0 640 100" class="plot" role="img" aria-label="Diagrama en cascada">${arrowDef('ahw8')}`;
  const ar=(x1,x2)=>`<path class="wire" d="M${x1},${y}L${x2},${y}" marker-end="url(#ahw8)"/>`;
  const sw=(x,l)=>`<path class="wire" d="M${x},${y}L${x+14},${y-10}"/><text class="tk" x="${x+8}" y="${y+18}" text-anchor="middle">${l}</text>`;
  s+=`<text class="bt" x="6" y="${y+5}">r</text>`+`<path class="wire" d="M20,${y}L60,${y}"/>`+sw(60,'T')+ar(76,120);
  s+=`<rect class="blk" x="122" y="${y-20}" width="110" height="40" rx="4"/><text class="bt" x="177" y="${y+5}" text-anchor="middle">G₁ = 1/(s+1)</text>`;
  if(w8mode==='a') s+=`<path class="wire" d="M232,${y}L290,${y}"/>`+sw(290,'T')+ar(306,350); else s+=ar(232,350);
  s+=`<rect class="blk" x="352" y="${y-20}" width="110" height="40" rx="4"/><text class="bt" x="407" y="${y+5}" text-anchor="middle">G₂ = 1/(s+2)</text>`;
  s+=`<path class="wire" d="M462,${y}L540,${y}"/>`+sw(540,'T')+ar(556,610)+`<text class="bt" x="614" y="${y+5}">y</text>`;
  $('w8-blk').innerHTML=s+'</svg>';
  const n=rng(0,8),hA=n.map(m=>{let v=0;for(let k=0;k<=m;k++)v+=Math.exp(-k)*Math.exp(-2*(m-k));return v;}),hB=n.map(m=>Math.exp(-m)-Math.exp(-2*m));
  $('w8-h').innerHTML=plotSVG({x0:-0.5,x1:8.5,y0:0,y1:1.25,yt:[0,0.5,1],xt:[0,2,4,6,8],h:170,xl:'n',label:'Respuestas impulsivas comparadas'},
    [{t:'stem',n:n.map(v=>v-0.12),y:hA,c:'s1',r:w8mode==='a'?4.5:2.2},{t:'stem',n:n.map(v=>v+0.12),y:hB,c:'s2',r:w8mode==='b'?4.5:2.2},{t:'text',x:8.3,y:1.12,s:'verde: G₁(z)·G₂(z) · rojo: (G₁G₂)(z)',c:'s3',a:'end'}]);
  $('w8-txt').textContent=w8mode==='a'?
   `Con muestreador entre los bloques, cada uno se discretiza por separado:\nY(z) = G₁(z)·G₂(z)·R(z) = z/(z−e⁻¹) · z/(z−e⁻²) · R(z) = z² / ((z−0,368)(z−0,135)) · R(z)\nh[0] = 1: la salida responde ya en la primera muestra.`:
   `Sin muestreador en medio, primero se multiplica en s y luego se discretiza:\nY(z) = (G₁G₂)(z)·R(z) = Z{1/(s+1) − 1/(s+2)} = z/(z−e⁻¹) − z/(z−e⁻²) = 0,233·z / ((z−0,368)(z−0,135)) · R(z)\nh[0] = 0: el producto continuo arranca en cero. Mismos polos, distinto numerador, otro sistema.`;
}
try{
$('w8-a').addEventListener('click',()=>{w8mode='a';drawW8();}); $('w8-b').addEventListener('click',()=>{w8mode='b';drawW8();}); drawW8();

}catch(e){console.warn("cxc:",e);}
/* ---------- W9: lazo cerrado K, T ---------- */
function plantZOH(T){const p=Math.exp(-T);return {p,b1:T-1+p,b0:1-p-T*p};}
function quadRoots(a1,a0){const d=a1*a1-4*a0;return d>=0?[[(-a1+Math.sqrt(d))/2,0],[(-a1-Math.sqrt(d))/2,0]]:[[-a1/2,Math.sqrt(-d)/2],[-a1/2,-Math.sqrt(-d)/2]];}
function drawW9(){
  const K=+$('w9-K').value,T=+$('w9-T').value; $('w9-K-o').textContent='K = '+K.toFixed(2); $('w9-T-o').textContent='T = '+T.toFixed(2)+' s';
  const {p,b1,b0}=plantZOH(T),a1=K*b1-1-p,a0=p+K*b0,roots=quadRoots(a1,a0),mx=Math.max(...roots.map(z=>Math.hypot(z[0],z[1])));
  const Kc=Math.min((1-p)/b0,b1>b0?2*(1+p)/(b1-b0):Infinity);
  const N=Math.floor(20/T),y=[];for(let k=0;k<=N;k++){const r1=k-1>=0?1:0,r2=k-2>=0?1:0;y.push(-a1*(y[k-1]||0)-a0*(y[k-2]||0)+K*b1*r1+K*b0*r2);}
  const tk=y.map((_,k)=>k*T);
  $('w9-z').innerHTML=zplaneSVG(roots,[[-b0/b1,0]],1.4);
  $('w9-y').innerHTML=plotSVG({x0:0,x1:20,y0:-0.2,y1:2.2,yt:[0,1,2],xt:[0,5,10,15,20],xtf:v=>v+' s',h:230,label:'Respuesta al escalón en lazo cerrado'},
    [{t:'line',x:[0,20],y:[1,1],c:'s3',w:1,dash:true},{t:'stem',n:tk,y,c:mx<1?'s1':'s2',r:N>60?2:3}]);
  const ok=mx<0.9995; pill('w9-p',ok?'estable · K crítica = '+Kc.toFixed(2):'INESTABLE · K crítica = '+Kc.toFixed(2),ok);
  let info='';
  if(ok){const Mp=Math.max(...y)-1;let ts=0;y.forEach((v,k)=>{if(Math.abs(v-1)>0.02)ts=(k+1)*T;});info=`Sobreimpulso ≈ ${(Math.max(0,Mp)*100).toFixed(0)} % · establecimiento (2 %) ≈ ${ts.toFixed(1)} s · error final al escalón = 0 (tipo 1)`;}
  else info='Con esta K algún polo de lazo cerrado sale del disco: la respuesta crece sin límite (el gráfico se recorta).';
  $('w9-txt').textContent=`G(z) = (${f4(b1)}z + ${f4(b0)}) / ((z − 1)(z − ${f4(p)}))\nEcuación característica: z² ${a1<0?'−':'+'} ${f4(Math.abs(a1))}z ${a0<0?'−':'+'} ${f4(Math.abs(a0))} = 0 · |polo|máx = ${f3(mx)}\n${info}`;
}
try{
on(['w9-K','w9-T'],drawW9);

}catch(e){console.warn("cxc:",e);}
/* ---------- W10: Schur-Cohn ---------- */
function cmul(a,b){return [a[0]*b[0]-a[1]*b[1],a[0]*b[1]+a[1]*b[0]];}
function cdiv(a,b){const d=b[0]*b[0]+b[1]*b[1];return [(a[0]*b[0]+a[1]*b[1])/d,(a[1]*b[0]-a[0]*b[1])/d];}
function roots(c){const n=c.length-1;if(n<1)return[];const a=c.map(v=>v/c[0]);let z=[];for(let i=0;i<n;i++){const ang=2*Math.PI*i/n+0.4;z.push([0.9*Math.cos(ang),0.9*Math.sin(ang)]);}
  const ev=x=>{let r=[1,0];for(let i=1;i<=n;i++){r=cmul(r,x);r=[r[0]+a[i],r[1]];}return r;};
  for(let it=0;it<500;it++){z=z.map((zi,i)=>{let den=[1,0];z.forEach((zj,j)=>{if(i!==j)den=cmul(den,[zi[0]-zj[0],zi[1]-zj[1]]);});const q=cdiv(ev(zi),den);return [zi[0]-q[0],zi[1]-q[1]];});}
  return z;}
const polyStr=c=>{const n=c.length-1;return c.map((v,i)=>{const e=n-i;if(Math.abs(v)<1e-12)return'';const sg=v<0?' − ':(i?' + ':'');const m=Math.abs(v);const num=(Math.abs(m-1)<1e-12&&e>0)?'':(+m.toFixed(4)).toString();return sg+num+(e>1?'z^'+e:(e===1?'z':''));}).join('')||'0';};
function polyMul(a,b){const r=new Array(a.length+b.length-1).fill(0);a.forEach((x,i)=>b.forEach((y,j)=>{r[i+j]+=x*y;}));return r;}
function polyCompose(c,R,z0){let q=[0];const n=c.length-1;c.forEach((ci,i)=>{let t=[ci];for(let k=0;k<n-i;k++)t=polyMul(t,[R,z0]);const L=Math.max(q.length,t.length);const a=new Array(L-q.length).fill(0).concat(q),b=new Array(L-t.length).fill(0).concat(t);q=a.map((v,j)=>v+b[j]);});return q;}
function det(M){const n=M.length,A=M.map(r=>r.slice());let d=1;for(let i=0;i<n;i++){let p=i;for(let r=i+1;r<n;r++)if(Math.abs(A[r][i])>Math.abs(A[p][i]))p=r;if(Math.abs(A[p][i])<1e-14)return 0;if(p!==i){[A[p],A[i]]=[A[i],A[p]];d=-d;}d*=A[i][i];for(let r=i+1;r<n;r++){const f=A[r][i]/A[i][i];for(let k=i;k<n;k++)A[r][k]-=f*A[i][k];}}return d;}
function schurMatrix(c){const n=c.length-1,a=c.slice().reverse(),U=[],L=[];for(let i=0;i<n;i++){U.push([]);L.push([]);for(let j=0;j<n;j++){U[i].push(j>=i?a[n-(j-i)]:0);L[i].push(j>=i?a[j-i]:0);}}
  const S=[];for(let i=0;i<n;i++){S.push([]);for(let j=0;j<n;j++){let v=0;for(let k=0;k<n;k++)v+=U[k][i]*U[k][j]-L[k][i]*L[k][j];S[i].push(v);}}return S;}
function drawW10(){
  const out=[];let c0=$('w10-in').value.split(/[,;\s]+/).filter(Boolean).map(Number);
  const z0=Number($('w10-z0').value.replace(',','.')),R=Number($('w10-R').value.replace(',','.'));
  if(c0.length<2||c0.some(isNaN)||c0[0]===0||isNaN(z0)||isNaN(R)||R<=0){$('w10-txt').textContent='Escribe al menos dos números separados por comas, con el primero distinto de 0, y un radio R > 0. Ejemplo: 1, -1.75, -0.5';return;}
  const disk=!(z0===0&&R===1);
  if(disk){out.push(`Disco D(${z0}, ${R}): cambio z = ${R}·w ${z0<0?'−':'+'} ${Math.abs(z0)}`);out.push(`p(z) = ${polyStr(c0)}`);c0=polyCompose(c0,R,z0);out.push(`q(w) = p(${R}w ${z0<0?'−':'+'} ${Math.abs(z0)}) = ${polyStr(c0).replace(/z/g,'w')}\nAhora se estudia q respecto del disco unidad (la variable vuelve a llamarse z):`);}
  let c=c0.slice(),step=0,verdict='estable';
  out.push(`p₀ = ${polyStr(c)}`);
  while(c.length>1){const an=c[0],a0=c[c.length-1],ratio=Math.abs(a0/an);
    out.push(`\nPaso ${step}: |a₀/aₙ| = |${+a0.toFixed(4)}/${+an.toFixed(4)}| = ${ratio.toFixed(4)} ${ratio<1?'< 1 ✓ sigue':'≥ 1 ✗'}`);
    if(ratio>=1){verdict='NO estable';out.push('  → falla la condición: hay al menos una raíz con |z| ≥ 1.');break;}
    if(c.length===2){out.push(`  Grado 1: raíz = ${(-a0/an).toFixed(4)}, dentro del disco.`);break;}
    const ref=c.slice().reverse(),k=a0/an,q=c.map((v,i)=>v-k*ref[i]); q.pop();
    out.push(`  p* = ${polyStr(ref)}`);out.push(`  p${step+1} = (1/z)[p${step} − (${+k.toFixed(4)})·p*] = ${polyStr(q)}`);
    c=q;step++;}
  out.push(`\nVeredicto Schur-Cohn: ${verdict==='estable'?(disk?'todas las raíces DENTRO del disco D(z₀,R)':'ESTABLE (todas las raíces en |z| < 1)'):(disk?'alguna raíz FUERA del disco (o en su borde)':'NO ESTABLE')}`);
  const S=schurMatrix(c0),n=S.length,minors=[];for(let k=1;k<=n;k++)minors.push(det(S.slice(0,k).map(r=>r.slice(0,k))));
  out.push(`\nLema de Schur: S = UᵀU − LᵀL =`);S.forEach(r=>out.push('  [ '+r.map(v=>(v>=0?' ':'')+v.toFixed(3)).join('  ')+' ]'));
  out.push(`Menores principales: ${minors.map((m,i)=>'Δ'+(i+1)+' = '+(Math.abs(m)>=1e4?m.toExponential(3):m.toFixed(4))).join(' · ')}  → ${minors.every(m=>m>1e-12)?'todos > 0: definida positiva ⇒ estable':'alguno ≤ 0 ⇒ no estable'}`);
  const r=roots(c0),mx=Math.max(...r.map(z=>Math.hypot(z[0],z[1])));
  out.push(`\nComprobación con las raíces${disk?' de q(w)':''}: ${r.map(z=>Math.abs(z[1])<1e-7?z[0].toFixed(4):`${z[0].toFixed(4)}${z[1]<0?'−':'+'}${Math.abs(z[1]).toFixed(4)}j`).join(' · ')}   (|·|máx = ${mx.toFixed(4)})`);
  $('w10-txt').textContent=out.join('\n');
}
try{
$('w10-go').addEventListener('click',drawW10);
}catch(e){console.warn("cxc:",e);}
try{
$('w10-in').addEventListener('keydown',e=>{if(e.key==='Enter'){e.preventDefault();drawW10();}});
}catch(e){console.warn("cxc:",e);}
try{
$('w10-ex1').addEventListener('click',()=>{$('w10-in').value='1, -0.7, -0.14, 0.12';$('w10-z0').value='0';$('w10-R').value='1';drawW10();});
}catch(e){console.warn("cxc:",e);}
try{
$('w10-ex2').addEventListener('click',()=>{$('w10-in').value='1, -2.5, 1';$('w10-z0').value='0';$('w10-R').value='1';drawW10();});
}catch(e){console.warn("cxc:",e);}
try{
$('w10-ex3').addEventListener('click',()=>{$('w10-in').value='1, 10, 50, 120, 144';$('w10-z0').value='-2.5';$('w10-R').value='3.1';drawW10();});
}catch(e){console.warn("cxc:",e);}
try{
drawW10();

}catch(e){console.warn("cxc:",e);}
/* ---------- W11: deadbeat y ripple ---------- */
let w11mode='a';
function drawW11(){
  $('w11-a').setAttribute('aria-pressed',w11mode==='a');$('w11-b').setAttribute('aria-pressed',w11mode==='b');
  const T=+$('w11-T').value; $('w11-T-o').textContent='T = '+T.toFixed(2)+' s';
  const {p,b1,b0}=plantZOH(T),K0=b1,z0=-b0/b1,Kh=1/(1-z0);
  const tf=10,N=Math.ceil(tf/T);let x1=0,x2=0,uPrev=0,ePrev=0;const tc=[],yc=[],tk=[],yk=[],uk=[];
  for(let k=0;k<=N;k++){const t0=k*T;tk.push(t0);yk.push(x1);const e=1-x1;
    const u=w11mode==='a'?z0*uPrev+(e-p*ePrev)/K0:Kh*z0*uPrev+(Kh/K0)*(e-p*ePrev);
    uk.push(u);for(let j=0;j<=30;j++){const tau=T*j/30;if(t0+tau>tf)break;const ex=Math.exp(-tau);tc.push(t0+tau);yc.push(x1+(1-ex)*x2+(tau-1+ex)*u);}
    const ex=Math.exp(-T),nx2=ex*x2+(1-ex)*u,nx1=x1+(1-ex)*x2+(T-1+ex)*u;x1=nx1;x2=nx2;uPrev=u;ePrev=e;}
  const k0=w11mode==='a'?1:2,rip=Math.max(...tc.map((t,i)=>t>=k0*T?Math.abs(yc[i]-1):0));
  $('w11-y').innerHTML=plotSVG({x0:0,x1:tf,y0:-0.1,y1:1.6,yt:[0,0.5,1,1.5],xt:[0,2,4,6,8,10],xtf:v=>v+' s',h:210,yl:'salida y(t) continua y muestras y[k]',label:'Salida deadbeat'},
    [{t:'line',x:[0,tf],y:[1,1],c:'s3',w:1,dash:true},{t:'line',x:tc,y:yc,c:'s3',w:1.8},{t:'stem',n:tk,y:yk,c:'s1',r:3.5}]);
  const um=Math.max(...uk.map(Math.abs))*1.15;
  $('w11-u').innerHTML=plotSVG({x0:0,x1:tf,y0:-um,y1:um,yt:[-Math.round(um*0.8*10)/10,0,Math.round(um*0.8*10)/10],ytf:v=>v.toFixed(1),xt:[0,2,4,6,8,10],xtf:v=>v+' s',h:160,yl:'control u(t) del ZOH',label:'Señal de control'},
    [{t:'step',x:[...tk,tf],y:[...uk,uk[uk.length-1]],c:'s2',w:1.8}]);
  $('w11-txt').textContent=`G(z) = ${f4(K0)}(z ${z0<0?'+':'−'} ${f4(Math.abs(z0))}) / ((z − 1)(z − ${f4(p)}))  → cero de G en z₀ = ${f4(z0)} (negativo, dentro del disco)\n`+
   (w11mode==='a'?`H = z⁻¹  →  Gc = (z − ${f4(p)}) / (${f4(K0)}(z + ${f4(-z0)}))   el controlador tiene un polo en z₀ < 0: u[k] alterna de signo\n`:
    `H = K(z − z₀)/z², K = 1/(1 − z₀) = ${f4(Kh)}  →  Gc = ${f4(Kh)}(z − ${f4(p)}) / (${f4(K0)}(z + ${f4(-Kh*z0)}))\n`)+
   `Desviación máxima de y(t) respecto a 1 desde t = ${k0}T: ${f3(rip)}${rip>0.01?'  ← ripple entre muestras':'  (sin ripple)'}`;
}
try{
$('w11-a').addEventListener('click',()=>{w11mode='a';drawW11();}); $('w11-b').addEventListener('click',()=>{w11mode='b';drawW11();}); on(['w11-T'],drawW11);

}catch(e){console.warn("cxc:",e);}
})();
}catch(e){console.warn("cxc-block:",e);}
try{
(function(){
const {plotSVG,rng}=window.CXC;
const $=id=>__gid(id);
const num=v=>{const r=+(+v).toFixed(4);return (Object.is(r,-0)?0:r).toString().replace('.',',');};

/* ---------- W12: todas las ROC ---------- */
const PRE={
  pro:{d:0,T:[{A:1,p:0.5},{A:2,p:3}],H:'H(z) = z/(z − 1/2) + 2z/(z − 3)'},
  e58:{d:1,T:[{A:-2,p:0.5},{A:2,p:2}],H:'H(z) = z⁻¹·[−2z/(z − 1/2) + 2z/(z − 2)] = −2/(z − 1/2) + 2/(z − 2)'},
  e53:{d:1,T:[{A:1,p:-1},{A:-1,p:-2}],H:'H(z) = z⁻¹·[z/(z + 1) − z/(z + 2)] = 1/(z + 1) − 1/(z + 2)'},
  lib:{d:0,T:null,H:''}
};
let w12roc=1;
function drawW12(){
  const key=$('w12-pre').value,P=PRE[key];$('w12-lib').hidden=key!=='lib';
  let T=P.T,Hs=P.H;
  if(key==='lib'){const p1=+$('w12-p1').value,p2=+$('w12-p2').value;$('w12-p1-o').textContent=num(p1);$('w12-p2-o').textContent=num(p2);T=[{A:1,p:p1},{A:1,p:p2}];Hs=`H(z) = z/(z − (${num(p1)})) + z/(z − (${num(p2)}))`;}
  const rs=T.map(t=>Math.abs(t.p)).sort((a,b)=>a-b),r1=rs[0],r2=rs[1],same=Math.abs(r1-r2)<1e-9;
  if(same&&w12roc===1)w12roc=2;
  const lab=[`|z| < ${num(r1)}`,`${num(r1)} < |z| < ${num(r2)}`,`|z| > ${num(r2)}`];
  [0,1,2].forEach(i=>{const b=$('w12-r'+i);b.textContent=lab[i]+(i===0?' · anticausal':i===1?' · bilateral':' · causal');b.setAttribute('aria-pressed',w12roc===i);b.disabled=(i===1&&same);});
  const inner=w12roc===0?0:(w12roc===1?r1:r2),outer=w12roc===0?r1:(w12roc===1?r2:Infinity);
  const right=t=>Math.abs(t.p)<=inner+1e-12; // el término es derecho si la ROC está fuera de su polo
  const h=n=>T.reduce((acc,t)=>{const m=n-P.d;return acc+(right(t)?(m>=0?t.A*Math.pow(t.p,m):0):(m<=-1?-t.A*Math.pow(t.p,m):0));},0);
  const onCircle=T.some(t=>Math.abs(Math.abs(t.p)-1)<1e-9),stable=!onCircle&&inner<1&&outer>1;
  const pill=$('w12-p');pill.textContent=onCircle?'polo sobre |z| = 1: ninguna ROC es estable':(stable?'estable: la ROC contiene |z| = 1':'inestable: la ROC no contiene |z| = 1');pill.className='pill'+(stable?'':' bad');
  // plano z
  const ext=Math.max(1.4,r2*1.25),S=250,c=125,k=(S/2-16)/ext,circ=r=>`M${c-r*k},${c}a${r*k},${r*k} 0 1,0 ${2*r*k},0a${r*k},${r*k} 0 1,0 ${-2*r*k},0Z`;
  let s=`<svg viewBox="0 0 ${S} ${S}" class="plot" role="img" aria-label="Plano z con la ROC elegida">`;
  const outerPath=isFinite(outer)?circ(outer):`M0,0H${S}V${S}H0Z`;
  s+=`<path class="ar area" fill-rule="evenodd" d="${outerPath} ${inner>0?circ(inner):''}"/>`;
  s+=`<line class="ax" x1="8" x2="${S-8}" y1="${c}" y2="${c}"/><line class="ax" x1="${c}" x2="${c}" y1="8" y2="${S-8}"/><circle cx="${c}" cy="${c}" r="${k}" class="wire" stroke-dasharray="4 3"/>`;
  T.forEach(t=>{const x=c+Math.max(-ext,Math.min(ext,t.p))*k;s+=`<path class="px ${Math.abs(t.p)>=1?'s2':'s1'}" d="M${x-6},${c-6}L${x+6},${c+6}M${x+6},${c-6}L${x-6},${c+6}"/><text class="tk" x="${x}" y="${c+20}" text-anchor="middle">${num(t.p)}</text>`;});
  s+=`<text class="lb s1" x="10" y="20">ROC</text><text class="tk" x="${c+k*0.71+4}" y="${c-k*0.71-4}">|z| = 1</text>`;
  $('w12-z').innerHTML=s+'</svg>';
  const N=rng(-10,10),hv=N.map(h),mx=Math.max(...hv.map(Math.abs)),lim=Math.max(1.5,Math.min(6,mx*1.1));
  const neg=N.filter(n=>n<0),pos=N.filter(n=>n>=0);
  $('w12-h').innerHTML=plotSVG({x0:-10.5,x1:10.5,y0:-lim,y1:lim,yt:[-Math.floor(lim),0,Math.floor(lim)],xt:[-10,-5,0,5,10],h:230,xl:'n',yl:'h[n]',label:'Respuesta impulsiva con la ROC elegida'},
    [{t:'stem',n:neg,y:neg.map(h),c:'s2',r:3},{t:'stem',n:pos,y:pos.map(h),c:'s1',r:3}]);
  const sh=P.d?`n−${P.d}`:'n',term=t=>{const A=t.A,pp=`(${num(t.p)})^(${sh})`;return right(t)?`${A<0?'−':'+'} ${num(Math.abs(A))}·${pp}·1[${sh}]`:`${-A<0?'−':'+'} ${num(Math.abs(A))}·${pp}·1[${P.d===0?'−n−1':(P.d===1?'−n':(P.d-1)+'−n')}]`;};
  let f=T.map(term).join(' ').replace(/^\+ /,'');
  $('w12-txt').textContent=`${Hs}\nROC ${lab[w12roc]}  →  ${T.map(t=>`polo ${num(t.p)}: término ${right(t)?'derecho (n ≥ '+P.d+')':'izquierdo (n < '+P.d+')'}`).join(' · ')}\nh[n] = ${f}\n${inner===0?'Anticausal: h[n] = 0 para n ≥ '+P.d+'.':(isFinite(outer)?'Bilateral: tiene muestras a los dos lados.':'Causal: h[n] = 0 para n < '+P.d+'.')}`;
}
try{
[0,1,2].forEach(i=>$('w12-r'+i).addEventListener('click',()=>{w12roc=i;drawW12();}));
}catch(e){console.warn("cxc:",e);}
try{
$('w12-pre').addEventListener('change',drawW12);['w12-p1','w12-p2'].forEach(id=>$(id).addEventListener('input',drawW12));drawW12();

}catch(e){console.warn("cxc:",e);}
/* ---------- W13: calculadora de convolución ---------- */
const parse=v=>v.split(/[,;\s]+/).filter(Boolean).map(Number);
function drawW13(){
  const xv=parse($('w13-x').value),hv=parse($('w13-h').value),xn=parseInt($('w13-xn').value,10),hn=parseInt($('w13-hn').value,10);
  if(!xv.length||!hv.length||xv.some(isNaN)||hv.some(isNaN)||isNaN(xn)||isNaN(hn)){$('w13-txt').textContent='Escribe los valores separados por comas (usa punto para los decimales, p. ej. 0.5) y un índice inicial entero.';return;}
  const y=new Array(xv.length+hv.length-1).fill(0);xv.forEach((a,i)=>hv.forEach((b,j)=>{y[i+j]+=a*b;}));const yn=xn+hn;
  const sl=$('w13-n');sl.min=yn;sl.max=yn+y.length-1;let n=+sl.value;if(n<yn||n>yn+y.length-1){n=yn+Math.min(2,y.length-1);sl.value=n;}$('w13-n-o').textContent='n = '+n;
  const lo=Math.min(xn,hn,yn)-1,hi=Math.max(xn+xv.length,hn+hv.length,yn+y.length);
  const X=(v,s0)=>v.map((_,i)=>s0+i),all=[...xv,...hv],ylo=Math.min(0,...all),yhi=Math.max(1,...all);
  $('w13-xh').innerHTML=plotSVG({x0:lo-0.5,x1:hi+0.5,y0:ylo-0.15*(yhi-ylo||1),y1:yhi*1.25,yt:[0,+yhi.toFixed(2)],xt:rng(lo,hi,Math.max(1,Math.ceil((hi-lo)/10))),h:150,xl:'n',yl:'x[n] (verde) · h[n] (rojo)',label:'Secuencias de entrada'},
    [{t:'stem',n:X(xv,xn).map(v=>v-0.12),y:xv,c:'s1',r:3.5},{t:'stem',n:X(hv,hn).map(v=>v+0.12),y:hv,c:'s2',r:3}]);
  const ymin=Math.min(0,...y),ymax=Math.max(1,...y);
  $('w13-y').innerHTML=plotSVG({x0:lo-0.5,x1:hi+0.5,y0:ymin-0.1*(ymax-ymin||1),y1:ymax*1.2,yt:[0,+ymax.toFixed(2)],xt:rng(lo,hi,Math.max(1,Math.ceil((hi-lo)/10))),h:170,xl:'n',yl:'y[n] = x[n] * h[n]',label:'Resultado de la convolución'},
    [{t:'stem',n:X(y,yn),y,c:'s3',r:3.5,hl:n}]);
  const terms=[];xv.forEach((a,i)=>{const k=xn+i,j=n-k-hn;if(j>=0&&j<hv.length)terms.push(`x[${k}]·h[${n-k}] = ${num(a)}·${num(hv[j])}`);});
  $('w13-txt').textContent=`y[n] = { ${y.map(num).join(' ; ')} }  para n = ${yn} … ${yn+y.length-1}  (longitud ${xv.length} + ${hv.length} − 1 = ${y.length})\n\nCálculo de y[${n}] = Σ x[k]·h[${n}−k]:\n  ${terms.length?terms.join('\n+ '):'no hay solape'}\n  = ${num(y[n-yn]||0)}`;
}
try{
['w13-x','w13-xn','w13-h','w13-hn'].forEach(id=>$(id).addEventListener('input',drawW13));$('w13-n').addEventListener('input',drawW13);
}catch(e){console.warn("cxc:",e);}
const set=(x,xn,h,hn)=>{$('w13-x').value=x;$('w13-xn').value=xn;$('w13-h').value=h;$('w13-hn').value=hn;$('w13-n').value=2;drawW13();};
try{
$('w13-e59').addEventListener('click',()=>set('1, 1, 1, 1',0,'1, 1, 1',0));
}catch(e){console.warn("cxc:",e);}
try{
$('w13-e52').addEventListener('click',()=>set('0.5, 0.25, 0.125',1,'1, 1, 1, 1, 1, 1',0));
}catch(e){console.warn("cxc:",e);}
try{
$('w13-e55').addEventListener('click',()=>set('1, 1, 1, 1, 1',0,'1, 0.5, 0.25, 0.125, 0.0625, 0.03125, 0.015625',0));
}catch(e){console.warn("cxc:",e);}
try{
drawW13();

}catch(e){console.warn("cxc:",e);}
})();
}catch(e){console.warn("cxc-block:",e);}
try{
(function(){
  const links=[...document.querySelectorAll('.toc a')],map={};links.forEach(a=>{map[a.getAttribute('href').slice(1)]=a;});
  const secs=[...document.querySelectorAll('section.sec h2[id]')];
  let cur=null;
  const setOn=id=>{if(cur===id)return;cur=id;links.forEach(a=>a.classList.toggle('on',a===map[id]));const a=map[id];if(a&&getComputedStyle(a.parentNode).display==='flex'){const p=a.parentNode;p.scrollTo({left:a.offsetLeft-p.clientWidth/2+a.clientWidth/2,behavior:'auto'});}};
  const onScroll=()=>{let best=secs[0];for(const h of secs){if(h.getBoundingClientRect().top<140)best=h;else break;}if(best)setOn(best.id);
    const t=__gid('totop');if(t)t.classList.toggle('show',window.scrollY>700);};
  window.addEventListener('scroll',onScroll,{passive:true});onScroll();

})();
}catch(e){console.warn("cxc-block:",e);}
try{
(function(){
const $=id=>__gid(id);
const store={get(k,d){try{const v=localStorage.getItem(k);return v?JSON.parse(v):d;}catch(e){return d;}},set(k,v){try{localStorage.setItem(k,JSON.stringify(v));}catch(e){}}};
const num=v=>{const r=+(+v).toFixed(4);return (Object.is(r,-0)?0:r).toString().replace('.',',');};
const parse=v=>{const t=String(v).trim().replace(',','.');return t===''?NaN:Number(t);};

/* ---------- cronómetro ---------- */
try{
(function(){
  const TOTAL=7200,o=$('tm-o'),go=$('tm-go'),rs=$('tm-reset'); if(!o)return;
  let st=store.get('cxc-tm',{run:false,start:0,acc:0});
  const el=()=>st.acc+(st.run?(Date.now()-st.start)/1000:0);
  const fmt=s=>{s=Math.max(0,Math.round(s));const h=Math.floor(s/3600),m=Math.floor(s%3600/60),x=s%60;return `${h}:${String(m).padStart(2,'0')}:${String(x).padStart(2,'0')}`;};
  const draw=()=>{const left=TOTAL-el();o.textContent=left<=0?'¡Tiempo!':fmt(left);o.classList.toggle('low',left<900);go.textContent=st.run?'Pausar':(st.acc>0?'Seguir':'Empezar');};
  go.addEventListener('click',()=>{if(st.run){st.acc=el();st.run=false;}else{st.start=Date.now();st.run=true;}store.set('cxc-tm',st);draw();});
  rs.addEventListener('click',()=>{st={run:false,start:0,acc:0};store.set('cxc-tm',st);draw();});
  draw();setInterval(draw,1000);
})();

}catch(e){console.warn("cxc:",e);}
/* ---------- test por tema ---------- */
try{
(function(){
  const qs=[...document.querySelectorAll('.qq')]; if(!qs.length)return;
  const tabs=[...document.querySelectorAll('.qt')];
  let tema='1–2',idx=0;const ans={};const best=store.get('cxc-quiz',{});
  const list=()=>qs.filter(q=>q.dataset.t===tema);
  function show(){
    const L=list();qs.forEach(q=>q.hidden=true);L[idx].hidden=false;
    tabs.forEach(b=>b.setAttribute('aria-pressed',b.dataset.t===tema));
    $('q-pos').textContent=`Pregunta ${idx+1} de ${L.length}`;
    $('q-prev').disabled=idx===0;$('q-next').disabled=idx===L.length-1;
    const a=ans[tema]||{},n=Object.keys(a).length,ok=Object.values(a).filter(Boolean).length;
    $('q-score').textContent=n?`Llevas ${ok} de ${n} correctas en el tema ${tema}`+(n===L.length?` · ${ok===L.length?'¡perfecto!':(ok>=3?'bien, repasa las falladas':'repasa la teoría del tema y vuelve a intentarlo')}`:'')+(best[tema]!=null?` · tu mejor nota: ${best[tema]}/${L.length}`:''):(best[tema]!=null?`Tu mejor nota en este tema: ${best[tema]}/${L.length}`:'');
  }
  qs.forEach(q=>{
    q.querySelectorAll('.qo').forEach(b=>b.addEventListener('click',()=>{
      if(q.dataset.done)return;q.dataset.done='1';
      const ok=+b.dataset.i===+q.dataset.ok;
      q.querySelectorAll('.qo').forEach(x=>{x.disabled=true;if(+x.dataset.i===+q.dataset.ok)x.classList.add('ok');});
      if(!ok)b.classList.add('ko');
      q.querySelector('.qex').hidden=false;
      const L=list(),i=L.indexOf(q);(ans[tema]=ans[tema]||{})[i]=ok;
      if(Object.keys(ans[tema]).length===L.length){const sc=Object.values(ans[tema]).filter(Boolean).length;if(best[tema]==null||sc>best[tema]){best[tema]=sc;store.set('cxc-quiz',best);}}
      show();
    }));
  });
  tabs.forEach(b=>b.addEventListener('click',()=>{tema=b.dataset.t;idx=0;show();}));
  $('q-prev').addEventListener('click',()=>{if(idx>0){idx--;show();}});
  $('q-next').addEventListener('click',()=>{if(idx<list().length-1){idx++;show();}});
  show();
})();

}catch(e){console.warn("cxc:",e);}
/* ---------- fichas ---------- */
try{
(function(){
  const box=$('cards');if(!box)return;
  box.querySelectorAll('.card').forEach(c=>c.addEventListener('click',()=>{const f=c.querySelector('.cf'),b=c.querySelector('.cb');const flip=b.hidden;b.hidden=!flip;f.hidden=flip;c.classList.toggle('flip',flip);}));
  $('cards-sh').addEventListener('click',()=>{const a=[...box.children];for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]];}a.forEach(x=>box.appendChild(x));});
  $('cards-hide').addEventListener('click',()=>box.querySelectorAll('.card').forEach(c=>{c.querySelector('.cf').hidden=false;c.querySelector('.cb').hidden=true;c.classList.remove('flip');}));
})();

}catch(e){console.warn("cxc:",e);}
/* ---------- generador de ejercicios ---------- */
try{
(function(){
  if(!$('g-new'))return;
  const R=a=>a[Math.floor(Math.random()*a.length)],ri=(a,b)=>a+Math.floor(Math.random()*(b-a+1));
  const gcd=(a,b)=>{a=Math.abs(a);b=Math.abs(b);while(b)[a,b]=[b,a%b];return a;};
  let cur=null,stats={ok:0,n:0};
  const inp=(id,lab,w=90)=>`<label for="${id}">${lab} <input type="text" id="${id}" inputmode="decimal" autocomplete="off" style="width:${w}px"></label>`;
  const sel=(id,lab,ops)=>`<label for="${id}">${lab} <select id="${id}"><option value="">elige…</option>${ops.map(o=>`<option>${o}</option>`).join('')}</select></label>`;
  const G={
    per(){const irr=Math.random()<0.25;if(irr){const w=R([1,2,3,0.5,5]);return{q:`x[n] = cos(${num(w)}·n). ¿Cuál es su periodo fundamental N₀? (Si no es periódica, marca la casilla.)`,
      html:inp('g-a','N₀ =')+`<label><input type="checkbox" id="g-np"> no es periódica</label>`,check:()=>$('g-np').checked,
      sol:`Ω₀ = ${num(w)} rad → Ω₀/2π = ${num(w)}/(2π), que es irracional: ningún entero N cumple Ω₀N = 2πk. No es periódica.`};}
      const M=ri(1,12),N=ri(2,24),g=gcd(M,N),N0=N/g;
      return{q:`x[n] = cos(2π·${M}·n/${N}). ¿Cuál es su periodo fundamental N₀?`,html:inp('g-a','N₀ =')+`<label><input type="checkbox" id="g-np"> no es periódica</label>`,
        check:()=>!$('g-np').checked&&parse($('g-a').value)===N0,
        sol:`Ω₀/2π = ${M}/${N}${g>1?` = ${M/g}/${N/g} (simplificando entre mcd = ${g})`:' (ya es irreducible)'}\nN₀ = ${N}/mcd(${M},${N}) = ${N0}`};},
    zinv(){const P=[0.5,-0.5,0.25,-0.25,0.8,-0.8,2,-2,1.5,0.4,-0.4];let p1,p2;do{p1=R(P);p2=R(P);}while(Math.abs(Math.abs(p1)-Math.abs(p2))<1e-9);
      const A=p1/(p1-p2),B=p2/(p2-p1),h=n=>A*Math.pow(p1,n)+B*Math.pow(p2,n),est=Math.max(Math.abs(p1),Math.abs(p2))<1?'sí':'no';
      return{q:`H(z) = z² / ((z − ${num(p1)})(z − ${num(p2)})), sistema causal. Calcula h[2] y di si el sistema es estable.`,
        html:inp('g-a','h[2] =')+sel('g-b','¿Estable?',['sí','no']),
        check:()=>Math.abs(parse($('g-a').value)-h(2))<0.011&&$('g-b').value===est,
        sol:`H(z)/z = z/((z−p₁)(z−p₂)) = A/(z−p₁) + B/(z−p₂)\nA = p₁/(p₁−p₂) = ${num(A)} · B = p₂/(p₂−p₁) = ${num(B)}\nh[n] = ${num(A)}·(${num(p1)})ⁿ + ${num(B)}·(${num(p2)})ⁿ  →  h[0] = ${num(h(0))}, h[1] = ${num(h(1))}, h[2] = ${num(h(2))}\nEstable: ${est} (polo de mayor módulo |${num(Math.abs(p1)>Math.abs(p2)?p1:p2)}| ${est==='sí'?'< 1':'≥ 1'})`};},
    zoh(){const a=R([0.5,1,2,3,4,5]),T=R([0.1,0.2,0.5,1]),p=Math.exp(-a*T),b=1-p;
      return{q:`Planta Gp(s) = ${num(a)}/(s + ${num(a)}) con ZOH y T = ${num(T)} s. Escribe G(z) = b/(z − p): calcula p y b (3 decimales).`,
        html:inp('g-a','p =')+inp('g-b2','b ='),check:()=>Math.abs(parse($('g-a').value)-p)<0.0051&&Math.abs(parse($('g-b2').value)-b)<0.0051,
        sol:`G(z) = (1 − z⁻¹)·Z{a/(s(s+a))} = (1 − e^(−aT))/(z − e^(−aT))\np = e^(−aT) = e^(−${num(a*T)}) = ${p.toFixed(4)} · b = 1 − p = ${b.toFixed(4)}\nEl polo continuo s = −${num(a)} pasa a z = e^(sT): dentro del disco, como debe ser.`};},
    stab(){const a1=+(Math.random()*4-2).toFixed(2),a0=+(Math.random()*2.4-1.2).toFixed(2);
      const c1=Math.abs(a0)<1,c2=1+a1+a0>0,c3=1-a1+a0>0,est=(c1&&c2&&c3)?'sí':'no';
      const d=a1*a1-4*a0,r=d>=0?`${num((-a1+Math.sqrt(d))/2)} y ${num((-a1-Math.sqrt(d))/2)}`:`${num(-a1/2)} ± ${num(Math.sqrt(-d)/2)}j (módulo ${num(Math.sqrt(a0))})`;
      return{q:`¿Es estable el polinomio característico p(z) = z² ${a1<0?'−':'+'} ${num(Math.abs(a1))}z ${a0<0?'−':'+'} ${num(Math.abs(a0))}?`,
        html:sel('g-b','¿Estable?',['sí','no']),check:()=>$('g-b').value===est,
        sol:`Jury de grado 2:\n  |a₀| = ${num(Math.abs(a0))} ${c1?'< 1 ✓':'≥ 1 ✗'}\n  p(1) = 1 + a₁ + a₀ = ${num(1+a1+a0)} ${c2?'> 0 ✓':'≤ 0 ✗'}\n  p(−1) = 1 − a₁ + a₀ = ${num(1-a1+a0)} ${c3?'> 0 ✓':'≤ 0 ✗'}\n→ ${est==='sí'?'ESTABLE':'NO ESTABLE'}. Raíces: ${r}`};},
    conv(){const L1=ri(2,4),L2=ri(2,3),x=Array.from({length:L1},()=>ri(0,3)),h=Array.from({length:L2},()=>ri(1,3)),x0=ri(-1,1);
      const y=new Array(L1+L2-1).fill(0);x.forEach((a,i)=>h.forEach((b,j)=>{y[i+j]+=a*b;}));const k=ri(0,y.length-1),n=x0+k;
      const terms=[];x.forEach((a,i)=>{const j=k-i;if(j>=0&&j<L2)terms.push(`x[${x0+i}]·h[${j}] = ${a}·${h[j]}`);});
      return{q:`x[n] = {${x.join(', ')}} empezando en n = ${x0}; h[n] = {${h.join(', ')}} empezando en n = 0. Calcula y[${n}] = (x * h)[${n}].`,
        html:inp('g-a',`y[${n}] =`),check:()=>parse($('g-a').value)===y[k],
        sol:`y[${n}] = Σ x[k]·h[${n}−k] = ${terms.join(' + ')} = ${y[k]}\nSecuencia completa: y = {${y.join(', ')}} desde n = ${x0}`};}
  };
  function nuevo(){cur=G[$('g-type').value]();$('g-q').textContent=cur.q;$('g-in').innerHTML=cur.html;$('g-sol').hidden=true;$('g-res').hidden=true;}
  $('g-new').addEventListener('click',nuevo);$('g-type').addEventListener('change',nuevo);
  $('g-check').addEventListener('click',()=>{if(!cur)return;const ok=cur.check();stats.n++;if(ok)stats.ok++;const p=$('g-res');p.hidden=false;p.textContent=ok?'¡Correcto!':'No es correcto';p.className='pill'+(ok?'':' bad');
    if(!ok){$('g-sol').textContent=cur.sol;$('g-sol').hidden=false;}$('g-stats').textContent=`En esta sesión: ${stats.ok} de ${stats.n} correctos.`;});
  $('g-show').addEventListener('click',()=>{if(cur){$('g-sol').textContent=cur.sol;$('g-sol').hidden=false;}});
  $('g-in').addEventListener('keydown',e=>{if(e.key==='Enter'){e.preventDefault();$('g-check').click();}});
  nuevo();
})();

}catch(e){console.warn("cxc:",e);}
/* ---------- buscador ---------- */
try{
(function(){
  const q=$('srch'),out=$('srch-out');if(!q)return;
  const norm=t=>t.normalize('NFD').replace(/[̀-ͯ]/g,'').toLowerCase();
  let items=null;
  const build=()=>{items=[];document.querySelectorAll('main section.sec').forEach(sec=>{const h2=sec.querySelector('h2');const title=h2?h2.textContent:'';
    sec.querySelectorAll('h3,summary,dt,.box h4,figure .ft,p,li,td').forEach(el=>{if(el.closest('.quiz,.cards,#srch-card'))return;const t=el.textContent.replace(/\s+/g,' ').trim();if(t.length<3)return;items.push({el,t,n:norm(t),title,col:getComputedStyle(sec).getPropertyValue('--tc')});});});};
  let tm=null;
  q.addEventListener('input',()=>{clearTimeout(tm);tm=setTimeout(run,150);});
  function run(){
    const v=norm(q.value.trim());out.innerHTML='';if(v.length<3){out.hidden=true;return;}
    if(!items)build();
    const res=[];const seen=new Set();
    for(const it of items){if(it.n.includes(v)){let el=it.el;const key=el.closest('details')||el;if(seen.has(key))continue;seen.add(key);res.push(it);if(res.length>=30)break;}}
    out.hidden=false;
    if(!res.length){out.innerHTML='<p class="muted" style="margin:6px 0">No hay resultados. Prueba con otra palabra (por ejemplo «ROC», «Schur», «deadbeat»).</p>';return;}
    const esc=x=>x.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
    res.forEach(it=>{const i=it.n.indexOf(v),a=Math.max(0,i-50);const snip=(a>0?'…':'')+esc(it.t.slice(a,i))+'<mark>'+esc(it.t.slice(i,i+v.length))+'</mark>'+esc(it.t.slice(i+v.length,i+v.length+70))+'…';
      const b=document.createElement('button');b.type='button';b.className='sres';b.style.setProperty('--tc',it.col);b.innerHTML=`<span class="sres-t">${esc(it.title)}</span><span>${snip}</span>`;
      b.addEventListener('click',()=>{let d=it.el.closest('details');while(d){d.open=true;d=d.parentElement.closest('details');}it.el.scrollIntoView({behavior:'smooth',block:'center'});it.el.classList.add('flash');setTimeout(()=>it.el.classList.remove('flash'),1800);});
      out.appendChild(b);});
    const c=document.createElement('p');c.className='muted';c.style.cssText='margin:6px 0 0;font-size:13px';c.textContent=res.length>=30?'Se muestran los 30 primeros resultados.':`${res.length} resultado${res.length>1?'s':''}.`;out.appendChild(c);
  }
})();

}catch(e){console.warn("cxc:",e);}
})();
}catch(e){console.warn("cxc-block:",e);}
try{
/*exnav-js*/(function(){
  function abrir(){
    var id=decodeURIComponent((location.hash||'').slice(1));if(!id)return;
    var el=document.querySelector('[id="'+id.replace(/"/g,'')+'"]');if(!el)return;
    var d=el.tagName==='DETAILS'?el:el.closest('details'),n=0;
    if(el.tagName==='DETAILS')el.open=true;
    while(d){d.open=true;d=d.parentElement?d.parentElement.closest('details'):null;}
    var g=el.closest('.exgrupo');if(g)g.hidden=false;
    if(el.classList.contains('exd'))el.hidden=false;
    setTimeout(function(){el.scrollIntoView({block:'start'});},60);
  }
  window.addEventListener('hashchange',abrir);
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',abrir);else abrir();
  var fil=document.querySelector('.exfil');if(!fil)return;
  var q=fil.querySelector('.exq'),res=fil.querySelector('.exres'),f='all';
  var exs=[].slice.call(document.querySelectorAll('details.exd'));
  var txt=exs.map(function(e){return e.textContent.normalize('NFD').replace(/[̀-ͯ]/g,'').toLowerCase();});
  function aplica(){
    var t=(q.value||'').normalize('NFD').replace(/[̀-ͯ]/g,'').toLowerCase().trim(),n=0;
    exs.forEach(function(e,i){
      var ok=f==='all'||(e.dataset.parc||'').split(' ').indexOf(f)>=0||e.dataset.tipo===f;
      if(ok&&t)ok=t.split(/\s+/).every(function(w){return txt[i].indexOf(w)>=0;});
      e.hidden=!ok;if(ok)n++;
    });
    [].forEach.call(document.querySelectorAll('details.exgrupo'),function(g){
      var v=g.querySelectorAll('details.exd:not([hidden])').length;g.hidden=!v;
      if((f!=='all'||t)&&v)g.open=true;
      var c=g.querySelector('summary .src');if(c)c.textContent=v;
    });
    res.textContent=(f==='all'&&!t)?'':n+(n===1?' examen':' exámenes')+(t?' contienen «'+q.value.trim()+'»':'');
  }
  [].forEach.call(fil.querySelectorAll('.exf'),function(b){b.addEventListener('click',function(){
    [].forEach.call(fil.querySelectorAll('.exf'),function(x){x.classList.remove('on');x.setAttribute('aria-pressed','false');});
    b.classList.add('on');b.setAttribute('aria-pressed','true');f=b.dataset.f;aplica();});});
  q.addEventListener('input',aplica);
})();

}catch(e){console.warn("cxc-block:",e);}
(function(){
  const q=document.getElementById('gsrch'),out=document.getElementById('gsrch-out');if(!q)return;
  const norm=s=>s.normalize('NFD').replace(/[̀-ͯ]/g,'').toLowerCase();
  let loaded=false;
  function load(cb){if(loaded||window.CXC_INDEX){loaded=true;cb();return;}const s=document.createElement('script');s.src='search-index.js?v=30';s.onload=()=>{loaded=true;cb();};document.head.appendChild(s);}
  function run(){const t=norm(q.value.trim());out.textContent='';if(t.length<2){out.hidden=true;return;}
    const words=t.split(/\s+/);let n=0;
    for(const [txt,url,sec] of window.CXC_INDEX){const k=norm(txt+' '+sec);if(words.every(w=>k.includes(w))){
      const a=document.createElement('a');a.href=url;a.textContent=txt.replace(/\$/g,'');const sm=document.createElement('small');sm.textContent=' · '+sec;a.append(sm);out.append(a);if(++n>=30)break;}}
    if(!n){const p=document.createElement('p');p.className='muted';p.textContent='Sin resultados.';out.append(p);}
    out.hidden=false;}
  q.addEventListener('focus',()=>load(()=>{}));q.addEventListener('input',()=>load(run));
})();

if ('serviceWorker' in navigator && location.protocol !== 'file:') {
  window.addEventListener('load', () => navigator.serviceWorker.register('sw.js').catch(() => {}));
}
