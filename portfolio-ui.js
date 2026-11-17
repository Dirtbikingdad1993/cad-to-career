/* Opt-in case studies. Verification labels always come from the portfolio service. */
(function () {
'use strict';
const esc = value => String(value == null ? '' : value).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
let imageUrls = [];
function clearImages(){ imageUrls.forEach(URL.revokeObjectURL); imageUrls = []; }
window.addEventListener('hashchange', clearImages);
function when(value){const d=new Date(value);return Number.isNaN(d.getTime())?'Date unavailable':d.toLocaleDateString();}
function status(sub){ if(sub.verification?.kind==='geometry'&&!sub.verification.evidence)return 'Earlier check — run again to share'; return sub.verification ? sub.verification.label + ' · ' + sub.verification.score + '/100' :
  ({needs_review:'Needs human review',changes_requested:'Changes requested',rejected:'Not approved',approved:'Approval requires verification'}[sub.status] || 'Not verified'); }
function shareUrl(id){return location.origin + '/#/portfolio/' + encodeURIComponent(id);}
function geometryMarkup(check){
 const evidence=check?.evidence, shapes=evidence?.snapshot?.shapes;
 if(!Array.isArray(shapes)||shapes.length!==5)return '';
 const rect=shapes.find(s=>s.type==='rect'), circles=shapes.filter(s=>s.type==='circle');
 const nums=shape=>['x','y',...(shape.type==='rect'?['w','h']:['d'])].every(k=>typeof shape[k]==='number'&&Number.isFinite(shape[k])&&Math.abs(shape[k])<1000);
 if(!rect||circles.length!==4||!shapes.every(nums))return '';
 const r=rect, holes=circles.map(c=>'<circle cx="'+c.x+'" cy="'+(70-c.y)+'" r="'+(c.d/2)+'"></circle>').join('');
 return '<figure class="geometry-preview"><figcaption><strong>Saved checked geometry</strong> · millimeters</figcaption><svg role="img" aria-label="A rectangular mounting plate with four checked circular holes" viewBox="-8 -8 136 86"><rect x="'+r.x+'" y="'+(70-r.y-r.h)+'" width="'+r.w+'" height="'+r.h+'"></rect>'+holes+'</svg><p>Plate '+esc(r.w)+' × '+esc(r.h)+' mm; hole diameters '+circles.map(c=>esc(c.d)).join(', ')+' mm.</p><p class="smalltext">Evidence SHA-256: <code>'+esc(evidence.sha256)+'</code></p></figure>';
}

function renderEditor(target){
 target.innerHTML='<div class="panel"><p>Loading your private portfolio…</p></div>';
 if(!window.CAD_CLOUD || !CAD_CLOUD.currentUser()){target.innerHTML='<div class="notice">Sign in to create a private portfolio and choose what to share.</div>';return;}
 const owner=CAD_CLOUD.currentUser().id;
 async function load(){
  try{
   const data=await CAD_CLOUD.portfolioLoad();
   if(!target.isConnected || CAD_CLOUD.currentUser()?.id!==owner)return;
   const profile=data.profile||{}, entries=data.entries||[], submissions=data.submissions||[];
   const link=profile.public_id?shareUrl(profile.public_id):'';
   target.innerHTML='<section class="panel portfolio-profile"><div class="eyebrow">YOUR PUBLIC PAGE</div><h2>Tell the story behind your work</h2><p>Your page starts private. You choose each project and image to share. Only projects with a matching server check or independent reviewer approval can appear publicly.</p><form id="portfolioProfileForm" class="stack"><label class="field">Display name<input name="displayName" required minlength="2" maxlength="80" value="'+esc(profile.display_name||'')+'" placeholder="Name you want visitors to see"></label><label class="field">Headline <span class="muted">optional</span><input name="headline" maxlength="120" value="'+esc(profile.headline||'')+'" placeholder="e.g. CAD learner and product designer"></label><label class="field">About your work <span class="muted">optional</span><textarea name="bio" maxlength="2000" placeholder="What do you enjoy designing?">'+esc(profile.bio||'')+'</textarea></label><label class="option"><input type="checkbox" name="isPublic" '+(profile.is_public?'checked':'')+'> Make my portfolio accessible to anyone with the link</label><div class="actions"><button class="btn primary" type="submit">Save portfolio settings</button></div><div role="status" class="portfolioResult"></div></form>'+(link?'<div class="portfolio-share"><label class="field">Your share link<input id="portfolioShareLink" readonly value="'+esc(link)+'"></label><div class="actions"><a class="btn small" href="'+esc(link)+'" target="_blank" rel="noopener noreferrer">Open public page ↗</a><button class="btn small" id="copyPortfolioLink" type="button">Copy link</button><button class="btn small" id="rotatePortfolioLink" type="button">Replace link</button></div><p class="smalltext muted">'+(profile.is_public?'Anyone with this link can view your selected projects.':'Your page is private; this link will not open publicly until you enable sharing.')+' Replacing the link disables the old one.</p></div>':'<p class="smalltext muted">Save your settings to create a share link.</p>')+'</section><div class="sectionhead"><div><div class="eyebrow">YOUR CASE STUDIES</div><h2>Choose which work to show</h2><p class="muted smalltext">Add a description and design process. Review status comes from assessment records, never from your own text.</p></div></div>'+(submissions.length?'<div class="list">'+submissions.map(function(sub){
    const entry=entries.find(e=>e.submission_id===sub.id)||{}, canShare=Boolean(sub.verification && (sub.verification.kind!=='geometry' || sub.verification.evidence)), checked=Boolean(entry.is_public && canShare);
    const covers=sub.covers||[];
    return '<details class="panel portfolio-entry"><summary><span><strong>Project '+Number(sub.projectNumber)+'</strong> <span class="badge '+(canShare?'done':'pending')+'">'+esc(status(sub))+'</span></span><span class="smalltext muted">Submitted '+esc(when(sub.submittedAt))+'</span></summary><form class="portfolioEntryForm stack" data-submission="'+esc(sub.id)+'"><label class="field">Case study title<input name="title" maxlength="100" required value="'+esc(entry.title||('Project '+sub.projectNumber))+'"></label><label class="field">What did you design?<textarea name="summary" maxlength="1200" placeholder="Describe the problem and your solution">'+esc(entry.summary||'')+'</textarea></label><label class="field">How did you design it?<textarea name="process" maxlength="1200" placeholder="Explain dimensions, design choices, challenges, and what you learned">'+esc(entry.design_process||'')+'</textarea></label><label class="field">Tools used<input name="tools" maxlength="150" value="'+esc(entry.tools||'')+'" placeholder="e.g. FreeCAD, LibreCAD"></label><label class="field">Optional public image<select name="coverPath"><option value="">No image</option>'+covers.map(c=>'<option value="'+esc(c.path)+'" '+(entry.cover_path===c.path?'selected':'')+'>'+esc(c.name)+'</option>').join('')+'</select></label><p class="smalltext muted">Only PNG or JPEG evidence up to 5 MB can be shared. An image you select becomes public when this project and page are shared, including any metadata embedded in the image. Original CAD files and reviewer comments stay private.</p><label class="option"><input type="checkbox" name="isPublic" '+(checked?'checked':'')+' '+(!canShare?'disabled':'')+'> Show this project on my public portfolio</label>'+(sub.projectNumber===1&&sub.verification?(sub.verification.evidence?'<div class="notice">If you share this case study, its saved measured geometry will also be visible on your public page.</div>':'<div class="notice warning">This older result did not preserve the drawing. Run the geometry check again to save a new evidence record.</div>'):'')+(sub.verification?'<p class="smalltext muted">'+esc(sub.verification.scope)+'</p>':'<div class="notice warning">You can save a private draft now. This submission needs a qualifying check or independent approval before it can be shared.</div>')+'<div class="actions"><button class="btn primary" type="submit">Save case study</button>'+(entry.submission_id?'<button class="btn" type="button" data-remove-entry="'+esc(sub.id)+'">Remove case study</button>':'')+'<a class="btn" href="#/projects/'+Number(sub.projectNumber)+'">Open project</a></div><div class="portfolioResult" role="status"></div></form></details>';
   }).join('')+'</div>':'<div class="notice">No submissions yet. Open a project to start; the server-checked plate and submitted advanced projects will appear here.</div>');
  }catch(error){if(target.isConnected)target.innerHTML='<div class="notice warning">Could not load your portfolio: '+esc(error.message)+'</div>';}
 }
 target.addEventListener('submit',async function(event){
  const form=event.target;if(form.id!=='portfolioProfileForm'&&!form.classList.contains('portfolioEntryForm'))return;
  event.preventDefault();const button=form.querySelector('button[type="submit"]'),out=form.querySelector('.portfolioResult'),fd=new FormData(form);
  button.disabled=true;out.textContent='Saving…';
  try{
   if(form.id==='portfolioProfileForm')await CAD_CLOUD.portfolioSaveProfile({displayName:String(fd.get('displayName')||''),headline:String(fd.get('headline')||''),bio:String(fd.get('bio')||''),isPublic:fd.has('isPublic')});
   else await CAD_CLOUD.portfolioSaveEntry({submissionId:form.dataset.submission,title:String(fd.get('title')||''),summary:String(fd.get('summary')||''),process:String(fd.get('process')||''),tools:String(fd.get('tools')||''),coverPath:String(fd.get('coverPath')||''),isPublic:fd.has('isPublic')});
   await load();
  }catch(error){out.textContent=error.message||'Could not save.';button.disabled=false;}
 });
 target.addEventListener('click',async function(event){
  const button=event.target.closest('button');if(!button)return;
  if(button.id==='copyPortfolioLink'){
   try{await navigator.clipboard.writeText(target.querySelector('#portfolioShareLink').value);button.textContent='Copied';}catch(_){const input=target.querySelector('#portfolioShareLink');input.focus();input.select();button.textContent='Select and copy link';}
  }else if(button.id==='rotatePortfolioLink'){
   if(!confirm('Replace this link? The old link will stop working.'))return;
   button.disabled=true;try{await CAD_CLOUD.portfolioRotateLink();await load()}catch(e){button.disabled=false;alert(e.message)}
  }else if(button.hasAttribute('data-remove-entry')){
   if(!confirm('Remove this case study? Your submission and review will remain.'))return;
   button.disabled=true;try{await CAD_CLOUD.portfolioDeleteEntry(button.dataset.removeEntry);await load()}catch(e){button.disabled=false;alert(e.message)}
  }
 });
 load();
}
function renderPublic(target,id){
 clearImages();target.innerHTML='<div class="panel">Loading shared portfolio…</div>';
 CAD_CLOUD.portfolioPublic(id).then(async function(data){
  if(!target.isConnected)return;
  const profile=data.profile, projects=data.projects||[];
  target.innerHTML='<section class="hero portfolio-hero"><div class="eyebrow">CAD TO CAREER · SHARED PORTFOLIO</div><h1>'+esc(profile.displayName)+'</h1>'+(profile.headline?'<p>'+esc(profile.headline)+'</p>':'')+(profile.bio?'<p class="portfolio-text">'+esc(profile.bio)+'</p>':'')+'</section><p class="notice">Verification describes the specific check shown on each project. Case-study descriptions are written by the learner; this page does not prove authorship or guarantee professional qualifications.</p><div class="grid two">'+(projects.length?projects.map(p=>'<article class="panel portfolio-public-card">'+(p.hasCover?'<div class="portfolio-image-wrap"><img data-cover="'+esc(p.id)+'" alt="Selected image for '+esc(p.title)+'"></div>':'')+'<div class="row between"><span class="badge">Project '+Number(p.projectNumber)+'</span><span class="badge done">'+esc(p.verification.label)+'</span></div><h2>'+esc(p.title)+'</h2>'+(p.summary?'<p class="portfolio-text">'+esc(p.summary)+'</p>':'')+(p.process?'<h3>Design process</h3><p class="portfolio-text">'+esc(p.process)+'</p>':'')+(p.tools?'<p><strong>Tools:</strong> '+esc(p.tools)+'</p>':'')+geometryMarkup(p.verification)+'<div class="notice"><strong>'+esc(p.verification.score)+'/100</strong> · '+esc(when(p.verification.date))+'<br>'+esc(p.verification.scope)+'</div></article>').join(''):'<div class="notice">No verified projects have been shared yet.</div>')+'</div>';
  await Promise.all(projects.filter(p=>p.hasCover).map(async function(p){try{
   const blob=await CAD_CLOUD.portfolioCover(id,p.id); if(!target.isConnected)return;
   const image=target.querySelector('img[data-cover="'+p.id+'"]');if(!image)return;
   const url=URL.createObjectURL(blob);imageUrls.push(url);image.src=url;
  }catch(_){const image=target.querySelector('img[data-cover="'+p.id+'"]');if(image)image.closest('.portfolio-image-wrap').remove();}}));
 }).catch(function(error){if(target.isConnected)target.innerHTML='<div class="notice warning">'+esc(error.status===404?'This portfolio is private, unavailable, or the link has changed.':'The portfolio is temporarily unavailable. Please try again.')+'</div>';});
}
window.CAD_PORTFOLIO={renderEditor,renderPublic};
})();
