/* ORPHEUS generated covers.
   Every song without its own artwork gets a cover drawn on the spot from its title, artist and album.
   Same song = same cover, every time. All drawn with the browser canvas, no images, no internet.
   The styles are original and only borrow the mood of the references: dark and grainy photos, big type,
   red accents, blurred motion, halftone dots, dreamy skies. */
(function(){
'use strict';
const TAU=Math.PI*2;
const F={
  cond:'"Avenir Next Condensed","Bebas Neue","Impact","Haettenschweiler","Arial Narrow",sans-serif',
  heavy:'"Avenir Next Condensed","Impact","Arial Black","Helvetica Neue",sans-serif',
  serif:'"Didot","Bodoni 72","Playfair Display","Georgia","Times New Roman",serif',
  script:'"Snell Roundhand","Segoe Script","Brush Script MT","Apple Chancery","Lucida Handwriting","URW Chancery L",cursive',
  brush:'"Marker Felt","Ink Free","Segoe Print","Chalkduster","Comic Sans MS",cursive',
  mono:'"SF Mono","Menlo","Consolas","Courier New",monospace',
  sans:'"Avenir Next","Helvetica Neue","Segoe UI",system-ui,-apple-system,Arial,sans-serif'
};

/* ---------- small helpers ---------- */
function hash(s){let h=2166136261;for(let i=0;i<s.length;i++){h^=s.charCodeAt(i);h=Math.imul(h,16777619);}return h>>>0;}
function rng(seed){let a=seed>>>0;return function(){a=(a+0x6D2B79F5)>>>0;let t=Math.imul(a^a>>>15,1|a);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296;};}
const rgb=h=>{h=h.replace('#','');return [parseInt(h.slice(0,2),16),parseInt(h.slice(2,4),16),parseInt(h.slice(4,6),16)];};
const rgba=(c,a)=>'rgba('+(c[0]|0)+','+(c[1]|0)+','+(c[2]|0)+','+a+')';
const pick=(R,a)=>a[Math.floor(R()*a.length)];
const mixc=(a,b,t)=>[a[0]+(b[0]-a[0])*t,a[1]+(b[1]-a[1])*t,a[2]+(b[2]-a[2])*t];
function lin(g,x0,y0,x1,y1,stops){const l=g.createLinearGradient(x0,y0,x1,y1);stops.forEach(s=>l.addColorStop(s[0],s[1]));return l;}
function rad(g,x,y,r0,r1,stops,x2,y2){const l=g.createRadialGradient(x,y,r0,x2==null?x:x2,y2==null?y:y2,r1);stops.forEach(s=>l.addColorStop(s[0],s[1]));return l;}
function glow(g,x,y,r,c,a){
  const l=g.createRadialGradient(x,y,0,x,y,r);
  l.addColorStop(0,rgba(c,a));l.addColorStop(.4,rgba(c,a*.42));l.addColorStop(.75,rgba(c,a*.1));l.addColorStop(1,rgba(c,0));
  g.fillStyle=l;g.fillRect(x-r,y-r,r*2,r*2);
}
function stretchGlow(g,x,y,r,sx,sy,rot,c,a){g.save();g.translate(x,y);g.rotate(rot);g.scale(sx,sy);glow(g,0,0,r,c,a);g.restore();}
function vignette(g,a,inner){g.fillStyle=rad(g,256,256,inner||110,400,[[0,'rgba(0,0,0,0)'],[1,'rgba(0,0,0,'+a+')']]);g.fillRect(0,0,512,512);}
let tile=null;
function noiseTile(){
  if(tile)return tile;
  const c=document.createElement('canvas');c.width=c.height=128;
  const x=c.getContext('2d'),d=x.createImageData(128,128),r=rng(12345);
  for(let i=0;i<d.data.length;i+=4){const v=r()*255;d.data[i]=d.data[i+1]=d.data[i+2]=v;d.data[i+3]=255;}
  x.putImageData(d,0,0);tile=c;return c;
}
function grain(g,S,a,mode){
  if(S<200)return;
  g.save();g.setTransform(1,0,0,1,0,0);g.globalCompositeOperation=mode||'overlay';g.globalAlpha=a*.42;
  g.fillStyle=g.createPattern(noiseTile(),'repeat');g.fillRect(0,0,S,S);g.restore();
}
function dots(g,R,n,x0,y0,w,h,r0,r1,c,a0,a1){for(let i=0;i<n;i++){g.fillStyle=rgba(c,a0+R()*(a1-a0));g.beginPath();g.arc(x0+R()*w,y0+R()*h,r0+R()*(r1-r0),0,TAU);g.fill();}}
const isLatin=s=>/^[\u0000-ɏ -⁯]*$/.test(s);
function font(g,fam,size,weight,style){g.font=(style?style+' ':'')+(weight||'400')+' '+Math.round(size*10)/10+'px '+fam;}
function wrap(g,txt,maxW,maxLines){
  const words=txt.split(/\s+/).filter(Boolean),lines=[];let cur='';
  for(const w of words){const t=cur?cur+' '+w:w;if(!cur||g.measureText(t).width<=maxW)cur=t;else{lines.push(cur);cur=w;}}
  if(cur)lines.push(cur);
  if(lines.length>maxLines){const keep=lines.slice(0,maxLines-1);keep.push(lines.slice(maxLines-1).join(' '));return keep;}
  return lines;
}
function layout(g,txt,maxW,maxH,fam,weight,style,start,min,maxLines,lh){
  let s=start;
  for(;s>=min;s*=.93){
    font(g,fam,s,weight,style);
    const lines=wrap(g,txt,maxW,maxLines);
    const w=Math.max.apply(null,lines.map(l=>g.measureText(l).width));
    if(w<=maxW&&lines.length*s*lh<=maxH)return {s,lines,lh};
  }
  font(g,fam,min,weight,style);
  return {s:min,lines:wrap(g,txt,maxW,maxLines),lh};
}
function drawLines(g,L,x,y,align,fn){
  g.textAlign=align;g.textBaseline='middle';
  const total=L.lines.length*L.s*L.lh;
  L.lines.forEach((l,i)=>fn(l,x,y-total/2+(i+.5)*L.s*L.lh));
}
function spaced(g,txt,x,y,sp,align){
  const ch=[...txt],ws=ch.map(c=>g.measureText(c).width),total=ws.reduce((a,b)=>a+b,0)+sp*(ch.length-1);
  let cx=align==='center'?x-total/2:align==='right'?x-total:x;
  const al=g.textAlign;g.textAlign='left';
  ch.forEach((c,i)=>{g.fillText(c,cx,y);cx+=ws[i]+sp;});
  g.textAlign=al;return total;
}
function small(g,txt,x,y,size,color,align,fam,weight,sp){
  font(g,fam||F.mono,size,weight||'400');g.fillStyle=color;g.textBaseline='middle';
  if(sp&&isLatin(txt))spaced(g,txt,x,y,sp,align||'left');else{g.textAlign=align||'left';g.fillText(txt,x,y);}
}
function star4(g,x,y,r,color){g.fillStyle=color;g.beginPath();for(let i=0;i<8;i++){const a=i*Math.PI/4-Math.PI/2,rr=i%2?r*.22:r;g.lineTo(x+Math.cos(a)*rr,y+Math.sin(a)*rr);}g.closePath();g.fill();}
function underline(g,x,y,w,color){g.strokeStyle=color;g.lineWidth=1;g.beginPath();g.moveTo(x,y);g.lineTo(x+w,y);g.stroke();}
const clip=(s,n)=>s.length>n?s.slice(0,n-1)+'…':s;

/* ---------- 14 styles. I = {T:title, A:artist, B:album, R:rng, n:number 1-99} ---------- */
const STYLES=[];
function style(id,name,fn){STYLES.push({id,name,fn});}

style('neon','Night street',function(g,I){
  const R=I.R,c=pick(R,[[255,64,40],[40,210,255],[255,70,170],[255,176,40]]);
  g.fillStyle=lin(g,0,0,0,512,[[0,'#05070c'],[.55,'#131928'],[1,'#34303d']]);g.fillRect(0,0,512,512);
  for(let i=0;i<16;i++)glow(g,R()*512,290+R()*110,8+R()*16,[255,150+R()*80,80+R()*60],.45+R()*.4);
  glow(g,256,500,280,[255,190,150],.12);
  const px=R()<.5?120:392,dir=px<256?1:-1;
  g.strokeStyle='rgba(6,6,10,.95)';g.lineWidth=7;g.beginPath();g.moveTo(px,512);g.lineTo(px,70);g.quadraticCurveTo(px,28,px+dir*70,32);g.stroke();
  glow(g,px+dir*72,34,120,[255,214,160],.8);glow(g,px+dir*10,28,70,[255,230,190],.5);
  dots(g,R,110,0,0,512,512,.7,2.6,[255,255,255],.15,.7);
  const T=I.T.toUpperCase(),L=layout(g,T,420,190,F.serif,'700','',120,34,2,.92);
  g.fillStyle='#fff';g.shadowColor='rgba(255,255,255,.9)';g.shadowBlur=26;
  drawLines(g,L,256,190,'center',(l,x,y)=>{g.fillText(l,x,y);g.fillText(l,x,y);});
  g.shadowBlur=0;
  if(I.A){small(g,I.A,70,86,18,'rgba(255,255,255,.92)','left',F.serif,'400');}
  const sub=I.B||I.A||'';
  if(sub){
    g.save();g.translate(262,318);g.rotate(-.07);
    const s=Math.min(70,Math.max(26,430/Math.max(6,sub.length)*1.5));
    font(g,F.script,s,'400','italic');g.textAlign='center';g.textBaseline='middle';
    g.fillStyle=rgba(c,1);g.shadowColor=rgba(c,1);g.shadowBlur=22;g.fillText(clip(sub,22),0,0);g.fillText(clip(sub,22),0,0);g.restore();g.shadowBlur=0;
  }
  small(g,'songs written in silence',256,376,13,'rgba(255,255,255,.8)','center',F.serif,'400','',0);
  vignette(g,.55);grain(g,I.S,.22);
});

style('brush','Brush',function(g,I){
  const R=I.R,pal=pick(R,[['#6a2018','#1b0806','#9a4a24'],['#0f5252','#041517','#2a8a78'],['#33276e','#0a0820','#5a49b8'],['#7a3200','#190900','#c6761f']]);
  g.fillStyle=rad(g,256,150,0,440,[[0,pal[0]],[1,pal[1]]]);g.fillRect(0,0,512,512);
  g.fillStyle='rgba(255,235,210,.07)';g.beginPath();g.moveTo(215,0);g.lineTo(300,0);g.lineTo(470,512);g.lineTo(40,512);g.closePath();g.fill();
  glow(g,256,500,330,rgb(pal[2]),.55);
  const T=I.T.toUpperCase(),L=layout(g,T,430,320,F.cond,'700','',230,46,3,.9);
  drawLines(g,L,256,262,'center',(l,x,y)=>{
    g.fillStyle='#efe6d0';g.strokeStyle='#efe6d0';g.lineJoin='round';
    for(let k=0;k<6;k++){g.globalAlpha=.55;g.lineWidth=2+R()*4;g.strokeText(l,x+(R()-.5)*5,y+(R()-.5)*5);}
    g.globalAlpha=1;g.lineWidth=3;g.strokeText(l,x,y);g.fillText(l,x,y);
  });
  const c='rgba(239,230,208,.85)';
  small(g,clip(I.A||'ORPHEUS',16).toUpperCase(),28,34,11,c,'left',F.sans,'600',1);
  small(g,clip(I.B||('MIX '+String(I.n).padStart(2,'0')),16).toUpperCase(),256,34,11,c,'center',F.sans,'600',1);
  small(g,'ORPHEUS',484,34,11,c,'right',F.sans,'600',1);
  small(g,'PART '+pick(R,['ONE','TWO','THREE']),256,478,11,c,'center',F.sans,'700',1);
  star4(g,34,478,15,'rgba(239,230,208,.9)');star4(g,478,478,15,'rgba(239,230,208,.9)');
  vignette(g,.5);grain(g,I.S,.3);
});

style('echo','Echo',function(g,I){
  const R=I.R,v=pick(R,[{bg:['#8d8d8d','#202020'],ink:'#f6f6f6',tint:null},{bg:['#8fa9a5','#14262a'],ink:'#fff5ea',tint:[255,168,90]},{bg:['#aa9d90','#2a211b'],ink:'#ffffff',tint:null}]);
  g.fillStyle=lin(g,0,0,512,512,[[0,v.bg[0]],[1,v.bg[1]]]);g.fillRect(0,0,512,512);
  const cx=215+R()*50,cy=205;
  for(let i=0;i<9;i++)glow(g,cx+(i-4)*15+R()*10,cy+R()*24,100-i*5,[236,236,236],.14);
  for(let i=0;i<10;i++)glow(g,cx-40+i*18,410+R()*20,150,[200,200,200],.1);
  for(let i=0;i<16;i++)stretchGlow(g,cx+(R()-.5)*160,cy+(R()-.3)*240,70+R()*60,3.4,.35,(R()-.5)*.5,[240,240,240],.12);
  if(v.tint)glow(g,cx+20,cy+30,90,v.tint,.4);
  g.fillStyle='rgba(0,0,0,.28)';g.fillRect(0,0,512,512);
  vignette(g,.55);grain(g,I.S,.28);
  const T=I.T,L=layout(g,T,300,150,F.script,'400','italic',120,40,2,.95);
  g.fillStyle=v.ink;g.shadowColor='rgba(0,0,0,.35)';g.shadowBlur=14;
  drawLines(g,L,330,332,'center',(l,x,y)=>g.fillText(l,x,y));g.shadowBlur=0;
  const A=(I.A||'ORPHEUS').toUpperCase();
  small(g,clip(A,22),256,44,15,v.ink,'center',F.sans,'300',2);
  font(g,F.sans,15,'300');const w=g.measureText(A).width+44;underline(g,256-w/2,56,w,v.ink);
  small(g,clip((I.B||'NEW ALBUM').toUpperCase(),22),256,452,14,v.ink,'center',F.sans,'300',2);
  small(g,'VOL '+String(I.n).padStart(2,'0'),256,474,14,v.ink,'center',F.sans,'300',2);
});

style('silent','Silent',function(g,I){
  const R=I.R;
  g.fillStyle='#050505';g.fillRect(0,0,512,512);
  glow(g,256,250,270,[210,210,205],.85);
  for(let i=0;i<220;i++){const a=R()*TAU,d=Math.sqrt(R())*210;glow(g,256+Math.cos(a)*d,250+Math.sin(a)*d,10+R()*30,[R()<.5?255:30,R()<.5?255:30,R()<.5?250:30],.07);}
  [[110,310,110],[410,300,120],[190,120,90]].forEach(p=>glow(g,p[0],p[1],p[2],[0,0,0],.6));
  dots(g,R,160,40,40,430,430,.4,1.3,[255,255,255],.2,.7);
  vignette(g,.95,60);grain(g,I.S,.5);
  g.strokeStyle='#000';g.lineWidth=40;g.strokeRect(-8,-8,528,528);
  const T=I.T.toUpperCase();
  g.fillStyle='#fff';g.textBaseline='middle';
  if(isLatin(T)&&T.length<=14){
    let s=60;font(g,F.sans,s,'200');
    const ws=[...T].reduce((a,c)=>a+g.measureText(c).width,0);
    let sp=(380-ws)/Math.max(1,T.length-1);
    if(sp<8){s=Math.max(26,s*(380/(ws+8*(T.length-1))));font(g,F.sans,s,'200');const w2=[...T].reduce((a,c)=>a+g.measureText(c).width,0);sp=Math.max(6,(380-w2)/Math.max(1,T.length-1));}
    spaced(g,T,256,262,Math.min(sp,64),'center');
  }else{
    const L=layout(g,T,380,150,F.sans,'200','',64,26,2,1.05);
    drawLines(g,L,256,262,'center',(l,x,y)=>g.fillText(l,x,y));
  }
  small(g,'VOL. '+String(I.n).padStart(2,'0'),256,214,13,'rgba(255,255,255,.9)','center',F.sans,'300',3);
  g.save();g.translate(64,260);g.rotate(-Math.PI/2);small(g,'NEW ALBUM',0,0,12,'rgba(255,255,255,.85)','center',F.sans,'300',4);g.restore();
  g.save();g.translate(448,260);g.rotate(Math.PI/2);small(g,clip((I.A||'ORPHEUS').toUpperCase(),20),0,0,12,'rgba(255,255,255,.85)','center',F.sans,'300',4);g.restore();
});

style('noir','Noir',function(g,I){
  const R=I.R,red=pick(R,[[224,22,30],[230,40,90],[255,90,30]]);
  g.fillStyle='#030303';g.fillRect(0,0,512,512);glow(g,256,120,300,[90,90,90],.35);
  g.lineWidth=3;
  [[-10,-10,170,170,60,0],[522,-10,340,190,-40,0]].forEach(s=>{
    const n=18;
    for(let i=0;i<n;i++){
      const t=i/(n-1),x=s[0]+(s[2]-s[0])*t,y=s[1]+(s[3]-s[1])*t+Math.sin(t*Math.PI)*60;
      const ang=Math.atan2(s[3]-s[1],s[2]-s[0])+(i%2?Math.PI/2:0);
      g.save();g.translate(x,y);g.rotate(ang);g.strokeStyle=lin(g,-10,0,10,0,[[0,'#f2f2f2'],[.5,'#777'],[1,'#e6e6e6']]);
      g.beginPath();g.ellipse(0,0,i%2?4:11,i%2?11:6,0,0,TAU);g.stroke();g.restore();
    }
  });
  glow(g,256,520,300,[220,220,220],.2);
  g.fillStyle='#0b0b0b';g.beginPath();g.ellipse(256,420,40,60,0,0,TAU);g.fill();
  g.fillStyle=rad(g,228,262,6,130,[[0,'#ffffff'],[.45,'#cfcfcf'],[1,'#3a3a3a']],234,282);
  g.beginPath();g.ellipse(256,284,66,92,0,0,TAU);g.fill();
  g.fillStyle='rgba(255,255,255,.65)';g.beginPath();g.ellipse(232,236,11,28,-.5,0,TAU);g.fill();
  const T=I.T,L=layout(g,T,300,130,F.script,'400','italic',96,36,2,1);
  g.fillStyle=rgba(red,1);g.shadowColor=rgba(red,.8);g.shadowBlur=10;
  drawLines(g,L,338,446,'center',(l,x,y)=>g.fillText(l,x,y));g.shadowBlur=0;
  if(I.A)small(g,clip(I.A,22),338,494,17,rgba(red,.9),'center',F.script,'400','',0);
  vignette(g,.7);grain(g,I.S,.28);
});

style('block','Block',function(g,I){
  const R=I.R,v=pick(R,[{bg:['#d6d6d6','#a8a8a8'],ink:'#d8381f',sil:[28,28,28]},{bg:['#eee3cc','#cdbf9f'],ink:'#151515',sil:[59,43,31]},{bg:['#bcc7d2','#8494a4'],ink:'#ff6a1a',sil:[20,32,43]}]);
  g.fillStyle=lin(g,0,0,0,512,[[0,v.bg[0]],[1,v.bg[1]]]);g.fillRect(0,0,512,512);
  for(let i=0;i<7;i++)glow(g,256+(i-3)*22,215+R()*10,72,v.sil,.3);
  for(let i=0;i<6;i++)stretchGlow(g,256+(i-2.5)*34,430,150,1.7,1.25,0,v.sil,.45);
  vignette(g,.25);grain(g,I.S,.18);
  const T=I.T.toUpperCase(),L=layout(g,T,448,300,F.heavy,'800','',200,40,3,.88);
  g.fillStyle=v.ink;
  g.globalAlpha=.22;drawLines(g,L,266,268,'center',(l,x,y)=>g.fillText(l,x,y));
  g.globalAlpha=.22;drawLines(g,L,246,268,'center',(l,x,y)=>g.fillText(l,x,y));
  g.globalAlpha=1;drawLines(g,L,256,268,'center',(l,x,y)=>g.fillText(l,x,y));
  const c=v.ink==='#151515'?'#151515':'#2a2a2a';
  small(g,clip((I.A||'ORPHEUS').toUpperCase(),20),26,30,10,c,'left',F.sans,'600',1);
  small(g,clip((I.B||'THE FRAGILE SEASON').toUpperCase(),20),186,30,10,c,'left',F.sans,'600',1);
  small(g,'VOL '+String(I.n).padStart(2,'0'),380,30,10,c,'left',F.sans,'600',1);
  small(g,'YEARS 2026',380,46,10,c,'left',F.sans,'600',1);
});

style('haze','Red haze',function(g,I){
  const R=I.R,c=pick(R,[[255,38,28],[255,150,30],[30,220,210],[255,40,180]]);
  g.fillStyle=lin(g,0,0,0,512,[[0,'#4c3b4b'],[.5,'#1b1315'],[1,'#020202']]);g.fillRect(0,0,512,512);
  for(let i=0;i<8;i++)glow(g,90+i*48+R()*20,240+R()*60,60+R()*55,c,.5+R()*.4);
  for(let i=0;i<5;i++)glow(g,150+R()*210,250+R()*40,24+R()*22,mixc(c,[255,255,255],.5),.5);
  g.strokeStyle='rgba(255,255,255,.05)';g.lineWidth=1.5;
  for(let i=0;i<46;i++){const x=R()*512;g.beginPath();g.moveTo(x,0);g.lineTo(x+(R()-.5)*8,512);g.stroke();}
  dots(g,R,70,0,0,512,512,.8,3,[255,255,255],.05,.25);
  vignette(g,.6);grain(g,I.S,.25);
  const T=I.T.toLowerCase();
  g.fillStyle='#fff';font(g,F.sans,22,'700');g.textBaseline='middle';
  if(isLatin(T)&&T.length<=16)spaced(g,T,256,58,11,'center');else{const L=layout(g,T,400,60,F.sans,'700','',24,14,2,1.1);drawLines(g,L,256,58,'center',(l,x,y)=>g.fillText(l,x,y));}
  const cc='rgba(255,255,255,.9)',lines=[(I.A||'ORPHEUS'),(I.B||''),'Volume '+String(I.n).padStart(3,'0')].filter(Boolean);
  lines.forEach((l,i)=>small(g,clip(l,24),256,408+i*15,10,cc,'center',F.sans,'500',0));
});

style('halftone','Halftone',function(g,I){
  const R=I.R,v=pick(R,[['#86c5ff','#0a1a3a'],['#ffd23f','#3a1a00'],['#ff9ecb','#34002a'],['#9ff0c6','#06281a'],['#ff8a3d','#2a0c00']]),shape=Math.floor(R()*3),ph=R()*TAU;
  g.fillStyle=v[0];g.fillRect(0,0,512,512);
  g.fillStyle=v[1];
  const sp=11,cs=Math.cos(.78),sn=Math.sin(.78);
  for(let y=-400;y<400;y+=sp)for(let x=-400;x<400;x+=sp){
    const px=256+x*cs-y*sn,py=256+x*sn+y*cs;
    if(px<20||px>492||py<60||py>452)continue;
    const dx=px-256,dy=py-256,d=Math.sqrt(dx*dx+dy*dy);
    let b;
    if(shape===0)b=1-d/170;
    else if(shape===1)b=1-Math.abs(d-110)/55;
    else b=1-Math.abs(dy-Math.sin(dx/48+ph)*55)/75;
    b+=Math.sin(dx/25+ph)*.07;
    if(b<=.04)continue;
    const r=sp*.62*Math.pow(Math.min(1,b),.75);
    if(r<.6)continue;
    g.beginPath();g.arc(px,py,r,0,TAU);g.fill();
  }
  const ink=v[1];
  small(g,clip((I.A||'ORPHEUS').toUpperCase(),20),28,34,13,ink,'left',F.mono,'500',0);
  small(g,'VOL. '+String(I.n).padStart(2,'0'),484,34,13,ink,'right',F.mono,'500',0);
  small(g,'01.',28,466,13,ink,'left',F.mono,'500',0);small(g,clip(I.T.toUpperCase(),13),28,488,13,ink,'left',F.mono,'500',0);
  small(g,'02.',256,466,13,ink,'center',F.mono,'500',0);small(g,clip((I.B||'SINGLE').toUpperCase(),13),256,488,13,ink,'center',F.mono,'500',0);
  small(g,'03.',484,466,13,ink,'right',F.mono,'500',0);small(g,'ORPHEUS',484,488,13,ink,'right',F.mono,'500',0);
  grain(g,I.S,.1,'multiply');
});

style('dream','Dream tape',function(g,I){
  const R=I.R,sk=pick(R,[['#2d8ca3','#e8a0b6','#f7caa5'],['#5b6bd6','#f0a0d0','#ffd9a8'],['#2aa6a0','#a8d8e8','#ffe0b8']]);
  g.fillStyle=lin(g,0,0,0,512,[[0,sk[0]],[.55,sk[1]],[1,sk[2]]]);g.fillRect(0,0,512,512);
  for(let i=0;i<34;i++){const lowSide=R()<.6;glow(g,R()*512,lowSide?300+R()*200:R()*300,50+R()*70,pick(R,[[255,255,255],[255,210,230],[255,230,210]]),.28+R()*.25);}
  g.lineWidth=5;[[70,'255,80,80'],[77,'255,200,60'],[84,'90,200,120'],[91,'80,150,255']].forEach(a=>{g.strokeStyle='rgba('+a[1]+',.5)';g.beginPath();g.arc(70,500,a[0],-1.1,-.15);g.stroke();});
  g.save();g.translate(256,250);g.rotate(-.24);
  g.shadowColor='rgba(0,0,0,.35)';g.shadowBlur=30;g.shadowOffsetY=14;
  g.fillStyle='#1c1c25';g.beginPath();g.roundRect(-165,-105,330,210,20);g.fill();g.shadowBlur=0;g.shadowOffsetY=0;
  g.fillStyle='#eadfc6';g.beginPath();g.roundRect(-142,-82,284,112,10);g.fill();
  g.fillStyle='rgba(60,40,20,.12)';g.fillRect(-142,-52,284,2);g.fillRect(-142,-22,284,2);
  const T=I.T,L=layout(g,T,250,62,F.script,'400','italic',48,18,2,1);
  g.fillStyle='#2b2b46';drawLines(g,L,0,-40,'center',(l,x,y)=>g.fillText(l,x,y));
  small(g,clip((I.A||'ORPHEUS').toLowerCase(),26),0,16,11,'rgba(43,43,70,.8)','center',F.mono,'400',0);
  g.fillStyle='#2a2a34';g.beginPath();g.roundRect(-78,38,156,52,26);g.fill();
  [-42,42].forEach(x=>{g.fillStyle='#f3f3f3';g.beginPath();g.arc(x,64,18,0,TAU);g.fill();g.fillStyle='#1c1c25';g.beginPath();g.arc(x,64,8,0,TAU);g.fill();});
  g.fillStyle='#777';[[-148,-92],[148,-92],[-148,92],[148,92]].forEach(p=>{g.beginPath();g.arc(p[0],p[1],4,0,TAU);g.fill();});
  g.fillStyle=lin(g,-165,-105,100,105,[[0,'rgba(255,255,255,.2)'],[.5,'rgba(255,255,255,0)'],[1,'rgba(255,255,255,.06)']]);g.beginPath();g.roundRect(-165,-105,330,210,20);g.fill();
  g.restore();
  for(let i=0;i<7;i++)star4(g,R()*512,R()*512,3+R()*6,'rgba(255,255,255,'+(.4+R()*.5)+')');
  grain(g,I.S,.12,'soft-light');
});

style('rays','Light rays',function(g,I){
  const R=I.R,v=pick(R,[{bg:['#0a2626','#1d4a40'],ray:[255,238,190],fl:[[230,50,40],[255,120,30]]},{bg:['#1a1038','#3c2a6e'],ray:[255,210,240],fl:[[255,90,170],[255,170,90]]},{bg:['#10261a','#2a4a22'],ray:[250,246,170],fl:[[250,200,40],[240,110,30]]}]);
  g.fillStyle=lin(g,0,0,0,512,[[0,v.bg[0]],[1,v.bg[1]]]);g.fillRect(0,0,512,512);
  glow(g,420,40,330,v.ray,.35);
  g.globalCompositeOperation='lighter';
  for(let i=0;i<8;i++){
    const a=1.75+i*.12+R()*.05,w=.03+R()*.05,L=700,ox=430,oy=-40;
    g.beginPath();g.moveTo(ox,oy);g.lineTo(ox+L*Math.cos(a-w),oy+L*Math.sin(a-w));g.lineTo(ox+L*Math.cos(a+w),oy+L*Math.sin(a+w));g.closePath();
    g.fillStyle=lin(g,ox,oy,ox+L*Math.cos(a),oy+L*Math.sin(a),[[0,rgba(v.ray,.5)],[1,rgba(v.ray,0)]]);g.fill();
  }
  g.globalCompositeOperation='source-over';
  g.fillStyle=lin(g,330,0,512,0,[[0,'#050d0b'],[1,'#0a1a14']]);
  g.beginPath();g.moveTo(385,-5);g.lineTo(475,-5);g.lineTo(458,250);g.quadraticCurveTo(480,400,530,512);g.lineTo(320,512);g.quadraticCurveTo(360,380,382,250);g.closePath();g.fill();
  for(let i=0;i<200;i++){const y=380+R()*140,c=pick(R,v.fl);g.fillStyle=rgba(c,.5+R()*.5);g.beginPath();g.arc(R()*512,y,2+R()*5,0,TAU);g.fill();}
  g.fillStyle='#07100d';g.beginPath();g.ellipse(190,400,32,38,0,0,TAU);g.fill();g.beginPath();g.arc(190,350,12,0,TAU);g.fill();
  for(let i=0;i<34;i++){g.save();g.translate(R()*512,R()*420);g.rotate(R()*TAU);g.fillStyle=rgba(pick(R,v.fl),.5+R()*.5);g.beginPath();g.ellipse(0,0,2+R()*3,1+R()*2,0,0,TAU);g.fill();g.restore();}
  vignette(g,.5);grain(g,I.S,.16);
  const T=I.T.toUpperCase();g.fillStyle='rgba(255,255,255,.92)';g.textBaseline='middle';
  const L=layout(g,T,300,70,F.sans,'300','',22,13,2,1.3);
  font(g,F.sans,L.s,'300');
  if(isLatin(T)&&L.lines.length===1)spaced(g,T,30,44,Math.max(2,L.s*.28),'left');else drawLines(g,L,30,44,'left',(l,x,y)=>g.fillText(l,x,y));
  if(I.A)small(g,clip(I.A,26),30,84,12,'rgba(255,255,255,.7)','left',F.sans,'300',1);
});

style('crimson','Crimson',function(g,I){
  const R=I.R,v=pick(R,[{a:'#c0001c',b:'#5a0012',t:'#16000a'},{a:'#1148d0',b:'#050f4a',t:'#f2f6ff'},{a:'#8a1ad0',b:'#2a0050',t:'#fff0ff'},{a:'#e07a00',b:'#6a2400',t:'#1a0800'}]);
  g.fillStyle=lin(g,0,0,512,512,[[0,v.a],[1,v.b]]);g.fillRect(0,0,512,512);
  g.fillStyle='rgba(255,255,255,.16)';g.beginPath();g.moveTo(60,-20);g.lineTo(200,-20);g.lineTo(470,512);g.lineTo(230,512);g.closePath();g.fill();
  g.fillStyle=lin(g,0,330,0,512,[[0,'rgba(0,0,0,.0)'],[1,'rgba(0,0,0,.35)']]);g.fillRect(0,330,512,182);
  const ox=170+R()*160;
  g.fillStyle='rgba(0,0,0,.45)';g.beginPath();g.ellipse(ox+34,412,100,14,0,0,TAU);g.fill();
  g.fillStyle=rad(g,ox-26,290,4,86,[[0,'#6a6a6a'],[.35,'#1b1b1b'],[1,'#020202']],ox,330);g.beginPath();g.arc(ox,330,78,0,TAU);g.fill();
  g.fillStyle='rgba(255,255,255,.5)';g.beginPath();g.ellipse(ox-30,296,14,8,-.6,0,TAU);g.fill();
  const T=I.T.toUpperCase(),L=layout(g,T,300,110,F.heavy,'800','',90,24,2,.92);
  g.fillStyle=v.t;drawLines(g,L,488,452,'right',(l,x,y)=>g.fillText(l,x,y));
  if(I.A)small(g,clip(I.A.toUpperCase(),22),488,494,10,v.t,'right',F.sans,'700',2);
  grain(g,I.S,.3);vignette(g,.35);
  for(let i=0;i<24;i++){g.strokeStyle='rgba(255,255,255,'+(.03+R()*.05)+')';g.lineWidth=1;const y=R()*512;g.beginPath();g.moveTo(R()*200,y);g.lineTo(200+R()*312,y+(R()-.5)*6);g.stroke();}
});

style('ember','Ember',function(g,I){
  const R=I.R,v=pick(R,[{bg:['#93a4b1','#566676'],f:[[255,214,100],[255,140,30],[230,60,20]]},{bg:['#1a2540','#05080f'],f:[[170,240,255],[60,150,255],[90,60,255]]},{bg:['#a79bb3','#3b2f4a'],f:[[255,200,230],[255,80,170],[200,30,120]]}]);
  g.fillStyle=lin(g,0,0,0,512,[[0,v.bg[0]],[1,v.bg[1]]]);g.fillRect(0,0,512,512);
  glow(g,200,260,260,mixc(v.f[1],[255,255,255],.2),.22);
  g.fillStyle='#14161a';g.beginPath();g.moveTo(218,305);g.lineTo(300,305);g.lineTo(310,512);g.lineTo(206,512);g.closePath();g.fill();
  g.globalCompositeOperation='lighter';
  for(let i=0;i<90;i++){
    const t=i/90,x=262-t*170+Math.sin(t*9)*16+(R()-.5)*18,y=290-t*220+(R()-.5)*26,r=14+(1-t)*30*(.6+R()*.6);
    const c=t<.35?mixc(v.f[0],v.f[1],t/.35):mixc(v.f[1],v.f[2],(t-.35)/.65);
    stretchGlow(g,x,y,r,1.8,1,-.5-t*.4,c,.3+R()*.2);
  }
  for(let i=0;i<30;i++)stretchGlow(g,262+(R()-.5)*50,262+(R()-.5)*50,18+R()*18,1,1.5,0,v.f[1],.3);
  g.globalCompositeOperation='source-over';
  g.fillStyle='#14161a';g.beginPath();g.ellipse(262,276,22,26,0,0,TAU);g.fill();g.fillRect(244,296,36,14);
  g.fillStyle=lin(g,0,455,0,512,[[0,'#2a2c30'],[1,'#0b0c0e']]);g.fillRect(0,455,512,57);
  vignette(g,.45);grain(g,I.S,.22);
  const T=I.T.toUpperCase();g.fillStyle='rgba(255,255,255,.92)';g.textBaseline='middle';
  const L=layout(g,T,340,60,F.sans,'300','',22,13,2,1.3);font(g,F.sans,L.s,'300');
  if(isLatin(T)&&L.lines.length===1)spaced(g,T,28,420,Math.max(2,L.s*.3),'left');else drawLines(g,L,28,420,'left',(l,x,y)=>g.fillText(l,x,y));
  if(I.A)small(g,clip(I.A,28),28,448,12,'rgba(255,255,255,.75)','left',F.sans,'300',1);
});

style('lens','Fisheye',function(g,I){
  const R=I.R,v=pick(R,[{c:['#7a917b','#2d3d30','#0a120c'],l:[210,255,220],ink:'#ff2a1a'},{c:['#8a7a9a','#35283f','#0c0710'],l:[255,220,255],ink:'#ffe45c'},{c:['#7a8a9a','#26323f','#070b10'],l:[210,235,255],ink:'#ff5a3a'}]);
  g.fillStyle='#030504';g.fillRect(0,0,512,512);
  g.save();g.beginPath();g.arc(256,256,252,0,TAU);g.clip();
  g.fillStyle=rad(g,256,230,10,330,[[0,v.c[0]],[.55,v.c[1]],[1,v.c[2]]]);g.fillRect(0,0,512,512);
  g.strokeStyle='rgba(255,255,255,.05)';g.lineWidth=1;
  for(let i=0;i<90;i++){const x=R()*512;g.beginPath();g.moveTo(x,0);g.lineTo(x,512);g.stroke();}
  g.strokeStyle='rgba(0,0,0,.55)';g.lineWidth=3;
  g.beginPath();g.moveTo(256,0);g.bezierCurveTo(305,170,305,340,256,512);g.stroke();
  g.beginPath();g.moveTo(256,0);g.bezierCurveTo(207,170,207,340,256,512);g.stroke();
  [[-.4,.2],[.4,.2]].forEach(a=>{g.beginPath();g.ellipse(256,260,300,300+a[0]*100,0,0,TAU);g.stroke();});
  glow(g,256,50,170,v.l,.7);g.fillStyle=rgba(v.l,.7);g.beginPath();g.roundRect(196,30,120,40,8);g.fill();
  glow(g,256,300,200,[0,0,0],.35);
  g.restore();
  g.strokeStyle='#000';g.lineWidth=70;g.beginPath();g.arc(256,256,282,0,TAU);g.stroke();
  const T=I.T,L=layout(g,T,300,120,F.brush,'700','',70,22,2,1);
  g.save();g.translate(180,320);g.rotate(-.1);
  g.fillStyle=v.ink;g.shadowColor=v.ink;g.shadowBlur=12;drawLines(g,L,0,0,'center',(l,x,y)=>g.fillText(l,x,y));g.restore();g.shadowBlur=0;
  if(I.A)small(g,clip(I.A.toUpperCase(),22),256,468,11,'rgba(255,255,255,.75)','center',F.sans,'500',3);
  grain(g,I.S,.3);
});

style('field','Golden field',function(g,I){
  const R=I.R,v=pick(R,[{sky:['#241e1c','#7a5a30','#e6bf70'],gr:['#b88a2e','#5e4012']},{sky:['#14202c','#4c6a80','#d8c9a8'],gr:['#7a8a4a','#3a4420']},{sky:['#2a1424','#a0506a','#ffc890'],gr:['#a8602c','#4a2410']}]);
  g.fillStyle=lin(g,0,0,0,330,[[0,v.sky[0]],[.55,v.sky[1]],[1,v.sky[2]]]);g.fillRect(0,0,512,330);
  for(let i=0;i<26;i++)glow(g,R()*512,R()*210,50+R()*70,[24,16,12],.34);
  glow(g,300+R()*80,140,160,[255,236,190],.8);
  g.fillStyle='rgba(20,14,10,.9)';for(let i=0;i<9;i++){const x=40+R()*430,y=60+R()*150;g.strokeStyle='rgba(15,10,8,.8)';g.lineWidth=1.6;g.beginPath();g.moveTo(x-7,y-3);g.quadraticCurveTo(x-3,y-8,x,y);g.quadraticCurveTo(x+3,y-8,x+7,y-3);g.stroke();}
  g.fillStyle=lin(g,0,300,0,512,[[0,v.gr[0]],[1,v.gr[1]]]);g.fillRect(0,300,512,212);
  for(let i=0;i<520;i++){const x=R()*512,y=305+R()*207;g.strokeStyle='rgba('+(R()<.5?'255,220,140':'40,24,8')+','+(.1+R()*.18)+')';g.lineWidth=1;g.beginPath();g.moveTo(x,y);g.lineTo(x+(R()-.5)*3,y-5-R()*10);g.stroke();}
  const cols=['#4a8a5a','#d2543a','#5b6fd0'];
  [[170,392,1.1],[250,372,.95],[330,350,.8]].forEach((p,i)=>{
    const x=p[0]+(R()-.5)*20,y=p[1],s=p[2]*34;
    g.strokeStyle=cols[i];g.fillStyle=cols[i];g.lineWidth=s*.16;g.lineCap='round';
    g.beginPath();g.arc(x+s*.25,y-s*1.6,s*.17,0,TAU);g.fill();
    g.beginPath();g.moveTo(x+s*.2,y-s*1.4);g.lineTo(x,y-s*.65);
    g.moveTo(x,y-s*.65);g.lineTo(x+s*.45,y-s*.25);g.lineTo(x+s*.15,y);
    g.moveTo(x,y-s*.65);g.lineTo(x-s*.35,y-s*.2);g.lineTo(x-s*.7,y-s*.35);
    g.moveTo(x+s*.15,y-s*1.25);g.lineTo(x+s*.6,y-s*1.0);g.moveTo(x+s*.1,y-s*1.25);g.lineTo(x-s*.35,y-s*1.0);
    g.stroke();
  });
  g.lineCap='butt';
  vignette(g,.55);grain(g,I.S,.2);
  const T=I.T.toUpperCase();g.fillStyle='rgba(255,255,255,.92)';g.textBaseline='middle';
  const L=layout(g,T,400,60,F.sans,'300','',22,13,2,1.3);font(g,F.sans,L.s,'300');
  if(isLatin(T)&&L.lines.length===1)spaced(g,T,256,466,Math.max(2,L.s*.3),'center');else drawLines(g,L,256,466,'center',(l,x,y)=>g.fillText(l,x,y));
  if(I.A)small(g,clip(I.A,28),256,492,12,'rgba(255,255,255,.75)','center',F.sans,'300',1);
});

/* ---------- public API ---------- */
let scratch=null;
const clean=s=>String(s||'').replace(/\s+/g,' ').trim();
function make(t,size,styleId){
  const T=clean(t.title)||'Untitled',A0=clean(t.artist),A=/^unknown artist$/i.test(A0)?'':A0,B=clean(t.album);
  const seed=hash(T+'|'+A+'|'+B);
  let idx;
  if(styleId&&styleId!=='mix'){idx=STYLES.findIndex(s=>s.id===styleId);if(idx<0)idx=seed%STYLES.length;}
  else idx=seed%STYLES.length;
  const S=size||256;
  if(!scratch)scratch=document.createElement('canvas');
  scratch.width=scratch.height=S;
  const g=scratch.getContext('2d');
  g.setTransform(S/512,0,0,S/512,0,0);
  g.globalAlpha=1;g.globalCompositeOperation='source-over';g.shadowBlur=0;g.lineCap='butt';
  const R=rng(seed^0x9E3779B9);
  try{STYLES[idx].fn(g,{T,A,B,R,S,n:1+(seed>>>8)%99});}
  catch(e){g.fillStyle='#222';g.fillRect(0,0,512,512);}
  return scratch.toDataURL('image/jpeg',S>=256?.88:.8);
}
window.Covers={styles:STYLES.map(s=>({id:s.id,name:s.name})),make:make};
})();
