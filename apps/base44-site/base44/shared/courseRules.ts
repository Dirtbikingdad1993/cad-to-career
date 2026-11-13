// Auto-generated from src/content/*.js. Regenerate when curriculum changes.
export const PROJECT_SLUGS = [
  "bracket-drawing",
  "parametric-enclosure",
  "hinge-assembly",
  "grip-shell",
  "manufacturing-redesign"
] as const;
export const CORE_SKILL_IDS = [
  "draft.read",
  "draft.datums",
  "draft.holes",
  "draft.tolerance",
  "model.sketch",
  "model.parameters",
  "model.features",
  "model.validate",
  "asm.joints",
  "draw.from3d",
  "mfg.print",
  "port.portfolio"
] as const;
export const LESSON_SLUGS = [
  "read-a-drawing-first",
  "measure-like-a-machinist",
  "units-scale-tolerance",
  "three-views-in-your-head",
  "sketch-then-dimension",
  "first-model-on-a-phone",
  "line-weights-and-types",
  "datum-dimensioning",
  "hole-callouts",
  "section-and-detail-views",
  "fits-and-tolerance-stacks",
  "title-block-notes-revisions",
  "first-parametric-part",
  "sketch-planes-and-orientation",
  "fillets-chamfers-and-draft",
  "holes-threads-fasteners",
  "shell-ribs-and-wall-thickness",
  "validate-your-model",
  "parameters-and-design-tables",
  "feature-order-robustness",
  "assemblies-and-joints",
  "interference-and-clearance",
  "bill-of-materials",
  "drawings-from-3d",
  "ergonomics-and-grips",
  "surfacing-lofts-and-patches",
  "hard-surface-in-blender",
  "render-and-present",
  "design-for-3d-printing",
  "design-for-sheet-metal-and-cnc",
  "reverse-engineer-a-part",
  "portfolio-that-proves-design",
  "manufacturing-drawing-package",
  "cost-and-material-estimate",
  "client-brief-revisions",
  "timed-interview-exercise"
] as const;
export const PROJECT_RULES = {
  "bracket-drawing": [
    {
      "field": "file_name",
      "type": "text_pattern",
      "pattern": "^P1-BRACKET-[A-Z0-9_-]+\\.PDF$",
      "label": "File follows the P1 naming convention"
    },
    {
      "field": "sheet_scale",
      "type": "equals",
      "value": "1:2",
      "label": "Scale is 1:2 for a 160 mm part on A4"
    },
    {
      "field": "views",
      "type": "min",
      "min": 3,
      "label": "At least three orthographic views"
    },
    {
      "field": "thickness",
      "type": "range",
      "min": 5.8,
      "max": 6.2,
      "label": "Thickness within 6 ± 0.2 mm"
    },
    {
      "field": "hole_spacing",
      "type": "range",
      "min": 89,
      "max": 91,
      "label": "Hole centres within 90 ± 1 mm"
    },
    {
      "field": "edge_distance",
      "type": "min",
      "min": 10,
      "label": "Hole edge distance ≥ 10 mm"
    },
    {
      "field": "datum_scheme",
      "type": "equals",
      "value": "A single datum edge",
      "label": "Dimensions run from one datum"
    },
    {
      "field": "tolerance_note",
      "type": "text_pattern",
      "pattern": "\\d",
      "label": "A general tolerance is stated"
    },
    {
      "field": "notes_block",
      "type": "checkbox",
      "label": "Notes block is complete"
    }
  ],
  "parametric-enclosure": [
    {
      "field": "file_name",
      "type": "text_pattern",
      "pattern": "^P2-ENCLOSURE-[A-Z0-9_-]+\\.PDF$",
      "label": "File follows the P2 naming convention"
    },
    {
      "field": "wall_thickness",
      "type": "min",
      "min": 2,
      "label": "Wall thickness ≥ 2.0 mm"
    },
    {
      "field": "lid_clearance",
      "type": "range",
      "min": 0.25,
      "max": 0.4,
      "label": "Lid clearance 0.25–0.4 mm per side"
    },
    {
      "field": "length",
      "type": "range",
      "min": 64,
      "max": 68,
      "label": "External length within 64–68 mm"
    },
    {
      "field": "width",
      "type": "range",
      "min": 40,
      "max": 44,
      "label": "External width within 40–44 mm"
    },
    {
      "field": "height",
      "type": "range",
      "min": 15,
      "max": 17,
      "label": "External height within 15–17 mm"
    },
    {
      "field": "param_count",
      "type": "min",
      "min": 6,
      "label": "At least six named parameters"
    },
    {
      "field": "lid_features",
      "type": "min",
      "min": 2,
      "label": "At least two retention features"
    },
    {
      "field": "bodies",
      "type": "equals",
      "value": "1",
      "label": "One clean body per part file"
    },
    {
      "field": "print_orientation",
      "type": "filled",
      "label": "A print orientation is stated"
    }
  ],
  "hinge-assembly": [
    {
      "field": "file_name",
      "type": "text_pattern",
      "pattern": "^P3-HINGE-[A-Z0-9_-]+\\.PDF$",
      "label": "File follows the P3 naming convention"
    },
    {
      "field": "parts",
      "type": "min",
      "min": 3,
      "label": "At least three components"
    },
    {
      "field": "joints",
      "type": "min",
      "min": 3,
      "label": "Every component is constrained by a joint"
    },
    {
      "field": "dof",
      "type": "equals",
      "value": "1",
      "label": "Exactly one rotational degree of freedom"
    },
    {
      "field": "interference",
      "type": "max",
      "max": 0,
      "label": "Zero interference through the range"
    },
    {
      "field": "bom_rows",
      "type": "min",
      "min": 4,
      "label": "BOM covers made and bought parts"
    },
    {
      "field": "exploded",
      "type": "checkbox",
      "label": "Exploded view with balloon numbers"
    },
    {
      "field": "pin_clearance",
      "type": "range",
      "min": 0.15,
      "max": 0.35,
      "label": "Pin clearance 0.15–0.35 mm radial"
    }
  ],
  "grip-shell": [
    {
      "field": "file_name",
      "type": "text_pattern",
      "pattern": "^P4-GRIP-[A-Z0-9_-]+\\.PDF$",
      "label": "File follows the P4 naming convention"
    },
    {
      "field": "min_wall",
      "type": "min",
      "min": 1.6,
      "label": "Minimum wall ≥ 1.6 mm"
    },
    {
      "field": "bodies",
      "type": "equals",
      "value": "1",
      "label": "One watertight solid body"
    },
    {
      "field": "min_fillet",
      "type": "min",
      "min": 1,
      "label": "No radius below 1.0 mm"
    },
    {
      "field": "render_views",
      "type": "min",
      "min": 3,
      "label": "At least three presentation views"
    },
    {
      "field": "process",
      "type": "filled",
      "label": "A manufacturing process is stated"
    },
    {
      "field": "watertight",
      "type": "checkbox",
      "label": "Watertight solid confirmed"
    }
  ],
  "manufacturing-redesign": [
    {
      "field": "file_name",
      "type": "text_pattern",
      "pattern": "^P5-REDESIGN-[A-Z0-9_-]+\\.PDF$",
      "label": "File follows the P5 naming convention"
    },
    {
      "field": "max_deviation",
      "type": "max",
      "max": 0.5,
      "label": "Model matches the part within 0.5 mm"
    },
    {
      "field": "drawing_sheets",
      "type": "min",
      "min": 2,
      "label": "At least two drawing sheets"
    },
    {
      "field": "tolerance_rows",
      "type": "min",
      "min": 3,
      "label": "Tolerance stack has at least three contributions"
    },
    {
      "field": "cost_items",
      "type": "min",
      "min": 3,
      "label": "Cost estimate has at least three line items"
    },
    {
      "field": "process",
      "type": "filled",
      "label": "A target process is stated"
    },
    {
      "field": "dfm_note",
      "type": "checkbox",
      "label": "DFM note is written"
    }
  ]
} as const;
