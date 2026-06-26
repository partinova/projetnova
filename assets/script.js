(function(){
  function setupMenu(){
    const toggle = document.querySelector('[data-menu-toggle]');
    const nav = document.querySelector('[data-main-nav]');
    const header = document.querySelector('[data-site-header]');

    if(!toggle || !nav) return;
    if(toggle.dataset.menuReady === 'true') return;
    toggle.dataset.menuReady = 'true';

    nav.id = nav.id || 'navigation-principale';
    toggle.setAttribute('aria-controls', nav.id);
    toggle.setAttribute('aria-expanded', nav.classList.contains('open') ? 'true' : 'false');

    function closeMenu(){
      nav.classList.remove('open');
      toggle.classList.remove('open');
      toggle.setAttribute('aria-expanded', 'false');
      document.body.classList.remove('menu-open');
    }

    function openMenu(){
      nav.classList.add('open');
      toggle.classList.add('open');
      toggle.setAttribute('aria-expanded', 'true');
      document.body.classList.add('menu-open');
    }

    toggle.addEventListener('click', function(event){
      event.preventDefault();
      event.stopPropagation();
      if(nav.classList.contains('open')) closeMenu();
      else openMenu();
    });

    nav.querySelectorAll('a').forEach(function(link){
      link.addEventListener('click', closeMenu);
    });

    document.addEventListener('click', function(event){
      if(!nav.classList.contains('open')) return;
      if(header && header.contains(event.target)) return;
      closeMenu();
    });

    document.addEventListener('keydown', function(event){
      if(event.key === 'Escape') closeMenu();
    });
  }

  function setupCopyButtons(){
    document.querySelectorAll('[data-copy]').forEach(function(btn){
      if(btn.dataset.copyReady === 'true') return;
      btn.dataset.copyReady = 'true';
      btn.addEventListener('click', async function(){
        try{
          await navigator.clipboard.writeText(btn.dataset.copy);
          const original = btn.dataset.originalText || btn.textContent;
          btn.dataset.originalText = original;
          btn.textContent = 'Copié';
          setTimeout(function(){ btn.textContent = original; }, 1600);
        }catch(e){
          btn.textContent = btn.dataset.copy;
        }
      });
    });
  }

  function setupFormspree(){
    document.querySelectorAll('form[data-formspree]').forEach(function(form){
      if(form.dataset.formReady === 'true') return;
      form.dataset.formReady = 'true';
      form.addEventListener('submit', async function(e){
        e.preventDefault();
        const status = form.querySelector('[data-form-status]');
        const data = new FormData(form);
        if(status) status.textContent = 'Envoi en cours...';
        try{
          const res = await fetch(form.action, {
            method: 'POST',
            body: data,
            headers: {'Accept':'application/json'}
          });
          if(res.ok){
            if(status) status.textContent = 'Message envoyé. Merci.';
            form.reset();
          }else{
            if(status) status.textContent = 'Erreur d’envoi. Utilisez le courriel direct.';
          }
        }catch(err){
          if(status) status.textContent = 'Erreur d’envoi. Utilisez le courriel direct.';
        }
      });
    });
  }

  function setupDocumentLibrary(){
    const library = document.querySelector('[data-document-library]');
    if(!library) return;

    const input = document.getElementById('docSearch');
    const chips = Array.from(document.querySelectorAll('[data-filter]'));
    const cards = Array.from(library.querySelectorAll('.library-card'));
    const counter = document.querySelector('[data-doc-count]');
    let filter = 'all';

    function apply(){
      const q = (input && input.value ? input.value : '').toLowerCase().trim();
      let visible = 0;
      cards.forEach(function(card){
        const okFilter = filter === 'all' || card.dataset.section === filter;
        const okSearch = !q || (card.dataset.search || '').includes(q);
        const show = okFilter && okSearch;
        card.style.display = show ? '' : 'none';
        if(show) visible++;
      });
      if(counter) counter.textContent = visible + ' document' + (visible > 1 ? 's' : '');
    }

    if(input) input.addEventListener('input', apply);
    chips.forEach(function(chip){
      chip.addEventListener('click', function(){
        chips.forEach(function(c){ c.classList.remove('active'); });
        chip.classList.add('active');
        filter = chip.dataset.filter;
        apply();
      });
    });
    apply();
  }

  function setupViewer(){
    const docDataEl = document.getElementById('docData');
    if(!docDataEl) return;

    let docs = {};
    try{
      docs = JSON.parse(docDataEl.textContent);
    }catch(e){
      return;
    }

    const select = document.getElementById('docSelect');
    const frame = document.getElementById('officeFrame');
    const name = document.getElementById('viewerName');
    const desc = document.getElementById('viewerDescription');
    const type = document.getElementById('viewerType');
    const dl = document.getElementById('downloadDoc');
    const dlPdf = document.getElementById('downloadPdf');
    const openNew = document.getElementById('openNew');
    const params = new URLSearchParams(location.search);
    const first = Object.keys(docs)[0];

    function absolute(path){
      return new URL(path, location.origin + location.pathname.replace(/[^\/]*$/,'')).href;
    }

    function load(slug){
      const d = docs[slug] || docs[first];
      if(!d) return;

      if(select) select.value = d.slug;
      const pdfUrl = d.pdf ? absolute(d.pdf) : '';
      const wordUrl = d.docx ? absolute(d.docx) : '';
      const wordViewer = wordUrl ? 'https://view.officeapps.live.com/op/embed.aspx?src=' + encodeURIComponent(wordUrl) : '';
      const viewer = pdfUrl || wordViewer;

      if(frame) frame.src = viewer;
      if(name) name.textContent = d.title || '';
      if(desc) desc.textContent = d.description || '';
      if(type) type.textContent = d.type || '';
      if(dl && d.docx) dl.href = d.docx;

      if(dlPdf){
        if(d.pdf){
          dlPdf.href = d.pdf;
          dlPdf.style.display = '';
        }else{
          dlPdf.style.display = 'none';
        }
      }

      if(openNew) openNew.href = viewer;
      if(history.replaceState && d.slug){
        history.replaceState(null, '', '?doc=' + encodeURIComponent(d.slug));
      }
    }

    if(select) select.addEventListener('change', function(){ load(select.value); });
    load(params.get('doc') || first);
  }

  function init(){
    setupMenu();
    setupCopyButtons();
    setupFormspree();
    setupDocumentLibrary();
    setupViewer();
  }

  if(document.readyState === 'loading'){
    document.addEventListener('DOMContentLoaded', init);
  }else{
    init();
  }
})();
