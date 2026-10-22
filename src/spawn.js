import {extraImages,tiles} from './tiles.js';
import {createTile} from './tile.js';
export function attachBlankSpawn(hero,stage,items,physics,drag,getView){
 const ready=[];
 extraImages.forEach(asset=>{const image=new Image();image.onload=()=>ready.push(asset);image.src=asset.src;});
 let press=null,serial=0;
 const blank=event=>event.target===hero||event.target===stage;
 hero.addEventListener('pointerdown',event=>{
  press=event.isPrimary&&event.button===0&&blank(event)?{id:event.pointerId,x:event.clientX,y:event.clientY}:null;
 });
 hero.addEventListener('pointercancel',()=>{press=null});
 hero.addEventListener('pointerup',event=>{
  const start=press;press=null;
  if(!start||start.id!==event.pointerId||!blank(event)||Math.hypot(event.clientX-start.x,event.clientY-start.y)>6)return;
  if(document.body.classList.contains('contact-open')||hero.closest('[hidden]')||!ready.length)return;
  const view=getView(),rect=stage.getBoundingClientRect();
  const asset=ready[Math.floor(Math.random()*ready.length)];
  const template=tiles.find(tile=>tile.id==='image-1');
  const config={...template,...asset,id:'extra-'+(++serial),nodeId:'',angle:(Math.random()-.5)*24,z:16,mobile:[...template.mobile]};
  config.mobile[3]=config.angle;
  const item=createTile(config);
  physics.spawn(config,(event.clientX-rect.left)/view.scale);
  item.element.style.visibility='hidden';
  items.push(item);stage.append(item.element);drag.add(item);
 });
}
