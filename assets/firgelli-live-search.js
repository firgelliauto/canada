/* FIRGELLI live header search. Public catalogue; no credentials. */
(()=>{
 'use strict';
 if(window.firgelliLiveSearchInstalled)return;
 window.firgelliLiveSearchInstalled=true;
 const origin='https://firgelli-search-preview.firgelliwidgets.workers.dev';
 const region=({'www.firgelli.com':'firgelli','www.firgelliauto.ca':'ca','www.firgelliauto.com.au':'au'})[location.hostname]||'us';
 let panel,frame,active,ready=false;
 const inputs=()=>[...document.querySelectorAll('form[action="/search"] input[name="q"]')].filter(e=>!e.closest('main'));
 function send(){if(ready&&active)frame.contentWindow.postMessage({type:'firgelli-search-query',query:active.value},origin);}
 function close(){if(!panel)return;panel.hidden=true;if(active)active.setAttribute('aria-expanded','false');}
 function position(){
  if(!active||!panel||panel.hidden)return;
  const r=active.getBoundingClientRect(),mobile=innerWidth<700;
  const top=Math.max(8,Math.min(r.bottom+10,innerHeight-180));
  const width=Math.min(1380,innerWidth-24);
  panel.style.cssText=`position:fixed;z-index:2147483000;top:${top}px;left:${mobile?12:Math.max(12,Math.min(r.left,innerWidth-width-12))}px;width:${width}px;height:${Math.min(660,innerHeight-top-12)}px;background:#fff;border:1px solid #c8dae5;border-radius:12px;box-shadow:0 15px 45px #092d4340;overflow:hidden;`;
 }
 function open(input){
  active=input;
  if(!input.value.trim()){close();return;}
  if(!panel){
   panel=document.createElement('section');panel.id='firgelli-live-search';panel.setAttribute('aria-label','Live search results');
   const closeButton=document.createElement('button');closeButton.type='button';closeButton.textContent='Close ×';closeButton.setAttribute('aria-label','Close search results');closeButton.style.cssText='position:absolute;right:14px;top:7px;z-index:2;background:#fff;border:1px solid #d9e4eb;border-radius:5px;padding:5px 9px;color:#17364b;cursor:pointer';closeButton.onclick=()=>{close();active?.focus();close();};
   frame=document.createElement('iframe');frame.title='Live products, calculators and articles';frame.src=origin+'/?embed=1&dropdown=1&store='+region+'&q='+encodeURIComponent(input.value);frame.style.cssText='width:100%;height:100%;border:0;display:block';
   panel.append(closeButton,frame);document.body.append(panel);
  }
  panel.hidden=false;input.setAttribute('aria-expanded','true');position();send();
 }
 function isInput(target){return target instanceof HTMLInputElement&&inputs().includes(target);}
 document.addEventListener('input',e=>{if(isInput(e.target))open(e.target);},true);
 document.addEventListener('focusin',e=>{if(isInput(e.target)&&e.target.value.trim())open(e.target);});
 document.addEventListener('submit',e=>{const input=inputs().find(i=>i.form===e.target);if(input){e.preventDefault();e.stopImmediatePropagation();open(input);}},true);
 document.addEventListener('click',e=>{
  const button=e.target.closest('.js-search-button');
  if(button){const input=button.closest('form')?.querySelector('input[name="q"]');if(input&&isInput(input)&&input.value.trim()){e.preventDefault();e.stopImmediatePropagation();open(input);return;}}
  if(panel&&!panel.hidden&&!panel.contains(e.target)&&!isInput(e.target))close();
 },true);
 document.addEventListener('keydown',e=>{
  if(e.key==='Escape'){close();return;}
  if(isInput(e.target)&&e.key==='Enter'){e.preventDefault();e.stopImmediatePropagation();open(e.target);}
  if(isInput(e.target)&&e.key==='ArrowDown'&&panel&&!panel.hidden){e.preventDefault();frame.focus();}
 },true);
 window.addEventListener('message',e=>{if(e.origin!==origin||e.source!==frame?.contentWindow)return;if(e.data?.type==='firgelli-search-ready'){ready=true;send();}if(e.data?.type==='firgelli-search-close'){close();active?.focus();close();}});
 window.addEventListener('resize',position);window.addEventListener('scroll',position,{passive:true});
 for(const input of inputs()){input.setAttribute('aria-controls','firgelli-live-search');input.setAttribute('aria-expanded','false');input.setAttribute('autocomplete','off');}
})();

