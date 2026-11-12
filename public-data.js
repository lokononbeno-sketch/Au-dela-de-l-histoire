import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
const supabase=createClient("https://ghwxobccbiwlicnffwuf.supabase.co","sb_publishable_Wqv0mRtqM42C9t5TfXQ1WQ_LCgQZNaB");
const grid=document.querySelector("#articleGrid");
const searchForm=document.querySelector("#searchForm"),searchInput=document.querySelector("#searchInput"),results=document.querySelector("#searchResults");
const esc=s=>String(s??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
let published=[];
function render(list){if(!grid)return;grid.innerHTML=list.map(a=>'<article class="article-card"><div class="article-art" '+(a.cover_image_url?'style="background:linear-gradient(#102f2440,#102f2440),url(\''+esc(a.cover_image_url)+'\') center/cover"':'')+'><span>'+esc(a.category)+'</span></div><div class="article-body"><span class="article-meta">'+esc(a.category)+' · Publié</span><h3>'+esc(a.title)+'</h3><p>'+esc(a.excerpt)+'</p><a class="read-more" href="article.html?slug='+encodeURIComponent(a.slug)+'">Lire le dossier ↗</a></div></article>').join("");}
const {data,error}=await supabase.from("articles").select("id,category,slug,title,excerpt,cover_image_url,published_at").eq("status","published").order("published_at",{ascending:false});
if(!error&&data?.length){published=data;render(published);}
if(searchForm){searchForm.addEventListener("submit",e=>{e.preventDefault();search();});searchInput.addEventListener("input",search);}
function search(){const q=searchInput.value.trim().toLocaleLowerCase("fr");if(!q){results.innerHTML="";return;}const matches=published.filter(a=>(a.title+" "+a.excerpt+" "+a.category).toLocaleLowerCase("fr").includes(q));results.innerHTML=matches.length?matches.map(a=>'<a class="result-item" href="article.html?slug='+encodeURIComponent(a.slug)+'"><strong>'+esc(a.title)+'</strong><br><small>'+esc(a.category)+'</small></a>').join(""):'<div class="result-item">Aucun dossier publié ne correspond à cette recherche.</div>';}
