import {applyContentText} from './content-store.js';
import {attachBlankSpawn} from './spawn.js';
import {initPortfolio} from './portfolio.js';
import {runPreloader} from './preloader.js';
import {tiles,layout} from './tiles.js';
import {createNavbar} from './navbar.js';
import {createTile} from './tile.js';
import {prepareResources} from './entrance.js';
import {createPhysics,PHYSICS} from './physics.js';
import {attachDrag} from './drag.js';
// A fresh page load always starts at the cover, before the preloader runs.
history.scrollRestoration='manual';
history.replaceState(null,'',location.pathname+location.search+'#home');
window.scrollTo(0,0);
createNavbar(document.querySelector('#navbar'));
applyContentText(document.querySelector('#navbar'),'顶部导航');
const stage=document.querySelector('#stage'),hero=document.querySelector('.hero');
const items=tiles.map(createTile);items.forEach(item=>stage.append(item.element));
const motion=window.matchMedia('(prefers-reduced-motion: reduce)');
function measure(){
 const mobile=window.matchMedia('(max-width:900px) and (orientation:portrait)').matches;
 const designWidth=mobile?layout.mobileWidth:layout.width,designHeight=mobile?layout.mobileHeight:layout.height;
 const scale=Math.min(hero.clientWidth/designWidth,hero.clientHeight/designHeight);
 const width=hero.clientWidth/scale,height=hero.clientHeight/scale;
 return {width,height,scale,mode:mobile?'mobile':'desktop',offsetX:(width-designWidth)/2,offsetY:(height-designHeight)/2};
}
let view=measure();
function stageSize(){Object.assign(stage.style,{width:view.width+'px',height:view.height+'px',left:'0px',top:'0px',transform:`scale(${view.scale})`})}
stageSize();
await runPreloader(prepareResources(stage),{reduced:motion.matches});
view=measure();stageSize();
const physics=createPhysics(window.Matter,tiles,view,{entrance:'above',reduced:motion.matches});
const drag=attachDrag(items,physics,stage,()=>view.scale);
attachBlankSpawn(hero,stage,items,physics,drag,()=>view);
function render(){
 for(let i=0;i<items.length;i++){
  const item=items[i],record=physics.records[i],body=record.body;
  item.element.style.visibility=record.added?'visible':'hidden';
  item.element.style.transform=`translate3d(${body.position.x}px,${body.position.y}px,0)`;
  item.face.style.setProperty('--angle',body.angle*180/Math.PI+'deg');
  item.face.style.setProperty('--tile-scale',record.scale);
  item.element.dataset.sleeping=String(body.isSleeping);
 }
 if(physics.records.every(r=>r.entered))stage.dataset.entrance='complete';
}
stage.dataset.ready='';hero.setAttribute('aria-busy','false');
let accumulator=0,last=null,frameId;
function frame(now){
 if(last===null)last=now;
 accumulator+=Math.min(50,now-last);last=now;
 while(accumulator>=PHYSICS.step){physics.step();accumulator-=PHYSICS.step}
 render();frameId=requestAnimationFrame(frame);
}
render();frameId=requestAnimationFrame(frame);
new ResizeObserver(()=>{
 if(!hero.clientWidth||!hero.clientHeight)return;
 const next=measure();
 if(Math.abs(next.width-view.width)<.01&&Math.abs(next.height-view.height)<.01&&next.mode===view.mode&&Math.abs(next.scale-view.scale)<.0001)return;
 drag.cancel();view=next;stageSize();physics.resize(view);render();last=null;accumulator=0;
}).observe(hero);
document.addEventListener('visibilitychange',()=>{
 cancelAnimationFrame(frameId);drag.cancel();last=null;accumulator=0;
 if(!document.hidden)frameId=requestAnimationFrame(frame);
});
window.addEventListener('pagehide',()=>{cancelAnimationFrame(frameId);drag.cancel()});
window.addEventListener('pageshow',event=>{if(event.persisted){last=null;accumulator=0;frameId=requestAnimationFrame(frame)}});

initPortfolio();
