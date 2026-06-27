(function(){
  function ready(fn){document.readyState !== 'loading' ? fn() : document.addEventListener('DOMContentLoaded', fn);}
  ready(function(){
    const page = document.body.getAttribute('data-page') || '';
    document.querySelectorAll('.main-nav .nav-link').forEach(link=>{
      const href = link.getAttribute('href') || '';
      if(href === page || (page === 'index.html' && href === 'index.html')) link.classList.add('active');
    });
    const toggle = document.querySelector('[data-menu-toggle]');
    const nav = document.querySelector('[data-main-nav]');
    if(toggle && nav){
      toggle.addEventListener('click', function(){
        const open = nav.classList.toggle('open');
        toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
      });
    }

    const listEl = document.querySelector('[data-doc-list]');
    if(listEl && Array.isArray(window.NOVA_DOCUMENTS)){
      const docs = window.NOVA_DOCUMENTS.slice();
      const searchEl = document.querySelector('[data-doc-search]');
      const filterEl = document.querySelector('[data-doc-filter]');
      const sections = [...new Set(docs.map(d=>d.section))];
      if(filterEl){
        const existing = filterEl.innerHTML.trim();
        if(!existing.includes('Toutes les sections')) filterEl.innerHTML = '<option value="">Toutes les sections</option>';
        sections.forEach(section=>{
          const option = document.createElement('option');
          option.value = section;
          option.textContent = section;
          filterEl.appendChild(option);
        });
      }
      function card(d){
        return `
          <article class="doc-card">
            <span class="pill">${d.section}</span>
            <h3>${d.title}</h3>
            <p>${d.description}</p>
            <div class="card-actions">
              <a class="btn btn-primary" href="visionneuse.html?doc=${encodeURIComponent(d.id)}">Visionner sur le site</a>
              <a class="btn btn-outline" href="${d.path}" download> Télécharger le PDF </a>
            </div>
          </article>`;
      }
      function render(){
        const term = ((searchEl && searchEl.value) || '').toLowerCase().trim();
        const filter = (filterEl && filterEl.value) || '';
        const filtered = docs.filter(d=>{
          const hay = [d.order,d.title,d.section,d.description].join(' ').toLowerCase();
          return (!term || hay.includes(term)) && (!filter || d.section === filter);
        });
        listEl.innerHTML = filtered.length ? filtered.map(card).join('') : '<article class="doc-card"><h3>Aucun résultat</h3><p>Aucun document ne correspond à votre recherche. Modifiez les filtres ou effacez la recherche.</p></article>';
      }
      if(searchEl) searchEl.addEventListener('input', render);
      if(filterEl) filterEl.addEventListener('change', render);
      render();
    }
  });
})();
