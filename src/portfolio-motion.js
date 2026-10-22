import {initSectionEntrances} from './entry-motion.js';
import {initIntroInteraction,initLetterHover} from './intro-interaction.js';
// Short, once-per-visit heading entrances; no layout-changing animation.
export function initPortfolioMotion(root){
 initIntroInteraction(root);
 const reduced=matchMedia('(prefers-reduced-motion: reduce)');
 if(reduced.matches || !('IntersectionObserver' in window)) return;
 initExtraMotion(root,reduced);
 initSectionEntrances(root);
 const headings=[...root.querySelectorAll('#intro > h2')];
 const observer=new IntersectionObserver(entries=>{
  for(const entry of entries){
   if(!entry.isIntersecting) continue;
   const heading=entry.target;observer.unobserve(heading);
   heading.classList.remove('drop-pending');
   heading.dataset.dropPlayed='true';
   if(reduced.matches||heading.closest('[data-entry-replay]')) continue;
   heading.querySelectorAll('.drop-letter').forEach((letter,i)=>{
    const tilt=[-9,6,-4,8,-6,3][i%6];
    const delay=[0,65,25,105,45,85,15][i%7]+Math.floor(i/7)*40;
    letter.animate([
     {transform:'translateY(-.85em) rotate('+tilt+'deg)',opacity:0,offset:0,easing:'cubic-bezier(.45,0,.8,.5)'},
     {transform:'translateY(.055em) rotate('+(-tilt*.18)+'deg)',opacity:1,offset:.65,easing:'ease-out'},
     {transform:'translateY(-.025em) rotate(0deg)',opacity:1,offset:.84,easing:'ease-in-out'},
     {transform:'translateY(0) rotate(0deg)',opacity:1,offset:1}
    ],{duration:540,delay,fill:'backwards'});
   });
  }
 },{threshold:.35,rootMargin:'0px 0px -5% 0px'});
 for(const heading of headings){
  const title=heading.textContent;heading.setAttribute('aria-label',title);
  const fragment=document.createDocumentFragment();
  for(const char of title){
   if(char===' '){fragment.append(document.createTextNode(' '));continue;}
   const span=document.createElement('span');span.className='drop-letter';span.setAttribute('aria-hidden','true');span.textContent=char;fragment.append(span);
  }
  heading.replaceChildren(fragment);heading.classList.add('drop-pending');observer.observe(heading);
 }
 root.querySelectorAll('#intro > h2,.intro-copy p,.profile-head .hello,.profile-head h2,.specialty,.about-tag,.education strong,#experience header h2,#work>h2').forEach(el=>initLetterHover(el,{strength:el.matches('.intro-copy p,.specialty')?.12:.22}));
 reduced.addEventListener('change',()=>{if(reduced.matches){observer.disconnect();headings.forEach(h=>{h.classList.remove('drop-pending');h.getAnimations({subtree:true}).forEach(a=>a.cancel());});}});
}

function splitLetters(element,className){
 const walker=document.createTreeWalker(element,NodeFilter.SHOW_TEXT),nodes=[];
 while(walker.nextNode())nodes.push(walker.currentNode);
 element.setAttribute('aria-label',element.textContent);
 let index=0;
 for(const node of nodes){const fragment=document.createDocumentFragment();for(const char of node.textContent){
  if(/\s/.test(char)){fragment.append(char);continue;}
  const span=document.createElement('span');span.className=className;span.textContent=char;span.setAttribute('aria-hidden','true');span.style.setProperty('--letter-index',index++);fragment.append(span);
 }node.replaceWith(fragment);}
}
export function initFooterMotion(root){
 for(const heading of root.querySelectorAll('.ending-top h2:not([data-hop-ready])')){
  heading.dataset.hopReady='true';splitLetters(heading,'hop-letter');
  heading.style.setProperty('--hop-cycle',(heading.querySelectorAll('.hop-letter').length*90+1100)+'ms');
 }
}
function initExtraMotion(root,reduced){
 initFooterMotion(root);
 const mark=root.querySelector('.profile-head mark');
 if(mark){const text=document.createElement('span');text.className='profile-mark-scroll';text.textContent=mark.textContent;mark.replaceChildren(text);}
 const workHint=root.querySelector('.work-hint');
 if(workHint){splitLetters(workHint,'work-hint-letter');workHint.querySelectorAll('.work-hint-letter').forEach((el,i)=>{el.style.setProperty('--bounce-duration',[2200,2480,2320,2670,2410][i%5]+'ms');el.style.setProperty('--bounce-delay',(-i*155)+'ms');});}
 const jobs=new Map();
 const observer=new IntersectionObserver(entries=>{for(const entry of entries){if(!entry.isIntersecting)continue;
  observer.unobserve(entry.target);const job=jobs.get(entry.target);entry.target.classList.remove('motion-pending');entry.target.dataset.motionPlayed='true';
  if(!reduced.matches&&!entry.target.closest('[data-entry-replay]'))job();
 }},{threshold:.15,rootMargin:'0px 0px -4% 0px'});
 const observe=(element,job)=>{if(!element)return;jobs.set(element,job);element.classList.add('motion-pending');observer.observe(element)};
 const animate=(el,frames,delay=0,duration=580)=>el.animate(frames,{duration,delay,fill:'backwards',easing:'cubic-bezier(.2,.75,.25,1)'});
 const intro=root.querySelector('.intro-copy');
 observe(intro,()=>intro.querySelectorAll('p').forEach((p,i)=>animate(p,[{opacity:0,transform:'translateY(30px) rotate(-2deg) scale(.96)'},{opacity:1,transform:'translateY(-4px) rotate(.4deg) scale(1.01)',offset:.72},{opacity:1,transform:'none'}],i*55)));
 reduced.addEventListener('change',()=>{if(!reduced.matches)return;observer.disconnect();root.querySelectorAll('.motion-pending,.fold-waiting').forEach(el=>el.classList.remove('motion-pending','fold-waiting'));root.getAnimations({subtree:true}).forEach(a=>a.cancel());});
}
