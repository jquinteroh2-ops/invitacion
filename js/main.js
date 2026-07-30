/* ── PARTICLES ── */
const cvs=document.getElementById('bgCanvas'),cx=cvs.getContext('2d');
let W,H,pts=[];
function rsz(){W=cvs.width=innerWidth;H=cvs.height=innerHeight}
rsz();addEventListener('resize',rsz);
class Pt{
  constructor(){this.reset(true)}
  reset(init){
    this.x=Math.random()*W;this.y=init?Math.random()*H:-12;
    this.r=Math.random()*5+1.5;this.vy=Math.random()*1.1+.35;
    this.vx=(Math.random()-.5)*.5;this.a=Math.random()*.55+.12;
    this.rot=Math.random()*360;this.rv=(Math.random()-.5)*2.2;
    this.sw=Math.random()*1.5;this.sp=Math.random()*Math.PI*2;
    this.kind=Math.random()<.55?'p':'s';
    this.hue=Math.random()<.65?'#89CFF0':'#c6e8fa';
  }
  tick(t){
    this.y+=this.vy;
    this.x+=Math.sin(t*.0007+this.sp)*this.sw*.04+this.vx;
    this.rot+=this.rv;
    if(this.y>H+16)this.reset(false);
  }
  draw(){
    cx.save();cx.translate(this.x,this.y);cx.rotate(this.rot*Math.PI/180);
    cx.globalAlpha=this.a;cx.fillStyle=this.hue;
    if(this.kind==='p'){cx.beginPath();cx.ellipse(0,0,this.r*1.8,this.r*.65,0,0,Math.PI*2);cx.fill();}
    else{cx.font=`${this.r*2.4}px serif`;cx.textAlign='center';cx.textBaseline='middle';cx.fillText('✦',0,0);}
    cx.restore();
  }
}
for(let i=0;i<65;i++)pts.push(new Pt());
let tk=0;
(function loop(){cx.clearRect(0,0,W,H);tk++;pts.forEach(p=>{p.tick(tk);p.draw()});requestAnimationFrame(loop)})();

/* ── COUNTDOWN — corre siempre, nunca se reinicia ── */
const WEDDING=new Date('2026-08-16T16:00:00');
const START  =new Date('2025-08-16T00:00:00');
const CIRC   =2*Math.PI*94; // 590.7

function pad(n){return String(n).padStart(2,'0')}

function tickCD(){
  const now=new Date(),diff=WEDDING-now;
  const arc=document.getElementById('arcArc');
  if(arc){
    const frac=Math.max(0,(WEDDING-now)/(WEDDING-START));
    arc.style.strokeDashoffset=CIRC*(1-frac);
  }
  if(diff<=0){
    ['cdD','cdH','cdM','cdS'].forEach(id=>{const e=document.getElementById(id);if(e)e.textContent='00'});
    return;
  }
  const d=Math.floor(diff/864e5);
  const h=Math.floor((diff%864e5)/36e5);
  const m=Math.floor((diff%36e5)/6e4);
  const s=Math.floor((diff%6e4)/1e3);
  const eD=document.getElementById('cdD');
  const eH=document.getElementById('cdH');
  const eM=document.getElementById('cdM');
  const eS=document.getElementById('cdS');
  if(eD)eD.textContent=d;
  if(eH)eH.textContent=pad(h);
  if(eM)eM.textContent=pad(m);
  if(eS)eS.textContent=pad(s);
}
tickCD();setInterval(tickCD,1000);

/* ── ENVELOPE ── */
let envOpen=false;

function openEnv(){
  if(envOpen)return;envOpen=true;
  startMusic();
  const env=document.getElementById('envelope');
  const seal=document.getElementById('seal');
  const hint=document.getElementById('envHint');
  hint.style.opacity='0';env.style.animation='none';
  seal.style.transition='all .35s ease';
  seal.style.transform='translate(-50%,-50%) scale(1.3)';
  setTimeout(()=>{seal.style.transform='translate(-50%,-50%) scale(0)';seal.style.opacity='0'},300);
  setTimeout(()=>env.classList.add('opening'),600);
  setTimeout(()=>{
    const se=document.getElementById('scene-env');
    se.classList.add('hide');
    const sc=document.getElementById('scene-carta');
    sc.style.display='flex';
    setTimeout(()=>{
      sc.classList.add('show');
      se.style.display='none';
      requestAnimationFrame(()=>requestAnimationFrame(()=>{
        const bar=document.getElementById('cartaBar');
        if(bar) bar.classList.add('run');
      }));
    },100);
    setTimeout(openInvitation,50000);
  },2400);
}

document.getElementById('envelope').addEventListener('mousemove',e=>{
  if(envOpen||Math.random()>.06)return;
  const s=document.createElement('div');
  s.style.cssText=`position:fixed;left:${e.clientX}px;top:${e.clientY}px;font-size:12px;pointer-events:none;z-index:100;color:#89CFF0;animation:sparkOut .8s ease-out forwards;transform-origin:center`;
  s.textContent='✦';document.body.appendChild(s);setTimeout(()=>s.remove(),800);
});

/* ── MUSIC ── */
const music=document.getElementById('bgMusic');
const musicBtn=document.getElementById('musicBtn');
music.volume=0.5;

function startMusic(){
  music.play().then(()=>{
    musicBtn.classList.add('active');
  }).catch(()=>{});
}
function toggleMusic(){
  if(music.muted){
    music.muted=false;
    musicBtn.textContent='♪';
    musicBtn.classList.remove('muted');
  } else {
    music.muted=true;
    musicBtn.textContent='♪';
    musicBtn.classList.add('muted');
  }
}

function openInvitation(){
  const sc=document.getElementById('scene-carta');
  sc.classList.remove('show');
  setTimeout(()=>{
    sc.style.display='none';
    const si=document.getElementById('scene-inv');
    si.style.display='block';
    setTimeout(()=>{
      si.classList.add('show');
      initReveal();
      initSobres();
    },100);
  },800);
}

/* ── SOBRES CAYENDO ── */
function initSobres(){
  const sec=document.getElementById('sobresRain');
  if(!sec)return;
  const svgTpl=(alpha)=>`<svg viewBox="0 0 40 28" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="1" y="1" width="38" height="26" rx="2" fill="rgba(137,207,240,${(alpha*.12).toFixed(2)})" stroke="rgba(137,207,240,${alpha.toFixed(2)})" stroke-width="1.5"/>
    <polyline points="1,1 20,15 39,1" fill="none" stroke="rgba(137,207,240,${alpha.toFixed(2)})" stroke-width="1.5"/>
    <line x1="1" y1="27" x2="14" y2="15" stroke="rgba(137,207,240,${(alpha*.6).toFixed(2)})" stroke-width="1"/>
    <line x1="39" y1="27" x2="26" y2="15" stroke="rgba(137,207,240,${(alpha*.6).toFixed(2)})" stroke-width="1"/>
  </svg>`;
  for(let i=0;i<22;i++){
    const el=document.createElement('div');
    el.className='sobre-mini';
    const a=.25+Math.random()*.5;
    el.innerHTML=svgTpl(a);
    const left=Math.random()*100;
    const size=16+Math.random()*22;
    const dur=5+Math.random()*6;
    const delay=-Math.random()*11;
    const rot=(Math.random()-.5)*50;
    const spin=(Math.random()-.5)*70;
    el.style.cssText=`left:${left}%;width:${size}px;--r:${rot}deg;--sp:${spin}deg;--a:${a.toFixed(2)};animation-duration:${dur.toFixed(1)}s;animation-delay:${delay.toFixed(1)}s`;
    sec.appendChild(el);
  }
}

/* ── SCROLL REVEAL ── */
function initReveal(){
  const all=document.querySelectorAll('#scene-inv .reveal,.gal-item,.gal-feat');
  const io=new IntersectionObserver(entries=>{
    entries.forEach((e,i)=>{
      if(e.isIntersecting){setTimeout(()=>e.target.classList.add('on'),i*70);io.unobserve(e.target)}
    });
  },{threshold:.07});
  all.forEach(el=>io.observe(el));
  setTimeout(()=>all.forEach((el,i)=>{if(i<3)setTimeout(()=>el.classList.add('on'),i*100)}),150);
}

/* ── LIGHTBOX ── */
const PHOTOS=[
  {src:'Fotos Matrimonio/WhatsApp Image 2026-05-10 at 4.57.11 PM.jpeg', cap:'El amor que nos rodea'},
  {src:'Fotos Matrimonio/WhatsApp Image 2026-05-10 at 4.57.12 PM.jpeg', cap:'Juntos en cada paso'},
  {src:'Fotos Matrimonio/WhatsApp Image 2026-05-10 at 4.57.12 PM1.jpeg',cap:'Nuestra historia'},
  {src:'Fotos Matrimonio/WhatsApp Image 2026-05-10 at 4.57.12 PM2.jpeg',cap:'Miradas que lo dicen todo'},
  {src:'Fotos Matrimonio/WhatsApp Image 2026-05-10 at 4.57.12 PM3.jpeg',cap:'Riendo juntos'},
  {src:'Fotos Matrimonio/WhatsApp Image 2026-05-10 at 4.57.12 PM4.jpeg',cap:'Caminando juntos'},
  {src:'Fotos Matrimonio/WhatsApp Image 2026-05-10 at 4.57.12 PM5.jpeg',cap:'De la mano, siempre'},
  {src:'Fotos Matrimonio/WhatsApp Image 2026-05-10 at 4.57.12 PM6.jpeg',cap:'Bailando en Cartagena'},
  {src:'Fotos Matrimonio/WhatsApp Image 2026-05-10 at 4.57.13 PM7.jpeg',cap:'Nuestro momento más especial ♥'},
  {src:'Fotos Matrimonio/WhatsApp Image 2026-05-16 at 5.48.08 PM.jpeg', cap:'Nuestros anillos, nuestra promesa ♥'},
];
const lbEl=document.getElementById('lb');
const lbImg=document.getElementById('lb-img');
const lbCap=document.getElementById('lb-cap');
const ldots=document.getElementById('lb-dots');
let lbI=0;

PHOTOS.forEach((_,i)=>{
  const d=document.createElement('button');
  d.className='lb-dot'+(i===0?' on':'');
  d.onclick=ev=>{ev.stopPropagation();lbGo(i)};
  ldots.appendChild(d);
});

function openLb(idx){
  lbI=idx;lbImg.src=PHOTOS[idx].src;lbCap.textContent=PHOTOS[idx].cap;
  lbEl.style.display='flex';
  requestAnimationFrame(()=>requestAnimationFrame(()=>lbEl.classList.add('vis')));
  lbEl.classList.add('open');syncDots();document.body.style.overflow='hidden';
}
function closeLb(){
  lbEl.classList.remove('vis');
  setTimeout(()=>{lbEl.classList.remove('open');lbEl.style.display='none'},320);
  document.body.style.overflow='';
}
function lbBg(e){if(e.target===lbEl)closeLb()}
function lbNav(d){lbGo((lbI+d+PHOTOS.length)%PHOTOS.length)}
function lbGo(idx){
  lbImg.style.opacity='0';lbImg.style.transform='scale(.95)';
  setTimeout(()=>{
    lbI=idx;lbImg.src=PHOTOS[idx].src;lbCap.textContent=PHOTOS[idx].cap;
    lbImg.style.opacity='1';lbImg.style.transform='none';syncDots();
  },220);
}
function syncDots(){document.querySelectorAll('.lb-dot').forEach((d,i)=>d.classList.toggle('on',i===lbI))}

document.addEventListener('keydown',e=>{
  if(!lbEl.classList.contains('open'))return;
  if(e.key==='ArrowLeft')lbNav(-1);
  if(e.key==='ArrowRight')lbNav(1);
  if(e.key==='Escape')closeLb();
});
let tx=0;
lbEl.addEventListener('touchstart',e=>{tx=e.touches[0].clientX},{passive:true});
lbEl.addEventListener('touchend',e=>{const dx=e.changedTouches[0].clientX-tx;if(Math.abs(dx)>50)lbNav(dx<0?1:-1)});

/* ── CATEDRAL SLIDER ── */
let catIdx=0;
const CAT_TOTAL=2;
function catSlide(dir){catGoTo((catIdx+dir+CAT_TOTAL)%CAT_TOTAL)}
function catGoTo(idx){
  catIdx=idx;
  const track=document.getElementById('catTrack');
  if(track)track.style.transform=`translateX(-${catIdx*100}%)`;
  document.querySelectorAll('.cat-dot').forEach((d,i)=>d.classList.toggle('active',i===catIdx));
}

/* ── RSVP ── */
// Reemplaza este valor con la URL del Web App de Google Apps Script
const SHEETS_URL = 'https://script.google.com/macros/s/AKfycbzEMdqDdxDC6DSYagPTBD_Hx7ViYgQ74C5x_7y8OolT0QvxzacPihnH21EMJF4MPLOJ/exec';

function confirmarAsistencia(){
  const input=document.getElementById('rsvpName');
  const nombre=input.value.trim();
  if(!nombre){
    input.focus();
    input.style.borderColor='rgba(137,207,240,.8)';
    setTimeout(()=>input.style.borderColor='',1200);
    return;
  }

  // Guardar en Google Sheets si ya se configuró la URL
  if(SHEETS_URL !== 'TU_URL_AQUI'){
    fetch(`${SHEETS_URL}?nombre=${encodeURIComponent(nombre)}`,{mode:'no-cors'}).catch(()=>{});
  }

  // Abrir WhatsApp con el mensaje
  const msg=encodeURIComponent(`¡Felicidades Katerim y Simon! 🎉\n\nConfirmo mi asistencia, allí estaré para acompañarlos en tan especial día. 🤍\n\nMi nombre es: ${nombre}`);
  window.open(`https://wa.me/573116512445?text=${msg}`,'_blank');
}
