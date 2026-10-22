// A bounded, axis-aligned trail. Native cursor and hit testing stay unchanged.
export function initCursorTrail(){
 const fine=matchMedia('(hover: hover) and (pointer: fine)');
 const reduced=matchMedia('(prefers-reduced-motion: reduce)');
 const layer=document.createElement('div');layer.className='cursor-trail';layer.setAttribute('aria-hidden','true');document.body.append(layer);
 const blocks=Array.from({length:18},()=>{const block=document.createElement('i');layer.append(block);return block;});
 const step=16,life=520;let points=[],head=null,frame=0,lastMove=0;
 function clear(){points=[];head=null;cancelAnimationFrame(frame);frame=0;blocks.forEach(b=>b.style.opacity=0);}
 function paint(now){
  frame=0;points=points.filter(p=>now-p.time<life);
  blocks.forEach((block,i)=>{const p=points[points.length-1-i];if(!p){block.style.opacity=0;return;}
   const rank=i/blocks.length;block.style.transform='translate('+p.x+'px,'+p.y+'px)';
   block.style.background='hsl(48 100% '+(50+rank*36)+'%)';block.style.opacity=(1-rank*.72)*Math.max(0,1-(now-p.time)/life);
  });
  if(points.length)frame=requestAnimationFrame(paint);
 }
 document.addEventListener('pointermove',event=>{
  if(event.pointerType!=='mouse'||!fine.matches||reduced.matches)return;
  const parent=document.querySelector('dialog[open]')||document.body;if(layer.parentNode!==parent){clear();parent.append(layer);}
  const now=performance.now(),target={x:Math.round((event.clientX+12)/step)*step,y:Math.round((event.clientY+12)/step)*step};
  if(!head||now-lastMove>life||Math.abs(target.x-head.x)+Math.abs(target.y-head.y)>600){head={...target};points=[];}
  lastMove=now;
  // Complete the longer leg first, then turn exactly 90 degrees.
  const axes=Math.abs(target.x-head.x)>=Math.abs(target.y-head.y)?['x','y']:['y','x'];
  for(const axis of axes){while(head[axis]!==target[axis]){head[axis]+=Math.sign(target[axis]-head[axis])*step;points.push({...head,time:now});if(points.length>blocks.length)points.shift();}}
  if(!points.length)points.push({...head,time:now});
  if(!frame)frame=requestAnimationFrame(paint);
 },{passive:true});
 document.documentElement.addEventListener('pointerleave',clear);window.addEventListener('blur',clear);
 document.addEventListener('visibilitychange',()=>{if(document.hidden)clear();});
 fine.addEventListener('change',clear);reduced.addEventListener('change',clear);
}
