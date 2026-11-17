const {test}=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const vm=require('node:vm');

const app=fs.readFileSync('app.js','utf8');
const start=app.indexOf('function drawCanvas(){');
const end=app.indexOf('\nfunction editShape()',start);
assert.ok(start>=0&&end>start,'CAD canvas source is present');
const source=app.slice(start,end);

function setup(){
 const listeners={};
 const svg={
  innerHTML:'',
  querySelectorAll:()=>[{getAttribute:name=>name==='data-shape'?'rect-1':null,
   addEventListener:(type,fn)=>{listeners[type]=fn}}]
 };
 const shapeList={innerHTML:''};
 const state={lab:[
   {id:'rect-1',type:'rect',x:0,y:0,w:120,h:70},
   {id:'circle-1',type:'circle',x:15,y:15,d:8}
 ]};
 const sandbox={
  document:{getElementById:id=>id==='drawingSvg'?svg:id==='shapeList'?shapeList:null},
  state,selected:null,fmt:n=>String(n),escapeHtml:v=>String(v),editShape:()=>{}
 };
 vm.createContext(sandbox);vm.runInContext(source,sandbox);
 return {sandbox,svg,shapeList,listeners};
}
test('SVG shapes have focusable keyboard semantics and meaningful measurements',()=>{
 const {sandbox,svg}=setup();sandbox.drawCanvas();
 assert.match(svg.innerHTML,/tabindex="0" role="button"/);
 assert.match(svg.innerHTML,/aria-label="Rectangle 1 at X 0, Y 0, width 120, height 70 millimeters"/);
 assert.match(svg.innerHTML,/aria-label="Circle 2 at X 15, Y 15, diameter 8 millimeters"/);
});
test('an accessible entity list enables selecting CAD geometry without mouse precision',()=>{
 const {sandbox,shapeList,listeners}=setup();sandbox.drawCanvas();
 assert.match(shapeList.innerHTML,/data-select-shape="rect-1"/);
 assert.match(shapeList.innerHTML,/data-select-shape="circle-1"/);
 assert.match(shapeList.innerHTML,/aria-pressed="false"/);
 listeners.click();assert.equal(sandbox.selected,'rect-1');
 assert.match(shapeList.innerHTML,/aria-pressed="true"/);
});
test('focused SVG shape supports Enter and Space without scrolling',()=>{
 const {sandbox,listeners}=setup();sandbox.drawCanvas();
 let prevented=false;
 listeners.keydown({key:'Enter',preventDefault:()=>{prevented=true}});
 assert.equal(prevented,true);assert.equal(sandbox.selected,'rect-1');
 sandbox.selected=null;prevented=false;
 listeners.keydown({key:' ',preventDefault:()=>{prevented=true}});
 assert.equal(prevented,true);assert.equal(sandbox.selected,'rect-1');
});
