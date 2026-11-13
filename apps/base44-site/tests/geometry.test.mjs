import test from 'node:test';
import assert from 'node:assert/strict';
import { assessGeometry, GEOMETRY_EXERCISE } from '../base44/shared/geometry.js';
import { evaluateRules, rulesPassed } from '../src/lib/validation.js';
import { projects } from '../src/content/projects.js';
import { coreSkills } from '../src/content/skills.js';

const valid = { units:'mm', x:10,y:10,width:120,height:80,cx:200,cy:70,radius:30 };
test('correct sketch passes and produces geometry-derived measurements', () => {
  const r=assessGeometry(valid);
  assert.equal(r.pass,true);
  assert.equal(r.derived.rectangleArea,9600);
  assert.equal(r.derived.rectanglePerimeter,400);
  assert.equal(Math.round(r.derived.circleArea),2827);
  assert.equal(r.derived.edgeGap,40);
  assert.equal(GEOMETRY_EXERCISE.tolerance,0.2);
});
test('empty input never passes',()=>{assert.equal(assessGeometry({}).pass,false);});
test('rejects nonnumeric injection, negative dimensions, wrong units',()=>{
  assert.equal(assessGeometry({...valid,width:'120mm'}).pass,false);
  assert.equal(assessGeometry({...valid,width:-120}).pass,false);
  assert.equal(assessGeometry({...valid,units:'in'}).pass,false);
});
test('rejects overlaps, out-of-sheet circles and incorrect targets',()=>{
  assert.equal(assessGeometry({...valid,cx:126,cy:70}).pass,false);
  assert.equal(assessGeometry({...valid,cx:310}).pass,false);
  assert.equal(assessGeometry({...valid,width:120.5}).pass,false);
});
test('accepts ±0.2mm boundary, rejects 0.21mm deviations',()=>{
  assert.equal(assessGeometry({...valid,width:120.2}).pass,true);
  assert.equal(assessGeometry({...valid,width:120.21}).pass,false);
});
test('self-reported project numeric fields cannot pass malformed numeric values',()=>{
  const p=projects[0];
  const base={file_name:'P1-bracket-test.pdf',sheet_scale:'1:2',views:3,thickness:6,hole_spacing:90,edge_distance:10,datum_scheme:'A single datum edge',tolerance_note:'±0.2',notes_block:true};
  assert.equal(rulesPassed(evaluateRules(p.rules,base)),true);
  assert.equal(rulesPassed(evaluateRules(p.rules,{...base,thickness:'6mm'})),false);
});
test('curriculum still has exactly five portfolio projects and twelve core skills',()=>{
  assert.equal(projects.length,5);
  assert.equal(coreSkills.length,12);
  assert.equal(new Set(projects.map(p=>p.slug)).size,5);
  assert.equal(new Set(coreSkills.map(s=>s.id)).size,12);
});
