import { Router } from 'express';
import { productController as controller } from '../controllers/product.controller.js';
import { validateId, validateProduct, validateProductPatch } from '../middlewares/validator.middleware.js';
const router = Router();
router.get('/', /*
#swagger.tags = ['Products']
#swagger.summary = 'Lister tous les produits'
#swagger.responses[200] = { description: 'Succès' }
*/ controller.getAll);
router.get('/:id', /*
#swagger.tags = ['Products']
#swagger.summary = 'Obtenir un produit par ID'
#swagger.responses[200] = { description: 'Succès' }
#swagger.parameters['id'] = { in: 'path', required: true, schema: { type: 'integer', minimum: 1 } }
#swagger.responses[404] = { description: 'Produit non trouvé' }
#swagger.responses[400] = { description: 'Données invalides' }
*/ validateId, controller.getById);
router.post('/', /*
#swagger.tags = ['Products']
#swagger.summary = 'Créer un produit'
#swagger.responses[201] = { description: 'Succès' }
#swagger.requestBody = { required: true, content: { 'application/json': { schema: { $ref: '#/components/schemas/ProductInput' } } } }
#swagger.responses[400] = { description: 'Données invalides' }
*/ validateProduct, controller.create);
router.put('/:id', /*
#swagger.tags = ['Products']
#swagger.summary = 'Remplacer un produit'
#swagger.responses[200] = { description: 'Succès' }
#swagger.parameters['id'] = { in: 'path', required: true, schema: { type: 'integer', minimum: 1 } }
#swagger.responses[404] = { description: 'Produit non trouvé' }
#swagger.requestBody = { required: true, content: { 'application/json': { schema: { $ref: '#/components/schemas/ProductInput' } } } }
#swagger.responses[400] = { description: 'Données invalides' }
*/ validateId, validateProduct, controller.update);
router.patch('/:id', /*
#swagger.tags = ['Products']
#swagger.summary = 'Modifier partiellement un produit'
#swagger.responses[200] = { description: 'Succès' }
#swagger.parameters['id'] = { in: 'path', required: true, schema: { type: 'integer', minimum: 1 } }
#swagger.responses[404] = { description: 'Produit non trouvé' }
#swagger.requestBody = { required: true, content: { 'application/json': { schema: { $ref: '#/components/schemas/ProductPatch' } } } }
#swagger.responses[400] = { description: 'Données invalides' }
*/ validateId, validateProductPatch, controller.patch);
router.delete('/:id', /*
#swagger.tags = ['Products']
#swagger.summary = 'Supprimer un produit'
#swagger.responses[204] = { description: 'Succès' }
#swagger.parameters['id'] = { in: 'path', required: true, schema: { type: 'integer', minimum: 1 } }
#swagger.responses[404] = { description: 'Produit non trouvé' }
#swagger.responses[400] = { description: 'Données invalides' }
*/ validateId, controller.remove);
export default router;
