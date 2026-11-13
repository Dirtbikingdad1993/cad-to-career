import {isUuid, verification, imageChoices, publicProject, textField, imageType} from './core.mjs';

// Public GET requests return only opted-in text and explicitly selected images.
// All POST requests revalidate the Supabase access token and account ownership.
export function createHandler({base, service, fetcher = fetch}) {
  base = base.replace(/\/$/, '');
  const commonHeaders = req => {
    const origin = req.headers.get('origin') || '';
    const allowed = origin === 'https://cad-to-career.vercel.app' || /^https:\/\/cad-to-career-[a-z0-9-]+\.vercel\.app$/.test(origin) || /^http:\/\/localhost:\d+$/.test(origin);
    return {'Access-Control-Allow-Origin': allowed ? origin : 'https://cad-to-career.vercel.app', 'Vary': 'Origin',
      'Access-Control-Allow-Headers': 'authorization, apikey, content-type, x-client-info', 'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Cache-Control': 'no-store', 'X-Content-Type-Options': 'nosniff'};
  };
  const response = (req, data, status = 200) => new Response(JSON.stringify(data), {status, headers: {...commonHeaders(req), 'Content-Type': 'application/json'}});
  async function db(table, query = '', method = 'GET', body) {
    const headers = {apikey: service, Authorization: 'Bearer ' + service, 'Content-Type': 'application/json'};
    if (method !== 'GET') headers.Prefer = 'return=representation';
    const res = await fetcher(base + '/rest/v1/' + table + query, {method, headers, body: body === undefined ? undefined : JSON.stringify(body)});
    if (!res.ok) throw new Error('Database request failed');
    const raw = await res.text();
    return raw ? JSON.parse(raw) : [];
  }
  async function userFor(req) {
    const token = req.headers.get('authorization') || '';
    if (!/^Bearer \S+$/.test(token)) return null;
    const res = await fetcher(base + '/auth/v1/user', {headers: {apikey: service, Authorization: token}});
    if (!res.ok) return null;
    const user = await res.json();
    return isUuid(user.id) ? user : null;
  }
  const eq = value => encodeURIComponent(value);
  const submissionFields = 'id,user_id,project_id,status,score,reviewer_id,submitted_notes,evidence_paths,submitted_at,reviewed_at';
  const reviewFields = 'submission_id,reviewer_id,verdict,score,reviewed_at';
  async function reviewsFor(submissions) {
    const ids = submissions.map(s => s.id).filter(isUuid);
    return ids.length ? db('project_reviews', '?submission_id=in.(' + ids.join(',') + ')&select=' + reviewFields) : [];
  }
  async function myData(userId) {
    const [profiles, entries, submissions] = await Promise.all([
      db('portfolio_profiles', '?user_id=eq.' + eq(userId) + '&select=*'),
      db('portfolio_entries', '?user_id=eq.' + eq(userId) + '&select=*'),
      db('project_submissions', '?user_id=eq.' + eq(userId) + '&select=' + submissionFields + '&order=submitted_at.desc&limit=100')
    ]);
    const reviews = await reviewsFor(submissions);
    return {profile: profiles[0] || null, entries, submissions: submissions.map(s => ({id:s.id, projectNumber:s.project_id,
      status:s.status, submittedAt:s.submitted_at, verification:verification(s, reviews), covers:imageChoices(s)}))};
  }
  async function publicData(publicId) {
    if (!isUuid(publicId)) return null;
    const profiles = await db('portfolio_profiles', '?public_id=eq.' + eq(publicId) + '&is_public=eq.true&select=user_id,display_name,headline,bio');
    if (!profiles.length) return null;
    const profile = profiles[0];
    const [entries, submissions] = await Promise.all([
      db('portfolio_entries', '?user_id=eq.' + eq(profile.user_id) + '&is_public=eq.true&select=*'),
      db('project_submissions', '?user_id=eq.' + eq(profile.user_id) + '&status=eq.approved&select=' + submissionFields + '&limit=100')
    ]);
    const reviews = await reviewsFor(submissions);
    const projects = entries.map(entry => {
      const submission = submissions.find(s => s.id === entry.submission_id);
      return submission ? publicProject(entry, submission, reviews) : null;
    }).filter(Boolean);
    return {profile:{displayName:profile.display_name, headline:profile.headline, bio:profile.bio}, projects, entries, submissions};
  }
  async function readImage(path) {
    const res = await fetcher(base + '/storage/v1/object/authenticated/cad-submissions/' + path.split('/').map(encodeURIComponent).join('/'),
      {headers:{apikey:service, Authorization:'Bearer ' + service}});
    if (!res.ok || Number(res.headers.get('content-length') || 0) > 5 * 1024 * 1024 || !res.body) throw new Error('Image unavailable or larger than 5 MB.');
    const reader = res.body.getReader();
    let size = 0, chunks = [];
    while (true) {
      const {value, done} = await reader.read();
      if (done) break;
      size += value.length;
      if (size > 5 * 1024 * 1024) { await reader.cancel(); throw new Error('Image unavailable or larger than 5 MB.'); }
      chunks.push(value);
    }
    const bytes = new Uint8Array(size); let offset = 0;
    for (const part of chunks) { bytes.set(part, offset); offset += part.length; }
    const type = imageType(bytes);
    if (!type) throw new Error('Only genuine PNG or JPEG images can be shared.');
    return {bytes, type};
  }
  return async req => {
    if (req.method === 'OPTIONS') return new Response(null, {status:204, headers:commonHeaders(req)});
    if (!base || !service) return response(req, {error:'Portfolio service unavailable.'}, 503);
    try {
      if (req.method === 'GET') {
        const params = new URL(req.url).searchParams, data = await publicData(params.get('id'));
        if (!data) return response(req, {error:'Portfolio not found.'}, 404);
        const cover = params.get('cover');
        if (cover !== null) {
          const project = data.projects.find(p => p.id === cover && p.hasCover);
          const entry = project && data.entries.find(e => e.submission_id === cover);
          if (!entry) return response(req, {error:'Image not found.'}, 404);
          const image = await readImage(entry.cover_path);
          return new Response(image.bytes, {headers:{...commonHeaders(req), 'Content-Type':image.type, 'Content-Disposition':'inline'}});
        }
        return response(req, {profile:data.profile, projects:data.projects});
      }
      if (req.method !== 'POST') return response(req, {error:'Method not allowed.'}, 405);
      const user = await userFor(req);
      if (!user) return response(req, {error:'Please sign in again.'}, 401);
      const body = await req.json();
      if (!body || typeof body !== 'object' || Array.isArray(body)) return response(req, {error:'Invalid request.'}, 400);
      if (body.action === 'load') return response(req, await myData(user.id));
      if (body.action === 'save_profile') {
        if (typeof body.isPublic !== 'boolean') return response(req, {error:'Choose whether to share your portfolio.'}, 400);
        const displayName = textField(body.displayName, 80, true);
        if (displayName.length < 2) return response(req, {error:'Use at least two characters for your display name.'}, 400);
        const values = {display_name:displayName, headline:textField(body.headline,120), bio:textField(body.bio,2000), is_public:body.isPublic, updated_at:new Date().toISOString()};
        const existing = await db('portfolio_profiles', '?user_id=eq.' + eq(user.id) + '&select=user_id');
        const rows = existing.length ? await db('portfolio_profiles', '?user_id=eq.' + eq(user.id), 'PATCH', values) :
          await db('portfolio_profiles', '', 'POST', {...values,user_id:user.id});
        return response(req, {profile:rows[0]});
      }
      if (body.action === 'rotate_link') {
        const rows = await db('portfolio_profiles', '?user_id=eq.' + eq(user.id), 'PATCH', {public_id:crypto.randomUUID(), updated_at:new Date().toISOString()});
        if (!rows.length) return response(req, {error:'Save your profile first.'}, 409);
        return response(req, {profile:rows[0]});
      }
      if (body.action === 'delete_entry') {
        if (!isUuid(body.submissionId)) return response(req, {error:'Invalid project.'}, 400);
        await db('portfolio_entries', '?submission_id=eq.' + eq(body.submissionId) + '&user_id=eq.' + eq(user.id), 'DELETE');
        return response(req, {ok:true});
      }
      if (body.action === 'save_entry') {
        if (!isUuid(body.submissionId) || typeof body.isPublic !== 'boolean') return response(req, {error:'Invalid project.'}, 400);
        const submissions = await db('project_submissions', '?id=eq.' + eq(body.submissionId) + '&user_id=eq.' + eq(user.id) + '&select=' + submissionFields);
        const sub = submissions[0];
        if (!sub) return response(req, {error:'Submission not found.'}, 404);
        const reviews = await reviewsFor([sub]);
        if (body.isPublic && !verification(sub, reviews)) return response(req, {error:'Only verified work can appear publicly. Save it as a private draft while review is pending.'}, 409);
        const path = body.coverPath == null || body.coverPath === '' ? null : body.coverPath;
        if (path !== null) {
          if (typeof path !== 'string' || !imageChoices(sub).some(c => c.path === path)) return response(req, {error:'Choose a PNG or JPEG from this submission.'}, 400);
          await readImage(path);
        }
        const values = {title:textField(body.title,100,true), summary:textField(body.summary,1200),
          design_process:textField(body.process,1200), tools:textField(body.tools,150), cover_path:path, is_public:body.isPublic, updated_at:new Date().toISOString()};
        const existing = await db('portfolio_entries', '?submission_id=eq.' + eq(sub.id) + '&user_id=eq.' + eq(user.id) + '&select=submission_id');
        if (existing.length) await db('portfolio_entries', '?submission_id=eq.' + eq(sub.id) + '&user_id=eq.' + eq(user.id), 'PATCH', values);
        else await db('portfolio_entries', '', 'POST', {...values,user_id:user.id,submission_id:sub.id});
        return response(req, {ok:true});
      }
      return response(req, {error:'Unknown portfolio action.'}, 400);
    } catch (error) {
      const msg = String(error?.message || '');
      if (/^Invalid text field|^Please check|^Image unavailable|^Only genuine/.test(msg)) return response(req, {error:msg}, 400);
      console.error('Portfolio request failed');
      return response(req, {error:'Portfolio could not be loaded or saved. Try again.'}, 500);
    }
  };
}
