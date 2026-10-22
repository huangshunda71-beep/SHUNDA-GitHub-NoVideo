import {glyphs} from './handwriting-data.js';
export const sampleProgress=p=>({percent:Math.min(100,Math.max(0,p)),writing:Math.min(1,Math.max(0,p/60))});
const ns='http://www.w3.org/2000/svg';
function svg(tag,attrs){const el=document.createElementNS(ns,tag);for(const [key,val] of Object.entries(attrs))el.setAttribute(key,val);return el}
export async function runPreloader(resources,{reduced=false}={}){
 const root=document.querySelector('#preloader'),art=root.querySelector('svg'),defs=svg('defs',{});art.append(defs);
 const tracks=[];let total=0;
 for(const [i,g] of glyphs.entries()){
  const [x,y,w,h]=g.box,id='pen-'+i,mask=svg('mask',{id,maskUnits:'userSpaceOnUse',x:x-10,y:y-10,width:w+20,height:h+20});
  const guide=svg('g',{transform:'translate('+x+' '+y+') scale('+w+' '+h+')',fill:'none',stroke:'white','stroke-width':'.36','stroke-linecap':'round','stroke-linejoin':'round'});
  const paths=g.strokes.map(d=>{const path=svg('path',{d,pathLength:1,'stroke-dasharray':1,'stroke-dashoffset':1});guide.append(path);return path});mask.append(guide);defs.append(mask);
  const group=svg('g',{transform:g.transform}),shape=svg('path',{d:g.d,fill:'white',mask:'url(#'+id+')'});group.append(shape);art.append(group);
  const weight=g.letter==='H'?1.7:g.letter==="'"?.3:1;tracks.push({shape,paths,start:total,weight});total+=weight;
 }
 const counter=root.querySelector('.loader-percent'),bar=root.querySelector('.loader-bar');let ready=false,failed=false;
 resources.then(ok=>{ready=true;failed=!ok}).catch(()=>{ready=true;failed=true});
 let fontTimer;const deadline=new Promise(resolve=>{fontTimer=setTimeout(resolve,10000)});
 await Promise.race([Promise.allSettled([document.fonts.load('400 80px Dela','100%'),document.fonts.load('400 128px Pacifico',"I'm Shunda")]),deadline]);
 clearTimeout(fontTimer);root.dataset.fonts='ready';
 return new Promise(resolve=>{
  let progress=0,last=null,hold=0,exit=0,raf;
  function paint(){const s=sampleProgress(progress);root.dataset.progress=s.percent.toFixed(2);root.dataset.writing=String(s.writing);counter.textContent=Math.floor(s.percent)+'%';bar.style.transform='scaleX('+(s.percent/100)+')';
   for(const t of tracks){const local=reduced?(progress>0?1:0):Math.min(1,Math.max(0,(s.writing*total-t.start)/t.weight));
    t.shape.style.visibility=local>0?'visible':'hidden';
    if(local>=1)t.shape.removeAttribute('mask');else{const part=local*t.paths.length;t.paths.forEach((path,j)=>{path.style.visibility=part>j?'visible':'hidden';path.setAttribute('stroke-dashoffset',1-Math.min(1,Math.max(0,part-j)))})}
   }
  }
  let elapsed=0;
  function tick(now){const dt=last===null?0:Math.min(50,now-last);last=now;if(document.hidden){raf=requestAnimationFrame(tick);return}elapsed+=dt;
   if(elapsed>14000&&!ready){ready=true;failed=true}
   if(progress<100){const cap=ready?100:94,next=Math.min(cap,progress+dt/(reduced?5:30));progress=progress<60&&next>=60?60:next;paint()}
   else if((hold+=dt)>240){exit+=dt;root.style.opacity=String(Math.max(0,1-exit/(reduced?80:360)));if(exit>=(reduced?80:360)){cancelAnimationFrame(raf);root.remove();document.querySelector('#navbar').inert=false;document.querySelector('#home').inert=false;document.body.classList.remove('is-loading');resolve({failed});return}}
   raf=requestAnimationFrame(tick);
  }paint();raf=requestAnimationFrame(tick);
 });
}
