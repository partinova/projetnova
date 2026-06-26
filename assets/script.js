
(function(){
  const toggle=document.querySelector('[data-menu-toggle]');
  const nav=document.querySelector('[data-main-nav]');
  if(toggle&&nav){toggle.addEventListener('click',()=>{const open=nav.classList.toggle('open');toggle.setAttribute('aria-expanded',String(open));});}
  const page=document.body.getAttribute('data-page')||'';
  document.querySelectorAll('.nav-link').forEach(a=>{if(a.getAttribute('href')===page)a.classList.add('active');});
  const search=document.querySelector('[data-doc-search]');
  const filter=document.querySelector('[data-doc-filter]');
  const list=document.querySelector('[data-doc-list]');
  if(list && window.NOVA_DOCUMENTS){
    const docs=window.NOVA_DOCUMENTS;
    const sections=[...new Set(docs.map(d=>d.section))].sort();
    if(filter){ filter.innerHTML='<option value="">Toutes les sections</option>'+sections.map(s=>`<option>${s}</option>`).join(''); }
    function render(){
      const q=(search&&search.value||'').toLowerCase();
      const sec=(filter&&filter.value||'');
      const filtered=docs.filter(d=>(!sec||d.section===sec)&&(`${d.title} ${d.desc} ${d.section}`.toLowerCase().includes(q)));
      list.innerHTML=filtered.map(d=>`<article class="doc-card"><span class="pill">${d.section}</span><h3>${d.title}</h3><p>${d.desc}</p><div class="card-actions"><a class="btn btn-primary" href="visionneuse.html?doc=${encodeURIComponent(d.id)}">Visionner sur le site</a><a class="btn btn-outline" href="${d.path}" download>Télécharger le PDF</a></div></article>`).join('') || '<p class="muted">Aucun document trouvé.</p>';
    }
    search&&search.addEventListener('input',render); filter&&filter.addEventListener('change',render); render();
  }
})();
