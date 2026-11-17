/* Lesson-specific teaching material. Keep assessment questions and completion rules unchanged. */
(function () {
  'use strict';
  const curriculum = window.CAD_CONTENT;
  if (!curriculum || !Array.isArray(curriculum.lessons)) return;
  const guides = {};
  function guide(id, concept, application, example, steps, question, answer, mistake) {
    guides[id] = { concept, application, example, steps, question, answer, mistake };
  }

  guide(1,
    'Computer-aided design is a way to describe an object so it can be changed and communicated. In 2D, lines, arcs, and dimensions describe views of a part. In parametric 3D, sketches and features describe a solid and preserve relationships between dimensions.',
    'Start with a need, then write measurable requirements. Separate what the object must do from the shape you happen to imagine. Geometry, material, manufacturing, and inspection are connected decisions; a good-looking model alone does not prove that a part fits or works.',
    'Imagine a phone stand. Measure the phone thickness and decide the range of viewing angles you want. A side sketch can show the support angle, while a front view shows the width. The phone thickness is an input; slot clearance must be chosen and tested rather than assumed.',
    ['Pick a simple household object and describe its job in one sentence.', 'Sketch a front and side view. Add labels for width, height, and one functional feature.', 'Measure or estimate each dimension; mark estimated values as assumptions.', 'Explain which dimension controls fit and how you would verify it.'],
    'What does a picture of a part leave uncertain?', 'It may show shape, but it usually does not establish exact dimensions, tolerances, material, or how fit will be checked.',
    'Do not treat a polished rendering as a manufacturing specification or proof of strength.');

  guide(2,
    'A project is more than one screenshot. Your native file is the editable source, such as a FreeCAD document; an export is a copy for a particular use, such as a drawing PDF or a STEP model. The native file may contain history and constraints that an exchange file does not.',
    'On Android you can organize notes, sketches, and photos now. For detailed CAD work, use a computer with a mouse or other precise pointer. Keep a second copy on a separate device or storage service and check that the backup can be opened.',
    'For a bracket, make a project folder with sketches, models, exports, and evidence. A name such as bracket_rev01.FCStd identifies a source and revision; bracket_rev01.pdf is a separate drawing. Record why a revision changed instead of naming files final-final.',
    ['Create the four folders and place a practice sketch in sketches.', 'Write a naming pattern that includes the part name and revision.', 'Keep your editable file in models and a separate exchange copy in exports.', 'Copy the folder to a second location and verify that a file opens.'],
    'Which copy would you edit to change a parametric dimension?', 'Use the native source file when possible; the PDF or neutral export may not retain the original feature history.',
    'Renaming a file extension does not convert its contents into another format.');

  guide(3,
    'Coordinates describe position from an origin, the point where axes meet. In a common 2D setup, X increases to the right and Y increases upward. A point written (30, 20) is 30 units along X and 20 along Y; the order matters.',
    'A dimension describes size or distance; a coordinate describes a location relative to a reference. Choose units before entering values. A drawing can have many possible origins, so explicitly state which corner or center is your reference.',
    'A plate from (0,0) to (100,60) has corners (0,0), (100,0), (100,60), and (0,60). Its width is 100 − 0 = 100 mm and height is 60 − 0 = 60 mm. One inch is exactly 25.4 mm.',
    ['On paper or your phone, draw X and Y axes and label their positive directions.', 'Plot the four plate corners and connect them in order.', 'Label width and height in millimeters and identify the origin.', 'Explain which view shows width and height and which view would show thickness.'],
    'Does moving the origin change the actual width of the plate?', 'No. Coordinates change relative to the new origin, but the distance between the two edges stays 100 mm.',
    'Do not swap X and Y, or mix inches and millimeters without converting.');

  guide(4,
    'A primitive is a simple geometric entity: a line, arc, circle, or rectangle. A circle needs a center and a size. Diameter measures across the circle through its center; radius runs from center to edge and is half the diameter.',
    'Constraints capture relationships that should remain true when a sketch changes. Coincident points meet, horizontal or vertical lines keep their direction, and equal circles share a size. Size constraints alone do not establish where a feature belongs.',
    'For a 120 × 70 mm plate with four Ø8 mm holes, each circle has radius 4 mm. One possible pattern has centers at (15,15), (105,15), (15,55), and (105,55), measured from the lower-left corner.',
    ['Draw the boundary as a 120 × 70 mm rectangle.', 'Add four separate circles with diameter, not radius, set to 8 mm.', 'Locate the centers using the stated X and Y values.', 'Check that each hole is 15 mm from its two nearest outer edges.'],
    'If the circle tool asks for radius, what value creates an 8 mm diameter?', 'Enter a radius of 4 mm because diameter equals twice the radius.',
    'Four equal holes can still be in the wrong places; verify their center positions as well as diameter.');

  guide(5,
    'LibreCAD is intended for desktop 2D drafting. Its drawing area shows entities such as lines and circles; layers organize those entities, and drawing settings establish units. A zoom action changes your view, not the dimensions of the underlying drawing.',
    'The interface varies by release, so learn the purpose of each tool instead of memorizing one screen layout. Save early, use meaningful layers, and enter exact coordinates or dimensions when accuracy matters.',
    'A starter drawing could have an OUTLINE layer for the plate and a DIMENSIONS layer for annotations. After selecting metric units, create and save the document before adding geometry. Confirm the chosen units again when exchanging the file.',
    ['On Android, make a short checklist: units, layers, drawing tools, save, and measure.', 'On desktop, create a new drawing and select millimeters in its drawing settings.', 'Find the line, circle, layer, and dimension tools; names may vary by version.', 'Save the editable drawing and reopen it to confirm the file is usable.'],
    'If a line looks longer after zooming in, did its model length change?', 'No. Zoom changes the display magnification; use the drawing properties or a measurement to check length.',
    'Do not assume a shape is accurate because it looks aligned at your current zoom level.');

  guide(6,
    'An absolute coordinate locates a point from the drawing origin. A relative coordinate describes an offset from a reference point. A snap identifies a geometric location such as an endpoint, midpoint, or center, while grid snap targets a grid position.',
    'For repeatable work, establish the datum first and enter known coordinates. Grid snapping is useful for rough placement but does not guarantee a specified dimension unless the grid, origin, and intended position agree.',
    'On a 120 × 70 mm plate, a center at (105,55) is 120 − 105 = 15 mm from the right edge and 70 − 55 = 15 mm from the top edge. Its position is measured to the center, not to the circumference.',
    ['Mark the lower-left corner as (0,0) and label X and Y.', 'Place the four specified centers using absolute coordinates.', 'Check the distances to the nearest edges by subtraction.', 'Use a center snap or a measurement tool to verify a circle’s center.'],
    'What is the top-edge offset of a hole at Y = 55 on a 70 mm-high plate?', '15 mm, measured from the hole center: 70 − 55 = 15.',
    'Avoid measuring hole offsets from the circle edge when the drawing specifies center locations.');

  guide(7,
    'A useful drawing communicates the shape, size, position, and relevant notes needed to make and inspect the part. Overall dimensions describe the envelope; location dimensions relate features to selected edges or datums; diameter marks the size of a round feature.',
    'Layers organize information such as visible outlines, centerlines, and dimensions. Place annotations where they are readable, use consistent units, and avoid duplicate dimensions that could disagree after an edit. Production tolerances must come from the actual design requirements.',
    'For the practice plate, show 120 mm width, 70 mm height, four Ø8 mm holes, and the center locations. A reader should be able to locate every hole without guessing. Mark any dimensions or tolerances that are assumed for this exercise.',
    ['Separate the outline and dimensions into named layers.', 'Add the overall width and height outside the outline.', 'Add the diameter and enough center dimensions to describe the pattern.', 'Ask a second person, or your future self, to locate a hole using only the drawing.'],
    'Why might repeating the same dimension in two places cause a problem?', 'If one copy is edited and the other is not, the drawing can give conflicting instructions.',
    'Do not invent production tolerances or rely on the visual size of an annotation.');

  guide(8,
    'DXF is an exchange format commonly used for 2D drawings. The receiving program may handle units, layers, text, or certain entities differently, so a successful export message is only the start of the check.',
    'The browser lab checks a particular practice geometry numerically. A pass is useful feedback for that local drawing; it does not, by itself, establish a reviewed portfolio submission or a certificate.',
    'For Project 1, the lab expects one 120 × 70 mm rectangle at the origin and four Ø8 mm circles centered at (15,15), (105,15), (15,55), and (105,55). Read the validator’s displayed tolerances and correct each reported feature.',
    ['Create the rectangle at (0,0) in the 2D lab.', 'Add four circles and enter the required centers and diameters.', 'Run the validator, read every result, and correct any mismatches.', 'Save the lab file; if using desktop CAD, reopen your exchange file and remeasure the plate.'],
    'Why open a DXF in the receiving application after export?', 'The open-and-measure check can reveal changed units, scale, missing entities, or layer differences.',
    'A screenshot cannot demonstrate exact editable geometry or replace the requested source file.');

  guide(9,
    'A parametric model records a sequence of relationships and operations. In FreeCAD, the model tree helps you inspect objects and features, while the viewport shows the current result. A workbench groups tools for a type of task; available layouts can change by version.',
    'A common Part Design workflow starts with a body, then creates a sketch on a plane and turns a closed profile into a feature. Naming files and features clearly makes it easier to return to the model and explain it to a reviewer.',
    'Think of a plate as a sketch of the outline followed by a thickness feature and a hole feature. The viewport shows the finished shape; the tree tells you which sketch and operations created it.',
    ['On a phone, draw a simple outline and list the features needed to make it three-dimensional.', 'On a desktop, launch FreeCAD and create a new document.', 'Find the model tree, Part Design tools, and Sketcher tools.', 'Save the document with a recognizable name before adding features.'],
    'What does the model tree provide that a rendered image cannot?', 'It shows editable objects and feature relationships, subject to how the model was built.',
    'A finished-looking solid is not evidence that its sketch or feature history is easy to edit.');

  guide(10,
    'A sketch has degrees of freedom when geometry can still move or change size. Geometric constraints express relationships such as coincidence and symmetry; dimensions specify quantities such as width or diameter. Apply only the constraints needed to express your intent.',
    'Fully constrained means the geometry’s size and position are defined in the sketch. It does not automatically mean the model reflects the right requirement. Read the solver feedback, and avoid adding a conflicting dimension to geometry already controlled by another relationship.',
    'An 80 × 50 mm rectangle centered on the origin extends from X = −40 to 40 and Y = −25 to 25. A Ø12 mm circle centered on the same origin has radius 6 mm. Change the rectangle width and check that the circle remains centered.',
    ['Create an 80 × 50 mm rectangle and relate its center to the origin.', 'Add a circle centered at the same origin and set its diameter to 12 mm.', 'Use geometric relationships and dimensions to remove unintended movement.', 'Inspect the solver status, then change the width and verify the circle stays centered.'],
    'Can a fully constrained sketch still be designed incorrectly?', 'Yes. It can be completely defined with the wrong dimensions or relationships, so compare it with the requirements.',
    'Do not resolve every issue by fixing geometry in place if that hides the relationships you intend to edit.');

  guide(11,
    'An extrusion or pad adds depth to a closed sketch profile. A pocket or cut removes material. A fillet rounds an edge, while a chamfer creates a beveled transition. The terminology differs among CAD programs, but the geometric ideas are shared.',
    'Build the main form first, then add the features required by the design. Check the direction and extent of a cut: a blind pocket has a specified depth, while a through cut must reach the other side of the part.',
    'Extrude an 80 × 50 mm rectangle by 6 mm. A centered Ø12 mm through-hole removes a cylindrical region all the way through the plate. Inspect from both faces or use a section view; a circle visible on one face alone is not enough.',
    ['Pad the closed 80 × 50 mm profile to a thickness of 6 mm.', 'Create or select a centered Ø12 mm circular sketch for the cut.', 'Set the cut to pass through the part and inspect both sides.', 'Add a small illustrative edge treatment and verify that important dimensions remain correct.'],
    'How would you distinguish a blind pocket from a through-hole?', 'Inspect the cut extent or a section: the through-hole breaks through the opposite face, while a blind pocket stops inside.',
    'A visually round edge does not specify a suitable production fillet or chamfer size.');

  guide(12,
    'A 3D model and a technical drawing serve different purposes. The model represents geometry; the drawing selects views, dimensions, notes, and revision information for communication and inspection.',
    'Keep the native file with its edit history, a STEP file for neutral solid exchange, and a PDF for drawing review. What transfers depends on the program and format, so inspect the actual export rather than assuming that constraints and history survived.',
    'For the 80 × 50 × 6 mm spacer with a centered Ø12 mm through-hole, the drawing should communicate the overall size, thickness, hole diameter, and location. A front or top view plus a thickness view can make the form understandable.',
    ['Save the native model using a clear revision name.', 'Create a drawing with the views and dimensions needed to interpret the spacer.', 'Export a STEP model and a PDF drawing to the exports folder.', 'Reopen both exports and check a known dimension, orientation, and missing annotations.'],
    'Why retain the native model after exporting STEP?', 'The neutral file may carry solid geometry but not the original sketches, constraints, and editable feature history.',
    'A drawing scale changes the view on the page, not the physical size written in a dimension.');

  guide(13,
    'Fusion and FreeCAD use different interfaces but share core ideas: sketches define profiles, constraints express relationships, and features build solids. Focus on those ideas first; the exact location or name of a command can change with software versions.',
    'Autodesk personal-use access has eligibility rules and feature limits. Review the current official terms for your intended use, especially commercial work. FreeCAD remains an alternative for the exercises; choosing a tool does not change the need to document and inspect your work.',
    'In either program, a plate can start as a constrained rectangle, receive thickness, and then receive a hole. Identify the sketch and the thickness feature in the program’s history or tree, and change one dimension to see which features depend on it.',
    ['Compare your computer and operating system with each tool’s current requirements.', 'Read the official Fusion personal-use terms before choosing that option.', 'In the tool available to you, locate a sketch, a feature, and the history or model tree.', 'Write down the native format and one neutral export that your intended reviewer can open.'],
    'Does a personal-use license automatically allow commercial production work?', 'No. Check the current license terms and eligibility for the specific use.',
    'Do not equate a particular button sequence with a transferable CAD skill.');

  guide(14,
    'Design intent describes the relationships that should remain true when a dimension changes. A hole may be intended to stay centered, or to remain a fixed distance from an edge; those are different design decisions even if the starting geometry looks identical.',
    'A feature history creates dependencies: an early sketch can drive later holes or cuts. Test important changes deliberately, inspect downstream features, and restore the original value after the exercise. Choose references that match the design requirement.',
    'A centered hole in a 60 mm-wide plate is 30 mm from either side. If the width changes to 65 mm, a centered hole should move to 32.5 mm from each side. A hole specified 10 mm from one edge should instead remain 10 mm from that edge.',
    ['Write whether each hole is centered or edge-offset before editing.', 'Change the width from 60 to 65 mm in the native model.', 'Inspect the hole positions and any downstream features.', 'Restore the original dimension and record whether the behavior matched your intent.'],
    'What should happen to the center of a centered hole when width changes from 60 to 65 mm?', 'Its center should be 32.5 mm from either side, assuming the reference remains the plate center.',
    'Matching an initial screenshot does not prove the model will update correctly.');

  guide(15,
    'A solid model represents an enclosed volume. A hole or slot removes material and must be defined by both size and position. A slot’s end shape matters: an obround slot has semicircular ends, while a rectangular cut has square corners unless otherwise specified.',
    'Before modeling, establish a reference origin, plate thickness, hole pattern, and slot location. The exercise does not specify every hole dimension, so choose and clearly label your own practice assumptions instead of presenting them as official requirements.',
    'For a 100 × 60 × 8 mm plate, a centered 30 × 10 mm slot is centered at (50,30) if the lower-left corner is (0,0). Its nominal bounding box extends from X = 35 to 65 and Y = 25 to 35. State whether its ends are rounded.',
    ['Sketch a 100 × 60 mm outline and extrude it to 8 mm.', 'Define and document a safe illustrative hole pattern and its assumed dimensions.', 'Add a centered 30 × 10 mm slot and specify the shape of its ends.', 'Inspect clearances and record one manufacturing or inspection question.'],
    'Where is the center of the plate if its lower-left corner is (0,0)?', 'At (50,30) mm, halfway across the 100 mm width and 60 mm height.',
    'A slot length and width alone do not establish its location or end shape.');

  guide(16,
    'A fair comparison evaluates the same requirements in each workflow: dimensions, constraints, editability, export quality, and the clarity of your evidence. A different feature sequence can be valid if it produces the intended result and remains understandable.',
    'You do not need to own two commercial programs to practice this skill. Complete the project in FreeCAD or an eligible Fusion setup, then compare the shared principles and document what you actually tested.',
    'Make one intentional parameter change, such as widening a plate, and capture the before-and-after dimensions. Save the native model and a neutral copy, reopen the latter, and note which dimensions or history are available.',
    ['Review the Project 3 brief and list its required dimensions and evidence.', 'Build the part in the desktop CAD program available to you.', 'Change one controlling dimension, inspect the result, and restore it.', 'Save native and neutral files and explain what you verified in each.'],
    'What is stronger evidence of parametric skill than naming a command?', 'Showing a controlled design change, the resulting geometry, and the editable source that records the relationships.',
    'Do not claim an export preserves feature history unless you have checked it.');

  guide(17,
    'A mesh represents a surface using vertices, edges, and faces. A parametric solid model generally captures geometry and feature relationships differently. A mesh can be useful for a product rendering, but it should not automatically replace the editable engineering model.',
    'Topology is the way mesh elements connect. A clean silhouette and sensible edge flow can make a visualization easier to edit, while scale and units still require attention. Program interfaces and import settings can vary by release.',
    'A simple cube has 8 vertices, 12 edges, and 6 quadrilateral faces before modifications. Select one face in an editing view and observe its boundary edges; this helps explain how a surface is constructed.',
    ['Create or open a simple box mesh in Blender on a desktop.', 'Enter an editing view and identify a vertex, an edge, and a face.', 'Inspect the object dimensions and the scene’s unit settings.', 'Save the editable .blend file and explain why it is separate from a native CAD model.'],
    'Does a smooth-looking mesh automatically include engineering constraints?', 'No. The mesh represents surface geometry; dimensions and parametric relationships may be absent.',
    'Do not assume that visual smoothness or a render confirms a part’s fit or strength.');

  guide(18,
    'Modifiers can apply repeatable changes to a mesh while keeping the underlying object editable, depending on the workflow. A bevel can give an edge a small highlight, making the form easier to read; excessive smoothing can change the apparent silhouette.',
    'Materials, lights, and camera position communicate the product’s shape. They are presentation choices, not measurements of the real material’s strength or surface finish. Keep a copy of the editable scene and identify what is a render.',
    'Place a simple model against a contrasting background. Use one main light to describe the broad form and a second, weaker fill light to reveal shadowed areas. Rotate the camera until the important features are visible without hiding the silhouette.',
    ['Save the mesh as a .blend source file.', 'Add a modest bevel modifier and compare the silhouette before and after.', 'Apply one material and position two lights with different roles.', 'Render an image, inspect readability, and save both the image and editable scene.'],
    'What does a highlight on a rendered edge tell you?', 'It helps communicate the shape under the chosen lighting; it does not establish the manufactured edge condition.',
    'Do not use lighting and materials to conceal a geometry or dimension problem.');

  guide(19,
    'Choose an exchange format for the information the recipient needs. A DXF is commonly used for 2D geometry, STEP for neutral solid geometry, and STL for triangulated meshes. OBJ and GLB can carry mesh or scene information, depending on the export and application.',
    'No single format guarantees that native constraints, feature history, units, materials, and annotations all survive. Keep the original source and record the receiving application, units, and checks performed on each export.',
    'If a 100 mm plate imports as 100 inches, the numbers may look familiar but the physical scale is wrong. Measure a known edge after import, inspect orientation, and compare the number of holes or other key features with the source.',
    ['List the native file and the purpose of each exchange format you plan to use.', 'Export an appropriate example from your desktop application.', 'Open it in the intended receiving program and measure a known feature.', 'Record any missing history, annotations, units, or visible geometry.'],
    'What is a useful first check after opening an exchanged model?', 'Measure a known feature in the intended units and compare it with the source model.',
    'An export that opens successfully can still be the wrong scale or missing important information.');

  guide(20,
    'An independent design starts with a problem statement, measurable requirements, and explicit assumptions. A reviewer should be able to distinguish your own work from supplied reference material and understand why you chose the geometry.',
    'A portfolio package should connect requirements to evidence: native source for editability, an appropriate neutral export, readable views and dimensions, and notes explaining the checks you performed. Do not disclose confidential material or claim a test you did not run.',
    'For the cable-bracket capstone, state what the bracket supports and the allowed mounting space. Measure actual items where available; label unknown loads or installation details as open questions. Show one design decision and how you checked its effect.',
    ['Read the capstone brief and write measurable requirements and unresolved questions.', 'Sketch at least two approaches and choose one with a short explanation.', 'Create the required model, drawing, and exports using your own decisions.', 'Check each requirement and prepare evidence that separates verified results from assumptions.'],
    'What makes a capstone independently reviewable?', 'A clear requirement-to-evidence trail, editable work, and an honest explanation of decisions and limitations.',
    'An attractive image or a self-confirmed lesson is not independent proof that a real part is safe.');

  guide(21,
    'A unit conversion changes the number used to describe a length, not the length itself. One inch is defined as exactly 25.4 millimeters. Multiply inches by 25.4 to get millimeters; divide millimeters by 25.4 to get inches.',
    'Always carry the unit through the calculation and round only to the precision appropriate for the measurement or requirement. A calculator displaying many digits does not mean the original measurement was that precise.',
    'For 2 in: 2 × 25.4 = 50.8 mm. For 5 in: 5 × 25.4 = 127 mm. In the other direction, 50.8 mm ÷ 25.4 = 2 in. The conversion factor is exact; a measured input may still be uncertain.',
    ['Write the starting number with its unit.', 'Choose multiplication for inches to millimeters or division for the reverse.', 'Calculate the three exercise values and label every answer.', 'Convert one answer back and check that it matches the starting value.'],
    'How many millimeters are in 1.5 inches?', '1.5 × 25.4 = 38.1 mm.',
    'Do not multiply a length conversion factor only once when converting square or cubic units.');

  guide(22,
    'Calipers commonly measure outside size with the large jaws, inside size with the smaller jaws, and depth with a depth rod. Inspect and clean the measuring faces, check zero according to the instrument instructions, and use gentle, consistent contact.',
    'Keep the jaws aligned with the feature rather than tilted across it. Measure a safe, accessible object at several positions and record the unit and instrument resolution. Resolution is the smallest displayed increment, not a guarantee of measurement accuracy.',
    'Suppose a practice block reads 20.02, 20.04, and 20.03 mm across three positions. The observed range is 20.04 − 20.02 = 0.02 mm. That range alone does not account for calibration, alignment, or the block’s actual geometry.',
    ['Clean the jaws and check zero as directed by the caliper maker.', 'Measure an outside width without squeezing or tilting the jaws.', 'Repeat at three positions and write the readings with units.', 'Calculate the range and describe one possible source of error.'],
    'Does a 0.01 mm display increment guarantee a measurement is accurate to 0.01 mm?', 'No. Instrument calibration, alignment, contact force, temperature, and the method also affect the result.',
    'Do not force caliper jaws onto a feature or measure moving machinery.');

  guide(23,
    'A coordinate system uses an origin and directions to give positions meaning. In a 2D sketch, X and Y are ordered values; positive and negative signs indicate direction from the origin. The same physical part can be described from different valid origins.',
    'Select a reference that matches the drawing or inspection plan. Coordinates are positions, so a distance between points is found by comparing their coordinates, not by adding their values indiscriminately.',
    'A point at (15,10) and another at (65,10) share the same Y coordinate. Their horizontal separation is 65 − 15 = 50 mm. If the origin moves 5 mm right, both X values change, but the separation remains 50 mm.',
    ['Draw two perpendicular axes and label the origin and positive directions.', 'Plot points (15,10) and (65,10) in millimeters.', 'Calculate their horizontal separation.', 'Move the origin on paper and explain why the physical spacing stays the same.'],
    'What does a negative X value mean?', 'The point is on the negative side of the chosen X axis relative to the origin.',
    'A coordinate without an origin, axis direction, and unit is incomplete information.');

  guide(24,
    'A right triangle has one 90-degree angle. The legs meet at that angle, and the hypotenuse is opposite it. Pythagoras relates their lengths: hypotenuse squared equals the sum of the squares of the two legs.',
    'Slope compares rise to run. Keep the order explicit: rise divided by run is a ratio; an angle is a different quantity. For a right triangle, a calculator can use the inverse tangent of rise divided by run to find the angle from the horizontal.',
    'For a 30 mm run and 40 mm rise, the hypotenuse is √(30² + 40²) = √2500 = 50 mm. The rise/run slope is 40/30 ≈ 1.333; the angle from horizontal is approximately 53.1 degrees.',
    ['Draw the horizontal run and vertical rise and mark the 90-degree corner.', 'Square the two leg lengths, add them, and take the square root.', 'Calculate rise divided by run and label it as a ratio.', 'Use a calculator in degree mode to check the angle if available.'],
    'Is 1.333 a slope ratio or an angle in degrees?', 'It is the rise/run ratio. The corresponding angle is approximately 53.1 degrees.',
    'Use the right-triangle formula only when the angle between the two legs is 90 degrees.');

  guide(25,
    'A nominal dimension is the target size; a tolerance states permitted variation under the applicable drawing convention. For a symmetric tolerance, add the tolerance to find the upper limit and subtract it to find the lower limit.',
    'A real design may use unequal limits, a general tolerance note, or other controls. Do not invent a tolerance based on a screenshot. For production, read the governing drawing and confirm the inspection method and decision rules.',
    'For 20.00 ± 0.20 mm, the lower limit is 20.00 − 0.20 = 19.80 mm and the upper limit is 20.00 + 0.20 = 20.20 mm. A 20.10 mm reading lies within those stated limits, before considering any applicable measurement uncertainty or decision rule.',
    ['Write the nominal value and tolerance with units.', 'Calculate the minimum and maximum permitted dimensions.', 'Compare sample values of 19.75, 20.10, and 20.25 mm with those limits.', 'Record which rule or drawing note supplied the tolerance.'],
    'Is 19.75 mm within 20.00 ± 0.20 mm?', 'No. The stated lower limit is 19.80 mm.',
    'A nominal value by itself does not define the acceptable manufacturing range.');

  guide(26,
    'Repeatability is the closeness of repeated measurements under stated conditions. Accuracy concerns closeness to a reference. A set of readings can be tightly grouped and still be shifted by a common bias, such as a zero error.',
    'Measurement uncertainty summarizes doubt associated with a result under a stated method. Tool resolution, calibration, alignment, temperature, surface condition, and the person’s technique can contribute. A few repeat readings do not capture all of those effects.',
    'Readings of 10.01, 10.02, and 10.01 mm have a range of 0.01 mm and an average of approximately 10.013 mm. If the instrument has an unrecognized zero offset, all three can be shifted in the same direction.',
    ['Measure the same feature three times using the same method.', 'Record the instrument, unit, and readings.', 'Find the largest minus the smallest reading.', 'Name one error that repetition alone would not reveal.'],
    'Can repeated readings be consistent but inaccurate?', 'Yes. A systematic bias can affect every reading similarly.',
    'Do not report more meaningful precision than the instrument and method support.');

  guide(27,
    'A title block identifies a drawing and provides context such as part name, identifier, revision, units, and scale when included. Notes, symbols, and revision records may appear elsewhere. Their exact arrangement depends on the organization or standard.',
    'Before interpreting a feature, check that you have the intended part and current revision. Then identify views, dimensions, units, applicable notes, and any stated projection convention. A filename by itself is not a reliable revision control.',
    'Two drawings both named bracket.pdf could be different revisions. If one title block says BR-101 revision A and the other says BR-101 revision B, identify which one is authorized for the task before comparing dimensions.',
    ['Create a title block for a practice plate with a part name and identifier.', 'Add units, an illustrative revision, and a date.', 'Write one note stating the purpose of the drawing.', 'Describe how you would verify which revision a reviewer should use.'],
    'Why is a filename alone insufficient to identify the current drawing?', 'Different files can share a name, and a filename may not reflect the approved part identity or revision.',
    'Do not assume every drawing uses the same units, scale, projection, or tolerance convention.');

  guide(28,
    'Orthographic views show an object from perpendicular directions without perspective convergence. A front view may show width and height; a top view can show width and depth; a side view can show depth and height.',
    'Related features should align across the views. A through-hole can appear circular when viewed along its axis and as parallel edges or hidden lines from the side. The placement of views depends on the stated projection convention.',
    'For a 100 mm wide, 60 mm deep, and 10 mm thick block, a top view shows 100 × 60 mm, while a front view can show 100 × 10 mm. The width is shared between those two views.',
    ['Sketch the top, front, and side views of a simple block.', 'Label width, depth, and thickness in each view where visible.', 'Draw one hole and show how it appears from two directions.', 'Check the projection symbol or note before assuming the arrangement of views.'],
    'Which dimension is shared by the example top and front views?', 'The 100 mm width appears in both the top and front views.',
    'Do not infer part depth from a single view when another view or note is needed.');

  guide(29,
    'A section view imagines a cut through an object so internal features can be shown clearly. A cutting-plane indication tells the reader where the view is taken. A detail view enlarges a selected area to make a small feature easier to interpret.',
    'Hatching, hidden-line conventions, section labels, and scale follow the drawing’s applicable standard and local practice. The goal is to communicate the actual geometry without adding or omitting a functional feature.',
    'For a hollow cylinder, an end view shows two concentric circles. A lengthwise section can make the wall thickness and internal opening easier to see. Label the cutting plane and relate the section to the original view.',
    ['Sketch a hollow cylinder in an end view.', 'Draw and label a cutting plane through its axis.', 'Sketch the corresponding lengthwise section and identify the wall material.', 'Circle a small feature that would benefit from an enlarged detail.'],
    'Why might a section view be clearer than a standard exterior view?', 'It can reveal internal geometry that would otherwise require several hidden lines or remain ambiguous.',
    'An enlarged detail can have a different view scale; the written dimensions still describe the part.');

  guide(30,
    'A complete hole pattern needs the feature size, quantity, and location relative to usable references. Describe whether the dimension goes to a center, edge, or another feature. If holes are equally spaced or symmetric, show those relationships clearly.',
    'Choose dimensions that support both fabrication and inspection. Avoid adding unnecessary duplicate dimensions that could conflict. Any tolerances or geometric controls for a real part must be chosen from its functional requirements.',
    'On a 120 × 70 mm plate, the centers (15,15), (105,15), (15,55), and (105,55) form a 90 × 40 mm center-to-center pattern. The values come from 105 − 15 = 90 and 55 − 15 = 40.',
    ['Draw the plate and establish the lower-left corner as the origin.', 'Plot all four hole centers using their X and Y coordinates.', 'Compute the horizontal and vertical center spacing.', 'Add a quantity and diameter callout and check that the drawing does not rely on visual guesses.'],
    'What is the horizontal center-to-center spacing in the example?', '90 mm: 105 − 15 = 90.',
    'A hole diameter callout alone does not describe the positions of the holes.');

  guide(31,
    'Drawing scale compares the size of a representation to the actual part. At 1:2, one unit on the drawing represents two units on the part; at 2:1, the drawing is twice the actual size. A written dimension normally states the part size, not a measurement taken from the page.',
    'Screens and printers can resize a page. Check the drawing’s stated scale and print settings, but use the written dimensions as the governing information unless the drawing explicitly instructs otherwise.',
    'A 100 mm feature drawn at 1:2 occupies 50 mm on the page. If a printer applies an additional fit-to-page setting, a ruler reading on that print may no longer match the stated visual scale, while the labeled part dimension is still 100 mm.',
    ['Sketch a line representing a 100 mm feature at 1:2 scale.', 'Measure 50 mm on the paper and label the feature 100 mm.', 'Compare the effect of printing at actual size and fit to page.', 'Explain why you would not manufacture from a ruler measurement of the print.'],
    'At 2:1 scale, how long is the drawing representation of a 20 mm feature?', '40 mm on the drawing, while the actual feature is specified as 20 mm.',
    'Never assume an image displayed on a phone is at a reliable physical scale.');

  guide(32,
    'A degree of freedom is a way geometry can move or change. In a basic unconstrained 2D sketch, a circle can move in X and Y and change its radius. Constraints reduce those freedoms by specifying positions, sizes, or relationships.',
    'Geometric constraints describe relationships; dimensional constraints describe values. A useful sketch captures the intended relationship rather than merely freezing a convenient arrangement. Solver feedback helps identify remaining movement or conflicting constraints.',
    'A free circle centered at (20,15) with radius 5 can slide in two directions and change size. Constraining its center to the origin removes the position freedoms; setting its diameter to 10 mm controls its size.',
    ['Sketch a free circle and identify how it can move or resize.', 'Constrain the center to a chosen origin or reference.', 'Apply a 10 mm diameter dimension.', 'Try moving the circle and interpret the solver’s status.'],
    'How many basic freedoms does an unconstrained 2D circle have?', 'Three in this simple model: X position, Y position, and radius.',
    'A fully constrained sketch can still encode the wrong design intent.');

  guide(33,
    'A parameter is a named or editable value that can drive geometry. A feature history records operations and dependencies. Giving important dimensions clear names makes a model easier to adjust and review.',
    'Plan which values are independent and which should be derived. If the intent is for a hole to stay centered, relate its position to half the width rather than entering a separate fixed number that must be updated manually.',
    'For a plate with width W = 100 mm and height H = 60 mm, its center is (W/2, H/2) = (50,30) mm. If W becomes 110 mm, the center X becomes 55 mm while the Y value stays 30 mm.',
    ['List width, height, and thickness as controlling dimensions.', 'Write an expression for the plate center using width and height.', 'Change the width on paper or in CAD and recalculate the center.', 'Inspect which dependent features should update and document the result.'],
    'If W becomes 110 mm, where is a centered feature along X from the left edge?', '55 mm, because W/2 = 110/2.',
    'Repeatedly entering the same number is not the same as linking dimensions.');

  guide(34,
    'A reference is geometry or a datum used to locate another feature. References that correspond to design intent can make changes easier to understand. For example, a center plane can express symmetry more clearly than a guessed offset.',
    'Some generated edges or faces can change identity when earlier features are modified; exact behavior depends on the CAD program. Use appropriate stable reference geometry where practical and test the actual model after significant changes.',
    'A centered slot can be tied to the plate’s center planes rather than positioned with an unrelated number. If the plate grows, the slot should remain centered. Test the relationship by changing width, then inspect the model for errors.',
    ['Identify a feature and the reference currently locating it.', 'State the intended relationship in ordinary words.', 'Choose an appropriate origin, plane, or other reference in your CAD tool.', 'Change an upstream dimension and check whether the feature still behaves as intended.'],
    'What makes a reference useful?', 'It reflects the intended relationship and remains understandable and reliable for the changes the model must support.',
    'No reference strategy guarantees that every future model edit will be stable; test significant changes.');

  guide(35,
    'A pattern repeats a feature using a defined count and spacing; symmetry relates features around a centerline or plane. These relationships make the model easier to update than several unrelated copies when repetition is part of the design intent.',
    'Specify what the count includes, the direction of spacing, and the reference for the first feature. Verify both the individual feature and the overall pattern. Some programs use total extent instead of spacing, so read the setting carefully.',
    'Four holes at (15,15), (105,15), (15,55), and (105,55) make two columns 90 mm apart and two rows 40 mm apart. The pattern is symmetric about X = 60 and Y = 35 on a 120 × 70 mm plate.',
    ['Place one seed hole using a clear reference.', 'Create or sketch two columns and two rows with 90 mm and 40 mm center spacing.', 'Check the total hole count and all four positions.', 'Change a controlling dimension and see whether the intended symmetry remains.'],
    'Where are the centerlines of a 120 × 70 mm plate?', 'At X = 60 mm and Y = 35 mm when measured from the lower-left origin.',
    'Do not confuse pattern spacing with the distance between the first and last item when the count is greater than two.');

  guide(36,
    'A native CAD document is usually the best place to keep editable sketches and history. A neutral solid file helps exchange geometry between applications; a PDF communicates a drawing; a mesh file represents a triangulated or polygonal surface.',
    'Select a format based on the task and check the receiving program’s behavior. Some formats may not carry units, colors, annotations, or parametric history in the way you expect. Retain the source and version your exports.',
    'A practice package might contain bracket_rev01.FCStd as the native source, bracket_rev01.step for a neutral 3D model, and bracket_rev01.pdf for the dimensioned drawing. Reopen each one and verify that it serves its stated purpose.',
    ['Identify the software and native format used for your project.', 'Choose a neutral 3D format and a drawing format for the recipient.', 'Export copies without overwriting the native source.', 'Open each copy and document one thing that did or did not transfer.'],
    'Which file is most likely to retain the original editable feature tree?', 'The native CAD file, although the exact contents depend on how the model was saved.',
    'Changing the extension of a file does not create a valid export.');

  guide(37,
    'Clearance is the space between mating features when the opening is larger than the inserted part. Interference occurs when the part is larger than the opening. Nominal values alone do not describe every possible fit when both features have tolerances.',
    'To evaluate a range, compare the smallest hole with the largest pin for minimum clearance, and the largest hole with the smallest pin for maximum clearance. This simple calculation assumes the stated size limits apply; real fits may require additional geometric and functional controls.',
    'A 12.3 mm opening and 12.0 mm pin have 0.3 mm nominal diametral clearance. If the opening ranges from 12.25 to 12.35 mm and the pin from 11.95 to 12.05 mm, clearance ranges from 0.20 to 0.40 mm.',
    ['Subtract the nominal pin diameter from the nominal opening diameter.', 'Write the minimum and maximum size of each feature.', 'Calculate minimum clearance using the smallest opening and largest pin.', 'Calculate maximum clearance using the largest opening and smallest pin.'],
    'What is the minimum clearance in the worked example?', '12.25 − 12.05 = 0.20 mm.',
    'Do not assume nominal clearance alone proves that every manufactured pair will fit.');

  guide(38,
    'A tolerance stack combines variations of dimensions that affect a result. In a simple worst-case stack, use the extreme permitted value of each dimension in the direction that makes the result smallest or largest.',
    'Draw the dimension path first and record whether each term is added or subtracted. Worst-case arithmetic is conservative for the stated limits; statistical approaches require assumptions and data that this introductory exercise does not supply.',
    'For 30.0 ± 0.2 mm plus 10.0 ± 0.1 mm, the smallest sum is 29.8 + 9.9 = 39.7 mm; the largest is 30.2 + 10.1 = 40.3 mm. The nominal sum is 40.0 mm. These extremes do not predict how frequently a measured assembly will fall near either limit.',
    ['Write the dimension path as an equation with units.', 'Find the minimum and maximum of each contributing dimension.', 'Add the minima for the smallest sum and the maxima for the largest.', 'Compare the resulting range with the assembly requirement, if one is known.'],
    'What is the worst-case range of the worked sum?', 'The minimum is 39.7 mm and the maximum is 40.3 mm.',
    'Do not use simple worst-case addition blindly when a dimension is subtracted; draw the path and choose the correct extremes.');

  guide(39,
    'Geometric dimensioning and tolerancing can control aspects of form, orientation, location, or runout that simple size limits do not fully describe. A datum is a theoretically exact reference established from specified datum features under the applicable standard.',
    'This lesson introduces the purpose of those controls; it does not teach every symbol or replace the governing drawing standard. A real inspection plan must interpret the complete feature control frame, datum references, modifiers, and applicable standard.',
    'Imagine a plate bolted flat against a wall. The contact surface is a candidate datum feature because it establishes a meaningful reference for how the plate sits. Additional features may be needed to locate and orient the part completely.',
    ['Sketch the plate against a wall and identify the contacting surface.', 'Explain why that surface matters to the installation.', 'Mark one hole whose position matters relative to that surface.', 'List what you would need to know before interpreting a real geometric control.'],
    'Is a datum feature the same thing as the theoretical datum established from it?', 'No. The feature is the physical part feature; the datum is the theoretical reference established according to the applicable rules.',
    'Do not assign a production GD&T callout from an introductory example without the governing standard and design review.');

  guide(40,
    'A fastener joint involves the fastener, clearance or threaded features, clamped parts, and the surrounding installation space. A complete specification can include thread size and pitch, length, material or grade, quantity, and any required washers or locking method.',
    'Model enough space to install and tighten the fastener. A clearance hole and a tapped hole serve different purposes, and the correct sizes depend on the actual fastener and design standard. Follow the responsible manufacturer or engineering specification for production work.',
    'For two plates joined by a screw, one plate may have a clearance hole while the other contains a threaded feature. Sketch the screw head, the material thicknesses, and tool access. The required screw length depends on the full joint, not the visible head alone.',
    ['Sketch two plates and identify the intended screw direction.', 'Label which feature provides clearance and which provides threads or a nut.', 'Check that the head and installation tool have room.', 'List the missing fastener specifications rather than guessing a production size.'],
    'Why is a clearance hole different from a tapped hole?', 'A clearance hole allows the fastener to pass; a tapped hole contains internal threads intended to engage it.',
    'Do not invent a torque, thread engagement, or fastener grade from a generic practice model.');

  guide(41,
    'Material selection begins with the part’s function and environment. Relevant factors may include stiffness, strength, temperature, moisture, corrosion, electrical behavior, mass, cost, availability, and the intended manufacturing process.',
    'A material name alone is often not enough: grade, condition, direction, and manufacturing process can affect properties. Use appropriate supplier data and qualified engineering review for real parts; do not infer performance from color or a render.',
    'For a noncritical protective cover, the requirements might include a maximum mass, resistance to a specified cleaning agent, and a target operating temperature. Compare candidate materials against those stated requirements rather than choosing the one with the highest single strength value.',
    ['Write three measurable requirements for a protective cover.', 'Identify the intended environment and manufacturing process.', 'Compare two possible material families using reliable property sources.', 'Record missing data and the tests needed before making a real selection.'],
    'Why might the strongest material on a list not be the best choice?', 'The part may also need specific stiffness, corrosion resistance, weight, manufacturability, or cost.',
    'Do not treat an illustrative material comparison as proof that a part is safe for a critical load.');

  guide(42,
    'Machining removes material using tools that must reach and cut the intended surfaces. Designers should consider how a part can be held, how the tool accesses features, whether internal corners are compatible with the process, and how features will be inspected.',
    'A design that is easy to model can still be difficult to manufacture. Discuss material, tolerances, finish, quantities, and available equipment with the manufacturer rather than assuming a particular machine or cutting method.',
    'Compare an open rectangular pocket with a deep enclosed pocket. The enclosed pocket may limit tool access; a rotary cutter also leaves an inside corner radius related to the cutter geometry. The actual allowable radius must be agreed for the part and process.',
    ['Sketch an open pocket and a difficult-to-reach pocket.', 'Mark the direction from which a tool might reach each feature.', 'Identify a surface that could hold or locate the part during machining.', 'Write one inspection or manufacturing question to discuss with a shop.'],
    'Why should an internal corner be considered when using a rotary cutter?', 'The cutter geometry generally produces a radius rather than a perfectly sharp internal corner.',
    'Do not assume a particular machine, tool, or cutting parameter is suitable without the manufacturer’s process plan.');

  guide(43,
    'A sheet-metal part has a material thickness, flat regions, and bends that change the relationship between outside dimensions and the flat blank. Bend allowance depends on material, thickness, bend geometry, tooling, and the method used by the fabricator.',
    'A CAD sheet-metal tool can estimate a flat pattern using its configured values, but an accurate production blank depends on verified process data. Consider bend relief, hole proximity, and access as design questions to review with the fabricator.',
    'A U-channel has a base and two flanges. The flat blank is not necessarily the simple sum of the three outside dimensions because the material deforms around each bend. Label thickness and bend locations before requesting a flat pattern.',
    ['Sketch a base and two flanges as a U-shaped channel.', 'Mark material thickness and both bend lines.', 'Identify a hole or edge that might be affected by a bend.', 'List the material and tooling data a fabricator needs to confirm a blank.'],
    'Why is a flat blank not always the sum of the outside flange dimensions?', 'The material deforms through the bend, and the appropriate allowance depends on the process and geometry.',
    'Do not send a generic bend calculation to production as a verified flat pattern.');

  guide(44,
    'Additive manufacturing builds geometry in layers or related process steps. Orientation can affect supports, surface quality, dimensional behavior, and how load relates to the layers. Different materials and machines behave differently.',
    'An STL or other mesh must be suitable for the chosen process, and a slicer preview is useful for examining layers and supports. A successful print does not prove that a part will carry a critical load or withstand heat and environmental exposure.',
    'A small bracket printed flat and the same bracket printed upright may need different supports and place layer interfaces in different directions. Compare the two orientations, then measure a noncritical test feature on a sample print.',
    ['Sketch the bracket in two possible print orientations.', 'Mark overhangs and locations that may require support.', 'Describe how layer direction relates to an illustrative load.', 'After an appropriate test print, measure a fit-critical feature and record the material and settings.'],
    'Does a printable mesh automatically prove that a part is safe under load?', 'No. Material, orientation, manufacturing variation, loads, and suitable testing all matter.',
    'Do not use an unverified printed part for a safety-critical application.');

  guide(45,
    'Different surfaces serve different functions: a hand-contact edge, sealing face, bearing surface, and decorative exterior do not necessarily need the same condition. Drawings can communicate surface and edge requirements using an applicable convention.',
    'Surface finish, edge breaks, and coatings must be chosen for the function, material, process, and inspection method. A polished rendering gives no reliable measurement of manufactured roughness, and a generic edge note may not meet a critical requirement.',
    'On a protective cover, a handled edge may need a defined treatment to reduce sharpness, while a sealing surface may require a separate specification matched to the seal. Record the actual functional need before choosing a value.',
    ['Pick an object with at least two different functional surfaces.', 'Describe the job of each surface and one possible failure or handling concern.', 'Identify which surface would need a more specific manufacturing note.', 'Ask how the stated condition would be inspected.'],
    'Does a shiny image establish the manufactured surface finish?', 'No. A finish requirement needs an applicable specification and suitable inspection.',
    'Do not invent a roughness or edge-treatment value for a critical interface.');

  guide(46,
    'An assembly model represents multiple components and their relationships. Constraints or joints can align axes, establish distances, or permit intended motion. Naming and solver behavior vary by CAD package.',
    'Decide which component is fixed as the reference, then allow only the intended motion. Model motion is useful for finding questions, but it does not establish real clearances, fastener strength, load capacity, or safety by itself.',
    'A simple hinge has two leaves and a pin. Align the pin and leaf axes and allow rotation about that shared axis. The assembly still needs appropriate clearance and a way to keep the pin in place, neither of which is proven by an animation.',
    ['Sketch two hinge leaves and a separate pin.', 'Mark the common axis and the intended rotation.', 'Identify which component is fixed in your model.', 'List one real clearance and one motion limit that still need verification.'],
    'What motion should a simple hinge generally permit?', 'Rotation about its intended pin axis, subject to the actual design and motion limits.',
    'A solver that moves smoothly does not prove that the physical assembly will fit.');

  guide(47,
    'An interference check can identify overlapping modeled solids in a particular configuration. A clearance measurement reports a modeled separation. Both are limited by the geometry, positions, and assumptions included in the model.',
    'For moving parts, inspect relevant positions throughout the range, not just one frame. Consider installation access, fastener tools, tolerances, deflection, and any components omitted from the simplified model.',
    'A lever may clear its housing at the starting position but collide near the end of travel. Check several positions or use an appropriate motion study, then consider whether the minimum clearance remains adequate when parts vary within their specified limits.',
    ['Sketch the lever and housing and mark the intended range of motion.', 'Identify the positions most likely to cause contact.', 'Check modeled interference and record the minimum observed clearance.', 'List physical effects or tolerances the model does not capture.'],
    'Why is a single static interference check incomplete for a moving lever?', 'The geometry can clear in one position and collide at another.',
    'A zero-overlap result is not proof of adequate clearance in all operating conditions.');

  guide(48,
    'An inspection plan connects each measurable requirement to a feature, instrument or method, acceptance limits, and a way to record the result. Use the current drawing revision and the decision rules applicable to the work.',
    'Choose a method capable of measuring the feature and consider the measurement uncertainty appropriate to the requirement. A visual check may confirm a label or obvious damage, but it cannot replace a dimensional measurement where one is required.',
    'For a practice plate, list overall width, height, hole diameter, and center spacing. If the width requirement is 120.0 ± 0.5 mm, the limits are 119.5 to 120.5 mm. Record a sample result and the measuring method rather than writing only pass.',
    ['Select four measurable requirements from a practice drawing.', 'Write the applicable units and acceptance limits for each.', 'Choose a plausible method or instrument and record a sample result.', 'Identify the drawing revision and any uncertainty or decision-rule questions.'],
    'What are the limits for 120.0 ± 0.5 mm?', 'The lower limit is 119.5 mm and the upper limit is 120.5 mm.',
    'Do not certify a critical feature from an incomplete plan or an unsuitable instrument.');

  guide(49,
    'Finite element analysis approximates physical behavior by dividing a model into elements and applying material properties, loads, and boundary conditions. The results depend on those inputs and on the simplifying assumptions in the model.',
    'A useful analysis states the question it is trying to answer and checks whether the results make physical sense. Mesh sensitivity, unit consistency, hand calculations where appropriate, and qualified review are part of establishing confidence.',
    'For a bracket, identify where it is supported and where the load is applied before looking at a stress plot. If a support is modeled as perfectly fixed but the real connection flexes, the result may not represent the actual installation.',
    ['Sketch a bracket and mark one illustrative load and support.', 'List the material and three modeling assumptions you would need.', 'Identify a result you would compare with a simple independent estimate.', 'Explain what qualified review would be needed for a real safety-relevant decision.'],
    'Why is a colorful stress plot insufficient by itself?', 'It can look convincing even when loads, constraints, material data, units, or mesh assumptions are wrong.',
    'Do not treat an introductory simulation example as proof of structural safety.');

  guide(50,
    'A requirement describes a necessary function or constraint in a way that can be checked. A target is a desired result; an assumption is an unverified condition. Keep those categories separate so reviewers know what has actually been established.',
    'For each requirement, identify a verification method and a source. Avoid vague words such as strong or compact without a defined measure. Do not invent loads or safety factors for a real application when those inputs are unknown.',
    'For a practice phone stand, “accommodate a phone up to 80 mm wide” is more testable than “fit most phones.” Record the device dimensions, any case allowance, and a physical or modeled fit check; other requirements may need further information.',
    ['Write three requirements for the phone stand using measurable language.', 'Mark any unknown values as assumptions or open questions.', 'Choose a way to verify each requirement.', 'Review whether someone else could tell if the finished design meets each one.'],
    'Why is “looks good” hard to verify as an engineering requirement?', 'It does not define an agreed measurable or otherwise assessable acceptance criterion.',
    'Do not report an assumption as a measured requirement or a completed test.');

  guide(51,
    'A revision identifies a particular state of a design. A useful change record says what changed, why it changed, which related files are affected, and what review or approval the organization requires.',
    'Changing a model can affect drawings, exports, bills of materials, and inspection plans. Confirm that the released package is internally consistent and that recipients know which revision supersedes the earlier one.',
    'If a mounting hole moves, update the native model and drawing, regenerate the exchange files, and record the reason for the change. Check that the dimensions and revision identifiers agree before handing the package to a reviewer.',
    ['Make an illustrative change to a practice model or drawing.', 'Write the old value, new value, and reason for the change.', 'List the files that need updating or re-exporting.', 'Compare the model and drawing and record the revised identifier.'],
    'Why can renaming a single file be an incomplete change process?', 'Related models, drawings, exports, and records can remain inconsistent or point to the older revision.',
    'Do not discard or overwrite an approved revision if the organization requires it to be retained.');

  guide(52,
    'A bill of materials, or BOM, is a structured list of assembly components. Common fields include part identifier, description, quantity, and revision; additional fields depend on whether the list supports design, manufacturing, purchasing, or another task.',
    'Distinguish one line item from the quantity of that item. Match the BOM to the assembly and drawings, and identify whether standard hardware is represented separately. A practice BOM is not automatically an approved purchasing document.',
    'A phone-stand assembly might list one base, one support, two screws, and two nuts. That is four line items but six individual pieces. Add part identifiers and illustrative revisions so a reviewer can identify each item.',
    ['Sketch a simple assembly with at least four kinds of component.', 'Create a line for each part type with its identifier, description, quantity, and revision.', 'Count the physical pieces and compare them with the assembly.', 'Flag any unspecified hardware or material as an open item.'],
    'How many physical pieces are in the example BOM?', 'Six: one base, one support, two screws, and two nuts.',
    'A BOM does not replace the drawings and specifications needed to define each part.');

  guide(53,
    'A strong portfolio explains the problem, constraints, your contribution, decisions, and evidence. A reviewer should be able to see what you designed, what you checked, and what remains uncertain without relying on unsupported claims.',
    'Choose evidence appropriate to the work: a readable dimensioned drawing, a permitted native file, an exchange copy, and a concise explanation of verification. Remove confidential information and obtain permission before sharing employer or customer work.',
    'For a mounting plate, link the 120 × 70 mm requirement to a drawing, show the Ø8 mm hole pattern, and include the native or lab file when appropriate. Describe a dimensional check and make clear whether it was a local practice check or independent review.',
    ['Write a short problem statement and identify your own role.', 'List the requirements and link each to a drawing, file, or recorded check.', 'Explain one design decision or change made after feedback.', 'State limitations and remove information you do not have permission to publish.'],
    'What makes a portfolio claim more credible?', 'Specific evidence that another person can inspect, together with an honest description of what was and was not verified.',
    'A self-check or course completion does not by itself grant a professional license or guarantee employment.');

  curriculum.lessons.forEach(function (lesson) {
    if (guides[lesson.id]) lesson.guide = guides[lesson.id];
  });
})();
