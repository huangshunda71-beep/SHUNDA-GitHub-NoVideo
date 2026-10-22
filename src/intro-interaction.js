import {tiles,extraImages} from './tiles.js';
import {createTile} from './tile.js';
import {createPhysics,PHYSICS} from './physics.js';
import {attachDrag} from './drag.js';

export function initIntroInteraction(root){
 const intro=root.querySelector('#intro'),labels=intro?.querySelector('.intro-labels');if(!intro||!labels)return;
 const reduced=matchMedia('(prefers-reduced-motion: reduce)');
 let started=false;
 function start(){
  if(started||!intro.clientWidth)return;started=true;
  const rect=intro.getBoundingClientRect(),baseWidth=intro.clientWidth;
  const configs=[...labels.children].map((el,i)=>{
   const style=getComputedStyle(el),r=el.getBoundingClientRect(),matrix=new DOMMatrix(style.transform);
   const width=el.offsetWidth,height=el.offsetHeight,fontSize=parseFloat(style.fontSize);
   return {id:'intro-word-'+i,kind:'text',x:r.left-rect.left+r.width/2,y:r.top-rect.top+r.height/2-100,width,height,angle:Math.atan2(matrix.b,matrix.a)*180/Math.PI,radius:parseFloat(style.borderRadius),z:2,background:style.backgroundColor,text:{value:el.textContent,x:parseFloat(style.paddingLeft),y:parseFloat(style.paddingTop),width:width-parseFloat(style.paddingLeft)*2,height,fontSize,lineHeight:parseFloat(style.lineHeight),color:style.color}};
  });
  labels.remove();
  const stage=document.createElement('div');stage.className='stage intro-physics-stage';stage.dataset.ready='';intro.append(stage);
  let scale=1,view={width:baseWidth,height:intro.clientHeight,offsetX:0,offsetY:0,mode:'desktop'},items=configs.map(createTile);
  items.forEach(item=>stage.append(item.element));
  const physics=createPhysics(window.Matter,configs,view,{entrance:'placed',reduced:reduced.matches});
  const drag=attachDrag(items,physics,stage,()=>scale);
  function size(){stage.style.width=view.width+'px';stage.style.height=view.height+'px';stage.style.transform='scale('+scale+')';}size();
  let visible=true,last=null,accumulator=0,frameId;
  function render(){items.forEach((item,i)=>{const record=physics.records[i],body=record.body;item.element.style.transform='translate3d('+body.position.x+'px,'+body.position.y+'px,0)';item.face.style.setProperty('--angle',body.angle*180/Math.PI+'deg');item.face.style.setProperty('--tile-scale',record.scale);item.element.dataset.sleeping=String(body.isSleeping);});}
  function frame(now){frameId=null;if(!visible||document.hidden)return;accumulator+=last===null?PHYSICS.step:Math.min(50,now-last);last=now;
   while(accumulator>=PHYSICS.step){physics.step();accumulator-=PHYSICS.step;}render();frameId=requestAnimationFrame(frame);
  }
  const resume=()=>{if(!frameId&&visible&&!document.hidden){last=null;frameId=requestAnimationFrame(frame)}};
  if(reduced.matches)for(let i=0;i<500;i++)physics.step();render();resume();
  new IntersectionObserver(entries=>{visible=entries[0].isIntersecting;if(!visible)drag.cancel();resume();}).observe(intro);
  document.addEventListener('visibilitychange',()=>{drag.cancel();resume()});
  window.addEventListener('pagehide',()=>{cancelAnimationFrame(frameId);frameId=null;drag.cancel()});
  window.addEventListener('pageshow',resume);
  new ResizeObserver(()=>{if(!intro.clientWidth)return;const nextScale=intro.clientWidth/baseWidth,nextHeight=intro.clientHeight/nextScale;if(Math.abs(nextScale-scale)<.0001&&Math.abs(nextHeight-view.height)<.1)return;drag.cancel();scale=nextScale;view={...view,height:nextHeight};size();physics.resize(view);render();}).observe(intro);
  let serial=0,down=null;
  intro.addEventListener('pointerdown',event=>{down=event.target===intro&&event.button===0?{x:event.clientX,y:event.clientY}:null});
  intro.addEventListener('pointerup',event=>{
   const initial=down;down=null;if(!initial||event.target!==intro||Math.hypot(event.clientX-initial.x,event.clientY-initial.y)>6||!extraImages.length)return;
   const template=tiles.find(t=>t.id==='image-1'),asset=extraImages[serial%extraImages.length];
   const heroStage=document.querySelector('#stage'),heroFace=heroStage.querySelector('[data-tile="image-1"] .tile-face');
   const heroScale=new DOMMatrix(getComputedStyle(heroStage).transform).a;
   const tileScale=parseFloat(heroFace.style.getPropertyValue('--tile-scale'))||1;
   const width=template.width*heroScale*tileScale/scale,height=template.height*heroScale*tileScale/scale;
   const config={...template,...asset,id:'intro-image-'+serial++,width,height,angle:(serial%5-2)*7,z:3,radius:template.radius*width/template.width};
   const item=createTile(config),r=intro.getBoundingClientRect();physics.spawn(config,(event.clientX-r.left)/scale);items.push(item);stage.append(item.element);drag.add(item);resume();
  });
 }
 const observer=new IntersectionObserver(entries=>{if(entries.some(e=>e.isIntersecting)){start();observer.disconnect()}},{threshold:.25});observer.observe(intro);
}

export function initLetterHover(heading,{strength=.22}={}){
 if(!heading||heading.dataset.letterHover)return;heading.dataset.letterHover='true';
 let letters=[...heading.querySelectorAll('.drop-letter,.reveal-letter,.hover-letter')];
 if(!letters.length){heading.setAttribute('aria-label',heading.innerText||heading.textContent);const walker=document.createTreeWalker(heading,NodeFilter.SHOW_TEXT),nodes=[];while(walker.nextNode())nodes.push(walker.currentNode);for(const node of nodes){const fragment=document.createDocumentFragment();for(const char of node.textContent){if(/\s/.test(char)){fragment.append(char);continue;}const span=document.createElement('span');span.className='hover-letter';span.textContent=char;span.setAttribute('aria-hidden','true');fragment.append(span);}node.replaceWith(fragment);}letters=[...heading.querySelectorAll('.hover-letter')];}
 letters.forEach(el=>el.classList.add('pointer-letter'));
 const reduced=matchMedia('(prefers-reduced-motion: reduce)');let metrics=null;
 const reset=()=>{letters.forEach(el=>{el.style.removeProperty('scale');el.style.removeProperty('translate')});metrics=null;};
 heading.addEventListener('pointerenter',()=>{metrics=letters.map(el=>{const r=el.getBoundingClientRect();return{x:r.left+r.width/2,y:r.top+r.height/2,width:el.offsetWidth,row:el.offsetTop};});});
 heading.addEventListener('pointermove',event=>{
  if(event.pointerType==='touch'||reduced.matches||!metrics)return;
  const radius=parseFloat(getComputedStyle(heading).fontSize)*1.8;
  const scales=metrics.map(m=>1+strength*Math.max(0,1-Math.hypot(event.clientX-m.x,event.clientY-m.y)/radius));
  const rows=new Map();metrics.forEach((m,i)=>{if(!rows.has(m.row))rows.set(m.row,[]);rows.get(m.row).push(i)});
  for(const indices of rows.values()){const extra=indices.map(i=>metrics[i].width*(scales[i]-1));let shift=-extra.reduce((a,b)=>a+b,0)/2;indices.forEach((i,j)=>{letters[i].style.scale=String(scales[i]);letters[i].style.translate=(shift+extra[j]/2)+'px 0';shift+=extra[j];});}
 });heading.addEventListener('pointerleave',reset);reduced.addEventListener('change',reset);window.addEventListener('resize',reset);
}
