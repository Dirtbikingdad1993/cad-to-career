export const skillDomains = [
  'Phone start',
  'Drafting',
  '3D modeling',
  'Assembly',
  'Product & surfacing',
  'Manufacturing',
  'Professional',
];

// core: true → required before a certificate can be issued.
export const skills = [
  { id: 'phone.measure', label: 'Measure a real part to within 0.5 mm with phone-friendly methods', domain: 'Phone start', core: false, how: 'A measurement table with nominal, actual and error.' },
  { id: 'phone.sketch', label: 'Sketch three orthographic views of a physical object freehand', domain: 'Phone start', core: false, how: 'Nine sketches with corrections marked.' },

  { id: 'draft.read', label: 'Read a dimensioned drawing and name what it omits', domain: 'Drafting', core: true, how: 'An annotated drawing with six labelled line types.' },
  { id: 'draft.lines', label: 'Use line types and weights so a print reads at arm’s length', domain: 'Drafting', core: false, how: 'A sheet with a line-weight legend.' },
  { id: 'draft.datums', label: 'Dimension from a datum instead of chaining feature to feature', domain: 'Drafting', core: true, how: 'A datum-dimensioned sheet plus justification.' },
  { id: 'draft.views', label: 'Choose the minimum set of views that fully describes a part', domain: 'Drafting', core: false, how: 'A sheet using three views with no redundancy.' },
  { id: 'draft.sections', label: 'Show internal geometry with a labelled section and detail view', domain: 'Drafting', core: false, how: 'A section A–A plus a 2:1 detail.' },
  { id: 'draft.holes', label: 'Write correct hole callouts for through, blind, counterbore and tapped holes', domain: 'Drafting', core: true, how: 'A six-hole callout reference sheet.' },
  { id: 'draft.tolerance', label: 'Assign tolerances a shop can actually hold', domain: 'Drafting', core: true, how: 'A tolerance stack table with worst case.' },
  { id: 'draft.fits', label: 'Choose clearance, transition or interference fits deliberately', domain: 'Drafting', core: false, how: 'A written fit justification with numbers.' },
  { id: 'draft.titleblock', label: 'Complete a title block, notes block and revision table', domain: 'Drafting', core: false, how: 'Rev A and Rev B of the same sheet.' },

  { id: 'model.sketch', label: 'Create a fully constrained sketch with zero degrees of freedom', domain: '3D modeling', core: true, how: 'A screenshot showing the sketch is fully constrained.' },
  { id: 'model.parameters', label: 'Drive a model from named parameters and rebuild it cleanly', domain: '3D modeling', core: true, how: 'A parameter table with two variants.' },
  { id: 'model.features', label: 'Order features so the model survives a real design change', domain: '3D modeling', core: true, how: 'Before/after screenshots of a 20 % change.' },
  { id: 'model.fillets', label: 'Apply fillets and chamfers that do not break on edit', domain: '3D modeling', core: false, how: 'A rebuild test after changing a base dimension.' },
  { id: 'model.holes', label: 'Model threads, clearance holes and standard fasteners correctly', domain: '3D modeling', core: false, how: 'A joint detail with the fastener in place.' },
  { id: 'model.shell', label: 'Shell and rib a part to a defined wall-thickness target', domain: '3D modeling', core: false, how: 'A sectioned screenshot with wall and rib numbers.' },
  { id: 'model.validate', label: 'Validate volume, mass and bounding box against a specification', domain: '3D modeling', core: true, how: 'A validation table with calculated vs reported values.' },

  { id: 'asm.joints', label: 'Constrain an assembly so it keeps only the intended degrees of freedom', domain: 'Assembly', core: true, how: 'A motion test showing the intended axis only.' },
  { id: 'asm.interference', label: 'Run an interference check through the full motion range', domain: 'Assembly', core: false, how: 'Two interference reports, before and after.' },
  { id: 'asm.bom', label: 'Produce a bill of materials someone could order from', domain: 'Assembly', core: false, how: 'A BOM table with part numbers and quantities.' },
  { id: 'asm.exploded', label: 'Present an exploded or isometric view that reads clearly', domain: 'Assembly', core: false, how: 'A labelled exploded view.' },

  { id: 'draw.from3d', label: 'Generate and clean a drawing from a 3D model', domain: 'Product & surfacing', core: true, how: 'An exported PDF with views, dimensions and title block.' },
  { id: 'surf.loft', label: 'Build a clean lofted or subdivided surface form', domain: 'Product & surfacing', core: false, how: 'A curvature check plus a thickened solid.' },
  { id: 'surf.ergonomic', label: 'Shape a grip to a measured range of hands and explain it', domain: 'Product & surfacing', core: false, how: 'A grip-span table plus two form studies.' },
  { id: 'render.present', label: 'Produce presentation renders with material, light and a detail shot', domain: 'Product & surfacing', core: false, how: 'Three renders plus one detail at 1600 px.' },

  { id: 'mfg.print', label: 'Design a part that prints without unnecessary support', domain: 'Manufacturing', core: true, how: 'A sliced screenshot with orientation rationale.' },
  { id: 'mfg.sheetmetal', label: 'Apply bend allowance, reliefs and tool radii to sheet metal', domain: 'Manufacturing', core: false, how: 'A folded part plus its flat pattern.' },
  { id: 'mfg.dfm', label: 'Write DFM notes a machinist would accept without a call', domain: 'Manufacturing', core: false, how: 'A DFM note listing process limits and callouts.' },
  { id: 'cost.estimate', label: 'Estimate material and process cost, and compare two processes', domain: 'Manufacturing', core: false, how: 'A costing table comparing two processes.' },

  { id: 'port.portfolio', label: 'Curate a portfolio that shows decisions, not just shapes', domain: 'Professional', core: true, how: 'One project written as problem, constraint, decision, result.' },
  { id: 'port.communication', label: 'Explain a design in a 90-second walkthrough', domain: 'Professional', core: false, how: 'A recorded or written 90-second walkthrough.' },
  { id: 'prof.revisions', label: 'Control a brief and a revision loop with a change log', domain: 'Professional', core: false, how: 'Requirements list plus Rev A, Rev B and change log.' },
  { id: 'prof.interview', label: 'Complete a timed drawing and modelling exercise', domain: 'Professional', core: false, how: 'A 30-minute part, drawing and time log.' },
];

export const coreSkills = skills.filter((s) => s.core);
export const coreSkillCount = coreSkills.length;

export function findSkill(id) {
  return skills.find((s) => s.id === id) || null;
}

export function skillsForDomain(domain) {
  return skills.filter((s) => s.domain === domain);
}