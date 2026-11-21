import swaggerAutogen from 'swagger-autogen';
import { fileURLToPath } from 'node:url';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
const root = fileURLToPath(new URL('.', import.meta.url));
const fields = { name: { type: 'string', minLength: 1, example: 'Écran 24 pouces' }, price: { type: 'number', minimum: 0, example: 199.99 }, stock: { type: 'integer', minimum: 0, maximum: Number.MAX_SAFE_INTEGER, example: 10 } };
const document = {
  info: { title: 'API Produits — LAB 5', version: '1.0.0', description: 'API REST CRUD Node.js / Express — Mohammed Noureddine' },
  servers: [{ url: `http://localhost:${process.env.PORT || 3000}`, description: 'Serveur local' }],
  tags: [{ name: 'Products', description: 'Gestion des produits en mémoire' }],
  components: { schemas: {
    ProductInput: { type: 'object', required: ['name', 'price', 'stock'], properties: fields },
    ProductPatch: { type: 'object', properties: fields },
    Product: { allOf: [{ $ref: '#/components/schemas/ProductInput' }, { type: 'object', properties: { id: { type: 'integer', example: 1 } } }] }
  } }
};
const schemas = structuredClone(document.components.schemas);
await mkdir(new URL('./src/docs/', import.meta.url), { recursive: true });
const previous = process.cwd();
try {
  process.chdir(root);
  const result = await swaggerAutogen({ openapi: '3.0.0' })('./src/docs/swagger-output.json', ['./src/app.js'], document);
  if (!result.success) throw new Error('Échec de génération Swagger');
  // Normalisation des chemins et paramètres issus de swagger-autogen.
  const output = new URL('./src/docs/swagger-output.json', import.meta.url);
  const generated = JSON.parse(await readFile(output, 'utf8'));
  generated.components.schemas = schemas;
  if (generated.paths['/api/products/']) {
    generated.paths['/api/products'] = generated.paths['/api/products/'];
    delete generated.paths['/api/products/'];
  }
  for (const operation of Object.values(generated.paths['/api/products/{id}'] || {})) {
    for (const parameter of operation.parameters || []) {
      if (parameter.name === 'id') parameter.schema = { type: 'integer', minimum: 1 };
    }
  }
  await writeFile(output, JSON.stringify(generated, null, 2) + '\n');
} finally { process.chdir(previous); }
