const assert=require("node:assert/strict");
const fs=require("node:fs");
const vm=require("node:vm");
const source=fs.readFileSync("data.js","utf8");
const sandbox={window:{}};
vm.runInNewContext(source,sandbox,{timeout:2000});
const d=sandbox.window.CAD_CONTENT;
assert.equal(d.lessons.length,20,"20 lessons required");
assert.equal(d.projects.length,5,"5 projects required");
assert.equal(new Set(d.lessons.map(l=>l.slug)).size,20,"lesson URLs unique");
assert.equal(d.lessons.reduce((sum,l)=>sum+l.quiz.length,0),60,"60 assessment items");
for(const lesson of d.lessons){
 assert.ok(lesson.body.length>=100,"explanations required: "+lesson.id);
 assert.ok(lesson.practice.length>=30,"exercise required: "+lesson.id);
 for(const q of lesson.quiz){
  assert.equal(q.options.length,3);
  assert.ok(["A","B","C"].includes(q.answer),"correct answer required");
  assert.ok(q.options.every(opt=>typeof opt==="string" && opt.trim().length>0),"nonempty quiz options");
 }
}
for(const p of d.projects){assert.ok(p.brief.length>80);assert.ok(p.evidence.length>30)}
for(const file of ["app.js","data.js"]){new Function(fs.readFileSync(file,"utf8"))}
const html=fs.readFileSync("index.html","utf8");
assert.ok(html.includes("data.js")&&html.includes("app.js")&&html.includes("styles.css"));
const app=fs.readFileSync("app.js","utf8");
assert.ok(app.includes("gradeProject1(")&&app.includes("source:\"local-draft-only\""));
assert.ok(app.includes("Credential not yet earned"),"No unverified certificate issuance");
assert.ok(app.includes("lab:[]"),"No pre-earned geometry");
console.log("PASS: curriculum, project briefs, entrypoint, JavaScript syntax, integrity checks");
