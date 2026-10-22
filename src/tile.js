export function createTile(config){
 const element=document.createElement('div'); element.className='tile';element.dataset.tile=config.id;element.dataset.node=config.nodeId;element.tabIndex=0;element.setAttribute('role','button');
 element.setAttribute('aria-label','拖动 '+(config.label||config.text.value.replaceAll('\n',' ')));element.setAttribute('aria-describedby','drag-help');
 element.style.zIndex=config.z;
 const fall=document.createElement('div');fall.className='tile-fall';
 const face=document.createElement('div');face.className='tile-face';face.style.width=config.width+'px';face.style.height=config.height+'px';face.style.setProperty('--angle',config.angle+'deg');
 face.style.setProperty('--radius',config.radius+'px');face.style.setProperty('--background',config.background||'transparent');
 const surface=document.createElement('div');surface.className='tile-surface';
 if(config.kind==='image'){
  const image=document.createElement('img');image.className='tile-art';image.src=config.src;image.alt=config.label;image.width=1120;image.height=1120;image.draggable=false;image.decoding='async';surface.append(image);
 }else{
  const text=document.createElement('span');text.className='tile-text';text.textContent=config.text.value;
  Object.assign(text.style,{left:config.text.x+'px',top:config.text.y+'px',width:config.text.width+'px',height:config.text.height+'px',fontSize:config.text.fontSize+'px',lineHeight:config.text.lineHeight+'px',color:config.text.color});
  surface.append(text);
  if(config.icon){const icon=document.createElement('img');icon.className='tile-icon';icon.src=config.icon.src;icon.alt='';icon.draggable=false;Object.assign(icon.style,{left:config.icon.x+'px',top:config.icon.y+'px',width:config.icon.width+'px',height:config.icon.height+'px',transform:'rotate('+config.icon.angle+'deg)'});surface.append(icon);}
 }
 face.append(surface);fall.append(face);element.append(fall);
 return {element,fall,face,config,x:config.x,y:config.y,scale:1,angle:config.angle,offsets:{desktop:{x:0,y:0},mobile:{x:0,y:0}}};
}
