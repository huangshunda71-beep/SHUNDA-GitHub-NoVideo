export function initArtworkPreview(root){
 const dialog=document.createElement('dialog');dialog.className='artwork-preview';dialog.setAttribute('aria-label','作品图片预览');
 dialog.innerHTML='<button class="artwork-preview-close" aria-label="关闭作品图片预览">×</button><img alt="">';document.body.append(dialog);
 const image=dialog.querySelector('img');let source=null,animation=null;
 const enhance=()=>root.querySelectorAll('.detail-images .media:has(img)').forEach(el=>{el.dataset.artworkPreview='';el.tabIndex=0;el.setAttribute('role','button');el.setAttribute('aria-label','放大'+(el.querySelector('img').alt||'作品图片'));});
 new MutationObserver(enhance).observe(root,{childList:true,subtree:true});
 function open(el){const original=el.querySelector('img');if(!original)return;source=el;image.src=original.currentSrc||original.src;image.alt=original.alt;
  dialog.showModal();document.documentElement.classList.add('artwork-preview-open');
  animation?.cancel();if(!matchMedia('(prefers-reduced-motion: reduce)').matches)animation=image.animate([{opacity:0,transform:'scale(.82) translateY(24px)'},{opacity:1,transform:'scale(1) translateY(0)'}],{duration:420,easing:'cubic-bezier(.22,1,.36,1)'});
  dialog.querySelector('button').focus({preventScroll:true});
 }
 root.addEventListener('click',event=>{const el=event.target.closest('[data-artwork-preview]');if(el)open(el)});
 root.addEventListener('keydown',event=>{const el=event.target.closest('[data-artwork-preview]');if(el&&(event.key==='Enter'||event.key===' ')){event.preventDefault();open(el)}});
 dialog.addEventListener('click',event=>{if(event.target===dialog||event.target.closest('.artwork-preview-close'))dialog.close()});
 dialog.addEventListener('close',()=>{animation?.cancel();document.documentElement.classList.remove('artwork-preview-open');image.removeAttribute('src');if(source?.isConnected)source.focus({preventScroll:true});});
}
