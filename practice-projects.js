/* Optional CAD practice projects: student self-check only, never certification credit. */
(function(){
'use strict';
window.CAD_PRACTICE_PROJECTS=[
  {
    "slug": "dimensioned-shop-sign",
    "title": "Dimensioned workshop nameplate",
    "level": "Beginner",
    "track": "2D drafting",
    "hours": "1–2 hours",
    "tools": "Browser 2D Lab or LibreCAD",
    "brief": "Produce a fabrication-ready drawing of a small, nonstructural workshop nameplate. Show the size and hole pattern clearly enough that someone else could check it without asking you for missing dimensions.",
    "specs": [
      "Outside profile: 160 × 55 mm.",
      "Four mounting holes: Ø5 mm, centers 12 mm from their adjacent edges.",
      "One front view, labeled axes, and millimeter dimensions.",
      "Use a nonstructural demonstration material; no powered machining is required."
    ],
    "steps": [
      "Write a one-sentence description of who will use the sign and where it would mount.",
      "Set drawing units to millimeters and create the rectangular boundary.",
      "Locate four holes from an explicit datum rather than estimating by eye.",
      "Add dimensions for width, height, diameter, and hole center offsets.",
      "Export a clean drawing and review it at actual size."
    ],
    "deliverables": [
      "An editable CAD drawing.",
      "A PDF or SVG with dimensions and title block.",
      "A short inspection table showing four hole center locations.",
      "One paragraph describing datum choice."
    ],
    "checks": [
      "Profile and units match the brief.",
      "All four hole centers are unambiguous.",
      "Dimension text is legible and not duplicated.",
      "Deliverables contain no unsupported manufacturing claims."
    ]
  },
  {
    "slug": "cable-pass-through-panel",
    "title": "Cable pass-through panel",
    "level": "Beginner",
    "track": "2D drafting",
    "hours": "2–3 hours",
    "tools": "Browser 2D Lab, LibreCAD",
    "brief": "Design an electronics desk pass-through panel with two cable openings and a repeatable mounting-hole pattern. Keep the drawing suitable for desktop practice; do not connect or modify energized equipment.",
    "specs": [
      "Overall panel: 150 × 80 mm.",
      "Two Ø18 mm cable openings, centers 45 and 105 mm from the left edge, both at y=40 mm.",
      "Four Ø4 mm mounting holes, each 10 mm from adjacent edges.",
      "Minimum 6 mm of material between a cable opening and outside panel edge."
    ],
    "steps": [
      "Sketch how a removable panel could route cables on a desk.",
      "Set origin at the lower-left outside corner and draw the 150 × 80 perimeter.",
      "Place two large openings by numeric centers and diameters.",
      "Place the four smaller mounting holes using repeated offsets.",
      "Verify symmetry, edge distances and overall dimensions.",
      "Create an annotated export showing the different hole functions."
    ],
    "deliverables": [
      "Editable 2D source.",
      "Dimensioned top view in PDF or SVG.",
      "Hole table with x, y and diameter columns.",
      "Short note on cable abrasion protection."
    ],
    "checks": [
      "Two cable openings use the specified centers.",
      "Four mounting holes share consistent edge offsets.",
      "No opening violates the edge margin.",
      "Drawing distinguishes openings from mounting holes."
    ]
  },
  {
    "slug": "desk-tool-tray",
    "title": "Parametric desk tool tray",
    "level": "Beginner",
    "track": "3D modeling",
    "hours": "3–5 hours",
    "tools": "FreeCAD or Fusion",
    "brief": "Build a reusable tray for small desk tools using constrained sketches and editable parameters. The aim is to show design intent, not to build a disposable mesh that is difficult to revise.",
    "specs": [
      "Outside size: 180 × 120 × 35 mm.",
      "Nominal wall thickness: 3 mm; floor thickness: 3 mm.",
      "At least three internal compartments.",
      "Include a parameter or documented dimension controlling the tray width."
    ],
    "steps": [
      "Create a sketch of the outer footprint and constrain its dimensions.",
      "Extrude the tray body and remove the internal cavity.",
      "Add internal dividers with consistent walls and practical corner radii.",
      "Change the tray width by 15 mm and confirm the model regenerates.",
      "Inspect volume, wall thickness and bottom clearance.",
      "Generate one plan view and one isometric view."
    ],
    "deliverables": [
      "Editable native 3D model.",
      "STEP or equivalent neutral-format export.",
      "Dimensioned top view and isometric screenshot.",
      "A before/after parameter-change note."
    ],
    "checks": [
      "Dimensions and minimum walls match the brief.",
      "Compartments remain separated after regeneration.",
      "The native model uses meaningful features.",
      "Both editable and neutral exports open without errors."
    ]
  },
  {
    "slug": "adjustable-phone-stand",
    "title": "Adjustable phone stand concept",
    "level": "Beginner",
    "track": "3D modeling",
    "hours": "3–5 hours",
    "tools": "FreeCAD, Fusion or Blender",
    "brief": "Create a tabletop stand for a phone or similarly sized rectangle. Use actual measured object thickness and compare three viewing angles; this is a desktop concept, not a commercial product qualification.",
    "specs": [
      "Base footprint no larger than 115 × 95 mm.",
      "Slot width = measured device thickness + 1.5 mm nominal clearance.",
      "Compare viewing angles of 50°, 60° and 70°.",
      "Include a rounded contact edge to reduce scuffing."
    ],
    "steps": [
      "Measure the device thickness and note whether a case is included.",
      "Sketch the base and support profile from the side.",
      "Model at least two separable or adjustable components.",
      "Create three configurations of the support angle.",
      "Check contact points and tipping tendencies in a tabletop mockup.",
      "Revise the design based on one recorded usability observation."
    ],
    "deliverables": [
      "Dimensioned side profile.",
      "Native CAD assembly with three configurations.",
      "Rendered or screenshot views of each angle.",
      "Measurement sheet and short revision log."
    ],
    "checks": [
      "Clearance is derived from a measured device.",
      "Three viewing-angle configurations are documented.",
      "An assembly view explains motion or repositioning.",
      "Limitations of the untested prototype are stated."
    ]
  },
  {
    "slug": "bicycle-accessory-spacer",
    "title": "Bicycle accessory spacer prototype",
    "level": "Intermediate",
    "track": "2D + 3D",
    "hours": "3–4 hours",
    "tools": "LibreCAD and FreeCAD",
    "brief": "Reverse-engineer a simple, nonstructural accessory spacer. Learn center-to-center measurement and hole alignment without modifying brake, steering, frame or other safety-critical bicycle parts.",
    "specs": [
      "Nominal prototype blank: 75 × 35 × 5 mm.",
      "Two Ø6 mm clearance holes on a 50 mm center-to-center pitch.",
      "Rounded outer corners, R5 mm nominal.",
      "Document which dimensions are measured and which are assumed for practice."
    ],
    "steps": [
      "Identify a harmless removable accessory as the measurement reference.",
      "Record length, width, hole pitch and thickness with a units table.",
      "Construct the 2D sketch and dimension the hole-center pattern.",
      "Extrude to thickness and round the outside corners.",
      "Check both holes remain concentric with the original reference.",
      "Create a print-safe drawing clearly labeled prototype only."
    ],
    "deliverables": [
      "Dimensioned 2D drawing.",
      "Editable solid model and STEP export.",
      "Hole-pitch measurement table.",
      "Photo or sketch of the nonstructural reference."
    ],
    "checks": [
      "Hole pitch is dimensioned center-to-center.",
      "Design uses a consistent datum system.",
      "Corners and thickness match the brief.",
      "Drawing states that it is not approved for structural use."
    ]
  },
  {
    "slug": "car-audio-amp-rack",
    "title": "Car audio amplifier rack layout",
    "level": "Intermediate",
    "track": "2D layout + assembly",
    "hours": "4–6 hours",
    "tools": "LibreCAD, FreeCAD or Fusion",
    "brief": "Plan a removable amplifier mounting board for a vehicle audio system. This is an equipment packaging and service-clearance exercise only: no live electrical installation or vehicle structural modifications are part of the project.",
    "specs": [
      "Demonstration board boundary: 500 × 260 mm, adjusted only after measuring the actual space.",
      "Use measured amplifier footprints; label dimensions as measured rather than invented.",
      "Reserve at least 20 mm nominal service clearance around connectors, subject to each product's requirements.",
      "Show cable access, ventilation and removable fastener locations."
    ],
    "steps": [
      "Sketch the available space and note obstructions, access panels and mounting restrictions.",
      "Measure each amplifier chassis and connector projection.",
      "Place scaled footprints on a 2D layout without overlap.",
      "Add a clearance envelope and a cable-access route.",
      "Design a removable board and identify safe mounting zones for later review.",
      "Compare two layouts and justify the one with better serviceability."
    ],
    "deliverables": [
      "Scaled top-view layout.",
      "Clearance and measured-dimension table.",
      "Exploded or annotated equipment arrangement.",
      "Two-option comparison and installation limitations."
    ],
    "checks": [
      "All footprints derive from recorded measurements.",
      "Service and cooling clearance is visible.",
      "No drilling into unknown vehicle structure is specified.",
      "Drawing shows how equipment could be removed for service."
    ]
  },
  {
    "slug": "flat-pack-desk-organizer",
    "title": "Flat-pack desktop organizer",
    "level": "Intermediate",
    "track": "Parametric assembly",
    "hours": "5–7 hours",
    "tools": "FreeCAD or Fusion",
    "brief": "Design a small organizer assembled from flat panels with labeled joints and a complete cut list. Demonstrate material thickness allowances and assembly sequencing.",
    "specs": [
      "Overall envelope must fit within 300 × 220 × 180 mm.",
      "Use a nominal 6 mm sheet material parameter.",
      "At least four unique panel shapes and two removable joints.",
      "No glue or permanent fastening required in the concept."
    ],
    "steps": [
      "Write a use case and identify which objects the organizer holds.",
      "Sketch the side and bottom panels, with thickness as a parameter.",
      "Add tabs or slots and account for nominal material thickness.",
      "Assemble the panels in CAD and run interference checks.",
      "Generate a flattened cut layout with labels and quantity counts.",
      "Revise the joints after a cardboard fit check or virtual interference review."
    ],
    "deliverables": [
      "Editable part files and assembly.",
      "Flat cutting layout with part IDs.",
      "BOM listing material, quantity and thickness.",
      "Assembly instructions with numbered steps."
    ],
    "checks": [
      "No overlaps remain in the CAD assembly.",
      "Cut list accounts for all assembled parts.",
      "Joint sizes follow the chosen material parameter.",
      "Build order is understandable from the instructions."
    ]
  },
  {
    "slug": "ventilated-electronics-cover",
    "title": "Ventilated electronics cover",
    "level": "Intermediate",
    "track": "Parametric 3D",
    "hours": "4–6 hours",
    "tools": "FreeCAD or Fusion",
    "brief": "Develop a decorative, non-safety-critical removable cover with a repeated slot pattern. Demonstrate constraints, pattern features, fastener clearances and clean manufactured drawings.",
    "specs": [
      "Outside footprint: 120 × 90 mm, shell height 18 mm.",
      "Nominal shell wall: 2.5 mm.",
      "At least six identical slots in a regular pattern.",
      "Four fastening locations that remain clear of the slots."
    ],
    "steps": [
      "Sketch the cover envelope and top face.",
      "Create a shell with consistent wall thickness.",
      "Define one slot from controlled dimensions and pattern it.",
      "Model the four fastening points using a shared reference datum.",
      "Inspect minimum material bridges between slots.",
      "Generate plan, side and isometric drawing views."
    ],
    "deliverables": [
      "Native parametric model.",
      "STEP export.",
      "Annotated pattern dimension sheet.",
      "Short note explaining molding or 3D-printing constraints."
    ],
    "checks": [
      "Repeated slots share a common feature definition.",
      "Fastening locations do not intersect openings.",
      "Walls and slot bridges are inspectable.",
      "Project does not claim fan or electrical safety certification."
    ]
  },
  {
    "slug": "sealed-speaker-box",
    "title": "Sealed speaker enclosure design",
    "level": "Advanced",
    "track": "3D assembly + calculations",
    "hours": "6–9 hours",
    "tools": "FreeCAD, LibreCAD or Fusion",
    "brief": "Design a sealed loudspeaker enclosure from a required internal volume and a chosen driver datasheet. Separate gross internal volume from usable air volume after subtracting the driver and bracing displacement; do not assume an arbitrary target suits a real driver.",
    "specs": [
      "Start with a demonstration outside envelope of 400 × 280 × 220 mm.",
      "Use 18 mm sheet thickness for the study model.",
      "Calculate gross internal volume, then deduct displacement based on measured or documented parts.",
      "Keep the driver cutout and rear clearance driven by the selected manufacturer's datasheet."
    ],
    "steps": [
      "Select a real driver specification and record the recommended sealed air volume.",
      "Create an editable dimensional enclosure model from the available envelope.",
      "Calculate clear internal dimensions and gross volume in liters.",
      "Estimate or measure driver and bracing displacement, and compute net volume.",
      "Adjust dimensions to meet the chosen target while respecting fit.",
      "Produce a panel cut list and sealing/assembly sequence."
    ],
    "deliverables": [
      "Native editable enclosure assembly.",
      "Dimensioned panel cut list and exploded view.",
      "Volume calculation worksheet with units and displacement assumptions.",
      "Driver clearance and fit notes with source references."
    ],
    "checks": [
      "Net volume calculation can be independently reproduced.",
      "Driver cutout is sourced to documentation, not guessed.",
      "All cut panels match the assembled geometry.",
      "Enclosure is labeled a design study pending real fit and acoustic validation."
    ]
  },
  {
    "slug": "sheet-metal-instrument-case",
    "title": "Sheet-metal instrument case",
    "level": "Advanced",
    "track": "Manufacturing drawings",
    "hours": "6–8 hours",
    "tools": "FreeCAD Sheet Metal or Fusion",
    "brief": "Create a bent-sheet instrument enclosure and a matching flat pattern. Demonstrate bend allowances, reliefs and manufacturing notes while keeping the exercise disconnected from energized circuitry.",
    "specs": [
      "Finished body envelope approximately 250 × 160 × 90 mm.",
      "Demonstration sheet thickness: 1.0 mm.",
      "At least four bends and two bend-relief features.",
      "Document the K-factor and bend radius as assumptions that need manufacturer confirmation."
    ],
    "steps": [
      "Model a base panel with measured material thickness.",
      "Create side flanges using a chosen bend radius.",
      "Add corner reliefs and removable cover interface.",
      "Create a flat pattern and label each bend direction.",
      "Compare unfolded length against the assumed bend parameters.",
      "Export a dimensioned drawing, flat pattern and assembly view."
    ],
    "deliverables": [
      "Native sheet-metal file with feature history.",
      "DXF flat pattern and PDF drawing.",
      "Bend table with radius, angle, direction and assumed K-factor.",
      "Manufacturability risks and revision notes."
    ],
    "checks": [
      "Flat pattern regenerates from the folded model.",
      "Bend assumptions are documented.",
      "Reliefs prevent geometric collisions.",
      "No claim is made that the model is production-certified."
    ]
  },
  {
    "slug": "mechanical-parts-assembly",
    "title": "Four-part mechanical desktop assembly",
    "level": "Advanced",
    "track": "Assembly design",
    "hours": "7–10 hours",
    "tools": "FreeCAD or Fusion",
    "brief": "Create an articulated, manually operated desk organizer assembly from four or more unique parts. Focus on constraints, fit, serviceability and realistic communication, not a safety-critical mechanism.",
    "specs": [
      "Four or more unique modeled parts.",
      "At least one pivoting or sliding relationship.",
      "Document two interface clearances and one interference test.",
      "Produce a bill of materials and exploded assembly drawing."
    ],
    "steps": [
      "Define functional requirements and a simple movement diagram.",
      "Model each part in its own named feature tree.",
      "Create joints or assembly constraints between the parts.",
      "Cycle the intended motion and check for part clashes.",
      "Specify material and fastener assumptions without overclaiming durability.",
      "Prepare exploded views, assembly sequence and a revision summary."
    ],
    "deliverables": [
      "Native parts and assembly file.",
      "Motion or joint screenshot series.",
      "Exploded diagram with item numbers.",
      "BOM and interface clearance table."
    ],
    "checks": [
      "All pieces are accounted for in the BOM.",
      "Joint behavior is explained or simulated.",
      "Interface clearances are measured or bounded.",
      "Revision notes identify at least one change made after checking."
    ]
  },
  {
    "slug": "reverse-engineered-desk-knob",
    "title": "Reverse-engineer a desk drawer knob",
    "level": "Advanced",
    "track": "Measurement + surfacing",
    "hours": "5–8 hours",
    "tools": "FreeCAD, Fusion or Blender",
    "brief": "Recreate a harmless household drawer knob from measurements. Compare its measured shape to the CAD model and clearly distinguish real observations from inferred geometry.",
    "specs": [
      "Use a removable non-safety-critical knob, not a vehicle or machinery control.",
      "Measure at least six independent dimensions with an identified instrument.",
      "Model at least one curved feature or loft/revolve.",
      "Create an annotated section view showing its internal geometry."
    ],
    "steps": [
      "Take top, front and side reference sketches with a ruler or caliper for scale.",
      "Record six dimensions and uncertainty in a measurement table.",
      "Build a constrained profile and a revolved or lofted solid.",
      "Add interface features but label inaccessible dimensions as assumptions.",
      "Compare the final model against a reference silhouette.",
      "Produce an inspection checklist and a prioritized next measurement."
    ],
    "deliverables": [
      "Native CAD solid and neutral export.",
      "Dimensioned reference sheet and section view.",
      "Measurement table including uncertainties.",
      "Comparison image and reflection on modeling errors."
    ],
    "checks": [
      "Model is based on a documented physical reference.",
      "Assumptions are visibly separated from measurements.",
      "Section and exterior views agree.",
      "The model can be edited without rebuilding from scratch."
    ]
  }
];
})();
