export function initQrPreview(){
 const dialog=document.createElement('dialog');dialog.className='qr-preview';dialog.setAttribute('aria-label','二维码预览');
 dialog.innerHTML='<div class="qr-preview-card"><button type="button" class="qr-preview-close" aria-label="关闭二维码预览">×</button><p></p><img alt=""><small>点击空白处关闭</small></div>';
 document.body.append(dialog);let source=null;
 function enhance(){document.querySelectorAll('.qr-item .media').forEach(el=>{if(el.dataset.qrPreview)return;el.dataset.qrPreview='';el.tabIndex=0;el.setAttribute('role','button');el.setAttribute('aria-label','放大'+(el.closest('.qr-item').querySelector('span,p')?.textContent||el.querySelector('img')?.alt||'二维码'));});}
 enhance();new MutationObserver(enhance).observe(document.querySelector('#detail-page'),{childList:true,subtree:true});
 function open(el){const img=el.querySelector('img');if(!img)return;source=el;dialog.querySelector('img').src=img.currentSrc||img.src;dialog.querySelector('img').alt=img.alt||'二维码';dialog.querySelector('p').textContent=el.closest('.qr-item').querySelector('span,p')?.textContent||'二维码';dialog.showModal();}
 document.addEventListener('click',event=>{const el=event.target.closest('[data-qr-preview]');if(el)open(el);});
 document.addEventListener('keydown',event=>{const el=event.target.closest('[data-qr-preview]');if(el&&(event.key==='Enter'||event.key===' ')){event.preventDefault();open(el);}});
 dialog.addEventListener('click',event=>{if(event.target===dialog||event.target.closest('.qr-preview-close'))dialog.close()});
 dialog.addEventListener('close',()=>{source?.focus({preventScroll:true});});
}
