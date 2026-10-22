import {initLetterHover} from './intro-interaction.js';
import {initArtworkPreview} from './artwork-preview.js';
import {initDetailEntrance,replaySectionEntrance} from './entry-motion.js';
import {initQrPreview} from './qr-preview.js';
import {translateText} from './content-store.js';
import {initCursorTrail} from './cursor-trail.js';
import {initPortfolioMotion,initFooterMotion} from './portfolio-motion.js';
import {HomeSections,WorkDetailTemplate,ContactPanel,escapeHTML} from './portfolio-views.js';
import {findWork,contact} from './portfolio-data.js';
export function initPortfolio(){
 const hero=document.querySelector('#home');
 const home=document.createElement('div');home.id='home-page';hero.before(home);home.append(hero);
 const sections=document.createElement('div');sections.className='site-sections';sections.innerHTML=HomeSections();home.append(sections);
 initPortfolioMotion(home);
 initCursorTrail();
 const workSection=home.querySelector('#work'),more=home.querySelector('[data-more-works]');
 more.addEventListener('click',()=>{
  const expanded=more.getAttribute('aria-expanded')!=='true';
  workSection.classList.toggle('is-expanded',expanded);
  more.setAttribute('aria-expanded',String(expanded));
  more.innerHTML=expanded?escapeHTML(translateText('收起作品'))+' <span aria-hidden="true">↑</span>':escapeHTML(translateText('点击查看更多作品'))+' <span aria-hidden="true">↓</span>';
  if(!expanded)more.scrollIntoView({block:'nearest'});
 });
 const detail=document.createElement('main');detail.id='detail-page';detail.hidden=true;home.after(detail);
 document.body.insertAdjacentHTML('beforeend',ContactPanel());
 const dialog=document.querySelector('.contact-dialog');
 initLetterHover(dialog.querySelector('h2'),{strength:.2});
 initArtworkPreview(detail);
 let focusBefore=null,scrollBefore=0,activeDetail=false,clearDetailEntrance=()=>{};
 history.scrollRestoration='manual';
 const snapshot=()=>({y:window.scrollY,inner:document.querySelector('.works-scroll').scrollTop,tracks:[...document.querySelectorAll('.carousel-track')].map(t=>t.scrollLeft)});
 function restore(pos){window.scrollTo(0,pos.y);document.querySelector('.works-scroll').scrollTop=pos.inner;document.querySelectorAll('.carousel-track').forEach((t,i)=>t.scrollLeft=pos.tracks?.[i]||0)}
 function stopDetailVideos(){detail.querySelectorAll('video').forEach(video=>{video.pause();video.currentTime=0;});}
 window.addEventListener('pagehide',stopDetailVideos);
 document.addEventListener('visibilitychange',()=>{if(document.hidden)stopDetailVideos()});
 function render(hash,position){
  stopDetailVideos();
  clearDetailEntrance();
  const id=hash.startsWith('#work/')?decodeURIComponent(hash.slice(6)):null,w=findWork(id);
  activeDetail=Boolean(id);home.hidden=activeDetail;detail.hidden=!activeDetail;
  if(id){
   detail.innerHTML=w?WorkDetailTemplate(w):'<section class="not-found"><h1>未找到这个作品</h1><a class="pill" href="#work">返回作品总览</a></section>';
   detail.querySelectorAll('video').forEach(video=>video.addEventListener('loadedmetadata',()=>{if(video.videoWidth&&video.videoHeight)video.style.aspectRatio=video.videoWidth+' / '+video.videoHeight;}));
   initFooterMotion(detail);
   document.title=(w?.title||'作品未找到')+' — SHUNDA.Design';window.scrollTo(0,0);
   clearDetailEntrance=initDetailEntrance(detail);
  }else{
   document.title='SHUNDA.Design — Portfolio';
   const target=document.getElementById(hash.slice(1)||'home');
   if(position)restore(position);else if(target)target.scrollIntoView({block:'start'});else window.scrollTo(0,0);
  }
  document.querySelectorAll('.nav-links a').forEach(a=>{if(a.hash===(id?'#work':hash||'#home'))a.setAttribute('aria-current','page');else a.removeAttribute('aria-current')});
 }
 function go(hash,{restorePosition=null,returnTo=null}={}){
  if(!activeDetail)history.replaceState({...history.state,position:snapshot()},'',location.href);
  history.pushState({returnTo:returnTo||history.state?.returnTo||null,position:restorePosition},'',hash);
  render(hash,restorePosition);
 }
 function openContact(){focusBefore=document.activeElement;scrollBefore=window.scrollY;document.body.classList.add('contact-open');document.documentElement.classList.add('contact-open');dialog.showModal();
  if(!matchMedia('(prefers-reduced-motion: reduce)').matches){
   dialog.getAnimations({subtree:true}).forEach(a=>a.cancel());
   dialog.animate([{transform:'translateX(100%)',opacity:.3},{transform:'translateX(0)',opacity:1}],{duration:540,easing:'cubic-bezier(.22,1,.36,1)'});
   dialog.querySelectorAll('h2,.contact-subtitle,.contact-person,dt,dd,.contact-actions,.qr-pair').forEach((el,i)=>el.animate([{opacity:0,transform:'perspective(800px) rotateX(-65deg) translateY(24px)',transformOrigin:'50% 0%'},{opacity:1,transform:'perspective(800px) rotateX(0) translateY(0)',transformOrigin:'50% 0%'}],{duration:650,delay:120+i*45,easing:'cubic-bezier(.22,1,.36,1)',fill:'backwards'}));
  }
  dialog.querySelector('[data-close]').focus()}
 const resume=dialog.querySelector('#resume-preview'),resumeButton=dialog.querySelector('[data-resume]');
 function closeResume(restoreFocus=true){resume.hidden=true;resumeButton.setAttribute('aria-expanded','false');if(restoreFocus)resumeButton.focus({preventScroll:true})}
 function closeContact(){closeResume(false);dialog.close()}
 dialog.addEventListener('cancel',event=>{if(!resume.hidden){event.preventDefault();closeResume()}});
 dialog.addEventListener('close',()=>closeResume(false));

 dialog.addEventListener('close',()=>{document.body.classList.remove('contact-open');document.documentElement.classList.remove('contact-open');window.scrollTo(0,scrollBefore);focusBefore?.focus({preventScroll:true})});
 dialog.addEventListener('click',event=>{if(event.target===dialog){const r=dialog.getBoundingClientRect();if(event.clientX<r.left||event.clientX>r.right||event.clientY<r.top||event.clientY>r.bottom)closeContact()}});
 document.addEventListener('portfolio:navigate',event=>{
  const section=event.detail.section;
  if(section==='contact'){openContact();return;}
  go('#'+section);
  if(['work','profile','experience'].includes(section))replaySectionEntrance(document.getElementById(section));
 });
 document.addEventListener('click',async event=>{
  if(event.target.closest('[data-resume]')){resume.hidden=false;resumeButton.setAttribute('aria-expanded','true');resume.querySelector('[data-resume-close]').focus({preventScroll:true});return}
  if(event.target.closest('[data-resume-close]')){closeResume();return}
  if(event.target.closest('[data-contact]')){openContact();return}
  if(event.target.closest('[data-close]')){closeContact();return}
  const profileCopy=event.target.closest('[data-profile-copy]');
  if(profileCopy){
   const kind=profileCopy.dataset.profileCopy,status=document.querySelector('.profile-copy-status');
   try{await navigator.clipboard.writeText(contact[kind]);status.textContent=translateText(kind==='phone'?'电话已复制':'邮箱已复制');}
   catch{status.textContent=translateText('复制失败，请选中上方联系方式手动复制。');}return;
  }
  if(event.target.closest('[data-copy]')){
   try{await navigator.clipboard.writeText(contact.email);dialog.querySelector('.copy-status').textContent=translateText('邮箱已复制')}
   catch{dialog.querySelector('.copy-status').textContent=translateText('复制失败，请选中上方邮箱手动复制。')}return;
  }
  if(event.target.closest('[data-back]')){
   const origin=history.state?.returnTo;go(origin?.hash||'#work',{restorePosition:origin?.position||null});return;
  }
  if(event.defaultPrevented)return;
  const a=event.target.closest('a[href^="#"]');
  if(!a||event.ctrlKey||event.metaKey||event.shiftKey||event.altKey||event.button!==0)return;
  event.preventDefault();if(a.hash==='#contact'){openContact();return}
  const origin=a.dataset.origin?{hash:'#'+a.dataset.origin,position:snapshot()}:null;
  go(a.hash,{returnTo:origin});
  if(a.closest('.nav-links')&&['#work','#profile','#experience'].includes(a.hash))replaySectionEntrance(document.querySelector(a.hash));
 });
 window.addEventListener('popstate',()=>render(location.hash,history.state?.position));
 // Hash addresses also work when pasted or edited directly.
 window.addEventListener('hashchange',()=>{if(location.hash!=='#contact')render(location.hash,history.state?.position)});
 // Only in-session navigation restores positions; preloader entry starts at home.
 history.replaceState(null,'',location.pathname+location.search+'#home');
 render('#home');

 initQrPreview();
}
