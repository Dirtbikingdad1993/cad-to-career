export const milestones = [
  {
    n: '01',
    title: 'Week 0 — phone only',
    device: 'Phone',
    do: ['Stage 00 lessons 1–6', 'Onshape app account', 'Measure two real parts', 'Sketch nine views on paper'],
    can: 'Read a drawing, measure a part, sketch three views, model a plate.',
    moveWhen: 'Move when your sketches need more than six dimensions to describe.',
  },
  {
    n: '02',
    title: 'Week 1–2 — phone plus any desktop',
    device: 'Phone + shared/library computer',
    do: ['Install Fusion 360 personal or FreeCAD', 'Stage 01 drawing lessons', 'Re-do one phone model on desktop'],
    can: 'Produce a dimensioned sheet with a title block.',
    moveWhen: 'Move when you need consistent file access and a three-button mouse.',
  },
  {
    n: '03',
    title: 'Week 3–6 — your own desk setup',
    device: 'Desktop or laptop + mouse',
    do: ['Stage 02 and 03', 'Projects 01 and 02', 'Start a versioned file folder'],
    can: 'Build parametric parts and a moving assembly.',
    moveWhen: 'Move when your machine can hold both an assembly and a drawing sheet open.',
  },
  {
    n: '04',
    title: 'Week 7–10 — form and presentation',
    device: 'Desktop + Blender',
    do: ['Stage 04', 'Project 04', 'Render a three-view sheet'],
    can: 'Shape a product for a hand and present it credibly.',
    moveWhen: 'Move when your renders are good enough that a stranger asks what it is.',
  },
  {
    n: '05',
    title: 'Week 11–14 — portfolio and job',
    device: 'Desktop',
    do: ['Stage 05', 'Projects 03 and 05', 'Timed interview drill twice'],
    can: 'Ship a drawing package, a cost estimate and a defended portfolio.',
    moveWhen: 'You are ready to apply — not before a reviewer has confirmed all five projects.',
  },
];

export const hardwareFloor = [
  ['RAM', '8 GB minimum, 16 GB comfortable'],
  ['CPU', 'Any 4-core from the last five years'],
  ['Display', '1366 × 768 works; 1920 × 1080 is worth it'],
  ['Mouse', 'Three-button mouse with a middle wheel — not optional'],
  ['Storage', '10 GB free for CAD and render caches'],
  ['Network', 'Used once a week is enough for Fusion; FreeCAD works offline'],
];

export const desktopOnly = [
  ['Precise sketch constraints', 'Phone sketching is fine for blocks; constraints need a cursor.'],
  ['Assemblies with joints', 'Touch dragging cannot reliably pick mate references.'],
  ['Drawing sheets', 'Sheet setup, scale and dimension placement need screen space.'],
  ['Interference sweeps', 'You need to scrub a mechanism through its range.'],
  ['Surfacing and subdivision', 'Curvature combs and edge loops need a mouse.'],
  ['Renders and exports', 'Large renders and PDF exports are impractical on a phone.'],
];

export const fileDiscipline = [
  'Name files P<n>-<project>-<surname>-rev<letter> and never reuse a name.',
  'Keep one folder per project with a /refs folder for photos and measurements.',
  'Export a PDF to the folder the moment a sheet is finished; CAD files are not a deliverable.',
  'Write the revision row before you send anything to a reviewer.',
  'Back up to a second place — cloud plus a USB stick is enough.',
];