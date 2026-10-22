export let savedContent=null;
export let contentRevision=0;
export const textCatalog=new Map();
if(typeof window!=='undefined'){
 try{const response=await fetch('./data/content.json',{cache:'no-store'});if(!response.ok)throw new Error('Content unavailable');const data=await response.json();savedContent=data.content;contentRevision=data.revision||0;}catch(error){console.warn('Could not load saved portfolio content',error);}
}
export function translateText(text,section='通用文案'){
 if(!text.trim())return text;
 const key=text.trim();if(!textCatalog.has(key))textCatalog.set(key,section);
 const replacement=savedContent?.textOverrides?.[key];return replacement===undefined?text:text.replace(key,replacement);
}
export function applyContentText(root,section='通用文案'){
 const walker=document.createTreeWalker(root,NodeFilter.SHOW_TEXT);const nodes=[];while(walker.nextNode())nodes.push(walker.currentNode);
 for(const node of nodes){if(node.parentElement?.closest('script,style,.developer-dialog,.dev-entry'))continue;node.textContent=translateText(node.textContent,section);}
}
export function translateHTML(html,section){
 if(typeof document==='undefined')return html;
 const template=document.createElement('template');template.innerHTML=html;applyContentText(template.content,section);return template.innerHTML;
}
