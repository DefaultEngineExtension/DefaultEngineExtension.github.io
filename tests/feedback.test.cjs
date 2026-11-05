const test=require('node:test');
const assert=require('node:assert/strict');
const vm=require('node:vm');
const fs=require('node:fs');
const path=require('node:path');
const html=fs.readFileSync(path.join(__dirname,'../feedback/index.html'),'utf8');
const script=fs.readFileSync(path.join(__dirname,'../feedback/feedback.js'),'utf8');
function setup(fetch){
 const el=()=>({textContent:'',dataset:{},hidden:false,disabled:false,focus(){this.focused=true},addEventListener(k,fn){this[k]=fn}});
 const nodes=Object.fromEntries(['language','feedback-form','submit','status','thanks'].map(k=>[k,el()]));
 nodes.thanks.hidden=true;
 const translated=[...html.matchAll(/data-i18n="([^"]+)"[^>]*>([^<]*)</g)].map(m=>({...el(),dataset:{i18n:m[1]},textContent:m[2]}));
 const values={reason:'other',message:'My feedback',website:''};
 let prevented=0;
 vm.runInNewContext(script,{document:{documentElement:{},querySelectorAll:()=>translated,getElementById:k=>nodes[k]},location:{search:'?version=0.1.2&lang=en-GB'},navigator:{language:'en'},localStorage:{getItem(){},setItem(){}},URLSearchParams,AbortSignal,FormData:class{get(k){return values[k]}},fetch});
 return {nodes,values,submit:()=>nodes['feedback-form'].submit({preventDefault(){prevented++}}),prevented:()=>prevented};
}
test('no external form action; success stays in the custom page',async()=>{
 assert(!html.includes('action="https://docs.google.com'));
 const t=setup(async(url,opts)=>{
  assert(url.endsWith('/feedback'));assert.equal(JSON.parse(opts.body).version,'0.1.2');
  return new Response(JSON.stringify({ok:true}));
 });
 await t.submit();assert.equal(t.prevented(),1);assert(t.nodes['feedback-form'].hidden);assert(!t.nodes.thanks.hidden);assert(t.nodes.thanks.focused);
});
test('rejected requests and unconfirmed responses retain the form and show an error',async()=>{
 for(const response of [new Response('error',{status:502}),new Response('{}'),new Response('<html>Login</html>')]){
  const t=setup(async()=>response);await t.submit();assert(!t.nodes['feedback-form'].hidden);assert(t.nodes.thanks.hidden);assert(t.nodes.status.textContent.includes('Could not send'));assert.equal(t.values.message,'My feedback');assert(!t.nodes.submit.disabled);
 }
});
test('empty feedback never sends; repeated clicks while pending send only once',async()=>{
 let calls=0,finish;
 const t=setup(()=>{calls++;return new Promise(r=>finish=r)});
 t.values.reason='';t.values.message='';await t.submit();assert.equal(calls,0);
 t.values.message='Actual feedback';const pending=t.submit();await t.submit();assert.equal(calls,1);finish(new Response('{"ok":true}'));await pending;
});
