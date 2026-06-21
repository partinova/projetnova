
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
