import assert from 'node:assert/strict';
import { chromium } from 'playwright';

const base = process.env.CAD_SITE_URL || 'https://cad-to-career-a71f3b30.base44.app';
const browser = await chromium.launch({ headless:true, args:['--no-sandbox','--disable-dev-shm-usage'] });
let passed=0;
const check = async (name, run) => {
  try { await run(); passed++; console.log('PASS',name); }
  catch (error) { console.error('FAIL',name, error.message); throw error; }
};
try {
  const context = await browser.newContext({ viewport:{width:360,height:780}, isMobile:true, hasTouch:true, deviceScaleFactor:2, acceptDownloads:true });
  const page = await context.newPage();
  page.setDefaultTimeout(20000);
  await check('Anonymous Android-sized geometry lab loads without horizontal overflow', async ()=>{
    await page.goto(base+'/lab',{waitUntil:'domcontentloaded'});
    await page.getByRole('heading',{name:/Dimensioned rectangle/i}).waitFor({timeout:30000});
    await page.waitForTimeout(700);
    const widths = await page.evaluate(()=>({content:document.documentElement.scrollWidth,screen:document.documentElement.clientWidth}));
    console.log('MOBILE_WIDTHS',widths);
    assert.ok(widths.content<=widths.screen+2,'Unexpected horizontal overflow');
    assert.equal(await page.getByRole('button',{name:/Download SVG/i}).isDisabled(),true);
  });
  await check('Invalid geometry fails and valid geometry calculates correct numbers and downloads',async()=>{
    await page.locator('input[name="width"]').fill('-15');
    assert.equal(await page.getByRole('button',{name:/Download SVG/i}).isDisabled(),true);
    const valid={x:'10',y:'10',width:'120',height:'80',cx:'200',cy:'70',radius:'30'};
    for(const [field,value] of Object.entries(valid)) await page.locator('input[name="'+field+'"]').fill(value);
    await page.waitForFunction(()=>document.body.textContent.includes('13/13 checks'));
    const data=await page.locator('dd').allTextContents();
    assert.ok(data.some(x=>x.includes('9600.00')),'Missing rectangle area');
    assert.ok(data.some(x=>x.includes('2827.43')),'Missing circle area');
    assert.equal(await page.getByRole('button',{name:/Download SVG/i}).isEnabled(),true);
    const [download]=await Promise.all([page.waitForEvent('download'),page.getByRole('button',{name:/Download SVG/i}).click()]);
    assert.match(download.suggestedFilename(),/geometry-lab\.svg$/);
    await page.locator('input[name="width"]').fill('120.5');
    assert.equal(await page.getByRole('button',{name:/Download SVG/i}).isDisabled(),true);
  });
  await check('Anonymous workspace and owner pages do not reveal private controls',async()=>{
    await page.goto(base+'/workspace');
    await page.getByRole('heading',{name:/Sign in to save/i}).waitFor({timeout:30000});
    await page.goto(base+'/owner');
    await page.getByRole('heading',{name:/Administrator sign-in required/i}).waitFor();
    assert.equal(await page.getByRole('button',{name:/Issue certificate/i}).count(),0);
  });
  await check('Sign-in and registration screens are accessible without prior account',async()=>{
    await page.goto(base+'/login');
    await page.getByRole('heading',{name:/Welcome back/i}).waitFor({timeout:30000});
    await page.goto(base+'/register');
    await page.getByRole('heading',{name:/Create your account/i}).waitFor({timeout:30000});
  });
  const desktop=await browser.newPage({viewport:{width:1280,height:800}});
  await check('Desktop navigation and project gallery load',async()=>{
    await desktop.goto(base+'/projects');
    await desktop.getByRole('heading').first().waitFor({timeout:30000});
    assert.ok((await desktop.locator('a[href="/lab"]').count())>0);
    const overflow=await desktop.evaluate(()=>document.documentElement.scrollWidth>document.documentElement.clientWidth+2);
    assert.equal(overflow,false);
  });
  console.log('SUMMARY',passed,'of 5 smoke groups passed');
} finally {await browser.close();}
