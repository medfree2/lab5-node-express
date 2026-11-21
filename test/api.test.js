import { test, before, after } from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { createApp } from '../src/app.js';
import { Product } from '../src/models/product.model.js';
let server, base;
before(async () => {
  const doc = JSON.parse(await readFile(new URL('../src/docs/swagger-output.json', import.meta.url)));
  server = createApp(doc).listen(0, '127.0.0.1');
  await new Promise(resolve => server.once('listening', resolve));
  base = `http://127.0.0.1:${server.address().port}`;
});
after(() => new Promise(resolve => server.close(resolve)));
const request = async (path, method='GET', body) => {
  const response = await fetch(base+path, {method, headers: body===undefined?{}:{'Content-Type':'application/json'}, body:body===undefined?undefined:JSON.stringify(body)});
  return {status:response.status, body:response.status===204?null:await response.json(), location:response.headers.get('location')};
};
test('CRUD complet et PATCH conserve les autres champs', async () => {
  const list=await request('/api/products'); assert.equal(list.status,200); assert.equal(list.body.count,3);
  const p=await request('/api/products','POST',{name:' Écran ',price:199.99,stock:10,id:999});
  assert.equal(p.status,201); assert.equal(p.body.data.name,'Écran'); assert.equal(p.body.data.id,4); assert.equal(p.location,'/api/products/4');
  const one=await request('/api/products/4'); assert.deepEqual(one.body.data,p.body.data);
  const put=await request('/api/products/4','PUT',{name:'Écran Pro',price:250,stock:8}); assert.equal(put.status,200);
  const patch=await request('/api/products/4','PATCH',{stock:0,id:888}); assert.deepEqual(patch.body.data,{name:'Écran Pro',price:250,stock:0,id:4});
  const del=await request('/api/products/4','DELETE'); assert.equal(del.status,204); assert.equal(del.body,null);
  assert.equal((await request('/api/products/4')).status,404);
  const next=await request('/api/products','POST',{name:'Tapis',price:0,stock:0}); assert.equal(next.body.data.id,5);
});
test('ID invalide 400, ressource et route absentes 404', async () => {
  for(const id of ['1abc','0','-1','1.2','9007199254740992']) assert.equal((await request('/api/products/'+id)).status,400,id);
  assert.equal((await request('/api/products/999')).status,404);
  assert.equal((await request('/api/unknown')).status,404);
});
test('Validation POST, PUT et PATCH : aucune mutation invalide', async () => {
  for(const data of [{name:'',price:-1},{name:'Test',price:1,stock:1.5},{name:'Test',price:null,stock:1},[],{name:'Test',price:'Infinity',stock:1},{name:'Test',price:1,stock:-1}]) {
    assert.equal((await request('/api/products','POST',data)).status,400,JSON.stringify(data));
  }
  assert.equal((await request('/api/products/1','PUT',{stock:2})).status,400);
  assert.equal((await request('/api/products/1','PATCH',{stock:null})).status,400);
  assert.equal((await request('/api/products/1')).body.data.stock,15);
});
test('JSON mal formé produit une erreur JSON 400', async () => {
  const response=await fetch(base+'/api/products',{method:'POST',headers:{'Content-Type':'application/json'},body:'{"name":'});
  assert.equal(response.status,400); assert.equal((await response.json()).error.message,'JSON invalide');
});
test('Modèle : NaN, Infinity et stock non entier rejetés hors HTTP', () => {
  for(const args of [['',1,1],['Test',NaN,1],['Test',Infinity,1],['Test',1,1.1]]) assert.throws(()=>new Product(...args));
  assert.equal(new Product(' Test ',0,0).name,'Test');
});
test('OpenAPI et Swagger UI accessibles, six opérations documentées', async () => {
  const doc=await request('/api-docs.json'); assert.equal(doc.status,200); assert.equal(doc.body.openapi,'3.0.0');
  for(const [path,methods] of Object.entries({'/api/products':['get','post'],'/api/products/{id}':['get','put','patch','delete']})) {
    for(const method of methods) assert.ok(doc.body.paths[path]?.[method],`${method} ${path}`);
  }
  const response=await fetch(base+'/api-docs/'); assert.equal(response.status,200); assert.match(await response.text(),/swagger-ui/);
});
