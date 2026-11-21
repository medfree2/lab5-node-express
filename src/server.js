import 'dotenv/config';
import { readFile } from 'node:fs/promises';
import { createApp } from './app.js';
await import('../swagger.js');
const doc = JSON.parse(await readFile(new URL('./docs/swagger-output.json', import.meta.url), 'utf8'));
const port = Number(process.env.PORT || 3000);
const server = createApp(doc).listen(port, () => console.log(`Serveur démarré sur le port ${port} — Swagger : http://localhost:${port}/api-docs/`));
server.on('error', error => { console.error(error.message); process.exitCode = 1; });
for (const signal of ['SIGINT', 'SIGTERM']) process.on(signal, () => server.close());
