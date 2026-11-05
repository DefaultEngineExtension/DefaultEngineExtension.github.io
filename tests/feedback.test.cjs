const test=require('node:test');
const assert=require('node:assert/strict');
const vm=require('node:vm');
const fs=require('node:fs');
const path=require('node:path');
const html=fs.readFileSync(path.join(__dirname,'../feedback/index.html'),'utf8');
const script=fs.readFileSync(path.join(__dirname,'../feedback/feedback.js'),'utf8');
function setup(){
 const el=()=>({textContent:'',dataset:{},children:[],addEventListener(k,fn){this[k]=fn},appendChild(n){this.children.push(n)},remove(){this.removed=true}});
 const nodes=Object.fromEntries(['language','feedback-form','submit','status'].map(k=>[k,el()]));
 const translated=[...html.matchAll(/data-i18n="([^"]+)"[^>]*>([^<]*)</g)].map(m=>({...el(),dataset:{i18n:m[1]},textContent:m[2]}));
 const values={reason:'other',message:'My feedback',website:''};let prevented=0;const window={addEventListener(k,fn){this[k]=fn}};
 vm.runInNewContext(script,{document:{documentElement:{},querySelectorAll:()=>translated,getElementById:k=>nodes[k],createElement:el},window,location:{search:'?version=0.1.2&lang=en-GB'},navigator:{language:'en'},localStorage:{getItem(){},setItem(){}},URLSearchParams,FormData:class{get(k){return values[k]}}});
 return {nodes,values,window,submit:()=>nodes['feedback-form'].submit({preventDefault(){prevented++}}),prevented:()=>prevented};
}
test('uses only the new Set Default Search Engine form and its verified entry ID',()=>{
 assert(html.includes('action="https://docs.google.com/forms/d/e/1FAIpQLScqTc9bphTqdqbebBUf3nhUiXYUGx1yVJu7PQ_41gkM_9Xy6A/formResponse"'));
 assert(!html.includes('1FAIpQLSelwO0'));
 const t=setup();t.submit();assert.equal(t.prevented(),0);
 const field=t.nodes['feedback-form'].children[0];assert.equal(field.name,'entry.1145454522');
 assert(field.value.startsWith('[Set Default Search Engine]'));assert(field.value.includes('My feedback'));assert(field.value.includes('Extension version: 0.1.2'));
 t.window.pageshow();assert(field.removed);
});
test('empty feedback and honeypot do not submit',()=>{
 const t=setup();t.values.reason='';t.values.message='';t.submit();assert.equal(t.prevented(),1);assert.equal(t.nodes['feedback-form'].children.length,0);
 t.values.message='spam';t.values.website='bot';t.submit();assert.equal(t.prevented(),2);
});
