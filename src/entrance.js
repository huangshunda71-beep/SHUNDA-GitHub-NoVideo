// Some Chromium reloads leave decode() pending even after the image is complete.
const bounded=(promise,ms)=>Promise.race([promise,new Promise(resolve=>setTimeout(resolve,ms))]);
export async function prepareResources(root){
 const fonts=[['400 32px Dela','SHUNDA.Design'],['700 24px Sarasa','HOME WORK PROFILE EXPERIENCE CONTACT'],['500 123px PingFangCover','MAKE IDEAS WORKS @阿达 LET’S TALK']];
 const results=await Promise.allSettled([
  ...fonts.map(async ([font,text])=>{const loaded=await bounded(document.fonts.load(font,text),8000);if(!loaded?.length&&!document.fonts.check(font,text))throw new Error('字体未加载：'+font)}),
  ...Array.from(root.querySelectorAll('img')).map(async image=>{await bounded(image.decode(),4000);if(!image.complete||!image.naturalWidth)throw new Error('图片未加载：'+image.src)})
 ]);
 await bounded(document.fonts.ready,8000);
 const failures=results.filter(r=>r.status==='rejected');
 if(failures.length){const notice=document.querySelector('#resource-error');notice.hidden=false;notice.textContent='部分字体或图片未加载，请检查本地 assets 文件后刷新。';console.error('Resource loading failed',failures);}
 return failures.length===0;
}
