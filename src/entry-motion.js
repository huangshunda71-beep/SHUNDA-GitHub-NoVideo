// Shared fold entrances. Content remains readable without animation support.
const active=new WeakMap();
const reduced=()=>matchMedia('(prefers-reduced-motion: reduce)').matches;
function fold(el,delay=0,{gentle=false}={}){
 active.get(el)?.cancel();
 if(reduced())return;
 const animation=el.animate(gentle?[
  {opacity:0,transform:'translateY(22px) scaleY(.96)',transformOrigin:'50% 0%'},
  {opacity:1,transform:'translateY(0) scaleY(1)',transformOrigin:'50% 0%'}
 ]:[
  {opacity:0,transform:'perspective(1200px) rotateX(-65deg) translateY(24px)',transformOrigin:'50% 0%'},
  {opacity:1,transform:'perspective(1200px) rotateX(0deg) translateY(0)',transformOrigin:'50% 0%'}
 ],{duration:gentle?1100:720,delay,easing:gentle?'cubic-bezier(.25,.65,.3,1)':'cubic-bezier(.22,1,.36,1)',fill:'backwards'});
 active.set(el,animation);
}
export function initDetailEntrance(root){
 const text=[...root.querySelectorAll('.detail-info>button,.detail-info>h1,.detail-info>p,.detail-info dl>div')];
 const pictures=[...root.querySelectorAll('.detail-images')];
 const elements=[...text,...pictures];
 if(reduced()||!('IntersectionObserver' in window))return ()=>{};
 const observer=new IntersectionObserver(entries=>{
  let order=0;
  for(const entry of entries){if(!entry.isIntersecting)continue;observer.unobserve(entry.target);fold(entry.target,Math.min(order++*65,260));}
 },{threshold:0,rootMargin:'0px 0px -30px 0px'});
 // Enter the complete artwork column once; scrolling must not reveal each image again.
 pictures.forEach(el=>fold(el,80,{gentle:true}));
 text.forEach(el=>observer.observe(el));
 const preference=matchMedia('(prefers-reduced-motion: reduce)');
 const stop=()=>{observer.disconnect();elements.forEach(el=>active.get(el)?.cancel());};
 const change=()=>{if(preference.matches)stop()};preference.addEventListener('change',change);
 return ()=>{stop();preference.removeEventListener('change',change)};
}
// Observe stable groups, then unfold them together after they are visibly on screen.
const sectionControllers=new WeakMap();
const sectionGroups={
 profile:['.portrait-wrap','.profile-head','.biography','.education','.profile-contacts','.profile-copy-actions'],
 experience:['header','.experience-row'],
 work:[':scope>h2','.work-hint','.works-scroll']
};
export function initSectionEntrances(root){
 if(!('IntersectionObserver' in window))return;
 for(const [id,selectors] of Object.entries(sectionGroups)){
  const section=root.querySelector('#'+id);if(!section)continue;
  const elements=selectors.flatMap(selector=>[...section.querySelectorAll(selector)]);
  // The first cover controls the entire grid; no per-card animation or stagger.
  const targets=new Map(elements.map(el=>[el.matches('.works-scroll')?el.querySelector('.work-card'):el,el]).filter(([target])=>target));
  const played=new Set();
  const observer=new IntersectionObserver(entries=>{
   for(const entry of entries){
    if(!entry.isIntersecting||entry.intersectionRatio<.3||played.has(entry.target))continue;
    played.add(entry.target);observer.unobserve(entry.target);
    const element=targets.get(entry.target);element.classList.remove('section-entry-wait');
    fold(element,0,{gentle:true});
   }
  },{threshold:[.3],rootMargin:'0px 0px -18% 0px'});
  const restart=()=>{
   observer.disconnect();played.clear();elements.forEach(el=>{active.get(el)?.cancel();el.classList.remove('section-entry-wait')});
   if(!reduced())targets.forEach((el,target)=>{el.classList.add('section-entry-wait');observer.observe(target)});
  };
  sectionControllers.set(section,{restart});restart();
  const preference=matchMedia('(prefers-reduced-motion: reduce)');preference.addEventListener('change',restart);
 }
}
export function replaySectionEntrance(section){
 if(!section)return;
 section.dataset.entryReplay='true';
 section.querySelectorAll('.drop-pending,.motion-pending,.fold-waiting').forEach(el=>el.classList.remove('drop-pending','motion-pending','fold-waiting'));
 sectionControllers.get(section)?.restart();
}
