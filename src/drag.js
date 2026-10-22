// Pointer events move a physical constraint anchor, never DOM/body coordinates.
export function attachDrag(items,physics,stage,scale){
 let active=null;
 const point=event=>{const r=stage.getBoundingClientRect();return {x:(event.clientX-r.left)/scale(),y:(event.clientY-r.top)/scale()}};
 function release(){
  if(!active)return;const {item,id}=active;active=null;
  physics.end();delete item.element.dataset.grabbing;
  if(item.element.hasPointerCapture(id))item.element.releasePointerCapture(id);
 }
 document.addEventListener('keydown',event=>{
  if(event.key==='Tab')stage.dataset.keyboard='';
  if(event.key==='Escape')release();
 });
 function add(item){
  const el=item.element;
  el.addEventListener('dragstart',event=>event.preventDefault());
  el.addEventListener('pointerdown',event=>{
   if(active||!event.isPrimary||event.button!==0)return;
   event.preventDefault();delete stage.dataset.keyboard;
   if(!physics.begin(item.config.id,point(event)))return;
   active={item,id:event.pointerId};el.dataset.grabbing='';
   // No focus() on pointerdown: keyboard focus stays separate from mouse dragging.
   el.setPointerCapture(event.pointerId);
  });
  el.addEventListener('pointermove',event=>{
   if(active?.item!==item||active.id!==event.pointerId)return;
   event.preventDefault();physics.move(point(event));
  });
  for(const type of ['pointerup','pointercancel','lostpointercapture'])el.addEventListener(type,event=>{if(active?.item===item&&active.id===event.pointerId)release()});
  el.addEventListener('keydown',event=>{
   const directions={ArrowLeft:[-2,0],ArrowRight:[2,0],ArrowUp:[0,-3],ArrowDown:[0,2]};
   if(!directions[event.key])return;event.preventDefault();stage.dataset.keyboard='';
   const [dx,dy]=directions[event.key],boost=event.shiftKey?2:1;
   physics.nudge(item.config.id,dx*boost,dy*boost);
  });
 }
 items.forEach(add);
 window.addEventListener('blur',release);
 document.addEventListener('visibilitychange',()=>{if(document.hidden)release()});
 return {cancel:release,add};
}
