/* Additional learning content. Practice-only lessons do not change certificate rules. */
(function () {
  'use strict';
  const curriculum = window.CAD_CONTENT;
  if (!curriculum || !Array.isArray(curriculum.lessons)) return;
  const coreDetails = [
    ['A useful model answers a question: what shape must fit, move, carry a load, or be made? Begin with the object’s purpose before choosing a command. A drawing communicates the dimensions and notes someone needs to make or inspect it.', 'For a phone stand, sketch the support, base, and slot. Record the phone thickness and desired viewing angle; label these as requirements, not dimensions guessed from a picture.', ['Choose a familiar object and write what it must do.', 'Sketch two views and mark at least three dimensions.', 'Explain which dimension would prevent the object from fitting.']],
    ['Keep an editable source separate from exports: the source retains the model history, while an exported file is prepared for a particular receiver or process. Save a dated copy before major changes and keep a backup outside the device.', 'A project folder might contain sketches, native models, drawings, and exports. Use names such as bracket_v01 rather than final-final; record what changed and check that the file opens on another device.', ['Create the four suggested folders on your phone or computer.', 'Save a sketch and write a short file-naming rule.', 'Explain which file is editable and which is an export.']],
    ['A unit gives a number meaning. Coordinates locate a point relative to an origin and named axes; a view describes the direction from which the object is represented. Decide units before entering dimensions.', 'For a rectangle extending from (0,0) to (100,60), width is 100 mm and height is 60 mm. Changing the origin changes coordinate values but not the physical size.', ['Draw horizontal X and vertical Y axes with an origin.', 'Mark all four corners of a 100 × 60 mm rectangle.', 'State the units and check the width and height by subtraction.']],
    ['A primitive is a basic shape such as a line, circle, or rectangle. Constraints express relationships: coincident points meet, horizontal lines remain level, and an equal constraint keeps sizes linked.', 'A 120 × 70 mm rectangle with four 8 mm holes contains one boundary and four circles. The hole centers still need coordinates; equal diameters alone do not locate them.', ['Sketch the rectangle and four separate circles.', 'Label the plate and hole diameters in millimeters.', 'List the relationships needed to keep the holes aligned.']],
    ['LibreCAD is a desktop 2D drafting tool. A drawing has geometry, layers, units, and a view of that geometry; zooming changes the view, not the part size. Interface labels can vary by version.', 'Start a new metric file and save a native drawing before creating an export. Locate the line, circle, layer, and dimension tools, then explore the coordinate display.', ['On a phone, identify the tool’s role and prepare a checklist.', 'On a desktop, create a metric drawing and save it.', 'Locate line, circle, layer, and dimension controls.']],
    ['Precise coordinates and object snaps locate geometry without relying on visual estimates. An absolute coordinate is measured from the origin; a relative coordinate is measured from a chosen reference point.', 'For the plate, (15,15) is 15 mm from each lower edge. The point (105,55) is 15 mm from the right edge and 15 mm from the top of a 120 × 70 mm plate.', ['Enter the four specified center coordinates.', 'Measure horizontal and vertical edge offsets.', 'Explain why snapping to a center is more reliable than guessing.']],
    ['Dimensions communicate size and location; layers organize categories of drawing information. Use clear extension lines and avoid placing a dimension where it hides important geometry.', 'A useful plate drawing identifies overall width and height, hole diameter, and enough center locations to inspect the pattern. Do not give duplicate dimensions that can contradict each other.', ['Separate object geometry and dimensions into named layers.', 'Add overall and hole-location dimensions.', 'Ask whether another person could reproduce the part without guessing.']],
    ['DXF is a common exchange format for 2D geometry, but different programs may interpret layers, fonts, units, and entity types differently. The original editable drawing remains your source of truth.', 'Export a copy, open it in the receiving program, and verify the plate dimensions and hole locations. An export that opens successfully can still have the wrong scale or missing entities.', ['Save your native drawing before exporting.', 'Export to DXF and reopen it in the intended tool.', 'Measure one overall dimension and check all four holes.']],
    ['FreeCAD is a desktop parametric modeler with workbenches for different tasks. A model tree records objects and features; the viewport displays their current geometry. Workbench names and layouts can change by release.', 'A typical introductory workflow creates a sketch, constrains it, and turns it into a solid feature. Save the editable document before making neutral exports.', ['On a phone, describe what a model tree records.', 'On desktop, open FreeCAD and find the model tree and sketch tools.', 'Create and save a blank document.']],
    ['A sketch is under-constrained when meaningful motion remains. Geometric constraints express relationships; dimensional constraints assign sizes or locations. A fully constrained sketch removes remaining intended degrees of freedom.', 'For an 80 × 50 mm rectangle, set width and height, then locate it relative to the origin. A centered circle needs a center relationship and its own diameter.', ['Sketch an 80 × 50 mm rectangle.', 'Constrain its position and size, then add a centered 12 mm circle.', 'Try dragging geometry and inspect any remaining degrees of freedom.']],
    ['A pad or extrusion adds material from a sketch; a pocket or cut removes material. Fillets round selected edges. Feature order matters because later operations depend on earlier geometry.', 'A 6 mm pad gives thickness to the 80 × 50 mm profile. A through pocket from the circle removes material through the part; inspect both faces to confirm it is actually through.', ['Create the base profile and pad it to 6 mm.', 'Cut the 12 mm circle through the part.', 'Apply a modest fillet and inspect the model from both sides.']],
    ['A technical drawing presents the views and dimensions needed to understand a part. STEP is a neutral exchange format for 3D geometry; it does not guarantee that every native modeling feature or edit history transfers.', 'Keep the native editable file, export STEP for exchange, and produce a PDF drawing for review. Reopen each output and compare important dimensions with the source.', ['Save the native model.', 'Export a STEP copy and a dimensioned PDF.', 'Reopen both exports and record any missing information.']],
    ['Choose tools according to access, operating system, required features, and the applicable license. FreeCAD is open source; Fusion personal-use access has conditions and feature limits that can change.', 'Both tools use feature histories to capture design decisions, but commands and file behavior differ. Focus on the shared ideas of sketches, constraints, features, and exports.', ['Review current official licensing before selecting Fusion.', 'Identify a sketch, a feature, and an editable dimension in each tool.', 'Explain how you would share a neutral model with someone using different software.']],
    ['Design intent is the relationship you want to survive a change. A feature history should explain dependencies, not merely reproduce a shape once. Prefer explicit relationships over disconnected repeated numbers.', 'If a plate grows from 60 to 65 mm wide, a hole intended to remain centered should move with the center. A hole intended to stay 10 mm from an edge should follow that edge instead.', ['Identify which hole relationships should remain fixed.', 'Change the plate width from 60 to 65 mm.', 'Inspect the result, restore the value, and explain the observed behavior.']],
    ['A solid encloses a volume; slots and holes remove material or define clearance. Manufacturing intent connects geometry to how a part will be held, cut, formed, printed, and inspected.', 'A 30 × 10 mm slot can be located from a centerline or datum. Define both its size and position; a picture of a slot alone does not establish either.', ['Model the plate and four holes.', 'Add the 30 × 10 mm slot and define its location.', 'Identify one possible manufacturing or inspection concern.']],
    ['Different CAD tools can create equivalent geometry through different sequences. Compare the resulting model, dimensions, editability, and exchange behavior rather than assuming identical button names.', 'A native file may preserve feature history; STEP is useful for neutral geometry exchange but may not preserve the original feature tree. Verify imported dimensions and document any differences.', ['Model one part in a chosen desktop CAD tool.', 'Save the native file and export a neutral copy.', 'Inspect the export and explain what remains editable.']],
    ['Meshes describe surfaces with vertices, edges, and faces. A mesh can be excellent for rendering or visualization, but it does not automatically contain the dimensions or engineering relationships of a parametric solid.', 'Inspect a simple box in Blender and identify its vertices, edges, and faces. A visually smooth object can still have poor topology or an incorrect physical scale.', ['Create a simple mesh object.', 'Switch to an editing view and identify its components.', 'Record its approximate dimensions and intended use.']],
    ['Modifiers can change an object non-destructively until applied; materials and lights affect its appearance. A rendering communicates shape and presentation, not verified structural performance.', 'Use a bevel to make edges readable, then compare the result under two lights. Retain the editable Blender file so another person can inspect the modifier setup.', ['Add a modest bevel modifier.', 'Create a simple material and two lights.', 'Render, inspect whether the shape reads clearly, and save the editable file.']],
    ['Exchange formats carry different information. A neutral solid file, a 2D drawing, a mesh, and a rendered image are not interchangeable: each answers different questions about a design.', 'After exporting, check units, scale, orientation, geometry, and named layers or objects. Keep the native file because an exchange file may omit constraints, feature history, or annotations.', ['Export one native file and one suitable exchange format.', 'Open the exchange file independently.', 'List the information that did and did not survive.']],
    ['A capstone begins with requirements and ends with evidence that another person can review. Document constraints, assumptions, design alternatives, dimensions, manufacturing considerations, and validation results.', 'A strong portfolio entry shows the problem, your design decisions, editable source, clear drawings, and what you checked. Avoid claiming that a self-reported exercise or a rendering proves engineering safety.', ['Write measurable requirements for the bracket.', 'Create and document an independent design.', 'Compare the finished work with each requirement and prepare the requested evidence.']]
  ];
  coreDetails.forEach(function (item, i) {
    const lesson = curriculum.lessons.find(function (entry) { return entry.id === i + 1; });
    if (!lesson) return;
    lesson.sections = [{ heading: 'Understand the idea', text: item[0] }, { heading: 'Worked example', text: item[1] }];
    lesson.steps = item[2];
    lesson.track = 'Core certificate curriculum';
    lesson.practiceOnly = false;
  });
  const additional = [];
  function add(unit, title, intro, concept, example, mistake, steps, questions) {
    const id = 21 + additional.length;
    const permutations = [[0, 1, 2], [1, 2, 0], [2, 0, 1], [0, 2, 1], [2, 1, 0], [1, 0, 2]];
    additional.push({
      id: id, slug: 'lesson-' + id, unit: unit, title: title, body: intro,
      track: 'Additional practice', practiceOnly: true,
      practice: steps[0], steps: steps,
      sections: [
        { heading: 'Understand the idea', text: concept },
        { heading: 'Worked example', text: example },
        { heading: 'Check your reasoning', text: mistake }
      ],
      quiz: questions.map(function (q, index) {
        const order = permutations[(id + index * 2) % permutations.length];
        const correct = 'ABC'.indexOf(q[2]);
        return { question: q[0], options: order.map(function (i) { return q[1][i]; }), answer: 'ABC'[order.indexOf(correct)] };
      })
    });
  }
  add('Measurement and geometry', 'Metric units and conversions',
    'Choose units deliberately and convert lengths without changing the physical object.',
    'A millimeter is one thousandth of a meter. One inch is exactly 25.4 mm. Multiply inches by 25.4 to obtain millimeters; divide millimeters by 25.4 to obtain inches.',
    'A 2 in width equals 50.8 mm. A 100 mm width is approximately 3.937 in. Keep extra digits during calculation and round according to the measurement and drawing requirements.',
    'Changing a displayed unit is not the same as scaling geometry. Do not attach more certainty to a measurement merely because a conversion produces many decimal places.',
    ['Convert 1 in, 2 in, and 5 in to millimeters on a phone calculator.', 'Convert 50.8 mm back to inches and check your result.', 'Write the unit after every value.'],
    [['One inch is exactly how many millimeters?', ['25.4 mm', '2.54 mm', '254 mm'], 'A'], ['How do you convert millimeters to inches?', ['Multiply by 25.4', 'Divide by 25.4', 'Add 25.4'], 'B'], ['What does changing displayed units do?', ['Changes physical size', 'Deletes dimensions', 'Changes the numerical representation'], 'C']]);
  add('Measurement and geometry', 'Measuring with calipers',
    'Measure outside, inside, and depth features while recognizing the limits of an instrument.',
    'Calipers compare a feature with a scale or digital readout. Clean the contact surfaces, check the zero, select the correct jaws or depth rod, and keep the tool aligned with the feature.',
    'Measure a small box in three places along its length. If the readings differ, record the range and investigate the part, instrument alignment, and measurement technique before choosing a representative value.',
    'Display resolution is not automatically accuracy. Avoid excessive jaw force, tilted jaws, and measuring a hot or dirty part when a precise comparison is needed.',
    ['Measure the width of a safe household object at three positions.', 'Record each reading, units, and the tool used.', 'Describe one possible source of measurement variation.'],
    [['Before measuring, what should you check?', ['Zero and clean contact surfaces', 'Screen brightness only', 'File name'], 'A'], ['What does a more detailed digital display guarantee?', ['Perfect accuracy', 'Nothing by itself about accuracy', 'A tighter part tolerance'], 'B'], ['Why take several readings?', ['To change the part size', 'To eliminate the need for units', 'To identify variation or alignment problems'], 'C']]);
  add('Measurement and geometry', 'Coordinates and reference origins',
    'Use an origin and axes to describe where geometry belongs.',
    'An origin is a reference point with coordinate zero. In a 2D Cartesian system, X and Y specify horizontal and vertical position under the chosen convention. A negative value lies on the negative side of an axis.',
    'If a hole center is at (15, 55) mm and a second is at (105, 55) mm, their horizontal separation is 90 mm and their vertical separation is zero.',
    'A coordinate is meaningful only with its units, origin, and axis directions. Moving the origin changes the reported coordinates even when the part itself does not move.',
    ['Draw X and Y axes and label the origin.', 'Plot (15,15), (105,15), (15,55), and (105,55) in millimeters.', 'Calculate the horizontal and vertical center spacing.'],
    [['What is the horizontal separation from X=15 mm to X=105 mm?', ['90 mm', '120 mm', '15 mm'], 'A'], ['What identifies the coordinate reference?', ['Only a color', 'The origin and axes', 'A file extension'], 'B'], ['What does a negative X value indicate?', ['A negative length', 'An invalid drawing', 'A position on the negative side of X'], 'C']]);
  add('Measurement and geometry', 'Angles, triangles, and slope',
    'Use right-triangle relationships to check a simple design.',
    'In a right triangle, the Pythagorean relationship is a² + b² = c², where c is the hypotenuse. For a chosen angle, tangent relates the opposite side to the adjacent side.',
    'A 30 mm horizontal run and 40 mm vertical rise give a 50 mm diagonal because 30² + 40² = 50². The angle of rise is arctangent of 40/30, approximately 53.1°.',
    'Confirm whether the calculator expects degrees or radians. A slope ratio is not itself an angle in degrees, and the formula applies to the right triangle as defined.',
    ['Sketch a right triangle with a 30 mm run and 40 mm rise.', 'Calculate the diagonal and the angle of rise.', 'Label which side is opposite and which is adjacent.'],
    [['What is the diagonal of a 30-40 right triangle?', ['50', '70', '10'], 'A'], ['What relates opposite to adjacent for an angle?', ['Area', 'Tangent', 'Diameter'], 'B'], ['What calculator setting matters for an angle in degrees?', ['File format', 'Line color', 'Degree mode'], 'C']]);
  add('Measurement and geometry', 'Tolerances and limits',
    'Describe acceptable variation instead of assuming every part is exact.',
    'A nominal dimension is the stated target. A tolerance defines an allowed range according to the drawing or specification. Bilateral tolerances may allow variation above and below nominal.',
    'For 50.00 ± 0.10 mm, the dimensional limits are 49.90 mm and 50.10 mm. A measured 49.95 mm falls within those stated limits, subject to measurement uncertainty and the inspection procedure.',
    'Do not invent a tolerance for a production or safety-critical part. Review the drawing, applicable standards, function, process capability, and qualified engineering requirements.',
    ['Calculate the limits for 20.00 ± 0.20 mm.', 'Decide whether 20.15 mm lies inside those limits.', 'Explain why a tolerance is different from a display setting.'],
    [['What are the limits of 50.00 ± 0.10 mm?', ['49.90 to 50.10 mm', '49.00 to 51.00 mm', '50.00 to 50.10 mm'], 'A'], ['What is a nominal dimension?', ['A guaranteed measured value', 'A stated target dimension', 'A unit conversion factor'], 'B'], ['Who should establish a critical production tolerance?', ['A random screenshot', 'A color palette', 'The responsible design and engineering process'], 'C']]);
  add('Measurement and geometry', 'Precision and measurement uncertainty',
    'Distinguish the digits a tool displays from confidence in the measurement.',
    'Precision describes the closeness of repeated results; accuracy concerns closeness to an accepted reference. Measurement uncertainty describes a range associated with the value under stated conditions.',
    'Readings of 10.01, 10.02, and 10.01 mm are close to each other. They can still all be biased if the instrument is miscalibrated or the measurement method is wrong.',
    'Do not assume that repeated identical digits eliminate calibration error, temperature effects, alignment error, or uncertainty. Record tool, method, and units with the measurement.',
    ['Measure the same object three times using the same method.', 'Record the readings and their range.', 'Identify an error that could affect all three measurements in the same direction.'],
    [['What does repeatability describe?', ['Closeness of repeated measurements', 'Whether the drawing is blue', 'The number of file formats'], 'A'], ['Can a precise instrument be biased?', ['No, never', 'Yes, for example if miscalibrated', 'Only when it is digital'], 'B'], ['What should accompany a recorded measurement?', ['Only a photograph', 'A password', 'Units and enough information about the method'], 'C']]);
  add('Technical drawing', 'Read a drawing and title block',
    'Find the information that tells you what a drawing represents and which revision applies.',
    'Begin with the title block, part name or number, revision, units, scale, and applicable notes. Then identify the views, features, dimensions, and any drawing-specific requirements.',
    'Two files named bracket.pdf can describe different revisions. Compare the stated part number and revision before measuring or sending the drawing to a manufacturer.',
    'A title block does not replace the actual feature dimensions and notes. Never assume that every drawing follows the same projection, units, or tolerance convention.',
    ['Create a simple title block for a practice plate.', 'Include title, units, a revision identifier, and date.', 'Explain how you would distinguish an older revision.'],
    [['Where should you look for the drawing revision?', ['The title block or revision area', 'Only the page background', 'The mouse pointer'], 'A'], ['Why identify units?', ['To set screen brightness', 'To interpret numerical dimensions correctly', 'To determine the file password'], 'B'], ['Does a familiar filename prove two drawings match?', ['Always', 'Only for PDFs', 'No; compare part identity and revision'], 'C']]);
  add('Technical drawing', 'Orthographic views',
    'Relate front, top, and side views to the same three-dimensional object.',
    'Orthographic views represent an object from perpendicular directions without perspective depth. Features that line up in one view should correspond to the same physical features in related views.',
    'For a rectangular block, the front view might show width and height, while the top view shows width and depth. A hole can appear as a circle in one view and edges or hidden lines in another.',
    'The arrangement of views depends on the drawing’s projection convention. Look for the projection symbol or stated standard instead of assuming a universal page layout.',
    ['Sketch a small box from the front, top, and side.', 'Mark the same width in the front and top views.', 'Describe how a through-hole could appear in two views.'],
    [['Which views can share a width dimension?', ['Front and top', 'Only an isometric rendering', 'None of them'], 'A'], ['What does orthographic projection avoid?', ['Dimensions', 'Perspective convergence', 'Views of an object'], 'B'], ['How do you determine the arrangement of views?', ['Guess from page color', 'Assume every country uses one layout', 'Check the stated projection convention'], 'C']]);
  add('Technical drawing', 'Sections and detail views',
    'Use additional views to communicate internal or small features clearly.',
    'A section view imagines a cut through a part so interior shapes can be shown. A detail view enlarges a selected area for clarity. The cutting plane and view labels connect the additional view to the original.',
    'A section through a hollow spacer can show the bore and wall thickness. A detail view can enlarge a small groove so that its dimensions and notes are legible.',
    'A section or enlarged view does not authorize scaling dimensions with a ruler. Follow the stated dimensions and the applicable drawing standard for section conventions.',
    ['Sketch a hollow cylinder and indicate a simple cutting plane.', 'Draw the resulting section and label the bore.', 'Choose one small feature that would benefit from a detail view.'],
    [['What is a section view useful for?', ['Showing interior features', 'Changing the physical part', 'Creating a password'], 'A'], ['What is a detail view?', ['An unrelated file', 'An enlarged view of a selected area', 'An automatic tolerance'], 'B'], ['Which should control the size of a feature?', ['A ruler on a screenshot', 'The apparent view size', 'The stated dimension and applicable notes'], 'C']]);
  add('Technical drawing', 'Dimensioning holes and patterns',
    'Describe hole size, quantity, and location so the pattern can be inspected.',
    'A hole pattern needs the relevant diameter, number of holes, and locations or relationships. Reference locations from a clear origin, centerline, or datum scheme suited to the function of the part.',
    'For a 120 × 70 mm plate, four 8 mm holes at (15,15), (105,15), (15,55), and (105,55) have 90 mm horizontal and 40 mm vertical center spacing.',
    'Do not specify only a hole diameter and assume its location is obvious. Avoid contradictory duplicate dimensions; use the requirements of the drawing standard and the actual part.',
    ['Plot the four hole centers on a 120 × 70 mm sketch.', 'Calculate the spacing and edge offsets.', 'List the information a reviewer needs to check the pattern.'],
    [['What is the horizontal spacing between X=15 and X=105 mm?', ['90 mm', '105 mm', '120 mm'], 'A'], ['What does a hole callout need beyond diameter?', ['Only a color', 'Quantity and location or relationship', 'A background image'], 'B'], ['What can duplicate contradictory dimensions cause?', ['Automatic accuracy', 'A lighter model', 'Confusion about the intended requirement'], 'C']]);
  add('Technical drawing', 'Drawing scale and printing',
    'Understand the difference between a drawing’s visual scale and the part’s actual size.',
    'A drawing view can be reduced or enlarged to fit a sheet. The stated dimension describes the part; the view scale describes the representation on the page.',
    'At 1:2 scale, a 100 mm feature is represented about 50 mm long on a correctly printed view. Its stated physical dimension remains 100 mm.',
    'Printer settings such as “fit to page” can change the image size. Do not infer a production dimension by measuring a print unless a suitable controlled process explicitly permits it.',
    ['Sketch a 100 mm feature at 1:2 scale on paper.', 'Label both the real dimension and the view scale.', 'Explain what a printer’s fit-to-page option can change.'],
    [['At 1:2, how long is the representation of a 100 mm feature?', ['50 mm', '200 mm', '1000 mm'], 'A'], ['Does changing view scale change the part?', ['Yes', 'No', 'Only in metric units'], 'B'], ['Which value should define the intended size?', ['The thumbnail width', 'A casual screen measurement', 'The stated dimension'], 'C']]);
  add('Parametric modeling', 'Degrees of freedom and constraints',
    'Predict how sketch geometry can move before constraining it.',
    'A degree of freedom is an independent way geometry can vary. Constraints remove selected movement or link properties. The exact count and solver behavior depend on the geometry and CAD tool.',
    'A circle can change its center position and radius until relationships fix them. Constrain its center to the origin and specify a diameter to define its intended size and position.',
    'More constraints are not always better: redundant or conflicting constraints can make a sketch difficult or impossible to solve. Remove or revise a conflict instead of forcing a result.',
    ['Sketch a free circle and identify how it can move or change.', 'Constrain its center and diameter in a desktop CAD tool.', 'Explain the difference between an under-constrained and conflicting sketch.'],
    [['What can a diameter constraint control?', ['Circle size', 'File permissions', 'Monitor resolution'], 'A'], ['What can conflicting constraints cause?', ['A guaranteed correct model', 'A sketch solver error', 'An automatic export'], 'B'], ['What does a coincidence constraint express?', ['A material choice', 'A file type', 'Two points or features meet'], 'C']]);
  add('Parametric modeling', 'Parameters and feature history',
    'Plan editable features that respond predictably to change.',
    'Parameters are named or recorded values that drive geometry. Feature history captures dependencies between sketches and operations. A stable model makes important design intent understandable.',
    'Define plate_width as 60 mm and place a centered hole using a center relationship. Change plate_width to 65 mm and verify that the hole remains centered.',
    'A model that rebuilds without an error can still violate its intended function. Test meaningful changes and inspect the resulting features, clearances, and exported geometry.',
    ['List three dimensions that control a simple plate.', 'Create a model that uses a center relationship for a hole.', 'Change the width and document whether the hole follows the intended relationship.'],
    [['What is a parameter?', ['A value that can drive a design', 'A finished certificate', 'A printer setting only'], 'A'], ['What should you do after changing a parameter?', ['Assume the design is correct', 'Inspect the resulting geometry and intent', 'Delete the source'], 'B'], ['What can a feature history record?', ['Only the monitor size', 'A learner password', 'Dependencies among modeling operations'], 'C']]);
  add('Parametric modeling', 'References and robust models',
    'Choose references that are understandable and less fragile when the model changes.',
    'A reference can be an origin, plane, axis, edge, face, or explicit construction feature. Depending on tool behavior, references to generated faces or edges may change after edits.',
    'For a symmetric bracket, reference a sketch to a base plane and place important geometry relative to the origin or explicit datums. Change an early dimension and inspect dependent features.',
    'No single reference strategy prevents every failure. Avoid unnecessary chains of fragile references and verify the model after changes using the version of the tool in use.',
    ['Identify the references used in a small model.', 'Change an early feature dimension.', 'Document any broken references and a more stable alternative.'],
    [['What is a useful stable reference in many designs?', ['An origin or explicit datum', 'A screenshot crop', 'An unrelated filename'], 'A'], ['Can generated edge references change after edits?', ['Never', 'Yes, depending on the model and tool', 'Only in drawings'], 'B'], ['What should follow an upstream change?', ['Automatic certification', 'Deleting all exports', 'A rebuild and inspection'], 'C']]);
  add('Parametric modeling', 'Patterns, symmetry, and design intent',
    'Use relationships to create repeated features without losing their purpose.',
    'A pattern repeats features according to rules such as count, spacing, direction, or rotation. Symmetry describes a relationship around a centerline, plane, or point.',
    'Four holes can be made as a rectangular pattern with two columns and two rows. Use a defined center spacing and inspect the resulting edge distances when the plate changes.',
    'A repeated pattern is not automatically correct for every size. Check edge clearance, count, orientation, and whether spacing or edge distance is the controlling requirement.',
    ['Draw one hole and define a four-hole rectangular pattern.', 'State the horizontal and vertical spacing.', 'Change the plate width and inspect the pattern and edge distances.'],
    [['What does a pattern define?', ['Rules for repeated features', 'An email address', 'A material certificate'], 'A'], ['What should be checked after resizing a plate?', ['Only its color', 'The pattern and edge distances', 'Only the filename'], 'B'], ['What does symmetry relate geometry to?', ['A random file', 'An internet connection', 'A centerline, plane, or point'], 'C']]);
  add('Parametric modeling', 'File formats and exchange',
    'Select a source or exchange format based on what the recipient needs.',
    'Native CAD files generally retain tool-specific structures and editing information. Neutral formats exchange certain geometry or drawing information between tools; the transferred information depends on the format and implementation.',
    'Keep the native model for later edits, export STEP for a compatible 3D exchange, and export PDF for a drawing review. Open each output and confirm units and essential features.',
    'A successful export is not proof of complete information transfer. A mesh, image, native solid, and 2D drawing serve different purposes.',
    ['List the native, neutral 3D, and drawing formats for your project.', 'Export a copy without overwriting the native file.', 'Open the export and check dimensions and orientation.'],
    [['Which file should normally be retained for later native edits?', ['The native source', 'Only a thumbnail', 'A browser cache'], 'A'], ['What should you verify after an exchange?', ['Only the filename', 'Units and essential geometry', 'The other person’s wallpaper'], 'B'], ['Does a neutral export always preserve the original feature tree?', ['Always', 'Only on phones', 'No'], 'C']]);
  add('Design for manufacture', 'Clearance and interference fits',
    'Think about how two independently manufactured features fit together.',
    'Clearance exists when the mating opening is larger than the mating feature. Interference exists when the feature is larger than the opening before assembly. Actual fit depends on both parts’ limits and other conditions.',
    'For a simplified example, a 10.2 mm hole and a 10.0 mm pin have 0.2 mm nominal diametral clearance. Assess the maximum and minimum part sizes before assuming every manufactured pair will fit.',
    'This example is not a fit specification. Real fits may depend on material, surface condition, temperature, assembly method, tolerances, and a qualified engineer’s requirements.',
    ['Calculate nominal clearance for a 12.3 mm opening and 12.0 mm pin.', 'Identify which dimensions need limits to guarantee clearance.', 'Explain why nominal dimensions alone cannot prove every pair will fit.'],
    [['What is the nominal clearance for a 10.2 mm hole and 10.0 mm pin?', ['0.2 mm', '10.2 mm', '20.2 mm'], 'A'], ['What must be considered to guarantee clearance across parts?', ['Only color', 'Both parts’ dimensional limits', 'Only the CAD file name'], 'B'], ['What is interference?', ['A larger hole than pin', 'A neutral file format', 'A feature larger than its mating opening before assembly'], 'C']]);
  add('Design for manufacture', 'Tolerance stack-up basics',
    'Estimate how independent dimensional limits can affect an assembly.',
    'A stack-up considers how variation in multiple dimensions affects a resulting distance or fit. Worst-case arithmetic uses the combinations of limits that produce the largest and smallest possible result.',
    'If A is 20.0 ± 0.1 mm and B is 10.0 ± 0.1 mm, then A + B has a worst-case range from 29.8 to 30.2 mm, assuming both independently reach their stated extremes.',
    'A simple worst-case stack is not a full statistical or geometric tolerance analysis. Check the actual dimensions, datum relationships, measurement assumptions, and approved engineering method.',
    ['Calculate the minimum and maximum of 30.0 ± 0.2 mm plus 10.0 ± 0.1 mm.', 'Show which extreme values create each result.', 'Describe one assumption in your calculation.'],
    [['What is the maximum of 20.0 ± 0.1 plus 10.0 ± 0.1 mm?', ['30.2 mm', '30.0 mm', '29.8 mm'], 'A'], ['Why analyze a stack-up?', ['To change the font', 'To understand combined variation', 'To encrypt a drawing'], 'B'], ['What is an assumption in the simple worst-case example?', ['All parts are identical', 'No units are needed', 'Individual dimensions can reach the selected extremes'], 'C']]);
  add('Design for manufacture', 'Introduction to GD&T and datums',
    'Recognize why drawings may define geometric relationships in addition to sizes.',
    'Geometric dimensioning and tolerancing (GD&T) uses standardized symbols and rules to communicate allowable geometric variation and reference relationships. A datum is a theoretically exact reference derived according to the applicable standard.',
    'A mounting plate may need a hole pattern controlled relative to a primary mounting surface and other locating features. The actual frame, symbols, modifiers, and interpretation depend on the drawing and governing standard.',
    'Do not infer a tolerance value or claim compliance from a symbol alone. Learn the applicable standard and have a qualified person review production drawings and inspection plans.',
    ['Identify a surface that locates a hypothetical plate against a wall.', 'Describe why hole location relative to that surface matters.', 'Find a real drawing’s stated standard before interpreting its symbols.'],
    [['Why use geometric controls?', ['To communicate allowed geometric variation', 'To choose a screen theme', 'To avoid all measurements'], 'A'], ['What is a datum used for?', ['A color palette', 'A reference for geometric relationships', 'An automatic material selection'], 'B'], ['Can you infer a complete tolerance from a symbol alone?', ['Always', 'Only on paper', 'No; the full callout and governing standard matter'], 'C']]);
  add('Design for manufacture', 'Fasteners and threaded features',
    'Plan a joint using a complete fastener specification and practical access.',
    'A fastener description can include thread designation, length, material, property class or grade, and other requirements. A clearance hole and a threaded hole serve different purposes.',
    'For a removable cover, decide which component has the tapped hole and which has a clearance hole. Check available engagement, tool access, and assembly sequence using the chosen fastener’s specifications.',
    'Do not assume a drill size, torque, strength, or safe thread engagement from a generic example. Consult the specified standard and the responsible engineer or manufacturer.',
    ['Sketch two joined plates and identify the clearance and threaded components.', 'List the information needed to specify the fastener.', 'Check whether a tool can reach the fastener in your sketch.'],
    [['What is the purpose of a clearance hole?', ['Allow the fastener to pass without engaging threads in that component', 'Generate a thread automatically', 'Set bolt torque'], 'A'], ['What affects whether a fastener can be assembled?', ['Only its color', 'Tool access and assembly sequence', 'The image resolution'], 'B'], ['Where should a critical torque value come from?', ['A random example', 'The learner’s estimate', 'The specified fastener and engineering requirements'], 'C']]);
  add('Design for manufacture', 'Selecting materials',
    'Compare materials against function, process, environment, cost, and availability.',
    'Material selection is a tradeoff. Consider strength and stiffness, weight, corrosion or temperature exposure, manufacturability, service life, cost, and the reliability of the available material data.',
    'A lightweight cover and a load-bearing bracket may have different requirements even if they look alike. Compare candidate materials against written requirements before deciding.',
    'A material label by itself does not prove a part is safe. Geometry, loading, defects, process, environment, and verification all matter; use qualified review for critical applications.',
    ['Write three requirements for a simple protective cover.', 'Compare two possible materials against those requirements.', 'Identify one property or test you would need before selecting a material.'],
    [['What should guide a material choice?', ['The part requirements and service environment', 'Only color', 'The file extension'], 'A'], ['Can two similar-looking parts need different materials?', ['No', 'Yes, because their functions can differ', 'Only if printed'], 'B'], ['Does a material name alone prove safety?', ['Yes', 'Only in a CAD rendering', 'No'], 'C']]);
  add('Design for manufacture', 'Design for machining',
    'Consider how a part will be held, accessed, cut, and inspected.',
    'Machining removes material with cutting tools. The machinist must reach the features, hold the work securely, and select tooling and a process compatible with the material and specified requirements.',
    'A very deep, narrow internal pocket may require a long tool and more than one setup. A simpler accessible pocket may be easier to make, but the acceptable change depends on the part’s function.',
    'A visually valid model is not a machining plan. Do not operate equipment from a lesson alone; follow site training, guarding, workholding, and manufacturer instructions.',
    ['Sketch a part with one open pocket and one hard-to-reach pocket.', 'Mark possible tool approach directions.', 'Explain one design change that may improve access.'],
    [['What does machining generally do?', ['Remove material', 'Only change a file name', 'Replace inspection'], 'A'], ['Why consider tool access?', ['To pick colors', 'Some features are difficult to reach or hold', 'To eliminate drawings'], 'B'], ['What is needed before operating machine tools?', ['A screenshot', 'Only an online quiz', 'Appropriate training and safety procedures'], 'C']]);
  add('Design for manufacture', 'Sheet metal and bend allowance',
    'Recognize how flat material changes shape when it is bent.',
    'Sheet-metal parts begin with material of a specified thickness and include bends, flanges, holes, and reliefs. A flat pattern must account for how material deforms through each bend.',
    'A U-shaped channel has a base and two flanges. The flat blank length is not always the simple sum of outside flange lengths; bend allowance depends on tooling, geometry, material, and the chosen method.',
    'Do not use a generic bend calculation as a production instruction. Confirm the fabrication process and bend data with the manufacturer, then check the resulting flat pattern.',
    ['Sketch a U-shaped channel with a base and two flanges.', 'Mark material thickness and two bend locations.', 'List the information a fabricator needs to determine a flat pattern.'],
    [['Why is bend allowance considered?', ['Material deforms through a bend', 'It changes the PDF password', 'It selects a monitor'], 'A'], ['Is blank length always just the sum of outside dimensions?', ['Yes', 'No', 'Only if the drawing is metric'], 'B'], ['Who should confirm production bend data?', ['A random web image', 'The model color', 'The fabricator and responsible design process'], 'C']]);
  add('Design for manufacture', 'Design for 3D printing',
    'Relate model orientation and features to an additive manufacturing process.',
    'Additive processes build a part layer by layer. Orientation, overhangs, support material, layer direction, and the selected machine or material can affect appearance, fit, strength, and finishing.',
    'A simple bracket printed upright may have a different surface and layer orientation from one printed flat. Compare orientations and decide what needs support before printing.',
    'A printable mesh is not automatically dimensionally accurate or structurally safe. Check the machine, material, process, inspection, ventilation, and intended use; do not use an unverified print for a critical load.',
    ['Sketch two possible print orientations for a bracket.', 'Identify an overhang and any likely support.', 'Describe one measurement to check after printing.'],
    [['What can orientation affect?', ['Support needs and layer direction', 'The definition of a millimeter', 'Whether a model has a name'], 'A'], ['Does a printable mesh prove structural safety?', ['Yes', 'No', 'Only for bright colors'], 'B'], ['What should be checked after printing?', ['Only the printer wallpaper', 'The browser history', 'Dimensions relevant to the intended use'], 'C']]);
  add('Design for manufacture', 'Surface finish and edge condition',
    'Describe why surfaces and edges matter to function and handling.',
    'A surface may contact a seal, bearing, tool, or hand. Surface requirements and edge treatments can influence fit, wear, appearance, and safety, and they should be specified using the appropriate drawing convention.',
    'A sharp edge on a handheld cover may need a defined edge treatment. A sealing surface may need a separate finish requirement chosen for the actual seal and service conditions.',
    'A smooth rendering is not evidence of an actual surface finish. Avoid inventing roughness values or assuming a generic chamfer is suitable for every part.',
    ['List two surfaces on a familiar object that serve different purposes.', 'Describe a possible edge-handling concern.', 'Identify what a drawing must clarify before manufacturing.'],
    [['Why can surface condition matter?', ['It can affect contact, wear, or sealing', 'It changes the definition of length', 'It creates a user account'], 'A'], ['Does a smooth rendering prove actual surface finish?', ['Yes', 'No', 'Only with a dark background'], 'B'], ['How should a critical finish be chosen?', ['Guess from a photo', 'Use any value', 'From functional and manufacturing requirements'], 'C']]);
  add('Assemblies and verification', 'Assembly constraints and motion',
    'Describe how components fit and move relative to each other.',
    'An assembly combines components with relationships such as alignment, distance, contact, or allowed motion. Different software packages use different names and solvers for these relationships.',
    'A simple hinge needs aligned pin axes and an appropriate relationship that permits intended rotation. It also needs real clearances and hardware choices that a visual animation alone does not prove.',
    'An assembly that moves on screen is not automatically manufacturable or safe. Check interference, motion range, fasteners, clearances, loads, and the actual design requirements.',
    ['Sketch two hinge leaves and a pin.', 'Identify the intended axis of rotation.', 'List one clearance and one motion limit that need checking.'],
    [['What does an assembly relationship control?', ['Relative position or motion of components', 'The browser font', 'The certificate owner'], 'A'], ['What is a common hinge motion?', ['Changing units', 'Rotation around an axis', 'Deleting a component'], 'B'], ['Does an animation prove a design is safe?', ['Always', 'Only for small parts', 'No'], 'C']]);
  add('Assemblies and verification', 'Interference and clearance checks',
    'Use a model to find potential collisions while recognizing the limits of the check.',
    'An interference check looks for overlapping solid volumes in a modeled state. A clearance check can help identify distances between features; both depend on accurate models and the chosen configuration.',
    'Move a lever through several positions and check whether it overlaps its housing. Also inspect whether there is enough space for assembly and for the tool used to tighten a fastener.',
    'A single static check does not prove every position is clear. Allow for tolerances, deflection, manufacturing variation, and real operating conditions when those matter.',
    ['Sketch a moving lever and nearby housing.', 'Identify the positions most likely to collide.', 'List two real-world factors not captured by a simple static check.'],
    [['What can an interference check identify?', ['Overlapping modeled solid volumes', 'A valid business license', 'The best font'], 'A'], ['Why inspect multiple positions?', ['To change units', 'A moving part can collide in some positions', 'To remove all dimensions'], 'B'], ['What can a static model omit?', ['The file name', 'The model color', 'Deflection and manufacturing variation'], 'C']]);
  add('Assemblies and verification', 'Inspection plans and acceptance',
    'Turn a drawing requirement into an observable inspection step.',
    'An inspection plan identifies what to measure, the applicable requirement, the method or instrument, and how results are recorded. Critical requirements may need a controlled procedure and qualified personnel.',
    'For a plate, an inspection plan might list overall length, overall width, hole diameters, and hole locations, each linked to its drawing requirement and a suitable measurement method.',
    'A measurement is not enough without the correct units, tolerance, instrument capability, and a decision rule appropriate to the work. Do not certify a part from an incomplete plan.',
    ['List four measurable requirements for a practice plate.', 'Choose a plausible measurement method for each.', 'Record a sample value and the stated acceptance limits.'],
    [['What belongs in an inspection plan?', ['The feature, requirement, and measurement method', 'Only a rendering', 'A password'], 'A'], ['Why include units and limits?', ['To make the page colorful', 'To interpret the measurement against the requirement', 'To change the part'], 'B'], ['Can an incomplete plan prove a critical part acceptable?', ['Always', 'If the file is large', 'No'], 'C']]);
  add('Assemblies and verification', 'Simulation and FEA fundamentals',
    'Understand what a finite element analysis can and cannot establish.',
    'Finite element analysis approximates a physical problem using a model, mesh, material properties, loads, and boundary conditions. Results are only as useful as the assumptions and verification behind them.',
    'For a bracket, an analyst must define how it is supported, where loads act, what material data applies, and whether the model and mesh adequately represent the behavior being investigated.',
    'A colorful stress plot is not proof of safety. Check units, constraints, material data, mesh sensitivity, simplified hand calculations, and qualified review appropriate to the consequence of failure.',
    ['Draw a bracket and mark a hypothetical load and support.', 'List three assumptions a simulation would need.', 'Explain why a plot requires independent engineering review.'],
    [['What does FEA use to approximate a problem?', ['A model, mesh, loads, and boundary conditions', 'A file name only', 'A certificate template'], 'A'], ['Do assumptions affect simulation results?', ['No', 'Yes', 'Only for pictures'], 'B'], ['Does a colorful plot establish safety by itself?', ['Always', 'If the mesh is visible', 'No'], 'C']]);
  add('Professional workflow', 'Requirements and design decisions',
    'Write requirements that can be checked against the finished work.',
    'A requirement states what a design must do or a constraint it must meet. Useful requirements are clear, testable, and traceable to a need; assumptions should be identified separately.',
    '“A phone holder must support a device 80 mm wide” is more testable than “make a nice holder.” Add the relevant environment, allowable size range, and verification method when known.',
    'A target, assumption, and verified result are different. Avoid inventing loads or safety factors for real use; obtain them from the responsible design process.',
    ['Write three measurable requirements for a phone stand.', 'For each requirement, describe a way to check it.', 'Label any information you had to assume.'],
    [['What makes a requirement useful?', ['It is clear and testable', 'It has many adjectives', 'It has no units'], 'A'], ['How should an unknown value be treated?', ['As a verified fact', 'As an assumption or open question', 'As a completed test'], 'B'], ['What connects a requirement to evidence?', ['A color', 'A filename alone', 'A defined verification method'], 'C']]);
  add('Professional workflow', 'Revisions and engineering changes',
    'Track design changes so the right version reaches the right person.',
    'A revision identifies a controlled state of a design. A change record explains what changed, why it changed, who reviewed it, and which documents or downstream items are affected.',
    'If a hole moves, update the native model, drawing, relevant exports, and revision record. Tell reviewers which revision to inspect and check that the old file is not mistaken for the new one.',
    'Saving a file with a new name is useful but is not by itself a complete change-control system. Follow the organization’s review and release process for real work.',
    ['Make a revision to a practice drawing.', 'Write a short change note explaining the reason and affected files.', 'Check that the model and drawing show the same revision.'],
    [['Why record a revision?', ['To identify a controlled design state', 'To change the unit definition', 'To skip review'], 'A'], ['What should be checked after a design change?', ['Only the cursor', 'Affected models, drawings, and exports', 'Only the browser tab'], 'B'], ['Is renaming a file alone a complete change process?', ['Always', 'Only for 3D models', 'No'], 'C']]);
  add('Professional workflow', 'Bills of materials and part identity',
    'Organize the components needed to describe an assembly.',
    'A bill of materials (BOM) lists components and relevant attributes such as part identifier, description, quantity, and revision. The exact fields depend on the organization and the purpose of the document.',
    'A practice phone stand assembly could list a base, support, two screws, and two nuts. Quantities should agree with the assembly and with the intended purchasing or fabrication process.',
    'A BOM is not a substitute for complete drawings, approved specifications, or a check that the right revisions are available. Avoid treating an illustrative part list as a purchase order.',
    ['Create a four-line parts list for a simple assembly.', 'Include a description, quantity, and revision for each line.', 'Compare the quantities with the assembly sketch.'],
    [['What is a BOM?', ['A structured list of assembly components', 'A type of coordinate axis', 'A grading password'], 'A'], ['Why include a revision?', ['To set the screen brightness', 'To identify the intended component version', 'To eliminate inspection'], 'B'], ['Does a BOM replace every component drawing?', ['Always', 'Only for bolts', 'No'], 'C']]);
  add('Professional workflow', 'Portfolio evidence and design review',
    'Explain your decisions and show evidence that another person can inspect.',
    'A useful portfolio entry identifies the problem, constraints, your role, the design process, and evidence. Include readable drawings and permitted source or exports, with a clear explanation of what was actually checked.',
    'For a mounting plate, show the requirements, a dimensioned drawing, the editable source, and measured or calculated checks. Explain a change you made after feedback and what remains unverified.',
    'Do not publish confidential employer or customer files without authorization, and do not imply that a self-check, rendering, or platform completion record is a professional license.',
    ['Select one practice project and write a short problem statement.', 'Add a drawing and a list of the checks you performed.', 'Identify one limitation and remove any confidential information.'],
    [['What strengthens a portfolio entry?', ['Evidence linked to the design requirements', 'Only a decorative image', 'An unsupported claim'], 'A'], ['What should you do with confidential project files?', ['Publish them automatically', 'Share only with proper authorization', 'Remove the filename and assume that is enough'], 'B'], ['What should an honest entry state?', ['Only positive outcomes', 'A guaranteed job offer', 'What was checked and what remains unverified'], 'C']]);
  curriculum.lessons.push.apply(curriculum.lessons, additional);
})();
