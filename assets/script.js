
(function(){
  const toggle=document.querySelector('[data-menu-toggle]');
  const nav=document.querySelector('[data-main-nav]');
  if(toggle&&nav){toggle.addEventListener('click',()=>{const open=nav.classList.toggle('open');toggle.setAttribute('aria-expanded',open?'true':'false');});}
  document.querySelectorAll('[data-copy]').forEach(btn=>btn.addEventListener('click',async()=>{try{await navigator.clipboard.writeText(btn.dataset.copy);btn.textContent='Copié';setTimeout(()=>btn.textContent='Copier le courriel',1600)}catch(e){btn.textContent=btn.dataset.copy}}));
  document.querySelectorAll('form[data-formspree]').forEach(form=>{form.addEventListener('submit',async(e)=>{e.preventDefault();const status=form.querySelector('[data-form-status]');const data=new FormData(form);if(status) status.textContent='Envoi en cours...';try{const res=await fetch(form.action,{method:'POST',body:data,headers:{'Accept':'application/json'}});if(res.ok){if(status) status.textContent='Message envoyé. Merci.';form.reset();}else{if(status) status.textContent='Erreur d’envoi. Utilisez le courriel direct.';}}catch(err){if(status) status.textContent='Erreur d’envoi. Utilisez le courriel direct.';}})});
  const library=document.querySelector('[data-document-library]');
  if(library){
    const input=document.getElementById('docSearch');
    const chips=[...document.querySelectorAll('[data-filter]')];
    const cards=[...library.querySelectorAll('.library-card')];
    const counter=document.querySelector('[data-doc-count]');
    let filter='all';
    function apply(){const q=(input?.value||'').toLowerCase().trim();let visible=0;cards.forEach(card=>{const okFilter=filter==='all'||card.dataset.section===filter;const okSearch=!q||(card.dataset.search||'').includes(q);const show=okFilter&&okSearch;card.style.display=show?'':'none';if(show) visible++;});if(counter) counter.textContent=visible+' document'+(visible>1?'s':'')+' Word';}
    input&&input.addEventListener('input',apply);
    chips.forEach(chip=>chip.addEventListener('click',()=>{chips.forEach(c=>c.classList.remove('active'));chip.classList.add('active');filter=chip.dataset.filter;apply();}));
  }
  const docDataEl=document.getElementById('docData');
  if(docDataEl){
    const docs=JSON.parse(docDataEl.textContent);
    const select=document.getElementById('docSelect');
    const frame=document.getElementById('officeFrame');
    const name=document.getElementById('viewerName');
    const desc=document.getElementById('viewerDescription');
    const type=document.getElementById('viewerType');
    const dl=document.getElementById('downloadDoc');
    const openNew=document.getElementById('openNew');
    const params=new URLSearchParams(location.search);
    const first=Object.keys(docs)[0];
    function absolute(path){return new URL(path, location.origin + location.pathname.replace(/[^\/]*$/,'')).href;}
    function load(slug){const d=docs[slug]||docs[first]; if(!d) return; if(select) select.value=d.slug; const fileUrl=absolute(d.docx); const viewer='https://view.officeapps.live.com/op/embed.aspx?src='+encodeURIComponent(fileUrl); if(frame) frame.src=viewer; if(name) name.textContent=d.title; if(desc) desc.textContent=d.description; if(type) type.textContent=d.type; if(dl) dl.href=d.docx; if(openNew) openNew.href=viewer; if(history.replaceState) history.replaceState(null,'','?doc='+encodeURIComponent(d.slug));}
    select&&select.addEventListener('change',()=>load(select.value));
    load(params.get('doc')||first);
  }
})();
