// Shared deterministic geometry validator. Used by the browser AND the server.
// It validates a constrained 2D sketch, not third-party CAD file contents.
export const GEOMETRY_EXERCISE = Object.freeze({
  id: 'rectangle-circle',
  units: 'mm',
  canvas: { width: 320, height: 220 },
  expected: { x: 10, y: 10, width: 120, height: 80, cx: 200, cy: 70, radius: 30 },
  tolerance: 0.2,
});
const KEYS = ['x', 'y', 'width', 'height', 'cx', 'cy', 'radius'];
export function parseGeometryNumber(value) {
  if (typeof value === 'number') return Number.isFinite(value) ? value : null;
  if (typeof value !== 'string' || !/^[+-]?(?:\d+(?:\.\d*)?|\.\d+)$/.test(value.trim())) return null;
  const n = Number(value);
  return Number.isFinite(n) ? n : null;
}
export function assessGeometry(draft) {
  const src = draft && typeof draft === 'object' ? draft : {};
  const numbers = Object.fromEntries(KEYS.map(key => [key, parseGeometryNumber(src[key])]));
  const {x, y, width, height, cx, cy, radius} = numbers;
  const allNumbers = KEYS.every(key => numbers[key] !== null);
  const positive = allNumbers && width > 0 && height > 0 && radius > 0;
  const within = positive && x >= 0 && y >= 0 && x + width <= 320 && y + height <= 220
    && cx - radius >= 0 && cy - radius >= 0 && cx + radius <= 320 && cy + radius <= 220;
  let edgeGap = null;
  if (positive) {
    const dx = Math.max(x - cx, 0, cx - (x + width));
    const dy = Math.max(y - cy, 0, cy - (y + height));
    edgeGap = Math.hypot(dx, dy) - radius;
  }
  const near = key => numbers[key] !== null && Math.abs(numbers[key] - GEOMETRY_EXERCISE.expected[key]) <= GEOMETRY_EXERCISE.tolerance + 1e-9;
  const checks = [
    {id:'units', label:'Millimeters selected', pass:src.units === 'mm', detail:'Geometry is evaluated in mm'},
    {id:'numbers', label:'All 7 dimensions are finite numbers',pass:allNumbers,detail:'Enter x, y, width, height, circle x, circle y, radius'},
    {id:'positive', label:'Rectangle and circle have positive size',pass:positive,detail:'Width, height and radius must be greater than zero'},
    {id:'bounds',label:'Both shapes lie on the drawing sheet',pass:within,detail:'320 × 220 mm sheet'},
    ...KEYS.map(key=>({id:'target-'+key,label:({x:'Rectangle X',y:'Rectangle Y',width:'Rectangle width',height:'Rectangle height',cx:'Circle center X',cy:'Circle center Y',radius:'Circle radius'})[key],pass:near(key),detail:`Target ${GEOMETRY_EXERCISE.expected[key]} ± ${GEOMETRY_EXERCISE.tolerance} mm`})),
    {id:'clearance',label:'Shapes are separate with ≥ 5 mm edge clearance',pass:edgeGap !== null && edgeGap >= 5,detail:edgeGap===null?'Complete dimensions to calculate clearance':`Current gap ${edgeGap.toFixed(2)} mm`},
    {id:'derived',label:'Derived areas and perimeters are calculable',pass:positive,detail:'Calculated from the actual sketch primitives'},
  ];
  return {
    pass: checks.every(c=>c.pass),
    checks,
    geometry: numbers,
    derived: positive ? {
      rectangleArea:width*height,
      rectanglePerimeter:2*(width+height),
      circleArea:Math.PI*radius*radius,
      circleCircumference:2*Math.PI*radius,
      edgeGap,
    } : null,
  };
}
