export const tools = [
  {
    name: 'Onshape',
    licence: 'Free plan',
    cost: 'Free — documents are public on the free plan',
    runs: 'Browser, Android, iOS',
    best: 'Starting on a phone; no install, real parametric modelling',
    limits: 'Free documents are public; heavy assemblies need a paid seat',
    role: 'Stage 00 on a phone',
    icon: 'phone',
  },
  {
    name: 'Fusion 360',
    licence: 'Free personal use, paid commercial',
    cost: 'Free for personal/hobby use, subscription for commercial work',
    runs: 'Windows, macOS (+ mobile viewer app)',
    best: 'The main teaching tool: parts, assemblies, drawings, CAM',
    limits: 'Needs an account and a reasonably modern machine; personal licence limits commercial use',
    role: 'Stages 01–05',
    icon: 'desktop',
  },
  {
    name: 'FreeCAD',
    licence: 'Open source',
    cost: 'Free, no account, fully offline',
    runs: 'Windows, macOS, Linux',
    best: 'Fully offline parametric parts and TechDraw sheets',
    limits: 'Steeper UI; assembly and surfacing rely on add-ons',
    role: 'Drawing and drafting work',
    icon: 'desktop',
  },
  {
    name: 'Blender',
    licence: 'Open source',
    cost: 'Free',
    runs: 'Windows, macOS, Linux',
    best: 'Surfacing, subdivision modelling, rendering and animation',
    limits: 'Not a parametric drafting tool; no dimensions or tolerance workflow',
    role: 'Stage 04 product form',
    icon: 'desktop',
  },
  {
    name: 'AutoCAD / AutoCAD LT',
    licence: 'Paid subscription',
    cost: 'Subscription; LT is the cheaper 2D-focused option',
    runs: 'Windows, macOS, web, mobile app',
    best: '2D drafting at industry scale — the format most job ads name',
    limits: 'Cost; 3D and parametric work is limited in LT',
    role: 'Read the job ads, learn the commands',
    icon: 'desktop',
  },
  {
    name: 'Tinkercad',
    licence: 'Free',
    cost: 'Free',
    runs: 'Browser, tablet',
    best: 'The first hour of 3D with zero learning curve',
    limits: 'No real drawings, no parametric control, no tolerances',
    role: 'Optional warm-up only',
    icon: 'phone',
  },
];

export const decisions = [
  {
    situation: 'You only have an Android phone',
    answer: 'Onshape free plan, plus paper and a ruler.',
    detail: 'Stage 00 is designed for exactly this. Do not wait for a laptop to start measuring and sketching.',
  },
  {
    situation: 'You have a laptop under 8 GB of RAM',
    answer: 'FreeCAD or Onshape in the browser.',
    detail: 'Fusion 360 will struggle with assemblies on a low-memory machine; FreeCAD runs offline and light.',
  },
  {
    situation: 'You want the tool job ads mention',
    answer: 'Fusion 360 first, then AutoCAD LT if your local shops ask for it.',
    detail: 'Learn the concepts once, then map them onto the second tool in a week — it is mostly vocabulary.',
  },
  {
    situation: 'You want to design products, not parts',
    answer: 'Fusion 360 for the engineering, Blender for form and renders.',
    detail: 'Model for manufacture in Fusion, then explore form in Blender where subdivision is quicker.',
  },
  {
    situation: 'You want zero cloud dependency',
    answer: 'FreeCAD plus Blender.',
    detail: 'Both are free, offline and permanent. You lose cloud collaboration and some CAM convenience.',
  },
];

export const costPath = [
  ['Stage 00', 'Onshape free + paper', '$0'],
  ['Stages 01–03', 'Fusion 360 personal use or FreeCAD', '$0'],
  ['Stage 04', 'Blender', '$0'],
  ['Stage 05', 'Same tools, plus a spreadsheet', '$0'],
  ['Only if a job requires it', 'AutoCAD LT subscription', 'Paid'],
];