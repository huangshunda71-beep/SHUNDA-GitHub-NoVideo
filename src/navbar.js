export function createNavbar(element) {
 const logo=document.createElement('a'); logo.className='logo'; logo.href='#home'; logo.textContent='SHUNDA.Design'; logo.setAttribute('aria-label','SHUNDA.Design 首页');
 const list=document.createElement('ul'); list.className='nav-links';
 for(const name of ['HOME','WORK','PROFILE','EXPERIENCE','CONTACT']){
  const li=document.createElement('li'),link=document.createElement('a');
  link.textContent=name;link.href='#'+name.toLowerCase();
  if(name==='HOME')link.setAttribute('aria-current','page');
  else link.addEventListener('click',event=>{
   event.preventDefault();
   // Future router can handle this event without changing the shared navbar.
   element.dispatchEvent(new CustomEvent('portfolio:navigate',{bubbles:true,detail:{section:name.toLowerCase()}}));

  });
  li.append(link);list.append(li);
 }
 element.append(logo,list);
}
