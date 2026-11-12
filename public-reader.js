import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
const supabase=createClient("https://ghwxobccbiwlicnffwuf.supabase.co","sb_publishable_Wqv0mRtqM42C9t5TfXQ1WQ_LCgQZNaB");
const slug=new URLSearchParams(location.search).get("slug");
if(slug){
 const root=document.querySelector("#readingArticle");
 const esc=s=>String(s??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
 const {data,error}=await supabase.from("articles").select("category,title,excerpt,content,cover_image_url,status,published_at").eq("slug",slug).eq("status","published").maybeSingle();
 if(error||!data){root.innerHTML='<div class="reading-empty"><h1>Dossier introuvable</h1><p>Ce dossier n’est pas disponible ou n’est pas publié.</p><a class="btn btn-gold" href="index.html#articles">Retour aux dossiers</a></div>';}
 else{
  document.title=data.title+" — Au-delà de l’Histoire";
  document.querySelector("#readingCategory").textContent=data.category;
  const paragraphs=data.content.split(/\\n\\s*\\n/).filter(Boolean).map(p=>'<p>'+esc(p).replace(/\\n/g,"<br>")+'</p>').join("");
  root.innerHTML='<span class="kicker">'+esc(data.category)+'</span><p class="reading-status">Publié</p><h1>'+esc(data.title)+'</h1><p class="reading-lead">'+esc(data.excerpt)+'</p>'+(data.cover_image_url?'<img src="'+esc(data.cover_image_url)+'" alt="Illustration de '+esc(data.title)+'" style="width:100%;height:auto;margin:24px 0">':'')+'<div class="reading-rule"></div><section>'+paragraphs+'</section><div class="reading-rule"></div><p class="reading-note">Dossier publié par la rédaction de Au-delà de l’Histoire.</p><button class="share-button" id="sharePublished">Partager ce dossier ↗</button>';
  document.querySelector("#sharePublished").addEventListener("click",async()=>{try{if(navigator.share)await navigator.share({title:data.title,text:data.excerpt,url:location.href});else{await navigator.clipboard.writeText(location.href);document.querySelector("#sharePublished").textContent="Lien copié ✓";}}catch(e){}});
 }
}
