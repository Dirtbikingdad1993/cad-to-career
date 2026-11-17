export const isUuid = value => typeof value === 'string' && /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(value);

// The learner cannot set a badge. Project 1 records have a bounded, versioned
// snapshot and a digest, or are clearly identified as legacy results.
async function readGeometryEvidence(notes) {
  try {
    const record = JSON.parse(notes);
    if (record.kind !== 'geometry-evidence-v1' || record.validator !== 'foundations-v1' ||
        typeof record.snapshot !== 'string' || record.snapshot.length > 2048 || !/^[0-9a-f]{64}$/.test(record.sha256 || '')) return null;
    const digest = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(record.snapshot));
    const actual = Array.from(new Uint8Array(digest), x => x.toString(16).padStart(2,'0')).join('');
    if (actual !== record.sha256) return null;
    const parsed = JSON.parse(record.snapshot);
    if (parsed.format !== 'cad-plate-v1' || parsed.units !== 'mm' || !Array.isArray(parsed.shapes) || parsed.shapes.length !== 5) return null;
    const rectangles=parsed.shapes.filter(s=>s?.type==='rect'), circles=parsed.shapes.filter(s=>s?.type==='circle');
    if(rectangles.length!==1 || circles.length!==4)return null;
    const close=(a,b,t)=>typeof a==='number' && Number.isFinite(a) && Math.abs(a-b)<=t+1e-9;
    const r=rectangles[0];
    if(!close(r.x,0,.25)||!close(r.y,0,.25)||!close(r.w,120,.25)||!close(r.h,70,.25))return null;
    const used=new Set();
    for(const [x,y] of [[15,15],[105,15],[15,55],[105,55]]){
      const i=circles.findIndex((c,n)=>!used.has(n)&&close(c.x,x,.25)&&close(c.y,y,.25)&&close(c.d,8,.15));
      if(i<0)return null;used.add(i);
    }
    const shapes=parsed.shapes.map(s=>s.type==='rect'?{type:'rect',x:s.x,y:s.y,w:s.w,h:s.h}:{type:'circle',x:s.x,y:s.y,d:s.d});
    return {validator:record.validator,sha256:record.sha256,snapshot:{format:'cad-plate-v1',units:'mm',shapes}};
  } catch (_) { return null; }
}
export async function verification(submission, reviews) {
  if (!submission || submission.status !== 'approved' || !Number.isInteger(submission.score)) return null;
  if (submission.project_id === 1 && submission.score === 100 && !submission.reviewer_id) {
    const base={kind:'geometry',score:100,date:submission.submitted_at,label:'Automated geometry check passed'};
    if(submission.submitted_notes === 'Server-validated precision mounting plate · foundations-v1')
      return {...base,scope:'Legacy result: the server checked dimensions, but this record did not retain the drawing. Authorship was not independently verified.',evidence:null};
    const evidence=await readGeometryEvidence(submission.submitted_notes);
    if(!evidence)return null;
    return {...base,scope:'Server checked and retained these dimensions. Authorship and the complete drawing were not independently verified.',evidence};
  }
  if (submission.project_id < 2 || submission.project_id > 5 || !submission.reviewer_id ||
      submission.reviewer_id === submission.user_id || submission.score < (submission.project_id === 5 ? 85 : 80)) return null;
  const review = reviews.find(r => r.submission_id === submission.id && r.reviewer_id === submission.reviewer_id &&
    r.reviewer_id !== submission.user_id && r.verdict === 'approved' && r.score === submission.score);
  if (!review) return null;
  return { kind: 'human', score: submission.score, date: review.reviewed_at,
    label: 'Approved by a human reviewer',
    scope: 'An authorized reviewer approved this submission against the project rubric. The learner wrote the case study.' };
}

export function imageChoices(submission) {
  if (!submission || !isUuid(submission.user_id) || !isUuid(submission.id)) return [];
  // Evidence paths are learner-submitted data, not proof of ownership. Accept
  // only the exact three-segment path produced by uploadEvidence; this prevents
  // dot-segment traversal or encoded separators when the service reads storage.
  const filename = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}-[a-z0-9._-]{1,100}\.(png|jpe?g)$/i;
  return (Array.isArray(submission.evidence_paths) ? submission.evidence_paths : [])
    .filter(path => {
      if (typeof path !== 'string' || path.length > 500) return false;
      const parts = path.split('/');
      return parts.length === 3 && parts[0] === submission.user_id && parts[1] === submission.id && filename.test(parts[2]);
    })
    .map(path => ({path, name: path.slice(path.lastIndexOf('/') + 1).replace(/^[0-9a-f-]{36}-/i, '')}));
}

export async function publicProject(entry, submission, reviews) {
  const check = await verification(submission, reviews);
  if (!entry?.is_public || !check || (check.kind === 'geometry' && !check.evidence) || entry.user_id !== submission.user_id || entry.submission_id !== submission.id) return null;
  return { id: submission.id, projectNumber: submission.project_id, title: entry.title,
    summary: entry.summary, process: entry.design_process, tools: entry.tools,
    hasCover: Boolean(entry.cover_path && imageChoices(submission).some(c => c.path === entry.cover_path)), verification: check };
}

export function textField(value, max, required = false) {
  if (typeof value !== 'string') throw new Error('Invalid text field.');
  const result = value.trim();
  if ((required && !result) || result.length > max || /[\u0000-\u0008\u000b\u000c\u000e-\u001f]/.test(result)) throw new Error('Please check the text lengths and try again.');
  return result;
}

export function imageType(bytes) {
  if (bytes.length >= 8 && [137,80,78,71,13,10,26,10].every((b, i) => bytes[i] === b)) return 'image/png';
  if (bytes.length >= 3 && bytes[0] === 255 && bytes[1] === 216 && bytes[2] === 255) return 'image/jpeg';
  return null;
}
