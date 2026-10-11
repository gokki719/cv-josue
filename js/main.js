/* Comportamiento del CV: modal de insignias */
document.getElementById('modalInsignia').addEventListener('show.bs.modal',function(e){
  var b=e.relatedTarget; if(!b) return;
  var im=document.getElementById('imgInsignia');
  im.src=b.getAttribute('data-img'); im.alt=b.getAttribute('data-titulo');
  document.getElementById('tituloInsignia').textContent=b.getAttribute('data-titulo');
});
