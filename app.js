const $ = (id) => document.getElementById(id);
const toolIds = ['word-counter','image-compressor','image-resizer','case-converter','percentage-calculator'];
const infoIds = ['about','contact','privacy','terms'];
function route(){
  const key=(location.hash||'#home').slice(1);
  document.querySelectorAll('.tool-page').forEach(el=>el.classList.toggle('active',el.id===key));
  const isTool=toolIds.includes(key);
  document.querySelectorAll('#app > .hero, #app > .ad-slot, #app > #all-tools, #app > #about, #app > #contact, #app > #privacy, #app > #terms').forEach(el=>el.style.display=(!isTool && (key==='home'||el.id===key||el.id==='all-tools'||(key==='home'&&el.id==='home')||(key==='home'&&el.classList.contains('ad-slot'))))?'':'none');
  if(key==='home'){document.querySelectorAll('#app > .page-section:not(.tool-page)').forEach(el=>el.style.display='');}
  if(infoIds.includes(key)){document.querySelectorAll('#app > .page-section:not(.tool-page)').forEach(el=>el.style.display=el.id===key?'':'none');}
  if(key==='all-tools'){document.querySelectorAll('#app > .page-section:not(.tool-page)').forEach(el=>el.style.display=el.id==='all-tools'?'':'none');}
  document.querySelectorAll('[data-nav]').forEach(a=>a.classList.toggle('active',a.dataset.nav===key));
  document.getElementById('mainNav').classList.remove('open');$('menuToggle').setAttribute('aria-expanded','false');
  window.scrollTo({top:0,behavior:'instant'});
}
window.addEventListener('hashchange',route);
$('menuToggle').addEventListener('click',()=>{const nav=$('mainNav');nav.classList.toggle('open');$('menuToggle').setAttribute('aria-expanded',nav.classList.contains('open')?'true':'false')});
$('year').textContent=new Date().getFullYear();
route();

// Word counter
function updateWordStats(){
 const t=$('wordInput').value, trimmed=t.trim();
 const words=trimmed?trimmed.split(/\s+/u).length:0;
 const sentences=(t.match(/[.!?]+(?=\s|$)/g)||[]).length;
 const paragraphs=trimmed?trimmed.split(/\n\s*\n/).filter(x=>x.trim()).length:0;
 $('wordCount').textContent=words.toLocaleString();$('charCount').textContent=t.length.toLocaleString();$('charNoSpace').textContent=t.replace(/\s/g,'').length.toLocaleString();
 $('sentenceCount').textContent=sentences.toLocaleString();$('paragraphCount').textContent=paragraphs.toLocaleString();$('readingTime').textContent=words?`${Math.max(1,Math.ceil(words/200))} min`:'0 min';
}
$('wordInput').addEventListener('input',updateWordStats);
$('copyText').addEventListener('click',async()=>{try{await navigator.clipboard.writeText($('wordInput').value);$('copyText').textContent='Copied!';setTimeout(()=>$('copyText').textContent='Copy text',1300)}catch{$('wordInput').select();document.execCommand('copy')}});
$('clearText').addEventListener('click',()=>{$('wordInput').value='';updateWordStats()});

// Shared image helpers
function loadImage(file){return new Promise((resolve,reject)=>{if(!file.type.startsWith('image/'))return reject(new Error('Please select a valid image file.'));const url=URL.createObjectURL(file);const img=new Image();img.onload=()=>resolve({img,url});img.onerror=()=>{URL.revokeObjectURL(url);reject(new Error('This image could not be opened in your browser.'))};img.src=url})}
function canvasBlob(canvas,type,quality){return new Promise((resolve,reject)=>canvas.toBlob(b=>b?resolve(b):reject(new Error('Could not create the output image. Try another format.')),type,quality))}
function fmtBytes(n){if(n<1024)return `${n} B`;if(n<1048576)return `${(n/1024).toFixed(1)} KB`;return `${(n/1048576).toFixed(2)} MB`}
function setError(id,msg){$(id).textContent=msg||''}
let compFile=null,compBlob=null,compURL=null,compSourceURL=null;
async function makeCompressed(){
 if(!compFile)return;
 try{
  const {img}=await loadImage(compFile);const canvas=document.createElement('canvas');canvas.width=img.naturalWidth;canvas.height=img.naturalHeight;
  const ctx=canvas.getContext('2d');ctx.drawImage(img,0,0);
  const type=$('compressFormat').value,quality=Number($('quality').value)/100;
  compBlob=await canvasBlob(canvas,type,type==='image/png'?undefined:quality);
  if(compURL)URL.revokeObjectURL(compURL);compURL=URL.createObjectURL(compBlob);$('compressPreview').src=compURL;
  $('compressedSize').textContent=`${fmtBytes(compBlob.size)} · ${Math.round((1-compBlob.size/compFile.size)*100)}% size change`;
  $('downloadCompressed').disabled=false;setError('compressError','');
 }catch(e){setError('compressError',e.message)}
}
$('compressFile').addEventListener('change',async e=>{
 compFile=e.target.files[0];if(!compFile)return;
 try{if(compSourceURL)URL.revokeObjectURL(compSourceURL);const {url}=await loadImage(compFile);compSourceURL=url;$('compressOriginal').src=url;$('originalSize').textContent=fmtBytes(compFile.size);$('compressPanel').classList.remove('hidden');await makeCompressed()}catch(err){setError('compressError',err.message)}
});
$('quality').addEventListener('input',()=>{$('qualityValue').textContent=$('quality').value+'%';makeCompressed()});
$('compressFormat').addEventListener('change',makeCompressed);
$('downloadCompressed').addEventListener('click',()=>{if(!compBlob)return;const ext=$('compressFormat').value.split('/')[1].replace('jpeg','jpg');downloadBlob(compBlob,`toolnest-compressed.${ext}`)});
function downloadBlob(blob,name){const url=URL.createObjectURL(blob);const a=document.createElement('a');a.href=url;a.download=name;document.body.appendChild(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),1000)}

// Image resizer
let resizeFile=null,resizeSourceURL=null,resizeBlob=null,resizeURL=null,resizeOriginalW=0,resizeOriginalH=0,keepAspect=true,updatingDims=false;
$('resizeFile').addEventListener('change',async e=>{
 resizeFile=e.target.files[0];if(!resizeFile)return;
 try{const {img,url}=await loadImage(resizeFile);if(resizeSourceURL)URL.revokeObjectURL(resizeSourceURL);resizeSourceURL=url;resizeOriginalW=img.naturalWidth;resizeOriginalH=img.naturalHeight;
 $('resizeOriginal').src=url;$('resizeOriginalInfo').textContent=`${resizeOriginalW} × ${resizeOriginalH} · ${fmtBytes(resizeFile.size)}`;
 $('resizeWidth').value=resizeOriginalW;$('resizeHeight').value=resizeOriginalH;$('resizePanel').classList.remove('hidden');await makeResized()
 }catch(err){setError('resizeError',err.message)}
});
$('aspectLock').addEventListener('click',()=>{keepAspect=!keepAspect;$('aspectLock').textContent=keepAspect?'🔒':'🔓';$('aspectLock').setAttribute('aria-pressed',String(keepAspect))});
$('resizeWidth').addEventListener('input',()=>{if(keepAspect&&!updatingDims&&resizeOriginalW){updatingDims=true;$('resizeHeight').value=Math.max(1,Math.round(Number($('resizeWidth').value)*resizeOriginalH/resizeOriginalW));updatingDims=false}});
$('resizeHeight').addEventListener('input',()=>{if(keepAspect&&!updatingDims&&resizeOriginalH){updatingDims=true;$('resizeWidth').value=Math.max(1,Math.round(Number($('resizeHeight').value)*resizeOriginalW/resizeOriginalH));updatingDims=false}});
async function makeResized(){
 if(!resizeFile)return;
 try{const w=Number($('resizeWidth').value),h=Number($('resizeHeight').value);if(!Number.isInteger(w)||!Number.isInteger(h)||w<1||h<1||w>10000||h>10000)throw new Error('Enter width and height between 1 and 10,000 pixels.');
 const {img}=await loadImage(resizeFile);const canvas=document.createElement('canvas');canvas.width=w;canvas.height=h;const ctx=canvas.getContext('2d');ctx.drawImage(img,0,0,w,h);
 const type=$('resizeFormat').value;resizeBlob=await canvasBlob(canvas,type,.92);if(resizeURL)URL.revokeObjectURL(resizeURL);resizeURL=URL.createObjectURL(resizeBlob);$('resizePreview').src=resizeURL;$('resizeInfo').textContent=`${w} × ${h} · ${fmtBytes(resizeBlob.size)}`;$('downloadResized').disabled=false;setError('resizeError','')
 }catch(err){$('downloadResized').disabled=true;setError('resizeError',err.message)}
}
['resizeWidth','resizeHeight','resizeFormat'].forEach(id=>$(id).addEventListener('change',makeResized));
$('downloadResized').addEventListener('click',()=>{if(!resizeBlob)return;const ext=$('resizeFormat').value.split('/')[1].replace('jpeg','jpg');downloadBlob(resizeBlob,`toolnest-resized.${ext}`)});

// Case converter
$('caseInput').value='';
document.querySelectorAll('[data-case]').forEach(btn=>btn.addEventListener('click',()=>{
 const input=$('caseInput');const text=input.value;let result=text;
 switch(btn.dataset.case){
 case 'upper':result=text.toLocaleUpperCase();break;
 case 'lower':result=text.toLocaleLowerCase();break;
 case 'title':result=text.toLocaleLowerCase().replace(/(^|[\s\-])(\p{L})/gu,(m,prefix,letter)=>prefix+letter.toLocaleUpperCase());break;
 case 'sentence':result=text.toLocaleLowerCase().replace(/(^\s*[a-z]|\.\s+[a-z]|!\s+[a-z]|\?\s+[a-z])/g,m=>m.toLocaleUpperCase());break;
 }
 input.value=result;$('caseStatus').textContent='Text converted.';
}));
$('copyCase').addEventListener('click',async()=>{try{await navigator.clipboard.writeText($('caseInput').value);$('caseStatus').textContent='Copied to clipboard.'}catch{$('caseInput').select();document.execCommand('copy');$('caseStatus').textContent='Copied.'}});
$('clearCase').addEventListener('click',()=>{$('caseInput').value='';$('caseStatus').textContent='Text cleared.'});

// Percentage calculator
function numberFrom(id){const v=$(id).value;return v===''?NaN:Number(v)}
function showCalc(id,text){$(id).textContent=text}
$('calcA').addEventListener('click',()=>{const p=numberFrom('percentA'),n=numberFrom('percentB');showCalc('resultA',Number.isFinite(p)&&Number.isFinite(n)?`${(p/100*n).toLocaleString(undefined,{maximumFractionDigits:6})}`:'Enter valid numbers.')});
$('calcB').addEventListener('click',()=>{const x=numberFrom('partX'),y=numberFrom('wholeY');showCalc('resultB',Number.isFinite(x)&&Number.isFinite(y)&&y!==0?`${(x/y*100).toLocaleString(undefined,{maximumFractionDigits:6})}%`:y===0?'Whole cannot be zero.':'Enter valid numbers.')});
$('calcC').addEventListener('click',()=>{const old=numberFrom('oldValue'),n=numberFrom('newValue');showCalc('resultC',Number.isFinite(old)&&Number.isFinite(n)&&old!==0?`${((n-old)/Math.abs(old)*100).toLocaleString(undefined,{maximumFractionDigits:6})}% ${n>=old?'increase':'decrease'}`:old===0?'Original value cannot be zero.':'Enter valid numbers.')});
