
const menu=document.querySelector('[data-menu]');const nav=document.querySelector('[data-nav]');
if(menu&&nav){menu.addEventListener('click',()=>{const open=nav.classList.toggle('open');menu.setAttribute('aria-expanded',open?'true':'false');});}
const rev=[...document.querySelectorAll('.reveal')];
if('IntersectionObserver' in window){const io=new IntersectionObserver((entries)=>{entries.forEach(e=>{if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target);}})},{threshold:.12});rev.forEach(el=>io.observe(el));}else{rev.forEach(el=>el.classList.add('in'));}
document.querySelectorAll('[data-copy]').forEach(btn=>{btn.addEventListener('click',async()=>{const value=btn.getAttribute('data-copy');try{await navigator.clipboard.writeText(value);const old=btn.textContent;btn.textContent='Courriel copié';setTimeout(()=>btn.textContent=old,1700);}catch(e){window.prompt('Copiez le courriel officiel :', value);}});});

document.querySelectorAll('form[data-formspree]').forEach(form=>{
  const status=form.querySelector('[data-status]');
  form.addEventListener('submit', async (event)=>{
    if(!window.fetch) return;
    event.preventDefault();
    const submit=form.querySelector('button[type="submit"]');
    const old=submit?submit.textContent:'';
    if(submit){submit.disabled=true;submit.textContent='Envoi en cours…';}
    if(status){status.textContent='Transmission sécurisée du message…';}
    try{
      const res=await fetch(form.action,{method:'POST',body:new FormData(form),headers:{'Accept':'application/json'}});
      if(res.ok){window.location.href='merci.html';return;}
      if(status){status.textContent="Le message n'a pas pu être envoyé. Utilisez le bouton Gmail ou réessayez.";}
    }catch(e){if(status){status.textContent="Connexion impossible. Utilisez le bouton Gmail ou réessayez.";}}
    if(submit){submit.disabled=false;submit.textContent=old;}
  });
});


// Registre public des propositions citoyennes validées
(function(){
  const mount=document.querySelector('[data-propositions]');
  if(!mount) return;
  const search=document.getElementById('proposal-search');
  const filter=document.getElementById('proposal-filter');
  let proposals=[];
  const esc=(s)=>String(s||'').replace(/[&<>"]/g,(c)=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
  function render(){
    const q=(search?.value||'').trim().toLowerCase();
    const cat=(filter?.value||'').trim();
    const list=proposals.filter(p=>{
      const blob=[p.date,p.nom,p.region,p.categorie,p.titre,p.message,p.statut].join(' ').toLowerCase();
      return (!q || blob.includes(q)) && (!cat || p.categorie===cat);
    });
    if(!list.length){mount.innerHTML='<div class="empty-state">Aucune proposition publique validée ne correspond à cette recherche.</div>';return;}
    mount.innerHTML=list.map(p=>`<article class="proposal-card reveal in"><div class="proposal-head"><h3 class="proposal-title">${esc(p.titre)}</h3><span class="status-pill">${esc(p.statut||'À analyser')}</span></div><div class="proposal-meta"><span>${esc(p.categorie)}</span><span>${esc(p.region)}</span><span>${esc(p.date)}</span><span>${esc(p.nom)}</span></div><p class="proposal-message">${esc(p.message)}</p></article>`).join('');
  }
  fetch('data/propositions-publiques.json',{cache:'no-store'}).then(r=>r.ok?r.json():[]).then(data=>{
    proposals=Array.isArray(data)?data:[];
    const cats=[...new Set(proposals.map(p=>p.categorie).filter(Boolean))].sort();
    if(filter){cats.forEach(c=>{const o=document.createElement('option');o.value=c;o.textContent=c;filter.appendChild(o);});}
    render();
  }).catch(()=>{mount.innerHTML='<div class="empty-state">Le registre public n’a pas pu être chargé pour le moment.</div>';});
  search?.addEventListener('input',render);
  filter?.addEventListener('change',render);
})();
