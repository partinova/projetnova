const menuButton = document.querySelector('[data-menu]');
const nav = document.querySelector('[data-nav]');
if(menuButton && nav){
  menuButton.addEventListener('click', () => {
    const open = nav.classList.toggle('open');
    menuButton.setAttribute('aria-expanded', String(open));
  });
}

const search = document.getElementById('docSearch');
const filterButtons = document.querySelectorAll('[data-filter]');
function applyDocFilters(){
  const q = (search?.value || '').toLowerCase().trim();
  const active = document.querySelector('[data-filter].active')?.dataset.filter || 'all';
  document.querySelectorAll('[data-doc-card]').forEach(card => {
    const okText = !q || card.dataset.search.includes(q);
    const okSection = active === 'all' || card.dataset.section === active;
    card.classList.toggle('hidden', !(okText && okSection));
  });
  document.querySelectorAll('.doc-section').forEach(sec => {
    const visible = sec.querySelectorAll('[data-doc-card]:not(.hidden)').length;
    sec.classList.toggle('hidden', visible === 0);
  });
}
if(search){ search.addEventListener('input', applyDocFilters); }
filterButtons.forEach(btn => btn.addEventListener('click', () => {
  filterButtons.forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  applyDocFilters();
}));

document.querySelectorAll('[data-copy]').forEach(btn => {
  btn.addEventListener('click', async () => {
    try { await navigator.clipboard.writeText(btn.dataset.copy); btn.textContent = 'Copié'; setTimeout(()=>btn.textContent='Copier le courriel',1800); }
    catch(e){ window.prompt('Copier le courriel :', btn.dataset.copy); }
  });
});

document.querySelectorAll('form[data-formspree]').forEach(form => {
  form.addEventListener('submit', async event => {
    event.preventDefault();
    const status = form.querySelector('[data-form-status]');
    const submit = form.querySelector('button[type="submit"]');
    if(status){ status.className='form-status'; status.textContent=''; }
    if(submit){ submit.disabled = true; submit.textContent = 'Envoi…'; }
    try{
      const response = await fetch(form.action, { method:'POST', body:new FormData(form), headers:{Accept:'application/json'} });
      if(response.ok){ form.reset(); if(status){ status.className='form-status ok'; status.textContent='Message envoyé. Merci.'; } }
      else { if(status){ status.className='form-status err'; status.textContent='L’envoi n’a pas été accepté. Utilisez le bouton courriel.'; } }
    }catch(e){ if(status){ status.className='form-status err'; status.textContent='Erreur de connexion. Utilisez le bouton courriel.'; } }
    finally{ if(submit){ submit.disabled=false; submit.textContent='Envoyer le message'; } }
  });
});

(function initViewer(){
  if(!window.NOVA_DOCS) return;
  const params = new URLSearchParams(location.search);
  const key = params.get('doc') || 'systeme-nova';
  const doc = window.NOVA_DOCS[key];
  const version = window.NOVA_VERSION || '20260622';
  const title = document.getElementById('docTitle');
  const desc = document.getElementById('docDescription');
  const toolbar = document.getElementById('toolbarTitle');
  const tags = document.getElementById('docTags');
  const frame = document.getElementById('docFrame');
  const open = document.getElementById('openDocx');
  const download = document.getElementById('downloadDocx');
  if(!doc){
    if(title) title.textContent='Document introuvable';
    if(desc) desc.textContent='Le document demandé n’existe pas ou n’est plus publié.';
    return;
  }
  document.title = doc.title + ' — Projet Nova';
  if(title) title.textContent = doc.title;
  if(desc) desc.textContent = doc.description;
  if(toolbar) toolbar.textContent = doc.title;
  if(tags) tags.innerHTML = (doc.tags || []).map(t => `<span class="tag">${String(t).replace(/[&<>"]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]))}</span>`).join('');
  const localHref = `${doc.docx}?v=${version}`;
  if(open) open.href = localHref;
  if(download) download.href = localHref;
  const siteBase = window.NOVA_SITE_BASE || (location.origin + location.pathname.replace(/[^/]*$/, ''));
  const absoluteUrl = new URL(localHref, siteBase).href;
  if(frame) frame.src = 'https://view.officeapps.live.com/op/embed.aspx?src=' + encodeURIComponent(absoluteUrl);
})();