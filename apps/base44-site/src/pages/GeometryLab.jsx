import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Download, CheckCircle2, CircleAlert, Save } from 'lucide-react';
import { assessGeometry, GEOMETRY_EXERCISE } from '../../base44/shared/geometry.js';
import { useWorkspace } from '@/components/workspace/WorkspaceProvider';
import { fieldClass } from '@/components/ui/Field';

const FIELDS = [
  ['x','Rectangle X'],['y','Rectangle Y'],['width','Rectangle width'],
  ['height','Rectangle height'],['cx','Circle center X'],['cy','Circle center Y'],
  ['radius','Circle radius'],
];
const EMPTY = { units:'mm', x:'', y:'', width:'', height:'', cx:'', cy:'', radius:'' };
const fmt = value => Number.isFinite(value) ? value.toFixed(2) : '—';

export default function GeometryLab() {
  const { student, records, saveGeometry } = useWorkspace();
  const saved = records.find(r => r.kind === 'lab' && r.item === GEOMETRY_EXERCISE.id);
  const [draft, setDraft] = useState(EMPTY);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  useEffect(() => {
    if (!saved?.answers_json) return;
    try { setDraft({...EMPTY,...JSON.parse(saved.answers_json)}); }
    catch { /* leave editable draft intact */ }
  }, [saved?.answers_json]);
  const report = useMemo(() => assessGeometry(draft), [draft]);
  const g = report.geometry;
  const canDraw = g.x !== null && g.y !== null && g.width > 0 && g.height > 0
    && g.cx !== null && g.cy !== null && g.radius > 0;
  const count = report.checks.filter(c=>c.pass).length;

  const save = async () => {
    setBusy(true); setError(''); setMessage('');
    try {
      const result = await saveGeometry(draft);
      setMessage(result.validation?.pass ? 'Sketch saved. All checks passed; this is not a confirmed CAD skill.' : 'Draft saved. Finish the failing constraints to pass.');
    } catch(err) { setError(err.message || 'Unable to save. Sign in and create a workspace.'); }
    finally { setBusy(false); }
  };

  const download = () => {
    if (!report.pass) return;
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="320mm" height="220mm" viewBox="0 0 320 220">
<rect width="320" height="220" fill="white"/>
<g fill="none" stroke="#1d6476" stroke-width="0.6">
<rect x="${g.x}" y="${g.y}" width="${g.width}" height="${g.height}"/>
<circle cx="${g.cx}" cy="${g.cy}" r="${g.radius}"/></g>
<g font-family="sans-serif" font-size="5" fill="#12223a">
<text x="${g.x}" y="${g.y+g.height+9}">Rectangle ${g.width} × ${g.height} mm</text>
<text x="${g.cx-g.radius}" y="${g.cy+g.radius+9}">Circle Ø${g.radius*2} mm</text></g></svg>`;
    const url = URL.createObjectURL(new Blob([svg],{type:'image/svg+xml'}));
    const a = document.createElement('a'); a.href=url; a.download='cad-to-career-geometry-lab.svg'; a.click();
    setTimeout(()=>URL.revokeObjectURL(url), 1000);
  };

  return (
    <div className="mx-auto max-w-6xl px-5 py-10 lg:px-8 lg:py-14">
      <p className="mono-label">Practice lab · Mobile and desktop</p>
      <h1 className="mt-3 font-heading text-3xl font-semibold tracking-tight sm:text-4xl">Dimensioned rectangle + circle</h1>
      <p className="mt-4 max-w-3xl text-sm leading-relaxed text-muted-foreground">
        Build two real SVG sketch primitives from seven coordinates and dimensions. The validator computes
        their exact areas, perimeters, sheet bounds, coordinate tolerances and clearance. No values are pre-filled,
        and passing does not confirm a lesson, portfolio project or certificate.
      </p>
      <div className="mt-6 grid gap-4 border-y border-hairline py-5 text-sm sm:grid-cols-3">
        <p><strong>Rectangle:</strong> X 10, Y 10, width 120, height 80 mm</p>
        <p><strong>Circle:</strong> center X 200, Y 70, radius 30 mm</p>
        <p><strong>Tolerance:</strong> ±0.2 mm; maintain ≥5 mm separation</p>
      </div>
      <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_1.2fr]">
        <div className="border border-hairline bg-card p-5 sm:p-7">
          <h2 className="font-heading text-xl">1. Draw by dimension</h2>
          <div className="mt-5">
            <label htmlFor="geometry-units" className="font-mono text-[10px] uppercase tracking-wider">Units</label>
            <select id="geometry-units" className={`${fieldClass} mt-2`} value={draft.units} onChange={e=>setDraft(v=>({...v,units:e.target.value}))}>
              <option value="mm">Millimeters (mm)</option><option value="in">Inches (in)</option>
            </select>
          </div>
          <div className="mt-5 grid grid-cols-2 gap-4">
            {FIELDS.map(([key,label])=>(
              <label className="block" key={key}>
                <span className="font-mono text-[10px] uppercase tracking-wider text-ink/80">{label} (mm)</span>
                <input name={key} type="number" inputMode="decimal" step="any" className={`${fieldClass} mt-2`} value={draft[key]} onChange={e=>setDraft(v=>({...v,[key]:e.target.value}))} placeholder="Enter value"/>
              </label>
            ))}
          </div>
          <div className="mt-6 flex flex-wrap gap-3">
            <button onClick={save} disabled={!student || busy} className="inline-flex items-center gap-2 bg-ink px-4 py-3 font-mono text-[10px] uppercase tracking-wider text-paper disabled:opacity-40">
              <Save size={14}/>{busy?'Saving…':'Save sketch to my account'}
            </button>
            <button onClick={download} disabled={!report.pass} className="inline-flex items-center gap-2 border border-ink px-4 py-3 font-mono text-[10px] uppercase tracking-wider disabled:opacity-40">
              <Download size={14}/>Download SVG
            </button>
          </div>
          {!student && <p className="mt-4 text-xs text-muted-foreground"><Link className="underline" to="/workspace">Sign in and set up a free learner workspace</Link> to save across devices. You can practice and download without signing in.</p>}
          {message && <p className="mt-4 text-xs text-emerald-700" role="status">{message}</p>}
          {error && <p className="mt-4 text-xs text-destructive" role="alert">{error}</p>}
          {saved && <p className="mt-4 font-mono text-[10px] uppercase tracking-wider text-muted-foreground">Saved in your account · draft, not confirmed</p>}
        </div>
        <div>
          <div className="border border-hairline bg-white p-4">
            <div className="mb-3 flex justify-between text-[10px] uppercase tracking-widest text-slate-500">
              <span>2D sketch sheet</span><span>320 × 220 mm</span>
            </div>
            <svg role="img" aria-label="Live preview of the rectangle and circle on a dimensioned grid" viewBox="0 0 320 220" className="w-full border border-slate-200">
              <defs><pattern id="cad-grid" width="10" height="10" patternUnits="userSpaceOnUse"><path d="M 10 0 L 0 0 0 10" fill="none" stroke="#d8e3e9" strokeWidth=".4"/></pattern></defs>
              <rect width="320" height="220" fill="url(#cad-grid)"/>
              {canDraw && <>
                <rect x={g.x} y={g.y} width={g.width} height={g.height} stroke="#116f77" fill="#116f7710" strokeWidth="1.5"/>
                <circle cx={g.cx} cy={g.cy} r={g.radius} stroke="#116f77" fill="#116f7710" strokeWidth="1.5"/>
                <line x1={g.cx-4} y1={g.cy} x2={g.cx+4} y2={g.cy} stroke="#116f77"/>
                <line x1={g.cx} y1={g.cy-4} x2={g.cx} y2={g.cy+4} stroke="#116f77"/>
                <text x={g.x} y={Math.min(g.y+g.height+12,218)} fontSize="8" fill="#116f77">{g.width} × {g.height} mm</text>
                <text x={Math.max(0,g.cx-g.radius)} y={Math.min(g.cy+g.radius+12,218)} fontSize="8" fill="#116f77">Ø{g.radius*2} mm</text>
              </>}
            </svg>
            <p className="mt-3 text-xs text-muted-foreground">The drawing is generated from the entered dimensions, not an uploaded CAD file. Export it to practice opening in FreeCAD or LibreCAD.</p>
          </div>
          <div className="mt-5 border border-hairline bg-card p-5">
            <div className="flex items-center justify-between gap-3"><h2 className="font-heading text-lg">Machine feedback</h2><span className="font-mono text-xs">{count}/{report.checks.length} checks</span></div>
            <div className="mt-4 space-y-2">
              {report.checks.map(c=><div key={c.id} className="flex gap-2 border-b border-hairline pb-2 text-[12px]">
                {c.pass?<CheckCircle2 size={15} className="shrink-0 text-emerald-700"/>:<CircleAlert size={15} className="shrink-0 text-amber-600"/>}
                <div><p>{c.label}</p><p className="text-[11px] text-muted-foreground">{c.detail}</p></div>
              </div>)}
            </div>
            <h3 className="mt-5 font-mono text-[10px] uppercase tracking-widest">Calculated measurements</h3>
            <dl className="mt-3 grid grid-cols-2 gap-3 text-xs">
              {[['Rectangle area',report.derived?.rectangleArea,'mm²'],['Rectangle perimeter',report.derived?.rectanglePerimeter,'mm'],['Circle area',report.derived?.circleArea,'mm²'],['Circle circumference',report.derived?.circleCircumference,'mm'],['Edge clearance',report.derived?.edgeGap,'mm']].map(([name,v,u])=><div key={name}><dt className="text-muted-foreground">{name}</dt><dd className="mt-1 font-mono">{v==null?'—':fmt(v)+' '+u}</dd></div>)}
            </dl>
          </div>
        </div>
      </div>
      <p className="mt-8 text-xs text-muted-foreground">Next step: recreate the drawing in FreeCAD, Fusion 360 or LibreCAD using constraints and dimensions, then export the native CAD file or a drawing PDF for human review.</p>
    </div>
  );
}
